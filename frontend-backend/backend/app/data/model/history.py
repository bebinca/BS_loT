from flask import Blueprint, jsonify
from flask import request
from flask import flash
from flask import url_for
from flask import redirect
from flask import session
from werkzeug.wrappers import Request
from app.data.database.db import get_db
from geojson import Feature, Point, FeatureCollection, LineString
import json
import time

bp = Blueprint("history", __name__,url_prefix='')

@bp.route('/add_history', methods=["POST"])
def add_history():
    db = get_db()
    jsonData = request.get_json()
    device_id = jsonData['id']
    alert = jsonData['alert']
    info = jsonData['info']
    lat = jsonData['lat']
    lng = jsonData['lng']
    timesta = jsonData['timestamp']
    val = jsonData['value']
    db.execute(
        "INSERT INTO device_history (device_id, alert, info, lat, lng, timesta, val) VALUES (?,?,?,?,?,?,?)",
        (device_id, alert, info, lat, lng, timesta, val)
    )
    db.commit()
    return jsonify(jsonData), 201

@bp.route('/get_history', methods=["POST"])
def get_history():
    db = get_db()
    jsonData =request.get_json()
    device_id = jsonData['id']
    cur = db.execute(
        "select * from device_history where device_id = ? order by timesta desc limit 20", (device_id, )
    )
    my_query = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
    res = jsonify(my_query)
    return res

@bp.route('/get_history_geo', methods=["POST"])
def get_history_geo():
    db = get_db()
    jsonData =request.get_json()
    device_id = jsonData['id']
    cur = db.execute(
        "select * from device_history where device_id = ? order by timesta desc limit 7", (device_id, )
    )
    my_query = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
    features = []
    points = []
    features_point = []
    for i in range(len(my_query)):
        lat = my_query[i]['lat']
        lng = my_query[i]['lng']
        alert = my_query[i]['alert']
        info = my_query[i]['info']
        timesta = my_query[i]['timesta']
        val = my_query[i]['val']
        points.append((lng, lat))
        my_point = Point((lng, lat))
        point_prop = {
            "alert": alert,
            "timesta": timesta,
            "info":info,
            "val": val,
        }
        point_feature = Feature(geometry = my_point, properties=point_prop)
        features_point.append(point_feature)
    my_line = LineString(points)
    my_prop = {
        "device_id": device_id
    }
    my_feature = Feature(geometry = my_line, properties=my_prop)
    features.append(my_feature)
    res1 = FeatureCollection(features)
    res2 = FeatureCollection(features_point)
    return jsonify([res1, res2])

# CREATE TABLE device_history (
#     id INTEGER PRIMARY KEY AUTOINCREMENT,
#     device_id INTEGER NOT NULL,
#     alert INTEGER NOT NULL,
#     info TEXT NOT NULL,
#     lat double NOT NULL,
#     lng double NOT NULL,
#     timesta bigint NOT NULL,
#     val INTEGER NOT NULL
# );
