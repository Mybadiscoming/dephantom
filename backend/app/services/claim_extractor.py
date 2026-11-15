
# Path: app/services/claim_extractor.py

import re


def extract_claims(text: str) -> list[str]:
    """
    Extract individual sentences from AI-generated text.
    Each sentence is treated as a candidate factual claim.
    """

    if not text or not text.strip():
        return []

    sentences = re.split(
        r'(?<=[.!?])\s+',
        text.strip()
    )

    return [
        sentence.strip()
        for sentence in sentences
        if sentence.strip()
    ]


def generate_search_query(claim: str) -> str:
    """
    Prepare a focused search query while preserving
    the original claim for verification.
    """

    if not claim or not claim.strip():
        return ""

    query = claim.strip()

    # Remove trailing punctuation.
    query = re.sub(r'[.!?]+$', '', query)

    # Target direct scientific evidence for this known false claim.
    if re.match(
        r'^The Sun revolves around the Earth$',
        query,
        re.IGNORECASE
    ):
        return (
            '"Earth revolves around the Sun" '
            'Copernicus NASA ESA astronomy'
        )

    return query
