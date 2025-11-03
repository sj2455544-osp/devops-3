from typing import Any, Dict

import requests as rq

from backend.config import GOOGLE_RECAPTCHA_SECRET_KEY, HCAPTCHA_SECRET_KEY


class Captcha:
    @staticmethod
    def verify_hcaptcha(captcha_user_token: str) -> bool:
        captcha_res: Dict[str, Any] = rq.post(
            "https://hcaptcha.com/siteverify",
            data={
                "secret": HCAPTCHA_SECRET_KEY,
                "response": captcha_user_token,
            },
        ).json()
        is_success = captcha_res.get("success", False)
        if not is_success:
            raise ValueError("Captcha verification failed")
        return is_success

    @staticmethod
    def verify_google_recaptcha(captcha_user_token: str) -> bool:
        captcha_res = rq.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data={
                "secret": GOOGLE_RECAPTCHA_SECRET_KEY,
                "response": captcha_user_token,
            },
        ).json()
        is_success = captcha_res.get("success", False)
        if not is_success:
            raise ValueError("Google reCAPTCHA verification failed")
        return is_success
