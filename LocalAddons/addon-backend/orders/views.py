from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from backend.config import FRONTEND_URL
from course.models import Course
from course.services import CourseService

from .serializers import AddToCartSerializer, CartSerializer
from .services import CartService, PaymentService


class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        cart = CartService.get_or_create_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def add(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data["product_id"]
        product = get_object_or_404(Course, id=product_id, published=True)

        cart = CartService.get_or_create_cart(request.user)
        CartService.add_item_to_cart(cart, product)

        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["delete"])
    def remove(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data["product_id"]
        product = get_object_or_404(Course, id=product_id)

        cart = CartService.get_or_create_cart(request.user)
        success = CartService.remove_item_from_cart(cart, product)

        if not success:
            return Response(
                {"detail": "Item not found in cart"},
                status=status.HTTP_404_NOT_FOUND,
            )

        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["delete"])
    def clear(self, request):
        cart = CartService.get_or_create_cart(request.user)
        CartService.clear_cart(cart)

        cart_serializer = CartSerializer(cart)
        return Response(
            {"detail": "Cart cleared successfully", "cart": cart_serializer.data},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["post"], url_path="checkout")
    def checkout(self, request):
        cart = CartService.get_or_create_cart(request.user)
        if not cart.cartitem_set.exists():
            return Response(
                {"detail": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        cart_items = CartService.get_cart_items(cart)
        products = [
            {
                "product_category": "course",
                "product_key": str(item.product.id),
                "product_name": item.product.title,
                "quantity": item.quantity,
                "unit_price": (
                    float(item.product.discounted_price)
                    if request.user.is_cimage_student
                    else float(
                        item.product.original_price or item.product.discounted_price
                    )
                ),
            }
            for item in cart_items
        ]
        response = PaymentService.create_order(request.user, products, True)
        return Response(
            response,
            status=status.HTTP_200_OK,
        )


class PaymentVerifyView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request: Request):
        return redirect(f"{FRONTEND_URL}/dashboard")

    def post(self, request: Request):
        response = PaymentService.verify_payment(request)
        if response.get("status") == "VERIFIED":
            user = response.get("user")
            cart = CartService.get_or_create_cart(user)
            for course in cart.cartitem_set.all():
                CourseService.enroll_user_in_course(user, course.product)
            CartService.clear_cart(cart)
        return redirect(response.get("redirect_url"))
