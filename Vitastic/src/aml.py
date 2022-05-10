# Logics of inferencing AML model for object detection/segmentation
import cv2
import json
import requests
import io
import numpy as np
from PIL import Image
from .util import unmold_mask


class AzureMLPredictor:

    def __init__(
            self,
            endpoint,
            auth,
            enable_auth=True
    ):
        if enable_auth and auth is None:
            raise ValueError('Authentication key is required to enable authorization')
        self.endpoint = endpoint
        self.enable_auth = enable_auth
        self.auth = auth

    def model_request(self, test_img):
        """
        Send a test image to AML model for object detection or segmentation
        :param test_img: path or url of the test image
        :return: model response in json
        """
        input_bytes = open(test_img, 'rb').read()
        headers = {'Content-Type': 'application/json'}
        if self.enable_auth:
            headers['Authorization'] = f'Bearer {self.auth}'
        resp = requests.post(self.endpoint, input_bytes, headers=headers)

        return json.loads(resp.text)

    def extract_detections(self, test_img, with_logging=True):
        model_responses = self.model_request(test_img=test_img)

        x, y = Image.open(test_img).size
        bboxs = []
        for detect in model_responses:
            box = detect['bounding_box']
            ymin, xmin, ymax, xmax = box[0], box[1], box[2], box[3]
            o_ymin, o_xmin, o_ymax, o_xmax = y * ymin, x * xmin, y * ymax, x * xmax  # De-normalizing
            bbox = [int(x) for x in [o_xmin, o_ymin, o_xmax - o_xmin, o_ymax - o_ymin]]
            bboxs.append(bbox)

        if with_logging:
            bbox_pixels = sum([(bbox[-1] * bbox[-2]) for bbox in bboxs])
            bbox_percentage = bbox_pixels / (x * y)

            return bboxs, {'nbox': len(bboxs),
                           'box_pixel': bbox_pixels,
                           'bbox_percentage': bbox_percentage}
        else:
            return bboxs

    def extract_segmentations(self, test_img, with_logging=True):
        model_responses = self.model_request(test_img=test_img)

        x, y = Image.open(test_img).size
        bboxs, polygons = [], []
        area = 0
        for detect in model_responses:
            box = detect['bounding_box']
            ymin, xmin, ymax, xmax = box[0], box[1], box[2], box[3]
            o_ymin, o_xmin, o_ymax, o_xmax = y * ymin, x * xmin, y * ymax, x * xmax  # De-normalizing
            mask = np.array(detect['mask'])
            # Resize mask array to fit image size and put in the right position
            mask = unmold_mask(mask=mask, bbox=[o_ymin, o_xmin, o_ymax, o_xmax], image_shape=(y, x))

            contours, _ = cv2.findContours((mask * 255).astype(np.uint8), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

            for contour in contours:
                if contour.size > 6:  # Need at least 6 (3 points) to build a valid polygon
                    area += cv2.contourArea(contour)
                    polygon = contour.flatten().tolist()  # Extract polygon list
                    bbox = list(cv2.boundingRect(contour))  # Extract bbox list [l, t, w, h]
                    polygons.append(polygon)
                    bboxs.append(bbox)

        if with_logging:
            bbox_pixels = sum([(bbox[-1] * bbox[-2]) for bbox in bboxs])
            bbox_percentage = bbox_pixels / (x * y)

            return bboxs, polygons, {'nbox': len(bboxs),
                                     'box_pixel': bbox_pixels,
                                     'bbox_percentage': bbox_percentage,
                                     'seg_pixel': area,
                                     'seg_percentage': area / (x * y)}

        else:
            return bboxs, polygons
