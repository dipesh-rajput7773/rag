from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.crud import count_leads, filter_leads
from app.db.database import get_db
from app.db.models import UsageLog, User
from app.middleware.auth import get_current_user
from app.models.request import SearchRequest
from app.models.response import LeadResult, SearchResponse
from app.services.generator import generate_answer
from app.services.hybrid_search import hybrid_search
from app.services.query_router import classify_query, extract_filters
from app.services.reranker import rerank_results

router = APIRouter(tags=["search"])


def parse_matched_ids(values: list) -> set[int]:
    matched_ids = set()
    for value in values:
        try:
            matched_ids.add(int(value))
        except (TypeError, ValueError):
            continue
    return matched_ids


@router.post("/search", response_model=SearchResponse)
async def search(
    request: SearchRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    route = classify_query(request.query)
    query_type = route.get("type", "SEMANTIC")
    filters = extract_filters(request.query, query_type)

    db.add(UsageLog(user_id=user.id, action="search", details=request.query))
    db.commit()

    if query_type == "COUNT":
        count = count_leads(db, filters, user_id=user.id)
        status = filters.get("status", "total")
        return SearchResponse(
            query=request.query,
            answer=f"You have {count} {status} leads in your CRM.",
            results=[],
            total_results=count,
        )

    if query_type == "STRUCTURED":
        leads = filter_leads(db, filters, user_id=user.id)
        results = [
            LeadResult(
                id=lead.id,
                name=lead.name,
                email=lead.email,
                status=lead.status,
                notes=lead.notes or "",
                relevance_score=1.0,
            )
            for lead in leads[: request.top_k]
        ]
        return SearchResponse(
            query=request.query,
            answer=f"Found {len(results)} {filters.get('status', '')} leads.".strip(),
            results=results,
            total_results=len(results),
        )

    leads = hybrid_search(request.query, db, top_k=20, user_id=user.id)
    reranked_leads = rerank_results(request.query, leads, top_k=request.top_k)
    llm_response = generate_answer(request.query, reranked_leads)
    matched_ids = parse_matched_ids(llm_response.get("matched_ids", []))
    filtered_leads = [lead for lead in reranked_leads if lead.id in matched_ids]

    return SearchResponse(
        query=request.query,
        answer=llm_response.get("answer", ""),
        results=filtered_leads,
        total_results=len(filtered_leads),
    )
