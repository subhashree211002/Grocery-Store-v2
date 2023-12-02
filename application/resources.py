from flask_restful import Resource, Api, reqparse, fields, marshal
from flask_security import auth_required, roles_required, current_user
from flask import jsonify
from sqlalchemy import or_
from datetime import datetime
from .models import db, User, Role, Category, Product, Orders_Desc, Order_Details

# Create Flask-RESTful API instance with a prefix
api = Api(prefix='/api')

# Request parsers for different models
user_parser = reqparse.RequestParser()
user_parser.add_argument('username', type=str, help='Username is required and should be a string', required=True)
user_parser.add_argument('email', type=str, help='Email is required and should be a string', required=True)
user_parser.add_argument('password', type=str, help='Password is required and should be a string', required=True)
user_parser.add_argument('active', type=bool, help='Active status should be a boolean')

category_parser = reqparse.RequestParser()
category_parser.add_argument('Name', type=str, help='Category name is required and should be a string', required=True)

product_parser = reqparse.RequestParser()
product_parser.add_argument('Name', type=str, help='Product name is required and should be a string', required=True)
product_parser.add_argument('Price', type=float, help='Price is required and should be a float', required=True)
product_parser.add_argument('Unit', type=str, help='Unit is required and should be a string', required=True)
product_parser.add_argument('Stock', type=int, help='Stock is required and should be an integer', required=True)
product_parser.add_argument('CID', type=int, help='Category ID is required and should be an integer', required=True)

order_desc_parser = reqparse.RequestParser()
order_desc_parser.add_argument('Date', type=str, help='Date is required and should be a string')
order_desc_parser.add_argument('Status', type=int, help='Status is required and should be an integer', default=0)
order_desc_parser.add_argument('UID', type=str, help='User ID is required and should be a string', required=True)

order_details_parser = reqparse.RequestParser()
order_details_parser.add_argument('OID', type=int, help='Order ID is required and should be an integer', required=True)
order_details_parser.add_argument('PID', type=int, help='Product ID is required and should be an integer', required=True)
order_details_parser.add_argument('Qty', type=int, help='Quantity is required and should be an integer', required=True)

# Fields for formatting data in the API response
user_by_id_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'email': fields.String,
    'active': fields.Boolean,
}

user_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'email': fields.String,
    'active': fields.Boolean,
}

category_fields = {
    'CID': fields.Integer,
    'Name': fields.String,
}

product_fields = {
    'PID': fields.Integer,
    'Name': fields.String,
    'Price': fields.Float,
    'Unit': fields.String,
    'Stock': fields.Integer,
    'CID': fields.Integer,
}

order_desc_fields = {
    'OID': fields.Integer,
    'Date': fields.String,
    'Status': fields.Integer,
    'UID': fields.String,
}

order_details_fields = {
    'OID': fields.Integer,
    'PID': fields.Integer,
    'Qty': fields.Integer,
}


# Resources for different models

class UserByIdResource(Resource):
    @auth_required("token")
    def get(self, uid):
        user = User.query.filter_by(id=uid).first()
        if user:
            return marshal(user, user_by_id_fields)
        else:
            return {"message": "User not found"}, 404

# Add the UserByIdResource to the API with the endpoint '/users/<uid>'
api.add_resource(UserByIdResource, '/users/<int:uid>')

class UserResource(Resource):
    # Retrieve all users
    @auth_required("token")
    def get(self):
        users = User.query.all()
        if len(users) > 0:
            return marshal(users, user_fields)
        else:
            return {"message": "No users found"}, 404

    # Create a new user (admin role required)
    @auth_required("token")
    @roles_required("admin")
    def post(self):
        args = user_parser.parse_args()
        user = User(username=args.get("username"), email=args.get("email"), password=args.get("password"))
        if args.get("active") is not None:
            user.active = args.get("active")
        db.session.add(user)
        db.session.commit()
        return {"message": "User created successfully"}

# Add the UserResource to the API with the endpoint '/users'
api.add_resource(UserResource, '/users')

class CategoryResource(Resource):
    # Retrieve all categories
    @auth_required("token")
    def get(self):
        categories = Category.query.all()
        if len(categories) > 0:
            return marshal(categories, category_fields)
        else:
            return {"message": "No categories found"}, 404

    # Create a new category (admin role required)
    @auth_required("token")
    @roles_required("admin")
    def post(self):
        args = category_parser.parse_args()
        category = Category(Name=args.get("Name"))
        db.session.add(category)
        db.session.commit()
        return {"message": "Category created successfully"}

