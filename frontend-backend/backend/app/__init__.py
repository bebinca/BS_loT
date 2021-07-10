import os
from flask import Flask, current_app, send_file
from flask_cors import CORS
from .config import Config
from .data.database import db
from .data.database.db import get_db
from .data.model import user
from .data.model import history

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
app.register_blueprint(user.bp)
app.register_blueprint(history.bp)

if app.config['FLASK_ENV'] == 'development':
    """
    We need to enable CORS header in development environment, as the host of
    client-side and server-side differs. Besides, Access-Control-Allow-Credentials
    header must be set to make session and user authentication work.
    """
    CORS(app, supports_credentials=True)

@app.route('/')
def index():
    return 'Home Page'

@app.route('/hello')
def hello():
    return 'Hello World'