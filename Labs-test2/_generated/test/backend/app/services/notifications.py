"""Notification stub service"""
from __future__ import annotations

import logging
from typing import List

from app.schemas.msg import Msg

logger = logging.getLogger(__name__)


def send_email_stub(recipients: List[str], subject: str, body: str) -> Msg:
    """Log a notification attempt for audit purposes."""
    logger.info("[notifications] stub email -> recipients=%s subject=%s", recipients, subject)
    return Msg(msg="Email notification queued (stub)")
