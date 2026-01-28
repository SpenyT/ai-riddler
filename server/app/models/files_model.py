from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional, Annotated
from datetime import datetime

PyObjectId = Annotated[str, BeforeValidator(str)]

class FileMetadata(BaseModel):
  id: Optional[PyObjectId] = Field(alias="_id", default=None)
  date_uploaded: datetime = Field(default_factory=datetime.now)
  relevant_date: datetime
  file_type: str
  class_in_question: str
  filename: str
  
class Config:
  populate_by_name = True
  json_schema_extra = {
    "example": {
      "relevant_date": "2023-10-27T00:00:00",
      "file_type": "application/pdf",
      "class_in_question": "History 101",
      "filename": "syllabus.pdf"
    }
}