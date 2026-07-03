from pydoc import text
import gc
import cv2
import re


COMMON_INGREDIENTS = [
    "water",
    "sugar","glucose",
    "salt","maida","rice flour","wheat flour","corn flour",
    "flour","cocoa","coconuts","almonds","peanuts","walnuts","nut",
    "oil","garam masala","spices","garlic paste","ginger paste",
    "butter","tomato","potato","red chilli",
    "milk","rice","wheat","corn","oats","barley",
    "eggs","fish","meat","chicken","Soy","beans","peas",
    "yeast","palm oil","olive oil","sunflower oil","palmolein","vegetable oil","coconut oil",
    "vinegar","chilli powder","milk powder","sugar syrup","sugarcane",
    "baking powder","milk solids","cream powder",
    "baking soda","preservatives","antioxidants",
    "cornstarch","starch","iodised salt","sweet"
    "gelatin","syrup","sandwich","jam","pickle","sauce",
    "honey","cookies","biscuits","curry powder",
    "soy sauce","cake","bread","pasta","noodles",
    "mustard","powder","curry","turmeric","cumin","coriander","cardamom","cloves",
    "ketchup","garlic","onion","pepper","cinnamon","nutmeg","vanilla","chocolate","cheese","cream","yogurt",
    "mayonnaise","dextrose"
]

from services.detector import detect_objects
from services.ocr import run_ocr
from services.parser import (
    parse_nutrition,
    analyze_ingredients
)


def crop_prediction(image, prediction):

    x = prediction["x"]
    y = prediction["y"]

    w = prediction["width"]
    h = prediction["height"]

    x1 = int(x - w / 2)
    y1 = int(y - h / 2)

    x2 = int(x + w / 2)
    y2 = int(y + h / 2)

    return image[y1:y2, x1:x2]

def clean_ingredients(text):

    if not text:
        return ""

    text = text.replace("\n", " ")
    stop_words = [
        "store",
        "freezer",
        "thaw",
        "batch",
        "fssai",
        "license",
        "manufactured",
        "net weight",
        "use by",
        "customer care"    
    ]

    lower = text.lower()

    cut_pos = len(text)

    for word in stop_words:

        pos = lower.find(word)

        if pos != -1:
            cut_pos = min(cut_pos, pos)

    text = text[:cut_pos]

    text = re.sub(r"\s+", " ", text)

    return text.strip()


def filter_ingredients(text):

    if not text:
        return ""

    text_lower = text.lower()

    found = []

    for ingredient in COMMON_INGREDIENTS:

        if ingredient.lower() in text_lower:
            found.append(ingredient.title())
    found = list(dict.fromkeys(found))

    return ", ".join(found)


def process_image(image_path):

    image = cv2.imread(image_path)

    predictions = detect_objects(image_path)

    # =========================
    # CASE 2 - NO DETECTION
    # =========================

    if not predictions:

        full_text = run_ocr(image_path)

        nutrition_data = parse_nutrition(
            full_text
        )

        return {
            "nutrition": nutrition_data,
            "warnings": [],
            "nutrition_text": full_text,
            "ingredients_text": ""
        }

    nutrition_text = ""
    ingredients_text = ""

    # =========================
    # CASE 1 - DETECTION FOUND
    # =========================

    for pred in predictions:

        crop = crop_prediction(
            image,
            pred
        )

        text = run_ocr(crop)
        del crop

        cls = pred["class"].lower()

        if "nutrition" in cls:

            nutrition_text = text

        elif "ingredient" in cls:

            ingredients_text = text

    # =========================
    # CASE 3 - BAD DETECTION
    # =========================

    important_keywords = ["nutrition", "energy", "calories", "carbohydrate", "protein", "fat", "sugar", "calcium", "sodium", "cholesterol","fiber"]
    lower_text=nutrition_text.lower()
    keyword_count=sum( keyword in lower_text for keyword in important_keywords)
    nutrition_words = len(
        nutrition_text.split()
    )

    if keyword_count < 2 or nutrition_words < 8:
            nutrition_text= run_ocr(
                image_path
            )
    ingredients_words = len(
        ingredients_text.split()
    )
    if ingredients_words < 3:
         fallback_text = run_ocr(
            image_path
        )

         ingredients_text = fallback_text

    # =========================
    # PARSER
    # =========================
    nutrition_data = parse_nutrition(
        nutrition_text
    )
    ingredients_text = clean_ingredients(   
        ingredients_text
    )
    filtered_ingredients = filter_ingredients(
        ingredients_text
    )
   

    warnings = analyze_ingredients(
        filtered_ingredients,nutrition_data    
    )

    # =========================
    # FINAL RESPONSE
    # =========================
    del image
    del predictions
    gc.collect()

    return {
        "nutrition": nutrition_data,
        "warnings": warnings,
        "nutrition_text": nutrition_text,
        "ingredients_text": filtered_ingredients
    }