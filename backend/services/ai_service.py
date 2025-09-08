import uuid
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from config.settings import settings
from config.database import get_db_connection

# Initialize LLM
llm = ChatGoogleGenerativeAI(
    model=settings.GEMINI_MODEL, api_key=settings.GEMINI_API_KEY
)


async def analyze_food_image(image_base64: str, user_id: str) -> tuple[str, str]:
    """Analyze food image using AI and save to database"""

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are a professional nutrition expert and certified dietitian. Provide detailed, accurate nutritional analysis.",
            ),
            (
                "human",
                [
                    {
                        "type": "text",
                        "text": """Analyze this food image and provide a comprehensive nutritional assessment:

🔍 **FOOD IDENTIFICATION**
- List all visible food items and ingredients
- Estimate portion sizes

📊 **NUTRITIONAL BREAKDOWN**
- Total estimated calories
- Macronutrients (carbs, protein, fat) in grams
- Key vitamins and minerals
- Fiber and sugar content

⚖️ **HEALTH ASSESSMENT**
- Overall nutritional quality (1-10 rating)
- Health benefits and concerns
- Allergen information

💡 **RECOMMENDATIONS**
- Suggestions for nutritional balance
- Complementary foods
- Portion recommendations

🎯 **SUMMARY**
- Key nutritional highlights
- Main takeaway

Be specific with numbers and explain your reasoning.""",
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_base64}",
                            "detail": "high",
                        },
                    },
                ],
            ),
        ]
    )

    chain = prompt | llm
    res = await chain.ainvoke({})

    # Save analysis to database
    analysis_id = str(uuid.uuid4())
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO analyses (id, user_id, analysis_result) VALUES (?, ?, ?)",
        (analysis_id, user_id, res.content),
    )
    conn.commit()
    conn.close()

    return res.content, analysis_id
