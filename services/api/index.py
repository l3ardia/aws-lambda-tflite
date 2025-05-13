import os
import json
import numpy as np
import boto3
import tflite_runtime.interpreter as tflite # type: ignore
from utils import image_preprocessing 
from utils import download_image 

S3_BUCKET = os.environ["S3_BUCKET"]
MODEL = os.environ["MODEL"]
MODEL_PATH = "/tmp/" + MODEL

s3 = boto3.client("s3")

def download_model():
    if not os.path.exists(MODEL_PATH):
        if os.environ.get("LOCAL_TEST"):
            print("Running locally, skipping S3 download...")
        else:
            s3.download_file(S3_BUCKET, MODEL, MODEL_PATH)

download_model()

def lambda_handler(event, context):
    try:
        
        body = event.get("body", "")
        if not body:
            raise ValueError("Empty request body")

        if event.get("isBase64Encoded"):
            import base64
            body = base64.b64decode(body).decode("utf-8")
                    
        # Parse the URL from the event
        input_data = json.loads(body)
        image_urls = input_data.get("image_urls", []) 
        
        # Load TFLite model
        interpreter = tflite.Interpreter(model_path=MODEL_PATH)
        interpreter.allocate_tensors()
        
        # Get input and output details
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()
        
        results = []
        for url in image_urls:
            try:
                # Download and preprocess each image
                image_data = download_image.download(url)
                processed_image = image_preprocessing.preprocess_image(image_data)
                
                # Set input tensor
                interpreter.set_tensor(input_details[0]['index'], processed_image)
                
                # Run inference
                interpreter.invoke()
                    
                # Get output
                output_data = interpreter.get_tensor(output_details[0]['index'])
                predicted_class = int(np.argmax(output_data))
                                            
                results.append({
                    "image_url": url,
                    "class": predicted_class,
                    "confidence": float(np.max(output_data)),
                })

            except Exception as img_err:
                results.append({
                    "image_url": url,
                    "error": str(img_err)
                })
                                
        return {
            "statusCode": 200,
            "body": json.dumps({
                "results": results,
            }),
        }
                                        
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
        }

