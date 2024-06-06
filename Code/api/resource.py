from flask_restful import Api, Resource, reqparse, abort, fields, marshal
from flask import jsonify
from application.models import *
from api.validation import *
from flask_security import auth_required, current_user, roles_required, roles_accepted
from application.cache import cache

api = Api(prefix="/api")

#================================================ API Parsing Arguments ====================================================

# Update/PUT Parsers
update_category_parser = reqparse.RequestParser()
update_category_parser.add_argument("category_name")


update_product_parser = reqparse.RequestParser()
update_product_parser.add_argument("product_name")
update_product_parser.add_argument("unit")
update_product_parser.add_argument("price_unit")
update_product_parser.add_argument("quantity")
update_product_parser.add_argument("ecategory_id")

update_cart_parser = reqparse.RequestParser()
update_cart_parser.add_argument("cart_id")
update_cart_parser.add_argument("c_category_id")
update_cart_parser.add_argument("c_product_id")
update_cart_parser.add_argument("c_quantity")
update_cart_parser.add_argument("c_price")
update_cart_parser.add_argument("c_totalprice")


# Create/POST Parsers

create_category_parser = reqparse.RequestParser()
create_category_parser.add_argument("category_name")
create_category_parser.add_argument("is_approved")


create_product_parser = reqparse.RequestParser()
create_product_parser.add_argument("product_name")
create_product_parser.add_argument("unit")
create_product_parser.add_argument("price_unit")
create_product_parser.add_argument("quantity")
create_product_parser.add_argument("is_approved")


create_cart_parser = reqparse.RequestParser()
create_cart_parser.add_argument("c_category_id")
create_cart_parser.add_argument("c_product_id")
create_cart_parser.add_argument("c_quantity")
create_cart_parser.add_argument("c_price")
create_cart_parser.add_argument("c_totalprice")


#=================================================== API Classes ===========================================================

#======================================= Categories CRUD ==============================================

class Api_categories(Resource):

    # Create Category details
    @auth_required('token')
    @roles_required('admin')
    def post(self):
        cat_info = create_category_parser.parse_args()
        category_name = cat_info.get("category_name", None)

        category = db.session.query(Category.category_name).all()
        categories = [c.lower() for (c,) in category]
        
        if category_name is None or not category_name:
            return {
                        "error_code": "CATEGORY001",
                        "error_message": "Category Name is required"
                    }, 400
        
        if category_name.lower() in categories:
            return {
                "error_code": "CATEGORY002",
                "error_message": "Category already exists"
            }, 409
    
        new_category = Category(category_name=category_name)
        db.session.add(new_category)
        db.session.commit()

        return {
                "category_id": new_category.category_id,
                "category_name": new_category.category_name
        }, 201
    


    # Get Category details
    @auth_required('token')
    @cache.cached(timeout=10)
    def get(self):
        all_categories = []
        c1 = Category.query.all()
        
        if c1:
            for category in c1:
                all_categories.append(
                    {
                        "category_id": category.category_id,
                        "category_name": category.category_name
                    }
                )
            return all_categories
        else:
            raise NotFoundError(status_code=404)
    

    # Update Category details
    @auth_required('token')
    @roles_required('admin')
    def put(self,category_id):
        cat_info = update_category_parser.parse_args()
        category_name = cat_info.get("category_name", None)

        cat_update = Category.query.get(category_id)
        all_categories = Category.query.all()

        category = db.session.query(Category.category_name).all()
        categories = [c.lower() for (c,) in category]

        if cat_update not in all_categories:
            raise NotFoundError(status_code=404)
        
        if category_name is None or not category_name:
            return {
                        "error_code": "CATEGORY001",
                        "error_message": "Category Name is required"
                    }, 400

        if category_name.lower() in categories:
            return {
                "error_code": "CATEGORY002",
                "error_message": "Category already exists"
            }, 409

        cat_update.category_name = category_name
        db.session.commit()

        return {
                "category_id": cat_update.category_id,
                "category_name": cat_update.category_name
        }, 201
    

    # Delete category details
    @auth_required('token')
    @roles_required('admin')
    def delete(self, category_id):
        category =  Category.query.get(category_id)

        if category is None:
            return {
                "error_message": "Category not found"
            }, 404
        
        products = category.Products
        for product in products:
            db.session.delete(product)
        db.session.commit()        

        db.session.delete(category)
        db.session.commit()
        return {
                "message": "Category deleted successfully"
        }, 202

    
