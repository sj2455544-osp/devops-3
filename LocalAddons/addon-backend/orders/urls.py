from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import CartViewSet, PaymentVerifyView

router = DefaultRouter()
router.register(r"cart", CartViewSet, basename="cart")


urlpatterns = [
    *router.urls,
    path("payments/verify/", PaymentVerifyView.as_view(), name="payment-verify"),
]
