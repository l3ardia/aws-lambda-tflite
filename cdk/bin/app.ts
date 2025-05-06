#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiStack } from "../lib/api-stack";
import * as dotenv from "dotenv";
import path = require('path');

dotenv.config({ path: path.resolve(`.env.${process.env.ENV}`) });

const envName = process.env.ENV as string;
const APP_NAME = `aws-labda-tflite-${envName}`;

const app = new cdk.App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};

new ApiStack(app, `${APP_NAME}-ApiStack`, {
  env,
  appName: `${APP_NAME}-tflite-api`,
  distDir: '../services/tflite-api/dist',
  hostName: process.env.API_HOSTNAME || "",
  timeout: cdk.Duration.seconds(20),
  getEnvironment: (config) => ({
    OPENAI_API_KEY: config.OPENAI_API_KEY,
  }),
});
