import os
import requests
from fastapi import HTTPException

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
CLERK_API_BASE = "https://api.clerk.com/v1"

if not CLERK_SECRET_KEY:
  raise RuntimeError("CLERK_SECRET_KEY is not set")

def clerk_delete_user(user_id: str) -> None:
  url = f"{CLERK_API_BASE}/users/{user_id}"
  req = requests.delete(
    url,
    headers={"Authorization": f"Bearer {CLERK_SECRET_KEY}"},
    timeout=8,
  )

  if req.status_code in (200, 202, 204, 404):
    return

  raise HTTPException(
    status_code=502,
    detail=f"Failed to delete Clerk user (status_code={req.status_code})",
  )