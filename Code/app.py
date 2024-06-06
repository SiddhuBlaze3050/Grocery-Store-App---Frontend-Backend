from flask import Flask, render_template, request, redirect, url_for, jsonify, send_file
from flask_cors import CORS
from application.models import *
import application.config as config
from api.resource import *
from application.security import *
from worker import *
from flask_security.utils import hash_password
from werkzeug.security import generate_password_hash, check_password_hash
from flask_security import auth_required, roles_required, roles_accepted, current_user
from application.security import user_datastore
import flask_excel as excel
from application.tasks import *
from celery.result import AsyncResult
from celery.schedules import crontab
from application.cache import cache
from datetime import datetime, date


# ============================================== Configuration =========================================================================

app = Flask(__name__)
app.config.from_object(config)

CORS(app)
db.init_app(app)
api.init_app(app)
sec.init_app(app, user_datastore)
cache.init_app(app)
excel.init_excel(app)
celery_app = celery_init_app(app)
app.app_context().push()

#============================================ Send Periodic Emails =============================================================

@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=18, minute=00),
        daily_reminder.s('Daily Reminder from EZ Stores'),
    )
    sender.add_periodic_task(
        crontab(hour=12, minute=00, day_of_month=1),
        monthly_report.s(),
    )



# ============================================== Initial Data ============================================================================


@app.before_request
def create_db():
        db.create_all()


        # Create Roles
        if not user_datastore.find_role('admin'):
            admin_role = user_datastore.create_role(name='admin', description='Admin related role')
            db.session.commit()

        if not user_datastore.find_role('manager'):
            manager_role = user_datastore.create_role(name='manager', description='Manager related role')
            db.session.commit()
        
        if not user_datastore.find_role('user'):
            user_role = user_datastore.create_role(name='user', description='User related role')
            db.session.commit()


        # Create Users
        if not user_datastore.find_user(email='admin@ezstores.com'):
            admin_user = user_datastore.create_user(email='admin@ezstores.com', username='admin', password=generate_password_hash('admin123'))
            user_datastore.add_role_to_user(admin_user, admin_role)
            db.session.commit()

        # if not user_datastore.find_user(email='manager@ezstores.com'):
        #     manager_user = user_datastore.create_user(email='manager@ezstores.com', username='manager', password=generate_password_hash('manager123'), active=False)
        #     user_datastore.add_role_to_user(manager_user, manager_role)
        #     db.session.commit()

        # if not user_datastore.find_user(email='user1@ezstores.com'):
        #     customer_user = user_datastore.create_user(email='user1@ezstores.com', username='user1', password=generate_password_hash('user1123'))
        #     user_datastore.add_role_to_user(customer_user, user_role)
        #     db.session.commit()


# ============================================== Controllers ============================================================================

# ============================== Welcome ======================================================

# Welcome Page
@app.route("/", methods=["GET", "POST"])
def home():
    return render_template("index.html")


# ============================== Login =========================================================
    
# User Signup
@app.post('/user-signup')
def user_signup():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "email not provided"}), 400
    
    user = user_datastore.find_user(email=email)

    if user:
        return jsonify({"message": "User with this email already exists"}), 409

    password = data.get("password")
    confirm_password = data.get("checkPassword")

    if password == confirm_password:
        role = data.get("role")
        if role == "manager":
            manager_user = user_datastore.create_user(email=email, username=data.get("username"), password=generate_password_hash(password), active=False)
            user_datastore.add_role_to_user(manager_user, user_datastore.find_role("manager"))
            db.session.commit()
            return jsonify({"message": "Manager Successfully created"}), 201
        elif role == "customer":
            customer_user = user_datastore.create_user(email=email, username=data.get("username"), password=generate_password_hash(password))
            user_datastore.add_role_to_user(customer_user, user_datastore.find_role("user"))
            db.session.commit()
            return jsonify({"message": "User Successfully created"}), 201
    else:
        return jsonify({"message": "Passwords do not match"}), 401
    

# User Login
@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "email not provided"}), 400
    
    user = user_datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "User Not Found"}), 404
    
    if user.active == False:
        return jsonify({"message": "User Not Activated"}), 401

    if check_password_hash(user.password, data.get("password")):
        user.last_login = date.today()
        db.session.commit()
        return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name})
    else:
        return jsonify({"message": "Wrong Password Credentials"}), 400

