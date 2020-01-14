from app import app, mqtt


if __name__ == '__main__':
    app.run()
    mqtt.init_app(app)

