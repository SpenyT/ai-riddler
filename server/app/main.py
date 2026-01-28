from fastapi import FastAPI, HTTPException, Body, status
from fastapi.encoders import jsonable_encoder
from contextlib import asynccontextmanager
from typing import List

from app.db.database import connect_to_mongo, close_mongo_connection, get_database
from app.models.models import StudentModel, UpdateStudentModel

@asynccontextmanager
async def lifespan(app: FastAPI):
  await connect_to_mongo()
  yield
  await close_mongo_connection()

app = FastAPI(lifespan=lifespan)

@app.post("/students/", response_description="Add new student", response_model=StudentModel)
async def create_student(student: StudentModel = Body(...)):
    db = await get_database()
    student = jsonable_encoder(student)
    new_student = await db["students"].insert_one(student)
    created_student = await db["students"].find_one({"_id": new_student.inserted_id})
    return created_student

@app.get("/students/", response_description="List all students", response_model=List[StudentModel])
async def list_students():
    db = await get_database()
    students = await db["students"].find().to_list(1000)
    return students

@app.get("/students/{id}", response_description="Get a single student", response_model=StudentModel)
async def show_student(id: str):
    db = await get_database()
    if (student := await db["students"].find_one({"_id": id})) is not None:
        return student
    raise HTTPException(status_code=404, detail=f"Student {id} not found")