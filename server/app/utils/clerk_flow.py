import os
import time
import requests
from jose import jwt
from jose.exceptions import JWTError
from fastapi import Request, HTTPException

CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL")
CLERK_ISSUER = os.getenv("CLERK_ISSUER")
CLERK_AUDIENCE = os.getenv("CLERK_AUDIENCE") # potentially for later use

if not CLERK_JWKS_URL:
  raise RuntimeError("CLERK_JWKS_URL is not set")
if not CLERK_ISSUER:
  raise RuntimeError("CLERK_ISSUER is not set")


_jwks_cache = {"keys": None, "exp": 0}


def _fetch_jwks():
  r = requests.get(CLERK_JWKS_URL, timeout=5)
  r.raise_for_status()
  return r.json()


def get_jwks(force_refresh: bool = False):
  now = time.time()
  if (not force_refresh) and _jwks_cache["keys"] and now < _jwks_cache["exp"]:
    return _jwks_cache["keys"]

  _jwks_cache["keys"] = _fetch_jwks()
  _jwks_cache["exp"] = now + 3600  # cache 1h
  return _jwks_cache["keys"]


def get_bearer_token(request: Request) -> str:
  auth = request.headers.get("Authorization", "")
  if not auth.startswith("Bearer "):
    raise HTTPException(status_code=401, detail="Missing Bearer token")
  return auth.split(" ", 1)[1].strip()


def _find_key_for_kid(jwks: dict, kid: str):
  return next((k for k in jwks.get("keys", []) if k.get("kid") == kid), None)


def verify_clerk_jwt(token: str) -> dict:
  try:
    unverified_header = jwt.get_unverified_header(token)
  except Exception:
    raise HTTPException(status_code=401, detail="Invalid token header")

  kid = unverified_header.get("kid")
  if not kid:
    raise HTTPException(status_code=401, detail="Invalid token header (no kid)")

  jwks = get_jwks(force_refresh=False)
  key = _find_key_for_kid(jwks, kid)

  if not key:
    jwks = get_jwks(force_refresh=True)
    key = _find_key_for_kid(jwks, kid)

  if not key:
    raise HTTPException(status_code=401, detail="Unknown signing key")

  try:
    options = {"verify_aud": bool(CLERK_AUDIENCE)}
    claims = jwt.decode(
      token,
      key,
      algorithms=["RS256"],
      issuer=CLERK_ISSUER,
      audience=CLERK_AUDIENCE if CLERK_AUDIENCE else None,
      options=options,
    )
    return claims
  except JWTError:
    raise HTTPException(status_code=401, detail="Invalid or expired token")


def require_user(request: Request) -> str:
  token = get_bearer_token(request)
  claims = verify_clerk_jwt(token)

  user_id = claims.get("sub")
  if not user_id:
    raise HTTPException(status_code=401, detail="Token missing subject")
  return user_id