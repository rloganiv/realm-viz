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
from sqlitedict import SqliteDict

logger = logging.getLogger(__name__)



def main(_):
    logger.info('Starting a server on port %i.', FLAGS.port)
    app = make_app()
    CORS(app)
    http_server = WSGIServer((FLAGS.ip, FLAGS.port), app)
    logger.info('Server running')
    http_server.serve_forever()


def make_app() -> Flask:

    app = Flask(__name__)

    logger.info('Input file: %s', FLAGS.input)
    f = open(FLAGS.input, 'r')

    # logger.info('Alias db: %s', FLAGS.alias)
    # alias_db = SqliteDict(FLAGS.alias, flag='r')
    alias_db = {}

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

    @app.route('/getName', methods=['POST'])
    def get_name() -> Response:
        data = request.json
        if data is None:
            return
        out = data.copy()
        for key, value in data:
            ### STUPID HACK ###
            if isinstance(value, list):
                value = value[0]
            ### END ###
            try:
                if value in alias_db:
                    out[key] = alias_db[value]
            except:
                pass
        return jsonify(out)

    # As an SPA, we need to return index.html for /model-name and /model-name/permalink.
    # Not sure what this means ... looks like a stupid hack to me.
    @app.route('/entity')
    @app.route('/coref')
    @app.route('/story')
    def return_page() -> Response:
        return send_from_directory(FLAGS.build_dir, 'index.html')

    return app


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('input', type=str,
                        help='The JSONL data file to visualize')
    parser.add_argument('--build_dir', type=str, default='demo/build/',
                        help='App front-end build folder')
    parser.add_argument('--ip', type=str, default='0.0.0.0')
    parser.add_argument('--port', '-p', type=int, default=8000)
    parser.add_argument('--debug', action='store_true')
    FLAGS, _ = parser.parse_known_args()

    if FLAGS.debug:
        LEVEL = logging.DEBUG
    else:
        LEVEL = logging.INFO
    logging.basicConfig(level=LEVEL)

    main(_)

