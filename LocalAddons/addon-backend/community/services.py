from django.db.models import QuerySet
from django.shortcuts import get_object_or_404

from .models import Community, Thread, ThreadMessage


def get_published_communities() -> QuerySet[Community]:
    return Community.objects.filter(published=True)


def get_published_community_by_lookup(lookup_value: str | int) -> Community:
    if str(lookup_value).isdigit():
        return get_object_or_404(Community, pk=lookup_value, published=True)
    return get_object_or_404(Community, slug=lookup_value, published=True)


def is_member(community: Community, user) -> bool:
    return community.members.filter(id=getattr(user, "id", None)).exists()


def add_member(community: Community, user) -> None:
    community.members.add(user)


def remove_member(community: Community, user) -> None:
    community.members.remove(user)


def list_threads_for_community(community_id: int) -> QuerySet[Thread]:
    return Thread.objects.filter(
        community_id=community_id, community__published=True
    ).order_by("-created_at")


def get_published_community_by_pk(pk: int) -> Community:
    return get_object_or_404(Community, pk=pk, published=True)


def create_thread(*, author, community: Community, **validated_data) -> Thread:
    return Thread.objects.create(author=author, community=community, **validated_data)


def list_messages_for_thread(thread_id: int) -> QuerySet[ThreadMessage]:
    return ThreadMessage.objects.filter(
        thread_id=thread_id, thread__community__published=True
    ).order_by("created_at")


def get_published_thread_by_pk(pk: int) -> Thread:
    return get_object_or_404(Thread, pk=pk, community__published=True)


def create_message(*, author, thread: Thread, **validated_data) -> ThreadMessage:
    return ThreadMessage.objects.create(author=author, thread=thread, **validated_data)