#======================================= Products CRUD ==================================================

class Api_products(Resource):

    # Create Product details
    @auth_required('token')
    @roles_required('manager')
    def post(self,category_id):
        prod_info = create_product_parser.parse_args()
        product_name = prod_info.get("product_name", None)
        unit = prod_info.get("unit", None)
        price = prod_info.get("price_unit", None)
        stock = prod_info.get("quantity", None)
        ecategory_id = category_id

        product = db.session.query(Product.product_name).all()
        products = [c.lower() for (c,) in product]
        
        if product_name is None or not product_name:
            return {
                        "error_code": "PRODUCT001",
                        "error_message": "Product Name is required"
                    }, 400

        if unit is None or not unit:
            return {
                        "error_code": "PRODUCT002",
                        "error_message": "Units are required"
                    }, 400
        
        if price is None or not price:
            return {
                        "error_code": "PRODUCT003",
                        "error_message": "Price is required"
                    }, 400 
        
        if stock is None or not stock:
            return {
                        "error_code": "PRODUCT004",
                        "error_message": "Quantity is required"
                    }, 400
        
        if product_name.lower() in products:
            return {
                "error_code": "PRODUCT005",
                "error_message": "Product already exists"
            }, 409


        new_product = Product(product_name=product_name, price = int(price),unit=unit, stock=int(stock), ecategory_id=ecategory_id)
        db.session.add(new_product)
        db.session.commit()

        return {
                "product_id": new_product.product_id,
                "product_name": new_product.product_name,
                "unit": new_product.unit,
                "price": new_product.price,
                "stock": new_product.stock,
                "ecategory_id": new_product.ecategory_id
        }, 201
    

    # Get Product Details
    @auth_required('token')
    @cache.cached(timeout=20)
    def get(self):
        all_products = []
        p1 = Product.query.all()

        if p1:
            for product in p1:
                all_products.append(
                    {
                        "product_id": product.product_id,
                        "product_name": product.product_name,
                        "unit": product.unit,
                        "price_unit": product.price,
                        "quantity": product.stock,
                        "ecategory_id": product.ecategory_id
                    }
                )
            
            return all_products
        
        else:
            raise NotFoundError(status_code=404)

        
    # Update Product details
    @auth_required('token')
    @roles_required('manager')
    def put(self,product_id):
        prod_info = update_product_parser.parse_args()
        product_name = prod_info.get("product_name", None)
        unit = prod_info.get("unit", None)
        price = prod_info.get("price_unit", None)
        stock = prod_info.get("quantity", None)
        ecategory_id = prod_info.get("ecategory_id", None)

        prod_update = Product.query.get(product_id)
        all_products = Product.query.all()

        product = db.session.query(Product.product_name).all()
        products = [c.lower() for (c,) in product]
        prod_obj = Product.query.filter_by(product_name=product_name).first()
        

        if prod_update not in all_products:
            return {
                "error_code": "PRODUCT006",
                "error_message": "Product not found"
            }, 404
        
        if product_name is None or not product_name:
            return {
                        "error_code": "PRODUCT001",
                        "error_message": "Product Name is required"
                    }, 400

        if unit is None or not unit:
            return {
                        "error_code": "PRODUCT002",
                        "error_message": "Units are required"
                    }, 400
        
        if price is None or not price:
            return {
                        "error_code": "PRODUCT003",
                        "error_message": "Price is required"
                    }, 400 
        
        if stock is None or not stock:
            return {
                        "error_code": "PRODUCT004",
                        "error_message": "Quantity is required"
                    }, 400
        
        if product_name.lower() in products and prod_obj.product_id != product_id:
            return {
                "error_code": "PRODUCT005",
                "error_message": "Product already exists"
            }, 409

        prod_update.product_name = product_name
        prod_update.unit = unit
        prod_update.price = int(price)
        prod_update.stock = int(stock)
        prod_update.ecategory_id = ecategory_id
        db.session.commit()

        return {
                "product_id": prod_update.product_id,
                "product_name": prod_update.product_name,
                "unit": prod_update.unit,
                "price_unit": prod_update.price,
                "quantity": prod_update.stock,
                "ecategory_id": prod_update.ecategory_id
        }, 201
    

    # Delete product details
    @auth_required('token')
    @roles_required('admin')
    def delete(self, product_id):
        product =  Product.query.get(product_id)

        if product is None:
            return {
                "error_message": "Product not found"
            }, 404
        
        
        db.session.delete(product)
        db.session.commit()
        return "", 202

