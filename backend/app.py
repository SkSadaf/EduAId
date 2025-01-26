from flask import Flask, jsonify, request, send_file, make_response
from flask_cors import CORS
from summaryToMultipleLang import translate_text, generate_summary
from timestamp import gettimestampoutput
from transcripttoquiz import generate_mcqs
from texttosummary import savetofile
from videototranscript import get_transcript_from_url

app = Flask(__name__)
CORS(
    app,
    resources={
        r"/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"],
            "supports_credentials": True,
        }
    },
    supports_credentials=True,
)

# Cache structure
cache = {
    "transcripts": {},  # url: transcript
    "summaries": {},  # url: summary
    "translations": {},  # url_lang: translation
    "quizzes": {},  # url: quiz
}


def get_cached_transcript(url):
    if url not in cache["transcripts"]:
        cache["transcripts"][url] = get_transcript_from_url(url)
    return cache["transcripts"][url]


def get_cached_summary(url):
    if url not in cache["summaries"]:
        transcript = get_cached_transcript(url)
        cache["summaries"][url] = generate_summary(transcript)
    return cache["summaries"][url]


@app.route("/api/summarize", methods=["POST"])
def get_summary():
    data = request.json
    url = data.get("youtube_url")
    if not url:
        return jsonify({"error": "YouTube URL is required."}), 400
    try:
        summary = get_cached_summary(url)
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/generate_mcqs", methods=["POST"])
def generate_mcqs_api():
    data = request.json
    url = data.get("youtube_url")
    if not url:
        return jsonify({"error": "YouTube URL is required."}), 400
    try:
        if url not in cache["quizzes"]:
            transcript = get_cached_transcript(url)
            # Using the existing generate_mcqs function
            mcqs = generate_mcqs(transcript)
            cache["quizzes"][url] = mcqs.get_json()  # Cache the JSON response
        return cache["quizzes"][url]
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/get_translation", methods=["POST"])
def generate_translation_api():
    data = request.json
    url = data.get("youtube_url")
    target_lang = data.get("targetlanguage")
    if not url:
        return jsonify({"error": "YouTube URL is required."}), 400
    try:
        cache_key = f"{url}_{target_lang}"
        if cache_key not in cache["translations"]:
            summary = get_cached_summary(url)
            cache["translations"][cache_key] = translate_text(summary, target_lang)
        return cache["translations"][cache_key]
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/download", methods=["POST", "OPTIONS"])
def download_summary():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.update(
            {
                "Access-Control-Allow-Origin": "http://localhost:3000",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Credentials": "true",
            }
        )
        return response
    data = request.json
    return (
        savetofile(data.get("url"), data.get("summary"))
        if data.get("url") and data.get("summary")
        else jsonify({"error": "URL and summary are required"})
    ), 400


if __name__ == "__main__":
    app.run(debug=True)
