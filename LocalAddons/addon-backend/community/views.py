from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.auth import OptionalJWTAuthentication

from . import services
from .models import Community, Thread, ThreadMessage
from .permissions import IsAuthorOrReadOnly
from .serializers import *
from .serializers import (
    ThreadCreateSerializer,
    ThreadDetailSerializer,
    ThreadListSerializer,
    ThreadMessageCreateSerializer,
    ThreadMessageListSerializer,
)


class CommunityView(viewsets.ReadOnlyModelViewSet):
    queryset = services.get_published_communities()

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_authenticators(self):
        if "join" in self.request.path or "leave" in self.request.path:
            return super().get_authenticators()
        return [OptionalJWTAuthentication()]

    def get_serializer_class(self):
        if self.action == "list":
            return CommunityListSerializer
        return CommunityDetailSerializer

    def get_object(self):
        lookup_value = self.kwargs.get(self.lookup_field)
        return services.get_published_community_by_lookup(lookup_value)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def join(self, request, pk=None):
        community = self.get_object()
        if services.is_member(community, request.user):
            return Response(
                {"detail": "Already a member"}, status=status.HTTP_400_BAD_REQUEST
            )
        services.add_member(community, request.user)
        serializer = CommunityDetailSerializer(community)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def leave(self, request, pk=None):
        community = self.get_object()
        if not services.is_member(community, request.user):
            return Response(
                {"detail": "Not a member"}, status=status.HTTP_400_BAD_REQUEST
            )
        services.remove_member(community, request.user)
        serializer = CommunityDetailSerializer(community)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ThreadViewSet(viewsets.ModelViewSet):
    queryset = Thread.objects.filter(community__published=True)
    permission_classes = [
        permissions.IsAuthenticated,
        IsAuthorOrReadOnly,
    ]

    def get_queryset(self):
        queryset = super().get_queryset()
        community_pk = self.kwargs.get("community_pk")
        if community_pk:
            return services.list_threads_for_community(community_pk)
        return queryset.order_by("-created_at")

    def get_serializer_class(self):
        if self.action == "create":
            return ThreadCreateSerializer
        if self.action == "list":
            return ThreadListSerializer
        return ThreadDetailSerializer

    def perform_create(self, serializer):
        community_pk = self.kwargs.get("community_pk")
        community = services.get_published_community_by_pk(community_pk)
        serializer.save(author=self.request.user, community=community)


class ThreadMessageViewSet(viewsets.ModelViewSet):
    queryset = ThreadMessage.objects.filter(thread__community__published=True)
    permission_classes = [
        permissions.IsAuthenticated,
        IsAuthorOrReadOnly,
    ]

    def get_queryset(self):
        queryset = super().get_queryset()
        thread_pk = self.kwargs.get("thread_pk")
        if thread_pk:
            return services.list_messages_for_thread(thread_pk)
        return queryset.order_by("created_at")

    def get_serializer_class(self):
        if self.action == "create":
            return ThreadMessageCreateSerializer
        return ThreadMessageListSerializer

    def perform_create(self, serializer):
        thread_pk = self.kwargs.get("thread_pk")
        thread = services.get_published_thread_by_pk(thread_pk)
        serializer.save(author=self.request.user, thread=thread)
