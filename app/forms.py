from flask_wtf import FlaskForm
from wtforms import SubmitField, TextAreaField
from wtforms.validators import DataRequired


class RegisterForm(FlaskForm):
    topic = TextAreaField('Topic', validators=[DataRequired()])
    register = SubmitField('Register')
