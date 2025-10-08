from schema.schemas import SolutionRequest,TestResult
from agents.examiner_agent import problems_db
from config import client
from fastapi import HTTPException
import json
def test_agent(request: SolutionRequest, current_user):
    """
    Run basic tests without full evaluation.
    """
    try:
        problem = problems_db.get(request.problem_id)
        if not problem:
            raise HTTPException(status_code=404, detail="Problem not found or expired")
        
        examples_json = json.dumps([ex.dict() for ex in problem.examples[:2]], indent=2)
        prompt = f"""
        Quickly test this code with 5 basic test cases according to the description:

        PROBLEM: {problem.description}
        EXAMPLES: {examples_json}
        CODE: {request.code}

        Return JSON with test results:
        {{
        "passed": true/false,
        "hint": "if failed, brief hint here without revealing solution and not a sinlge code hint just a idea where it lacks",
        "test_cases": [
        {{
          "input": "input1",
          "expected_output": "expected1", 
          "actual_output": "actual1",
          "passed": true/false
        }}
      ]
        }}
        """
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=5000
        )
        content = response.choices[0].message.content
        json_start = content.find('{')
        json_end = content.rfind('}') + 1
        json_str = content[json_start:json_end]
    
        result_data = json.loads(json_str)
        return TestResult(
            passed=result_data.get("passed", False),
            test_cases=result_data.get("test_cases", []),
            errors=[], 
            efficiency=None, 
            hint=result_data.get("hint", "")  
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error running tests: {str(e)}")