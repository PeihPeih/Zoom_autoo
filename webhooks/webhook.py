from fastapi import APIRouter, Request, HTTPException, Header
import json
import secrets
import hmac
import hashlib
import os
from dotenv import load_dotenv
import paho.mqtt.client as mqtt

load_dotenv()

webhook_router = APIRouter()

ZOOM_SECRET_TOKEN = os.environ.get("ZOOM_WEBHOOK_SECRET_TOKEN")

MQTT_BROKER = os.environ.get('MQTT_BROKER')  # Địa chỉ của MQTT broker (thay bằng địa chỉ của bạn)
MQTT_PORT = int(os.environ.get("MQTT_PORT"))                 # Cổng của MQTT broker
MQTT_USERNAME = os.environ.get('MQTT_USERNAME')  # Username của MQTT broker
MQTT_PASSWORD = os.environ.get('MQTT_PASSWORD') # Password của MQTT broker
print(MQTT_BROKER, MQTT_PORT, MQTT_USERNAME, MQTT_PASSWORD)
client = mqtt.Client()

client.tls_set(tls_version=mqtt.ssl.PROTOCOL_TLS)
client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
# Kết nối tới MQTT Broker
client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
print(f"Đã kết nối tới MQTT broker: {MQTT_BROKER}")

@webhook_router.post("/webhook")
async def webhook(request: Request):
    print(ZOOM_SECRET_TOKEN)
    # headers = dict(request.headers)
    body = await request.json()
    # print(headers)
    # print(body)

    if 'payload' in body and 'plainToken' in body['payload']: # Dùng để validated url trên link zoom webhook
        secret_token = ZOOM_SECRET_TOKEN.encode("utf-8")
        plaintoken = body['payload']['plainToken']
        mess = plaintoken.encode("utf-8")
        has = hmac.new(secret_token, mess, hashlib.sha256).digest()
        hexmessage = has.hex()

        response = {
            'message': {
                'plainToken': plaintoken,
                'encryptedToken': hexmessage
            }
        }
        print(response['message'])
        return response['message']
    
    payload = body.get('payload')
    event = body.get('event')
    print(payload)
    print(event)

    if event == 'meeting.participant_joined':
        topic = 'zoom/participant/joined'
        if payload:
            client.publish(topic, json.dumps(payload))
            print(f"Đã gửi dữ liệu tới {topic}: {payload}")
    elif event == 'meeting.participant_left':
        topic = 'zoom/participant/left'
        if payload:
            client.publish(topic, json.dumps(payload))
            print(f"Đã gửi dữ liệu tới {topic}: {payload}")
    else:
        return {'error': 'Invalid payload'}