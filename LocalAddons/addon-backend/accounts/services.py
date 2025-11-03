from django.db.models import Q

from .models import User


class AuthService:
    @staticmethod
    def get_user(email=None, mobile=None, user_id=None, username=None):
        if not email and not mobile and not user_id and not username:
            raise ValueError("Either email, mobile, user_id or username is required")

        filters = Q()
        if email:
            filters |= Q(email=email)
        if mobile:
            filters |= Q(mobile=mobile)
        if user_id:
            filters |= Q(id=user_id)
        if username:
            filters |= Q(username=username)

        return User.objects.filter(filters).first()

    @staticmethod
    def create_user(validated_data):
        """Create a new user with the provided data, ignoring fields not in User model."""
        user_fields = {f.name for f in User._meta.fields}
        filtered_data = {k: v for k, v in validated_data.items() if k in user_fields}
        filtered_data["username"] = filtered_data["username"].lower()
        user = User(**filtered_data)
        user.set_password(validated_data["password"])
        user.save()
        return user

    @staticmethod
    def update_user(user, validated_data):
        """Update the user with the provided data."""
        for attr, value in validated_data.items():
            setattr(user, attr, value)
        user.save()
        return user

    @staticmethod
    def change_user_password(user, new_password):
        """Change user's password."""
        user.set_password(new_password)
        user.save()
        return user
