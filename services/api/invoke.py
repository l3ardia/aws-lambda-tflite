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
            "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg"  # cat
       ]
    })
}

# Call the Lambda function
response = lambda_handler(event, None)

# Print the response
print(json.loads(response["body"]))