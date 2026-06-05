import logging
from typing import Any

from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq

from app.config import settings

logger = logging.getLogger(__name__)

llm = ChatGroq(
    api_key=settings.GROQ_API_KEY,
    model_name="llama-3.1-8b-instant",
    temperature=0.1,
)

prompt = PromptTemplate(
    input_variables=["query", "leads"],
    template="""You are a CRM assistant for a retrieval-augmented SaaS product.

User query: {query}

Retrieved leads:
{leads}

Return only valid JSON with this shape:
{{
  "answer": "a concise, helpful CRM answer",
  "matched_ids": [lead ids that support the answer]
}}

Use only the retrieved leads. If no retrieved lead supports the query, return an empty matched_ids list.""",
)

chain = prompt | llm | JsonOutputParser()


def _fallback_answer(leads: list) -> dict[str, Any]:
    if not leads:
        return {"answer": "No relevant leads found for your query.", "matched_ids": []}

    names = ", ".join(lead.name for lead in leads[:3])
    return {
        "answer": f"I found {len(leads)} relevant leads. Top matches: {names}.",
        "matched_ids": [lead.id for lead in leads],
    }


def generate_answer(query: str, leads: list) -> dict[str, Any]:
    if not leads:
        return _fallback_answer(leads)

    leads_text = "\n".join(
        [
            (
                f"- ID: {lead.id}, Name: {lead.name}, Status: {lead.status}, "
                f"Email: {lead.email}, Notes: {lead.notes}, Score: {lead.relevance_score:.2f}"
            )
            for lead in leads
        ]
    )

    try:
        response = chain.invoke({"query": query, "leads": leads_text})
    except Exception:
        logger.exception("LLM answer generation failed")
        return _fallback_answer(leads)

    matched_ids = response.get("matched_ids", [])
    response["matched_ids"] = [int(lead_id) for lead_id in matched_ids if str(lead_id).isdigit()]
    response["answer"] = response.get("answer") or _fallback_answer(leads)["answer"]
    return response
