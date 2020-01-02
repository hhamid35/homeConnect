from flask import render_template, url_for
from web_portal import app, db

@app.route('/')
@app.route('/index')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')
