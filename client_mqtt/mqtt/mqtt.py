import paho.mqtt.client as mqtt
import json
import requests

url = "http://127.0.0.1:5000/add_history"

def on_connect(client, userdata, flags, rc):
    print("Connected with result code: " + str(rc))

def on_message(client, userdata, msg):
    text = json.loads(msg.payload)
    res = requests.post(url=url, json=text)
    print(msg.topic + " " + str(text) + " " + res.text)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect('127.0.0.1', 1883, 600) # 600为keepalive的时间间隔
client.subscribe('testapp', qos=0)
client.loop_start() # 保持连接
while True: 
    pass