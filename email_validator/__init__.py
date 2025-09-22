"""Lightweight email validation stub for environments without the email-validator package."""
from dataclasses import dataclass


class EmailNotValidError(ValueError):
    """Exception raised when an email address is invalid."""


@dataclass
class ValidatedEmail:
    email: str
    normalized: str
    local_part: str


def validate_email(email: str, **_: object) -> ValidatedEmail:
    if not isinstance(email, str) or "@" not in email:
        raise EmailNotValidError("Invalid email address")
    normalized = email.strip()
    if not normalized or "@" not in normalized:
        raise EmailNotValidError("Invalid email address")
    local_part = normalized.split("@", 1)[0]
    if not local_part:
        raise EmailNotValidError("Invalid email address")
    return ValidatedEmail(email=normalized, normalized=normalized, local_part=local_part)
