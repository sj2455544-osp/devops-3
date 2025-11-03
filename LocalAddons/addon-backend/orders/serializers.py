from django.core.validators import RegexValidator
from rest_framework import serializers

from course.serializers import CourseOverviewSerializer

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product = CourseOverviewSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "product", "product_id", "quantity", "added_at", "updated_at"]
        read_only_fields = ["id", "added_at", "updated_at"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(source="cartitem_set", many=True, read_only=True)
    total_items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "user", "items", "total_items", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "created_at", "updated_at"]

    def get_total_items(self, obj):
        return obj.cartitem_set.count()


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()


class ProductItemSerializer(serializers.Serializer):
    product_category = serializers.CharField(
        required=True,
        help_text="Category of the product",
    )
    product_key = serializers.CharField(
        required=True,
        help_text="ID of the product being purchased",
    )
    product_name = serializers.CharField(
        required=True,
        help_text="Name of the product being purchased",
    )
    quantity = serializers.IntegerField(
        required=False,
        default=1,
        min_value=1,
        help_text="Quantity of the product being purchased",
    )
    unit_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=0,
        required=True,
        help_text="Price of the product being purchased",
    )


class PaymentInitiateInputSerializer(serializers.Serializer):
    user_id = serializers.CharField(
        required=False,
        help_text="ID of the user making the payment, optional if not logged in",
    )
    user_name = serializers.CharField(
        required=False,
        help_text="Name of the person making the payment",
    )
    address = serializers.CharField(
        required=False,
        help_text="Address of the person making the payment, optional",
    )
    phone = serializers.CharField(
        required=True,
        validators=[
            RegexValidator(
                regex=r"^(\+91|91)?[6-9]\d{9}$",
                message="Enter a valid phone number starting with 6-9 and 10 digits, with optional '+91' or '91' prefix.",
            )
        ],
        help_text="Phone number of the person making the payment",
    )
    email = serializers.EmailField(
        required=True,
        help_text="Email address of the person making the payment, optional",
    )
    currency = serializers.CharField(
        default="INR",
        help_text="Currency of the payment, default is INR",
    )
    payment_gateway = serializers.CharField(
        required=True,
        help_text="Payment gateway to be used for the transaction",
    )
    products = serializers.ListField(
        child=ProductItemSerializer(),
        required=True,
        help_text="List of product IDs being purchased",
    )
