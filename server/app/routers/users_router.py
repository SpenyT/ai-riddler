from fastapi import APIRouter, HTTPException, status
from pydantic import EmailStr
from datetime import datetime
import os

from app.db.database import get_database
from app.models.user_model import User, UserMetadata

router = APIRouter()

user_collection : str = os.getenv("USER_COLLECTION")
print("users: " + user_collection)

@router.post("/", response_description="Create a new user", response_model=User)
async def create_user(user: UserMetadata):
  db = await get_database()
  existing_user = await db[user_collection].find_one({"clerk_id": user.clerk_id})

  if existing_user:
    await db[user_collection].update_one(
      {"_id": existing_user["_id"]}, 
      {"$set": {"last_login": datetime.now()}}
    )
    return existing_user
  
  current_time = datetime.now()
  user_doc = {
    "clerk_id": user.clerk_id,
    "email": user.email,
    "first_name": user.first_name,
    "last_name": user.last_name,
    "classes": [],
    "created_at": current_time,
    "last_login": current_time
  }

  new_user = await db[user_collection].insert_one(user_doc)
  created_user = await db[user_collection].find_one({"_id": new_user.inserted_id})
  return created_user


@router.get("/{clerk_id}", response_description="Get user details", response_model=User)
async def get_user(clerk_id: str):
  db = await get_database()
  existing_user = await db[user_collection].find_one({"clerk_id": clerk_id})

  if not existing_user:
    raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")

  return existing_user
