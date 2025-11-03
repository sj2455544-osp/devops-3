from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet

from accounts.auth import OptionalJWTAuthentication
from course.models import Course, CourseEnrollment, CourseTechnology

from .serializers import (
    CourseDetailSerializer,
    CourseOverviewSerializer,
    CourseTechnologySerializer,
    ExploreTechnologySerializer,
)
from .services import CourseService


class CourseView(ReadOnlyModelViewSet):
    queryset = CourseService.get_published_courses()

    def get_permissions(self):
        if self.action in ["enroll", "enrolled_courses"]:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_authenticators(self):
        if "enroll" in self.request.path or "enrolled" in self.request.path:
            return super().get_authenticators()
        return [OptionalJWTAuthentication()]

    def get_serializer_class(self):
        if self.action in ["list", "explore"]:
            return CourseOverviewSerializer
        return CourseDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        technology = self.request.query_params.get("technology")
        return CourseService.filter_courses_by_technology(queryset, technology)

    def get_object(self):
        lookup_value = self.kwargs.get(self.lookup_field)
        return CourseService.get_published_course_by_lookup(lookup_value)

    @action(
        detail=False,
        methods=["get"],
        url_path="enrolled",
        url_name="enrolled-courses",
    )
    def enrolled_courses(self, request):
        user = request.user
        courses = CourseService.get_user_enrolled_courses(user)
        page = self.paginate_queryset(courses)
        if page is not None:
            serializer = CourseOverviewSerializer(
                page, many=True, context={"request": request}
            )
            return self.get_paginated_response(serializer.data)
        serializer = CourseOverviewSerializer(
            courses, many=True, context={"request": request}
        )
        return Response(serializer.data)


class TechnologyView(ReadOnlyModelViewSet):
    queryset = CourseTechnology.objects.all()
    serializer_class = CourseTechnologySerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = [OptionalJWTAuthentication]
    pagination_class = None

    def get_object(self):
        lookup_value = self.kwargs.get(self.lookup_field)
        return CourseService.get_course_technology_by_lookup(lookup_value)

    def get_queryset(self):
        queryset = super().get_queryset()
        technology = self.request.query_params.get("sector")
        return CourseService.filter_technology_by_sector(queryset, technology)

    @action(detail=False, methods=["get"], url_path="explore")
    def explore(self, request):
        technologies = CourseService.get_all_technologies()
        serializer = ExploreTechnologySerializer(technologies, many=True)
        return Response(serializer.data)
