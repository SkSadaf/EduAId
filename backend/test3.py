# import os
# from flask import Flask, render_template, request, send_file
# import pdfplumber
# # import docx
# import csv
# from werkzeug.utils import secure_filename
# import google.generativeai as genai
# from fpdf import FPDF  # pip install fpdf

# # Set your API key
# os.environ["GOOGLE_API_KEY"] = "AIzaSyBNANqT9e22OrvRBLXBnKt6sqZARHCkCpQ"
# genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
# model = genai.GenerativeModel("models/gemini-1.5-pro")

# app = Flask(__name__)
# app.config['UPLOAD_FOLDER'] = 'uploads/'
# app.config['RESULTS_FOLDER'] = 'results/'
# app.config['ALLOWED_EXTENSIONS'] = {'pdf', 'txt', 'docx'}


# def Question_mcqs_generator(input_text, num_questions):
#     prompt = f"""
#     You are an AI assistant helping the user generate multiple-choice questions (MCQs) based on the following text:
#     '{input_text}'
#     Please generate {num_questions} MCQs from the text. Each question should have:
#     - A clear question
#     - Four answer options (labeled A, B, C, D)
#     - The correct answer clearly indicated
#     Format:
#     ## MCQ
#     Question: [question]
#     A) [option A]
#     B) [option B]
#     C) [option C]
#     D) [option D]
#     Correct Answer: [correct option]
#     """
#     response = model.generate_content(prompt).text.strip()
#     return response

# # @app.route('/generate', methods=['POST'])
# def generate_mcqs(text1):
#     # if 'file' not in request.files:
#     #     return "No file part"

#     # file = request.files['file']

#     # if file and allowed_file(file.filename):
#     #     filename = secure_filename(file.filename)
#     #     file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#     #     file.save(file_path)

#         # Extract text from the uploaded file
#     text = text1

#     if text:
#         num_questions = int(request.form['num_questions'])
#         mcqs = Question_mcqs_generator(text, num_questions)

#     print(mcqs)

#             # Save the generated MCQs to a file
#             # txt_filename = f"generated_mcqs_{filename.rsplit('.', 1)[0]}.txt"
#             # pdf_filename = f"generated_mcqs_{filename.rsplit('.', 1)[0]}.pdf"
#             # save_mcqs_to_file(mcqs, txt_filename)
#             # # create_pdf(mcqs, pdf_filename)

#             # Display and allow downloading
#             # return render_template('results.html', mcqs=mcqs, txt_filename=txt_filename, pdf_filename=pdf_filename)
#     # return "Invalid file format"