from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "Sherlock Deduction Engine"
    VERSION: str = "1.0.0"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://sherlock-deduction.vercel.app",  # update with your Vercel URL
    ]

    class Config:
        env_file = ".env"


settings = Settings()
