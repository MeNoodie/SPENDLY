from .database import engine, Base

def init_and_seed_db():
    """
    Creates tables if they don't exist.
    Leaves database completely at ZERO (clean state).
    Demo test data is seeded separately via `seed.py`.
    """
    Base.metadata.create_all(bind=engine)
