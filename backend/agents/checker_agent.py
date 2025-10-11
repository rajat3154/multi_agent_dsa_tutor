import json
from fastapi.encoders import jsonable_encoder
from schema.schemas import Problem
from config import client 

def checker_agent(problem:Problem,user_code:str,language:str)->dict:
      """
      Evaluates user's code against problem examples.
      Simplified version for demosntration:runs example safely.
      """
      prompt=f"""
      Evaluate the following code solution for the problem:

      PROBLEM:
      {problem.description}

      EXAMPLES:
      {json.dumps([ex.dict() for ex in problem.examples],indent=2)}

      CONSTRAINTS:
      {json.dumps(problem.constraints,indent=2)}

      USER'S CODE({language}):
      {user_code}

      OPTIMAL SOLUTION:
      {problem.optimal_solution}

      Please eveluate the user's code and :
      1.Generate 5 diverse test cases with inputs and expected outputs.
      2.Determine if the code passes all test cases
      3.Provide detailed errors for any failed test cases
      4.Analyze time and space complexity compared to optimal solution

      Return the response as valid JSON with this structure:
      {{
      "passed":true/false,
      "test_cases":[
      {{
      "input":"test_input",
      "expected_output":"expected_output",
      "actual_output":"actual_output",
      "passed":true/false,
      }}],
      "errors":[
      {{
      "type":"ErrorType",
      "test_case":1,
      "message":"Error Description and on next line Solution : What changes are needed to make in code
      }}
      ],
      "efficiency":{{
       "time_complexity": "O(...)",
        "optimal_time_complexity": "O(...)",
        "space_complexity": "O(...)", 
        "optimal_space_complexity": "O(...)",
        "comparison": "Comparison explanation"
      }}
      }}
      """
      try:
            response=client.chat.completions.create(
                  model="openai/gpt-oss-120b",
                  messages=[{"role":"user","content":prompt}],
                  temperature=0.3,
                  max_tokens=3000
            )
            content=response.choices[0].message.content
            json_start=content.find('{')
            json_end=content.rfind('}')+1
            json_str=content[json_start:json_end]

            result_data=json.loads(json_str)

            return jsonable_encoder({
            "passed": result_data.get("passed", False),
            "test_cases": result_data.get("test_cases", []),
            "errors": result_data.get("errors", []),
            "efficiency": result_data.get("efficiency")
        })
      except Exception as e:
            raise Exception(f"Checker agent error : {str(e)}")

