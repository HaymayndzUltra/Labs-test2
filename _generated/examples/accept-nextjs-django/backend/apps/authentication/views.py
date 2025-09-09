"""
Authentication views for accept-nextjs-django.
"""

from django.contrib.auth import logout
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .serializers import (
    ChangePasswordSerializer,
    LoginSerializer,
    PasswordResetSerializer,
    RegisterSerializer,
    UserSerializer,
)


class RegisterView(generics.CreateAPIView):
    """User registration endpoint."""
    
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens for the new user
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    """Custom login view that uses our login serializer."""
    
    serializer_class = LoginSerializer
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            # Update last login
            user = User.objects.get(email=request.data.get('email'))
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
        return response


class LogoutView(APIView):
    """Logout view that blacklists the refresh token."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            # Django logout
            logout(request)
            
            return Response(
                {"detail": "Successfully logged out"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class ProfileView(generics.RetrieveUpdateAPIView):
    """User profile view for retrieving and updating own profile."""
    
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        # Update last activity
        request.user.last_activity = timezone.now()
        request.user.save(update_fields=['last_activity'])
        
        return super().update(request, *args, **kwargs)


class ChangePasswordView(generics.UpdateAPIView):
    """Change password endpoint."""
    
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(
            {"detail": "Password changed successfully"},
            status=status.HTTP_200_OK
        )


class PasswordResetRequestView(generics.GenericAPIView):
    """Request password reset endpoint."""
    
    serializer_class = PasswordResetSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # TODO: Implement email sending logic
        # For now, just return success
        
        return Response(
            {"detail": "Password reset email sent"},
            status=status.HTTP_200_OK
        )


class VerifyEmailView(APIView):
    """Email verification endpoint."""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, token):
        # TODO: Implement email verification logic
        return Response(
            {"detail": "Email verified successfully"},
            status=status.HTTP_200_OK
        )