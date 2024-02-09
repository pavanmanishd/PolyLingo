import uvicorn
from fastapi import FastAPI
from googletrans import Translator
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow requests from all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)