from flask_restful import Resource, Api, reqparse, fields, marshal
from flask_security import auth_required, roles_required, current_user
from flask import jsonify
from sqlalchemy import or_
from datetime import datetime
from .models import db, User, Role, Category, Product, Orders_Desc, Order_Details, ApprovalRequest
from .instances import cache

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


order_desc_post_parser = reqparse.RequestParser()
order_desc_post_parser.add_argument('OID', type=int, help='Order ID is required and should be an integer', required=True)
order_desc_post_parser.add_argument('expense', type=float, help='expense is required and should be a float', default=0)


order_details_parser = reqparse.RequestParser()
order_details_parser.add_argument('email', type=str, help='User email is required and should be an string', required=True)
order_details_parser.add_argument('PID', type=int, help='Product ID is required and should be an integer', required=True)
order_details_parser.add_argument('Qty', type=int, help='Quantity is required and should be an integer', required=True)

order_details_del_parser = reqparse.RequestParser()
order_details_del_parser.add_argument('email', type=str, help='User email is required and should be an string', required=True)
order_details_del_parser.add_argument('PID', type=int, help='Product ID is required and should be an integer', required=True)

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

class ProductList(fields.Raw):
    def format(self, products):
        return [marshal(product, product_fields) for product in products]

category_fields = {
    'CID': fields.Integer,
    'Name': fields.String,
    'show': fields.Integer,
    'products': ProductList(attribute='products'),
}

category_fields_wop = {
    'CID': fields.Integer,
    'Name': fields.String,
    'show': fields.Integer,
}

class Category_Field(fields.Raw):
    def format(self, cat):
        return marshal(cat, category_fields_wop)

approval_req_fields = {
    'id': fields.Integer,
    'category_id': fields.Integer,
    'update_name': fields.String,
    'status': fields.String,
    'user': fields.Nested(user_fields),
    'cat': Category_Field(attribute='cat'),
}


    
product_fields = {
    'PID': fields.Integer,
    'Name': fields.String,
    'Price': fields.Float,
    'Unit': fields.String,
    'Stock': fields.Integer,
    'CID': fields.Integer,
}

product_fields_wc = {
    'PID': fields.Integer,
    'Name': fields.String,
    'Price': fields.Float,
    'Unit': fields.String,
    'Stock': fields.Integer,
    
    'cat': Category_Field(attribute='cat'),
}

order_desc_fields = {
    'OID': fields.Integer,
    'Date': fields.String,
    'Status': fields.Integer,
    'UID': fields.String,
}

class Product_Field(fields.Raw):
    def format(self, prod):
        return marshal(prod, product_fields)
    
order_details_fields = {
    'OID': fields.Integer,
    'Qty': fields.Integer,
    'prod': Product_Field(attribute='product'),
}


# Resources for different models

class UserByIdResource(Resource):
    @auth_required("token")
    @cache.cached(timeout=30)
    def get(self, uid):
        user = User.query.filter_by(id=uid).first()
        if user:
            return marshal(user, user_by_id_fields)
        else:
            return {"message": "User not found"}, 404

# Add the UserByIdResource to the API with the endpoint '/users/<uid>'
api.add_resource(UserByIdResource, '/user/<int:uid>')

class UserResource(Resource):
    # Retrieve all users
    @auth_required("token")
    @roles_required("admin")
    @cache.cached(timeout=30)
    def get(self):
        users = User.query.filter_by(active = False).all()
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
    
     # Create a new user (admin role required)
    @auth_required("token")
    @roles_required("admin")
    def put(self, uid):
        user = User.query.filter_by(id=uid).first()
        user.active = True
        db.session.commit()
        return {"message": "User approved successfully"}

# Add the UserResource to the API with the endpoint '/users'
api.add_resource(UserResource, '/users', '/users/<int:uid>')

