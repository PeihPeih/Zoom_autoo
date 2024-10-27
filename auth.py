import requests
import base64
from dotenv import load_dotenv
import os

load_dotenv()

client_id = os.environ.get('b')
client_secret = os.environ.get('c')
account_id = os.environ.get('a')

def get_token():
    token_url = "https://zoom.us/oauth/token"

    auth_string = f"{client_id}:{client_secret}"
    b64_auth_string = base64.b64encode(auth_string.encode()).decode()

    headers = {
        "Authorization": f"Basic {b64_auth_string}",
    }

    payload = {
        "grant_type": "account_credentials",
        "account_id": account_id
    }
    
    response = requests.post(token_url, headers=headers, data=payload)
    if response.status_code == 200:
        token_data = response.json()['access_token']
        return token_data
    else:
        raise Exception(f"Error: {response.status_code}, {response.text}")