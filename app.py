from flask import Flask,render_template,url_for,redirect,request,jsonify
import sqlite3
import time
app = Flask(__name__)

def init():
    return sqlite3.connect("data.db")


@app.route("/",methods=["GET","POST"])
def login():

    conn = init()
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY,
        username TEXT,
        password TEXT,
        last_seen TEXT
    )
    ''')
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS requests(
        requested_by TEXT,
        requested_to TEXT,
        is_accepted TEXT,
        is_rejected TEXT               
    )
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chats(
         sender TEXT,
         reciever TEXT,
         message TEXT,
         is_message_seen TEXT,
         is_message_deleted TEXT      
    )
    """)
    conn.commit()
    conn.close()
    conn = init()
    cursor = conn.cursor()
    if request.method == "POST":
        post_data = request.get_json()
        username = post_data.get("username")
        password = post_data.get("password")
        cursor.execute("SELECT * FROM users WHERE username=? AND password=?",(username,password))
        user = cursor.fetchone()
        if user:
            conn.close()
            return jsonify({
                "status": "success",
                "body":"valid"
            })
        else:
            conn.close()
            return jsonify({
                "status": "success",
                "body": "not valid"
            })
    else:
        conn.close()
        return render_template("login.html")
    

#CREATE ACCOUNT
@app.route("/create",methods=["GET","POST"])
def create_account():
    conn = init()
    cursor = conn.cursor()
    if request.method == "POST":
        post_data = request.get_json()

        username = post_data.get("username")
        password = post_data.get("password")
        cursor.execute("INSERT INTO users(username,password) VALUES(?,?)",(username,password))
        conn.commit()
        conn.close()
        return "account created"
    else:
        conn.close()
        return render_template("create_account.html")

#MAIN
@app.route("/main/<username>")
def main(username):
    return render_template("main.html",username=username)

@app.route("/search/<username>")
def search(username):
    return render_template("search.html",username=username)

@app.route("/api/search",methods=["POST"])
def api():
    conn = init()
    cursor = conn.cursor()
    if request.method == "GET":
        conn.close()
    else:
        if 1 == 1:
            get_data = request.get_json()
            query = f'%{get_data.get("query")}%'
            requested_by = get_data.get("username")
            cursor.execute("SELECT username FROM users WHERE username LIKE ?",(query,))
            rows = cursor.fetchall()
            users = [row[0] for row in rows]
            cursor.execute("SELECT * FROM requests WHERE requested_by=?",(requested_by,))
            rows = cursor.fetchall()
            requests = [row[1] for row in rows]
            is_accepted = [row[2] for row in rows]
            is_requested = []
            for i in users:
                if i in requests:
                    is_requested.append("True")
                else:
                    is_requested.append("False")
            data = {
                "body": users,
                "isrequested": is_requested,
                "isaccepted": is_accepted,
                "isrejected": [row[3] for  row in rows]
            }
            if users:
                conn.close()
                return jsonify(data)
            else:
                conn.close()
                return jsonify({
                    "body": []
                })

@app.route("/api/request",methods=["POST"])
def follow():
    conn = init()
    cursor = conn.cursor()
    get_data = request.get_json()
    status,requested_by,requested_to = get_data.get("code").split("-")
    if status == "notfollowed":
        status = "requested"
        cursor.execute("INSERT INTO requests(requested_by,requested_to,is_accepted,is_rejected) VALUES(?,?,?,?)",(requested_by,requested_to,"False","False"))
        conn.commit()
        conn.close()
        return jsonify({
            "status": status
        })
    elif status == "requested" or status == "followed":
        status = "notfollowed"
        cursor.execute("DELETE FROM requests WHERE requested_by=? AND requested_to=?",(requested_by,requested_to))
        conn.commit()
        conn.close()
        return jsonify({
            "status": status
        })
    else:
        conn.close()
        return jsonify({
            status: "rejected"
        })
@app.route("/notifications/<username>")
def show(username):
    return render_template("notifications.html",username=username)
@app.route("/api/notifications",methods=["POST"])
def notifications():
    conn = init()
    cursor = conn.cursor()
    get_data = request.get_json()
    requested_to = get_data.get("username")
    cursor.execute("SELECT requested_by FROM requests WHERE requested_to=? AND is_accepted='False' AND is_rejected='False'",(requested_to,))
    requests = [row[0] for row in cursor.fetchall()]
    conn.close()
    return jsonify({
        "usernames": requests
    })
@app.route("/api/accept",methods=["POST"])
def accept():
    conn = init()
    cursor = conn.cursor()

    get_data = request.get_json()
    accepted_by,accepted_to = get_data.get("accepted_by"),get_data.get("accepted_to")
    cursor.execute("UPDATE requests SET is_accepted = 'True' WHERE requested_by=? AND requested_to=?",(accepted_to,accepted_by))
    conn.commit()
    conn.close()
    return jsonify({
        "accepted": "True"
    })

@app.route("/api/reject",methods=["POST"])
def reject():
    conn = init()
    cursor = conn.cursor()

    get_data = request.get_json()
    rejected_by,rejected_to = get_data.get("rejected_by"),get_data.get("rejected_to")
    cursor.execute("UPDATE requests SET is_rejected = 'True' WHERE requested_by=? AND requested_to=?",(rejected_to,rejected_by))
    conn.commit()
    conn.close()
    return jsonify({
        "rejected": "True"
    })

@app.route("/accounts/<username>",methods=["GET"])
def messages(username):
    conn = init()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM requests WHERE (requested_to=? AND is_accepted='True') OR (requested_by=? AND is_accepted='True')",(username,username))
    rows = cursor.fetchall()
    accounts = []
    for i in rows:
        if i[0] == username:
            accounts.append(i[1])
        elif i[1] == username:
            accounts.append(i[0])
    conn.close()
    return render_template("accounts.html",username=username,accounts=accounts)

@app.route("/api/accounts",methods=["POST"])
def accounts():
    conn = init()
    cursor = conn.cursor()
    get_data = request.get_json()
    query = f"%{get_data.get('query')}%"
    username = get_data.get("username")
    cursor.execute("SELECT * FROM requests WHERE (requested_by = ? AND is_accepted='True' AND requested_to LIKE ?) OR (requested_to=? AND is_accepted='True' AND requested_by LIKE ?)",(username,query,username,query))
    rows = cursor.fetchall()
    accounts = []
    for i in rows:
        if i[0] == username:
            accounts.append(i[1])
        elif i[1] == username:
            accounts.append(i[0])
    conn.close()
    return jsonify({
        "accounts": accounts
    })
@app.route("/chat/<code>")
def chats(code):
    conn = init()
    cursor = conn.cursor()
    sender,reciever = code.split("-")
    
    cursor.execute("SELECT * FROM chats WHERE (sender=? AND reciever=?) OR (sender=? AND reciever=?)",(sender,reciever,reciever,sender))
    chats = cursor.fetchall()
    cursor.execute("UPDATE chats SET is_message_seen='True' WHERE reciever=? AND sender=?",(sender,reciever))
    conn.commit()
    conn.close()
    return render_template("chat.html",reciever=reciever,username=sender,messages=chats)

@app.route("/api/chats",methods=["POST"])
def chats_api():
    conn = init()
    cursor = conn.cursor()
    get_data = request.get_json()
    method = get_data.get("method")
    sender = get_data.get("username")
    reciever = get_data.get("reciever")
    if method == "send":
        message = get_data.get("message")
        cursor.execute("INSERT INTO chats(sender,reciever,message,is_message_seen,is_message_deleted) VALUES(?,?,?,?,?)",(sender,reciever,message,'False','False'))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            "chats_added": 'True',
            "message": message,
            "reciever": reciever
        })
@app.route("/api/fetch_new_messages/<code>",methods=["POST"])
def fetch_new_messages(code):
    conn = init()
    cursor = conn.cursor()
    
    sender,reciever,length = code.split("-")
    cursor.execute("SELECT * FROM chats WHERE (sender=? AND reciever=?) OR (sender=? AND reciever=?)",(sender,reciever,reciever,sender))
    rows = cursor.fetchall()
    messages = [row[2] for row in rows]
    senders = [row[0] for row in rows]
    conn.close()
    if len(rows) > int(length):
        return jsonify({
            "reload":"yes",
            "messages": messages,
            "senders": senders
        })
    else:
        return jsonify({
            "reload": "no"
        })

@app.route("/api/has_new_messages/<username>",methods=["POST"])
def has_new_messages(username):
    conn = init()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM chats WHERE is_message_seen='False' AND reciever=?",(username,))
    rows = cursor.fetchall()
    senders = [row[0] for row in rows]
    
    conn.close()
    if rows != []:
        return jsonify({
            "new_message_recieved": "True",
            "len": len(rows),
            "senders": senders
        })
    else:
        return jsonify({
            "new_message_recieved": "False"
            
        })

@app.route("/api/fetch_active/<username>",methods=["POST"])
def fetch_active(username):
    conn = init()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM requests WHERE (requested_by=? AND is_accepted='True') OR (requested_to=? AND is_accepted='True')",(username,username))
    online_users = []
    rows = cursor.fetchall()
    for i in rows:
        last_seen = i[3]
        current_time = int(time.time())

        if current_time - last_seen < 200:
            online_users.append(i[1])

    conn.close()
    return jsonify({
        "active": online_users
        })

@app.route("/api/update_last_seen/<username>",methods=["POST"])
def update_last_seen(username):
    conn = init()
    cursor = conn.cursor()

    cursor.execute("UPDATE users SET last_seen=? WHERE username=?",(int(time.time()),username))

    return jsonify({
        "is_updated": "True"
        })

if __name__ == "__main__":
    app.run(ssl_context="adhoc",debug=True)