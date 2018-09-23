#! /usr/bin/env python3
"""
A (very simple) Flask backend for the demo
"""
import argparse
import json
import logging
import os
import sys

from flask import Flask, Response, jsonify, request, send_file, send_from_directory
from flask_cors import CORS
from gevent.pywsgi import WSGIServer

logger = logging.getLogger(__name__)



def main(_):
    logger.info('Starting a server on port %i.', FLAGS.port)
    app = make_app()
    CORS(app)
    http_server = WSGIServer(('localhost', FLAGS.port), app)
    logger.info('Server running')
    http_server.serve_forever()


def make_app() -> Flask:

    app = Flask(__name__)

    logger.info('Input file: %s', FLAGS.input)
    f = open(FLAGS.input, 'r')

    @app.route('/')
    def index() -> Response:
        return send_file(os.path.join(FLAGS.build_dir, 'index.html'))

    @app.route('/next', methods=['POST'])
    def next() -> Response:
        line = f.readline()
        if line == "":
            logger.warning('All lines read. Restarting.')
            f.seek(0)
            line = f.readline()
        response = json.loads(line)
        return jsonify(response)

    # As an SPA, we need to return index.html for /model-name and /model-name/permalink.
    # Not sure what this means ... looks like a stupid hack to me.
    @app.route('/entity')
    @app.route('/coref')
    @app.route('/story')
    def return_page() -> Response:
        return send_from_directory(build_dir, 'index.html')

    return app


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('input', type=str,
                        help='The JSONL data file to visualize')
    parser.add_argument('--build_dir', type=str, default='demo/build/',
                        help='App front-end build folder')
    parser.add_argument('--port', '-p', type=int, default=8000)
    parser.add_argument('--debug', action='store_true')
    FLAGS, _ = parser.parse_known_args()

    if FLAGS.debug:
        LEVEL = logging.DEBUG
    else:
        LEVEL = logging.INFO
    logging.basicConfig(level=LEVEL)

    main(_)

