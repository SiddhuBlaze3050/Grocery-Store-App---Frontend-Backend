from celery import shared_task
import flask_excel as excel
from application.models import *
import time
from datetime import date, datetime
import calendar
from application.mail_service import *
from jinja2 import Template
from sqlalchemy import extract


@shared_task(ignore_result=False)
def download_products_csv():
    time.sleep(4)
    products = Product.query.with_entities(Product.product_name, Product.price, Product.unit, Product.stock, Product.sold).all()
    products_data = [["Product Name", "Price", "Units", "Stock Remaining", "Quantity Sold"]]
    for product in products:
        products_data.append(list(product))

    csv_output = excel.make_response_from_array(products_data, "csv")
    file_name="admin.csv"
    
    with open(file_name, 'wb') as f:
        f.write(csv_output.data)

    return file_name


@shared_task(ignore_result=True)
def daily_reminder(subject):
    users = User.query.filter(User.roles.any(Role.name == 'user')).all()
    for user in users:
        if not user.last_login or user.last_login < date.today():
            with open('templates/daily_reminder.html', 'r') as f:
                template = Template(f.read())
                send_message(user.email, subject, template.render(name=user.username))

    return "mail sent successfully"


@shared_task(ignore_result=True)
def monthly_report():
    users = User.query.filter(User.roles.any(Role.name == 'user')).all()
    current_month = datetime.now().month
    month_name = calendar.month_name[current_month]
    year_name = datetime.now().year

    for user in users:
        orders = Order.query.filter_by(o_user_id=user.id).filter(extract('month', Order.o_date) == current_month).order_by(Order.o_orderno.desc()).all()
        if orders:
            categories = Category.query.all()
            products = Product.query.all()
            subject =  'Order summary of ' + user.username + ' for ' + datetime.now().strftime("%B") + ' ' + str(datetime.now().year)

            totalvalue=0
            for order in orders:
                totalvalue += order.o_totalprice

            with open('templates/monthly_report.html', 'r') as f:
                template = Template(f.read())
                send_message(user.email, subject, template.render(user=user, products=products, categories=categories, orders=orders, totalvalue=totalvalue, month=month_name, year=year_name))

            return "mail sent successfully"