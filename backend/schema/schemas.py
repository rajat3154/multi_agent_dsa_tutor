from typing import Optional,List,Dict
from pydantic import BaseModel
import uuid
from typing import Union,Any
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
     hint: Optional[str] = None
#-------------------Test Case Result----------------------------#
#-------------------Difficulty Level----------------------------#
class DifficultyLevel(str):
     EASY="easy"
     MEDIUM="medium"
     HARD="hard"
#-------------------Difficulty Level----------------------------#
#-------------------Programming Language----------------------------#
class ProgrammingLanguage(str):
     PYTHON="python"
     JAVA="java"
     JAVASCRIPT="javascript"
     CPP="cpp"
     C="c"
#-------------------Programming Language----------------------------#
#-------------------Quiz Request----------------------------#
class QuizRequest(BaseModel):
     topic:str
     subtopic:str
     difficulty:str
     language:str
     num_questions:int=5
#-------------------Quiz Request----------------------------#
#-------------------Question----------------------------#
class Question(BaseModel):
     id:int
     type:str
     question:str
     options:Optional[List[str]]=None
     correct_answer:Union[int, str]
     explanation:str
#-------------------Question----------------------------#
#-------------------Quiz Response----------------------------#
class QuizResponse(BaseModel):
     quiz_id:str
     title:str
     description:str
     questions:List[Question]
     time_limit:int
#-------------------Quiz Response----------------------------#
#-------------------Evaluation Request----------------------------#
class EvaluationRequest(BaseModel):
     answers:Dict[int,Any]
#-------------------Evaluation Request----------------------------#
#-------------------Evaluation Result----------------------------#
class EvaluationResult(BaseModel):
     score:float
     correct_answers:int
     total_questions:int
     feedback:Dict[int,str]
     recommendation:str=""
#-------------------Evaluation Result----------------------------#





