# Basic image and annotation processing helper functions
import io
import base64
import numpy as np
from bs4 import BeautifulSoup
from skimage.transform import resize
from PIL import Image, ImageDraw, UnidentifiedImageError


def binary_2_image(img_binary, img_name, save_dir=None):
    """
    Write a image binary to an image file

    :param img_binary: image binary
    :param img_name: saving name of the image
    :param save_dir: optional, saving directory of the image
    """
    with open(f'{save_dir}/{img_name}', 'br+') as f:
        f.write(img_binary)


def image_to_string(img_path):
    with open(img_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read())
        encoded_string = encoded_string.decode('utf-8')
    return (encoded_string)


def denormalize_bounding_box(bounding_box, img_width, img_height):
    """
    Denormalize pixel coordinates based on image size

    :param bounding_box: list of normalized bounding box [left, top, right, bottom] coordinates
    :param img_width: image width
    :param img_height: image height
    :return: de-normalized bounding box [left, top, right, bottom] coordinates
    """
    [l, t, r, b] = bounding_box
    return [l * img_width, t * img_height, r * img_width, b * img_height]


def _get_image_size(img_path):
    """
    Get image width and height by opening the image

    :param img_path: path to the image
    :return: list of image [width, height]
    """
    img = Image.open(img_path)
    width, height = img.size
    return [width, height]


def cut_image_bounding(img_path, bounding_box, save_path, return_bytes=False):
    """
    Cut a part of an image off based on a given bounding box;
    And save the cropped image under a new path

    :param img_path: path to the source image
    :param bounding_box: list of normalized [left, top, width, height] coordinates;
                         Using standard right-handed coordinate system
    :param save_path: path to save the image
    :param return_bytes: boolean, whether to return the binary of the cropped image
    :return binary of the cropped image if return_bytes is set True
    """
    img = Image.open(img_path)
    width, height = img.size
    [l, t, w, h] = bounding_box  # [l, t, weight, height]
    coordinate_border = [l, t, l+w, t+h]  # [l, t, right, bottom]
    coordinate_deborder = denormalize_bounding_box(bounding_box=coordinate_border, img_width=width, img_height=height)
    cropped_img = img.crop(tuple(coordinate_deborder))
    cropped_img.save(save_path)

    if return_bytes:
        byteIO = io.BytesIO()
        cropped_img.save(byteIO, format="jpeg")
        return byteIO.getvalue()


def visualize_normalized_bboxs(img_path, bboxs, save_path, color=(255, 0, 0, 255), return_bytes=False):
    """
    Draw bounding boxes in lines based on a set of bounding boxes;
    And save the marked image under a new path

    :param img_path: path to the source image
    :param bboxs: list of bounding boxes, which are all normalized [left, top, width, height] coordinates;
                           Using standard right-handed coordinate system
    :param save_path: path to save the image
    :param color: line color to draw, by default red
    :param return_bytes: boolean, whether to return the binary of the marked image
    :return: binary of the marked image if return_bytes is set True
    """
    img = Image.open(img_path)
    width, height = img.size
    img2 = img.copy()
    draw = ImageDraw.Draw(img2)
    for bounding_box in bboxs:
        [l, t, w, h] = bounding_box  # [l, t, weight, height]
        border = [l, t, l + w, t + h]  # [l, t, right, bottom]
        [l, t, r, b] = denormalize_bounding_box(bounding_box=border, img_width=width, img_height=height)
        xy = [(l, b), (r, t)]   # Two points to identify a rectangle
        draw.rectangle(xy=xy, outline=color, width=5, fill=None)
    img3 = Image.blend(img, img2, 0.5)
    img3.save(save_path)

    if return_bytes:
        byteIO = io.BytesIO()
        img3.save(byteIO, format="jpeg")
        return byteIO.getvalue()


def visualize_bboxs(img_path, bboxs, save_path, color=(255, 0, 0, 255), return_bytes=False):
    img = Image.open(img_path)
    img2 = img.copy()
    draw = ImageDraw.Draw(img2)
    for bounding_box in bboxs:
        [l, t, w, h] = bounding_box  # [l, t, weight, height]
        [l, t, r, b] = [l, t, l + w, t + h]  # [l, t, right, bottom]
        xy = [(l, b), (r, t)]  # Two points to identify a rectangle
        draw.rectangle(xy=xy, outline=color, width=5, fill=None)
    img3 = Image.blend(img, img2, 0.5)
    img3.save(save_path)

    if return_bytes:
        byteIO = io.BytesIO()
        img3.save(byteIO, format="jpeg")
        return byteIO.getvalue()


