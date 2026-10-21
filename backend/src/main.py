from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db.init_db import init_and_seed_db
from .auth.routes import router as auth_router
from .api.routes_dashboard import router as dashboard_router
from .api.routes_expenses import router as expenses_router
from .api.routes_profile import router as profile_router
from .api.routes_decisions import router as decisions_router

# Initialize FastAPI application
app = FastAPI(
    title="Spendly Financial Engine API",
    description="Real-time financial profile, authentication, expenses management, timeline, and decision evaluation API",
    version="1.0.0"
)

# Enable CORS for local Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database tables on startup
@app.on_event("startup")
def on_startup():
    init_and_seed_db()

# Mount API routers
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(expenses_router)
app.include_router(profile_router)
app.include_router(decisions_router)

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "Spendly Financial Engine",
        "version": "1.0.0"
    }
