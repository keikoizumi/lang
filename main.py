# coding:utf-8
from bottle import request, route, get, post, hook, response, static_file, template, redirect, run
from selenium import webdriver 
import mysql.connector
import datetime
import os.path
import random   
import string 
import random
import time
import json
import os


#status
PASTDAY = 'pastday'
ALL = 'all'

#ファイルパス
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'static')

#CSS
@route('/static/css/<filename:path>')
def send_static_css(filename):
    return static_file(filename, root=f'{STATIC_DIR}/css')

#JS
@route('/static/js/<filename:path>')
def send_static_js(filename):
    return static_file(filename, root=f'{STATIC_DIR}/js')

#img
@route('/static/img/<filename:path>')
def send_static_img(filename):
    return static_file(filename, root=f'{STATIC_DIR}/img')

#rootの場合
@route("/")
def index():
    return template('img')

@post('/data')
def getData():
    qerytype = ALL
    date = None
    data = dbconn(qerytype, date)
    #ID NULLチェック
    if isdataCheck(data):
        print('checkedUrl:')
        #json作成
        jsondata = makeJson(data)
        return jsondata
    else:
        return postOther()

i = 0
def isdataCheck(data):
    if data == None:
        print('チェックNG')
        global i
        i += 1
        print('i')
        print(i)
        if i < 5:
            return None 
        else:
            return True
    else:
        print('チェックOK')
        return True

def makeJson(data):
    jsondata = jsonDumps(data)
    return jsondata
    
def jsonDumps(data):
    data = json.dumps(data)
    return isTypeCheck(data)

def isTypeCheck(jsondata):
    if type(jsondata) is str:
        print(type(jsondata))
        return jsondata
    else:
        jsonDumps(jsondata)
    

def dbconn(qerytype, date):

    f = open('./conf/prop.json', 'r')
    info = json.load(f)
    f.close()
    #DB設定
    
    conn = mysql.connector.connect(
            host = info['host'],
            port = info['port'],
            user = info['user'],
            password = info['password'],
            database = info['database'],
    )
    
    cur = conn.cursor(dictionary=True)   
    
    try:    
        #接続クエリ
        if qerytype == ALL:
            sql = "SELECT cate,title,q1,q2,q3,ans,cast(dt as char) FROM language.languageData"
        elif qerytype == PASTDAY:
            sql = "SELECT * from language.languageData"

        #クエリ発行
        print(sql)
        cur.execute(sql)
        cur.statement    
        data = cur.fetchall()

        if data is not None:
            print(data)
            #data = jsonDumps(data)
            return data
        else:
            return None

    except:
        print("DBエラーが発生しました")
        return None
    finally:
        cur.close()
        conn.close()
    

if __name__ == "__main__":
    run(host='localhost', port=8082, reloader=True, debug=True)