import uuid
import json
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.models import (
    CreateBookingRequest, BookingStatusUpdate, AddReviewRequest
)
from app.database import get_db_connection, get_worker_by_id

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("", response_model=dict)
def create_booking(req: CreateBookingRequest):
    # Verify worker exists and is verified
    w = get_worker_by_id(req.worker_id)
    if not w:
        raise HTTPException(status_code=404, detail="Selected worker not found")
    if w["verification_status"] != "APPROVED":
        raise HTTPException(status_code=403, detail="Unverified worker cannot accept bookings")

    booking_id = f"BK-{uuid.uuid4().hex[:6].upper()}"
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    INSERT INTO bookings (
        booking_id, customer_id, customer_name, customer_phone, worker_id,
        service_category, issue_description, urgency, service_address, latitude, longitude,
        scheduled_date, scheduled_time, estimated_amount, status, payment_method, payment_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'REQUESTED', ?, 'PENDING')
    """, (
        booking_id, req.customer_id, req.customer_name, req.customer_phone, req.worker_id,
        req.service_category, req.issue_description, req.urgency, req.service_address,
        req.latitude, req.longitude, req.scheduled_date, req.scheduled_time,
        req.estimated_amount, req.payment_method
    ))
    
    conn.commit()
    conn.close()

    return {
        "booking_id": booking_id,
        "status": "REQUESTED",
        "message": "Service request submitted successfully. Waiting for worker confirmation.",
        "worker_name": w["name"],
        "estimated_amount": req.estimated_amount
    }

@router.get("/customer/{customer_id}", response_model=List[dict])
def get_customer_bookings(customer_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT b.*, w.name as worker_name, w.phone as worker_phone, w.profile_photo as worker_photo, w.rating as worker_rating
    FROM bookings b
    LEFT JOIN workers w ON b.worker_id = w.worker_id
    WHERE b.customer_id = ?
    ORDER BY b.created_at DESC
    """, (customer_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/worker/{worker_id}", response_model=List[dict])
def get_worker_bookings(worker_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM bookings
    WHERE worker_id = ?
    ORDER BY created_at DESC
    """, (worker_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/all", response_model=List[dict])
def get_all_bookings_admin():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT b.*, w.name as worker_name, w.phone as worker_phone
    FROM bookings b
    LEFT JOIN workers w ON b.worker_id = w.worker_id
    ORDER BY b.created_at DESC
    """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.post("/status", response_model=dict)
def update_booking_status(req: BookingStatusUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM bookings WHERE booking_id = ?", (req.booking_id,))
    b = cursor.fetchone()
    if not b:
        conn.close()
        raise HTTPException(status_code=404, detail="Booking not found")

    b_dict = dict(b)
    
    # If completing job, update worker completed_jobs & workload & earnings
    if req.new_status == "COMPLETED" and b_dict["status"] != "COMPLETED":
        cursor.execute("""
        UPDATE workers
        SET completed_jobs = completed_jobs + 1,
            current_workload = MAX(0, current_workload - 1),
            earnings = earnings + ?
        WHERE worker_id = ?
        """, (b_dict["estimated_amount"], b_dict["worker_id"]))
        
        cursor.execute("UPDATE bookings SET payment_status = 'PAID' WHERE booking_id = ?", (req.booking_id,))

    cursor.execute("""
    UPDATE bookings
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE booking_id = ?
    """, (req.new_status, req.booking_id))
    
    conn.commit()
    conn.close()

    return {
        "booking_id": req.booking_id,
        "status": req.new_status,
        "message": f"Booking status updated to {req.new_status}"
    }

@router.post("/review")
def add_review(req: AddReviewRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    UPDATE bookings
    SET rating = ?, review_comment = ?
    WHERE booking_id = ?
    """, (req.rating, req.comment, req.booking_id))

    # Recalculate average worker rating
    cursor.execute("""
    UPDATE workers
    SET rating = ROUND((rating + ?) / 2.0, 2)
    WHERE worker_id = ?
    """, (req.rating, req.worker_id))

    conn.commit()
    conn.close()
    return {"status": "success", "message": "Review recorded successfully"}
