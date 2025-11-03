from django.contrib import admin

from .models import Community, Thread, ThreadMessage


@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
    pass


@admin.register(Thread)
class ThreadAdmin(admin.ModelAdmin):
    pass


@admin.register(ThreadMessage)
class ThreadMessageAdmin(admin.ModelAdmin):
    pass
