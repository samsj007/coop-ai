import sqlite3
import json
import logging
from typing import List, Dict, Any, Optional
from app.config import DATABASE_PATH, SUPABASE_URL, SUPABASE_KEY
from app.seed_data import INITIAL_WORKERS

logger = logging.getLogger("coopai.database")

def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        latitude REAL,
        longitude REAL,
        profile_photo TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Workers Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS workers (
        worker_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        address TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        skills TEXT NOT NULL,
        years_experience REAL NOT NULL,
        availability TEXT NOT NULL,
        verification_status TEXT NOT NULL,
        identity_verified BOOLEAN NOT NULL,
        skill_verified BOOLEAN NOT NULL,
        document_verified BOOLEAN NOT NULL,
        experience_verified BOOLEAN NOT NULL,
        rating REAL NOT NULL,
        completed_jobs INTEGER NOT NULL,
        current_workload INTEGER NOT NULL,
        recent_jobs_count INTEGER NOT NULL,
        service_area TEXT NOT NULL,
        languages TEXT NOT NULL,
        earnings REAL NOT NULL,
        profile_photo TEXT,
        id_type TEXT,
        id_document_url TEXT,
        certificate_url TEXT,
        work_photos TEXT,
        bank_details TEXT
    )
    """)

    # Bookings Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bookings (
        booking_id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        worker_id TEXT NOT NULL,
        service_category TEXT NOT NULL,
        issue_description TEXT NOT NULL,
        urgency TEXT NOT NULL,
        service_address TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        scheduled_date TEXT NOT NULL,
        scheduled_time TEXT NOT NULL,
        estimated_amount REAL NOT NULL,
        status TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        payment_status TEXT DEFAULT 'PENDING',
        rating REAL,
        review_comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Demand Snapshots Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS demand_snapshots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        forecast_date TEXT NOT NULL,
        service_category TEXT NOT NULL,
        area TEXT NOT NULL,
        predicted_demand INTEGER NOT NULL,
        demand_level TEXT NOT NULL,
        trend TEXT NOT NULL,
        confidence REAL NOT NULL,
        reason TEXT,
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()

    # Seed workers if table empty
    cursor.execute("SELECT COUNT(*) FROM workers")
    count = cursor.fetchone()[0]
    if count == 0:
        logger.info("Seeding 20 initial fictional Indian service providers...")
        for w in INITIAL_WORKERS:
            cursor.execute("""
            INSERT INTO workers (
                worker_id, name, email, phone, city, state, address, latitude, longitude,
                skills, years_experience, availability, verification_status,
                identity_verified, skill_verified, document_verified, experience_verified,
                rating, completed_jobs, current_workload, recent_jobs_count, service_area,
                languages, earnings, profile_photo, id_type, id_document_url, certificate_url,
                work_photos, bank_details
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                w["worker_id"], w["name"], w["email"], w["phone"], w["city"], w["state"],
                w["address"], w["latitude"], w["longitude"], json.dumps(w["skills"]),
                w["years_experience"], w["availability"], w["verification_status"],
                w["identity_verified"], w["skill_verified"], w["document_verified"],
                w["experience_verified"], w["rating"], w["completed_jobs"],
                w["current_workload"], w["recent_jobs_count"], w["service_area"],
                json.dumps(w["languages"]), w["earnings"], w.get("profile_photo"),
                w.get("id_type"), w.get("id_document_url"), w.get("certificate_url"),
                json.dumps(w.get("work_photos", [])), json.dumps(w.get("bank_details", {})),
            ))

        # Seed default Admin & Demo Customer users
        cursor.execute("""
        INSERT OR IGNORE INTO users (id, name, email, password, role, phone, city, state)
        VALUES ('USR-ADMIN-1', 'COOP AI Admin', 'admin@coopai.org', 'admin123', 'admin', '+91 90000 00000', 'Bengaluru', 'Karnataka')
        """)
        cursor.execute("""
        INSERT OR IGNORE INTO users (id, name, email, password, role, phone, city, state)
        VALUES ('USR-CUST-1', 'Siddharth Roy', 'customer@coopai.demo', 'demo123', 'customer', '+91 98888 77777', 'Bengaluru', 'Karnataka')
        """)

        conn.commit()

    conn.close()

# Helper accessors
def save_demand_snapshots(forecast_date: str, predictions: List[Dict[str, Any]]) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    for p in predictions:
        cursor.execute("""
        INSERT INTO demand_snapshots (
            forecast_date, service_category, area, predicted_demand, demand_level, trend, confidence, reason
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            forecast_date,
            p["service"],
            p["area"],
            p["predicted_demand"],
            p["demand_level"],
            p["trend"],
            p["confidence"],
            p["reason"]
        ))
    conn.commit()
    conn.close()
    return True

def get_latest_demand_snapshots(limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM demand_snapshots ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_all_workers() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM workers")
    rows = cursor.fetchall()
    conn.close()
    result = []
    for r in rows:
        w = dict(r)
        w["skills"] = json.loads(w["skills"]) if w["skills"] else []
        w["languages"] = json.loads(w["languages"]) if w["languages"] else []
        w["work_photos"] = json.loads(w["work_photos"]) if w["work_photos"] else []
        w["bank_details"] = json.loads(w["bank_details"]) if w["bank_details"] else {}
        w["identity_verified"] = bool(w["identity_verified"])
        w["skill_verified"] = bool(w["skill_verified"])
        w["document_verified"] = bool(w["document_verified"])
        w["experience_verified"] = bool(w["experience_verified"])
        result.append(w)
    return result

def get_worker_by_id(worker_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM workers WHERE worker_id = ?", (worker_id,))
    r = cursor.fetchone()
    conn.close()
    if not r:
        return None
    w = dict(r)
    w["skills"] = json.loads(w["skills"]) if w["skills"] else []
    w["languages"] = json.loads(w["languages"]) if w["languages"] else []
    w["work_photos"] = json.loads(w["work_photos"]) if w["work_photos"] else []
    w["bank_details"] = json.loads(w["bank_details"]) if w["bank_details"] else {}
    w["identity_verified"] = bool(w["identity_verified"])
    w["skill_verified"] = bool(w["skill_verified"])
    w["document_verified"] = bool(w["document_verified"])
    w["experience_verified"] = bool(w["experience_verified"])
    return w

def update_worker_verification(worker_id: str, status: str, identity: bool, skill: bool) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE workers
    SET verification_status = ?, identity_verified = ?, skill_verified = ?, document_verified = ?
    WHERE worker_id = ?
    """, (status, identity, skill, identity and skill, worker_id))
    conn.commit()
    conn.close()
    return True