class CategoryResource(Resource):
    # Retrieve all categories or a specific category by ID
    @auth_required("token")
    @cache.cached(timeout=30)
    def get(self, category_id=None):    
        if category_id:
            category = Category.query.get(category_id)
            if category:
                return marshal(category, category_fields)
            else:
                return {"message": "Category not found"}, 404
        else:
            categories = Category.query.filter_by(show = 1).all()
            if len(categories) > 0:
                return marshal(categories, category_fields)
            else:
                return {"message": "No categories found"}, 404
    
    # Create a new category (admin role required)
    @auth_required("token")
    def post(self):
        args = category_parser.parse_args()
        category = Category(Name=args.get("Name"))
        
        try:
            if(current_user.has_role('admin')):
                category.show = 1
                
            db.session.add(category)
            db.session.commit()
            
            if(current_user.has_role('store_manager')):
                #print(current_user.id)
                approval_request = ApprovalRequest(category_id=category.CID, update_name = None, status="Pending", UID = current_user.id)
                db.session.add(approval_request)
                db.session.commit()
                return {"message": "Category creation request has been sent\n The category will be added once approved!"}
            return {"message": "Category created successfully"}
        except:
            db.session.rollback()
            return {"message": "Category with the same name already exists please try a new name"}, 400
    
    # Update a category by ID (admin role required)
    @auth_required("token")
    def put(self, category_id):
        args = category_parser.parse_args()
        
        try:
            if(current_user.has_role('admin')):
                category = Category.query.get(category_id)

                if not category:
                    return {"message": "Category not found"}, 404

                # Update only the fields that are provided in the request
                if args.get("Name"):
                    category.Name = args.get("Name")

                db.session.commit()
                return {"message": "Category updated successfully"}
            else:
                category = Category.query.filter_by(Name = args.get("Name")).first()
                if category:
                    return {"message":"This Name is being used by another category."},400
                approval_request = ApprovalRequest(category_id=category_id, update_name = args.get("Name"), status="Pending", UID = current_user.id)
                db.session.add(approval_request)
                db.session.commit()
                return {"message": "Category update request sent\n Name will be updated once approved!"}
        except:
            return {"message": "Category with same name already exists!"}, 400
            

    # Delete a category by ID (admin role required)
    @auth_required("token")
    def delete(self, category_id):
        if(current_user.has_role('admin')):
            category = Category.query.get(category_id)
            if not category:
                return {"message": "Category not found"}, 404
            
            db.session.delete(category)
            db.session.commit()
            return {"message": "Category deleted successfully"}
        else:
            approval_request = ApprovalRequest(category_id=category_id, update_name = None, status="Pending", UID = current_user.id)
            db.session.add(approval_request)
            db.session.commit()
            return {"message": "Category delete request sent\n Category will be deleted once approved!"}

# Add the CategoryResource to the API with the endpoint '/categories'
api.add_resource(CategoryResource, '/categories', '/categories/<int:category_id>')


class ApprovalRequestResource(Resource):
    @auth_required("token")
    @roles_required("admin")
    @cache.cached(timeout=30)
    def get(self, req_id=None):    
        if req_id:
            req = ApprovalRequest.query.get(req_id)
            if req:
                return marshal(req, approval_req_fields)
            else:
                return {"message": "Category not found"}, 404
        else:
            reqs = ApprovalRequest.query.filter_by(status = "Pending").all()
            if len(reqs) > 0:
                return marshal(reqs, approval_req_fields)
            else:
                return {"message": "No categories found"}, 404
            
    @auth_required("token")
    @roles_required("admin")
    def put(self, req_id):
        req = ApprovalRequest.query.get(req_id)
        if req.update_name:
            req.status = "Approved"
            req.cat.Name = req.update_name
            db.session.commit()
            return {"message": "Category update approved"}
        elif not req.cat.show:
            req.status = "Approved"
            req.cat.show = 1
            db.session.commit()
            return {"message": "Category creation approved"}
        elif req.cat.show:
            req.status = "Approved"
            db.session.delete(req.cat)
            db.session.commit()
            return {"message": "Category deletion approved"}
        else:
            return {"message": "Category not found"}, 404
            
