from app import app, mqtt, socketio


if __name__ == '__main__':
    socketio.run(app)
    mqtt.run(app)
