import json
import os
from munch import DefaultMunch
from flask import Flask, request, jsonify, make_response, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from detection import detect_damage, visualize_damage   # sys.path.insert(0, '..')


app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = './tmp/uploads/'
app.config['DETECTED_FOLDER'] = './tmp/detected/'
app.config['CORS_HEADERS'] = 'Content-Type'


def handle_segmentation_job(job):
    bbox, poly, report = detect_damage(img_path=job.img_in, threshold=job.thr, scope=job.scope, service=job.service)
    visualize_damage(input_path=job.img_in,
                     output_path=job.img_out,
                     bboxs=bbox, polys=poly,
                     vcolor=job.color)
    # Attach damage evaluation in the final report
    if report['nbox'] == 0:
        report['eval'] = None
    elif report['seg_percentage'] < 0.01:
        report['eval'] = 'tiny'
    elif report['seg_percentage'] < 0.05:
        report['eval'] = 'minor'
    elif report['seg_percentage'] < 0.25:
        report['eval'] = 'medium'
    else:
        report['eval'] = 'severe'
    report['bbox_percentage'] = "{:.2%}".format(report['bbox_percentage'])
    report['seg_percentage'] = "{:.2%}".format(report['seg_percentage'])
    return report


def handle_detection_job(job):
    bbox, report = detect_damage(img_path=job.img_in, threshold=job.thr, scope=job.scope, service=job.service)
    visualize_damage(input_path=job.img_in,
                     output_path=job.img_out,
                     bboxs=bbox,
                     vcolor=job.color)
    # Attach damage evaluation in the final report
    if report['nbox'] == 0:
        report['eval'] = None
    elif report['bbox_percentage'] < 0.01:
        report['eval'] = 'tiny'
    elif report['bbox_percentage'] < 0.05:
        report['eval'] = 'minor'
    elif report['bbox_percentage'] < 0.25:
        report['eval'] = 'medium'
    else:
        report['eval'] = 'severe'
    report['bbox_percentage'] = "{:.2%}".format(report['bbox_percentage'])
    return report


def handle_classification_job(job):
    # TODO: finish implementation
    pass


def catch_request(req):
    """Catch post attributes and files"""
    return DefaultMunch.fromDict({
        'img': req.files['file'],
        'imgname': secure_filename(req.files['file'].filename),
        'img_in': os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(req.files['file'].filename)),
        'img_out': os.path.join(app.config['DETECTED_FOLDER'], secure_filename(req.files['file'].filename)),
        'thr': req.form['confidence'],
        'scope': req.form['scope'],
        'color': f'#{req.form["color"]}',
        'service': req.form['service']
    })


# TODO: complete detection scope implementation
@app.route("/upload", methods=['POST'])
def upload_image():
    # Create job based on received request
    job = catch_request(req=request)

    # Save submitted image locally
    img_out = os.path.join(app.config['DETECTED_FOLDER'], job.imgname)
    job.img.save(job.img_in)

    # Detect and visualize damages on input image
    # segmentation job
    if job.scope == "semantic segmentation":
        report = handle_segmentation_job(job=job)
    # detection job
    elif job.scope == "object detection":
        report = handle_detection_job(job=job)
    # classification job
    else:
        raise NotImplementedError()

    if os.path.isfile(img_out):
        print('I am finished!')
        response = send_file(img_out)
        # Exposing customised header to requests from a different origin
        # See https://stackoverflow.com/a/44816592/2047472
        response.headers.add('Access-Control-Expose-Headers', 'Vitastic-Report')
        response.headers.add_header("Vitastic-Report",  json.dumps(report))

        return response
    else:
        raise Exception('Detection process not finished')


if __name__ == "__main__":
    app.run(debug=True)