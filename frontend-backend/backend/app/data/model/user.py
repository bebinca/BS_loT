from json import encoder
from flask import Blueprint, jsonify
from flask import request
from flask import flash
from flask import url_for
from flask import redirect
from flask import abort
from flask import session
from werkzeug.wrappers import Request
from app.data.database.db import get_db
import json
import time
from geojson import Feature, Point, FeatureCollection
from django.http import HttpResponse
from django.conf import settings
settings.configure(DEFAULT_CHARSET='utf-8')

bp = Blueprint("user", __name__,url_prefix='')

@bp.route('/status')
def status():
    error = None
    if session.get('user_id') is None:
        print('None')
        error = "Not log in"
    if error is None:
        print(session['user_id'])
        res = {'id': session['user_id']}
        return json.dumps(res)
    flash(error)
    abort(404)

@bp.route('/register', methods=["POST"])
def register():
    error = None
    db = get_db()
    jsonData = request.get_json()
    username = jsonData['username']
    email = jsonData['email']
    password = jsonData['password']
    if db.execute(
        "select id from user where user_name = ? ", (username, )
    ).fetchone() is not None:
        info = 'User {} is already registered.'.format(username)
        error = {'error': info}
        flash(error)
        return jsonify(error)
    if db.execute(
        "select id from user where email = ?", (email,)
    ).fetchone() is not None:
        info = 'Email {} is already registered.'.format(email)
        error = {'error': info}
        flash(error)
        return jsonify(error)
    if (email.find("@") == -1) :
        info = '`{}` is not in email format.'.format(email)
        error = {'error': info}
        flash(error)
        return jsonify(error)
    if (len(username.encode("utf-8")) < 6):
        info = 'Length of username `{}` is less than 6 bytes.'.format(username)
        error = {'error': info}
        flash(error)
        return jsonify(error)
    if (len(password.encode("utf-8")) < 6):
        info = 'Length of password is less than 6 bytes.'
        error = {'error': info}
        flash(error)
        return jsonify(error)

    else:
        db.execute(
            "insert into user (user_name, email, password) values (?, ?, ?)",
            (username, email, password)
        )
        db.commit()
        info = {'error': None}
        return jsonify(info)

@bp.route('/login', methods=["POST"])
def login():
    session.clear()
    db = get_db()
    jsonData = request.get_json()
    username = jsonData['username']
    password = jsonData['password']
    error = None
    user = db.execute(
        'SELECT * FROM user WHERE user_name = ? or email = ?', (username,username,)
    ).fetchone()
    if user is None:
        error = 'Incorrect username or email. Sign up?'
    elif not user['password'] == password:
        error = 'Incorrect password.'
    if error is None:
        session.clear()
        session['user_id'] = user['id']
        info = {'error': None, 'user_id': user['id'], 'name': user['user_name']}
        return jsonify(info), 201
    flash(error)
    info = {'error': error}
    return jsonify(info)

@bp.route('/getPos')
def getPos():
    error = None
    user = session['user_id']
    if error is not None:
        flash(error)
    else:
        cur = get_db().cursor().execute(
            "select * from ( " +
            "select * from" +
            "(select device_id, max(timesta) m from device_history "+
            "where device_id in " +
            "(select deviceId from user_device where userId="+str(user)+") "+
            "group by device_id) t, device_history b where t.device_id = b.device_id and t.m = b.timesta " 
            +") inner join user_device on "+
            "device_id = user_device.deviceId where userId="+str(user)
            )
        my_query = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
        features = []
        for i in range(len(my_query)):
            info = my_query[i]['info']
            alert = my_query[i]['alert']
            lat = my_query[i]['lat']
            lng = my_query[i]['lng']
            val = my_query[i]['val']
            device_id = my_query[i]['device_id']
            device_name = my_query[i]['name']
            timesta = my_query[i]['timesta']
            my_point = Point((lng, lat))
            my_prop = {
                "info": info,
                "alert": alert,
                "val": val,
                "device_id": device_id,
                "time_sta": timesta,
                "device_name": device_name,
            }
            my_feature = Feature(geometry = my_point, properties=my_prop)
            features.append(my_feature)
        res = FeatureCollection(features)
        return res

@bp.route('/getAllValue')
def getAllValue():
    error = None
    user = session['user_id']
    if error is not None:
        flash(error)
    else:
        cur = get_db().cursor().execute(
            "select alert, timesta, val, name from device_history inner join user_device " +
            "on device_history.device_id = device.deviceId "+
            "where userId="+str(user)+" order by timesta desc limit 30"
            )
        my_query = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
        res = jsonify(my_query)
        return res
# cast((val / 10) * 10 + 5 as varchar)
@bp.route('/getAllValue1')
def getAllValue1():
    error = None
    user = session['user_id']
    if error is not None:
        flash(error)
    else:
        cur = get_db().cursor().execute(
            "select name, (val / 10) * 10 as value_type, count(*) as count from ( select * from device_history inner join user_device " +
            "on device_history.device_id = user_device.deviceId "+
            "where userId="+str(user)+" order by timesta desc limit 300) group by name, value_type"
            )
        my_query = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
        res = jsonify(my_query)
        return res

@bp.route('/getDataCount')
def getDataCount():
    error = None
    user = session['user_id']
    if error is not None:
        flash(error)
    else:
        cur = get_db().cursor().execute(
            "select (timesta/10000) as value_type, count(*) as count from ( select * from device_history inner join user_device " +
            "on device_history.device_id = user_device.deviceId "+
            "where userId="+str(user)+" order by timesta desc limit 300) group by value_type"
            )
        my_query = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
        res = jsonify(my_query)
        return res

