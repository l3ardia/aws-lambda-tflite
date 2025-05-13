# AWS Lambda Tensowflow (tflite)
An example of running tensorflow models using tflite_runtime on AWS Lambda functions

This project creates a Lambda layer and integrates it with a Lambda function to enable the execution of TensorFlow 2.7 models.

The deployment process is created using CDK, so you can run it on your own AWS environment by just changing then environment variables.

# Requirements

Python: 3.9

# Installation

## Creating the lambda layer

The `tflite_runtime_layer.zip` is already located in `cdk/layers`. It includes `requests` `Pillow`, `numpy` and `tflite_runtime` But if you need to add your own packages, you can follow the steps:

```
cd scripts/lambda-layer-creator
modify the requirements.txt
sh ./1-install.sh
sh ./2-package.sh
```

# Run

## Train a model using tensorflow 2.7
An example of the installation process and training model is provided in `scripts/example-model-train`. 

Import it to google colab and run it to get exported model. you can also modify this script and add your model. Note that the don't change the Python and Tensorflow version. becuase the built AWS lambda function only works with this configuration. I've used the exported model in the next step.

## Convert your model
In order to run tensorflow models you need to convert your model to tflite version.

You can find the converter script inside `scripts/tflite-model-converter` folder

## Deploy CDK

in `cdk` folder make a copy from `.env.sample` and rename it to `.env.dev`

Fill required information, then run 

```
ENV=dev cdk synth
ENV=dev cdk deploy --all
```

> After deployed, goto hosted zones and assign an A-Record to API Gateway
> In AWS navigate to S3, find the bucket and upload `model.tflite`

## Upload your model
The `.tflite` model needs to be uploaded in S3 bucket
You can do this manually using `aws-cli` or AWS Console.

## Test the result

POST `/classify` and add `image_urls` as array of string to body of request

```
curl --location 'https://tflite.example.com/classify' \
--header 'Content-Type: application/json' \
--data '{
    "image_urls": [
        "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png", 
        "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg"
    ]
}'
```

<img width="1039" alt="image" src="https://github.com/user-attachments/assets/a307798b-6a6d-4b9a-92c2-f7a78865b194" />