api.add_resource(ApprovalRequestResource, '/requests', '/requests/<int:req_id>')


class ProductResource(Resource):
    # Retrieve all products
    @auth_required("token")
    @cache.cached(timeout=30)
    def get(self):
        products = Product.query.all()
        if len(products) > 0:
            return marshal(products, product_fields)
        else:
            return {"message": "No products found"}, 404

    # Create a new product (admin role required)
    @auth_required("token")
    @roles_required("store_manager")
    def post(self):
        args = product_parser.parse_args()
        try:
            product = Product(Name=args.get("Name"), Price=args.get("Price"), Unit=args.get("Unit"),
                            Stock=args.get("Stock"), CID=args.get("CID"))
            db.session.add(product)
            db.session.commit()
        except:
            return {"message":"Error creating the product."}, 400
        return {"message": "Product created successfully"}

    @auth_required("token")
    @roles_required("store_manager")
    def put(self, product_id):
        args = product_parser.parse_args()
        product = Product.query.get(product_id)

        if not product:
            return {"message": "Product not found"}, 404

        try:
            # Update only the fields that are provided in the request
            if args.get("Name"):
                product.Name = args.get("Name")
            if args.get("Price"):
                product.Price = args.get("Price")
            if args.get("Unit"):
                product.Unit = args.get("Unit")
            if args.get("Stock"):
                product.Stock = args.get("Stock")
            db.session.commit()
        except:
            return {"error": "Product update error"}, 400
        return {"message": "Product updated successfully"}
    
    @auth_required("token")
    @roles_required("store_manager")
    def delete(self, product_id):
        product = Product.query.get(product_id)

        if not product:
            return {"message": "Product not found"}, 404

        db.session.delete(product)
        db.session.commit()
        return {"message": "Product deleted successfully"}
    
# Add the ProductResource to the API with the endpoint '/products'
api.add_resource(ProductResource, '/products', '/products/<int:product_id>')

class ProductCatResource(Resource):
    # Retrieve all products
    @auth_required("token")
    @cache.cached(timeout=30)
    def get(self, pid):
        product = Product.query.get(pid)
        if product:
            return marshal(product, product_fields_wc)
        else:
            return {"message": "No products found"}, 404
# Add the ProductResource to the API with the endpoint '/products'
api.add_resource(ProductCatResource, '/product/<int:pid>')

class OrderDescResource(Resource):
    # Retrieve all order descriptions
    @auth_required("token")
    @cache.cached(timeout=30)
    def get(self):
        orders_desc = Orders_Desc.query.all()
        if len(orders_desc) > 0:
            return marshal(orders_desc, order_desc_fields)
        else:
            return {"message": "No orders found"}, 404

    # Create a new order description (admin role required)
    @auth_required("token")
    def post(self):
        args = order_desc_post_parser.parse_args()
        print(args)
        datetime_obj = datetime.strptime(datetime.now().strftime("%Y-%m-%d"), "%Y-%m-%d").date()
        status = ""
        order = Orders_Desc.query.filter(Orders_Desc.OID == args.get("OID")).first()
        
        if order is None:
            status = "failure"
        else:
            try:
                order.Status = 0
                order.Expense = args.get("expense")
                order.Date = datetime_obj
                db.session.flush()
                
            except Exception as e:
                status = "Invalid request"
                print("Rolling back")
                
            else:
                status="success"
                db.session.commit()
                order_items = Order_Details.query.filter(Order_Details.OID == args.get("OID")).all()
                for item in order_items:
                    try:
                        prod = Product.query.filter(Product.PID == item.PID).first()
                        prod.Stock = prod.Stock - item.Qty
                        db.session.flush()
                        #print(prod.PID, prod.Stock)
                        
                    except Exception as e:
                        print("Rolling back")
                        
                status="success"
                db.session.commit()

                print("Commit")
                
        return {"message": "Cart checked out!"}

# Add the OrderDescResource to the API with the endpoint '/orders_desc'
api.add_resource(OrderDescResource, '/orders_desc')

