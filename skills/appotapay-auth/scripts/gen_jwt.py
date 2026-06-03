#!/usr/bin/env python3
"""Generate an AppotaPay X-APPOTAPAY-AUTH JWT (HS256).

    pip install pyjwt
    APPOTAPAY_PARTNER_CODE=... APPOTAPAY_API_KEY=... APPOTAPAY_SECRET_KEY=... python gen_jwt.py
"""
import os
import time
import jwt  # PyJWT


def build_appotapay_jwt(partner_code: str, api_key: str, secret_key: str, ttl_seconds: int = 300) -> str:
    if not (partner_code and api_key and secret_key):
        raise ValueError("partner_code, api_key and secret_key are required")
    now = int(time.time())
    payload = {
        "iss": partner_code,
        "jti": f"{api_key}-{now}",
        "api_key": api_key,
        "exp": now + ttl_seconds,
    }
    return jwt.encode(
        payload,
        secret_key,
        algorithm="HS256",
        headers={"typ": "JWT", "cty": "appotapay-api;v=1"},
    )


if __name__ == "__main__":
    token = build_appotapay_jwt(
        os.environ["APPOTAPAY_PARTNER_CODE"],
        os.environ["APPOTAPAY_API_KEY"],
        os.environ["APPOTAPAY_SECRET_KEY"],
    )
    print(token)
