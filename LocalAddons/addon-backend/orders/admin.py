from django.contrib import admin

from .models import Cart, CartItem, OrderTable


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at", "updated_at")
    search_fields = ("user__username", "user__email")


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("id", "cart", "product", "quantity", "added_at", "updated_at")
    search_fields = ("cart__user__username", "product__title")


@admin.register(OrderTable)
class OrderTableAdmin(admin.ModelAdmin):
    search_fields = (
        "user__username",
        "user__email",
        "gateway_order_id",
        "gateway_payment_id",
    )
    list_display = ("id", "user", "amount", "payment_status", "created_at")
    list_filter = ("payment_status",)
