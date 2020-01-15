from config import Config
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mqtt import Mqtt
from flask_socketio import SocketIO

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
socketio = SocketIO(app)
mqtt = Mqtt(app)

from app import views

