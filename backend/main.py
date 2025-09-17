from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os 
load_dotenv()

DATABASE_URL=os.getenv("DATABASE_URL")

engine=create_engine(DATABASE_URL,pool_pre_ping=True)

SessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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