# ============================== Profile =========================================================

# Get Profile
@app.get('/get/profile')
@auth_required("token")
@cache.cached(timeout=30)
def profile():
    if current_user.is_anonymous:
        return jsonify({"error_message": "Please Login to view profile"}), 401
    
    user = User.query.get(current_user.id)

    if not user:
        return jsonify({"error_message": "User Not Found"}), 404
    
    return jsonify({
        "email": user.email, 
        "username": user.username
    }), 200


# Update profile
@app.put('/update/profile')
@auth_required("token")
def update_profile():
    if current_user.is_anonymous:
        return jsonify({"error_message": "Please Login to update profile"}), 401
    
    user = User.query.get(current_user.id)

    if not user:
        return jsonify({"error_message": "User Not Found"}), 404
    
    data = request.get_json()
    user.email = data.get("email")
    user.username = data.get("username")
    if data.get("password") and data.get("checkPassword") and data.get("password") == data.get("checkPassword") and data.get("password") != "null" and data.get("password") != "":
        if check_password_hash(user.password, data.get("oldPassword")):
            user.password = generate_password_hash(data.get("password"))
        else:
            return jsonify({"error_message": "Wrong Old Password"}), 401
    db.session.commit()

    return jsonify({"message": "Profile Updated Successfully"}), 200


# ========================================== Admin Permissions and Requests =======================================================

# =========================== Permissions =====================================

# Get All Managers

user_fields = {
    "id": fields.Integer,
    "email": fields.String,
    "username": fields.String,
    "active": fields.Boolean,
}


@app.get('/managers')
@auth_required("token")
@roles_required("admin")
def all_managers():
    users = User.query.all()
    if len(users) == 0:
        return jsonify({"message": "No User Found"}), 404
    
    managers_list = []
    for user in users:
        if user.roles[0].name == "manager":
            managers_list.append(user)

    return marshal(managers_list, user_fields), 200


# Activate Manager
@app.get('/activate_revoke/manager/<int:mg_id>')
@auth_required("token")
@roles_required("admin")
def activate_revoke_manager(mg_id):
    manager = User.query.get(mg_id)
    if not manager or "manager" not in manager.roles:
        return jsonify({"message":"Manager not found"}), 404
    
    if manager.active:
        manager.active=False
        db.session.commit()
        return jsonify({"message":"Manager permission changed"}), 200
    else:
        manager.active=True
        db.session.commit()
        return jsonify({"message":"Manager permission changed"}), 200



# ========================================== Requests ==========================================


# Creating a Product Delete Request
@app.route('/product/request/<int:product_id>', methods=["GET","POST"])
@auth_required("token")
@roles_required("manager")
def create_product_request(product_id):
    request_type = 'Delete'
    r_product_id = product_id

    products = db.session.query(Product_Request.r_product_id).all()
    product_ids = [c for (c,) in products]

    if product_id in product_ids:
        return jsonify({"error_message": "Request already exists"}), 409
    
    request = Product_Request(request_type=request_type, r_product_id=r_product_id)
    db.session.add(request)
    db.session.commit()
    return jsonify({"message": "Request Successfully created"}), 201



# Creating a Category Request
@app.route('/category/request', methods=["GET","POST"])
@auth_required("token")
@roles_required("manager")
def create_category_request():
    data = request.get_json()
    request_type = data.get("request_type")
    r_category_id = data.get("cat_id")
    description = data.get("description")


    category_requests = Category_Request.query.all()
    for category in category_requests:
        if category.r_category_id == r_category_id and category.request_type == request_type and category.description == description:
            return jsonify({"error_message": "Request already exists"}), 409
    
    category_request = Category_Request(request_type=request_type, r_category_id=r_category_id, description=description)
    db.session.add(category_request)
    db.session.commit()
    return jsonify({"message": "Request Successfully created"}), 201
        


# Get All Category Requests

cat_req_fields = {
    "request_id": fields.Integer,
    "request_type": fields.String,
    "r_category_id": fields.Integer,
    "description": fields.String,
}

@app.get('/admin/category/requests')
@auth_required("token")
@roles_required("admin")
@cache.cached(timeout=30)
def all_category_requests():
    category_requests = Category_Request.query.all()
    if len(category_requests) == 0:
        return jsonify({"error_message": "No Category Requests Found"}), 404
    
    return marshal(category_requests, cat_req_fields), 200


