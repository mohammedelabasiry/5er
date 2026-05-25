from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "charity-governance-api"
    }

@router.get("/api/v1/health")
def full_health_check(db: Session = Depends(get_db)):
    health_status = {
        "status": "healthy",
        "database": "disconnected",
        "postgis": "not_installed",
        "details": {}
    }
    
    try:
        # Check basic database connection
        db.execute(text("SELECT 1"))
        health_status["database"] = "connected"
        
        # Check PostGIS installation status
        result = db.execute(text("SELECT postgis_full_version()"))
        postgis_version = result.scalar()
        health_status["postgis"] = "installed"
        health_status["details"]["postgis_version"] = postgis_version
        
    except Exception as e:
        health_status["status"] = "unhealthy"
        health_status["details"]["error"] = str(e)
        
    return health_status
