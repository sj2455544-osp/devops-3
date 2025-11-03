from rest_framework import serializers

from .models import (
    Course,
    CourseEnrollment,
    CourseLesson,
    CourseRating,
    CourseTechnology,
)


class CourseTechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseTechnology
        exclude = ["created_at", "updated_at"]


class CourseLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseLesson
        exclude = ["created_at", "updated_at"]


class CourseRatingSerializer(serializers.ModelSerializer):
    user_avatar = serializers.CharField(source="user.avatar", read_only=True)
    user_name = serializers.CharField(source="user.name", read_only=True)
    user_username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = CourseRating
        exclude = ["created_at", "updated_at", "course", "user"]


class CourseBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            "id",
            "slug",
            "title",
            "description",
            "thumbnail",
            "discounted_price",
            "icon",
            "level",
            "student_count",
            "avg_rating",
            "review_count",
            "open_for_enrollment",
            "duration",
            "original_price",
        ]


class CourseOverviewSerializer(serializers.ModelSerializer):
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        depth = 1
        fields = [
            "id",
            "slug",
            "title",
            "description",
            "technologies",
            "level",
            "thumbnail",
            "instructor",
            "duration",
            "original_price",
            "discounted_price",
            "student_count",
            "avg_rating",
            "review_count",
            "is_enrolled",
            "open_for_enrollment",
        ]

    def get_is_enrolled(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return CourseEnrollment.objects.filter(
                course=obj, user=request.user
            ).exists()
        return False


class CourseDetailSerializer(serializers.ModelSerializer):
    curriculum = CourseLessonSerializer(many=True, read_only=True)
    ratings = CourseRatingSerializer(many=True, read_only=True)
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        depth = 1
        model = Course
        fields = "__all__"

    def get_is_enrolled(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return CourseEnrollment.objects.filter(
                course=obj, user=request.user
            ).exists()
        return False


class ExploreTechnologySerializer(serializers.ModelSerializer):
    courses = CourseBaseSerializer(many=True, read_only=True, source="featured_courses")

    class Meta:
        model = CourseTechnology
        fields = ["id", "name", "slug", "sector", "description", "icon", "courses"]
