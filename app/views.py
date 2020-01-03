from flask import render_template, request, url_for
from app import app, db, mqttc
import json


@app.route('/')
@app.route('/index')
@app.route('/index.html')
def index():
    return render_template('index.html')


@app.route('/getDevices', methods=['GET'])
def get_devices():
    response = {
        'devices': [
            {
                'name': 'esp8266_1',
                'board': 'esp8266',
                'action_type': 'switch'
            },
            {
                'name': 'esp8266_2',
                'board': 'esp8266',
                'action_type': 'switch'
            },
            {
                'name': 'esp8266_3',
                'board': 'esp8266',
                'action_type': 'switch'
            },
            {
                'name': 'esp8266_4',
                'board': 'esp8266',
                'action_type': 'switch'
            },
            {
                'name': 'esp8266_5',
                'board': 'esp8266',
                'action_type': 'switch'
            }
        ]
    }
    return json.dumps(response['devices'])


@app.route('/getDeviceInfo', methods=['GET'])
def get_device_info():
    return 'not implemented'


@app.route('/registerDevice')
def register_device():
    return 'not implemented'


@app.route('/unregisterDevice')
def unregister_device():
    return 'not implemented'


@app.route('/dashboard')
@app.route('/dashboard.html')
def dashboard():
    return render_template('dashboard.html')


@app.route('/about')
@app.route('/admin_info.html')
def about():
    return render_template('admin_info.html')

