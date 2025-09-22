from fastapi import FastAPI
from sqlalchemy import  text
from fastapi.middleware.cors import CORSMiddleware
from schema.schemas import SignupRequest,LoginRequest
from dotenv import load_dotenv
from controllers.auth import signup,login
from config import engine,SessionLocal
load_dotenv()

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()
        from sqlalchemy import text

@app.on_event("startup")
def startup_event():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            print("Server is running on port 8000")
            print("Database connected successfully!")
    except Exception as e:
        print("Database connection failed:", e)


@app.post("/signup")
def signsup(user:SignupRequest):
    return signup(user)

@app.post("/login")
def logsin(user:LoginRequest):
    return login(user)

 

