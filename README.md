# EduAId - Educational Video Assistant

EduAId is a comprehensive web application that enhances the educational video viewing experience by providing AI-powered features like summaries, quizzes, translations, and interactive Q&A.

## Features

- **Smart Video Analysis**: Watch YouTube videos with an integrated AI chat companion
- **Auto-Generated Summaries**: Get concise overviews of video content
- **Interactive Quizzes**: Test understanding with automatically generated MCQs
- **Multi-language Support**: Translate content into multiple languages
- **Timestamp Search**: Find specific topics within videos
- **AI Chat Companion**: Ask questions about video content in real-time

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- Ant Design Components
- React Router for navigation
- Axios for API calls

### Backend

- Flask Python server
- Google's Gemini AI model
- YouTube Transcript API
- Flask-CORS for cross-origin support

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Homepage.js        # Landing page
│   │   │   ├── LandingPage.js     # Main video interface
│   │   │   ├── WatchVideo.js      # Video player with AI chat
│   │   │   ├── Summary.js         # Video summarization
│   │   │   ├── Quiz.js           # Quiz generation
│   │   │   ├── Translation.js     # Content translation
│   │   │   └── Timestamp.js       # Topic timestamp search
│   │   ├── App.js
│   │   └── index.js
│
├── backend/
│   ├── app.py                     # Flask server setup
│   ├── chatbot.py                 # AI chat functionality
│   ├── timestamp.py               # Timestamp extraction
│   ├── transcripttoquiz.py        # Quiz generation
│   ├── summaryToMultipleLang.py   # Translation service
│   └── config.py                  # Configuration settings
```

## Setup Instructions

1. **Backend Setup**

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Unix
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Create .env file with:
SECRET_KEY=your_gemini_api_key

# Start Flask server
python app.py
```

2. **Frontend Setup**

```bash
# Install dependencies
npm install

# Start development server
npm start
```

## API Endpoints

- `POST /api/summarize`: Generate video summary
- `POST /api/generate_mcqs`: Create multiple-choice questions
- `POST /api/get_translation`: Translate content
- `POST /api/get_timestamps`: Find topic timestamps
- `POST /api/get_qa`: AI chat responses
- `POST /api/download`: Download summary text file

## Environment Variables

- `SECRET_KEY`: Google Gemini API key
- `GOOGLE_API_KEY`: Same as SECRET_KEY for Gemini model

## Features in Detail

### Video Summary

- Extracts video transcript
- Generates concise summary using Gemini AI
- Downloadable summary in text format

### Quiz Generation

- Creates MCQs based on video content
- Tracks user score and progress
- Provides immediate feedback

### Translation

Supports multiple languages including:

- Hindi
- Spanish
- French
- German
- Japanese
- Korean
- Chinese
- Telugu
- Bengali

### AI Chat Companion

- Real-time Q&A about video content
- Context-aware responses
- Chat history tracking

## Contributors

- Sai Varun Reddy - Frontend Development
- Rishma Manna - Backend Development
- Sadaf Shaik - ML Engineering
- Sai Harshitha - UI/UX Design
