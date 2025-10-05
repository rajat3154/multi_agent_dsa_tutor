from typing import Optional,List,Dict
from pydantic import BaseModel
import uuid

#-------------------SignUp----------------------------#
class SignupRequest(BaseModel):
      name:str
      email:str
      password:str
      profilePhoto:Optional[str]=None
      level:Optional[str]="beginner"
      problems:Optional[List[uuid.UUID]]=[]
      quizzes:Optional[List[uuid.UUID]]=[]
      profile:Optional[Dict]={}
#-------------------SignUp----------------------------#

#-------------------Login----------------------------#
class LoginRequest(BaseModel):
    email: str
    password: str
#-------------------Login----------------------------#
#-------------------Query----------------------------#
class Query(BaseModel):
    query: str
#-------------------Query----------------------------#
#-------------------Explaination Request----------------------------#
class ExplainationRequest(BaseModel):
     concept:str
     language:str="python"
     difficulty:str="beginner"
#-------------------Explaination Request----------------------------#
#-------------------Explaination Response----------------------------#
class ExplainationResponse(BaseModel):
     title:str
     content:str
     markdown_content:Optional[str]=None
#-------------------Explaination Response----------------------------#
#-------------------Problem Request----------------------------#
class ProblemRequest(BaseModel):
     data_structure:str
     topic:str
#-------------------Problem Request----------------------------#
#-------------------Solution Request----------------------------#
class SolutionRequest(BaseModel):
     problem_id:str
     code:str
     language:str
#-------------------Solution Request----------------------------#
#-------------------Test Cases----------------------------#
class TestCase(BaseModel):
     input:str
     expected_output:str
     explaination:Optional[str]=None
#-------------------Test Cases----------------------------#
#-------------------Problem----------------------------#
class Problem(BaseModel):
     id:str
     title:str
     difficulty:str
     description:str
     examples:List[TestCase]
     constraints:List[str]
     starter_code:Optional[str]=None
     optimal_solution:Optional[str]=None
     optimal_explaination:Optional[str]=None
#-------------------Problem----------------------------#
#-------------------Test Result----------------------------#
class TestResult(BaseModel):
     passed:bool
     test_cases:List[Dict]
     errors:List[Dict]=[]
     efficiency:Optional[Dict]=None
#-------------------Test Case Result----------------------------#




