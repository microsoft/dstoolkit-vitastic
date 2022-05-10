import os
from PIL import ImageColor
from src.aml import AzureMLPredictor
from src.util import visualize_bboxs, visualize_polygons
from dotenv import load_dotenv

load_dotenv()
damage_enable_auth = True
damage_endpoint = os.getenv('DETECTION_ENDPOINT')
damage_auth = os.getenv('DETECTION_KEY')


def detect_damage(img_path, threshold, scope):
    global damage_endpoint, damage_enable_auth, damage_auth

    aml_predictor = AzureMLPredictor(endpoint=damage_endpoint + "?prob=" + str(threshold),
                                     enable_auth=damage_enable_auth,
                                     auth=damage_auth)
    print("Endpoint: " + damage_endpoint + "?prob=" + str(threshold))

    if scope == 'semantic segmentation':
        return aml_predictor.extract_segmentations(test_img=img_path, with_logging=True)

    elif scope == 'object detection':
        return aml_predictor.extract_detections(test_img=img_path, with_logging=True)

    elif scope == 'classification':
        pass

    else:
        raise ValueError('Invalid scope value')


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
