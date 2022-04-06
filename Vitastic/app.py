import os
from flask import Flask, request, jsonify, make_response, send_file
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
from detection import detect_damage, visualize_damage   # sys.path.insert(0, '..')


app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = './tmp/uploads/'
app.config['DETECTED_FOLDER'] = './tmp/detected/'
app.config['CORS_HEADERS'] = 'Content-Type'

# TODO: dynamic configuration
job = "segmentation"  # enum(classification, detection, segmentation)


@app.route("/upload", methods=['POST'])
def upload_image():
    # Catch post attributes and files
    img = request.files['file']
    thr = request.form['confidence']

    # Save user uploaded image to file
    imgname = secure_filename(img.filename)
    img_in = os.path.join(app.config['UPLOAD_FOLDER'], imgname)
    img_out = os.path.join(app.config['DETECTED_FOLDER'], imgname)
    img.save(img_in)

    # Detect and visualize damages on input image
    if os.path.isfile(img_in):
        # segmentation job
        if job == "segmentation":
            bbox, poly, report = detect_damage(img_path=img_in, threshold=thr, scope='full')
            visualize_damage(input_path=img_in,
                             output_path=os.path.join(app.config['DETECTED_FOLDER'], secure_filename(img.filename)),
                             bboxs=bbox, polys=poly)
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
            report['seg_percentage'] = "{:.2%}".format(report['seg_percentage'])

        # detection job
        elif job == "detection":
            bbox, report = detect_damage(img_path=img_in, threshold=thr, scope='detection_only')
            visualize_damage(input_path=img_in,
                             output_path=os.path.join(app.config['DETECTED_FOLDER'], secure_filename(img.filename)),
                             bboxs=bbox)
            # Attach damage evaluation in the final report
            print(report)
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

        # TODO: improve
        # classification job
        else:
            print('ok')

    if os.path.isfile(img_out):
        print('I am finished!')
        # return jsonify(success=True, img_response=img_out, report_response=report)
        return send_file(img_out)


if __name__ == "__main__":
    app.run(debug=True)
