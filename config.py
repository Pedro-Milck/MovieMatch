from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    TMDB_ACCESS_TOKEN = os.getenv('TMDB_API_KEY')
    TMDB_BASE_URL = "https://api.themoviedb.org/3"
    TMDB_IMAGE_URL = "https://images.tmdb.org/t/p/w500"
    SQLALCHEMY_DATABASE_URI = "sqlite:///moviematch.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False