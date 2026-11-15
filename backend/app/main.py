
# Path: backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import (
    APP_NAME,
    APP_VERSION,
    ALLOWED_ORIGINS,
)
from app.routes.verification import router as verification_router


app = FastAPI(
    title=f"{APP_NAME} API",
    description="AI Hallucination Detection and Verification",
    version=APP_VERSION,
)

# Allow the Next.js frontend to communicate with FastAPI.
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register verification routes.
app.include_router(verification_router)


@app.get("/")
async def home():
    return {
        "message": f"Welcome to {APP_NAME}",
        "status": "Running",
        "version": APP_VERSION,
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "application": APP_NAME,
    }
