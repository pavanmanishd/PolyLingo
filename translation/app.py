from fastapi import FastAPI
from googletrans import Translator
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import edge_tts
from edge_tts import VoicesManager
import random
from fastapi.responses import StreamingResponse
import os
# import asyncio
import uuid

app = FastAPI()

# Allow requests from all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://192.168.0.101:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

class TranslationRequest(BaseModel):
    text: str
    dest_lang: str

@app.post("/translate/")
async def translate_text(request: TranslationRequest):
    """Translate text to the specified language"""
    import time
    start = time.time()
    text = request.text
    dest_lang = request.dest_lang
    print(f"Translating '{text}' to '{dest_lang}'")
    translator = Translator()
    translation = translator.translate(text, dest=dest_lang)
    translated_text = translation.text
    print(f"Translated text: {translated_text}")
    end = time.time()
    print(f"Translation took {end - start} seconds")
    return translated_text

class TTSRequest(BaseModel):
    text: str
    dest_lang: str

@app.post("/tts/")
async def tts(request: TTSRequest):
    """text to speech of the specified language"""
    text = request.text
    dest_lang = request.dest_lang
    print("TTS Started")
    voices = await VoicesManager.create()
    voice = voices.find(Gender="Male", Language=dest_lang)

    if voice is None:
        voice = voices.find(Gender="Female", Language=dest_lang)
    if voice is None:
        return "No voice found for the specified language"

    print(f"Converting '{text}' to speech in '{dest_lang}'")

    communicate = edge_tts.Communicate(text, random.choice(voice)["Name"])

    # Create the 'tts/' directory if it doesn't exist
    os.makedirs("tts", exist_ok=True)

    print("Saving to file")
    id = uuid.uuid4()
    await communicate.save(f"tts/{id}.mp3")
    
    # read the file
    # with open(f"tts/{id}.mp3", "rb") as file:
    #     file_data = file.read()

    # return file_data
    
    file_path = f"tts/{id}.mp3"
    return StreamingResponse(open(file_path, "rb"), media_type="audio/mpeg", headers={"Content-Disposition": f"attachment; filename={file_path}"})
