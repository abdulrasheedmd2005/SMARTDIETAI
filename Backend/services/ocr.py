from paddleocr import PaddleOCR
import cv2
import numpy as np

def enhance_for_ocr(image):
    image=cv2.resize(
        image,
        None,
        fx=2,
        fy=2,
    
    interpolation=cv2.INTER_CUBIC)

    lab=cv2.cvtColor(
        image,cv2.COLOR_BGR2LAB
    )
    l, a, b=cv2.split(lab)
    clahe=cv2.createCLAHE(clipLimit=2.0,tileGridSize=(8,8)
    )
    l=clahe.apply(l)
    lab=cv2.merge((l,a,b))
    image=cv2.cvtColor(
        lab,cv2.COLOR_LAB2BGR  )


    image =cv2.convertScaleAbs(
        image,
        alpha=1.3,
        beta=5
    )
    kernel=np.array([[0,-1,0],[-1,5,-1],[0,-1,0]])
    image=cv2.filter2D(
        image,
        -1,
        kernel
    )   
    return image

ocr = PaddleOCR(
    use_angle_cls=False,
    lang="en"
)

def score_result(result):

    if result is None or result[0] is None:
        return 0

    score = 0

    for line in result[0]:

        text = line[1][0]
        confidence = line[1][1]

        if len(text.strip()) > 2 and confidence > 0.5:
            score += 1

    return score

def rotation_ocr(image):

    image = enhance_for_ocr(image)

    results = {}

    original_result = ocr.ocr(image, cls=True)
    results["original"] = original_result

    clockwise = cv2.rotate(
        image,
        cv2.ROTATE_90_CLOCKWISE
    )

    cw_result = ocr.ocr(
        clockwise,
        cls=True
    )

    results["cw"] = cw_result

    counter_clockwise = cv2.rotate(
        image,
        cv2.ROTATE_90_COUNTERCLOCKWISE
    )
    
    ccw_result = ocr.ocr(
        counter_clockwise,
        cls=True
    )

    results["ccw"] = ccw_result

    best_key = max(
        results,
        key=lambda k: score_result(results[k])
    )

    return results[best_key]

def scale_ocr(image):

    scales = [1]

    results = []

    for scale in scales:

        resized = cv2.resize(
            image,
            None,
            fx=scale,
            fy=scale
        )

        result = ocr.ocr(
            resized,
            cls=True
        )

        results.append(result)

    best_result = max(
        results,
        key=score_result
    )

    return best_result

def extract_text(result):

    if result is None or result[0] is None:
        return ""

    lines = []

    for line in result[0]:
        text = line[1][0]
        lines.append(text)

    return "\n".join(lines)



def run_ocr(image):

    # Support image path and cropped image
    if isinstance(image, str):
        image = cv2.imread(image)

    if image is None:
        return ""

    rotation_result = rotation_ocr(image)

    scale_result = scale_ocr(image)

    if score_result(scale_result) > score_result(rotation_result):
        best_result = scale_result
    else:
        best_result = rotation_result

    text = extract_text(best_result)

    return text
