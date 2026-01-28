from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.db.database import connect_to_mongo, close_mongo_connection
from app.routers import files_router

@asynccontextmanager
async def lifespan(app: FastAPI):
  await connect_to_mongo()
  yield
  await close_mongo_connection()

app = FastAPI(lifespan=lifespan)
app.include_router(files_router.router, tags=["Files"], prefix="/files")

@app.get("/")
async def root():
  return {"message": "Welcome to the File Upload API"}