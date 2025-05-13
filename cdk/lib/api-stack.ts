import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import {
  LambdaIntegration, RestApi,
  SecurityPolicy
} from 'aws-cdk-lib/aws-apigateway';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Code, Function, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { Config, getConfig } from '../shared/config';
import { envName } from '../shared/utils';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as path from 'path';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export interface ApiStackProps extends StackProps {
  appName: string;
  hostName: string;
  distDir: string;
  getEnvironment?: (
    config: ReturnType<typeof getConfig>
  ) => Record<string, string>;  
  timeout?: Duration;
}

export class ApiStack extends Stack {
  api: RestApi;
  config: Config;
  handler: Function;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const config = getConfig(this);

    const environment = props.getEnvironment
      ? props.getEnvironment(config)
      : {};  
      
    // Create an S3 bucket to store the Keras model
    const modelBucket = new Bucket(this, `${props.appName}-tflite-bucket`, {
      bucketName: `${props.appName}-tflite-model`,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    
    // Define a Lambda Layer for TensorFlow & Numpy
    const tfliteLayer = new LayerVersion(this, `${props.appName}-tflite-lambda-layer`, {
      code: Code.fromAsset(path.join(__dirname, '../layers/tflite_runtime_layer.zip')),
      compatibleRuntimes: [Runtime.PYTHON_3_9],
      description: 'Contains numpy, tensorflow, pillow and requests for ML inference',
    }); 

    // Define the Lambda function
    const handler = new Function(this, `${props.appName}-tflite-lambda`, {
      runtime: Runtime.PYTHON_3_9,
      handler: 'index.lambda_handler',
      code: Code.fromAsset(path.join(__dirname, '../../services/api')), // Path to Lambda function
      timeout: Duration.seconds(60),
      memorySize: 512,
      environment: {
        TZ: 'Australia/Sydney',
        ENV: envName,
        S3_BUCKET: modelBucket.bucketName,
        ...(environment || {}),
      },      
      layers: [tfliteLayer],
    });

    // Grant Lambda permissions to read the model from S3
    modelBucket.grantRead(handler);
    
    // Grant necessary permissions
    handler.addToRolePolicy(
      new PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [`${modelBucket.bucketArn}/*`],
      }),
    );    
    
    const certificate = Certificate.fromCertificateArn(
      this,
      `${props.appName}-certificate`,
      config.CERTIFICATE_ARN,
    );

    const api = new RestApi(this, `${props.appName}-gateway`, {
      domainName: {
        domainName: props.hostName,
        certificate,
        securityPolicy: SecurityPolicy.TLS_1_2,
      },
      restApiName: props.appName,
      binaryMediaTypes: ["*/*"]
    });

    const integration = new LambdaIntegration(handler, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    });

    api.root.addProxy({
      defaultIntegration: integration,
      anyMethod: true,
    });

    // Create an API endpoint: POST /classify
    const classifyResource = api.root.addResource('classify');
    classifyResource.addMethod('POST', new LambdaIntegration(handler));

    this.api = api;
    this.config = config;
    this.handler = handler;
  }
}
