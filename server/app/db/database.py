import os
from motor.motor_asyncio import AsyncIOMotorClient

# In a real app, read these from environment variables (e.g., .env file)
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = "fastapi_db"

class Database:
  client: AsyncIOMotorClient = None

db = Database()

async def get_database():
  return db.client[DB_NAME]

async def connect_to_mongo():
  db.client = AsyncIOMotorClient(MONGO_URL)
  print("Connected to MongoDB")

async def close_mongo_connection():
  db.client.close()
  print("Closed MongoDB connection")