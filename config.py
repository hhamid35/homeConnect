import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    DEBUG = True
    # SERVER_NAME = '0.0.0.0:80'
    SQLALCHEMY_DATABASE_URI = 'sqlite:////' + os.path.join(basedir, 'app.sqlite')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
