from fastapi import APIRouter, Request, HTTPException, status
from datetime import datetime
import os

from app.db.database import get_database
from app.models.user_model import User, UserUpdate

router = APIRouter()
USER_COLLECTION: str = os.getenv("USER_COLLECTION")


@router.get("/me", response_model=User)
async def get_me(request: Request):
  return request.state.user


@router.patch("/me", response_model=User)
async def update_me(payload: UserUpdate, request: Request):
  db = await get_database()
  existing = request.state.user

  update_data = payload.model_dump(exclude_unset=True)

  if not update_data:
    return existing

  update_data["updated_at"] = datetime.now()

  await db[USER_COLLECTION].update_one(
    {"_id": existing["_id"]},
    {"$set": update_data},
  )
  return await db[USER_COLLECTION].find_one({"_id": existing["_id"]})


@router.delete("/me", response_model=User)
async def delete_me(request: Request):
  db = await get_database()
  existing = request.state.user

  if existing.get("deleted_date") is not None:
    return existing

  now = datetime.now()
  await db[USER_COLLECTION].update_one(
    {"_id": existing["_id"]},
    {"$set": {"deleted_date": now, "is_active": False, "updated_at": now}},
  )
  return await db[USER_COLLECTION].find_one({"_id": existing["_id"]})
