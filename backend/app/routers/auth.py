import uuid
from fastapi import APIRouter, HTTPException, status
from app.models import (
    LoginRequest, AuthResponse, CustomerRegisterRequest, WorkerRegisterStepRequest
)
from app.database import get_db_connection, get_worker_by_id

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Admin Login check
    if req.role == "admin":
        if req.email in ["admin@coopai.org", "admin"] and req.password in ["admin123", "admin"]:
            conn.close()
            return AuthResponse(
                user_id="USR-ADMIN-1",
                name="COOP AI Admin",
                email="admin@coopai.org",
                role="admin",
                token=f"demo-admin-token-{uuid.uuid4().hex[:8]}",
                verification_status="APPROVED",
                identity_verified=True,
                skill_verified=True
            )
        else:
            conn.close()
            raise HTTPException(status_code=401, detail="Invalid admin credentials")

    # 2. Worker Login check
    if req.role == "worker":
        cursor.execute("SELECT * FROM workers WHERE email = ?", (req.email,))
        w = cursor.fetchone()
        conn.close()
        if w:
            w_dict = dict(w)
            return AuthResponse(
                user_id=w_dict["worker_id"],
                name=w_dict["name"],
                email=w_dict["email"],
                role="worker",
                token=f"demo-worker-token-{uuid.uuid4().hex[:8]}",
                verification_status=w_dict["verification_status"],
                identity_verified=bool(w_dict["identity_verified"]),
                skill_verified=bool(w_dict["skill_verified"])
            )
        # Check default demo worker credential
        if req.email in ["worker@coopai.demo", "rajesh.plumber@coopai.demo"]:
            return AuthResponse(
                user_id="WRK-1001",
                name="Rajesh Kumar",
                email="rajesh.plumber@coopai.demo",
                role="worker",
                token=f"demo-worker-token-WRK1001",
                verification_status="APPROVED",
                identity_verified=True,
                skill_verified=True
            )
        raise HTTPException(status_code=401, detail="Worker account not found or invalid password")

    # 3. Customer Login check
    cursor.execute("SELECT * FROM users WHERE email = ? AND role = 'customer'", (req.email,))
    u = cursor.fetchone()
    conn.close()
    
    if u:
        u_dict = dict(u)
        return AuthResponse(
            user_id=u_dict["id"],
            name=u_dict["name"],
            email=u_dict["email"],
            role="customer",
            token=f"demo-cust-token-{uuid.uuid4().hex[:8]}"
        )
        
    if req.email in ["customer@coopai.demo", "demo@coopai.org"]:
        return AuthResponse(
            user_id="USR-CUST-1",
            name="Siddharth Roy",
            email="customer@coopai.demo",
            role="customer",
            token="demo-cust-token-CUST1"
        )
        
    raise HTTPException(status_code=401, detail="Invalid email or password")

@router.post("/register/customer", response_model=AuthResponse)
def register_customer(req: CustomerRegisterRequest):
    user_id = f"USR-CUST-{uuid.uuid4().hex[:6].upper()}"
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
        INSERT INTO users (id, name, email, password, role, phone, address, city, state, latitude, longitude, profile_photo)
        VALUES (?, ?, ?, ?, 'customer', ?, ?, ?, ?, ?, ?, ?)
        """, (
            user_id, req.full_name, req.email, req.password, req.mobile,
            req.address, req.city, req.state, req.latitude, req.longitude, req.profile_photo
        ))
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=400, detail="Account with this email already exists")
    conn.close()

    return AuthResponse(
        user_id=user_id,
        name=req.full_name,
        email=req.email,
        role="customer",
        token=f"demo-cust-token-{uuid.uuid4().hex[:8]}"
    )

@router.post("/register/worker", response_model=AuthResponse)
def register_worker(req: WorkerRegisterStepRequest):
    worker_id = f"WRK-{uuid.uuid4().hex[:6].upper()}"
    conn = get_db_connection()
    cursor = conn.cursor()
    import json
    try:
        cursor.execute("""
        INSERT INTO workers (
            worker_id, name, email, phone, city, state, address, latitude, longitude,
            skills, years_experience, availability, verification_status,
            identity_verified, skill_verified, document_verified, experience_verified,
            rating, completed_jobs, current_workload, recent_jobs_count, service_area,
            languages, earnings, profile_photo, id_type, id_document_url, certificate_url,
            work_photos, bank_details
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'OFFLINE', 'PENDING', 0, 0, 0, 0, 4.5, 0, 0, 0, ?, ?, 0.0, ?, ?, ?, ?, ?, ?)
        """, (
            worker_id, req.full_name, req.email, req.mobile, req.city, req.state,
            req.address, req.latitude, req.longitude, json.dumps(req.skills),
            req.years_experience, f"{req.city} Area", json.dumps(["Hindi", "English"]),
            req.profile_photo, req.id_type, req.id_document_url, req.certificate_url,
            json.dumps(req.work_photos or []),
            json.dumps({"account_name": req.bank_account_name or "", "upi": req.upi_id or ""})
        ))
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=400, detail=f"Registration failed: {str(e)}")
    conn.close()

    return AuthResponse(
        user_id=worker_id,
        name=req.full_name,
        email=req.email,
        role="worker",
        token=f"demo-worker-token-{uuid.uuid4().hex[:8]}",
        verification_status="PENDING",
        identity_verified=False,
        skill_verified=False
    )
