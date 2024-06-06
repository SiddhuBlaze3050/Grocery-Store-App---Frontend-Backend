from celery import Celery, Task

def celery_init_app(app):
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name)
    celery_app.config_from_object('celeryconfig')
    celery_app.Task = FlaskTask
    return celery_app



# from celery import Celery, Task

# def celery_init_app(app):
#     class FlaskTask(Task):
#         def __call__(self, *args: object, **kwargs: object) -> object:
#             with app.app_context():
#                 return self.run(*args, **kwargs)

#     celery_app = Celery(app.name, task_cls=FlaskTask)
#     celery_app.config_from_object('celeryconfig')
#     return celery_app



# from celery import Celery, Task
# # from flask import current_app as app

# class FlaskTask(Task):
#     def __call__(self, *args, **kwargs):
#         with app.app_context():
#             return self.run(*args, **kwargs)

# def celery_init_app(app):
#     celery = Celery(app.import_name, task_cls=FlaskTask)
#     celery.config_from_object('celeryconfig')
#     return celery
