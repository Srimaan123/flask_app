from flask import Flask,render_template,url_for,redirect,request,jsonify
import sqlite3
app = Flask(__name__)

def init():
    return sqlite3.connect("data.db")

conn = init()
cursor = conn.cursor()
cursor.execute('''
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY,
    username TEXT,
    password TEXT
)
 ''')
conn.commit()
conn.close()

@app.route("/",methods=["GET","POST"])
def login():
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
            cursor.execute("SELECT username FROM users WHERE username LIKE ?",(query,))
            rows = cursor.fetchall()
            users = [row[0] for row in rows]
            data = {
                "body": users
            }
            if users:
                conn.close()
                return jsonify(data)
            else:
                conn.close()
                return jsonify({
                    "body": []
                })

if __name__ == "__main__":
    app.run(debug=True)