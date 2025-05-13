import { Construct } from 'constructs';
import { getParamStoreString } from '../../getParamStoreString';

export const prod = (scope: Construct) => ({
  TFLITE_MODEL_NAME: "model.tflite"
});
