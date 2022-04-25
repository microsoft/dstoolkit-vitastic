import os
from PIL import ImageColor
from src.ml import AMLPredictor
from src.util import visualize_bboxs, visualize_polygons
from dotenv import load_dotenv

load_dotenv()
damage_endpoint = os.getenv('DAMAGE_PREDICT_ENDPOINT')
damage_enable_auth = True
damage_auth = os.getenv('DAMAGE_PREDICT_KEY')


def detect_damage(img_path, threshold, scope='full'):
    global damage_endpoint, damage_enable_auth, damage_auth

    aml_predictor = AMLPredictor(endpoint=damage_endpoint + "?prob=" + str(threshold),
                                 enable_auth=damage_enable_auth,
                                 auth=damage_auth)

    print("Endpoint: " + damage_endpoint + "?prob=" + str(threshold))
    responses = aml_predictor.model_request(test_img=img_path)

    if scope == 'full':
        damage_bboxs, damage_polygons, log = aml_predictor.extract_segmentations(test_img=img_path,
                                                                                 model_responses=responses,
                                                                                 with_logging=True)
        return damage_bboxs, damage_polygons, log

    elif scope == 'detection_only':
        damage_bboxs, log = aml_predictor.extract_detections(test_img=img_path,
                                                             model_responses=responses,
                                                             with_logging=True)
        return damage_bboxs, log

    else:
        print('ok')


def visualize_damage(input_path, output_path, bboxs, vcolor, polys=None):
    vcolor = ImageColor.getcolor(vcolor, 'RGB') if vcolor else (0, 255, 0, 255)
    visualize_bboxs(img_path=input_path,
                    bboxs=bboxs,
                    save_path=output_path,
                    color=vcolor)

    # Also visualize polygons if available
    if polys:
        visualize_polygons(img_path=output_path,
                           polygons=polys,
                           save_path=output_path,
                           color=vcolor)
