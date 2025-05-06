import {Duration, Stack, StackProps} from 'aws-cdk-lib';
import {
  ContentHandling,
  LambdaIntegration,
  PassthroughBehavior,
  RestApi,
  SecurityPolicy
} from 'aws-cdk-lib/aws-apigateway';
import {Certificate} from 'aws-cdk-lib/aws-certificatemanager';
import {Alarm, ComparisonOperator} from 'aws-cdk-lib/aws-cloudwatch';
import {Code, Function, Runtime} from 'aws-cdk-lib/aws-lambda';
import {PublicHostedZone} from 'aws-cdk-lib/aws-route53';
import {Construct} from 'constructs';
import {Config, getConfig} from '../shared/config';
import {envName} from '../shared/utils';

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

    const certificate = Certificate.fromCertificateArn(
      this,
      `${props.appName}-certificate`,
      config.SYSTEM_CERTIFICATE_ARN,
    );

    const hostedZone = PublicHostedZone.fromHostedZoneAttributes(this, `${props.appName}-hosted-zone`, {
      hostedZoneId: config.HOSTED_ZONE_ID,
      zoneName: config.HOSTED_ZONE_NAME,
    });

    const handler = new Function(this, `${props.appName}-lambda`, {
      functionName: `${props.appName}-lambda`,
      handler: 'app-lambda.handler',
      runtime: Runtime.NODEJS_LATEST,
      code: Code.fromAsset(props.distDir),
      //logRetention: config.LOG_RETENTION,
      timeout: props.timeout || Duration.seconds(10),
      memorySize: 1024,
      environment: {
        TZ: 'Australia/Sydney',
        ENV: envName,
        ...(environment || {}),
      },
    });

    const api = new RestApi(this, `${props.appName}-gateway`, {
      domainName: {
        domainName: props.hostName,
        certificate,
        securityPolicy: SecurityPolicy.TLS_1_2,
      },
      restApiName: props.appName,
      /*deployOptions: {
        loggingLevel: MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
      },*/
      binaryMediaTypes: ["*/*"]
    });

    const integration = new LambdaIntegration(handler, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
      contentHandling: ContentHandling.CONVERT_TO_BINARY,
      passthroughBehavior: PassthroughBehavior.WHEN_NO_MATCH
    });

    api.root.addProxy({
      defaultIntegration: integration,
      anyMethod: true,
    });

    new Alarm(this, `${props.appName}-LambdaErrorsAlarm`, {
      metric: handler.metricErrors({ period: Duration.minutes(1) }),
      threshold: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 1,
      alarmDescription:
        'Alarm if the SUM of Errors is greater than or equal to the threshold (1) for 1 evaluation period',
    });

    this.api = api;
    this.config = config;
    this.handler = handler;
  }
}
