# DePhantom

**Question the answer. Follow the evidence.**

DePhantom is a claim-level verification tool designed to help users
examine factual statements in AI-generated text. It breaks submitted
text into claims, searches for external evidence, evaluates
evidence-claim consistency, and presents findings with supporting
sources.

> **Important:** DePhantom is an evidence-assessment aid, not a
> definitive truth detector. Search snippets can be incomplete, source
> credibility is assessed heuristically, and model scores are not
> probabilities that a claim is true.

## What it does

1.  **Claim extraction** -- splits submitted text into individual
    sentences for review.
2.  **Evidence retrieval** -- searches the web for relevant material
    using DuckDuckGo search.
3.  **Source assessment** -- applies heuristic domain-based credibility
    and relevance scoring.
4.  **HHEM evaluation** -- uses Vectara's Hallucination Evaluation Model
    (HHEM) to assess consistency between retrieved evidence and a claim.
5.  **NLI evaluation** -- uses DeBERTa-based natural language inference
    to classify evidence as entailment, contradiction, or neutral.
6.  **Verdict generation** -- combines available evidence and evaluation
    signals to label claims as supported, contradicted, or unverified.
7.  **Evidence-led suggestions** -- can display a suggested correction
    drawn from retrieved evidence.

## Technology

### Frontend

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   Lucide React

### Backend

-   Python
-   FastAPI
-   Server-Sent Events (SSE) for verification progress
-   DuckDuckGo search through `ddgs`
-   Hugging Face Transformers
-   Vectara HHEM
-   DeBERTa NLI cross-encoder

### Optional observability

-   Galileo logging is an optional observability component. It is not a
    fact-verification model and is not required for the core
    verification flow.

## Project structure

``` text
dephantom/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   │   └── verification.py
│   │   ├── schemas/
│   │   │   └── verification.py
│   │   └── services/
│   │       ├── claim_extractor.py
│   │       ├── evidence_retriever.py
│   │       ├── source_ranker.py
│   │       ├── hhem_verifier.py
│   │       ├── contradiction_detector.py
│   │       ├── verdict_engine.py
│   │       ├── correction_generator.py
│   │       └── galileo_logger.py
│   └── ...
└── frontend/
    ├── app/
    │   ├── page.tsx
    │   ├── layout.tsx
    │   ├── globals.css
    │   ├── verify/
    │   │   └── page.tsx
    │   └── components/
    └── ...
```

## Run locally

The following instructions assume Windows and that the repository
contains the backend dependency file (`requirements.txt`) and the
frontend `package.json`.

### 1. Backend

Open a terminal in the project root:

``` powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

If PowerShell blocks virtual-environment activation, use Command Prompt:

``` bat
venv\Scripts\activate.bat
```

Start the FastAPI server:

``` powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API health endpoint is:

``` text
http://localhost:8000/health
```

Interactive API documentation (if enabled by the FastAPI app):

``` text
http://localhost:8000/docs
```

### 2. Frontend

Open a second terminal:

``` powershell
cd frontend
npm install
```

Create `frontend/.env.local` with:

``` env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the Next.js development server:

``` powershell
npm run dev
```

Open:

``` text
http://localhost:3000
```

Use the **Start Investigating** button to open the verification
workspace at `/verify`.

## Verification flow

``` text
Submitted text
     |
     v
Claim extraction
     |
     v
Evidence search
     |
     v
Source credibility and relevance assessment
     |
     v
HHEM consistency evaluation + NLI classification
     |
     v
Combined verdict assessment
     |
     v
Claim-level findings, evidence and explanation
```

The `/verify-stream` endpoint sends progress events to the frontend
using Server-Sent Events. The current flow reports processing stages and
sends the completed verification response at the end.

## Understanding the results

-   **Supported** -- the available evidence and evaluation signals meet
    the system's support criteria.
-   **Contradicted** -- sufficiently strong contradiction evidence meets
    the system's contradiction criteria.
-   **Unverified** -- the available evidence is insufficient,
    inconclusive, or does not meet the criteria for either of the other
    verdicts.

### Score interpretation

-   **HHEM score:** an evidence-premise/claim-hypothesis consistency
    score. It is not a probability of truth.
-   **NLI scores:** model outputs for entailment, contradiction, and
    neutral relationships. They are not truth probabilities.
-   **Source credibility:** a heuristic based largely on the source's
    domain. A high-ranked domain does not guarantee that a particular
    article or statement is correct.
-   **Support percentage:** an aggregate evidence measure, not the
    percentage probability that the claim is true.

## Current limitations

-   Claim extraction currently uses sentence splitting; complex
    sentences may contain multiple claims or context that is not
    separated cleanly.
-   Evidence retrieval primarily uses search-result snippets rather than
    full article content. Snippets may omit qualifications or
    surrounding context.
-   Source credibility is heuristic and domain-based, not a
    comprehensive assessment of each article.
-   Search coverage depends on the search provider and the queries
    generated.
-   Search results may repeat or derive from shared sources; they should
    not automatically be treated as independent confirmations.
-   HHEM and NLI are model-based signals and can make mistakes.
-   Suggested corrections are evidence-led and may be extractive; users
    should inspect the cited source and context before relying on them.
-   An unverified result does not mean a claim is false. A low
    consistency score by itself does not establish a contradiction.

## Responsible use

DePhantom is intended to support critical examination of AI-generated
information. It should not be treated as an authoritative source of
truth or used as the sole basis for high-stakes decisions. Review the
cited sources, publication context, and relevant primary material before
accepting a finding.

## Team

**Team Candy Crush**\
Hacknauts 2.0

-   Hetal
-   Tanway
-   Disha
-   Saarthak

------------------------------------------------------------------------

**DePhantom --- Question the answer. Follow the evidence.**
