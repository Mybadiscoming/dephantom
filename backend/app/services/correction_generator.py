# Path: app/services/correction_generator.py

import re

from app.services.contradiction_detector import classify_evidence


CONTRADICTION_THRESHOLD = 0.90
MIN_SOURCE_CREDIBILITY = 0.70
MIN_CORRECTION_SOURCES = 2





def extract_relevant_sentence(
    claim: str,
    snippet: str
) -> tuple[str | None, float]:

    if not snippet or not snippet.strip():
        return None, 0.0

    snippet = re.sub(
        r"^(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"
        r"\s+\d{1,2},\s+\d{4}\s*[·\-–]?\s*",
        "",
        snippet.strip(),
        flags=re.IGNORECASE
    )

    sentences = re.split(r"(?<=[.!?])\s+", snippet)

    best_sentence = None
    best_score = 0.0

    for sentence in sentences:
        sentence = sentence.strip()

        if len(sentence.split()) < 5:
            continue

        result = classify_evidence(
            claim=claim,
            snippet=sentence
        )

        # Match the bidirectional logic used by contradiction_detector.
        score = max(
            result["contradiction_score"],
            result["reverse_contradiction_score"]
        )

        if score > best_score:
            best_score = score
            best_sentence = sentence

    if best_score < CONTRADICTION_THRESHOLD:
        return None, best_score

    return best_sentence, best_score



def generate_correction(
    claim: str,
    evidence: list[dict],
    verdict: dict,
    contradiction_result: dict | None = None
) -> dict:

    if not claim or not claim.strip():
        return {
            "correction_available": False,
            "suggested_correction": None,
            "reason": "The original claim is empty."
        }

    if verdict.get("verdict") == "supported":
        return {
            "correction_available": False,
            "suggested_correction": None,
            "reason": "The original claim is assessed as supported."
        }

    if verdict.get("verdict") != "contradicted":
        return {
            "correction_available": False,
            "suggested_correction": None,
            "reason": "The claim has not been conclusively contradicted."
        }

    if not contradiction_result:
        return {
            "correction_available": False,
            "suggested_correction": None,
            "reason": "Contradiction evidence is unavailable."
        }

    contradicting_sources = contradiction_result.get(
        "contradicting_sources", []
    )

    evidence_by_url = {
        item.get("url"): item
        for item in evidence
        if item.get("url")
    }

    verified_evidence = []

    for source in contradicting_sources:

        credibility = source.get("credibility", 0)
        url = source.get("url", "")

        if credibility < MIN_SOURCE_CREDIBILITY or not url:
            continue

        matching_evidence = evidence_by_url.get(url)

        if not matching_evidence:
            continue

        snippet = matching_evidence.get("snippet", "")

        relevant_sentence, sentence_score = (
            extract_relevant_sentence(claim, snippet)
        )

        if not relevant_sentence:
            continue

        verified_evidence.append({
            "source": matching_evidence.get("title", ""),
            "url": url,
            "snippet": relevant_sentence,
            "credibility": credibility,
            "contradiction_score": round(sentence_score, 4)
        })

    if len(verified_evidence) < MIN_CORRECTION_SOURCES:
        return {
            "correction_available": False,
            "suggested_correction": None,
            "reason": (
                "Fewer than two credible sources contain individual "
                "sentences that strongly contradict the claim."
            ),
            "supporting_evidence": verified_evidence
        }

    # Use the strongest sentence as the correction's evidence excerpt.
    strongest_evidence = max(
        verified_evidence,
        key=lambda item: item["contradiction_score"]
    )

    suggested_correction = (
        "The original claim is contradicted by the available evidence. "
        + strongest_evidence["snippet"]
    )

    return {
        "correction_available": True,
        "suggested_correction": suggested_correction,
        "reason": (
            "The selected statement is an evidence excerpt that "
            "strongly contradicts the original claim. Additional "
            "credible sources corroborate the assessment."
        ),
        "supporting_evidence": verified_evidence
    }