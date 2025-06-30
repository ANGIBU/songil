# model.py
import mysql.connector 
from datetime import datetime
from flask import jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv

load_dotenv()

class DBManager:
    def __init__(self):
        self.connection = None
        self.cursor = None
    
    ## 데이터베이스 연결
    def connect(self): 
        try :
            self.connection = mysql.connector.connect(
                host = os.getenv('DB_HOST', '124.55.97.204'),
                user = os.getenv('DB_USER', 'livon'),
                password = os.getenv('DB_PASSWORD', 'dks12345'),
                database = os.getenv('DB_NAME', 'songil'),
                charset = os.getenv('DB_CHARSET', 'utf8mb4')
            )
            self.cursor = self.connection.cursor(dictionary=True)
        
        except mysql.connector.Error as error :
            print(f"데이터베이스 연결 실패 : {error}")
    
    ## 데이터베이스 연결해제
    def disconnect(self):
        if self.connection and self.connection.is_connected():
            self.cursor.close()
            self.connection.close()

    # 쿼리 실행 메소드
    def execute(self, query, params=None, commit=False):
        self.cursor.execute(query, params)
        if commit:
            self.connection.commit()  
        return self.cursor

    # 트랜잭션 관리 메소드들
    def begin_transaction(self):
        """트랜잭션 시작"""
        try:
            self.cursor.execute("START TRANSACTION")
        except Exception as e:
            print(f"트랜잭션 시작 오류: {e}")
            raise
    
    def commit_transaction(self):
        """트랜잭션 커밋"""
        try:
            self.connection.commit()
        except Exception as e:
            print(f"트랜잭션 커밋 오류: {e}")
            raise
    
    def rollback_transaction(self):
        """트랜잭션 롤백"""
        try:
            self.connection.rollback()
        except Exception as e:
            print(f"트랜잭션 롤백 오류: {e}")
            raise
    
    # 쿼리 실행 메소드
    def execute_query(self, query, params=None):
        """쿼리 실행 및 결과 반환"""
        try:
            if params:
                self.cursor.execute(query, params)
            else:
                self.cursor.execute(query)
            
            # SELECT 쿼리인 경우 결과 반환
            if query.strip().upper().startswith('SELECT'):
                return self.cursor.fetchall()
            else:
                # INSERT, UPDATE, DELETE인 경우 affected rows 반환
                return self.cursor.rowcount
                
        except Exception as e:
            print(f"쿼리 실행 오류: {e}")
            raise

# 회원가입 
    def insert_user(self, form):
        try:
            sql = """
                INSERT INTO users (
                    email, password_hash, nickname, role,
                    full_name, birth_date, phone, gender,
                    address_main, address_detail, created_at, points, alert_report_count
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            hashed_pw = generate_password_hash(form['password'])
            values = (
                form['email'],
                hashed_pw,
                form['nickname'],
                'user', # 기본 역할
                form['fullName'],
                form['birthDate'],
                form['phone'],
                form['gender'],
                form['address'],
                form['detailAddress'],
                datetime.now(),
                100,  # 가입 축하 포인트
                0     # 초기 alert_report_count
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
        sql = "SELECT email, created_at FROM users WHERE full_name = %s AND phone = %s"
        self.cursor.execute(sql, (name, phone))
        return self.cursor.fetchone()
    
    # 비밀번호 찾기
    def find_user_by_name_email(self, name, email):
        sql = "SELECT * FROM users WHERE full_name = %s AND email = %s"
        self.cursor.execute(sql, (name, email))
        return self.cursor.fetchone()
    
    # 비밀번호 변경
    def update_password(self, email, hashed_password):
        try:
            sql = "UPDATE users SET password_hash = %s WHERE email = %s"
            self.cursor.execute(sql, (hashed_password, email))
            self.connection.commit()
            return True
        except Exception as e:
            print("비밀번호 업데이트 실패:", e)
            return False

    # 목격자 정보 삽입
    def insert_witness_report(self, report_data):
        try:
            sql = """
                INSERT INTO witness_reports (
                    user_id, missing_person_name, missing_person_age,
                    missing_person_gender, missing_date, missing_location,
                    missing_features, witness_datetime, time_accuracy,
                    location, location_detail, location_accuracy,
                    description, confidence, distance,
                    image_urls, status,
                    created_at, updated_at
                ) VALUES (
                    %(user_id)s, %(missing_person_name)s, %(missing_person_age)s,
                    %(missing_person_gender)s, %(missing_date)s, %(missing_location)s,
                    %(missing_features)s, %(witness_datetime)s, %(time_accuracy)s,
                    %(location)s, %(location_detail)s, %(location_accuracy)s,
                    %(description)s, %(confidence)s, %(distance)s,
                    %(image_urls)s, %(status)s,
                    NOW(), NOW()
                )
            """
            print(f"[디버그] 실행될 SQL 쿼리: {sql}")
            print(f"[디버그] SQL 파라미터: {report_data}")

            self.cursor.execute(sql, report_data)
            self.connection.commit()
            return True
        except Exception as e:
            self.connection.rollback()
            print(f"목격 신고 삽입 실패: MySQL 오류 - {e}")
            return False

    def get_missing_person_by_external_id(self, external_id):
        try:
            query = "SELECT external_id, name, age, gender, missing_date, missing_location, features FROM api_missing_data WHERE external_id = %s AND status = 'active'"
            self.cursor.execute(query, (external_id,))
            result = self.cursor.fetchone()
            if result:
                return result
            else:
                return None
        except Exception as e:
            print(f"[에러] DB에서 실종자 정보 조회 중 오류 발생 ({external_id}): {e}")
            return None
    
# DBManager 인스턴스 생성 및 연결
db = DBManager()
db.connect()