import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

# Access the variables
token = os.getenv('SECRET_KEY')