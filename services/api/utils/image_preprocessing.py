from io import BytesIO
import numpy as np
from PIL import Image

def preprocess_image(image_data, target_size=(96, 96)):
    """
    Convert image bytes into a NumPy array suitable for model prediction.
    - Converts image to RGB format
    - Resizes image to the expected target size (e.g., 96x96)
    - Normalizes pixel values
    """
    
    img = Image.open(BytesIO(image_data))
    img = img.convert("RGB")
    img = img.resize(target_size)

    img_array = np.array(img, dtype=np.float32)  # Convert to float32
    img_array = img_array / 255.0  # Normalize pixel values (0 to 1)

    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)  

    return img_array
