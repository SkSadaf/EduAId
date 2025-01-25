
import torch

import re
from youtube_transcript_api import YouTubeTranscriptApi

from transformers import AutoTokenizer, AutoModelForSeq2SeqLM


import os
from flask import Flask, render_template, request, send_file
import pdfplumber
# import docx
import csv
from werkzeug.utils import secure_filename
import google.generativeai as genai
from fpdf import FPDF  # pip install fpdf

# Set your API key
os.environ["GOOGLE_API_KEY"] = "AIzaSyBNANqT9e22OrvRBLXBnKt6sqZARHCkCpQ"
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model = genai.GenerativeModel("models/gemini-1.5-pro")

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['RESULTS_FOLDER'] = 'results/'
app.config['ALLOWED_EXTENSIONS'] = {'pdf', 'txt', 'docx'}


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

# @app.route('/generate', methods=['POST'])
def generate_mcqs(text1):
    # if 'file' not in request.files:
    #     return "No file part"

    # file = request.files['file']

    # if file and allowed_file(file.filename):
    #     filename = secure_filename(file.filename)
    #     file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    #     file.save(file_path)

        # Extract text from the uploaded file
    text = text1

    if text:
        # num_questions = int(request.form['num_questions'])
        mcqs = Question_mcqs_generator(text, 2)

    print(mcqs)

            # Save the generated MCQs to a file
            # txt_filename = f"generated_mcqs_{filename.rsplit('.', 1)[0]}.txt"
            # pdf_filename = f"generated_mcqs_{filename.rsplit('.', 1)[0]}.pdf"
            # save_mcqs_to_file(mcqs, txt_filename)
            # # create_pdf(mcqs, pdf_filename)

            # Display and allow downloading
            # return render_template('results.html', mcqs=mcqs, txt_filename=txt_filename, pdf_filename=pdf_filename)
    # return "Invalid file format"




def test2(article_text):

    WHITESPACE_HANDLER = lambda k: re.sub('\s+', ' ', re.sub('\n+', ' ', k.strip()))

    # article_text = """Videos that say approved vaccines are dangerous and cause autism, cancer or infertility are among those that will be taken down, the company said.  The policy includes the termination of accounts of anti-vaccine influencers.  Tech giants have been criticised for not doing more to counter false health information on their sites.  In July, US President Joe Biden said social media platforms were largely responsible for people's scepticism in getting vaccinated by spreading misinformation, and appealed for them to address the issue.  YouTube, which is owned by Google, said 130,000 videos were removed from its platform since last year, when it implemented a ban on content spreading misinformation about Covid vaccines.  In a blog post, the company said it had seen false claims about Covid jabs "spill over into misinformation about vaccines in general". The new policy covers long-approved vaccines, such as those against measles or hepatitis B.  "We're expanding our medical misinformation policies on YouTube with new guidelines on currently administered vaccines that are approved and confirmed to be safe and effective by local health authorities and the WHO," the post said, referring to the World Health Organization."""

    model_name = "csebuetnlp/mT5_multilingual_XLSum"
    # tokenizer = AutoTokenizer.from_pretrained(model_name)

# Initialize the slow tokenizer
    tokenizer = AutoTokenizer.from_pretrained(model_name, use_fast=False)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

    input_ids = tokenizer(
        [WHITESPACE_HANDLER(article_text)],
        return_tensors="pt",
        padding="max_length",
        truncation=True,
        max_length=512
    )["input_ids"]

    output_ids = model.generate(
        input_ids=input_ids,
        max_length=84,
        no_repeat_ngram_size=2,
        num_beams=4
    )[0]

    summary = tokenizer.decode(
        output_ids,
        skip_special_tokens=True,
        clean_up_tokenization_spaces=False
    )


    return summary

# Use a pipeline as a high-level helper
from transformers import pipeline

pipe = pipeline("summarization", model="facebook/bart-large-cnn")


summarizer = pipeline(task="summarization",
                      model="facebook/bart-large-cnn",
                      torch_dtype=torch.bfloat16)


def get_summary_from_transcript(text):
    try:
        # Generate the summary
        summary = summarizer(text, min_length=10, max_length=100)

        # Extract the summary text from the result
        summary_text = summary[0]['summary_text']  # Access the summary from the first item in the list

    except Exception as e:
        print(f"Error: {e}")
        return ""  # Return an empty string if there's an error

    return summary_text  # Return the summary text directly
##


# text = """Paris is the capital and most populous city of France, with
#     an estimated population of 2,175,601 residents as of 2018,
#           in an area of more than 105 square kilometres (41 square
#           miles). The City of Paris is the centre and seat of
#           government of the region and province of Île-de-France, or
#           Paris Region, which has an estimated population of
#           12,174,880, or about 18 percent of the population of France
#           as of 2017."""



# Function to extract the video ID from the YouTube URL
def get_video_id(url):
    # Match a YouTube URL format and extract the video ID
    video_id_pattern = r"(?:https?://)?(?:www\.)?(?:youtube\.com/watch\?v=|youtu\.be/)([a-zA-Z0-9_-]+)"
    match = re.search(video_id_pattern, url)
    if match:
        return match.group(1)
    else:
        raise ValueError("Invalid YouTube URL")

# Function to get transcript from the video ID
def get_transcript_from_url(url):
    transcript_text = []
    try:
        video_id = get_video_id(url)
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        
        # Print transcript in a readable format
        for entry in transcript:
            # print(f"{entry['start']:.2f}s - {entry['start'] + entry['duration']:.2f}s: {entry['text']}")
            print(f"{entry['text']}")
            transcript_text.append(entry['text'])
    
    except Exception as e:
        print(f"Error: {e}")
    
    return ' '.join(transcript_text)


# Example usage
if __name__ == "__main__":
    youtube_url = input("Enter YouTube video URL: ")
    transcript_text = get_transcript_from_url(youtube_url)
    # print(get_summary_from_transcript(transcript_text))
    print(test2(transcript_text))
    generate_mcqs(transcript_text)



#########################################################


