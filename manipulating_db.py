from main import app
from application.sec import datastore
from application.models import db, Role, User
from flask_security import hash_password
from werkzeug.security import generate_password_hash

with app.app_context():
    datastore.create_user(
            email="inst3@email.com", password=generate_password_hash("inst3"), roles=["store_manager"], active=False)
    datastore.create_user(
            email="inst4@email.com", password=generate_password_hash("inst4"), roles=["store_manager"], active=False)
    datastore.create_user(
            email="inst5@email.com", password=generate_password_hash("inst5"), roles=["store_manager"], active=False)
    db.session.commit()