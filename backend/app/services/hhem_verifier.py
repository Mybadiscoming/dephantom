
# Path: app/services/hhem_verifier.py

from transformers import AutoModelForSequenceClassification

MODEL_ID = "vectara/hallucination_evaluation_model"

print("Loading Dephantom HHEM model...")

model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_ID,
    trust_remote_code=True
)

model.eval()

print("HHEM model loaded successfully!")


def verify_claim(premise: str, hypothesis: str) -> dict:
    """
    Compare retrieved evidence (premise) against a claim (hypothesis).
    Returns an evidence-consistency score between 0 and 1.
    """

    if not premise.strip() or not hypothesis.strip():
        return {
            "score": None,
            "status": "inconclusive",
            "reason": "Evidence or claim is empty."
        }

    scores = model.predict([(premise, hypothesis)])
    score = float(scores[0].item())

    if score >= 0.5:
        status = "supported"
    else:
        status = "not_supported"

    return {
        "score": round(score, 4),
        "status": status
    }
