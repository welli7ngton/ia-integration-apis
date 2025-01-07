import sys
import json
from dotenv import load_dotenv

load_dotenv()
sys.path = sys.path + ["./app"]

from fastapi import FastAPI
from pydantic import BaseModel
from services.llm_service import LLMService
from fastapi.responses import JSONResponse

app = FastAPI()
llm_service = LLMService()


class TextData(BaseModel):
    text: str
    language: str
    max_chars: int


@app.get("/")
async def home():
    return {"message": "API is running."}


@app.post("/summarize")
async def summarize(data: TextData):
    try:
        summarized_text = llm_service.summarize_text(data.text, data.language, data.max_chars)
        return {"summary": summarized_text}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