@bp.route('/searchDevice')
def searchDevice():
    error = None
    name = str(request.args["deviceName"])
    funcname = request.args["callback"]
    user = session['user_id']
    if not name:
        error = "Callback is required."
    if error is not None:
        flash(error)
    else:
        cur = get_db().cursor().execute(
            "select deviceId, name from user_device where userId="+str(user)+
            " and name like \'%" + name + "%\'"
            )
        my_query = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
        res = {"item": my_query}
        content = '%s(%s)' % (funcname, res)
        return content

@bp.route('/getDevice')
def getDevice():
    error = None
    funcname = request.args["callback"]
    user = session['user_id']
    if error is not None:
        flash(error)
    else:
        cur = get_db().cursor().execute(
            "select deviceId, name from user_device where userId="+str(user)
            )
        my_query = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
        res = {"item": my_query}
        content = '%s(%s)' % (funcname, res)
        return content

@bp.route('/getDeviceTable')
def getDeviceTable():
    error = None
    user = session['user_id']
    if error is not None:
        flash(error)
    else:
        cur = get_db().cursor().execute(
            "select deviceId as key, name from user_device where userId="+str(user)
            )
        my_query = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
        res = jsonify(my_query)
        return res

@bp.route('/addDevice')
def addDevice():
    user = session['user_id']
    cur = get_db().cursor().execute(
            "select id from device where id not in"+
            "(select deviceId from user_device where userId="+str(user)+")"
            ).fetchone()
    if cur is None:
        error = 'no available device. '
        return jsonify(error)
    deviceid = cur['id']
    name = 'device_' + str(deviceid)
    db = get_db()
    db.execute(
        "insert into user_device values (?, ?, ?)", (user, deviceid, name,)
    )
    db.commit()
    cur = get_db().cursor().execute(
        "select count(*) as count from user_device where userId = "+str(user)
    ).fetchone()
    count = cur['count']
    db.execute(
        "insert into device_count (user_id, count) values (?, ?)", 
        (user, count)
    )
    db.commit()
    info = {'id': deviceid, 'name': name}
    return jsonify(info)

@bp.route('/searchAvaiDevice')
def searchAvaiDevice():
    user = session['user_id']
    cur = get_db().cursor().execute(
            "select id from device where id not in"+
            "(select deviceId from user_device where userId="+str(user)+")"
            ).fetchone()
    if cur is None:
        error = 'no available device. '
        return jsonify(error)
    deviceid = cur['id']
    return jsonify(deviceid)

@bp.route('/updateDevice', methods = ["POST"])
def updateDevice():
    db = get_db()
    jsonData =request.get_json()
    user = session['user_id']
    device_id = jsonData['key']
    device_name = jsonData['name']
    db.execute(
        "update user_device set name = ? where userId = " + str(user) +
        " and deviceId = ?", (device_name, device_id, )
    )
    db.commit()
    return jsonify(jsonData), 201

@bp.route('/deleteDevice', methods = ["POST"])
def deleteDevice():
    db = get_db()
    jsonData =request.get_json()
    user = session['user_id']
    device_id = jsonData['key']
    db.execute(
        "delete from user_device where userId = " + str(user) +
        " and deviceId = ?", (device_id, )
    )
    db.commit()
    cur = get_db().cursor().execute(
        "select count(*) as count from user_device where userId = "+str(user)
    ).fetchone()
    count = cur['count']
    db.execute(
        "insert into device_count (user_id, count) values (?, ?)", 
        (user, count)
    )
    db.commit()
    return jsonify(jsonData), 201

@bp.route('/getCount')
def getCount():
    db = get_db()
    user = session['user_id']
    cur = get_db().cursor().execute(
        "select count, cast(time as text) as time from device_count where user_id="+str(user)
        )
    my_query = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
    res = jsonify(my_query)
    return res

@bp.route('/getCountNow')
def getCountNow():
    user = session['user_id']
    cur = get_db().cursor().execute(
        "select count from device_count where user_id="+str(user)+
        " group by user_id having max(time)"
        ).fetchone()
    res = jsonify({'count':cur['count']})
    return res

@bp.route('/getOnlineCountNow')
def getOnlineCountNow():
    user = session['user_id']
    timenow = (int)(time.time()*1000)
    cur = get_db().cursor().execute(
        "select count(*) as count from (select device_id, max(timesta) as maxtime from device_history " + 
        "where device_id in "+
        "(select deviceId from user_device where userId="+str(user)+") " +
        "group by device_id) t where " +
        "? - maxtime < 10000", (timenow, )
        ).fetchone()
    res = jsonify({'count':cur['count']})
    return res

@bp.route('/getOnlinePercentNow')
def getOnlinePercentNow():
    user = session['user_id']
    timenow = (int)(time.time()*1000)
    cur = get_db().cursor().execute(
        "select count(*) as count from (select device_id, max(timesta) as maxtime from device_history " + 
        "where device_id in "+
        "(select deviceId from user_device where userId="+str(user)+") " +
        "group by device_id) t where " +
        "? - maxtime < 10000", (timenow, )
        ).fetchone()
    online = cur['count']
    cur = get_db().cursor().execute(
        "select count from device_count where user_id="+str(user)+
        " group by user_id having max(time)"
        ).fetchone()
    all = cur['count']
    percent = [(int)((float)(online) / (float)(all) * 100)]
    #info = {'id': deviceid, 'name': name}
    res = [{'title': "在线设备占比",
            'ranges': [100],
            'measures': percent,
            'target': False,
    }]
    return jsonify(res)

@bp.route('/logout')
def logout():
    session.clear()
    return jsonify('logout')

class User(object):
    def __init__(self, id, username, password):
        self.id = id
        self.name = username
        self.password = password