class OrderDetailsResource(Resource):
    # Retrieve all order details
    @auth_required("token")
    @cache.cached(timeout=30)
    def get(self):
        order_details = Order_Details.query.all()
        if len(order_details) > 0:
            return marshal(order_details, order_details_fields)
        else:
            return {"message": "No order details found"}, 404
        
    # Create new order details (admin role required)
    @auth_required("token")
    def post(self):
        args = order_details_parser.parse_args()
       
        user = User.query.filter_by(email=args.get("email")).first()

        active_order = None
        for o in user.orders:
            if o.Status == 1:
                active_order = o
        #print(active_order)
        if active_order is None:
            try:
                new_order = Orders_Desc(Status = 1, UID = int(user.id), Date=datetime.strptime(datetime.now().strftime("%Y-%m-%d"), "%Y-%m-%d").date())
                db.session.add(new_order)
                db.session.commit()
                #print(marshal(new_order, order_desc_fields), new_order.OID)
                #return {"message": "heyy"}
                new_line_item = Order_Details(OID = new_order.OID, PID = args.get("PID"), Qty = args.get("Qty"))
                db.session.add(new_line_item)
            except Exception as et:
                status = "Invalid addition"
                print("Rolling back", et)
                db.session.rollback()
            else:
                status="success"
                db.session.commit()
        else:
            try:            
                new_line_item = Order_Details(OID = int(active_order.OID), PID = args.PID, Qty = args.Qty)
                db.session.add(new_line_item)
                db.session.commit()
            except Exception as e:
                
                print("Rolling back")
                db.session.rollback()
                return {"message":"This item exists in your cart\n You can change your quantity by editing the cart"}, 400
            else:
                print("success")
        return {"message": "Order details created successfully"}
    
    @auth_required("token")
    def put(self):
        args = order_details_parser.parse_args()
       
        user = User.query.filter_by(email=args.get("email")).first()

        active_order = None
        for o in user.orders:
            if o.Status == 1:
                active_order = o
        #print(active_order)
        
        try:            
            new_line_item = Order_Details.query.filter_by(OID = int(active_order.OID), PID = args.PID).first()
            new_line_item.Qty = args.get("Qty")
            db.session.flush()
            
        except Exception as e:
            
            print("Rolling back")
            db.session.rollback()
            return {"error":"Rolling back"}, 404
        else:
            print("success")
            db.session.commit()

        return {"message": "Order details updated successfully"}
    
    @auth_required("token")
    def delete(self):
        args = order_details_del_parser.parse_args()
        
        user = User.query.filter_by(email=args.get("email")).first()
        
        active_order = None
        for o in user.orders:
            if o.Status == 1:
                active_order = o

        item = Order_Details.query.filter(Order_Details.OID == active_order.OID, Order_Details.PID == args.PID).first()
        #return {"message":"hello there"}
        try:
            if item is not None:
                
                db.session.delete(item)
                db.session.commit()
                return {"message":"Product deleted from cart"}
            else:
                return {"error":"Product not found"}, 404
                #return jsonify(error='Product not found')
        except Exception as e:
            db.session.rollback()
            return {"error":"An error occurred while deleting the product"}, 404
            


# Add the OrderDetailsResource to the API with the endpoint '/order_details'
api.add_resource(OrderDetailsResource, '/order_details')

class CartDetails(Resource):
    # Retrieve all order details
    @auth_required("token")
    @cache.cached(timeout=30)
    def get(self, email): 
        user = User.query.filter_by(email=email).first()
        
        active_order = None
        for o in user.orders:
            if o.Status == 1:
                active_order = o
        
        if active_order is None:
            return {"message": "No active order found"}, 404
        else:
            order_details = Order_Details.query.filter_by(OID=active_order.OID).all()
            if len(order_details) > 0:
                return marshal(order_details, order_details_fields)
            else:
                return {"message": "No order details found"}, 404

api.add_resource(CartDetails, '/cartdetails/<string:email>')