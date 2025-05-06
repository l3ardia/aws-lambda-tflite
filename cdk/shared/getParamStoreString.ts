import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

let i = 0;
/**
 * Loads a string value from the AWS Param Store
 *
 * @param scope The current stack's context. i.e. `this`
 * @param name The name of the param
 * @returns The stored value
 */
export const getParamStoreString = (scope: Construct, name: string) => {
  // Use a unique ID on every call so that different stacks can load the same param
  const id = name + i;

  return StringParameter.fromStringParameterName(scope, id, name).stringValue;
};
