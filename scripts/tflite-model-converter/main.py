import tensorflow as tf # type: ignore

# Load the H5 model
model_path = "./model.h5"
model = tf.keras.models.load_model(model_path)

# Convert the model to TFLite format
converter = tf.lite.TFLiteConverter.from_keras_model(model)

# Convert the model
tflite_model = converter.convert()

# Save the TFLite model
tflite_model_path = "./model.tflite"
with open(tflite_model_path, 'wb') as f:
    f.write(tflite_model)

print("Model converted and saved successfully!")