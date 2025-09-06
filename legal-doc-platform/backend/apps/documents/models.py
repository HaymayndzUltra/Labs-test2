"""
Document management models for legal document platform.
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import FileExtensionValidator
from django.utils import timezone
import uuid
import hashlib
import os

User = get_user_model()


class Document(models.Model):
    """Main document model for storing legal documents."""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('archived', 'Archived'),
        ('deleted', 'Deleted'),
    ]
    
    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=500)
    file_size = models.BigIntegerField()
    mime_type = models.CharField(max_length=100)
    file_hash = models.CharField(max_length=64)  # SHA-256 hash
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    case = models.ForeignKey('cases.Case', on_delete=models.CASCADE, null=True, blank=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_documents')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    version = models.IntegerField(default=1)
    
    # Security and compliance fields
    is_confidential = models.BooleanField(default=True)
    retention_date = models.DateField(null=True, blank=True)
    legal_hold = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['case']),
            models.Index(fields=['uploaded_by']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['file_hash']),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.file_name})"
    
    def save(self, *args, **kwargs):
        # Calculate file hash if not set
        if not self.file_hash and self.file_path:
            self.file_hash = self._calculate_file_hash()
        super().save(*args, **kwargs)
    
    def _calculate_file_hash(self):
        """Calculate SHA-256 hash of the file."""
        try:
            with open(self.file_path, 'rb') as f:
                file_hash = hashlib.sha256()
                for chunk in iter(lambda: f.read(4096), b""):
                    file_hash.update(chunk)
                return file_hash.hexdigest()
        except (OSError, IOError):
            return ""
    
    @property
    def file_size_display(self):
        """Return human-readable file size."""
        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"
    
    @property
    def is_accessible(self):
        """Check if document is accessible based on status."""
        return self.status in ['active', 'draft']


class DocumentVersion(models.Model):
    """Document version control model."""
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='versions')
    version_number = models.IntegerField()
    file_path = models.CharField(max_length=500)
    file_hash = models.CharField(max_length=64)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    change_summary = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-version_number']
        unique_together = ['document', 'version_number']
        indexes = [
            models.Index(fields=['document', 'version_number']),
        ]
    
    def __str__(self):
        return f"{self.document.title} v{self.version_number}"


class DocumentPermission(models.Model):
    """Document access permissions model."""
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='permissions')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    can_read = models.BooleanField(default=False)
    can_write = models.BooleanField(default=False)
    can_share = models.BooleanField(default=False)
    granted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='granted_permissions')
    granted_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ['document', 'user']
        indexes = [
            models.Index(fields=['document', 'user']),
            models.Index(fields=['user']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.document.title}"
    
    @property
    def is_expired(self):
        """Check if permission has expired."""
        if not self.expires_at:
            return False
        return timezone.now() > self.expires_at


class DocumentShare(models.Model):
    """Document sharing model for external access."""
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='shares')
    shared_with_email = models.EmailField()
    shared_by = models.ForeignKey(User, on_delete=models.CASCADE)
    share_token = models.UUIDField(default=uuid.uuid4, unique=True)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    access_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['share_token']),
            models.Index(fields=['shared_with_email']),
            models.Index(fields=['expires_at']),
        ]
    
    def __str__(self):
        return f"{self.document.title} shared with {self.shared_with_email}"
    
    @property
    def is_expired(self):
        """Check if share has expired."""
        return timezone.now() > self.expires_at
    
    def increment_access_count(self):
        """Increment access count for audit purposes."""
        self.access_count += 1
        self.save(update_fields=['access_count'])


class DocumentAccessLog(models.Model):
    """Document access logging for audit purposes."""
    
    ACTION_CHOICES = [
        ('view', 'View'),
        ('download', 'Download'),
        ('edit', 'Edit'),
        ('share', 'Share'),
        ('delete', 'Delete'),
    ]
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='access_logs')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['document', 'action']),
            models.Index(fields=['user']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.document.title} - {self.action} by {self.user.email if self.user else 'Anonymous'}"


class DocumentTag(models.Model):
    """Document tagging system."""
    
    name = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name


class DocumentTagAssignment(models.Model):
    """Many-to-many relationship between documents and tags."""
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='tag_assignments')
    tag = models.ForeignKey(DocumentTag, on_delete=models.CASCADE, related_name='document_assignments')
    assigned_by = models.ForeignKey(User, on_delete=models.CASCADE)
    assigned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['document', 'tag']
        indexes = [
            models.Index(fields=['document']),
            models.Index(fields=['tag']),
        ]
    
    def __str__(self):
        return f"{self.document.title} - {self.tag.name}"
