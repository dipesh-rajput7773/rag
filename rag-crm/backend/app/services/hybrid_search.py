from sqlalchemy.orm import Session

from app.db.crud import search_leads as sql_search
from app.models.response import LeadResult
from app.services.vectorstore import search_leads as vector_search

VECTOR_WEIGHT = 0.7
KEYWORD_WEIGHT = 0.3

def hybrid_search(query: str, db: Session, top_k: int = 5, user_id: int | None = None) -> list:
    vector_results = vector_search(query, top_k * 2, user_id=user_id)
    keyword_results = sql_search(db, query, user_id=user_id)

    scores = {}

    for doc, score in vector_results:
        lead_id = int(doc.metadata["lead_id"])
        scores[lead_id] = {
            "vector_score": float(score),
            "keyword_score": 0.0,
            "metadata": doc.metadata,
        }

    for lead in keyword_results:
        if lead.id in scores:
            scores[lead.id]["keyword_score"] = 1.0
        else:
            scores[lead.id] = {
                "vector_score": 0.0,
                "keyword_score": 1.0,
                "metadata": {
                    "lead_id": lead.id,
                    "name": lead.name,
                    "email": lead.email,
                    "status": lead.status,
                    "notes": lead.notes or "",
                },
            }

    results = []
    for lead_id, data in scores.items():
        combined_score = (
            data["vector_score"] * VECTOR_WEIGHT
            + data["keyword_score"] * KEYWORD_WEIGHT
        )
        results.append(
            LeadResult(
                id=data["metadata"]["lead_id"],
                name=data["metadata"]["name"],
                email=data["metadata"]["email"],
                status=data["metadata"]["status"],
                notes=data["metadata"].get("notes", ""),
                relevance_score=round(combined_score, 4),
            )
        )

    results.sort(key=lambda x: x.relevance_score, reverse=True)
    return results[:top_k]
