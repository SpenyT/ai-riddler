from fastapi import APIRouter, Depends, Request
from datetime import datetime
import os

from app.auth.full_auth import optional_user_ctx
from app.db.database import get_database
from app.models.user_model import User

router = APIRouter()
USER_COLLECTION: str = os.getenv("USER_COLLECTION")

@router.post("/", dependencies=[Depends(optional_user_ctx)], response_model=User)
async def create_user(request: Request):
  db = await get_database()
  clerk_id = request.state.clerk_id
  existing = request.state.user

  now = datetime.now()

  if existing:
    await db[USER_COLLECTION].update_one(
      {"_id": existing["_id"]},
      {"$set": {"last_login": now, "updated_at": now}},
    )
    return await db[USER_COLLECTION].find_one({"_id": existing["_id"]})

  user_doc : User = {
    "clerk_id": clerk_id,
    "school_name": None,
    "schooling_level": None,
    "deleted_date": None,
    "is_active": True,
    "roles": ["user"],
    "preferences": {},
    "created_at": now,
    "updated_at": now,
    "last_login": now,
  }

  res = await db[USER_COLLECTION].insert_one(user_doc)
  return await db[USER_COLLECTION].find_one({"_id": res.inserted_id})
