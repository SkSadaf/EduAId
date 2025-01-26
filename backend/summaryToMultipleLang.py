import re
from youtube_transcript_api import YouTubeTranscriptApi
import os
import google.generativeai as genai

# Set your API key
os.environ["[REDACTED]"] = "AIzaSyBNANqT9e22OrvRBLXBnKt6sqZARHCkCpQ"  # Replace with your actual API key
genai.configure(api_key=os.environ["[REDACTED]"])
model = genai.GenerativeModel("models/gemini-1.5-pro")

def generate_summary(input_text):
    prompt = f"""
    You are an AI assistant helping to create a comprehensive summary of the following text:
    '{input_text}'
    
    Please provide a well-structured summary that:
    - Captures the main points and key ideas
    - Is roughly 20-25% of the original text length
    - Maintains a coherent flow
    - Is divided into clear paragraphs
    - Includes the most important details while omitting redundant information
    
    Format the summary with proper paragraphs and ensure it's easy to read.
    """
    
    response = model.generate_content(prompt).text.strip()
    return response

def translate_text(text, target_language):
    # Special prompt for Indian languages
    if target_language.lower() in ["hindi", "telugu", "bengali"]:
        script_map = {
            "hindi": "Devanagari",
            "telugu": "Telugu",
            "bengali": "Bengali"
        }
        script = script_map.get(target_language.lower(), "")
        
        prompt = f"""
        Translate the following English text to {target_language}. 
        Keep the translation natural, culturally appropriate, and maintain the paragraph structure.
        Use proper {script} script for the translation.

        Text to translate:
        '{text}'

        Please provide only the {target_language} translation without any additional explanations.
        """
    else:
        prompt = f"""
        Translate the following English text to {target_language}. 
        Keep the translation natural and maintain the paragraph structure:

        Text to translate:
        '{text}'

        Please provide only the {target_language} translation without any additional explanations.
        """
    
    response = model.generate_content(prompt).text.strip()
    return response

def process_transcript(transcript_text, target_language):
    # Generate summary
    print("\n=== Generating Summary ===")
    summary = generate_summary(transcript_text)
    print("\nSummary (English):")
    print("-" * 50)
    print(summary)
    
    # Translate summary to target language
    print(f"\n=== Translating Summary to {target_language} ===")
    translated_summary = translate_text(summary, target_language)
    print(f"\nSummary ({target_language}):")
    print("-" * 50)
    print(translated_summary)
    
    return summary, translated_summary

def get_video_id(url):
    video_id_pattern = r"(?:https?://)?(?:www\.)?(?:youtube\.com/watch\?v=|youtu\.be/)([a-zA-Z0-9_-]+)"
    match = re.search(video_id_pattern, url)
    if match:
        return match.group(1)
    else:
        raise ValueError("Invalid YouTube URL")

def get_transcript_from_url(url):
    transcript_text = []
    try:
        video_id = get_video_id(url)
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        
        print("\nExtracting transcript...")
        for entry in transcript:
            transcript_text.append(entry['text'])
        
        full_transcript = ' '.join(transcript_text)
        print("\nTranscript extracted successfully!")
        return full_transcript
    
    except Exception as e:
        print(f"Error: {e}")
        return None


def translateSummarytoLang(targetlanguage, url):
            
    if targetlanguage:
        target_language = targetlanguage
    else:
        target_language = "Hindi" # Default to Hindi if invalid choice

    transcript_text = get_transcript_from_url(url)

    if transcript_text:
        summary, translated_summary = process_transcript(transcript_text, target_language)
                

    return translated_summary

