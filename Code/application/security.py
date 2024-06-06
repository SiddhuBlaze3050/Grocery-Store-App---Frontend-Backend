from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin, login_required
from application.models import db, User, Role

user_datastore = SQLAlchemyUserDatastore(db, User, Role)
sec = Security()