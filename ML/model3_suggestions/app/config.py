import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from root .env file
root_env = Path(__file__).resolve().parent.parent.parent.parent / ".env"
load_dotenv(root_env)

class Settings:
    # Supports OpenAI, OpenRouter, or any OpenAI-compatible API
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    OPENAI_BASE_URL: str = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")

settings = Settings()