# Add the CategoryResource to the API with the endpoint '/categories'
api.add_resource(CategoryResource, '/categories')

class ProductResource(Resource):
    # Retrieve all products
    @auth_required("token")
    def get(self):
        products = Product.query.all()
        if len(products) > 0:
            return marshal(products, product_fields)
        else:
            return {"message": "No products found"}, 404

    # Create a new product (admin role required)
    @auth_required("token")
    @roles_required("admin")
    def post(self):
        args = product_parser.parse_args()
        product = Product(Name=args.get("Name"), Price=args.get("Price"), Unit=args.get("Unit"),
                          Stock=args.get("Stock"), CID=args.get("CID"))
        db.session.add(product)
        db.session.commit()
        return {"message": "Product created successfully"}

# Add the ProductResource to the API with the endpoint '/products'
api.add_resource(ProductResource, '/products')

class OrderDescResource(Resource):
    # Retrieve all order descriptions
    @auth_required("token")
    def get(self):
        orders_desc = Orders_Desc.query.all()
        if len(orders_desc) > 0:
            return marshal(orders_desc, order_desc_fields)
        else:
            return {"message": "No orders found"}, 404

    # Create a new order description (admin role required)
    @auth_required("token")
    @roles_required("admin")
    def post(self):
        args = order_desc_parser.parse_args()
        order_desc = Orders_Desc(Date=datetime.strptime(args.get("Date"), "%Y-%m-%d"), Status=args.get("Status"), UID=args.get("UID"))
        db.session.add(order_desc)
        db.session.commit()
        return {"message": "Order description created successfully"}

# Add the OrderDescResource to the API with the endpoint '/orders_desc'
api.add_resource(OrderDescResource, '/orders_desc')

class OrderDetailsResource(Resource):
    # Retrieve all order details
    @auth_required("token")
    def get(self):
        order_details = Order_Details.query.all()
        if len(order_details) > 0:
            return marshal(order_details, order_details_fields)
        else:
            return {"message": "No order details found"}, 404

    # Create new order details (admin role required)
    @auth_required("token")
    @roles_required("admin")
    def post(self):
        args = order_details_parser.parse_args()
        print("heyyyyyy", args)
        order_details = Order_Details(OID=args.get("OID"), PID=args.get("PID"), Qty=args.get("Qty"))
        db.session.add(order_details)
        db.session.commit()
        return {"message": "Order details created successfully"}

# Add the OrderDetailsResource to the API with the endpoint '/order_details'
api.add_resource(OrderDetailsResource, '/order_details')


"""from flask_restful import Resource, Api, reqparse, fields, marshal
from flask_security import auth_required, roles_required, current_user
from flask import jsonify
from sqlalchemy import or_
from .models import db


api = Api(prefix='/api')

parser = reqparse.RequestParser()
parser.add_argument('topic', type=str,
                    help='Topic is required should be a string', required=True)
parser.add_argument('description', type=str,
                    help='Description is required and should be a string', required=True)
parser.add_argument('resource_link', type=str,
                    help='Resource Link is required and should be a string', required=True)


class Creator(fields.Raw):
    def format(self, user):
        return user.email


study_material_fields = {
    'id': fields.Integer,
    'topic':   fields.String,
    'description':  fields.String,
    'resource_link': fields.String,
    'is_approved': fields.Boolean,
    'creator': Creator
}


class StudyMaterial(Resource):
    @auth_required("token")
    def get(self):
        if "inst" in current_user.roles:
            study_resources = StudyResource.query.all()
        else:
            study_resources = StudyResource.query.filter(
                or_(StudyResource.is_approved == True, StudyResource.creator == current_user)).all()
        if len(study_resources) > 0:
            return marshal(study_resources, study_material_fields)
        else:
            return {"message": "No Resourse Found"}, 404

    @auth_required("token")
    @roles_required("stud")
    def post(self):
        args = parser.parse_args()
        study_resource = StudyResource(topic=args.get("topic"), description=args.get(
            "description"), resource_link=args.get("resource_link"), creator_id=current_user.id)
        db.session.add(study_resource)
        db.session.commit()
        return {"message": "Study Resource Created"}


api.add_resource(StudyMaterial, '/study_material')"""
