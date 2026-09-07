from fastapi import APIRouter
from app.services.demand_intelligence import get_demand_intelligence_summary, forecast_community_demand
from app.models import DemandForecastResponse

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/demand-intelligence")
def demand_intelligence():
    return get_demand_intelligence_summary()

@router.post("/forecast-demand", response_model=DemandForecastResponse)
@router.get("/forecast-demand", response_model=DemandForecastResponse)
def get_forecast_demand(city: str = "Chennai"):
    return forecast_community_demand(city=city)

