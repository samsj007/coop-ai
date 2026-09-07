import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routers import auth, services, workers, bookings, analytics

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("coopai.main")

# Initialize DB tables and seed workers
init_db()

app = FastAPI(
    title="COOP AI REST API",
    description="Cooperative Gig Services Platform REST API for Household & Community Services (SIH26089)",
    version="1.0.0"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for prototype web dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(services.router, prefix="/api/v1")
app.include_router(workers.router, prefix="/api/v1")
app.include_router(bookings.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")

from app.services.demand_intelligence import forecast_community_demand
from app.models import DemandForecastResponse

@app.post("/api/ai/forecast-demand", response_model=DemandForecastResponse)
@app.post("/api/v1/ai/forecast-demand", response_model=DemandForecastResponse)
@app.get("/api/ai/forecast-demand", response_model=DemandForecastResponse)
def api_forecast_demand(city: str = "Chennai"):
    return forecast_community_demand(city=city)

@app.get("/api/insights/community-demand", response_model=DemandForecastResponse)
@app.get("/api/v1/insights/community-demand", response_model=DemandForecastResponse)
def api_community_demand_insight(city: str = "Chennai"):
    return forecast_community_demand(city=city)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "COOP AI",
        "subtitle": "Cooperative Gig Services Platform REST API",
        "docs": "/docs"
    }

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": "COOP AI FastAPI Backend"}

