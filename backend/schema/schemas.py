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
