from config import engine, pwd_context, JWT_SECRET, JWT_ALGORITHM
from schema.schemas import SignupRequest, LoginRequest
from sqlalchemy import text
from fastapi import HTTPException, Header, Depends
import jwt, uuid, json, datetime

def signup(user: SignupRequest):
    try:
        with engine.begin() as conn:
            # Check if email already exists
            if conn.execute(
                text("SELECT id FROM users WHERE email = :email"),
                {"email": user.email}
            ).fetchone():
                raise HTTPException(status_code=400, detail="Email already exists")

            # Handle long passwords safely
            safe_password = user.password[:72]
            hashed_password = pwd_context.hash(safe_password)

            default_profile = {
                "problems_solved": [],
                "quizzes_solved": [],
                "saved_problems": [],
                "saved_quizzes": [],
                "learned_concepts": [],
                "saved_documentation": []
            }

            user_id = str(uuid.uuid4())
            conn.execute(
                text("""
                    INSERT INTO users (id, name, email, password, profilePhoto, level, profile)
                    VALUES (:id, :name, :email, :password, :profilePhoto, :level, :profile)
                """),
                {
                    "id": user_id,
                    "name": user.name,
                    "email": user.email,
                    "password": hashed_password,
                    "profilePhoto": user.profilePhoto,
                    "level": user.level.lower(),
                    "profile": json.dumps(user.profile or default_profile)
                }
            )

        return {
            "message": "Account created successfully",
            "user": {
                "id": user_id,
                "name": user.name
            }
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def login(user: LoginRequest):
    try:
        with engine.begin() as conn:
            record = conn.execute(
                text("SELECT id, name, email, password, profilephoto FROM users WHERE email = :email"),
                {"email": user.email}
            ).fetchone()

            if not record:
                raise HTTPException(status_code=400, detail="Invalid email or password")

            # Truncate password before verifying (bcrypt 72-byte limit)
            safe_password = user.password[:72]
            if not pwd_context.verify(safe_password, record.password):
                raise HTTPException(status_code=400, detail="Invalid email or password")

            token = jwt.encode(
                {
                    "user_id": str(record.id),
                    "email": record.email,
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
                },
                JWT_SECRET,
                algorithm=JWT_ALGORITHM
            )

        return {
            "message": f"Welcome back {record.name}",
            "token": token,
            "user_name": record.name,
            "email": record.email,
            "profilephoto": record.profilephoto
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def get_current_user(authorization: str = Header(...)):
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization header")

        token = authorization.split(" ")[1]
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")

        with engine.begin() as conn:
            user = conn.execute(
                text("SELECT * FROM users WHERE id = :id"),
                {"id": user_id}
            ).fetchone()

        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return user

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
