from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.models import (
    WorkerProfile, FairShareAllocationRequest, ScoredWorker, AdminVerificationAction
)
from app.database import get_all_workers, get_worker_by_id, update_worker_verification, get_db_connection
from app.services.fairshare_service import calculate_fairshare_allocation

router = APIRouter(prefix="/workers", tags=["Workers"])

@router.get("", response_model=List[WorkerProfile])
def list_workers(city: Optional[str] = None, skill: Optional[str] = None):
    workers = get_all_workers()
    if city:
        workers = [w for w in workers if w["city"].lower() == city.lower()]
    if skill:
        workers = [w for w in workers if any(skill.lower() in s.lower() for s in w["skills"])]
    return [WorkerProfile(**w) for w in workers]

@router.get("/pending-verification", response_model=List[WorkerProfile])
def get_pending_verifications():
    workers = get_all_workers()
    pending = [w for w in workers if w["verification_status"] in ["PENDING", "INFO_REQUESTED"]]
    return [WorkerProfile(**w) for w in pending]

@router.get("/{worker_id}", response_model=WorkerProfile)
def get_worker(worker_id: str):
    w = get_worker_by_id(worker_id)
    if not w:
        raise HTTPException(status_code=404, detail="Worker not found")
    return WorkerProfile(**w)

@router.post("/fairshare-allocate", response_model=List[ScoredWorker])
def allocate_fairshare_workers(req: FairShareAllocationRequest):
    return calculate_fairshare_allocation(
        service_category=req.service_category,
        urgency=req.urgency,
        cust_lat=req.customer_latitude,
        cust_lng=req.customer_longitude,
        max_workers=req.max_workers
    )

@router.post("/admin/verify")
def admin_verify_worker(action: AdminVerificationAction):
    w = get_worker_by_id(action.worker_id)
    if not w:
        raise HTTPException(status_code=404, detail="Worker not found")

    new_status = "APPROVED" if action.action == "APPROVE" else ("REJECTED" if action.action == "REJECT" else "INFO_REQUESTED")
    identity_val = True if action.action == "APPROVE" else False
    skill_val = True if action.action == "APPROVE" else False

    update_worker_verification(action.worker_id, new_status, identity_val, skill_val)
    
    return {
        "message": f"Worker {action.worker_id} status updated to {new_status}",
        "worker_id": action.worker_id,
        "status": new_status,
        "identity_verified": identity_val,
        "skill_verified": skill_val
    }

@router.post("/{worker_id}/toggle-availability")
def toggle_worker_availability(worker_id: str, availability: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE workers SET availability = ? WHERE worker_id = ?", (availability, worker_id))
    conn.commit()
    conn.close()
    return {"status": "success", "worker_id": worker_id, "availability": availability}
