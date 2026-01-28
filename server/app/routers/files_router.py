from fastapi import APIRouter, HTTPException, UploadFile, File, Form, status
from typing import List
from datetime import datetime
import bson.binary

from app.db.database import get_database
from app.models.files_model import FileMetadata

router = APIRouter()

@router.post("/upload", response_description="Upload a file", response_model=FileMetadata)
async def upload_file(
  file: UploadFile = File(...),
  relevant_date: datetime = Form(...),
  class_in_question: str = Form(...)
):
  db = await get_database()
  file_content = await file.read()

  file_doc = {
    "date_uploaded": datetime.now(),
    "relevant_date": relevant_date,
    "class_in_question": class_in_question,
    "file_type": file.content_type,
    "filename": file.filename,
    "data": bson.binary.Binary(file_content)
  }
  
  new_file = await db["class_files"].insert_one(file_doc)
  created_file = await db["class_files"].find_one({"_id": new_file.inserted_id})
  
  return created_file

@router.get("/", response_description="List all files (metadata only)", response_model=List[FileMetadata])
async def list_files():
  db = await get_database()
  files = await db["class_files"].find({}, {"data": 0}).to_list(100)
  return files

@router.get("/{id}/download")
async def download_file(id: str):
  from fastapi.responses import Response
  db = await get_database()
  
  file_doc = await db["class_files"].find_one({"_id": id})
  
  if not file_doc:
    raise HTTPException(status_code=404, detail="File not found")

  return Response(
    content=file_doc["data"], 
    media_type=file_doc["file_type"],
    headers={"Content-Disposition": f'attachment; filename="{file_doc["filename"]}"'}
  )