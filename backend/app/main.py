import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.modules.health import routes as health_routes
from app.modules.identity import routes as identity_routes
from app.modules.beneficiaries import routes as beneficiary_routes
from app.modules.entitlements import routes as entitlement_routes
from app.modules.donations import routes as donation_routes
from app.modules.chat import routes as chat_routes
from app.modules.admin import routes as admin_routes
from app.core.config import settings

# Initialize FastAPI App
app = FastAPI(
    title="Charity Governance Platform API",
    description="Scalable, governance-first, privacy-first charity coordination and aid allocation ledger.",
    version="1.0.0",
    docs_url="/docs" if settings.ENV == "development" else None,
    redoc_url="/redoc" if settings.ENV == "development" else None
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health_routes.router)
app.include_router(identity_routes.router)
app.include_router(beneficiary_routes.router)
app.include_router(entitlement_routes.router)
app.include_router(donation_routes.router)
app.include_router(chat_routes.router)
app.include_router(admin_routes.router)


@app.on_event("startup")
def startup_event():
    from app.core.database import Base, engine, SessionLocal
    from app.core.seed import seed_data
    # Create tables
    Base.metadata.create_all(bind=engine)
    # Seed data
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True if settings.ENV == "development" else False
    )

