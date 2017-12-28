#----------------------------------------------------------------------------#
# Imports
#----------------------------------------------------------------------------#

from flask import Flask, render_template, request
# from flask.ext.sqlalchemy import SQLAlchemy
import logging
from logging import Formatter, FileHandler
from forms import *
import os
from watson_developer_cloud import ToneAnalyzerV3 
import simplejson as json

import pandas as pd
import numpy as np
import json

#----------------------------------------------------------------------------#
# App Config.
#----------------------------------------------------------------------------#

app = Flask(__name__)
app.config.from_object('config')
#db = SQLAlchemy(app)

tone_analyzer = ToneAnalyzerV3(
  version="2016-05-19",
  username="c7114536-4e49-4f3a-a73e-de831daa06ca",
  password="FEXSWcSZa7G3"
)

# Automatically tear down SQLAlchemy.
'''
@app.teardown_request
def shutdown_session(exception=None):
    db_session.remove()
'''

# Login required decorator.
'''
def login_required(test):
    @wraps(test)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return test(*args, **kwargs)
        else:
            flash('You need to login first.')
            return redirect(url_for('login'))
    return wrap
'''
#----------------------------------------------------------------------------#
# Controllers.
#----------------------------------------------------------------------------#


@app.route('/')
def home():
    return render_template('pages/placeholder.home.html')


@app.route('/about')
def about():
    return render_template('pages/placeholder.about.html')


@app.route('/login')
def login():
    form = LoginForm(request.form)
    return render_template('forms/login.html', form=form)


@app.route('/register')
def register():
    form = RegisterForm(request.form)
    return render_template('forms/register.html', form=form)


@app.route('/forgot')
def forgot():
    form = ForgotForm(request.form)
    return render_template('forms/forgot.html', form=form)

@app.route('/api', methods=["POST", "GET"])
def google_api():
    # tone_json = "Team, I know that times are tough! Product sales have been disappointing for the past three quarters."
    
    tone_json = request.form.to_dict()["text"];
    print(tone_json)

    tone = tone_analyzer.tone(tone_json, tones='emotion', content_type='text/plain')
    # # print(tone)
    # return json.dumps("")
    return json.dumps(tone)

@app.route('/predict', methods=["GET", "POST"])
def predict():
    import pandas as pd

    output_df = pd.read_csv("output_df.csv")
    output_df = output_df.set_index('userId')

    score_y_df = pd.read_json("score_y_df.json")
    user_df = pd.read_json("user_df.json")

    # test_user = 2140322954
    user_id = int(request.form.to_dict()["user_id"]);
    print(type(user_id))

    cluster = score_y_df[score_y_df['otherUserId']==user_id]['y'].iloc[0]
    reference_user = score_y_df[score_y_df['otherUserId']==user_id]['userId'].iloc[0]

    # print reference_user

    final_df = output_df[output_df['y']==cluster]
    index_list = final_df.sample(n=3).index.tolist()

    print (index_list)

    data = []
    for i in index_list:
        temp = user_df[user_df['userId'] == i][['userId', 'ageCurrent', 'education', 'income']]
        data.append(temp.to_json(orient = "records"))
        # print data

    return json.dumps(data)

# Error handlers.


@app.errorhandler(500)
def internal_error(error):
    #db_session.rollback()
    return render_template('errors/500.html'), 500


@app.errorhandler(404)
def not_found_error(error):
    return render_template('errors/404.html'), 404

if not app.debug:
    file_handler = FileHandler('error.log')
    file_handler.setFormatter(
        Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]')
    )
    app.logger.setLevel(logging.INFO)
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.info('errors')

#----------------------------------------------------------------------------#
# Launch.
#----------------------------------------------------------------------------#

# Default port:
if __name__ == '__main__':
    app.run()

# Or specify port manually:
'''
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
'''
