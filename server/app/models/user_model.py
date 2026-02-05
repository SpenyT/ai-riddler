from pydantic import BaseModel, Field, EmailStr, BeforeValidator
from typing import List, Optional, Annotated
from datetime import datetime

PyObjectId = Annotated[str, BeforeValidator(str)]

class User(BaseModel):
  id: Optional[PyObjectId] = Field(alias="_id", default=None)
  clerk_id: str = Field(..., description="Unique ID provided by Clerk (user_xxx)")
  email: EmailStr
  first_name: Optional[str] = None
  last_name: Optional[str] = None
  classes: List[str] = []
  created_at: datetime = Field(default_factory=datetime.now)
  last_login: datetime = Field(default_factory=datetime.now)

  class Config:
    populate_by_name = True
    json_schema_extra = {
      "example": {
        "clerk_id": "user_2lny123abc...",
        "email": "student@university.edu",
        "first_name": "Jane",
        "last_name": "Doe",
        "classes": ["MATH 101", "PHYSICS 202"]
      }
    }

class UserMetadata(BaseModel):
  id: Optional[PyObjectId] = Field(alias="_id", default=None)
  clerk_id: str
  email: EmailStr
  first_name: Optional[str] = None
  last_name: Optional[str] = None