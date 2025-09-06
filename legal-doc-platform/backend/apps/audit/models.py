"""
Audit logging models for legal document platform.
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.utils import timezone
import uuid
import json

User = get_user_model()


class AuditLog(models.Model):
    """Comprehensive audit logging for all system activities."""
    
    ACTION_CHOICES = [
        ('create', 'Create'),
        ('read', 'Read'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('share', 'Share'),
        ('download', 'Download'),
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('permission_grant', 'Permission Grant'),
        ('permission_revoke', 'Permission Revoke'),
        ('file_upload', 'File Upload'),
        ('file_delete', 'File Delete'),
        ('search', 'Search'),
        ('export', 'Export'),
        ('import', 'Import'),
    ]
    
    RESOURCE_TYPE_CHOICES = [
        ('document', 'Document'),
        ('case', 'Case'),
        ('client', 'Client'),
        ('user', 'User'),
        ('permission', 'Permission'),
        ('share', 'Share'),
        ('system', 'System'),
    ]
    
    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    resource_type = models.CharField(max_length=50, choices=RESOURCE_TYPE_CHOICES)
    resource_id = models.PositiveIntegerField(null=True, blank=True)
    resource_uuid = models.UUIDField(null=True, blank=True)
    
    # Generic foreign key for flexible resource referencing
    content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Additional details stored as JSON
    details = models.JSONField(default=dict, blank=True)
    
    # Request context
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    session_key = models.CharField(max_length=40, blank=True)
    
    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['action']),
            models.Index(fields=['resource_type', 'resource_id']),
            models.Index(fields=['created_at']),
            models.Index(fields=['ip_address']),
        ]
    
    def __str__(self):
        user_info = self.user.email if self.user else 'Anonymous'
        return f"{user_info} - {self.action} - {self.resource_type} - {self.created_at}"
    
    @classmethod
    def log_action(cls, user, action, resource_type, resource_id=None, resource_uuid=None, 
                   content_object=None, details=None, ip_address=None, user_agent=None, 
                   session_key=None):
        """Convenience method to log an action."""
        return cls.objects.create(
            user=user,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            resource_uuid=resource_uuid,
            content_object=content_object,
            details=details or {},
            ip_address=ip_address,
            user_agent=user_agent,
            session_key=session_key
        )
    
    @property
    def user_display(self):
        """Return user display name."""
        if self.user:
            return f"{self.user.first_name} {self.user.last_name} ({self.user.email})"
        return "Anonymous User"
    
    @property
    def resource_display(self):
        """Return resource display information."""
        if self.content_object:
            return str(self.content_object)
        elif self.resource_id:
            return f"{self.resource_type} #{self.resource_id}"
        return f"{self.resource_type}"


class SecurityEvent(models.Model):
    """Security-related events and incidents."""
    
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    EVENT_TYPE_CHOICES = [
        ('failed_login', 'Failed Login'),
        ('suspicious_activity', 'Suspicious Activity'),
        ('unauthorized_access', 'Unauthorized Access'),
        ('data_breach', 'Data Breach'),
        ('privilege_escalation', 'Privilege Escalation'),
        ('malware_detected', 'Malware Detected'),
        ('system_intrusion', 'System Intrusion'),
        ('data_exfiltration', 'Data Exfiltration'),
    ]
    
    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPE_CHOICES)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    description = models.TextField()
    
    # Related objects
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    # Event details
    details = models.JSONField(default=dict, blank=True)
    resolved = models.BooleanField(default=False)
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, 
                                   related_name='resolved_security_events')
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolution_notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['event_type']),
            models.Index(fields=['severity']),
            models.Index(fields=['resolved']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.event_type} - {self.severity} - {self.created_at}"
    
    def resolve(self, resolved_by, resolution_notes=""):
        """Mark the security event as resolved."""
        self.resolved = True
        self.resolved_by = resolved_by
        self.resolved_at = timezone.now()
        self.resolution_notes = resolution_notes
        self.save()


class ComplianceReport(models.Model):
    """Compliance reporting and audit trail reports."""
    
    REPORT_TYPE_CHOICES = [
        ('audit_trail', 'Audit Trail'),
        ('data_retention', 'Data Retention'),
        ('access_log', 'Access Log'),
        ('security_incidents', 'Security Incidents'),
        ('user_activity', 'User Activity'),
        ('document_usage', 'Document Usage'),
        ('compliance_summary', 'Compliance Summary'),
    ]
    
    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    report_type = models.CharField(max_length=50, choices=REPORT_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    # Report parameters
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    filters = models.JSONField(default=dict, blank=True)
    
    # Report data
    data = models.JSONField(default=dict, blank=True)
    file_path = models.CharField(max_length=500, blank=True)
    
    # Metadata
    generated_by = models.ForeignKey(User, on_delete=models.CASCADE)
    generated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-generated_at']
        indexes = [
            models.Index(fields=['report_type']),
            models.Index(fields=['generated_by']),
            models.Index(fields=['generated_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.generated_at}"


class DataRetentionPolicy(models.Model):
    """Data retention policies for compliance."""
    
    POLICY_TYPE_CHOICES = [
        ('document', 'Document'),
        ('audit_log', 'Audit Log'),
        ('user_data', 'User Data'),
        ('system_log', 'System Log'),
    ]
    
    name = models.CharField(max_length=255)
    policy_type = models.CharField(max_length=50, choices=POLICY_TYPE_CHOICES)
    description = models.TextField()
    
    # Retention rules
    retention_period_days = models.PositiveIntegerField()
    auto_delete = models.BooleanField(default=False)
    archive_before_delete = models.BooleanField(default=True)
    
    # Conditions
    conditions = models.JSONField(default=dict, blank=True)
    
    # Status
    active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['policy_type']),
            models.Index(fields=['active']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.policy_type})"
    
    def should_retain(self, obj, current_date=None):
        """Check if an object should be retained based on this policy."""
        if not self.active:
            return True
        
        if current_date is None:
            current_date = timezone.now().date()
        
        # Calculate retention date
        if hasattr(obj, 'created_at'):
            retention_date = obj.created_at.date() + timezone.timedelta(days=self.retention_period_days)
            return current_date <= retention_date
        
        return True


class AuditConfiguration(models.Model):
    """Configuration for audit logging behavior."""
    
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    
    # Audit settings
    enabled = models.BooleanField(default=True)
    log_level = models.CharField(max_length=20, choices=[
        ('minimal', 'Minimal'),
        ('standard', 'Standard'),
        ('detailed', 'Detailed'),
        ('comprehensive', 'Comprehensive'),
    ], default='standard')
    
    # Retention settings
    log_retention_days = models.PositiveIntegerField(default=2555)  # 7 years
    auto_archive = models.BooleanField(default=True)
    auto_delete = models.BooleanField(default=False)
    
    # Security settings
    encrypt_logs = models.BooleanField(default=True)
    require_authentication = models.BooleanField(default=True)
    
    # Configuration
    settings = models.JSONField(default=dict, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({'Enabled' if self.enabled else 'Disabled'})"
