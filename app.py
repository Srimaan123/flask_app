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
        username = post_data.get("body")["usernamee"]
        password = post_data.get("body")["password"]
        cursor.execute("SELECT * FROM users WHERE username=? AND password=?",(username,password))
        user = cursor.fetchone()
        print(user)
    else:
        conn.close()
        return render_template("login.html")

@app.route("/create")
def create_account():
    return "development"

if __name__ == "__main__":
    app.run(debug=True)