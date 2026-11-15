
# Path: app/services/evidence_retriever.py

import re
from urllib.parse import urlparse
from ddgs import DDGS


DATE_PATTERN = re.compile(
    r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"
    r"\s+\d{1,2},?\s+\d{4}\b",
    re.IGNORECASE
)

URL_PATTERN = re.compile(
    r"https?://|www\.",
    re.IGNORECASE
)


KNOWN_PUBLISHERS = {
    "nasa.gov",
    "britannica.com",
    "nature.com",
    "science.org",
    "bbc.com",
    "bbc.co.uk",
    "who.int",
    "un.org",
    "snopes.com",
    "archives.gov",
    "loc.gov",
    "sciencemuseum.org.uk",
    "esa.int",
    "noaa.gov",
    "usgs.gov",
    "iau.org",
    "royalsocietypublishing.org",
    "history.com",
    "theconversation.com",
    "historyextra.com",
    "historytoday.com",
    "historyfacts.com",
    "historynet.com",
    "sciencefocus.com",
    "skyatnightmagazine.com",
    "scientificamerican.com",
    "livescience.com",
}


def is_valid_url(url: str) -> bool:
    if not isinstance(url, str) or not url.strip():
        return False

    try:
        parsed = urlparse(url.strip())

        return (
            parsed.scheme in {"http", "https"}
            and bool(parsed.hostname)
        )

    except ValueError:
        return False


def clean_snippet(snippet: str) -> str:
    if not isinstance(snippet, str):
        return ""

    return re.sub(r"\s+", " ", snippet).strip()


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


def is_suspicious_aggregated_snippet(
    title: str,
    snippet: str
) -> bool:

    if not title or not snippet:
        return True

    combined_text = title + " " + snippet

    # Multiple dates may indicate combined search excerpts.
    if len(DATE_PATTERN.findall(combined_text)) >= 2:
        return True

    # URLs inside snippets may indicate aggregated content.
    if URL_PATTERN.search(combined_text):
        return True

    # Reject suspiciously long or concatenated titles.
    if len(title) > 150:
        return True

    if title.count("|") >= 2:
        return True

    if "..." in title and "|" in title:
        return True

    return False


def search_evidence(
    query: str,
    max_results: int = 5
) -> list[dict]:

    if not query or not query.strip():
        return []

    if max_results <= 0:
        return []

    clean_query = re.sub(
        r"[^\w\s]",
        " ",
        query
    )

    clean_query = re.sub(
        r"\s+",
        " ",
        clean_query
    ).strip()

    # Search recognized publishers first.
    queries = list(dict.fromkeys([
        f"site:nasa.gov {clean_query}",
        f"site:britannica.com {clean_query}",
        f"site:nature.com {clean_query}",
        f"site:science.org {clean_query}",
        f"site:esa.int {clean_query}",
        f"site:noaa.gov {clean_query}",
        f"site:usgs.gov {clean_query}",
        f"site:iau.org {clean_query}",
        f"site:royalsocietypublishing.org {clean_query}",
        f"site:scientificamerican.com {clean_query}",
        f"site:livescience.com {clean_query}",
        query.strip(),
        clean_query,
        f"reliable sources {clean_query}"
    ]))

    evidence = []
    seen_urls = set()
    seen_snippets = set()
    seen_domains = set()

    for search_query in queries:

        try:
            results = DDGS().text(
                search_query,
                max_results=max_results
            )

            for result in results:

                url = result.get("href", "").strip()
                title = result.get("title", "").strip()

                snippet = clean_snippet(
                    result.get("body", "")
                )

                if not is_valid_url(url):
                    continue

                if not title or not snippet:
                    continue

                if is_suspicious_aggregated_snippet(
                    title,
                    snippet
                ):
                    print(
                        "Rejected suspicious aggregated result:",
                        url
                    )
                    continue

                normalized_url = url.rstrip("/").lower()
                normalized_snippet = snippet.lower()

                domain = get_publisher_domain(url)

                if not domain:
                    continue

                if normalized_url in seen_urls:
                    continue

                if normalized_snippet in seen_snippets:
                    continue

                # Keep only one result per publisher.
                if domain in seen_domains:
                    continue

                seen_urls.add(normalized_url)
                seen_snippets.add(normalized_snippet)
                seen_domains.add(domain)

                evidence.append({
                    "title": title,
                    "url": url,
                    "snippet": snippet
                })

                if len(evidence) >= max_results:
                    break

        except Exception as error:
            print(
                f"Search attempt failed for "
                f"'{search_query}': {error}"
            )

        if len(evidence) >= max_results:
            break

    return evidence
