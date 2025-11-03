from django.db.models import Prefetch, QuerySet
from django.shortcuts import get_object_or_404

from .models import Course, CourseEnrollment, CourseTechnology


class CourseService:
    @staticmethod
    def get_courses() -> QuerySet[Course]:
        return Course.objects.all()

    @staticmethod
    def get_published_courses() -> QuerySet[Course]:
        return Course.objects.filter(published=True).order_by("-created_at")

    @staticmethod
    def get_featured_courses() -> QuerySet[Course]:
        return Course.objects.filter(published=True, featured=True).order_by(
            "-created_at"
        )

    @staticmethod
    def filter_courses_by_technology(
        queryset: QuerySet[Course], technology_slug: str | None
    ) -> QuerySet[Course]:
        if technology_slug:
            return queryset.filter(technologies__slug=technology_slug)
        return queryset

    @staticmethod
    def get_published_course_by_lookup(lookup_value: str | int) -> Course:
        if str(lookup_value).isdigit():
            return get_object_or_404(Course, pk=lookup_value, published=True)
        return get_object_or_404(Course, slug=lookup_value, published=True)

    @staticmethod
    def enroll_user_in_course(user, course: Course) -> tuple[CourseEnrollment, bool]:
        return CourseEnrollment.objects.get_or_create(course=course, user=user)

    @staticmethod
    def get_user_enrolled_courses(user) -> list[Course]:
        enrollments = CourseEnrollment.objects.filter(user=user).select_related(
            "course"
        )
        return [enrollment.course for enrollment in enrollments]

    @staticmethod
    def get_course_technology_by_lookup(lookup_value: str | int) -> CourseTechnology:
        if str(lookup_value).isdigit():
            return get_object_or_404(CourseTechnology, pk=lookup_value)
        return get_object_or_404(CourseTechnology, slug=lookup_value)

    @staticmethod
    def get_all_technologies():
        featured_courses_qs = Course.objects.filter(featured=True)
        courses = CourseTechnology.objects.prefetch_related(
            Prefetch(
                "courses", queryset=featured_courses_qs, to_attr="featured_courses"
            )
        )
        return courses

    @staticmethod
    def filter_technology_by_sector(queryset, sector):
        if sector:
            return queryset.filter(sector=sector)
        return queryset
