import logging
from functools import lru_cache

from sentence_transformers import CrossEncoder

logger = logging.getLogger(__name__)

RERANKER_MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2"


@lru_cache(maxsize=1)
def get_reranker() -> CrossEncoder:
    return CrossEncoder(RERANKER_MODEL)


def rerank_results(query: str, leads: list, top_k: int = 5) -> list:
    if not leads:
        return []

    pairs = [[query, f"{lead.name} {lead.status} {lead.notes or ''}"] for lead in leads]

    try:
        scores = get_reranker().predict(pairs)
    except Exception:
        logger.exception("Reranking failed")
        return leads[:top_k]

    min_score = min(scores)
    max_score = max(scores)

    if max_score != min_score:
        normalized = [(score - min_score) / (max_score - min_score) for score in scores]
    else:
        normalized = [1.0 for _ in scores]

    scored_leads = sorted(zip(leads, normalized), key=lambda item: item[1], reverse=True)

    results = []
    for lead, score in scored_leads[:top_k]:
        lead.relevance_score = round(float(score), 4)
        results.append(lead)

    return results
