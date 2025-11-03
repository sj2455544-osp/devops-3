import hashlib
import secrets
import string
from typing import Union
from urllib.parse import unquote_plus

from django.db.models import Q
from rest_framework.request import Request

from accounts.models import User
from backend.config import (
    BACKEND_URL,
    FRONTEND_URL,
    ICICI_AES_KEY,
    ICICI_MERCHANT_ID,
    ICICI_SUB_MERCHANT_ID,
)
from backend.utils import AESCrypto

from .models import Cart, CartItem, OrderTable


class CartService:
    @staticmethod
    def get_or_create_cart(user):
        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            cart = Cart.objects.create(user=user)
        return cart

    @staticmethod
    def add_item_to_cart(cart, product):
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.save()
        return cart_item

    @staticmethod
    def remove_item_from_cart(cart, product):
        try:
            cart_item = CartItem.objects.get(cart=cart, product=product)
            cart_item.delete()
            return True
        except CartItem.DoesNotExist:
            return False

    @staticmethod
    def update_cart_item_quantity(cart, product, quantity):
        try:
            cart_item = CartItem.objects.get(cart=cart, product=product)
            if quantity <= 0:
                cart_item.delete()
                return None
            cart_item.quantity = quantity
            cart_item.save()
            return cart_item
        except CartItem.DoesNotExist:
            if quantity > 0:
                return CartItem.objects.create(
                    cart=cart, product=product, quantity=quantity
                )
            return None

    @staticmethod
    def get_cart_items(cart):
        return CartItem.objects.filter(cart=cart).select_related("product")

    @staticmethod
    def clear_cart(cart):
        CartItem.objects.filter(cart=cart).delete()


class PaymentService:
    @staticmethod
    def generate_unique_order_id(user: Union[User, None] = None) -> str:
        while True:
            characters = string.ascii_letters + string.digits
            order_id = "ord_" + "".join(secrets.choice(characters) for _ in range(10))
            if not OrderTable.objects.filter(gateway_order_id=order_id).exists():
                return order_id

    @staticmethod
    def create_order(
        user: User,
        products: list,
        is_cart_payment: bool = False,
    ) -> dict:
        order_id = PaymentService.generate_unique_order_id()
        products_price = 0
        for product in products:
            products_price += product["unit_price"]
        order = OrderTable.objects.create(
            user=user,
            gateway_order_id=order_id,
            ordered_products={
                "products": products,
                "is_cart_payment": is_cart_payment,
            },
            payment_gateway="icici",
            amount=products_price,
        )
        aes = AESCrypto(ICICI_AES_KEY)

        mandatory_fields = aes.encrypt_using_aes(
            f"{order_id}|{ICICI_SUB_MERCHANT_ID}|{products_price}"
        )
        optional_fields = aes.encrypt_using_aes("UPIVPA")
        return_url = aes.encrypt_using_aes(f"{BACKEND_URL}/api/v1/payments/verify/")
        reference_no = aes.encrypt_using_aes(order_id)
        sub_merchant_id = aes.encrypt_using_aes(ICICI_SUB_MERCHANT_ID)
        transaction_amount = aes.encrypt_using_aes(str(products_price))
        payment_mode = aes.encrypt_using_aes("9")
        payment_url = (
            f"https://eazypay.icicibank.com/EazyPG?"
            f"merchantid={ICICI_MERCHANT_ID}&"
            f"mandatory fields={mandatory_fields}&"
            f"optional fields={optional_fields}&"
            f"returnurl={return_url}&"
            f"Reference No={reference_no}&"
            f"submerchantid={sub_merchant_id}&"
            f"transaction amount={transaction_amount}&"
            f"paymode={payment_mode}"
        )

        return {"payment_url": payment_url, "reference_id": order_id}

    @staticmethod
    def verify_payment(request: Request) -> dict:
        body_text = request.body.decode("utf-8") if hasattr(request, "body") else ""
        print("ICICI Payment Gateway Response:", body_text)
        body_text = body_text.replace("+", " ")
        parsed_data = {}
        for pair in body_text.split("&"):
            if "=" in pair:
                key, value = pair.split("=", 1)
                parsed_data[unquote_plus(key)] = unquote_plus(value)
        response_code = parsed_data.get("Response Code", "")
        mandatory_fields = parsed_data.get("mandatory fields", "")
        order_id = mandatory_fields.split("|")[0] if mandatory_fields else ""
        transaction_id = parsed_data.get("Unique Ref Number", "")
        payment_status = "COMPLETED" if response_code == "E000" else "FAILED"
        if not PaymentService.verify_signature(parsed_data):
            return {
                "status": "error",
                "message": "Invalid signature",
                "redirect_url": f"{FRONTEND_URL}/dashboard",
            }

        try:
            payment = OrderTable.objects.get(gateway_order_id=order_id)
            payment.payment_status = payment_status
            payment.gateway_payment_id = transaction_id
            payment.payment_metadata = parsed_data
            payment.save()
            return {
                "status": "VERIFIED",
                "user": payment.user,
                "payment_status": payment_status,
                "order_id": order_id,
                "transaction_id": transaction_id,
                "redirect_url": f"{FRONTEND_URL}/dashboard/enrolled-courses",
            }
        except Exception as e:
            return {
                "status": "error",
                "message": "Payment processing failed",
                "redirect_url": f"{FRONTEND_URL}/cart?error=failed",
            }

    @staticmethod
    def verify_signature(res: dict) -> bool:
        if res and res.get("Total Amount") and res.get("Response Code") == "E000":
            string_to_hash = "|".join(
                [
                    str(res.get("ID", "")),
                    str(res.get("Response Code", "")),
                    str(res.get("Unique Ref Number", "")),
                    str(res.get("Service Tax Amount", "")),
                    str(res.get("Processing Fee Amount", "")),
                    str(res.get("Total Amount", "")),
                    str(res.get("Transaction Amount", "")),
                    str(res.get("Transaction Date", "")),
                    str(res.get("Interchange Value", "")),
                    str(res.get("TDR", "")),
                    str(res.get("Payment Mode", "")),
                    str(res.get("SubMerchantId", "")),
                    str(res.get("ReferenceNo", "")),
                    str(res.get("TPS", "")),
                    ICICI_AES_KEY,
                ]
            )

            encrypted_message = hashlib.sha512(
                string_to_hash.encode("utf-8")
            ).hexdigest()
            return encrypted_message == res.get("RS", "")
        else:
            return False

    @staticmethod
    def get_payment_status(order_id: str) -> dict:
        payment = OrderTable.objects.get(
            Q(gateway_order_id=order_id) | Q(gateway_payment_id=order_id)
        )
        return {
            "payment_status": payment.payment_status.upper(),
            "gateway_order_id": payment.gateway_order_id,
            "payment_gateway": payment.payment_gateway,
        }
