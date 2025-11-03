from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import User, username_validator
from .services import AuthService


class RegisterInpSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150, validators=[username_validator])
    email = serializers.EmailField()
    mobile = serializers.CharField(max_length=10)
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    course = serializers.CharField(max_length=150, required=False, allow_null=True)
    year = serializers.CharField(max_length=4, required=False, allow_null=True)
    cnf_password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        if attrs["password"] != attrs["cnf_password"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        # Lowercase email
        if attrs.get("email"):
            attrs["email"] = attrs["email"].lower()

        # Check if user already exists
        email = attrs.get("email")
        mobile = attrs.get("mobile")
        username = attrs.get("username")
        if email and AuthService.get_user(email=email):
            raise serializers.ValidationError(
                {"email": "User with this email already exists."}
            )
        if mobile and AuthService.get_user(mobile=mobile):
            raise serializers.ValidationError(
                {"mobile": "User with this mobile already exists."}
            )
        if username and AuthService.get_user(username=username):
            raise serializers.ValidationError(
                {"username": "User with this username already exists."}
            )
        return attrs


class LoginInpSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    mobile = serializers.CharField(max_length=10, required=False)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        # Lowercase email
        if attrs.get("email"):
            attrs["email"] = attrs["email"].lower()

        email = attrs.get("email")
        mobile = attrs.get("mobile")

        if not email and not mobile:
            raise serializers.ValidationError(
                "Either email or mobile number must be provided."
            )
        return attrs


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = [
            "password",
            "is_active",
            "is_deleted",
            "email_verification_code",
            "mobile_verification_code",
        ]


class UserUpdateSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=150, required=False, validators=[username_validator]
    )
    name = serializers.CharField(max_length=150, required=False, allow_null=True)
    avatar = serializers.URLField(required=False, allow_null=True)
    bio = serializers.CharField(required=False, allow_null=True)

    def validate(self, attrs):
        username = attrs.get("username")
        if username:
            username = username.lower()
            current_user = self.context["request"].user
            if username != current_user.username.lower():
                existing_user = AuthService.get_user(username=username)
                if existing_user and existing_user.id != current_user.id:
                    raise serializers.ValidationError(
                        {"username": "User with this username already exists."}
                    )
                attrs["username"] = username
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    confirm_password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"new_password": "New password fields didn't match."}
            )
        return attrs
