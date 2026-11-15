
# Path: backend/app/services/contradiction_detector.py

import re
import torch

from urllib.parse import urlparse
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification
)

from app.services.source_ranker import calculate_relevance


MODEL_ID = "cross-encoder/nli-deberta-v3-base"

CONTRADICTION_THRESHOLD = 0.90
ENTAILMENT_THRESHOLD = 0.90

MIN_SOURCE_CREDIBILITY = 0.70
MIN_RELEVANCE_SCORE = 0.50

MIN_CONTRADICTING_SOURCES = 2
MIN_SUPPORTING_SOURCES = 2
MIN_SENTENCE_WORDS = 5


KNOWN_PUBLISHERS = {
    "nasa.gov",
    "britannica.com",
    "nature.com",
    "science.org",
    "bbc.com",
    "bbc.co.uk",
    "who.int",
    "un.org",
    "loc.gov",
    "archives.gov",
    "snopes.com",
    "royalsocietypublishing.org",
}


print("Loading Dephantom DeBERTa NLI model...")

tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)

model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_ID
)

model.eval()

print("Dephantom DeBERTa NLI model loaded successfully!")


def get_publisher_domain(url: str) -> str:
    try:
        domain = (
            urlparse(url).hostname or ""
        ).lower().removeprefix("www.")

    except ValueError:
        return ""

    for publisher in KNOWN_PUBLISHERS:
        if (
            domain == publisher
            or domain.endswith("." + publisher)
        ):
            return publisher

    return domain


def get_nli_scores(
    premise: str,
    hypothesis: str
) -> dict:
    """
    Return NLI probabilities for a premise-hypothesis pair.
    """

    inputs = tokenizer(
        premise,
        hypothesis,
        return_tensors="pt",
        truncation=True,
        max_length=512
    )

    with torch.no_grad():
        outputs = model(**inputs)

    probabilities = torch.softmax(
        outputs.logits,
        dim=1
    )[0]

    labels = model.config.id2label

    scores = {
        str(labels[index]).lower(): float(
            probabilities[index]
        )
        for index in range(len(probabilities))
    }

    return {
        "contradiction": next(
            (
                score for label, score in scores.items()
                if "contradiction" in label
            ),
            0.0
        ),
        "entailment": next(
            (
                score for label, score in scores.items()
                if "entailment" in label
            ),
            0.0
        ),
        "neutral": next(
            (
                score for label, score in scores.items()
                if "neutral" in label
            ),
            0.0
        )
    }


def classify_evidence(
    claim: str,
    snippet: str
) -> dict:
    """
    Evaluate evidence against the original claim.

    The canonical direction is:

    Premise = retrieved evidence
    Hypothesis = original claim

    Reverse scores are retained for debugging and comparison,
    but are not used as the primary verdict signals.

    NLI scores are model outputs, not truth probabilities.
    """

    if not claim.strip() or not snippet.strip():
        return {
            "contradiction_score": 0.0,
            "entailment_score": 0.0,
            "neutral_score": 1.0,
            "reverse_contradiction_score": 0.0,
            "reverse_entailment_score": 0.0,
            "reverse_neutral_score": 1.0
        }

    # Correct direction: evidence -> claim.
    evidence_to_claim = get_nli_scores(
        premise=snippet,
        hypothesis=claim
    )

    # Diagnostic direction: claim -> evidence.
    claim_to_evidence = get_nli_scores(
        premise=claim,
        hypothesis=snippet
    )

    return {
        "contradiction_score": round(
            evidence_to_claim["contradiction"], 4
        ),
        "entailment_score": round(
            evidence_to_claim["entailment"], 4
        ),
        "neutral_score": round(
            evidence_to_claim["neutral"], 4
        ),
        "reverse_contradiction_score": round(
            claim_to_evidence["contradiction"], 4
        ),
        "reverse_entailment_score": round(
            claim_to_evidence["entailment"], 4
        ),
        "reverse_neutral_score": round(
            claim_to_evidence["neutral"], 4
        )
    }


