import asyncio
import sys
import os
from datetime import datetime
import bson.binary

# 1. Setup path to import DB config
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
sys.path.append(project_root)

from app.db.database import MONGO_URL, DB_NAME
from motor.motor_asyncio import AsyncIOMotorClient

async def test_save_data():
  print("--- Testing MongoDB Write Operation ---")
  
  client = AsyncIOMotorClient(MONGO_URL)
  db = client[DB_NAME]
  collection = db["metadata"]

  # 2. Create Dummy Data
  # Simulating a small text file upload
  dummy_content = b"This is a test file content for MongoDB verification."
  
  test_document = {
    "date_uploaded": datetime.now(),
    "relevant_date": datetime(2023, 12, 1),
    "class_in_question": "Test Class 101",
    "file_type": "text/plain",
    "filename": "test_upload.txt",
    "data": bson.binary.Binary(dummy_content)
  }

  try:
    print("Attempting to insert document...")
    result = await collection.insert_one(test_document)
    
    if result.inserted_id:
      print(f"\n✅ SUCCESS: Data saved!")
      print(f"   New Document ID: {result.inserted_id}")
      
      saved_doc = await collection.find_one({"_id": result.inserted_id})
      print(f"Retrieved Filename: {saved_doc['filename']}")
    else:
      print("\n❌ FAILED: Insert operation returned no ID.")

  except Exception as e:
    print(f"\n❌ ERROR: Could not save data.")
    print(f"   Details: {e}")
  
  finally:
    client.close()

if __name__ == "__main__":
  asyncio.run(test_save_data())