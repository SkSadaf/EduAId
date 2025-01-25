# import re
# from youtube_transcript_api import YouTubeTranscriptApi

# # Function to extract the video ID from the YouTube URL
# def get_video_id(url):
#     # Match a YouTube URL format and extract the video ID
#     video_id_pattern = r"(?:https?://)?(?:www\.)?(?:youtube\.com/watch\?v=|youtu\.be/)([a-zA-Z0-9_-]+)"
#     match = re.search(video_id_pattern, url)
#     if match:
#         return match.group(1)
#     else:
#         raise ValueError("Invalid YouTube URL")

# # Function to get transcript from the video ID
# def get_transcript_from_url(url):
#     try:
#         video_id = get_video_id(url)
#         transcript = YouTubeTranscriptApi.get_transcript(video_id)
        
#         # Print transcript in a readable format
#         for entry in transcript:
#             # print(f"{entry['start']:.2f}s - {entry['start'] + entry['duration']:.2f}s: {entry['text']}")
#             print(f"{entry['text']}")
#             transcript_text.append(entry['text'])
    
#     except Exception as e:
#         print(f"Error: {e}")
    
#     return ' '.join(transcript_text)


# # Example usage
# # if __name__ == "__main__":
# #     youtube_url = input("Enter YouTube video URL: ")
# #     transcript_text = get_transcript_from_url(youtube_url)
