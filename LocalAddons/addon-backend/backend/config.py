import os

from dotenv import load_dotenv

load_dotenv()

DEBUG = os.getenv("DEBUG", "True") == "True"
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://127.0.0.1:3000")
BACKEND_URL = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "cimage_addon")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "CimagE1122")

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")

ICICI_MERCHANT_ID = os.getenv("ICICI_MERCHANT_ID", "")
ICICI_SUB_MERCHANT_ID = os.getenv("ICICI_SUB_MERCHANT_ID", "")
ICICI_AES_KEY = os.getenv("ICICI_AES_KEY", "")

HCAPTCHA_SECRET_KEY = os.getenv("H_CAPTCHA_SECRET_KEY", "")
GOOGLE_RECAPTCHA_SECRET_KEY = os.getenv("GOOGLE_RECAPTCHA_SECRET_KEY", "")
