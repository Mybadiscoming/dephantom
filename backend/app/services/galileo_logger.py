
# Path: backend/app/services/galileo_logger.py

import os
from dotenv import load_dotenv

from galileo import galileo_context, log

load_dotenv()

project = os.getenv("GALILEO_PROJECT")
log_stream = os.getenv("GALILEO_LOG_STREAM")

galileo_enabled = False

# Initialize Galileo without preventing backend startup.
try:
    if not os.getenv("GALILEO_API_KEY"):
        raise ValueError("GALILEO_API_KEY is missing from .env")

    if not project or not log_stream:
        raise ValueError("Galileo project or log stream is missing.")

    galileo_context.init(
        project=project,
        log_stream=log_stream
    )

    galileo_enabled = True
    print("Galileo initialized successfully.")

except Exception as error:
    galileo_enabled = False
    print(f"Galileo unavailable. Continuing without logging: {error}")


@log(span_type="tool")
def log_verification_summary(
    total_claims: int,
    total_evidence: int,
    total_hhem_checks: int
):
    if not galileo_enabled:
        return None

    return {
        "event": "dephantom_verification_completed",
        "total_claims": total_claims,
        "total_evidence": total_evidence,
        "total_hhem_checks": total_hhem_checks
    }


def flush_galileo():
    if not galileo_enabled:
        return

    try:
        galileo_context.flush()
    except Exception as error:
        print(f"Galileo flush failed: {error}")
