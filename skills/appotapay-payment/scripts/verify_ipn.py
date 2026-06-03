#!/usr/bin/env python3
"""Verify an AppotaPay IPN / redirect callback and decode the transaction.

Standard library only.

    from verify_ipn import verify_appotapay_callback
    ok, payload = verify_appotapay_callback({"data": data, "signature": signature}, SECRET_KEY)
"""
import base64
import hashlib
import hmac
import json
import os
import sys


def verify_appotapay_callback(body: dict, secret_key: str):
    """Return (ok: bool, payload: dict | None)."""
    data = body.get("data")
    signature = body.get("signature")
    if not isinstance(data, str) or not isinstance(signature, str):
        return False, None

    # Sign the RAW data string, exactly as received.
    expected = hmac.new(secret_key.encode(), data.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, signature):  # constant-time
        return False, None

    payload = json.loads(base64.b64decode(data).decode("utf-8"))
    return True, payload


# --- Example Flask IPN handler -----------------------------------------------
# from flask import Flask, request, jsonify
# app = Flask(__name__)
#
# @app.post("/ipn")
# def ipn():
#     ok, payload = verify_appotapay_callback(request.get_json(force=True), os.environ["APPOTAPAY_SECRET_KEY"])
#     if not ok:
#         return jsonify(status="invalid signature"), 400
#     t = payload["transaction"]
#     if t["status"] == "success" and int(t["orderAmount"]) == expected_amount(payload["partnerReference"]["order"]["id"]):
#         fulfill_once(payload["partnerReference"]["order"]["id"])  # idempotent!
#     return jsonify(status="ok"), 200  # always ack so retries stop


if __name__ == "__main__":
    body = json.load(sys.stdin)
    ok, payload = verify_appotapay_callback(body, os.environ["APPOTAPAY_SECRET_KEY"])
    print(json.dumps({"ok": ok, "payload": payload}, ensure_ascii=False, indent=2))
    sys.exit(0 if ok else 1)
