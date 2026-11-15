
# Path: backend/app/routes/verification.py

import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.schemas.verification import VerificationRequest
from app.services.evidence_retriever import search_evidence
from app.services.contradiction_detector import detect_contradictions
from app.services.source_ranker import rank_evidence
from app.services.hhem_verifier import verify_claim
from app.services.claim_extractor import (
    extract_claims,
    generate_search_query
)
from app.services.correction_generator import generate_correction
from app.services.verdict_engine import calculate_claim_verdict
from app.services.galileo_logger import (
    log_verification_summary,
    flush_galileo
)

router = APIRouter()


def create_event(event_type: str, data: dict) -> str:
    """Format a Server-Sent Event."""
    return (
        f"event: {event_type}\n"
        f"data: {json.dumps(data, default=str)}\n\n"
    )


def run_verification(text: str):
    """Run the existing verification pipeline and return its response."""

    claims = extract_claims(text)

    results = []
    total_evidence = 0
    total_hhem_checks = 0

    for claim in claims:

        search_query = generate_search_query(claim)

        evidence = search_evidence(
            search_query,
            max_results=5
        )

        if not evidence:
            fallback_query = f"reliable sources {search_query}"

            evidence = search_evidence(
                fallback_query,
                max_results=5
            )

        ranked_evidence = rank_evidence(
            evidence,
            claim=claim
        )

        total_evidence += len(ranked_evidence)

        hhem_results = []

        for item in ranked_evidence:
            snippet = item.get("snippet", "")

            if not snippet.strip():
                continue

            verification = verify_claim(
                premise=snippet,
                hypothesis=claim
            )

            total_hhem_checks += 1

            hhem_results.append({
                "source": item.get("title", ""),
                "url": item.get("url", ""),
                **verification
            })

        contradiction_result = detect_contradictions(
            claim=claim,
            evidence=ranked_evidence
        )

        verdict_result = calculate_claim_verdict(
            hhem_results=hhem_results,
            evidence=ranked_evidence,
            contradiction_result=contradiction_result
        )

        correction_result = generate_correction(
            claim=claim,
            evidence=ranked_evidence,
            verdict=verdict_result,
            contradiction_result=contradiction_result
        )

        results.append({
            "claim": claim,
            "search_query": search_query,
            "evidence": ranked_evidence,
            "evidence_count": len(ranked_evidence),
            "hhem_results": hhem_results,
            "verdict": verdict_result,
            "contradiction": contradiction_result,
            "correction": correction_result
        })

    response = {
        "total_claims": len(claims),
        "results": results
    }

    try:
        log_verification_summary(
            total_claims=len(claims),
            total_evidence=total_evidence,
            total_hhem_checks=total_hhem_checks
        )
        flush_galileo()

    except Exception as error:
        print(f"Galileo logging error: {error}")

    return response


@router.post("/extract-claims")
def get_claims(request: VerificationRequest):
    """Original non-streaming endpoint."""
    return run_verification(request.text)


@router.post("/verify-stream")
def verify_stream(request: VerificationRequest):
    """Stream real progress updates during verification."""

    def generate():

        try:
            # Stage 1: Extract claims
            yield create_event("progress", {
                "stage": "extracting",
                "message": "Extracting individual claims..."
            })

            claims = extract_claims(request.text)

            yield create_event("progress", {
                "stage": "extracted",
                "message": f"Extracted {len(claims)} claims.",
                "total_claims": len(claims)
            })

            results = []
            total_evidence = 0
            total_hhem_checks = 0

            for index, claim in enumerate(claims):

                claim_number = index + 1
                search_query = generate_search_query(claim)

                # Stage 2: Search
                yield create_event("progress", {
                    "stage": "searching",
                    "message": f"Searching external sources for claim {claim_number}...",
                    "claim": claim,
                    "claim_number": claim_number,
                    "total_claims": len(claims)
                })

                evidence = search_evidence(
                    search_query,
                    max_results=5
                )

                if not evidence:
                    fallback_query = f"reliable sources {search_query}"

                    yield create_event("progress", {
                        "stage": "searching",
                        "message": f"Trying an alternative search for claim {claim_number}...",
                        "claim_number": claim_number
                    })

                    evidence = search_evidence(
                        fallback_query,
                        max_results=5
                    )

                yield create_event("progress", {
                    "stage": "search_complete",
                    "message": f"Retrieved {len(evidence)} search results.",
                    "claim_number": claim_number,
                    "evidence_found": len(evidence)
                })

                # Stage 3: Rank sources
                yield create_event("progress", {
                    "stage": "ranking",
                    "message": "Evaluating source credibility and relevance...",
                    "claim_number": claim_number
                })

                ranked_evidence = rank_evidence(
                    evidence,
                    claim=claim
                )

                total_evidence += len(ranked_evidence)

                # Stage 4: HHEM and NLI
                yield create_event("progress", {
                    "stage": "evaluating",
                    "message": "Running evidence consistency and NLI checks...",
                    "claim_number": claim_number
                })

                hhem_results = []

                for item in ranked_evidence:
                    snippet = item.get("snippet", "")

                    if not snippet.strip():
                        continue

                    verification = verify_claim(
                        premise=snippet,
                        hypothesis=claim
                    )

                    total_hhem_checks += 1

                    hhem_results.append({
                        "source": item.get("title", ""),
                        "url": item.get("url", ""),
                        **verification
                    })

                contradiction_result = detect_contradictions(
                    claim=claim,
                    evidence=ranked_evidence
                )

                # Stage 5: Verdict and correction
                yield create_event("progress", {
                    "stage": "reporting",
                    "message": "Preparing evidence-based findings...",
                    "claim_number": claim_number
                })

                verdict_result = calculate_claim_verdict(
                    hhem_results=hhem_results,
                    evidence=ranked_evidence,
                    contradiction_result=contradiction_result
                )

                correction_result = generate_correction(
                    claim=claim,
                    evidence=ranked_evidence,
                    verdict=verdict_result,
                    contradiction_result=contradiction_result
                )

                results.append({
                    "claim": claim,
                    "search_query": search_query,
                    "evidence": ranked_evidence,
                    "evidence_count": len(ranked_evidence),
                    "hhem_results": hhem_results,
                    "verdict": verdict_result,
                    "contradiction": contradiction_result,
                    "correction": correction_result
                })

            response = {
                "total_claims": len(claims),
                "results": results
            }

            try:
                log_verification_summary(
                    total_claims=len(claims),
                    total_evidence=total_evidence,
                    total_hhem_checks=total_hhem_checks
                )
                flush_galileo()

            except Exception as error:
                print(f"Galileo logging error: {error}")

            yield create_event("complete", response)

        except Exception as error:
            print(f"Streaming verification error: {error}")

            yield create_event("error", {
                "message": str(error)
            })

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
