"""AI summary schemas"""
from pydantic import BaseModel


class SummaryRequest(BaseModel):
    month: str


class SummaryResponse(BaseModel):
    organization: str
    month: str
    summary: str
    highlights: list[str]
