# Ez Stores Grocery App

The project’s focus is on building the backend of a grocery store application using lightweight python framework like Flask, Flask_restful, Flask_sqlalchemy, Flask_security and HTML, CSS, Bootstrap, JS (VueJS) for rendering the front-end. The project has admin level access to perform CRUD on categories, manager level access to perform CRUD on products and user level access to purchase categories/products.
## Author

- Siddhardh Devulapalli (21f2000579)
- 21f2000579@ds.study.iitm.ac.in
- Tech-enthusiast with great inclination towards Software Development & AI and its applications in the near future.
## Tech Stack

**Front-end:** HTML, CSS, Bootstrap, JS, VueJS

**Back-end:** Python-Flask, Flask SQL Alchemy, Flask-Restful, Flask-security, Celery, Flask_cache, Redis


## Features
Core:
- User/ Manager Login
- SignUp for Manager and User (Manager signup needs to be approved by admin)
-	Category, Product and Cart (CRUD) for Admin, Manager, User.
-	Search for Product/Category for User. 
-	Displays all the categories/products, buy multiple products from multiple categories for multiple users and show their cart value to be paid.
-	Shows out of stock categories/products.
-	Daily reminders to be sent to users (who have not logged/bought anything on that day). 
-	Monthly active report to users. Summary of products bought in a month.
-	Download Products CSV.
-	Added Caching wherever possible to improve performance and reduce website latency. 
Additional features:
-	Form validation both in VueJS and at backend in flask routes before inserting into database.
-	Images for Categories and Products. Styling and Aesthetics for all the pages.



## Configuration

Download EZ stores project. Extract the files in the folder and change current directory to the following directory.

```wsl
    cd 21f2000579/Code
```
Create a virtual environment, Activate it and run the following code.

```wsl
    pip install -r requirements.txt
```
## Deployment

To deploy this project run

```wsl
  redis-server
```

```powershell
  python app.py
```

```wsl
  ~/go/bin/MailHog
```

```powershell
  celery -A app:celery_app worker --loglevel=INFO --pool=solo
```

```powershell
  celery -A app:celery_app beat --loglevel=INFO
```