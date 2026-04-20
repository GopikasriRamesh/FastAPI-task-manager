from pydantic import BaseModel,EmailStr
from typing import List,Optional

class TaskBase(BaseModel):
    title:str 
    description:Optional[str]=None
    
class TaskCreate(TaskBase):
    pass 

class TaskUpdate(BaseModel):
    title:Optional[str]=None
    description:Optional[str]=None
    completed:Optional[bool]=None
    
class Task(TaskBase):
    id:int 
    completed:bool
    owner_id:int
    
    class Config:
        from_attributes=True
        
class UserBase(BaseModel):
    email:EmailStr
    
class UserCreate(UserBase):
    password:str 
    
class User(UserBase):
    id:int
    tasks:List[Task]=[]
    
    class Config:
        from_attributes=True
        
class Token(BaseModel):
    access_token:str
    token_type:str
    
class TokenData(BaseModel):
    email:Optional[str]=None
    
    
    
