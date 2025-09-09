"""
Authentication URLs for accept-nextjs-django.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    ChangePasswordView,
    LoginView,
    LogoutView,
    PasswordResetRequestView,
    ProfileView,
    RegisterView,
    VerifyEmailView,
)

app_name = 'authentication'

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profile
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    
    # Password reset
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    
    # Email verification
    path('verify-email/<str:token>/', VerifyEmailView.as_view(), name='verify_email'),
]