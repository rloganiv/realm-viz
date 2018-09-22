#! /usr/bin/env python3
"""
A (very simple) Flask backend for the demo
"""
import logging
import os
import sys

from flask import Flask, Response, jsonify, request, send_file, send_from_directory
from flask_cors import CORS
from gevent.pywsgi import WSGIServer


DATA_DIR = os.environ.get('REALM_DATA_DIRECTORY') or None
PORT = 8000
DEMO_DIR = os.environ.get('REALM_DEMO_DIRECTORY') or 'demo/'

logger = logging.getLogger(__name__)


def main():
    logger.info('Starting a server on port %i.', PORT)
    app = make_app()
    CORS(app)
    http_server = WSGIServer(('localhost', PORT), app)
    logger.info('Server started')
    http_server.serve_forever()


def make_app(build_dir: str = None) -> Flask:
    if DATA_DIR is None:
        logger.error('no $REALM_DATA_DIRECTORY environment variable, aborting')
        sys.exit(1)

    if build_dir is None:
        build_dir = os.path.join(DEMO_DIR, 'build')

    if not os.path.exists(build_dir):
        logger.error('build directory "%s" does not exist, aborting', build_dir)
        sys.exit(1)

    app = Flask(__name__)

    @app.route('/')
    def index() -> Response:
        return send_file(os.path.join(build_dir, 'index.html'))

    @app.route('/data', methods=['POST'])
    def data() -> Response:
        """Retrieves the specfied line from the specified file as a JSON
        object."""
        request_json = request.get_json()
        try:
            fname = request_json['fname']
            line_number = request_json['line_number']
        except KeyError:
            logger.warning('Bad POST request to endpoint: "data/"')
            response = {}
        else:
            with open(os.path.join(DATA_DIR, fname), 'r') as f:
                for i, line in f:
                    if i == line_number:
                        response = json.loads(line)
                        break
        return jsonify(response)

    @app.route('/list', methods=['POST'])
    def list() -> Response:
        """Returns a list of files."""
        file_list = os.listdir(DATA_DIR)
        return jsonify(file_list)

    # As an SPA, we need to return index.html for /model-name and /model-name/permalink.
    # Not sure what this means ... looks like a stupid hack to me.
    @app.route('/entity')
    @app.route('/coref')
    @app.route('/story')
    def return_page() -> Response:
        return send_from_directory(build_dir, 'index.html')

    return app


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    main()

