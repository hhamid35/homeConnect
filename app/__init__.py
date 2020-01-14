from config import Config
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mqtt import Mqtt

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
mqtt = Mqtt()

from app import views

