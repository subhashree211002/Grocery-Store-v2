from flask import current_app as app, jsonify, request, render_template, send_file
from flask_security import auth_required, roles_required
from werkzeug.security import check_password_hash
from flask_restful import marshal, fields
import flask_excel as excel
from celery.result import AsyncResult
from .tasks import create_resource_csv
from .models import User, db, RolesUsers, Role
from .sec import datastore

@app.get('/')
def home():
    return render_template("home.html")

@app.get('/login_page')
def login_page():
    return render_template("login.html")

@app.get('/dash')
def dash():
    return render_template("dash.html")

@app.get('/add_to_cart/<int:pid>')
def add_to_cart(pid):
    return render_template("dash.html")

@app.get('/cart')
def cart():
    return render_template("cart.html")


@app.get('/add_edit_prod/<int:CID>/<int:pid>')
def add_edit_prod(CID, pid):
    return render_template("create_edit_prod.html")

@app.get('/add_edit_cat/<int:CID>')
def add_edit_cat(CID):
    return render_template("create_edit_cat.html")

@app.get('/approve')
def approve():
    return render_template("approve.html")

@app.get('/admin')
@auth_required("token")
@roles_required("admin")
def admin():
    return "Hello Admin"


@app.get('/activate/inst/<int:inst_id>')
@auth_required("token")
@roles_required("admin")
def activate_instructor(inst_id):
    instructor = User.query.get(inst_id)
    if not instructor or "inst" not in instructor.roles:
        return jsonify({"message": "Instructor not found"}), 404

    instructor.active = True
    db.session.commit()
    return jsonify({"message": "User Activated"})


@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "email not provided"}), 400

    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "User Not Found"}), 404
    if not user.active:
        return jsonify({"message": "User waiting for approval"}), 400
    if check_password_hash(user.password, data.get("password")):
        return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name})
    else:
        return jsonify({"message": "Wrong Password"}), 400


user_fields = {
    "id": fields.Integer,
    "email": fields.String,
    "active": fields.Boolean
}


@app.get('/users')
@auth_required("token")
@roles_required("admin")
def all_users():
    users = User.query.all()
    if len(users) == 0:
        return jsonify({"message": "No User Found"}), 404
    return marshal(users, user_fields)


"""@app.get('/study-resource/<int:id>/approve')
@auth_required("token")
@roles_required("inst")
def resource(id):
    study_resource = StudyResource.query.get(id)
    if not study_resource:
        return jsonify({"message": "Resource Not found"}), 404
    study_resource.is_approved = True
    db.session.commit()
    return jsonify({"message": "Aproved"})"""


@app.get('/download-csv')
def download_csv():
    task = create_resource_csv.delay()
    return jsonify({"task-id": task.id})

@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True, mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', download_name='sales_summary.xlsx')
    else:
        return jsonify({"message": "Task Pending"}), 404
    
@app.get('/mail-template')
def mail_temp():
    # Fetch all users from the User table
    users = User.query.join(RolesUsers, User.id == RolesUsers.user_id)\
                  .join(Role, RolesUsers.role_id == Role.id)\
                  .filter(Role.name == "buyer")\
                  .all()

    user_data = []

    # Iterate through each user and retrieve the required data
    for user in users:
        user_info = {
            "CurrentDate": "2023-12-14",           
            'UserName': user.username,
            'orders': [],
            "TotalOrders": len(user.orders),
            "TotalExpenditure": 0.0,
        }

        # Fetch order-related data for each user
        for order in user.orders:
            if order.Status == 1:
                continue
            order_info = {
                'OrderDate': order.Date,
                "TotalAmount": order.Expense,
                'orderedProducts': []
            }

            # Fetch product-related data for each order
            for order_detail in order.products:
                product_info = {
                    'product': order_detail.product.Name,
                    'quantity': order_detail.Qty
                }

                order_info['orderedProducts'].append(product_info)

            user_info['orders'].append(order_info)
            user_info["TotalExpenditure"] += order_info["TotalAmount"]

        user_data.append(user_info)

    #return jsonify(context, user_data)
    return render_template("test.html", **user_data[0])


