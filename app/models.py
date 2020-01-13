from app import db


class Device(db.Model):
    __tablename__ = 'devices'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    ip_address = db.Column(db.String, unique=True, nullable=False)
    payload = db.Column(db.String, nullable=False)
    time_received = db.Column(db.String, nullable=False)

    def __repr__(self):
        return '<Device {}>'.format(self.ip_address)


class RegisteredDevice(db.Model):
    __tablename__ = 'registered'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    ip_address = db.Column(db.String, unique=True, nullable=False)
    name = db.Column(db.String, unique=True, nullable=False)
    payload = db.Column(db.String, nullable=False)
    time_registered = db.Column(db.String, nullable=False)
