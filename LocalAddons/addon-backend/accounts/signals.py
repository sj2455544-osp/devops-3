from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import User

# @receiver(pre_save, sender=User)
# def hash_user_password(sender, instance, **kwargs):
#     """
#     Automatically hash password on user creation or update.
#     """
#     if not instance.pk:
#         instance.set_password(instance.password)
#     else:
#         old_password = sender.objects.get(pk=instance.pk).password
#         if instance.password != old_password:
#             instance.set_password(instance.password)
