from django.contrib.auth.models import AbstractBaseUser
from django.core.validators import RegexValidator
from django.db import models

username_validator = RegexValidator(
    regex=r"^[a-zA-Z0-9_.-]+$",
    message="Username can only contain letters, numbers, dots, hyphens, and underscores.",
    code="invalid_username",
)


class User(AbstractBaseUser):
    USERNAME_FIELD = "email"

    class UserType(models.TextChoices):
        ADMIN = "admin", "Admin"
        TEACHER = "teacher", "Teacher"
        STUDENT = "student", "Student"
        OUTSIDER = "outsider", "Outsider"

    avatar = models.URLField(null=True, blank=True)
    username = models.CharField(
        max_length=150, unique=True, validators=[username_validator]
    )
    name = models.CharField(max_length=150, null=True, blank=True)
    email = models.EmailField(unique=True)
    bio = models.TextField(null=True, blank=True)
    course = models.TextField(null=True, blank=True)
    year = models.CharField(max_length=4, null=True, blank=True)
    mobile = models.CharField(max_length=10, unique=True)
    email_verified = models.BooleanField(default=False)
    mobile_verified = models.BooleanField(default=False)
    email_verification_code = models.CharField(max_length=6, null=True, blank=True)
    mobile_verification_code = models.CharField(max_length=6, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    user_type = models.CharField(
        max_length=20,
        choices=UserType.choices,
        default=UserType.STUDENT,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email

    @property
    def is_cimage_student(self):
        return self.email.endswith("@cimage.in")
