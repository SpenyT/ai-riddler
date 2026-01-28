from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional, List, Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]

class StudentModel(BaseModel):
  id: Optional[PyObjectId] = Field(alias="_id", default=None)
  name: str = Field(...)
  course: str = Field(...)
  gpa: float = Field(..., le=4.0)

  class Config:
    populate_by_name = True
    json_schema_extra = {
      "example": {
        "name": "Jane Doe",
        "course": "Computer Science",
        "gpa": 3.8
      }
    }

class UpdateStudentModel(BaseModel):
  name: Optional[str] = None
  course: Optional[str] = None
  gpa: Optional[float] = None