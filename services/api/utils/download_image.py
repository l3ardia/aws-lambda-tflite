import requests

def download(url):
    """
    Download the image from the URL and return the image data in memory.
    """
    response = requests.get(url)
    response.raise_for_status()  # Raise an error for bad status codes (4xx, 5xx)
    return response.content  # Return the image data in bytes
