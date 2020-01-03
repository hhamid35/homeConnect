import paho.mqtt.client as mqtt
from config import Config
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
mqttc = mqtt.Client()
mqttc.connect('localhost', 1883, 60)
mqttc.loop_start()

from app import views, models

