from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import CourseView, TechnologyView

router = DefaultRouter()
router.register(r"courses", CourseView, basename="course")
router.register(r"technologies", TechnologyView, basename="technology")

urlpatterns = router.urls