def classify_best_sentence(
    claim: str,
    snippet: str
) -> tuple[str | None, dict]:
    """
    Evaluate individual relevant sentences.

    Sentence selection uses the canonical evidence-to-claim
    NLI direction, rather than the maximum score from both
    directions.
    """

    sentences = re.split(
        r"(?<=[.!?])\s+",
        snippet.strip()
    )

    best_sentence = None
    best_result = None
    best_score = -1.0

    for sentence in sentences:

        sentence = sentence.strip()

        if len(sentence.split()) < MIN_SENTENCE_WORDS:
            continue

        sentence_relevance = calculate_relevance(
            claim,
            "",
            sentence
        )

        if sentence_relevance < MIN_RELEVANCE_SCORE:
            continue

        result = classify_evidence(
            claim=claim,
            snippet=sentence
        )

        # Use only evidence -> claim scores.
        strongest_score = max(
            result["contradiction_score"],
            result["entailment_score"]
        )

        if strongest_score > best_score:
            best_score = strongest_score
            best_sentence = sentence
            best_result = result

    if best_result is None:
        return None, classify_evidence(
            claim,
            ""
        )

    return best_sentence, best_result


def detect_contradictions(
    claim: str,
    evidence: list[dict]
) -> dict:

    if not claim.strip() or not evidence:
        return {
            "contradiction_found": False,
            "status": "inconclusive",
            "contradicting_sources": [],
            "supporting_sources": [],
            "review_candidates": [],
            "reason": "Insufficient information."
        }

    contradicting_sources = []
    supporting_sources = []
    review_candidates = []

    processed_urls = set()
    processed_publishers = set()

    for item in evidence:

        snippet = item.get("snippet", "").strip()
        url = item.get("url", "")

        if not snippet:
            continue

        if url and url in processed_urls:
            continue

        if url:
            processed_urls.add(url)

        # Check source-level relevance.
        try:
            relevance = float(
                item.get("relevance_score", 0.0)
            )
        except (TypeError, ValueError):
            relevance = 0.0

        if relevance < MIN_RELEVANCE_SCORE:
            review_candidates.append({
                "title": item.get("title", ""),
                "url": url,
                "relevance_score": relevance,
                "reason": (
                    "Evidence is insufficiently relevant "
                    "to the claim."
                )
            })
            continue

        source_quality = item.get(
            "source_quality", {}
        )

        try:
            credibility = float(
                source_quality.get("score", 0.4)
            )
        except (TypeError, ValueError):
            credibility = 0.4

        publisher = get_publisher_domain(url)

        source = {
            "title": item.get("title", ""),
            "url": url,
            "publisher": publisher,
            "credibility": credibility,
            "relevance_score": relevance
        }

        if credibility < MIN_SOURCE_CREDIBILITY:
            review_candidates.append({
                **source,
                "reason": (
                    "Source credibility is below "
                    "the required threshold."
                )
            })
            continue

        if not publisher or publisher in processed_publishers:
            review_candidates.append({
                **source,
                "reason": (
                    "Publisher is missing or already represented."
                )
            })
            continue

        best_sentence, result = classify_best_sentence(
            claim=claim,
            snippet=snippet
        )

        if best_sentence is None:
            review_candidates.append({
                **source,
                "reason": (
                    "No individual sentence passed "
                    "the relevance threshold."
                )
            })
            continue

        source.update({
            "matched_sentence": best_sentence,
            **result
        })

        # Only evidence -> claim scores determine classification.
        contradiction_detected = (
            result["contradiction_score"]
            >= CONTRADICTION_THRESHOLD
        )

        entailment_detected = (
            result["entailment_score"]
            >= ENTAILMENT_THRESHOLD
        )

        processed_publishers.add(publisher)

        if contradiction_detected:
            contradicting_sources.append(source)

        elif entailment_detected:
            supporting_sources.append(source)

        else:
            review_candidates.append({
                **source,
                "reason": (
                    "Sentence-level NLI did not meet "
                    "the contradiction or entailment threshold."
                )
            })

    if (
        len(contradicting_sources)
        >= MIN_CONTRADICTING_SOURCES
    ):
        status = "contradicted"

        reason = (
            "Multiple distinct credible publishers contain "
            "relevant evidence classified as contradictory "
            "to the claim."
        )

    elif (
        len(supporting_sources)
        >= MIN_SUPPORTING_SOURCES
    ):
        status = "supported"

        reason = (
            "Multiple distinct credible publishers contain "
            "relevant evidence classified as supporting "
            "the claim."
        )

    else:
        status = "inconclusive"

        reason = (
            "The available relevant evidence does not meet "
            "the required threshold for a supported or "
            "contradicted verdict."
        )

    return {
        "contradiction_found": status == "contradicted",
        "status": status,
        "contradicting_sources": contradicting_sources,
        "supporting_sources": supporting_sources,
        "review_candidates": review_candidates,
        "reason": reason
    }
