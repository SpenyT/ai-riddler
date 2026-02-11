from fastapi import Request, HTTPException, status
from app.db.database import get_database
import os
from app.auth.clerk_auth import extract_clerk_data

from app.models.user_model import User
from app.models.files_model import File

USER_COLLECTION = os.getenv("USER_COLLECTION")
FILE_COLLECTION = os.getenv("FILE_COLLECTION")


async def optional_user_ctx(request: Request) -> None:
  """
  Requires a valid Clerk token, but does NOT require a Mongo user record.
  Sets:
    - request.state.clerk_id
    - request.state.claims
    - request.state.user (may be None)
  """
  clerk_id, claims = extract_clerk_data(request)

  db = await get_database()
  user = await db[USER_COLLECTION].find_one({"clerk_id": clerk_id})

  request.state.clerk_id = clerk_id
  request.state.user = user
  request.state.claims = claims


async def require_user_ctx(request: Request) -> None:
  clerk_id, claims = extract_clerk_data(request)

  db = await get_database()
  user : User = await db[USER_COLLECTION].find_one({"clerk_id": clerk_id})

  if not user or user.get("deleted_date") is not None:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="User does not exist or is deleted",
    )
  
  request.state.user_id = clerk_id
  request.state.user = user
  request.state.claims = claims


# async def require_file_ownership(request: Request) -> None:
#   require_user_ctx(request)

#   user : User = request.state.user
  
#   db = await get_database()
#   db[]

