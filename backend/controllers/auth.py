from config import engine
from schema .schemas import SignupRequest,LoginRequest
import jwt
from sqlalchemy import text
from fastapi import HTTPException,Header,Depends
import uuid,json,datetime,jwt
from config import pwd_context
from config import JWT_SECRET,JWT_ALGORITHM

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
            default_profile = {
    "problems_solved": [],
    "quizzes_solved": [],
    "saved_problems": [],
    "saved_quizzes": [],
    "learned_concepts": [],
    "saved_documentation": []
}
            conn.execute(
                text(
                    "INSERT INTO users(id,name,email,password,profilePhoto,level,profile)VALUES (:id,:name,:email,:password,:profilePhoto,:level,:profile)"
                ),{
                    "id":user_id,
                    "name":user.name,
                    "email":user.email,
                    "password":hashed_password,
                    "profilePhoto":user.profilePhoto,
                    "level":user.level.lower(),
                    "profile":json.dumps(user.profile or default_profile)
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
                text("SELECT id,name,email,password,profilephoto FROM users WHERE email=:email"),{"email":user.email}
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
        return {"message":f"Welcome back {validate_user.name}","token": token,
            "user_name": validate_user.name,
            "email": validate_user.email,
            "profilephoto": validate_user.profilephoto}
    except Exception as e:
        raise HTTPException(status_code=400,detail=str(e))    

     
def get_current_user(authorization:str=Header(...)):
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401,detail="Invalid authorization header")
        token=authorization.split(" ")[1]
        payload=jwt.decode(token,JWT_SECRET,algorithms=[JWT_ALGORITHM])
        user_id=payload.get("user_id")
        with engine.begin() as conn:
            user=conn.execute(
                text("SELECT * from users WHERE id=:id"),{"id":user_id}
            ).fetchone()
        if not user:
            raise HTTPException(status_code=401,detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401,detail="Invalid Token")
    except Exception as e:
        raise HTTPException(status_code=401,detail="Invalid Token")
