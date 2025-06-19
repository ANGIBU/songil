import mysql.connector 
from datetime import datetime, timedelta
from flask import jsonify
import json
import requests
import re
import math # 수학함수 사용
from werkzeug.security import generate_password_hash, check_password_hash

class DBManager:
    def __init__(self):
        self.connection = None
        self.cursor = None
    
    ## 데이터베이스 연결
    def connect(self): 
        try :
            self.connection = mysql.connector.connect(
                host = "124.55.97.204",
                user = "livon",
                password="dks12345",
                database="songil",
                charset="utf8mb4"
            )
            self.cursor = self.connection.cursor(dictionary=True)
        
        except mysql.connector.Error as error :
            print(f"데이터베이스 연결 실패 : {error}")
    
    ## 데이터베이스 연결해제
    def disconnect(self):
        if self.connection and self.connection.is_connected():
            self.cursor.close()
            self.connection.close()

# 회원가입 
    def insert_user(self, form):
        try:
            sql = """
                INSERT INTO users (
                    email, password_hash, nickname, role,
                    full_name, birth_date, phone, gender,
                    address_main, address_detail, created_at, points
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            hashed_pw = generate_password_hash(form['password'])
            values = (
                form['email'],
                hashed_pw,
                form['nickname'],
                'user',
                form['fullName'],
                form['birthDate'],
                form['phone'],
                form['gender'],
                form['address'],
                form['detailAddress'],
                datetime.now(),
                100  # 가입 축하 포인트
            )
            self.cursor.execute(sql, values)
            self.connection.commit()
            return True
        except Exception as e:
            print("회원가입 실패:", e)
            return False
        
    # 로그인    
    def get_user_by_email(self, email):
        try:
            self.cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            return self.cursor.fetchone()
        except Exception as e:
            print("사용자 조회 실패:", e)
            return None
    
    # 아이디 찾기
    def find_email_by_name_phone(self, name, phone):
        self.connect()
        sql = "SELECT email, created_at FROM users WHERE full_name = %s AND phone = %s"
        self.cursor.execute(sql, (name, phone))
        return self.cursor.fetchone()
    
    # 비밀번호 찾기
    def find_user_by_name_email(self, name, email):
        self.connect()  # 커넥션 누락 방지
        sql = "SELECT * FROM users WHERE full_name = %s AND email = %s"
        self.cursor.execute(sql, (name, email))
        return self.cursor.fetchone()
    
    def update_password(self, email, hashed_password):
        self.connect()
        try:
            sql = "UPDATE users SET password_hash = %s WHERE email = %s"
            self.cursor.execute(sql, (hashed_password, email))
            self.connection.commit()
            return True
        except Exception as e:
            print("비밀번호 업데이트 실패:", e)
            return False


