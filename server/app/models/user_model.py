from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class User(BaseModel):
  clerk_id: str
  
  school_name: Optional[str] = None
  schooling_level: Optional[str] = None
  deleted_date: Optional[datetime] = None
  is_active: bool = True
  roles: List[str] = Field(default_factory=lambda: ["user"])
  preferences: Dict[str, Any] = Field(default_factory=dict)

  created_at: datetime
  updated_at: datetime
  last_login: datetime


class UserUpdate(BaseModel):
  school_name: Optional[str] = None
  schooling_level: Optional[str] = None
  preferences: Optional[Dict[str, Any]] = None
