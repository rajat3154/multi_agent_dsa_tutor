import os
from sqlalchemy import create_engine
from passlib.context import CryptContext
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from groq import Groq
load_dotenv()

DATABASE_URL=os.getenv("DATABASE_URL")
JWT_SECRET=os.getenv("JWT_SECRET")
JWT_ALGORITHM=os.getenv("JWT_ALGORITHM")
GROQ_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
client = Groq(api_key=GROQ_KEY) if GROQ_KEY else None
engine=create_engine(DATABASE_URL,pool_pre_ping=True)

pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")

SessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)