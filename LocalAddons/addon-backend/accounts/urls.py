from django.urls import path

from .views import ChangePasswordView, LoginView, RegisterView, UserProfileView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("@me/", UserProfileView.as_view(), name="profile"),
    path("@me/change-password/", ChangePasswordView.as_view(), name="change-password"),
]
