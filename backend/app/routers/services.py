from fastapi import APIRouter
from app.models import (
    ParseServiceRequest, ParsedServiceResponse,
    ChatAssistantRequest, ChatAssistantResponse
)
from app.services.gemini_service import parse_natural_language_service, generate_chat_assistant_reply, CATEGORIES

router = APIRouter(prefix="/services", tags=["Services"])

@router.get("/categories")
def list_categories():
    return {"categories": CATEGORIES}

@router.post("/parse", response_model=ParsedServiceResponse)
def parse_service(req: ParseServiceRequest):
    return parse_natural_language_service(
        input_text=req.natural_language_input,
        city=req.customer_city or "Bengaluru"
    )

@router.post("/assistant", response_model=ChatAssistantResponse)
def chat_assistant(req: ChatAssistantRequest):
    return generate_chat_assistant_reply(
        message=req.message,
        chat_history=req.chat_history or []
    )
