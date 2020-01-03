from config import Config
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from modules.mqtt_helper import MqttHelper

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
mh = MqttHelper(client_id='homeConnect_app')

from app import views, models

