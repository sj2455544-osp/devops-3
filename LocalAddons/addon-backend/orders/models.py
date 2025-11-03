from django.db import models


# Create your models here.
class Cart(models.Model):
    user = models.OneToOneField("accounts.User", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart of {self.user.username}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey("course.Course", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.quantity} x {self.product.title} in cart of {self.cart.user.username}"


class OrderTable(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE)
    gateway_order_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Order ID for the payment, can be used to track the payment",
    )
    gateway_payment_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Payment ID for the transaction, can be used to verify the payment",
    )
    ordered_products = models.JSONField(
        blank=True,
        null=True,
        help_text="Metadata related to the products being purchased, e.g., product IDs, names or descriptions",
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    currency = models.CharField(
        max_length=10,
        default="INR",
        help_text="Currency of the payment, default is INR",
    )
    payment_gateway = models.CharField(
        max_length=50,
        help_text="Payment gateway used for the transaction",
    )
    payment_metadata = models.JSONField(
        blank=True,
        null=True,
        help_text="Metadata related to the payment, e.g., transaction ID, order ID",
    )
    payment_status = models.CharField(
        max_length=20,
        default="PENDING",
        choices=[
            ("PENDING", "Pending"),
            ("COMPLETED", "Completed"),
            ("FAILED", "Failed"),
        ],
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id}"
