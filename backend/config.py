import os
from sqlalchemy import create_engine
from passlib.context import CryptContext
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL=os.getenv("DATABASE_URL")
JWT_SECRET=os.getenv("JWT_SECRET")
JWT_ALGORITHM=os.getenv("JWT_ALGORITHM")

engine=create_engine(DATABASE_URL,pool_pre_ping=True)

pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")

SessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)