# Approve Reject Category Request
@app.route('/admin/category/request/<int:req_id>', methods=["GET","POST"])
@auth_required("token")
@roles_required("admin")
def approve_reject_category(req_id):
    category_request = Category_Request.query.get(req_id)

    if not category_request:
        return jsonify({"error_message": "Request Not Found"}), 404
    
    db.session.delete(category_request)
    db.session.commit()
    return jsonify({"message": "Request Successfully Deleted"}), 200




# Get All Product Requests

prod_req_fields = {
    "request_id": fields.Integer,
    "request_type": fields.String,
    "r_product_id": fields.Integer,
}

@app.get('/admin/product/requests')
@auth_required("token")
@roles_required("admin")
@cache.cached(timeout=30)
def all_product_requests():
    product_requests = Product_Request.query.all()
    if len(product_requests) == 0:
        return jsonify({"message": "No Product Requests Found"}), 404
    
    return marshal(product_requests, prod_req_fields), 200


# Approve Reject Product Request
@app.route('/admin/product/request/<int:req_id>', methods=["GET","POST"])
@auth_required("token")
@roles_required("admin")
def approve_reject_product(req_id):
    product_request = Product_Request.query.get(req_id)

    if not product_request:
        return jsonify({"error_message": "Request Not Found"}), 404
    
    db.session.delete(product_request)
    db.session.commit()
    return jsonify({"message": "Request Successfully Deleted"}), 200


#================================================= Download CSV ===============================================

# Create Download CSV Celery Task
@app.get('/admin/products_download_csv')
def product_download_csv():
    task = download_products_csv.delay()
    return jsonify({"task_id": task.id})


# Download CSV
@app.get('/admin/products_download_csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"error_message": "Task Pending"}), 404
    

#=========================================================== Customer Dashboard ======================================================

#================================================= Orders ===============================================

# Place Order
@app.get("/place_order")
@auth_required("token")
@roles_required("user")
def place_order():

    if current_user.is_anonymous:
        return jsonify({"error_message": "Please Login to place order"}), 401
    cm_id = current_user.id
    items = Cart.query.filter_by(c_user_id=cm_id).all()


    # Assigning order number
    orders = Order.query.all()
    if len(orders)==0:
        ord_no = 1
    else:
        ord_no=0
        for order in orders:
            if int(order.order_id) > ord_no:
                ord_no=int(order.order_id)
        ord_no+=1


    for item in items:
        p1 = Product.query.get(item.c_product_id)
        c1 = Category.query.get(item.c_category_id)
        stock = p1.stock
        stock -= item.c_quantity
        if stock<0:
            return jsonify({
                "error_message": "You are requesting for more quantity than that present in stock",
                "category": c1.category_name,
                "product": p1.product_name,
                "quantity": item.c_quantity,
            }), 409
        else:
            p1.sold += item.c_quantity
            p1.stock = stock
            order = Order(o_user_id=item.c_user_id, o_category_id = item.c_category_id, o_product_id = item.c_product_id, o_quantity=item.c_quantity, o_price=item.c_price, o_totalprice=item.c_totalprice, o_orderno=ord_no, o_date=date.today())
            db.session.add(order)
            db.session.commit()

    for item in items:
        db.session.delete(item)
        db.session.commit()

    return jsonify({
        "message": "Order Placed Successfully",
        "ord_no": ord_no
    }), 201
    
    
# Get Recent Orders
@app.get("/order_placed/<int:ord_no>")
@auth_required("token")
@roles_required("user")
def recent_order(ord_no):
    orders = Order.query.filter_by(o_orderno=ord_no).all()
    order_placed = []

    if orders:
        for order in orders:
            order_placed.append({
                    "order_id": order.order_id,
                    "o_category_id": order.o_category_id,
                    "o_product_id": order.o_product_id,
                    "o_quantity": order.o_quantity,
                    "o_price": order.o_price,
                    "o_totalprice": order.o_totalprice,
                    "o_orderno": order.o_orderno
            })
    
        return jsonify(order_placed), 200
    else:
        return jsonify({"error_message": "No Orders Found"}), 404


    

#============================================== Running the App ===========================================================================

if __name__== '__main__':
    app.run(debug=True)