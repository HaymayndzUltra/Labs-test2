"""Utility providing a fallback EmailStr implementation when email-validator isn't available."""
from __future__ import annotations

from typing import Any

try:
    from pydantic import EmailStr as PydanticEmailStr
except Exception:  # pragma: no cover - fallback when import fails entirely
    PydanticEmailStr = None  # type: ignore


def _validate_basic_email(value: Any) -> str:
    if not isinstance(value, str):
        raise TypeError('Email address must be a string')
    if '@' not in value:
        raise ValueError('Invalid email address')
    local, _, domain = value.partition('@')
    if not local or not domain or '.' not in domain:
        raise ValueError('Invalid email address')
    return value


if PydanticEmailStr is not None:
    try:
        # Probe that the optional dependency is installed; this will raise if missing.
        PydanticEmailStr.validate_python('probe@example.com')  # type: ignore[attr-defined]
        EmailStr = PydanticEmailStr  # type: ignore[assignment]
    except Exception:  # pragma: no cover - executed when email-validator is missing
        PydanticEmailStr = None

if PydanticEmailStr is None:
    from pydantic_core import core_schema

    class EmailStr(str):  # type: ignore[override]
        """Minimal email string validator compatible with Pydantic v2."""

        @classmethod
        def __get_pydantic_core_schema__(cls, _source_type: Any, _handler: Any) -> core_schema.CoreSchema:
            return core_schema.no_info_plain_validator_function(_validate_basic_email)

        @classmethod
        def __get_pydantic_json_schema__(cls, core_schema: core_schema.CoreSchema, handler: Any) -> dict[str, Any]:
            schema = handler(core_schema)
            schema.update(type='string', format='email')
            return schema
else:  # pragma: no cover - reused when optional dependency available
    EmailStr = PydanticEmailStr  # type: ignore[assignment]
