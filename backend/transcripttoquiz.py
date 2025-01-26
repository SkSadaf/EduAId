
from videototranscript import get_transcript_from_url
from flask import Flask, jsonify
from config import token

import torch


import os
from flask import Flask, render_template, request, send_file
import pdfplumber
# import docx
import csv
from werkzeug.utils import secure_filename
import google.generativeai as genai
from fpdf import FPDF  # pip install fpdf

# Set your API key
os.environ["GOOGLE_API_KEY"] = token
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

def generate_mcqs(text1):
    text = text1

    if text:
        # num_questions = int(request.form['num_questions'])
        mcq_responses = Question_mcqs_generator(text, 5)
    
    print("MCQS: " + mcq_responses)
    mcq_blocks = mcq_responses.strip().split('\n\n')


    mcqs = []
    for mcq in mcq_blocks:
        print(mcq)

        lines = mcq.strip().split('\n')

        # Check if there are enough lines to extract data
        if len(lines) < 6:
            continue

        question = lines[1].split("Question: ")[1].strip()
        options = {
            'A': lines[2].split("A) ")[1].strip(),
            'B': lines[3].split("B) ")[1].strip(),
            'C': lines[4].split("C) ")[1].strip(),
            'D': lines[5].split("D) ")[1].strip(),
        }
        correct_answer = lines[6].split("Correct Answer: ")[1].strip()

        mcqs.append({
            "question": question,
            "options": options,
            "correct_answer": correct_answer,
        })

    return jsonify(mcqs)



#########################################################


def generatequiz(url):
    transcript_text = get_transcript_from_url(url)
    if transcript_text:
        mcqs = generate_mcqs(transcript_text)
    return mcqs

########################################################



