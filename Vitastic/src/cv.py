# Logics of inferencing Custom Vision model for object classification, detection and segmentation
from PIL import Image
from msrest.authentication import ApiKeyCredentials
from azure.cognitiveservices.vision.customvision.prediction import CustomVisionPredictionClient


class CustomVisionPredictor:
    def __init__(
            self,
            endpoint,
            auth,
            project_id,
            iteration_name,
            threshold
    ):
        self.project_id = project_id
        self.iteration_name = iteration_name
        self.threshold = threshold
        self.predictor = CustomVisionPredictionClient(endpoint,
                                                      ApiKeyCredentials(in_headers={"Prediction-key": auth}))

    def _model_request(self, test_img):
        with open(test_img, "rb") as contents:
            resp = self.predictor.detect_image(
                self.project_id,
                published_name=self.iteration_name,
                image_data=contents.read()
            )
            predictions = list(filter(lambda p: p.probability >= self.threshold, resp.predictions))

        return predictions

    def extract_classification(self, test_img, with_logging=True):
        pass

    def extract_detections(self, test_img, with_logging=True):
        model_responses = self._model_request(test_img=test_img)

        x, y = Image.open(test_img).size
        bboxs = []
        for detect in model_responses:
            length, top, width, height = detect.bounding_box.left, detect.bounding_box.top, detect.bounding_box.width, detect.bounding_box.height
            o_length, o_top, o_width, o_height = x * length, y * top, x * width, y * height  # De-normalizing
            bbox = [int(x) for x in [o_length, o_top, o_width, o_height]]
            bboxs.append(bbox)

        if with_logging:
            bbox_pixels = sum([(bbox[-1] * bbox[-2]) for bbox in bboxs])
            bbox_percentage = bbox_pixels / (x * y)

            return bboxs, {'nbox': len(bboxs),
                           'box_pixel': bbox_pixels,
                           'bbox_percentage': bbox_percentage}
        else:
            return bboxs
