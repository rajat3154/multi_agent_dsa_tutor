import json,uuid
from fastapi import HTTPException
from schema.schemas import Problem
from config import client
from typing import List
problems_db={}
def examiner_agent(data_structure:str,topic:str)->List[Problem]:
      """AI agent that generates coding problems based on the data structure and topic"""
      prompt=f"""
      Generate 10 highly detailed coding problems on
 for {data_structure} focusing on {topic}.
      Return only a valid JSON array.Don not include any explainations,notes,or text outside the JSON.

      Each problem must include:

      -title (string):a clear,descriptive problem title
      -difficulty (easy/medium/hard)
      -description (string): provide a comprehensive description including context,usecase and problem scenario( 5-6 sentences minimum)
      -examples:list of objects with:
            -input(string)
            -expected_output(string)
            -explaination (string,2-3 sentences explaining why the output is expected)
            Include at least 3 examples per problem.
      -constraints:list of strings (include array/list size of limits,value limits,time/space complexity hints if relevant)
      -starter_code(string):provide a scaffold function or class in python ready to implement,with comments guiding the user
      -optimal_solution(string):providee a fully working python solution
      -optimal_explaination(string):explain the solution in detail (4-5 sentences),including reasoning,algorithm choice, and complexity analysis.
      "For examples,always return 'input' and 'expected_output'
      as strings.Escape all quotes inside strings using backslash(\")."
      """
      try:
            response=client.chat.completions.create(
                  model="openai/gpt-oss-120b",
                  messages=[{"role":"user","content":prompt}],
                  temperature=0.7,
                  max_tokens=10000
            )
            content=response.choices[0].message.content.strip()
            json_start=content.find('[')
            json_end=content.rfind(']')+1
            if json_start==-1 or json_end==-1:
                  raise Exception("No JSON array found in AI response")
            json_str=content[json_start:json_end]
            try:
                  problems_data=json.loads(json_str)
            except json.JSONDecodeError as e:
                  print("Raw AI response : ",content)
                  raise Exception(f"JSON parsing error: {str(e)}")
            for problem_data in problems_data:
                  for example in problem_data.get("examples",[]):
                        if isinstance(example.get("input"),list):
                              example["input"]=json.dumps(example["input"])
                        if isinstance(example.get("expected_output"),list):
                              example["expected_output"]=json.dumps(example["expected_output"])
                        example.setdefault("explanation","")
            problems=[]
            for problem_data in problems_data:
                  problem_id=str(uuid.uuid4())
                  problem = Problem(
                id=problem_id,
                title=problem_data["title"],
                difficulty=problem_data["difficulty"],
                description=problem_data["description"],
                examples=problem_data["examples"],
                constraints=problem_data["constraints"],
                starter_code=problem_data.get("starter_code", ""),
                optimal_solution=problem_data.get("optimal_solution", ""),
                optimal_explanation=problem_data.get("optimal_explanation", "")
            )
                  problems.append(problem)
                  problems_db[problem_id]=problem
            return problems

      except Exception as e:
            raise HTTPException(status_code=500, detail=f"Examiner agent error: {str(e)}")
