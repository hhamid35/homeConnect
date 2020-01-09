from flask import render_template, request, url_for, jsonify
from app import app, db, mqttc
from .forms import RegisterForm
import json



@app.route('/')
@app.route('/index')
@app.route('/index.html')
def index():
    return render_template('index.html')


@app.route('/getDevices', methods=['GET'])
def get_devices():
    devices = [
        {
            'name': 'esp8266_1',
            'ip_address': '192.168.0.1'
        },
        {
            'name': 'esp8266_2',
            'ip_address': '192.168.0.2'
        },
        {
            'name': 'esp8266_3',
            'ip_address': '192.168.0.3'
        }
    ]
    return json.dumps(devices)


@app.route('/getDeviceInfo', methods=['GET'])
def get_device_info():
    device_info = {
        'name': 'esp8266_1',
        'ip_address': '192.168.0.1',
        'status': 'unregistered',
        'device_type': 'switch'
    }
    return json.dumps(device_info)


@app.route('/registerDevice', methods=['POST'])
def register_device():
    print(request.method)
    result = request.get_json()
    print(result)
    return 'submitted'


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

