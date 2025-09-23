from config import engine
from sqlalchemy import text
from fastapi import HTTPException
def get_profile(current_user):
    """
    Returns the profile of the logged-in user.
    """
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "profilePhoto": current_user.profilephoto,
        "level": current_user.level,
        "profile": current_user.profile  
    }

def get_my_concepts(current_user):
    """
    Fetch all DSA concepts/explanations created by the logged-in user.
    """
    try:
        with engine.begin() as conn:
            response=conn.execute(
                text("""
                    SELECT id, title, content, markdown_content, language, difficulty, created_at, updated_at
                    FROM dsa_explanations
                    WHERE user_id = :user_id
                    ORDER BY created_at DESC
                """),{"user_id":current_user.id}
            ).fetchall()
            concepts=[]
            for row in response:
                concepts.append({
                    "id":str(row.id),
                    "title":row.title,
                    "content":row.content,
                    "markdown_content":row.markdown_content,
                    "language": row.language,
                    "difficulty": row.difficulty,
                    "created_at": row.created_at,
                    "updated_at": row.updated_at
                })
            return {"user_id":str(current_user.id),"concepts":concepts}
    except Exception as e:
        raise HTTPException(status_code=400,detail=str(e))
