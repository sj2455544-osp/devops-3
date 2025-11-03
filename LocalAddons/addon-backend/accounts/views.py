from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .captcha_services import Captcha
from .serializers import (
    ChangePasswordSerializer,
    LoginInpSerializer,
    RegisterInpSerializer,
    UserDetailSerializer,
    UserUpdateSerializer,
)
from .services import AuthService
from .utils import get_tokens_for_user


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = RegisterInpSerializer(data=request.data)
        if serializer.is_valid():
            # Captcha.verify_google_recaptcha(request.data.get("captcha_token", ""))
            user = AuthService.create_user(serializer.validated_data)
            token = get_tokens_for_user(user)
            resp_user = UserDetailSerializer(user)
            res = Response(
                {"user": resp_user.data, "token": token},
                status=status.HTTP_201_CREATED,
            )
            res.set_cookie(
                key="access_token",
                value=token["access_token"],
                httponly=True,
                samesite="Lax",
            )
            return res
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginInpSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get("email")
            mobile = serializer.validated_data.get("mobile")
            password = serializer.validated_data["password"]
            user = AuthService.get_user(email=email, mobile=mobile)
            if not user or not user.check_password(password):
                return Response(
                    {"detail": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            token = get_tokens_for_user(user)
            resp_user = UserDetailSerializer(user)
            res = Response(
                {
                    "user": resp_user.data,
                    "token": token,
                }
            )
            res.set_cookie(
                key="access_token",
                value=token["access_token"],
                httponly=True,
                samesite="Lax",
            )
            return res
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserDetailSerializer(user)
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        serializer = UserUpdateSerializer(
            data=request.data, partial=True, context={"request": request}
        )
        if serializer.is_valid():
            user = AuthService.update_user(user, serializer.validated_data)
            output_serializer = UserDetailSerializer(user)
            return Response(output_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            user = request.user
            new_password = serializer.validated_data["new_password"]
            AuthService.change_user_password(user, new_password)
            return Response(
                {"detail": "Password changed successfully"},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
