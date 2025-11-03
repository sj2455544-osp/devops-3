from django.db import models

from accounts.models import User


class Community(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField()
    image = models.URLField(null=True, blank=True)
    category = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=False)
    members = models.ManyToManyField(User, related_name="communities", blank=True)

    def __str__(self):
        return self.name


class Thread(models.Model):
    community = models.ForeignKey(
        Community, on_delete=models.CASCADE, related_name="threads"
    )
    title = models.CharField(max_length=200)
    content = models.TextField(null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="threads")
    image = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class ThreadMessage(models.Model):
    thread = models.ForeignKey(
        Thread, on_delete=models.CASCADE, related_name="messages"
    )
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")
    content = models.TextField(null=True, blank=True)
    file = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Message by {self.author.username} in {self.thread.title}"
