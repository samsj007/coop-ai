from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Auth Schemas
class LoginRequest(BaseModel):
    email: str
    password: str
    role: str # 'customer', 'worker', 'admin'

class AuthResponse(BaseModel):
    user_id: str
    name: str
    email: str
    role: str
    token: str
    verification_status: Optional[str] = "APPROVED"
    identity_verified: Optional[bool] = True
    skill_verified: Optional[bool] = True

class CustomerRegisterRequest(BaseModel):
    full_name: str
    mobile: str
    otp: str
    email: str
    password: str
    address: str
    city: str
    state: str
    latitude: Optional[float] = 13.0827
    longitude: Optional[float] = 80.2707
    profile_photo: Optional[str] = None

class WorkerRegisterStepRequest(BaseModel):
    full_name: str
    mobile: str
    otp: str
    email: str
    password: str
    profile_photo: Optional[str] = None
    address: str
    city: str
    state: str
    pin_code: str
    latitude: float
    longitude: float
    skills: List[str]
    years_experience: float
    previous_work_description: str
    id_type: str
    id_document_url: Optional[str] = None
    certificate_url: Optional[str] = None
    work_photos: Optional[List[str]] = []
    bank_account_name: Optional[str] = None
    upi_id: Optional[str] = None

# Worker Schema
class WorkerProfile(BaseModel):
    worker_id: str
    name: str
    email: str
    phone: str
    city: str
    state: str
    address: str
    latitude: float
    longitude: float
    skills: List[str]
    years_experience: float
    availability: str # 'AVAILABLE', 'BUSY', 'OFFLINE'
    verification_status: str # 'APPROVED', 'PENDING', 'REJECTED', 'INFO_REQUESTED'
    identity_verified: bool
    skill_verified: bool
    document_verified: bool
    experience_verified: bool
    rating: float
    completed_jobs: int
    current_workload: int
    service_area: str
    languages: List[str]
    earnings: float
    profile_photo: Optional[str] = None
    id_type: Optional[str] = None
    id_document_url: Optional[str] = None
    certificate_url: Optional[str] = None
    work_photos: Optional[List[str]] = []
    bank_details: Optional[Dict[str, str]] = None
    recent_jobs_count: int = 0

# Natural Language Service Request
class ParseServiceRequest(BaseModel):
    natural_language_input: str
    customer_latitude: Optional[float] = None
    customer_longitude: Optional[float] = None
    customer_city: Optional[str] = "Bengaluru"

class ParsedServiceResponse(BaseModel):
    natural_input: str
    service_category: str
    issue: str
    urgency: str # 'High', 'Medium', 'Low'
    preferred_date: str
    location_required: bool
    confidence_score: float
    ai_explanation: str
    demo_mode: bool = False

# Chatbot assistant
class ChatAssistantRequest(BaseModel):
    message: str
    chat_history: Optional[List[Dict[str, str]]] = []

class ChatAssistantResponse(BaseModel):
    reply: str
    suggested_service: Optional[str] = None
    suggested_issue: Optional[str] = None

# FairShare Allocation
class FairShareAllocationRequest(BaseModel):
    service_category: str
    urgency: str
    customer_latitude: float
    customer_longitude: float
    max_workers: int = 5

class ScoredWorker(BaseModel):
    worker: WorkerProfile
    total_match_score: float
    distance_km: float
    breakdown: Dict[str, float]
    recommendation_reasons: List[str]

# Booking
class CreateBookingRequest(BaseModel):
    customer_id: str
    customer_name: str
    customer_phone: str
    worker_id: str
    service_category: str
    issue_description: str
    urgency: str
    service_address: str
    latitude: float
    longitude: float
    scheduled_date: str
    scheduled_time: str
    estimated_amount: float
    payment_method: str = "UPI"

class BookingStatusUpdate(BaseModel):
    booking_id: str
    new_status: str # 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'

class AddReviewRequest(BaseModel):
    booking_id: str
    worker_id: str
    rating: float
    comment: str

# Admin Verification
class AdminVerificationAction(BaseModel):
    worker_id: str
    action: str # 'APPROVE', 'REJECT', 'REQUEST_INFO'
    notes: Optional[str] = None

# Demand Prediction Schemas
class DemandPredictionItem(BaseModel):
    service: str
    predicted_demand: int
    demand_level: str # 'HIGH', 'MEDIUM', 'LOW'
    trend: str # 'UP', 'STABLE', 'DOWN'
    confidence: float
    area: str
    reason: str

class AreaDemandForecast(BaseModel):
    area: str
    predicted_demand: int
    demand_level: str
    trend: str
    top_service: str

class DemandForecastSummary(BaseModel):
    total_predicted_demand: int
    highest_demand_service: str
    highest_demand_area: str
    overall_demand_trend: str

class DemandForecastResponse(BaseModel):
    forecast_date: str
    generated_at: str
    summary: DemandForecastSummary
    predictions: List[DemandPredictionItem]
    area_forecasts: List[AreaDemandForecast]
    community_insight: str
    cooperative_workforce_insight: str
    is_demo: bool = False

