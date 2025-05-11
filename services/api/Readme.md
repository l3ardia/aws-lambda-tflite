# Setup Instructions

This guide explains how to set up the environment to run the image classification service using `pyenv`.

## Prerequisites

- Install `pyenv` if you haven't already:  
  ```sh
  curl https://pyenv.run | bash
  ```
  Follow the instructions to add `pyenv` to your shell configuration.
  
- Ensure you have `pyenv` properly configured:
  ```sh
  pyenv update
  ```

## Install Python 3.9.21

```sh
pyenv install 3.9.21
pyenv virtualenv 3.9.21 custom-env
pyenv activate custom-env
```

## Install Dependencies

Ensure you have `pip` and `virtualenv` installed:

```sh
pip install --upgrade pip
pip install virtualenv
```

Then, install the required dependencies:

```sh
pip install pillow boto3 numpy tensorflow requests
```

## Set Up Environment Variables

Create a `.env` file or export environment variables directly in your shell:

```sh
export S3_BUCKET="your-s3-bucket"
export MODEL="your-model"
```

If testing locally, set:

```sh
export LOCAL_TEST=1
```

## Running the Service Locally

1. Download the model manually or allow the script to fetch it from S3.
2. Run the test script:

```sh
python invoke.py
```

This will call `lambda_handler` with test data and print the results.

## Deactivating the Environment

After you're done, deactivate the `pyenv` virtual environment:

```sh
pyenv deactivate
```

## Notes

- Ensure `pyenv` is correctly initialized in your shell (e.g., `~/.bashrc`, `~/.zshrc`).
- You may need additional dependencies depending on your system configuration.

Now your environment is set up and ready to run the service!

```
python invoke.py
```