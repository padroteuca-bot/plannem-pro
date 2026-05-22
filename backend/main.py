import os
import json
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, Session
import bcrypt
from jose import JWTError, jwt

# Import data NEM
from nem_data import (
    FASES_GRADOS,
    CAMPOS_FORMATIVOS,
    EJES_ARTICULADORES,
    CONTENIDOS_PDA,
    INSTRUMENTOS_EVALUACION,
    TIPOS_EVALUACION,
    ESCENARIOS
)

# Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./plannem.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "plannem_secret_dev_key_12345")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

# Database Setup
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    plan = Column(String, default="free") # free, monthly, yearly
    plan_expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class SchoolProfile(Base):
    __tablename__ = "school_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    school_name = Column(String)
    cct = Column(String)
    nivel = Column(String)
    turno = Column(String)
    zona_escolar = Column(String)
    sector = Column(String)

class Planeacion(Base):
    __tablename__ = "planeaciones"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    titulo = Column(String)
    fase = Column(Integer)
    grado = Column(String)
    grupo = Column(String)
    ciclo_escolar = Column(String)
    periodo_evaluacion = Column(String)
    campo_formativo = Column(String)
    metodologia = Column(String)
    contenidos = Column(JSON) # List of dicts
    pdas = Column(JSON) # List of strings
    ejes_articuladores = Column(JSON) # List of strings
    nombre_proyecto = Column(String)
    problematica = Column(String)
    justificacion = Column(Text)
    escenario = Column(String)
    producto_final = Column(String)
    productos_parciales = Column(Text)
    actividades = Column(JSON) # Actividades per moment
    evaluacion = Column(JSON)
    adecuaciones = Column(Text)
    observaciones = Column(Text)
    fecha_inicio = Column(String)
    fecha_fin = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# Security Setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode('utf-8')
    if isinstance(plain_password, str):
        plain_password = plain_password.encode('utf-8')
    return bcrypt.checkpw(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    if isinstance(password, str):
        password = password.encode('utf-8')
    return bcrypt.hashpw(password, bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Rate limiting simple dict
from collections import defaultdict
import time
login_attempts = defaultdict(list)

# FastAPI App
app = FastAPI(title="PlanNEM Pro API", docs_url=None if os.getenv("RENDER") else "/docs")

# CORS and Security Headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Should be restricted in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    return response

# Pydantic Schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class SchoolProfileSchema(BaseModel):
    school_name: str
    cct: str
    nivel: str
    turno: str
    zona_escolar: str
    sector: str

class PlaneacionSchema(BaseModel):
    titulo: str
    fase: int
    grado: str
    grupo: str
    ciclo_escolar: str
    periodo_evaluacion: str
    campo_formativo: str
    metodologia: str
    contenidos: List[dict]
    pdas: List[str]
    ejes_articuladores: List[str]
    nombre_proyecto: str
    problematica: str
    justificacion: str
    escenario: str
    producto_final: str
    productos_parciales: str
    actividades: List[dict]
    evaluacion: dict
    adecuaciones: str
    observaciones: str
    fecha_inicio: str
    fecha_fin: str

# Auth Dependencies
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user

def has_active_plan(user: User):
    return user.plan in ["monthly", "yearly"] and user.plan_expires_at and user.plan_expires_at > datetime.utcnow()

def has_free_eval(user: User, db: Session):
    planeaciones_count = db.query(Planeacion).filter(Planeacion.user_id == user.id).count()
    return planeaciones_count == 0

# --- AUTH ENDPOINTS ---

@app.post("/api/auth/register")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": str(new_user.id)}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    
    return {
        "token": access_token,
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "plan": new_user.plan,
            "plan_active": False,
            "free_eval_available": True
        }
    }

@app.post("/api/auth/login")
def login(request: Request, user_data: UserLogin, db: Session = Depends(get_db)):
    ip = request.client.host
    now = time.time()
    login_attempts[ip] = [t for t in login_attempts[ip] if now - t < 300]
    if len(login_attempts[ip]) >= 10:
        raise HTTPException(status_code=429, detail="Too many login attempts. Try again later.")
    login_attempts[ip].append(now)

    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": str(user.id)}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    
    plan_active = has_active_plan(user)
    free_eval = has_free_eval(user, db) if not plan_active else False

    return {
        "token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "plan": user.plan,
            "plan_active": plan_active,
            "free_eval_available": free_eval
        }
    }

@app.get("/api/auth/me")
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan_active = has_active_plan(current_user)
    free_eval = has_free_eval(current_user, db) if not plan_active else False
    
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "plan": current_user.plan,
        "plan_active": plan_active,
        "plan_expires_at": current_user.plan_expires_at,
        "free_eval_available": free_eval
    }

# --- NEM CURRICULUM ENDPOINTS ---

@app.get("/api/nem/fases")
def get_fases():
    return FASES_GRADOS

@app.get("/api/nem/campos")
def get_campos():
    return CAMPOS_FORMATIVOS

@app.get("/api/nem/contenidos/{fase}/{campo_id}")
def get_contenidos(fase: int, campo_id: str):
    fase_data = CONTENIDOS_PDA.get(fase, {})
    return fase_data.get(campo_id, [])

@app.get("/api/nem/ejes")
def get_ejes():
    return EJES_ARTICULADORES

@app.get("/api/nem/evaluacion")
def get_evaluacion_options():
    return {
        "instrumentos": INSTRUMENTOS_EVALUACION,
        "tipos": TIPOS_EVALUACION,
        "escenarios": ESCENARIOS
    }

# --- SUGERENCIAS INTELIGENTES ENDPOINTS ---
from nem_templates import SUGERENCIAS_PROYECTOS

