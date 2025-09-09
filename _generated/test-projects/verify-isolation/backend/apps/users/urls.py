"""
User URLs for verify-isolation.
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import UserSearchView, UserViewSet

app_name = 'users'

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    path('search/', UserSearchView.as_view(), name='user-search'),
    path('', include(router.urls)),
]