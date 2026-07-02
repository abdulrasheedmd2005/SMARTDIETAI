import re
import warnings

from matplotlib import text

def extract_value(pattern, text):

    match = re.search(
        pattern,
        text,
        re.IGNORECASE | re.DOTALL
    )

    if match:
        try:
            return float(match.group(1))
        except:
            return 0

    return 0

def parse_nutrition(text):

    nutrition = {
        
        "calories": 0,
        "carbohydrates": 0,
        "protein": 0,
        "fat": 0,
        "sugar": 0,
        "calcium": 0,
        "sodium": 0,
        "cholesterol": 0,
    }
    lines=[line.strip() for line in text.split("\n") if line.strip()]

    def get_value(current, next_line):
        m=re.search(r'(\d+(?:\.\d+)?)', current)
        if m:
            return float(m.group(1))
        m=re.search(r'(\d+(?:\.\d+)?)', next_line)
        if m:
            return float(m.group(1))
        return 0
    
    for i, line in enumerate(lines):
       next_line = lines[i + 1] if i + 1 < len(lines) else ""
       lower=line.lower()
       if "calories" in lower or "energy" in lower:
          nutrition["calories"]=get_value(line,next_line)
       elif "carbohydrate" in lower:
          nutrition["carbohydrates"]=get_value(line,next_line)
       elif "protein" in lower:
          nutrition["protein"]=get_value(line,next_line)
       elif "fat" in lower or lower=="total fat":
          nutrition["fat"]=get_value(line,next_line)
       elif "sugar" in lower or lower=="total sugars":
          nutrition["sugar"]=get_value(line,next_line)
       elif "calcium" in lower:
          nutrition["calcium"]=get_value(line,next_line)
       elif "sodium" in lower:
          nutrition["sodium"]=get_value(line,next_line)
       elif "cholesterol" in lower:
          nutrition["cholesterol"]=get_value(line,next_line)



    if nutrition["calories"] >1000: 
       nutrition["calories"] = 0
    if nutrition["carbohydrates"] > 100:
       nutrition["carbohydrates"] = 0
    if nutrition["protein"] > 100:
       nutrition["protein"] = 0 
    if nutrition["fat"] > 100:
       nutrition["fat"] = 0 
    if nutrition["sugar"] > 100:
       nutrition["sugar"] = 0
    if nutrition["calcium"] > 1500:
       nutrition["calcium"] = 0
    if nutrition["sodium"] > 1400:
       nutrition["sodium"] = 0
    if nutrition["cholesterol"] > 200:
       nutrition["cholesterol"] = 0

    return nutrition

def analyze_ingredients(text,nutrition):

    warnings = []

    text = text.lower()

    sugar=nutrition.get("sugar",0 )
    fat=nutrition.get("fat",0 )
    cholesterol=nutrition.get("cholesterol",0 )
    sodium=nutrition.get("sodium",0)

    if sugar > 10 :
       warnings.append("high sugar content")

    if sodium > 400 :
       warnings.append("high sodium content")

    if fat > 17 :
       warnings.append("high fat content")

    if cholesterol > 60 :
       warnings.append("high cholesterol content")

    if "milk" in text:
        warnings.append("Contains Milk")

    if "lactose" in text:
        warnings.append("Contains Lactose")


    if "soy" in text:
        warnings.append("Contains Soy")

    if "gluten" in text:
     warnings.append("Contains Gluten")

    if "salt" in text:
     warnings.append("High Salt Content")

    if "preservative" in text:
     warnings.append("Contains Preservatives")

    if "artificial" in text:
     warnings.append("Contains Artificial Additives")




    return warnings

