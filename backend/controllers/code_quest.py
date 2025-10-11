from schema.schemas import ProblemRequest,SolutionRequest
from agents.examiner_agent import examiner_agent
from agents.checker_agent import checker_agent
from fastapi import HTTPException
from agents.examiner_agent import problems_db
from controllers.auth import get_current_user
problems_db={}
def generate_problems(request: ProblemRequest, current_user):
    """
    Generate 10 problems using examiner agent and store them in problems_db
    """
    try:
        problems = examiner_agent(request.data_structure, request.topic)
        for problem in problems:
            problems_db[problem.id] = problem

        return {"problems": [p.dict() for p in problems]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating problems: {str(e)}")

    
def evaluate_solution(request:SolutionRequest,current_user):
    problem=problems_db.get(request.problem_id)
    if not problem:
        raise HTTPException(status_code=404,detail="Problem not found or expired")
    try:
        result=checker_agent(problem,request.code,request.language)
        return result
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Error evaluating solution : {str(e)}")
    