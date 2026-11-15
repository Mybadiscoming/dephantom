
# Path: backend/app/core/config.py

import os
from pathlib import Path

# Backend directory
BASE_DIR = Path(__file__).resolve().parents[2]

# Environment configuration
APP_NAME = "DePhantom"
APP_VERSION = "1.0.0"
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

# API configuration
API_HOST = os.getenv("API_HOST", "127.0.0.1")
API_PORT = int(os.getenv("API_PORT", "8000"))

# Frontend configuration
FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000"
)

ALLOWED_ORIGINS = [
    FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Verification configuration
MAX_INPUT_LENGTH = int(
    os.getenv("MAX_INPUT_LENGTH", "10000")
)

HHEM_THRESHOLD = float(
    os.getenv("HHEM_THRESHOLD", "0.5")
)

# Search configuration
MAX_SEARCH_RESULTS = int(
    os.getenv("MAX_SEARCH_RESULTS", "5")
)

# Optional observability
GALILEO_ENABLED = (
    os.getenv("GALILEO_ENABLED", "false").lower() == "true"
)
