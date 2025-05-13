import { Construct } from 'constructs';
import { getParamStoreString } from '../../getParamStoreString';

export const dev = (scope: Construct) => ({
  TFLITE_MODEL_NAME: "model.tflite"
});
