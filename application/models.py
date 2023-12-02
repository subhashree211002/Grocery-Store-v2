from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
db = SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users',
                         backref=db.backref('users', lazy='dynamic'))
    orders = db.relationship('Orders_Desc', back_populates='user')  # Added relationship
    
class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
    
class Category(db.Model):
    __tablename__ = 'Category'
    CID = db.Column(db.Integer, autoincrement=True, primary_key=True)
    Name = db.Column(db.String(collation='NOCASE'), unique=True, nullable=False)

    # Establishing the relationship from Category to Product
    products = db.relationship("Product", back_populates="cat", cascade='all, delete-orphan', passive_deletes=True)
    
class Product(db.Model):
    __tablename__ = 'Product'
    PID = db.Column(db.Integer, autoincrement=True, primary_key=True)
    Name = db.Column(db.String(collation='NOCASE'), unique=True, nullable=False)
    Price = db.Column(db.Float, nullable=False)
    Unit = db.Column(db.String, nullable=False)
    Stock = db.Column(db.Integer, nullable=False)
    CID = db.Column(db.Integer, db.ForeignKey('Category.CID', ondelete='CASCADE'))
    
    # Establishing the relationship from Product to Category
    cat = db.relationship("Category", back_populates="products")
    ords = db.relationship("Order_Details", back_populates="product")
    
class Orders_Desc(db.Model):
    # Table for order description
    __tablename__ = 'Orders_Desc'
    OID = db.Column(db.Integer, autoincrement=True, primary_key=True)
    Date = db.Column(db.Date)
    Status = db.Column(db.Integer, nullable=False, default=0)  # Change default value to 0
    UID = db.Column(db.String, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    
    # Establishing the relationship from Order_Desc to Users
    user = db.relationship("User", back_populates="orders")
    
    # Establishing the relationship from Order_Desc to Order_Details
    products = db.relationship("Order_Details", back_populates="order", cascade='all, delete-orphan', passive_deletes=True)

class Order_Details(db.Model):
    # Table for order details
    __tablename__ = 'Order_Details'
    OID = db.Column(db.Integer, db.ForeignKey('Orders_Desc.OID', ondelete='CASCADE'), primary_key=True, nullable=False)
    PID = db.Column(db.Integer, db.ForeignKey('Product.PID', ondelete='SET NULL'), primary_key=True)
    Qty = db.Column(db.Integer, nullable=False)
    
    # Define the composite primary key constraint
    __table_args__ = (db.PrimaryKeyConstraint('OID', 'PID'),)
    
    # Establishing the relationship from Order_Details to Order_Desc
    order = db.relationship("Orders_Desc", back_populates="products")
    product = db.relationship("Product", back_populates="ords")