def visualize_polygons(img_path, polygons, save_path, color=(255, 0, 0, 128), return_bytes=False):
    img = Image.open(img_path)
    img2 = img.copy()
    draw = ImageDraw.Draw(img2)
    for polygon in polygons:
        draw.polygon(tuple(polygon), fill=color)
    img3 = Image.blend(img, img2, 0.5)
    img3.save(save_path)

    if return_bytes:
        byteIO = io.BytesIO()
        img3.save(byteIO, format="jpeg")
        return byteIO.getvalue()


def unmold_mask(mask, bbox, image_shape):
    """
    Converts a mask generated by the neural network to a format similar
    to its original shape.

    :param mask: [height, width] of type float. A small, typically 28x28 mask.
    :param bbox: [y1, x1, y2, x2]. The box to fit the mask in.
    :param image_shape: (height, width) tuple
    :return: Returns a binary mask with the same size as the original image.
    """
    threshold = 0.5
    if not all(isinstance(x, int) for x in bbox):
        bbox = list(map(int, bbox))

    y1, x1, y2, x2 = bbox
    mask = resize(mask, (y2 - y1, x2 - x1))
    mask = np.where(mask >= threshold, 1, 0).astype(np.bool)

    # Put the mask in the right location.
    full_mask = np.zeros(image_shape[:2], dtype=np.bool)
    full_mask[y1:y2, x1:x2] = mask
    return full_mask


# -------------------------------BACKBURNER-----------------------------------------------------------
def batch_norm(ls, img_size):
    """
    Batch normalize a set of image points

    :param ls: list of image point with pixel coordinates
    :param img_size: size of image
    :return: a list of all normalized points
    """
    def normalize_coordinates(col_j, row_i, size):
        """
        Normalize image a pixel coordinate to coordinate between 0 and 1

        :param col_j: x-coordinate
        :param row_i: y-coordinate
        :param size: image size
        :return: normalized (x, y) coordinate
        """
        num_rows, num_cols = size
        x = col_j / (num_cols - 1.)
        y = row_i / (num_rows - 1.)
        return x, y

    return list(map(lambda x: normalize_coordinates(row_i=x[1], col_j=x[0], size=img_size), ls))
# ---------------------------------------------------------------------------------------------------


def parse_annotation_xml(annotation_file):
    """
    Parse image annotations from XML, this XML file has the following hierarchy:
    <imagesize>
        <nrows> <ncols>
    <object>
        <defectpoly>
            <polygon>
                <x> <y>
                <x> <y>
            <polygon>
        <defectpoly>

    :param annotation_file: XML filename to be parsed
    :return: list of lists containing (x, y) coordinates that construct defect polygon areas
    """
    annotations = []

    with open(annotation_file, "r") as file:
        # Read each line in the file, readlines() returns a list of lines
        content = file.read()
        soup = BeautifulSoup(content, "xml")

        # Image size is used in coordinate normalization
        # size = int(soup.find("nrows").getText()), int(soup.find("ncols").getText())
        objects = soup.find_all("object")
        objects = list(filter(lambda elem: elem.find("name").getText() == "defectpoly", objects))

        for object in objects:
            polygons = object.find_all("polygon")
            for polygon in polygons:
                x_points, y_points = polygon.find_all("x"), polygon.find_all("y")
                a = [int(x.getText()) for x in x_points]
                b = [int(y.getText()) for y in y_points]
                points = list(zip(a, b))
                annotations.append(points)
        return annotations


def polygon_2_bbox(poly):
    """
    Convert a polygon list to a bounding box list;
    By taking the min and max x and y points of the given polygon

    :param poly: list of coordinate tuples that construct a polygon area;
                 [(x1, y1), (x2, y2), ... , (xn, yn)]
    :return: list of coordinate tuples that construct a bounding box area;
             [(xmin, ymin), (xmin, ymax), (xmax, ymax), (xmax, ymin)]
    """
    xmax = max(poly, key=lambda x: x[0])[0]
    xmin = min(poly, key=lambda x: x[0])[0]
    ymax = max(poly, key=lambda y: y[1])[1]
    ymin = min(poly, key=lambda y: y[1])[1]

    return [(xmin, ymin), (xmin, ymax), (xmax, ymax), (xmax, ymin)]
