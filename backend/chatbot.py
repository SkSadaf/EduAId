import os 
import json
import google.generativeai as genai
from flask import jsonify
from config import token

# Set your API key
os.environ["GOOGLE_API_KEY"] = token  # Replace with your actual API key
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model = genai.GenerativeModel("models/gemini-1.5-pro")

class TextQASystem:
    def __init__(self):
        self.context = ""
        self.trained = False

    def train_on_text(self, input_text: str) -> None:
        """Train the system by storing the context text"""
        self.context = input_text
        self.trained = True

    def answer_question(self, question: str) -> dict:
        """Generate an answer for the given question based on the context"""
        if not self.trained:
            return {
                "status": "error",
                "message": "System has not been trained on any text yet.",
                "answer": None
            }

        prompt = f"""
        Context: '{self.context}'
        
        Question: {question}
        
        Please provide a clear and accurate answer to the question based on the information provided in the context above.
        If the user asks for something more than what is there in the information try to get like very good and very much related content, and if the user asks something unrelated tell that it is unrelated and ask for questions related to the information.
        
        Answer:
        """
        
        try:
            response = model.generate_content(prompt).text.strip()
            return {
                "status": "success",
                "message": "Answer generated successfully",
                "answer": response,
                "context_length": len(self.context)
            }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e),
                "answer": None
            }

def generate_qa(transcript, input_question):
    qa_system = TextQASystem()
    qa_system.train_on_text(transcript)
    return qa_system.answer_question(input_question)
