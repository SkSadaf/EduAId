import re
from youtube_transcript_api import YouTubeTranscriptApi
import os
import google.generativeai as genai

# Set your API key
os.environ["[REDACTED]"] = "AIzaSyBNANqT9e22OrvRBLXBnKt6sqZARHCkCpQ"  # Replace with your actual API key
genai.configure(api_key=os.environ["[REDACTED]"])
model = genai.GenerativeModel("models/gemini-1.5-pro")

def Question_mcqs_generator(input_text, num_questions):
    prompt = f"""
    You are an AI assistant helping the user generate multiple-choice questions (MCQs) based on the following text:
    '{input_text}'
    Please generate {num_questions} MCQs from the text. Each question should have:
    - A clear question
    - Four answer options (labeled A, B, C, D)
    - The correct answer clearly indicated
    Format:
    ## MCQ
    Question: [question]
    A) [option A]
    B) [option B]
    C) [option C]
    D) [option D]
    Correct Answer: [correct option]
    """
    response = model.generate_content(prompt).text.strip()
    return response

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
    
    # Generate MCQs
    print("\n=== Generating MCQs ===")
    mcqs = Question_mcqs_generator(transcript_text, 5)  # Generate 5 MCQs
    print("\nMultiple Choice Questions:")
    print("-" * 50)
    print(mcqs)
    
    return summary, translated_summary, mcqs

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

def save_to_file(content, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    while True:
        print("\n=== YouTube Video Processor ===")
        print("1. Process a YouTube video")
        print("2. Exit")
        
        choice = input("\nEnter your choice (1-2): ")
        
        if choice == '1':
            url = input("\nEnter YouTube video URL: ")
            
            # Updated language selection menu
            print("\nAvailable languages for translation:")
            print("\nIndian Languages:")
            print("1. Hindi")
            print("2. Telugu")
            print("3. Bengali")
            print("\nOther Languages:")
            print("4. Spanish")
            print("5. French")
            print("6. German")
            print("7. Japanese")
            print("8. Chinese")
            print("9. Russian")
            print("10. Arabic")
            print("11. Other")
            
            lang_choice = input("\nSelect target language (1-11): ")
            
            # Updated language map
            language_map = {
                "1": "Hindi",
                "2": "Telugu",
                "3": "Bengali",
                "4": "Spanish",
                "5": "French",
                "6": "German",
                "7": "Japanese",
                "8": "Chinese",
                "9": "Russian",
                "10": "Arabic"
            }
            
            if lang_choice == "11":
                target_language = input("Enter your desired language: ")
            else:
                target_language = language_map.get(lang_choice, "Hindi")  # Default to Hindi if invalid choice
            
            transcript_text = get_transcript_from_url(url)
            
            if transcript_text:
                summary, translated_summary, mcqs = process_transcript(transcript_text, target_language)
                
                # Ask if user wants to save the results
                save_choice = input("\nDo you want to save the results to files? (y/n): ")
                if save_choice.lower() == 'y':
                    video_id = get_video_id(url)
                    
                    # Save English summary
                    summary_filename = f"summary_english_{video_id}.txt"
                    save_to_file(summary, summary_filename)
                    print(f"English summary saved to: {summary_filename}")
                    
                    # Save translated summary
                    translated_filename = f"summary_{target_language.lower()}_{video_id}.txt"
                    save_to_file(translated_summary, translated_filename)
                    print(f"{target_language} summary saved to: {translated_filename}")
                    
                    # Save MCQs
                    mcqs_filename = f"mcqs_{video_id}.txt"
                    save_to_file(mcqs, mcqs_filename)
                    print(f"MCQs saved to: {mcqs_filename}")
                    
                    # Save combined results
                    combined_filename = f"combined_results_{video_id}.txt"
                    combined_content = f"""SUMMARY (ENGLISH):

{summary}

SUMMARY ({target_language.upper()}):

{translated_summary}

MCQs:

{mcqs}"""
                    save_to_file(combined_content, combined_filename)
                    print(f"Combined results saved to: {combined_filename}")
        
        elif choice == '2':
            print("\nThank you for using YouTube Video Processor!")
            break
        
        else:
            print("\nInvalid choice. Please try again.")

if __name__ == "__main__":
    main()
