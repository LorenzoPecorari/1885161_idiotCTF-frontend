import jwt
import datetime
import os
import random

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

SECRET_KEY = 'test'

DB_FILE = 'users.txt'
CHALLENGES_DB_FILE = 'challenges.txt'
TOKEN_FILE = 'tokens.txt'

def load_users():
    users = {}
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r') as file:
            for line in file:
                email, password, token = line.strip().split(':')
                users[email] = password
    return users

def save_user(email, password, token=None):
    with open(DB_FILE, 'a') as file:
        file.write(f"{email}:{password}:{token}\n")

def save_challenge(id, title, description, flag, points, category, contest_id):
    with open(CHALLENGES_DB_FILE, 'a') as file:
        file.write(f"{id}:{title}:{description}:{flag}:{points}:{category}:{contest_id}\n")

def load_tokens():
    tokens = {}
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, 'r') as file:
            for line in file:
                email, token = line.strip().split(':')
                tokens[email] = token
    return tokens

def save_token(email, token):
    with open(TOKEN_FILE, 'a') as file:
        file.write(f"{email}:{token}\n")

@app.route('/api/auth/register', methods=['POST'])
def register():
    email = request.json.get('email')
    password = request.json.get('password')

    users = load_users()

    if email in users:
        return jsonify({'valid': False, 'message': 'Email already registered'}), 400
    
    if email and password:
        save_user(email, password)
        return jsonify({'valid': True, 'message': 'User registered successfully'}), 201
    else:
        return jsonify({'valid': False, 'message': 'Invalid data'}), 400

@app.route('/api/auth/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    users = load_users()
    
    if email in users and users[email] == password:
        token = jwt.encode({
            'email': email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=100)
        }, SECRET_KEY, algorithm='HS256')
        save_token(email, token)
        return jsonify({'valid': True, 'message': 'OK', 'token': token}), 200
    else:
        return jsonify({'valid': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/user/profile', methods=['POST'])
def profile():
    data = request.json
    token = data.get('token')
    
    return check_token(token)

def check_token(token):
    if not token:
        return jsonify({'valid': False, 'message': "Token not found"}), 400

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        if datetime.datetime.utcfromtimestamp(decoded['exp']) < datetime.datetime.utcnow():
            return jsonify({'valid': False, 'message': 'Token expired, please login again.'}), 401

        return jsonify({'valid': True, 'message': f'Welcome {decoded["email"]}'}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'valid': False, 'message': 'Token expired, please login again.'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'valid': False, 'message': 'Invalid token'}), 401

@app.route('/api/auth/expired', methods=['POST'])
def verify_token():
    token = request.json.get('token')
    return check_token(token)

@app.route('/api/challenge/done', methods=['POST'])
def check_if_done():
    token = request.json.get('token')
    response = check_token(token)
    
    if response[1] != 200:
        return response

    id = request.json.get('id')
    
    if id == 'incomplete challenge':
        return jsonify({'valid': True, 'message': "Done"}), 200
    else:
        return jsonify({'valid': False, 'message': "Undone"}), 200

@app.route('/api/challenge/verify', methods=['POST'])
def verify_flag():
    token = request.json.get('token')
    response = check_token(token)
    if response[1] != 200:
        return response

    diff = request.json.get('difficulty')
    flag = request.json.get('flag')
    
    if flag and diff:
        return jsonify({'valid': True, 'message': 'OK'})
    else:
        return jsonify({'valid': False, 'message': 'KO'})

@app.route('/api/user/generated_challenges', methods=['GET'])
def get_generated_challenges():
    challenge_1 = {'title' : "0ld_Sch00l_C00k1es", 'points': 100, 'category' : "Web", 'contest' : "easy"}
    challenge_2 = {'title' : "Strange Greek Horse", 'points': 200, 'category' : "DOM", 'contest' : "medium"}
    challenge_3 = {'title' : "SQL_Fever", 'points': 300, 'category' : "Reverse", 'contest' : "hard"}        
    challenges = [challenge_1, challenge_2, challenge_3]
    
    # print(challenges)

    json_to_send = jsonify({'valid': True, 'challenges': challenges})
    # print(json_to_send)

    return json_to_send, 200


@app.route('/api/user/add_challenge', methods = ['POST'])
def insert_challenge():
    id = random.randint(0, 10000)
    title = request.json.get('title')
    description = request.json.get('description')
    flag = "flag"
    points = random.randint(100, 600)
    category = request.json.get('category')
    contest_id = request.json.get('contest')
    print(title, description, flag, points, category, contest_id)
    
    with open(CHALLENGES_DB_FILE, 'r') as file:
        for line in file:
            existing_id, existing_title, existing_description, existing_flag, existing_points, existing_category, existing_contest_id = line.strip().split(':')
            if title == existing_title and description == existing_description and flag == existing_flag and points == existing_points and category == existing_category and contest_id == existing_contest_id:
                return jsonify({'valid': False, 'message': 'Challenge already exists'}), 400
    
    save_challenge(id, title, description, flag, points, category, contest_id)
    return jsonify({'valid': True, 'message': 'OK'}), 200


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=49152)
    