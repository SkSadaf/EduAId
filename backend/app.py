from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/text', methods=['GET'])
def get_text():
    return jsonify({"message": "Hello from Flask!"})


#########################################################


@app.route('/api/summarize', methods=['GET'])
def get_summary():
    # youtube_url = input("Enter YouTube video URL: ")
    transcript_text = get_transcript_from_url("https://www.youtube.com/watch?v=gxCP68xIR5Y")
    summary = get_summary_from_transcript(transcript_text)

    return jsonify({"message": "Done with summary!"})



if __name__ == '__main__':
    app.run(debug=True)
