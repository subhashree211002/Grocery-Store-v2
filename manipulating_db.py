from main import app
from application.sec import datastore
from application.models import db, Role, User
from flask_security import hash_password
from werkzeug.security import generate_password_hash

with app.app_context():
    datastore.create_user(
            email="inst2@email.com", password=generate_password_hash("inst2"), roles=["store_manager"], active=True)
    db.session.commit()