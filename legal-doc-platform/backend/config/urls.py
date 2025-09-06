"""
URL configuration for legal document management platform.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

# API router
router = DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/documents/', include('apps.documents.urls')),
    path('api/clients/', include('apps.clients.urls')),
    path('api/cases/', include('apps.cases.urls')),
    path('api/search/', include('apps.search.urls')),
    path('api/audit/', include('apps.audit.urls')),
    path('api/oauth/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path('api/accounts/', include('allauth.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
