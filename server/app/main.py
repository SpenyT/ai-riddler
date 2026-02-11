from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager
from app.db.database import connect_to_mongo, close_mongo_connection
from app.routers import files_router, users_router, users_router_public

from server.app.auth.full_auth import require_user_ctx

@asynccontextmanager
async def lifespan(app: FastAPI):
  await connect_to_mongo()
  yield
  await close_mongo_connection()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Your Vite Frontend Port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(files_router.router, prefix="/files", tags=["Files"])

app.include_router(users_router_public, prefix="/users", tags=["Users"])
app.include_router(users_router, prefix="/users", tags=["Users"], dependencies=[Depends(require_user_ctx)])

@app.get("/")
async def root():
  return {"message": "Welcome to the File Upload API"}