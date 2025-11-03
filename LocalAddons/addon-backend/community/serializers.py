from rest_framework import serializers

from .models import Community, Thread, ThreadMessage


class CommunityDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = "__all__"


class CommunityListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = [
            "id",
            "name",
            "description",
            "slug",
            "image",
            "category",
            "created_at",
        ]


class ThreadDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = "__all__"


class ThreadListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = [
            "id",
            "title",
            "content",
            "author",
            "image",
            "created_at",
        ]


class ThreadCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = [
            "community",
            "title",
            "content",
            "image",
        ]

    def validate_community(self, value):
        if not value.published:
            raise serializers.ValidationError("Cannot create threads in unpublished communities.")
        return value


class ThreadMessageListSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = ThreadMessage
        fields = [
            "id",
            "content",
            "file",
            "author",
            "author_name",
            "created_at",
        ]


class ThreadMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThreadMessage
        fields = [
            "thread",
            "content",
            "file",
        ]

    def validate_thread(self, value):
        if not value.community.published:
            raise serializers.ValidationError("Cannot send messages in threads of unpublished communities.")
        return value

