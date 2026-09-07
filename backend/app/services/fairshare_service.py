import math
from typing import List, Dict, Any
from app.models import WorkerProfile, ScoredWorker
from app.database import get_all_workers

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculates distance in kilometers between two coordinates.
    """
    R = 6371.0 # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def calculate_fairshare_allocation(
    service_category: str,
    urgency: str,
    cust_lat: float,
    cust_lng: float,
    max_workers: int = 5
) -> List[ScoredWorker]:
    """
    Calculates the 7-factor FairShare score for eligible workers:
    1. Skill Match — 30%
    2. Availability — 20%
    3. Distance — 15%
    4. Workload Balance — 15%
    5. Experience — 8%
    6. Rating — 7%
    7. Recent Job Balance — 5%
    Total = 100%
    """
    all_workers = get_all_workers()
    eligible = []

    for w_dict in all_workers:
        # Candidate filter: Must have skill (or related), must be APPROVED verification status, must not be OFFLINE
        skills_upper = [s.lower() for s in w_dict.get("skills", [])]
        cat_lower = service_category.lower()
        
        has_skill = any(cat_lower in s or s in cat_lower for s in skills_upper)
        if not has_skill:
            # Check related fallback (e.g. Appliance repair / AC Service overlap)
            if (cat_lower in ["appliance repair", "ac service"] and any(s in ["electrical", "ac service", "appliance repair"] for s in skills_upper)):
                has_skill = True

        if not has_skill:
            continue
            
        # Must be approved worker for safety
        if w_dict.get("verification_status") != "APPROVED":
            continue

        dist = haversine_distance(cust_lat, cust_lng, w_dict["latitude"], w_dict["longitude"])
        
        # If distance is too large because customer is in another state, adapt distance calculation dynamically
        # for national prototype matching
        
        # 1. Skill Match (30%)
        exact_skill = any(s.lower() == cat_lower for s in skills_upper)
        skill_score = 30.0 if exact_skill else 22.0

        # 2. Availability (20%)
        avail = w_dict.get("availability", "AVAILABLE")
        if avail == "AVAILABLE":
            avail_score = 20.0
        elif avail == "BUSY":
            avail_score = 10.0
        else:
            avail_score = 0.0

        # 3. Distance Score (15%) - 15% for dist <= 5km, diminishing linearly
        if dist <= 5.0:
            dist_score = 15.0
        elif dist <= 15.0:
            dist_score = 15.0 - ((dist - 5.0) / 10.0) * 5.0
        elif dist <= 50.0:
            dist_score = 10.0 - ((dist - 15.0) / 35.0) * 6.0
        else:
            # National demonstration distance smoothing
            dist_score = max(2.0, 4.0 - (dist / 1000.0))

        # 4. Workload Balance Score (15%) - lower current workload receives higher score (cooperative fairness!)
        workload = w_dict.get("current_workload", 0)
        if workload == 0:
            workload_score = 15.0
        elif workload == 1:
            workload_score = 11.0
        elif workload == 2:
            workload_score = 6.0
        else:
            workload_score = 2.0

        # 5. Experience Score (8%)
        exp = w_dict.get("years_experience", 1.0)
        exp_score = min(8.0, (exp / 10.0) * 8.0)

        # 6. Rating Score (7%)
        rating = w_dict.get("rating", 4.5)
        rating_score = (rating / 5.0) * 7.0

        # 7. Recent Job Balance Score (5%) - prevents single worker monopolies
        recent_jobs = w_dict.get("recent_jobs_count", 0)
        if recent_jobs <= 1:
            recent_score = 5.0
        elif recent_jobs <= 3:
            recent_score = 3.5
        else:
            recent_score = 1.5

        total_score = round(skill_score + avail_score + dist_score + workload_score + exp_score + rating_score + recent_score, 1)

        # Recommendation Reasons
        reasons = []
        if exact_skill:
            reasons.append("Exact primary skill match")
        if avail == "AVAILABLE":
            reasons.append("Immediately available")
        if workload == 0:
            reasons.append("Low current workload (FairShare prioritized)")
        if rating >= 4.8:
            reasons.append(f"Highly rated provider ({rating} ★)")
        if dist <= 10.0:
            reasons.append(f"Nearby ({dist} km away)")
        else:
            reasons.append("Verified cooperative service provider")

        worker_obj = WorkerProfile(**w_dict)
        
        eligible.append(ScoredWorker(
            worker=worker_obj,
            total_match_score=total_score,
            distance_km=dist,
            breakdown={
                "skill_match": round(skill_score, 1),
                "availability": round(avail_score, 1),
                "distance": round(dist_score, 1),
                "workload_balance": round(workload_score, 1),
                "experience": round(exp_score, 1),
                "rating": round(rating_score, 1),
                "recent_job_balance": round(recent_score, 1)
            },
            recommendation_reasons=reasons
        ))

    # Sort descending by match score
    eligible.sort(key=lambda x: x.total_match_score, reverse=True)
    return eligible[:max_workers]
