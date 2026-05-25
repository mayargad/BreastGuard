from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.assessment import assessment_bp
from routes.info import info_bp
from routes.lab import lab_bp
from routes.parse import parse_bp
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

# Register blueprints
app.register_blueprint(assessment_bp, url_prefix='/api/assessment')
app.register_blueprint(info_bp,       url_prefix='/api/info')
app.register_blueprint(lab_bp,        url_prefix='/api/lab')
app.register_blueprint(parse_bp,      url_prefix='/api/parse')

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "Breast Cancer Detection API is running"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
