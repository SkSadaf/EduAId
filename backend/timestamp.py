import re
from youtube_transcript_api import YouTubeTranscriptApi
import os
import google.generativeai as genai
from datetime import timedelta

# Set your API key
os.environ["[REDACTED]"] = "AIzaSyBNANqT9e22OrvRBLXBnKt6sqZARHCkCpQ"
genai.configure(api_key=os.environ["[REDACTED]"])
model = genai.GenerativeModel("models/gemini-1.5-pro")

def seconds_to_timestamp(seconds):
    """Convert seconds to HH:MM:SS format"""
    return str(timedelta(seconds=int(seconds)))

def get_video_id(url):
    video_id_pattern = r"(?:https?://)?(?:www\.)?(?:youtube\.com/watch\?v=|youtu\.be/)([a-zA-Z0-9_-]+)"
    match = re.search(video_id_pattern, url)
    if match:
        return match.group(1)
    else:
        raise ValueError("Invalid YouTube URL")

def get_transcript_with_timestamps(url):
    try:
        video_id = get_video_id(url)
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return transcript
    except Exception as e:
        print(f"Error: {e}")
        return None

def format_transcript_with_timestamps(transcript):
    formatted_transcript = ""
    for entry in transcript:
        timestamp = seconds_to_timestamp(entry['start'])
        formatted_transcript += f"{timestamp}: {entry['text']}\n"
    return formatted_transcript

def find_topic_timestamps(transcript, topic):
    # Create a formatted string of the transcript with timestamps
    formatted_transcript = format_transcript_with_timestamps(transcript)

    # Prompt for Gemini
    prompt = f"""
    Given the following video transcript with timestamps in HH:MM:SS format, find where the topic "{topic}" is discussed.
    Please provide the start and end timestamps where this topic is covered.
    Format your response to show timestamps in HH:MM:SS format.
    Only return the relevant timestamps and a brief explanation. If the topic isn't found, say so.

    For example, format your response like this:
    The topic is discussed from [HH:MM:SS] to [HH:MM:SS]. [Brief explanation]

    Transcript:
    {formatted_transcript}
    """

    # Get response from Gemini
    try:
        response = model.generate_content(prompt)
        # Process the response to ensure timestamps are in HH:MM:SS format
        response_text = response.text
        # Find any remaining seconds-format timestamps and convert them
        seconds_pattern = r'(\d+\.?\d*)\s*seconds'
        for match in re.finditer(seconds_pattern, response_text):
            seconds = float(match.group(1))
            timestamp = seconds_to_timestamp(seconds)
            response_text = response_text.replace(match.group(0), timestamp)
        return response_text
    except Exception as e:
        return f"Error generating response: {e}"

def gettimestampoutput(youtube_url, topic):

    transcript = get_transcript_with_timestamps(youtube_url)
    
    if transcript:
        while True:
            # topic = input("\nWhat topic would you like to find in the video? (or 'quit' to exit): ")
            if topic.lower() == 'quit':
                break
                
            print("\nSearching for topic timestamps...")
            result = find_topic_timestamps(transcript, topic)
            print("\nResults:")
            print(result)
            print("\n" + "="*50)
            return result