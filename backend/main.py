import os
import base64
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from typing import Dict

load_dotenv()
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash", api_key=os.getenv("GEMINI_API_KEY")
)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def encode_image(image_content: bytes) -> str:
    return base64.b64encode(image_content).decode()


@app.get("/")
async def root():
    return {
        "message": "Nutrition Analyzer API is running!",
        "status": "healthy",
        "version": "1.0.0",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "nutrition-analyzer"}


@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)) -> Dict[str, str]:
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(
            status_code=400, detail="Invalid file type. Only JPEG and PNG are allowed."
        )

    if file.size and file.size > 10_000_000:
        raise HTTPException(
            status_code=400, detail="File size too large. Maximum size is 10MB."
        )

    try:
        contents = await file.read()
        image = encode_image(contents)

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a nutrition expert capable of analyzing food images and providing detailed nutritional advice.",
                ),
                (
                    "human",
                    [
                        {
                            "type": "text",
                            "text": """Analyze the image and provide a comprehensive nutritional breakdown and health advice. Follow these steps:

1. **Food Identification**: Identify all visible food items and ingredients
2. **Nutritional Breakdown**: Provide estimated calories, macronutrients (carbs, protein, fat), and key vitamins/minerals
3. **Health Assessment**: Evaluate the nutritional quality and health benefits
4. **Recommendations**: Suggest improvements or complementary foods
5. **Summary**: Provide a concise overall assessment

Format your response clearly with headers and bullet points for easy reading.""",
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image}",
                                "detail": "high",
                            },
                        },
                    ],
                ),
            ]
        )

        chain = prompt | llm
        res = await chain.ainvoke({})
        return {"analysis": res.content}
    except Exception:
        raise HTTPException(500, detail="An error occurred while processing the image")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
