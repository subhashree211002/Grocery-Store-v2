from flask import Flask
from flask_security import SQLAlchemyUserDatastore, Security
from application.models import db, User, Role
from config import DevelopmentConfig
from application.resources import api
from application.sec import datastore
from application.worker import celery_init_app
import flask_excel as excel
from celery.schedules import crontab
from application.tasks import daily_reminder


def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    excel.init_excel(app)
    app.security = Security(app, datastore)
    with app.app_context():
        import application.views

    return app


app = create_app()
celery_app = celery_init_app(app)


@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=2, minute=32, day_of_month=17),
        daily_reminder.s('narendra@email.com', 'Daily Test'),
    )

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081, debug=True)
