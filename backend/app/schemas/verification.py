# Path: app/schemas/verification.py

from pydantic import BaseModel


class VerificationRequest(BaseModel):
    text: str