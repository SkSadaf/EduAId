import re
from youtube_transcript_api import YouTubeTranscriptApi

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
        print("Transcript: \n" + full_transcript)
        return full_transcript
    
    except Exception as e:
        print(f"Error: {e}")
        return None
