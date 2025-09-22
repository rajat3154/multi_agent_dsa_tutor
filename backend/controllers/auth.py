from config import engine
from schema .schemas import SignupRequest,LoginRequest
from sqlalchemy import text
from fastapi import HTTPException
import uuid,json,datetime,jwt
from config import pwd_context
from config import  JWT_SECRET,JWT_ALGORITHM

def signup(user:SignupRequest):
    try:
        with engine.begin() as conn:
            if conn.execute(
                text("SELECT id FROM users WHERE email=:email"),
                {"email":user.email}
            ).fetchone():
                raise HTTPException(status_code=400,detail="Email Already Exists")
            user_id=str(uuid.uuid4())
            hashed_password=pwd_context.hash(user.password)
            conn.execute(
                text(
                    "INSERT INTO users(id,name,email,password,profilePhoto,level,problems,quizzes,profile)VALUES (:id,:name,:email,:password,:profilePhoto,:level,:problems,:quizzes,:profile)"
                ),{
                    "id":user_id,
                    "name":user.name,
                    "email":user.email,
                    "password":hashed_password,
                    "profilePhoto":user.profilePhoto,
                    "level":user.level.lower(),
                    "problems":user.problems or [],
                    "quizzes":user.quizzes or [],
                    "profile":json.dumps(user.profile or {})
                }
            )
        return {
            "message":"Account created Successfully",
            "user":{
                "id":user_id,
                "name":user.name
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400,detail=str(e))
    
def login(user:LoginRequest):
    try :
        with engine.begin() as conn:
            validate_user=conn.execute(
                text("SELECT id,name,email,password FROM users WHERE email=:email"),{"email":user.email}
            ).fetchone()
            validate_password=pwd_context.verify(user.password,validate_user.password)
            if not validate_user or not validate_password:
                raise HTTPException(400,"Invalid email or password")
            token=jwt.encode(
                {
                    "user_id":str(validate_user.id),
                    "email":validate_user.email,
                    "exp":datetime.datetime.utcnow()+datetime.timedelta(hours=24)
                },JWT_SECRET,algorithm=JWT_ALGORITHM
            )
        return {"message":f"Welcome back {validate_user.name}","token":token}
    except Exception as e:
        raise HTTPException(status_code=400,detail=str(e))    

     