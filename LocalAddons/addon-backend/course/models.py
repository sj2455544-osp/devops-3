from django.db import models

from accounts.models import User


class CourseInstructor(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField(null=True, blank=True)
    avatar_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    social_links = models.JSONField(null=True, blank=True)

    def __str__(self):
        return self.name


class CourseTechnology(models.Model):
    slug = models.SlugField()
    icon = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="Icon class name from react icons",
    )
    name = models.CharField(max_length=100, unique=True)
    sector = models.CharField(
        max_length=50, choices=[("IT", "IT"), ("Management", "Management")]
    )
    thumbnail = models.URLField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Course(models.Model):
    title = models.CharField(max_length=200, unique=True)
    description = models.TextField()
    slug = models.SlugField(max_length=200, unique=True)
    original_price = models.FloatField(null=True, blank=True)
    discounted_price = models.FloatField(default=0)
    language = models.CharField(max_length=50)
    technologies = models.ManyToManyField(CourseTechnology, related_name="courses")
    level = models.CharField(
        max_length=50,
        choices=[
            ("Beginner", "Beginner"),
            ("Intermediate", "Intermediate"),
            ("Advanced", "Advanced"),
        ],
    )
    icon = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="Icon class name from 'react-icons'",
    )
    thumbnail = models.URLField()
    video = models.URLField(null=True, blank=True)
    instructor = models.ForeignKey(CourseInstructor, on_delete=models.CASCADE)
    duration = models.CharField(help_text="Total duration in minutes", max_length=40)
    prerequisites = models.TextField(null=True, blank=True)
    objectives = models.TextField(null=True, blank=True)
    student_count = models.IntegerField(default=0)
    avg_rating = models.FloatField(default=0)
    review_count = models.IntegerField(default=0)
    published = models.BooleanField(default=False)
    open_for_enrollment = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class CourseLesson(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    highlights = models.TextField(null=True, blank=True)
    duration = models.IntegerField(
        help_text="Duration in minutes", null=True, blank=True
    )
    date = models.DateField(null=True, blank=True)
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="curriculum"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class CourseRating(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="ratings")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ratings")
    rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    review = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"Rating {self.rating} by {self.user.username} for {self.course.title}"


# This is seperate so that we could track enrollment data, like progress, completion, etc.
class CourseEnrollment(models.Model):
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="enrollments"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="enrollments")
    enrolled_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} enrolled in {self.course.title}"
