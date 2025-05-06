import { Construct } from 'constructs';
import { getParamStoreString } from '../../getParamStoreString';

export const prod = (scope: Construct) => ({
  HOSTED_ZONE_ID: getParamStoreString(scope, 'HOSTED_ZONE_ID'),
  GLOBAL_SYSTEM_CERTIFICATE_ARN: getParamStoreString(scope, 'GLOBAL_SYSTEM_CERTIFICATE_ARN'),
  SYSTEM_CERTIFICATE_ARN: getParamStoreString(scope, 'SYSTEM_CERTIFICATE_ARN'),
});