#============================================== Cart ==================================================

cart_resource_fields={
    "cart_id":fields.Integer,
    "c_user_id":fields.Integer,
    "c_category_id":fields.Integer,
    "c_product_id":fields.Integer,
    "c_quantity":fields.Integer,
    "c_price":fields.Integer,
    "c_totalprice":fields.Integer,
}

class Api_cart(Resource):

    @auth_required('token')
    @roles_required('user')
    def get(self):
        all_cart = []
        cart_items = Cart.query.all()

        if cart_items:
            for cart_item in cart_items:
                all_cart.append(
                    {
                        "cart_id": cart_item.cart_id,
                        "c_user_id": cart_item.c_user_id,
                        "c_category_id": cart_item.c_category_id,
                        "c_product_id": cart_item.c_product_id,
                        "c_quantity": cart_item.c_quantity,
                        "c_price": cart_item.c_price,
                        "c_totalprice": cart_item.c_totalprice,
                    }
                )

            return all_cart, 200
        
        else:
            raise NotFoundError(status_code=404)


    @auth_required('token')
    @roles_required('user')
    def post(self):
        data = create_cart_parser.parse_args()
        category_id = int(data.get("c_category_id"))
        product_id = int(data.get("c_product_id"))
        price = int(data.get("c_price"))
        quantity = int(data.get("c_quantity"))
        totalprice = int(data.get("c_totalprice"))

        if current_user.is_anonymous:
            return {
                "error_message": "Please Login to add products to cart"
            }, 401
        cm_id = current_user.id

        product = Product.query.get(product_id)
        if product.stock < quantity:
            return {
                "error_message": "You are requesting for more quantity than that present in stock"
            }, 409

        # Create and add the object to db
        cart = Cart(c_user_id=cm_id, c_category_id=category_id, c_product_id=product_id, c_price = price, c_quantity=quantity, c_totalprice=totalprice)
        db.session.add(cart)
        db.session.commit()
        return {
            "message": "Product added to cart"
        }, 201



    @auth_required('token')
    @roles_required('user')
    def put(self):
        cart_info = update_cart_parser.parse_args()
        cart_id = int(cart_info.get("cart_id"))
        product_id = int(cart_info.get("c_product_id"))
        quantity = int(cart_info.get("c_quantity"))
        totalprice = int(cart_info.get("c_totalprice"))

        cart_update = Cart.query.get(cart_id)

        if cart_update is None:
            return {
                "error_message": "Cart Item not found"
            }, 404

        product = Product.query.get(product_id)
        if product.stock < quantity:
            return {
                "error_message": "You are requesting for more quantity than that present in stock"
            }, 409

        # Update the object to db
        cart_update.c_quantity = quantity
        cart_update.c_totalprice = totalprice
        db.session.commit()
        return {
            "message": "Product updated in the cart"
        }, 201


    @auth_required('token')
    @roles_required('user')
    def delete(self, cart_id):
        cart_item =  Cart.query.get(cart_id)

        if cart_item is None:
            return {
                "error_message": "Cart Item not found"
            }, 404
        
        db.session.delete(cart_item)
        db.session.commit()
        return "", 202
        

#================================================= API Endpoints ===========================================================

api.add_resource(Api_categories, "/category", "/category/<int:category_id>")
api.add_resource(Api_products, "/product", "/category/<int:category_id>/product", "/product/<int:product_id>")
api.add_resource(Api_cart, "/cart", "/cart/<int:cart_id>")