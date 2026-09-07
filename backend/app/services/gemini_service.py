import os
import json
import logging
import httpx
from typing import Dict, Any, List, Optional
from app.config import GEMINI_API_KEY
from app.models import ParsedServiceResponse, ChatAssistantResponse

logger = logging.getLogger("coopai.gemini")

CATEGORIES = [
    "Plumbing", "Electrical", "Carpentry", "Cleaning", "Painting",
    "AC Service", "Appliance Repair", "Gardening", "Mason", "Tutoring"
]

def parse_natural_language_service(input_text: str, city: str = "Bengaluru") -> ParsedServiceResponse:
    """
    Calls Gemini 2.5 Flash API via REST HTTP client if GEMINI_API_KEY is available.
    Otherwise uses structured local NLP fallback engine.
    """
    if GEMINI_API_KEY and GEMINI_API_KEY.strip() != "":
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            prompt = f"""
You are COOP AI's Natural Language Service Parser for household and community services in India.
Convert this customer request into structured JSON.

Customer Request: "{input_text}"
Customer Location: {city}

Return ONLY raw JSON with these exact keys:
{{
  "service_category": "<One of: Plumbing, Electrical, Carpentry, Cleaning, Painting, AC Service, Appliance Repair, Gardening, Mason, Tutoring>",
  "issue": "<Short 3-6 word summary of specific problem>",
  "urgency": "<High, Medium, or Low>",
  "preferred_date": "<e.g. Today, Tomorrow, Weekend, or Urgent>",
  "location_required": true,
  "confidence_score": <float between 0.85 and 0.99>,
  "ai_explanation": "<Short 1-sentence explanation of why this service category was identified>"
}}
Do not add markdown formatting or backticks around the output.
"""
            headers = {"Content-Type": "application/json"}
            payload = {
                "contents": [{"parts": [{"text": prompt}]}]
            }
            
            with httpx.Client(timeout=10.0) as client:
                response = client.post(url, json=payload, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    # Clean potential markdown ```json blocks
                    if raw_text.startswith("```"):
                        raw_text = raw_text.split("```")[1]
                        if raw_text.startswith("json"):
                            raw_text = raw_text[4:]
                    res_json = json.loads(raw_text.strip())
                    
                    return ParsedServiceResponse(
                        natural_input=input_text,
                        service_category=res_json.get("service_category", "Plumbing"),
                        issue=res_json.get("issue", "Household Repair"),
                        urgency=res_json.get("urgency", "High"),
                        preferred_date=res_json.get("preferred_date", "Today"),
                        location_required=res_json.get("location_required", True),
                        confidence_score=float(res_json.get("confidence_score", 0.95)),
                        ai_explanation=res_json.get("ai_explanation", "Identified primary service need based on Gemini AI analysis."),
                        demo_mode=False
                    )
        except Exception as e:
            logger.warning(f"Gemini API call failed or timed out, using local fallback: {e}")

    # Local Rule/NLP Fallback Engine (DEMO MODE)
    lower_input = input_text.lower()
    cat = "Plumbing"
    issue = "Household Service Request"
    urgency = "High" if any(w in lower_input for w in ["today", "urgent", "leaking", "immediately", "broken", "emergency"]) else "Medium"
    preferred_date = "Today" if "today" in lower_input or urgency == "High" else "Tomorrow"
    
    if any(w in lower_input for w in ["tap", "pipe", "water", "leak", "sink", "drain", "toilet", "plumber"]):
        cat = "Plumbing"
        issue = "Water leakage / plumbing repair"
    elif any(w in lower_input for w in ["light", "fan", "wire", "switch", "short circuit", "power", "electrician", "current"]):
        cat = "Electrical"
        issue = "Electrical wiring / fixture issue"
    elif any(w in lower_input for w in ["wood", "door", "table", "chair", "cabinet", "lock", "carpenter", "furniture"]):
        cat = "Carpentry"
        issue = "Carpentry and furniture repair"
    elif any(w in lower_input for w in ["ac", "air conditioner", "cooling", "filter", "gas leak"]):
        cat = "AC Service"
        issue = "AC inspection and cooling service"
    elif any(w in lower_input for w in ["tv", "fridge", "refrigerator", "washing machine", "oven", "appliance"]):
        cat = "Appliance Repair"
        issue = "Home appliance repair"
    elif any(w in lower_input for w in ["clean", "dust", "sweep", "mop", "deep clean", "bathroom cleaning"]):
        cat = "Cleaning"
        issue = "Comprehensive house cleaning"
    elif any(w in lower_input for w in ["paint", "wall", "color", "primer", "whitewash"]):
        cat = "Painting"
        issue = "Wall touchup and painting service"
    elif any(w in lower_input for w in ["garden", "plant", "grass", "lawn", "pruning", "lawnmower"]):
        cat = "Gardening"
        issue = "Garden maintenance and pruning"
    elif any(w in lower_input for w in ["wall repair", "brick", "cement", "tile", "mason", "concrete"]):
        cat = "Mason"
        issue = "Masonry and tile restoration"
    elif any(w in lower_input for w in ["math", "tuition", "tutor", "physics", "class", "teach"]):
        cat = "Tutoring"
        issue = "Home tuition / subject tutoring"

    return ParsedServiceResponse(
        natural_input=input_text,
        service_category=cat,
        issue=issue,
        urgency=urgency,
        preferred_date=preferred_date,
        location_required=True,
        confidence_score=0.92,
        ai_explanation=f"COOP AI NLP matched key service indicators for '{cat}'. (Demonstration Mode)",
        demo_mode=True
    )

def generate_chat_assistant_reply(message: str, chat_history: List[Dict[str, str]]) -> ChatAssistantResponse:
    """
    AI Service Request Assistant that converses with customers to refine their needs.
    """
    lower = message.lower()
    
    if any(w in lower for w in ["hi", "hello", "hey", "start"]):
        return ChatAssistantResponse(
            reply="Hello! I'm your COOP AI Assistant. Tell me what issue you are facing in your home or community, and I'll identify the right skilled provider for you!",
            suggested_service=None
        )
    
    parsed = parse_natural_language_service(message)
    reply = f"I understand! It looks like you need a **{parsed.service_category}** expert for: *'{parsed.issue}'* (Urgency: {parsed.urgency}). Would you like me to find the top verified workers near your location now?"
    
    return ChatAssistantResponse(
        reply=reply,
        suggested_service=parsed.service_category,
        suggested_issue=parsed.issue
    )

def generate_demand_insights_gemini(predictions_summary: Dict[str, Any], city: str = "Chennai") -> Optional[Dict[str, str]]:
    """
    Calls Gemini API to generate community insights and cooperative workforce recommendations based on forecast data.
    Returns None if key is missing or call fails, allowing deterministic fallback.
    """
    if GEMINI_API_KEY and GEMINI_API_KEY.strip() != "":
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            prompt = f"""
You are COOP AI's Demand Forecasting Intelligence System for household services in {city}, India.
Analyze the following predicted demand data and produce actionable community and workforce insights.

Predicted Demand Data:
{json.dumps(predictions_summary, indent=2)}

Return ONLY raw JSON with these exact keys:
{{
  "community_insight": "<1-2 sentence concise AI insight summarizing upcoming household service demand patterns in key areas like Anna Nagar, Velachery, Adyar>",
  "cooperative_workforce_insight": "<1-2 sentence recommendation for the cooperative admin on worker allocation, skill training, or availability in high-demand zones>"
}}
Do not add markdown formatting or backticks around the output.
"""
            headers = {"Content-Type": "application/json"}
            payload = {"contents": [{"parts": [{"text": prompt}]}]}
            
            with httpx.Client(timeout=10.0) as client:
                response = client.post(url, json=payload, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    if raw_text.startswith("```"):
                        raw_text = raw_text.split("```")[1]
                        if raw_text.startswith("json"):
                            raw_text = raw_text[4:]
                    res_json = json.loads(raw_text.strip())
                    return {
                        "community_insight": res_json.get("community_insight", ""),
                        "cooperative_workforce_insight": res_json.get("cooperative_workforce_insight", "")
                    }
        except Exception as e:
            logger.warning(f"Gemini API call for demand forecasting failed: {e}")
    return None

