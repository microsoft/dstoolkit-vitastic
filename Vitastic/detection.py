import os
from PIL import ImageColor
from src.aml import AzureMLPredictor
from src.cv import CustomVisionPredictor
from src.util import visualize_bboxs, visualize_polygons
from dotenv import load_dotenv

load_dotenv()
damage_enable_auth = True
damage_endpoint = os.getenv('DETECTION_ENDPOINT')
damage_auth = os.getenv('DETECTION_KEY')
cv_project_id = os.getenv('CV_PROJECT_ID')
cv_iteration_name = os.getenv('ITERATION_NAME')


def detect_damage(img_path, threshold: str, scope: str, service: str):
    assert not (scope == 'semantic segmentation' and service == 'cv'), 'Segmentation not supported by custom vision'
    global damage_endpoint, damage_enable_auth, damage_auth

    # Custom vision backbone
    if service == 'cv':
        predictor = CustomVisionPredictor(endpoint=damage_endpoint,
                                          auth=damage_auth,
                                          project_id=cv_project_id,
                                          iteration_name=cv_iteration_name,
                                          threshold=float(threshold))

    # Azure ml backbone
    elif service == 'aml':
        predictor = AzureMLPredictor(endpoint=damage_endpoint + "?prob=" + threshold,
                                     enable_auth=damage_enable_auth,
                                     auth=damage_auth)
    else:
        raise NotImplementedError('Service not supported')

    print("Using service: " + service)
    print("Endpoint: " + damage_endpoint + "?prob=" + threshold)

    if scope == 'semantic segmentation':
        return predictor.extract_segmentations(test_img=img_path, with_logging=True)

    elif scope == 'object detection':
        return predictor.extract_detections(test_img=img_path, with_logging=True)

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