@app.get("/api/nem/suggest_project")
def suggest_project(fase: int, campo: str, mes: str = ""):
    fase_data = SUGERENCIAS_PROYECTOS.get(fase, {})
    campo_data = fase_data.get(campo, {})
    
    sugerencias = []
    # If mes matches, add those
    if mes in campo_data:
        sugerencias.extend(campo_data[mes])
    
    # Always include general ones if they exist
    if "general" in campo_data:
        sugerencias.extend(campo_data["general"])
        
    if not sugerencias:
        return {"error": "No hay sugerencias precargadas para esta combinación. Intenta con Fase 3 - Lenguajes."}
        
    return {"sugerencias": sugerencias}

# --- PLANEACIONES ENDPOINTS ---

@app.post("/api/planeaciones")
def create_planeacion(planeacion: PlaneacionSchema, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not has_active_plan(current_user) and not has_free_eval(current_user, db):
        raise HTTPException(status_code=403, detail="Límite de planeaciones gratuitas alcanzado. Por favor suscríbete.")
    
    new_planeacion = Planeacion(
        user_id=current_user.id,
        titulo=planeacion.titulo,
        fase=planeacion.fase,
        grado=planeacion.grado,
        grupo=planeacion.grupo,
        ciclo_escolar=planeacion.ciclo_escolar,
        periodo_evaluacion=planeacion.periodo_evaluacion,
        campo_formativo=planeacion.campo_formativo,
        metodologia=planeacion.metodologia,
        contenidos=planeacion.contenidos,
        pdas=planeacion.pdas,
        ejes_articuladores=planeacion.ejes_articuladores,
        nombre_proyecto=planeacion.nombre_proyecto,
        problematica=planeacion.problematica,
        justificacion=planeacion.justificacion,
        escenario=planeacion.escenario,
        producto_final=planeacion.producto_final,
        productos_parciales=planeacion.productos_parciales,
        actividades=planeacion.actividades,
        evaluacion=planeacion.evaluacion,
        adecuaciones=planeacion.adecuaciones,
        observaciones=planeacion.observaciones,
        fecha_inicio=planeacion.fecha_inicio,
        fecha_fin=planeacion.fecha_fin
    )
    
    db.add(new_planeacion)
    db.commit()
    db.refresh(new_planeacion)
    return {"id": new_planeacion.id, "message": "Planeación guardada exitosamente"}

@app.get("/api/planeaciones")
def get_planeaciones(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    planeaciones = db.query(Planeacion).filter(Planeacion.user_id == current_user.id).order_by(Planeacion.created_at.desc()).all()
    return planeaciones

@app.get("/api/planeaciones/{planeacion_id}")
def get_planeacion(planeacion_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    planeacion = db.query(Planeacion).filter(Planeacion.id == planeacion_id, Planeacion.user_id == current_user.id).first()
    if not planeacion:
        raise HTTPException(status_code=404, detail="Planeación no encontrada")
    return planeacion

@app.delete("/api/planeaciones/{planeacion_id}")
def delete_planeacion(planeacion_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    planeacion = db.query(Planeacion).filter(Planeacion.id == planeacion_id, Planeacion.user_id == current_user.id).first()
    if not planeacion:
        raise HTTPException(status_code=404, detail="Planeación no encontrada")
    db.delete(planeacion)
    db.commit()
    return {"message": "Planeación eliminada exitosamente"}

# --- SCHOOL PROFILE ENDPOINTS ---

@app.post("/api/school-profile")
def update_school_profile(profile: SchoolProfileSchema, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_profile = db.query(SchoolProfile).filter(SchoolProfile.user_id == current_user.id).first()
    if db_profile:
        db_profile.school_name = profile.school_name
        db_profile.cct = profile.cct
        db_profile.nivel = profile.nivel
        db_profile.turno = profile.turno
        db_profile.zona_escolar = profile.zona_escolar
        db_profile.sector = profile.sector
    else:
        db_profile = SchoolProfile(
            user_id=current_user.id,
            school_name=profile.school_name,
            cct=profile.cct,
            nivel=profile.nivel,
            turno=profile.turno,
            zona_escolar=profile.zona_escolar,
            sector=profile.sector
        )
        db.add(db_profile)
    
    db.commit()
    return {"message": "Perfil escolar actualizado"}

@app.get("/api/school-profile")
def get_school_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(SchoolProfile).filter(SchoolProfile.user_id == current_user.id).first()
    if not profile:
        return {}
    return profile

# --- ADMIN ENDPOINTS ---

@app.get("/api/admin/users")
def get_users(request: Request, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    admin_pwd = request.headers.get("X-Admin-Password")
    if admin_pwd != ADMIN_PASSWORD:
        raise HTTPException(status_code=403, detail="Forbidden")
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [
        {
            "id": u.id, "name": u.name, "email": u.email, "plan": u.plan,
            "plan_expires_at": u.plan_expires_at, "created_at": u.created_at
        } for u in users
    ]

class ActivatePlanReq(BaseModel):
    plan: str
    password: str

@app.post("/api/admin/activate/{user_id}")
def activate_plan(user_id: int, req: ActivatePlanReq, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if req.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=403, detail="Invalid admin password")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.plan = req.plan
    days = 365 if req.plan == "yearly" else 30
    user.plan_expires_at = datetime.utcnow() + timedelta(days=days)
    
    db.commit()
    return {"message": f"Usuario {user.email} activado con plan {req.plan}."}

# Static Files
app.mount("/app", StaticFiles(directory="../frontend", html=True), name="frontend")
app.mount("/", StaticFiles(directory="../promo", html=True), name="promo")

