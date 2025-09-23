from fastapi import FastAPI,HTTPException,Depends
from sqlalchemy import  text
from fastapi.middleware.cors import CORSMiddleware
from schema.schemas import SignupRequest,LoginRequest,ExplainationResponse,ExplainationRequest
from dotenv import load_dotenv
from controllers.auth import signup,login,get_current_user
from controllers.profile_details import get_profile,get_my_concepts
from controllers.generative import generate_explaination
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

@app.post("/api/generate-explaination",response_model=ExplainationResponse)
def explains_concept(request: ExplainationRequest,current_user=Depends(get_current_user)):
    return generate_explaination(request,current_user)


@app.get("/api/profile")
def getprofile(user=Depends(get_current_user)):
    return get_profile(user)


@app.get("/api/my-concepts")
def get_user_concepts(user=Depends(get_current_user)):
    return get_my_concepts(user)