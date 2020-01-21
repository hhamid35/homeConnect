from app import app, socketio

if __name__ == '__main__':
    # socketio.run(app, host='0.0.0.0', port='80', use_reloader=False)
    socketio.run(app, use_reloader=False)
