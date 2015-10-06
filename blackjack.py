from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash, send_from_directory, jsonify

DATABASE = '/tmp/media.db'
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'

app = Flask(__name__, static_url_path='')
app.config.from_object(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
