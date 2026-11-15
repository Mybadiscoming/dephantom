
# Path: backend/app/services/source_ranker.py

import re
from urllib.parse import urlparse


HIGH_CREDIBILITY_DOMAINS = {
    "britannica.com",
    "archives.gov",
    "loc.gov",
    "science.org",
    "nature.com",
    "nasa.gov",
    "who.int",
    "un.org",
    "sciencemuseum.org.uk",
    "esa.int",
    "noaa.gov",
    "usgs.gov",
    "iau.org",
    "royalsocietypublishing.org",
}

SECONDARY_DOMAINS = {
    "bbc.com",
    "bbc.co.uk",
    "history.com",
    "theconversation.com",
    "historyextra.com",
    "historytoday.com",
    "historyfacts.com",
    "historynet.com",
    "sciencefocus.com",
    "snopes.com",
    "skyatnightmagazine.com",
    "scientificamerican.com",
    "livescience.com",
}

LOW_CONFIDENCE_DOMAINS = {
    "grokipedia.com",
}

STOP_WORDS = {
    "the", "and", "for", "are", "was", "were",
    "is", "does", "do", "did", "around", "with",
    "from", "that", "this", "what", "which",
    "how", "why", "can", "could", "would",
    "should", "has", "have", "had", "its",
    "a", "an", "of", "to", "in", "on", "by",
    "as", "it", "be", "or", "at"
}


# Normalize related scientific terms into shared concepts.
WORD_GROUPS = {
    "motion": {
        "move", "moves", "moving", "moved",
        "revolve", "revolves", "revolving",
        "revolved", "orbit", "orbits", "orbiting",
        "revolution", "revolutions"
    },
    "earth": {
        "earth", "terrestrial"
    },
    "sun": {
        "sun", "solar"
    },
    "moon": {
        "moon", "lunar"
    },
    "heliocentric": {
        "heliocentric", "heliocentrism"
    },
    "geocentric": {
        "geocentric", "geocentrism"
    },
    "copernicus": {
        "copernicus", "copernican"
    },
    "planet": {
        "planet", "planets", "planetary"
    },
}


def get_domain(url: str) -> str:
    if not isinstance(url, str) or not url.strip():
        return ""

    try:
        parsed = urlparse(url.strip())

        if parsed.scheme not in {"http", "https"}:
            return ""

        domain = parsed.hostname

        if not domain:
            return ""

        return domain.lower().removeprefix("www.")

    except ValueError:
        return ""


def domain_matches(
    domain: str,
    trusted_domain: str
) -> bool:
    return (
        domain == trusted_domain
        or domain.endswith("." + trusted_domain)
    )


def rank_source(url: str) -> dict:
    domain = get_domain(url)

    if not domain:
        return {
            "domain": "",
            "credibility": "unknown",
            "score": 0.0,
            "reason": "Invalid or missing source URL."
        }

    if any(
        domain_matches(domain, trusted)
        for trusted in HIGH_CREDIBILITY_DOMAINS
    ):
        return {
            "domain": domain,
            "credibility": "high",
            "score": 0.9,
            "reason": (
                "Recognized scientific, government or reference "
                "publisher. Individual article content still "
                "requires verification."
            )
        }

    if domain.endswith(".gov"):
        return {
            "domain": domain,
            "credibility": "high",
            "score": 0.9,
            "reason": (
                "Government domain. Individual article content "
                "still requires evaluation."
            )
        }

    if any(
        domain_matches(domain, trusted)
        for trusted in SECONDARY_DOMAINS
    ):
        return {
            "domain": domain,
            "credibility": "secondary",
            "score": 0.7,
            "reason": (
                "Recognized media, specialist or fact-checking "
                "publisher. Individual article content still "
                "requires verification."
            )
        }

    if any(
        domain_matches(domain, trusted)
        for trusted in LOW_CONFIDENCE_DOMAINS
    ):
        return {
            "domain": domain,
            "credibility": "low_confidence",
            "score": 0.2,
            "reason": (
                "Source requires additional independent corroboration."
            )
        }

    return {
        "domain": domain,
        "credibility": "unclassified",
        "score": 0.4,
        "reason": (
            "Domain is not present in the current source registry. "
            "Credibility has not yet been established."
        )
    }


def normalize_word(word: str) -> str:
    """Map related word forms to a common term."""

    for base, variations in WORD_GROUPS.items():
        if word in variations:
            return base

    # Basic suffix normalization for other words.
    if len(word) > 5 and word.endswith("ing"):
        return word[:-3]

    if len(word) > 4 and word.endswith("ed"):
        return word[:-2]

    if len(word) > 4 and word.endswith("es"):
        return word[:-2]

    if len(word) > 3 and word.endswith("s"):
        return word[:-1]

    return word


def tokenize(text: str) -> set:
    words = re.findall(
        r"\b[a-zA-Z]{3,}\b",
        text.lower()
    )

    return {
        normalize_word(word)
        for word in words
        if word not in STOP_WORDS
    }


def calculate_relevance(
    claim: str,
    title: str,
    snippet: str
) -> float:
    """
    Calculate preliminary lexical relevance.

    Title matches receive additional weight.
    Related scientific word forms are normalized.

    This is not semantic verification.
    """

    claim_words = tokenize(claim)

    title_words = tokenize(title)
    snippet_words = tokenize(snippet)

    if not claim_words:
        return 0.0

    title_overlap = len(
        claim_words.intersection(title_words)
    )

    snippet_overlap = len(
        claim_words.intersection(snippet_words)
    )

    title_score = title_overlap / len(claim_words)
    snippet_score = snippet_overlap / len(claim_words)

    # Combine title and snippet relevance.
    score = (
        title_score * 0.35
        + snippet_score * 0.65
    )

    # Recognize relevant Earth-Sun motion evidence.
    combined_words = title_words.union(snippet_words)

    if (
        "earth" in claim_words
        and "sun" in claim_words
        and "earth" in combined_words
        and "sun" in combined_words
        and "motion" in claim_words
        and (
            "motion" in combined_words
            or "heliocentric" in combined_words
        )
    ):
        score = max(score, 0.65)

    return round(min(score, 1.0), 4)


def rank_evidence(
    evidence: list[dict],
    claim: str = ""
) -> list[dict]:

    if not isinstance(evidence, list):
        return []

    ranked = []

    for item in evidence:

        if not isinstance(item, dict):
            continue

        source_info = rank_source(
            item.get("url", "")
        )

        relevance = calculate_relevance(
            claim,
            item.get("title", ""),
            item.get("snippet", "")
        )

        ranked.append({
            **item,
            "source_quality": source_info,
            "relevance_score": relevance
        })

    return sorted(
        ranked,
        key=lambda item: (
            item["source_quality"]["score"],
            item["relevance_score"]
        ),
        reverse=True
    )
