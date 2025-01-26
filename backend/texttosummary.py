import re
import os
import io
from videototranscript import get_transcript_from_url, get_video_id
from flask import Flask, send_file
from youtube_transcript_api import YouTubeTranscriptApi
import google.generativeai as genai
from config import token

# Set your API key
os.environ["GOOGLE_API_KEY"] = token
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
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


def process_transcript(transcript_text):
    # Generate summary
    print("\n=== Generating Summary ===")
    summary = generate_summary(transcript_text)
    print("\nSummary:")
    print("-" * 50)
    print(summary)

    return summary


def generatesummary(url):
    transcript_text = get_transcript_from_url(url)
    if transcript_text:
        summary = process_transcript(transcript_text)
    return summary


####################################################


def save_to_file(content):
    buffer = io.BytesIO()
    buffer.write(content.encode("utf-8"))
    buffer.seek(0)
    return buffer


def savetofile(url, summary):
    video_id = get_video_id(url)
    summary_content = f"Summary for video {video_id}:\n\n{summary}"
    buffer = save_to_file(summary_content)
    return send_file(
        buffer,
        as_attachment=True,
        download_name=f"summary_{video_id}.txt",
        mimetype="text/plain",
    )


def savetofile(url, summary):
    file_buffer = savefile(url, summary)
    return send_file(
        file_buffer,
        as_attachment=True,
        download_name=f"summary_{get_video_id(url)}.txt",
        mimetype="text/plain",
    )
