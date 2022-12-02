import os
import json
from flask import Flask, render_template, request, redirect, jsonify, url_for, make_response, send_file,  send_from_directory
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
from flasgger import Swagger
from detection import detect_damage, visualize_damage


app = Flask(__name__)
swagger = Swagger(app)
app.config['UPLOAD_FOLDER'] = './tmp/uploads/'
app.config['DETECTED_FOLDER'] = './tmp/detected/'


@app.route('/', methods=["GET", "POST"])
def index():
    if request.method == "GET":
        return render_template('index.html')
    if request.method == "POST":
        return redirect('/apidocs')


@app.route('/services', methods=["GET"])
def list_service():
    """Endpoint returning a list of supported Azure detection services
    ---
    responses:
      200:
        description: A list of supported Azure services
    """
    result = {
        'services': ['aml', 'cv']
    }
    return jsonify(result)


@app.route('/cv/<scope>', methods=["POST"])
def submit_cv(scope):
    """Endpoint submitting a job to an Azure custom vision service with specific detection scope
    ---
    parameters:
      - name: scope
        in: path
        type: string
        enum: ['classification', 'detection']
        required: true
        default: classification
      - name: image
        required: true
        in: formData
        type: file
    definitions:
      cv:
        type: object
        properties:
          endpoint:
            type: string
        reference: Azure custom vision service
    responses:
      200:
        description: image file with detection result
    """
    f = request.files.get('image')
    filename = secure_filename(f.filename)
    f.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    if request.method == 'POST':
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)


@app.route('/aml/<scope>', methods=["POST"])
def submit_aml(scope):
    """Endpoint submitting a job to an Azure machine learning service with specific detection scope
    ---
    parameters:
      - name: scope
        in: path
        type: string
        enum: ['classification', 'detection', 'segmentation']
        required: true
        default: classification
      - name: image
        required: true
        in: formData
        type: file
    definitions:
      aml:
        type: object
        properties:
          endpoint:
            type: string
        reference: Azure machine learning service
    responses:
      200:
        description: base64 image encoding with detection results
    """
    f = request.files.get('image')
    filename = secure_filename(f.filename)
    f.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    if request.method == 'POST':
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)


if __name__ == '__main__':
    app.run()
