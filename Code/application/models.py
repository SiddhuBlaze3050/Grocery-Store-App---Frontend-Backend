from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin , RoleMixin
import uuid


db = SQLAlchemy()

#=============================================== Products and Categories =======================================================

class Category(db.Model):
    __tablename__ = 'category'
    category_id = db.Column(db.Integer(), primary_key = True, autoincrement=True)
    category_name = db.Column(db.String(), unique = True, nullable = False)
    Products = db.relationship("Product", back_populates = "Categories")


class Product(db.Model):
    __tablename__ = 'product'
    product_id = db.Column(db.Integer(), primary_key = True, autoincrement=True)
    product_name = db.Column(db.String(), unique = True, nullable = False)
    unit = db.Column(db.String(), nullable = False)
    price = db.Column(db.Integer(), nullable = False)
    stock = db.Column(db.Integer(), nullable = False)
    sold = db.Column(db.Integer(), nullable = False, default = 0)
    ecategory_id = db.Column(db.Integer(), db.ForeignKey("category.category_id"), nullable = False)
    Categories = db.relationship("Category", back_populates = "Products")
    

#================================================= Requests =================================================================


class Category_Request(db.Model):
    __tablename__ = 'category_request'
    request_id = db.Column(db.Integer(), primary_key = True, autoincrement=True)
    request_type = db.Column(db.String(), nullable = False)    #request_type = CRUD
    r_category_id = db.Column(db.Integer(), db.ForeignKey("category.category_id"), nullable = False)
    description = db.Column(db.String(), nullable = False)


class Product_Request(db.Model):
    __tablename__ = 'product_request'
    request_id = db.Column(db.Integer(), primary_key = True, autoincrement=True)
    request_type = db.Column(db.String(), nullable = False)    #request_type = CRUD
    r_product_id = db.Column(db.Integer(), db.ForeignKey("product.product_id"), nullable = False)


#=============================================== Manager and Customers =======================================================

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer(), db.ForeignKey('role.id'))

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
    permissions = db.Column(db.UnicodeText)

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    last_login = db.Column(db.Date(), nullable=True)
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True , nullable=False)
    roles = db.relationship('Role', secondary='roles_users', backref=db.backref('user', lazy='dynamic'))

    def __init__(self, email, password,username,active,roles):
        self.username=username
        self.email=email
        self.active=active
        self.roles=roles
        self.password = password
        self.fs_uniquifier = generate_random_uniquifier()

def generate_random_uniquifier():
    # Generate a unique value using UUID
    uniquifier = str(uuid.uuid4())
    return uniquifier


#=============================================== Cart and Orders =============================================================

class Cart(db.Model):
    __tablename__ = 'cart'
    cart_id = db.Column(db.Integer(), primary_key = True, autoincrement=True)
    c_user_id = db.Column(db.Integer(), db.ForeignKey("user.id"), nullable = False)
    c_category_id = db.Column(db.Integer(), db.ForeignKey("category.category_id"), nullable = False)
    c_product_id = db.Column(db.Integer(), db.ForeignKey("product.product_id"), nullable = False)
    c_quantity = db.Column(db.Integer(), nullable = False)
    c_price = db.Column(db.Integer(), db.ForeignKey("product.price"), nullable = False)
    c_totalprice = db.Column(db.Integer(), nullable = False)



class Order(db.Model):
    __tablename__ = 'order'
    order_id = db.Column(db.Integer(), primary_key = True, autoincrement=True)
    o_user_id = db.Column(db.Integer(), db.ForeignKey("user.id"), nullable = False)
    o_category_id = db.Column(db.Integer(), db.ForeignKey("category.category_id"), nullable = False)
    o_product_id = db.Column(db.Integer(), db.ForeignKey("product.product_id"), nullable = False)
    o_quantity = db.Column(db.Integer(), nullable = False)
    o_price = db.Column(db.Integer(), db.ForeignKey("product.price"), nullable = False)
    o_totalprice = db.Column(db.Integer(), nullable = False)
    o_orderno = db.Column(db.Integer(), nullable = False)
    o_date = db.Column(db.Date(), nullable = False)