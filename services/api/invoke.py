import json
import os

# Set environment variables for local testing
os.environ["LOCAL_TEST"] = "1"
os.environ["S3_BUCKET"] = "mock-bucket"
os.environ["MODEL_KEY"] = "model.tflite"

from index import lambda_handler 

# Simulated input data with multiple image URLs
event = {
    "body": json.dumps({
        "image_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png",  # airplane (transparent airplane icon)
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Toyota_Yaris_GRMN_Genf_2018.jpg/640px-Toyota_Yaris_GRMN_Genf_2018.jpg",  # automobile
            "https://upload.wikimedia.org/wikipedia/commons/5/51/American_Robin.jpg",  # bird
            "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg",  # cat
            "https://upload.wikimedia.org/wikipedia/commons/f/fb/White-tailed_deer.jpg",  # deer
            "https://upload.wikimedia.org/wikipedia/commons/9/9a/Pug_600.jpg",  # dog
            "https://upload.wikimedia.org/wikipedia/commons/4/45/Green_frog_on_spring.jpg",  # frog
            "https://upload.wikimedia.org/wikipedia/commons/e/e3/Arabian_Horse_in_the_desert.jpg",  # horse
            "https://upload.wikimedia.org/wikipedia/commons/0/0e/Cargo_ship_Kaunas_sea.jpg",  # ship
            "https://upload.wikimedia.org/wikipedia/commons/9/9e/Yellow_truck_on_highway.jpg"  # truck
       ]
    })
}

# Call the Lambda function
response = lambda_handler(event, None)

# Print the response
print(json.loads(response["body"]))