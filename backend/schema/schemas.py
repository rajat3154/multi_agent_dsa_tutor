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



