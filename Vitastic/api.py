import os
import json
from flask import Flask, render_template, request, redirect, jsonify, url_for, make_response, send_file,  send_from_directory
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
from flasgger import Swagger, swag_from
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
@swag_from('specification/default.yaml')
def list_service():
    result = {
        'services': ['aml', 'cv']
    }
    return jsonify(result)


@app.route('/cv', methods=["POST"])
@swag_from('specification/cv.yaml')
def submit_cv():
    f = request.files.get('image')
    filename = secure_filename(f.filename)
    f.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    if request.method == 'POST':
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)


@app.route('/aml', methods=["POST"])
@swag_from('specification/aml.yaml')
def submit_aml():
    f = request.files.get('image')
    filename = secure_filename(f.filename)
    f.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    if request.method == 'POST':
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)


if __name__ == '__main__':
    app.run()
