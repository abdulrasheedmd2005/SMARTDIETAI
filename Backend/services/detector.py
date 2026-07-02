import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("ROBOFLOW_API_KEY")
MODEL_ID = os.getenv("MODEL_ID")


def detect_objects(image_path):

    with open(image_path, "rb") as image_file:

        response = requests.post(
            f"https://detect.roboflow.com/{MODEL_ID}",
            params={
                "api_key": API_KEY
            },
            files={
                "file": image_file
            }
        )

    result = response.json()

    return result.get("predictions", [])