from main import app
from application.sec import datastore
from application.models import db, Role, User
from flask_security import hash_password
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    
    datastore.find_or_create_role(name="admin", description="User is an Admin")
    datastore.find_or_create_role(name="store_manager", description="User is an Store Manager")
    datastore.find_or_create_role(name="buyer", description="User is a Buyer")
    db.session.commit()
    
    if not datastore.find_user(email="admin@email.com"):
        datastore.create_user(
            email="admin@email.com", password=generate_password_hash("admin"), roles=["admin"])
    if not datastore.find_user(email="inst1@email.com"):
        datastore.create_user(
            email="inst1@email.com", password=generate_password_hash("inst1"), roles=["store_manager"], active=False)
    if not datastore.find_user(email="stud1@email.com"):
        datastore.create_user(
            email="stud1@email.com", password=generate_password_hash("stud1"), roles=["buyer"])
    if not datastore.find_user(email="stud2@email.com"):
        datastore.create_user(
            email="stud2@email.com", password=generate_password_hash("stud2"), roles=["buyer"])

    db.session.commit()
