from django.urls import path

from .views import CommunityView, ThreadMessageViewSet, ThreadViewSet

urlpatterns = [
    path("", CommunityView.as_view({"get": "list"}), name="community-list"),
    path(
        "<int:pk>/", CommunityView.as_view({"get": "retrieve"}), name="community-detail"
    ),
    path(
        "<int:community_pk>/threads/",
        ThreadViewSet.as_view({"get": "list", "post": "create"}),
        name="community-threads",
    ),
    path(
        "<int:community_pk>/threads/<int:pk>/",
        ThreadViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
            }
        ),
        name="thread-detail",
    ),
    path(
        "<int:community_pk>/threads/<int:thread_pk>/messages/",
        ThreadMessageViewSet.as_view({"get": "list", "post": "create"}),
        name="thread-messages",
    ),
    path(
        "<int:community_pk>/threads/<int:thread_pk>/messages/<int:pk>/",
        ThreadMessageViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
            }
        ),
        name="message-detail",
    ),
]
