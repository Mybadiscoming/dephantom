# Path: app/services/verdict_engine.py

from urllib.parse import urlparse

MIN_CREDIBILITY = 0.7
MIN_SUPPORT_SOURCES = 2
MIN_CONTRADICTION_SOURCES = 2



# Path: app/services/verdict_engine.py

def get_domain(url: str, source_quality: dict) -> str:
    domain = source_quality.get("domain", "")

    if not domain:
        try:
            domain = urlparse(url).hostname or ""
        except ValueError:
            return ""

    domain = domain.lower().removeprefix("www.")

    # Collapse subdomains belonging to the same publisher.
    known_publishers = {
        "nasa.gov",
        "britannica.com",
        "bbc.com",
        "bbc.co.uk",
        "nature.com",
        "science.org",
        "who.int",
        "un.org",
        "loc.gov",
        "archives.gov",
        "snopes.com",
    }

    for publisher in known_publishers:
        if (
            domain == publisher
            or domain.endswith("." + publisher)
        ):
            return publisher

    return domain



def calculate_claim_verdict(
    hhem_results: list[dict],
    evidence: list[dict],
    contradiction_result: dict | None = None
) -> dict:

    contradiction_result = contradiction_result or {}

    evidence_by_url = {
        item.get("url"): item
        for item in evidence
        if item.get("url")
    }

    # Keep only valid HHEM results from credible sources.
    credible_results = {}

    for result in hhem_results or []:

        url = result.get("url")
        item = evidence_by_url.get(url)

        if not item:
            continue

        try:
            score = float(result.get("score"))
            credibility = float(
                item.get("source_quality", {}).get("score", 0)
            )
        except (TypeError, ValueError):
            continue

        if not 0 <= score <= 1:
            continue

        if credibility < MIN_CREDIBILITY:
            continue

        domain = get_domain(
            url,
            item.get("source_quality", {})
        )

        if not domain:
            continue

        # One publisher counts only once.
        if (
            domain not in credible_results
            or score > credible_results[domain]["score"]
        ):
            credible_results[domain] = {
                "score": score,
                "credibility": credibility
            }

    # Count distinct credible contradiction publishers.
    credible_contradictions = set()

    for source in contradiction_result.get(
        "contradicting_sources", []
    ):

        try:
            credibility = float(source.get("credibility", 0))
        except (TypeError, ValueError):
            continue

        if credibility < MIN_CREDIBILITY:
            continue

        domain = get_domain(source.get("url", ""), {})

        if domain:
            credible_contradictions.add(domain)

    contradiction_count = len(credible_contradictions)

    checked_count = len(credible_results)

    supporting_domains = {
        domain
        for domain, result in credible_results.items()
        if result["score"] >= 0.5
    }

    supporting_count = len(supporting_domains)

    if checked_count == 0:

        return {
            "verdict": "unverified",
            "reliability_score": None,
            "evidence_consistency_score": None,
            "support_percentage": 0,
            "sources_checked": 0,
            "supporting_sources": 0,
            "contradicting_sources": contradiction_count,
            "reason": (
                "No sufficiently credible sources had usable "
                "verification results."
            )
        }

    total_weight = sum(
        result["credibility"]
        for result in credible_results.values()
    )

    weighted_score = sum(
        result["score"] * result["credibility"]
        for result in credible_results.values()
    )

    supporting_weight = sum(
        result["credibility"]
        for domain, result in credible_results.items()
        if domain in supporting_domains
    )

    consistency_score = (
        weighted_score / total_weight
    ) * 100

    support_percentage = (
        supporting_weight / total_weight
    ) * 100

    support_ratio = supporting_count / checked_count

    if contradiction_count >= MIN_CONTRADICTION_SOURCES:

        verdict = "contradicted"

        reason = (
            "Multiple distinct credible publishers contain "
            "evidence classified as contradictory to the claim."
        )

    elif (
        supporting_count >= MIN_SUPPORT_SOURCES
        and support_ratio >= 0.6
        and support_percentage >= 60
        and consistency_score >= 75
        and contradiction_count == 0
    ):

        verdict = "supported"

        reason = (
            "Multiple distinct credible publishers show strong "
            "evidence consistency with the claim."
        )

    else:

        verdict = "unverified"

        reason = (
            "There is insufficient credible, independently "
            "published evidence to establish the claim."
        )

    return {
        "verdict": verdict,
        "reliability_score": round(consistency_score, 2),
        "evidence_consistency_score": round(
            consistency_score, 2
        ),
        "support_percentage": round(
            support_percentage, 2
        ),
        "sources_checked": checked_count,
        "supporting_sources": supporting_count,
        "contradicting_sources": contradiction_count,
        "reason": reason
    }