from flask import Flask, jsonify, request, send_file, make_response
from flask_cors import CORS
from summaryToMultipleLang import translateSummarytoLang
from timestamp import gettimestampoutput
from transcripttoquiz import generatequiz
from texttosummary import generatesummary, savetofile
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

# Simple cache dictionary
cache = {"transcripts": {}, "summaries": {}, "translations": {}, "quizzes": {}}


@app.route("/api/text", methods=["GET"])
def get_text():
    return jsonify({"message": "Hello from Flask!"})


@app.route("/api/summarize", methods=["POST"])
def get_summary():
    data = request.json
    youtube_url = data.get("youtube_url")

    if not youtube_url:
        return jsonify({"error": "YouTube URL is required."}), 400

    try:
        # Check cache first
        if youtube_url in cache["summaries"]:
            return jsonify({"summary": cache["summaries"][youtube_url]})

        # If not in cache, generate and store
        summary = generatesummary(youtube_url)
        cache["summaries"][youtube_url] = summary
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/download", methods=["POST", "OPTIONS"])
def download_summary():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response

    data = request.json
    url = data.get("url")
    summary = data.get("summary")

    if not url or not summary:
        return jsonify({"error": "URL and summary are required"}), 400

    return savetofile(url, summary)


@app.route("/api/generate_mcqs", methods=["POST"])
def generate_mcqs_api():
    data = request.json
    youtube_url = data.get("youtube_url")

    if not youtube_url:
        return jsonify({"error": "YouTube URL is required."}), 400

    try:
        # Check cache first
        if youtube_url in cache["quizzes"]:
            return cache["quizzes"][youtube_url]

        # If not in cache, generate and store
        mcqs = generatequiz(youtube_url)
        cache["quizzes"][youtube_url] = mcqs
        return mcqs
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/get_timestamp_output", methods=["POST"])
def generate_timestamp_output_api():
    data = request.json
    youtube_url = data.get("youtube_url")
    topic = data.get("topic")

    if not youtube_url:
        return jsonify({"error": "YouTube URL is required."}), 400

    try:
        result = gettimestampoutput(youtube_url, topic)
        return result
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/get_translation", methods=["POST"])
def generate_translation_api():
    data = request.json
    youtube_url = data.get("youtube_url")
    target_language = data.get("targetlanguage")

    if not youtube_url:
        return jsonify({"error": "YouTube URL is required."}), 400

    try:
        # Check cache first
        cache_key = f"{youtube_url}_{target_language}"
        if cache_key in cache["translations"]:
            return cache["translations"][cache_key]

        # If not in cache, generate and store
        translation = translateSummarytoLang(target_language, youtube_url)
        cache["translations"][cache_key] = translation
        return translation
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
