from app import app, socketio, mqtt


if __name__ == '__main__':
    socketio.run(app)
    mqtt.run(app)
