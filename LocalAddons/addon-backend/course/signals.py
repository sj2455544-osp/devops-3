from django.db import models
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import Course, CourseEnrollment, CourseRating


@receiver([post_save, post_delete], sender=CourseEnrollment)
def update_student_count(sender, instance, **kwargs):
    course = instance.course
    student_count = CourseEnrollment.objects.filter(course=course).count()
    course.student_count = student_count
    course.save(update_fields=["student_count"])


@receiver([post_save, post_delete], sender=CourseRating)
def update_course_rating(sender, instance, **kwargs):
    course = instance.course
    ratings = CourseRating.objects.filter(course=course)
    review_count = ratings.count()
    avg_rating = ratings.aggregate(models.Avg("rating"))["rating__avg"] or 0.0
    course.review_count = review_count
    course.avg_rating = avg_rating
    course.save(update_fields=["review_count", "avg_rating"])
