from summaryToMultipleLang import translateSummarytoLang
from timestamp import gettimestampoutput
from transcripttoquiz import generatequiz
from texttosummary import generatesummary, savetofile
from flask import Flask, jsonify, request, send_file

from flask import Flask, jsonify, request, send_file, make_response
from flask_cors import CORS

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


@app.route("/api/text", methods=["GET"])
def get_text():
    return jsonify({"message": "Hello from Flask!"})


#########################################################


@app.route("/api/summarize", methods=["POST"])
def get_summary():
    data = request.json
    youtube_url = data.get("youtube_url")

    if not youtube_url:
        return jsonify({"error": "YouTube URL is required."}), 400

    try:
        # Fetch transcript from the provided YouTube URL
        summary = generatesummary(youtube_url)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"summary": summary})


############################################################


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


#############################################################


@app.route("/api/generate_mcqs", methods=["POST"])
def generate_mcqs_api():
    data = request.json
    youtube_url = data.get("youtube_url")

    if not youtube_url:
        return jsonify({"error": "YouTube URL is required."}), 400

    try:
        # Fetch transcript from the provided YouTube URL
        mcqs = generatequiz(youtube_url)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return mcqs


###########################################################


@app.route("/api/get_timestamp_output", methods=["POST"])
def generate_timestamp_output_api():
    data = request.json
    youtube_url = data.get("youtube_url")
    topic = data.get("topic")

    if not youtube_url:
        return jsonify({"error": "YouTube URL is required."}), 400

    try:
        # Fetch transcript from the provided YouTube URL
        result = gettimestampoutput(youtube_url, topic)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return result


###########################################################


@app.route("/api/get_translation", methods=["POST"])
def generate_translation_api():
    data = request.json
    youtube_url = data.get("youtube_url")
    targetlanguage = data.get("targetlanguage")

    if not youtube_url:
        return jsonify({"error": "YouTube URL is required."}), 400

    try:
        # Fetch transcript from the provided YouTube URL
        result = translateSummarytoLang(targetlanguage, youtube_url)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return result


###########################################################


if __name__ == "__main__":
    app.run(debug=True)
