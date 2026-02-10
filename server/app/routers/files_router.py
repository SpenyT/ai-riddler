from fastapi import APIRouter, HTTPException, UploadFile, File, Form, status
from fastapi.responses import Response
from typing import List
from datetime import datetime
import bson.binary
from bson import ObjectId
import hashlib
import os

from app.db.database import get_database
from app.models.files_model import FileMetadata

router = APIRouter()
file_collection : str = os.getenv("FILE_COLLECTION")

@router.post("/upload", response_description="Upload a file", response_model=FileMetadata)
async def upload_file(file: UploadFile = File(...), class_in_question: str = Form(...)):
  db = await get_database()
  file_content = await file.read()
  file_hash = hashlib.sha256(file_content).hexdigest()

  existing_file = await db[file_collection].find_one({"file_hash": file_hash})
  
  if existing_file:
    print(f"Duplicate found! Returning existing file ID: {existing_file['_id']}")
    return existing_file
  
  current_time = datetime.now()
  file_doc = {
    "date_uploaded": current_time,
    "relevant_date": current_time,
    "class_in_question": class_in_question,
    "file_type": file.content_type,
    "filename": file.filename,
    "size": len(file_content),
    "file_hash": file_hash,
    "data": bson.binary.Binary(file_content)
  }
  
  new_file = await db[file_collection].insert_one(file_doc)
  created_file = await db[file_collection].find_one({"_id": new_file.inserted_id})
  return created_file

@router.get("/", response_description="List all files (metadata only)", response_model=List[FileMetadata])
async def list_files():
  db = await get_database()
  files = await db[file_collection].find({}, {"data": 0}).to_list(100)
  return files

@router.get("/{id}/download")
async def download_file(id: str):
  db = await get_database()
  
  try:
    oid = ObjectId(id)
  except Exception:
    raise HTTPException(status_code=400, detail="Invalid ID format")

  file_doc = await db[file_collection].find_one({"_id": oid})
  
  if not file_doc:
    raise HTTPException(status_code=404, detail="File not found")

  return Response(
    content=file_doc["data"], 
    media_type=file_doc["file_type"],
    headers={"Content-Disposition": f'attachment; filename="{file_doc["filename"]}"'}
  )