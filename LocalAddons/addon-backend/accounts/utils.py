from rest_framework_simplejwt.tokens import AccessToken, RefreshToken


def get_tokens_for_user(user):
    access_token = AccessToken.for_user(user)
    access_token["user_id"] = user.id
    access_token["email"] = user.email
    access_token["username"] = user.username
    access_token["user_type"] = user.user_type
    return {
        "access_token": str(access_token),
    }
