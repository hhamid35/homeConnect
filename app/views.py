from flask import render_template, request, url_for, jsonify
from app import app, db
from .models import Device, RegisteredDevice
import json
import time


@app.route('/')
@app.route('/index')
@app.route('/index.html')
def index():
    return render_template('index.html')


"""
    request = {
        'ip_address': '192.168.0.103'
        'payload' : {
            'board_name': 'esp8266',
            'mac_address': 'AC:12:F5:D2:A3',
            'topic': 'esp8266_A3',
            'device_type': 'switch'
        }
    }
    
    response = {
        'status': 'success'/ 'error',
    }
"""
@app.route('/newDevice')
def new_device():
    payload = {
        'board_name': 'esp8266',
        'mac_address': 'AC:12:F5:D2:A3',
        'topic': 'esp8266_A3',
        'device_type': 'switch'
    }
    device = Device(ip_address=payload['ip_address'],
                    payload=json.dumps(payload),
                    time_received=int(time.time()))
    db.session.merge(device)
    connection = db.session.connection()
    connection.execute('')
    return [(device.ip_address, device.time_received) for device in Device.query.all()]


"""
    request = {}
    
    response = [
        {
            'board_name': 'esp8266',
            'ip_address': '192.168.0.103',
        },
        {
            'board_name': 'esp8266',
            'ip_address': '192.168.0.104',
        },
    ]
"""
@app.route('/getDevices', methods=['GET'])
def get_devices():
    devices = []
    for device in Device.query.all():
        if (time.time() - device.time_received) < 100000:
            payload = json.loads(device.payload)
            devices.append({
                'board_name': payload['board_name'],
                'ip_address': device.ip_address
            })
    return json.dumps(devices)


"""
    request = {
        'ip_address': '192.168.0.103'
    }
    
    response = {
        'status': 'registered'/'unregistered'/'error',
        'payload': {
            'board_name': 'esp8266',
            'mac_address': 'AC:12:F5:D2:A3',
            'topic': 'esp8266_A3',
            'device_type': 'switch'
        }
    }
"""
@app.route('/getDeviceInfo', methods=['POST'])
def get_device_info():
    response = {
        'status': 'error',
    }
    if request.method == 'POST':
        payload = request.get_json()
        registered_device = RegisteredDevice.query.filter_by(ip_address=payload['ip_address']).first()
        print(registered_device)
        if registered_device:
            response = {
                'status': 'registered',
                'payload': json.loads(registered_device.payload)
            }
        elif registered_device is None:
            unregistered_device = Device.query.filter_by(ip_address=payload['ip_address']).first()
            if unregistered_device:
                response = {
                    'status': 'unregistered',
                    'payload': json.loads(unregistered_device.payload)
                }
    return json.dumps(response)


"""
    request = {
        'ip_address': '192.168.0.103',
        'name': 'Light One'
    }
    
    response = {
        'status': 'success'/'error'
    }
"""
@app.route('/registerDevice', methods=['POST'])
def register_device():
    response = {
        'status': 'error'
    }
    if request.method == 'POST':
        payload = request.get_json()
        print(payload)
        unregistered_device = Device.query.filter_by(ip_address=payload['ip_address']).first()
        if unregistered_device:
            registered_device = RegisteredDevice(ip_address=unregistered_device.ip_address,
                                                 name=payload['name'],
                                                 payload=unregistered_device.payload,
                                                 time_registered=int(time.time()))
            db.session.add(registered_device)
            db.session.commit()
            response = {
                'status': 'success'
            }
    return response


"""
    request = {
        'ip_address': '192.168.0.103'
    }
    
    response = {
        'status': 'success'/'error'
    }
"""
@app.route('/unregisterDevice')
def unregister_device():
    response = {
        'status': 'error'
    }
    if request.method == 'POST':
        payload = request.get_json()
        registered_device = RegisteredDevice.query.filter_by(ip_address=payload['ip_address']).filter()
        if registered_device:
            db.session.delete(registered_device)
            db.session.commit()
    return response


@app.route('/dashboard')
@app.route('/dashboard.html')
def dashboard():
    return render_template('dashboard.html')


@app.route('/about')
@app.route('/admin_info.html')
def about():
    return render_template('admin_info.html')

