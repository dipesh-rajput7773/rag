import logging

from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq

from app.config import settings

logger = logging.getLogger(__name__)

llm = ChatGroq(
    api_key=settings.GROQ_API_KEY,
    model_name="llama-3.1-8b-instant",
    temperature=0,
)

router_prompt = PromptTemplate(
    input_variables=["query"],
    template="""Classify this CRM query.

Types:
COUNT: user asks for a number.
STRUCTURED: user asks for a field-based list such as hot, warm, or cold leads.
SEMANTIC: user asks an intent-based question.
MIXED: user asks for count plus filters.

Query: {query}

Return only JSON:
{{
  "type": "COUNT|STRUCTURED|SEMANTIC|MIXED",
  "reason": "short reason"
}}""",
)

router_chain = router_prompt | llm | JsonOutputParser()

COUNT_KEYWORDS = ("how many", "count", "total number", "number of")
STRUCTURED_KEYWORDS = ("show me", "list", "get all", "find all", "display")
STATUSES = ("hot", "warm", "cold")


def classify_query(query: str) -> dict:
    query_lower = query.lower()

    if any(keyword in query_lower for keyword in COUNT_KEYWORDS):
        return {"type": "COUNT", "reason": "count keyword detected"}

    if any(keyword in query_lower for keyword in STRUCTURED_KEYWORDS):
        return {"type": "STRUCTURED", "reason": "structured keyword detected"}

    try:
        return router_chain.invoke({"query": query})
    except Exception:
        logger.exception("Query classification failed")
        return {"type": "SEMANTIC", "reason": "fallback"}


def extract_filters(query: str, query_type: str) -> dict:
    query_lower = query.lower()

    for status in STATUSES:
        if status in query_lower:
            return {"status": status}

    return {}
