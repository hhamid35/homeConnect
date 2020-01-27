from flask import render_template, request, url_for, jsonify
from app import app, db, socketio, mqtt
from .models import Device, RegisteredDevice
import json
import time
import os


@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    mqtt.subscribe('homeConnect/rpi/discovery')
    mqtt.subscribe('homeConnect/rpi/deviceReply')


@mqtt.on_message()
def on_message(client, userdata, message):
    payload = json.loads(message.payload.decode('utf-8'))
    if message.topic == 'homeConnect/rpi/discovery':
        device_discovery(payload)
    elif message.topic == 'homeConnect/rpi/deviceReply':
        browser_update(payload)


"""
    payload = {
        'ip_address': '192.168.0.103'
        'board_name': 'esp8266',
        'mac_address': 'AC:12:F5:D2:A3',
        'topic': 'esp8266_A3',
        'device_type': 'switch'
    }
"""
def device_discovery(payload):
    print('discovered', payload)
    device = Device.query.filter_by(ip_address=payload['ip_address']).first()
    if device:
        device.time_received = int(time.time())
    else:
        new_device = Device(ip_address=payload['ip_address'],
                            payload=json.dumps(payload),
                            time_received=int(time.time()))
        db.session.add(new_device)
        db.session.commit()

"""
    payload = {
        'status': 'success',
        'information': {
            'ip_address': '192.168.0.103',
            'current_state': true
        } 
    }
"""
def browser_update(payload):
    print('got reply')
    socketio.emit('homeConnect/browser/dashboard/rpiUpdate', json.dumps(payload))


def check_devices():
    for registed_device in RegisteredDevice.query.all():
        device = Device.query.filter_by(ip_address=registed_device.ip_address).first()
        if device:
            if time.time() - device.time_received > 10000000:
                db.session.delete(registed_device)
                db.commit()
        else:
            db.session.delete(registed_device)
            db.commit()


@app.route('/')
@app.route('/index')
@app.route('/index.html')
def index():
    check_devices()
    return render_template('index.html')


# """
#     request = {
#         'payload' : {
#             'ip_address': '192.168.0.103',
#             'board_name': 'esp8266',
#             'mac_address': 'AC:12:F5:D2:A3',
#             'topic': 'esp8266_A3',
#             'device_type': 'switch'
#         }
#     }
#
#     response = {
#         'status': 'success'/ 'error',
#     }
# """
# @app.route('/newDevice')
# def new_device():
#     check_devices()
#     payload = {
#         'board_name': 'esp8266',
#         'mac_address': 'AC:12:F5:D2:A3',
#         'topic': 'esp8266_A3',
#         'device_type': 'switch'
#     }
#     device = Device(ip_address=payload['ip_address'],
#                     payload=json.dumps(payload),
#                     time_received=int(time.time()))
#     db.session.merge(device)
#     connection = db.session.connection()
#     connection.execute('')
#     return [(device.ip_address, device.time_received) for device in Device.query.all()]


"""
    request = {}
    
    response = [
        {   
            'ip_address': '192.168.0.103',
            'payload' : {
                'ip_address': '192.168.0.103'
                'board_name': 'esp8266',
                'mac_address': 'AC:12:F5:D2:A3',
                'topic': 'esp8266_A3',
                'device_type': 'switch'
            },
            'time_received': 155555.445
        },
    ]
"""
@app.route('/getDevices', methods=['GET'])
def get_devices():
    check_devices()
    devices = []
    for device in Device.query.all():
        devices.append({
            'ip_address': device.ip_address,
            'payload': json.loads(device.payload),
            'time_received': device.time_received
        })
    return json.dumps(devices)


"""
    request = {
        'ip_address': '192.168.0.103'
    }

    response = {
        'status': 'registered'/'unregistered'/'error',
        'payload': {
            'ip_address': '192.168.0.103'
            'board_name': 'esp8266',
            'mac_address': 'AC:12:F5:D2:A3',
            'topic': 'esp8266_A3',
            'device_type': 'switch'
        }
    }
"""
@app.route('/getDeviceInfo', methods=['POST'])
def get_device_info():
    check_devices()
    response = {
        'status': 'error',
    }
    if request.method == 'POST':
        payload = request.get_json()
        registered_device = RegisteredDevice.query.filter_by(ip_address=payload['ip_address']).first()
        if registered_device:
            response = {
                'status': 'registered',
                'payload': json.loads(registered_device.payload),
                'name': registered_device.name
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
    check_devices()
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
    return json.dumps(response)


"""
    request = {
        'ip_address': '192.168.0.103'
    }
    
    response = {
        'status': 'success'/'error'
    }
"""
@app.route('/unregisterDevice', methods=['POST'])
def unregister_device():
    check_devices()
    response = {
        'status': 'error'
    }
    if request.method == 'POST':
        payload = request.get_json()
        print(payload)
        registered_device = RegisteredDevice.query.filter_by(ip_address=payload['ip_address']).first()
        if registered_device:
            print(registered_device.ip_address)
            db.session.delete(registered_device)
            db.session.commit()
            response = {
                'status': 'success'
            }
    return json.dumps(response)


"""
    request = {}

    response = [
        {   
            'ip_address': '192.168.0.103',
            'name': 'Lamp One'
            'payload' : {
                'ip_address': '192.168.0.103'
                'board_name': 'esp8266',
                'mac_address': 'AC:12:F5:D2:A3',
                'topic': 'esp8266_A3',
                'device_type': 'switch'
            },
            'time_registered': 155555.445
        },
    ]
"""
@app.route('/getRegisteredDevices', methods=['GET'])
def get_registered_devices():
    check_devices()
    devices = []
    for device in RegisteredDevice.query.all():
        devices.append({
            'ip_address': device.ip_address,
            'name': device.name,
            'payload': json.loads(device.payload),
            'time_registered': device.time_registered
        })
    return json.dumps(devices)


@app.route('/dashboard')
@app.route('/dashboard.html')
def dashboard():
    check_devices()
    devices = []
    for device in RegisteredDevice.query.all():
        device_payload = json.loads(device.payload)
        devices.append({
            'ip_address': device.ip_address,
            'name': device.name,
            'payload': device_payload,
            'time_registered': device.time_registered
        })
        mqtt.publish(os.path.join('homeConnect/device/', device_payload['topic']), json.dumps({'action': 'get_current_state'}))
    return render_template('dashboard.html', devices=devices)


"""
    request = {
        'name': 'Lamp One',
        'state'/'value': True/100%,
    }
    
    response = {
        'status': 'success'
    }
"""
@app.route('/deviceChangeState', methods=['POST'])
def device_change_state():
    check_devices()
    response = {
        'status': 'error'
    }
    if request.method == 'POST':
        payload = request.get_json()
        device = RegisteredDevice.query.filter_by(name=payload['name']).first()
        if device:
            device_payload = json.loads(device.payload)
            message = {
                'action': 'change_state',
                'change_to': payload['change_to']
            }
            mqtt.publish(os.path.join('homeConnect/device/', device_payload['topic']), json.dumps(message))
            response = {
                'status': 'success'
            }
    return json.dumps(response)


@app.route('/about')
@app.route('/admin_info.html')
def about():
    check_devices()
    return render_template('admin_info.html')

