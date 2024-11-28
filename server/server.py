from flask import Flask, request, jsonify
from flask_cors import CORS
import util

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

@app.route('/classify_image', methods=['POST'])
def classify_image():
    try:
        # Get image data from the request
        image_data = request.form.get('image_data')  # For form-based POST
        if not image_data:
            return jsonify({"error": "No image data provided"}), 400

        # Call the util function to classify the image
        result = util.classify_image(image_data)
        return jsonify(result)  # Send JSON response back to frontend
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == "__main__":
    print("Starting Python Flask Server For Sports Celebrity Image Classification")
    util.load_saved_artifacts()
    app.run(host='127.0.0.1', port=5000, debug=True)  # Enable debug for detailed logs
