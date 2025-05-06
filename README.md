# aws-lambda-tflite
An example of running tflite_runtime on AWS Lambda functions

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

## Convert your model
In order to run tensorflow models you need to convert your model to tflite version.

You can find the converter script inside `scripts/tflite-model-converter` folder


## Upload your model
The `.tflite` model needs to be uploaded in S3 bucket
You can do this manually using `aws-cli` or AWS Console.