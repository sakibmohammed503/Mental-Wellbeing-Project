from flask import Flask, request, jsonify
from flask_cors import CORS
from openpyxl import Workbook, load_workbook
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

EXCEL_FILE = "responses.xlsx"

# Must match the order fields are appended in save_to_excel()
HEADERS = [
    "Timestamp",
    "Age",
    "Gender",
    "Social Media Hours / Day",
    "Sessions Per Day",
    "Avg Session Length (Mins)",
    "Late Night Usage",
    "Short Video Hours / Day",
    "Sleep Hours",
    "Study Hours / Week",
    "Digital Addiction Score",
    "Prediction"
]


def ensure_excel_exists():
    if not os.path.exists(EXCEL_FILE):
        wb = Workbook()
        ws = wb.active
        ws.title = "Responses"
        ws.append(HEADERS)
        wb.save(EXCEL_FILE)


def predict_mental_wellbeing(data):
    social_media_hours = data.get("social_media_hours", 0)
    sleep_hours = data.get("sleep_hours", 0)
    digital_addiction_score = data.get("digital_addiction_score", 0)
    late_night_usage = data.get("late_night_usage", "")

    if (
        social_media_hours > 8
        or sleep_hours < 5
        or digital_addiction_score > 30
        or late_night_usage == "Often"
    ):
        return "High Risk"
    else:
        return "Low Risk"


def save_to_excel(data, prediction):
    ensure_excel_exists()
    wb = load_workbook(EXCEL_FILE)
    ws = wb["Responses"]
    ws.append([
        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        data.get("age", ""),
        data.get("gender", ""),
        data.get("social_media_hours", ""),
        data.get("sessions_per_day", ""),
        data.get("average_session_length_minutes", ""),
        data.get("late_night_usage", ""),
        data.get("short_video_hours", ""),
        data.get("sleep_hours", ""),
        data.get("study_hours_per_week", ""),
        data.get("digital_addiction_score", ""),
        prediction
    ])
    wb.save(EXCEL_FILE)


@app.route("/api/assess", methods=["POST"])
def assess():
    try:
        data = request.get_json(force=True)

        required_fields = [
            "age", "gender", "social_media_hours", "sessions_per_day",
            "average_session_length_minutes", "late_night_usage",
            "short_video_hours", "sleep_hours", "study_hours_per_week",
            "digital_addiction_score"
        ]
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

        prediction = predict_mental_wellbeing(data)
        save_to_excel(data, prediction)

        return jsonify({
            "prediction": prediction,
            "message": "Assessment saved successfully"
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Mental Wellbeing backend is running"})


if __name__ == "__main__":
    ensure_excel_exists()
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)