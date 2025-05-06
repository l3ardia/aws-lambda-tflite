import { Construct } from "constructs";
import * as convict from "convict";
import * as dotenv from "dotenv";
import * as environments from './environments';
import "./formats";
import path = require("path");

/**
 * Loads the config for the current environment
 *
 * @note You must set process.env.ENV to one of the following before calling
 *  - local
 *  - prod
 *  - dev
 *
 * @param scope The current stack's context. i.e. `this`
 * @returns A valid config object
 */
export const getConfig = (scope: Construct) => {

  dotenv.config({ path: path.resolve(`.env.${process.env.ENV}`) });

  const schema = convict({
    ENV: {
      format: ["prod", "dev"],
      default: "",
      env: "ENV",
    },
    HOSTNAME: {
      format: String,
      default: '',
      env: 'HOSTNAME'
    },
    MODERATION_API_HOSTNAME: {
      format: String,
      default: '',
      env: 'MODERATION_API_HOSTNAME'
    },
    OPENAI_API_KEY: {
      format: String,
      default: '',
      env: 'OPENAI_API_KEY'      
    },
    SYSTEM_CERTIFICATE_ARN: {
      format: String,
      default: '',
    },    
    GLOBAL_SYSTEM_CERTIFICATE_ARN: {
      format: String,
      default: '',
    },
    HOSTED_ZONE_ID: {
      format: String,
      default: '',
    },
    HOSTED_ZONE_NAME: {
      format: String,
      default: '',
      env: 'HOSTED_ZONE_NAME'
    },    
  });

  const env = schema.get("ENV");
  if (!env) {
    throw new Error(
      "getConfig requires process.env.ENV to be set before calling"
    );
  }

  // Load the config based on the environment
  const config = environments[env.replace('-', '_') as keyof typeof environments](scope);
  Object.keys(config).forEach((key) => {
    schema.set(key, config[key as keyof typeof config]);
  });

  // Validate the loaded config matches the schema
  schema.validate({ allowed: "strict" });

  return schema.getProperties();
};

export type Config = ReturnType<typeof getConfig>;
