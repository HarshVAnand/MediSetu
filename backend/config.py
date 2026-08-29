"""
Configuration file — reads your secret MongoDB connection string
from the .env file so it's not hardcoded in your code.
"""
import os
from dotenv import load_dotenv # type: ignore

# Load variables from .env file
load_dotenv()

class Config:
    MONGODB_URI = os.getenv('MONGODB_URI')
    DATABASE_NAME = os.getenv('DATABASE_NAME', 'prescription_drift_tracker')
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key')

    @classmethod
    def validate(cls):
        """Make sure the connection string is actually set."""
        if not cls.MONGODB_URI:
            raise ValueError(
                "MONGODB_URI not found in .env file!\n"
                "1. Create a .env file in the backend/ folder\n"
                "2. Add: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/"
            )
        if 'yourname' in cls.MONGODB_URI or 'yourpassword' in cls.MONGODB_URI:
            raise ValueError(
                "You still have placeholder values in your .env file!\n"
                "Replace 'yourname' and 'yourpassword123' with your actual MongoDB Atlas credentials."
            )
        print("✅ Configuration loaded successfully")