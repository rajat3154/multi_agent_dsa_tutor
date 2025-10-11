from agents.quiz_agent import generate_quiz, evaluate_quizzes_with_agent, quizzes_db
from schema.schemas import QuizRequest, EvaluationRequest
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from controllers.auth import get_current_user

def generate_quizes(request: QuizRequest,current_user):
    """Generate a new quiz and store it in memory."""
    try:
        quiz = generate_quiz(request)
        quizzes_db[quiz.quiz_id] = quiz
        return quiz
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating quiz: {str(e)}")


def evaluate_quiz(quiz_id: str, request: EvaluationRequest,current_user):
    """Evaluate answers for a specific quiz."""
    try:
        if quiz_id not in quizzes_db:
            raise HTTPException(status_code=404, detail="Quiz not found")

        quiz = quizzes_db[quiz_id]
        answers = {}
        for k, v in request.answers.items():
            try:
                key_int = int(k)
                answers[key_int] = v
            except ValueError:
                raise HTTPException(
                    status_code=422,
                    detail=f"Invalid answer key type: '{k}'. Keys must match Question.id as integers."
                )
        result = evaluate_quizzes_with_agent(quiz_id, answers)
        return result
    except HTTPException:
        raise
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "message": "Failed to evaluate quiz",
                "error": str(e),
                "quiz_id": quiz_id
            }
        )
