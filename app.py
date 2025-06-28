# app.py
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import os
from flask import flash
from model import DBManager
from werkzeug.security import check_password_hash
import os
import random
from werkzeug.security import generate_password_hash, check_password_hash
import requests
from datetime import datetime
from services.ranking_service import RankingService
import uuid
import json
from apscheduler.schedulers.background import BackgroundScheduler
from sync_api import sync_missing_api_data
import atexit
import hashlib
import hmac


db = DBManager()
db.connect()
ranking_service = RankingService(db)
app = Flask(__name__)
app.secret_key = 'songil_secret_key_2024'

API_URL = "https://www.safetydata.go.kr/V2/api/DSSP-IF-20597"
SERVICE_KEY = "3FQG91W954658S1F"

@app.route('/')
def index():
    try:
        return render_template('public/index.html')
    except Exception as e:
        print(f"Error rendering index: {e}")
        return "페이지를 불러오는 중 오류가 발생했습니다.", 500
    
@app.route('/ranking')
def ranking():
    try:
        user_id = session.get('user_id')
        rankings = ranking_service.get_rankings(limit=1000)
        rank_info = None

        if user_id:
            for idx, row in enumerate(rankings, start=1):
                if str(row['user_id']) == str(user_id):
                    rank_info = {
                        'rank': idx,
                        'points': row['points'],
                        'reports': row['reports'],
                        'nickname': row['name']
                    }
                    break

        return render_template('public/ranking.html', rankings=rankings, rank_info=rank_info)

    except Exception as e:
        print(f"Error rendering ranking: {e}")
        return redirect(url_for('index'))
    
@app.route('/api/rankings')
def get_rankings_api():
    try:
        limit = request.args.get('limit', 10, type=int)
        period = request.args.get('period', 'all')
        data = ranking_service.get_rankings(limit=limit, period=period)
        return jsonify({'success': True, 'rankings': data})
    except Exception as e:
        app.logger.error(f"랭킹 API 오류: {e}")
        return jsonify({'success': False, 'error': '랭킹 정보를 가져오는 중 오류 발생'}), 500

@app.route('/api/rankings/user/<int:user_id>', methods=['GET'])
def get_user_ranking(user_id):
    try:
        user_ranking = ranking_service.get_user_ranking(user_id)
        
        if user_ranking:
            return jsonify({
                'success': True,
                'user_ranking': user_ranking
            })
        else:
            return jsonify({
                'success': False,
                'error': '사용자를 찾을 수 없습니다.'
            }), 404
            
    except Exception as e:
        app.logger.error(f"사용자 랭킹 API 오류: {str(e)}")
        return jsonify({
            'success': False,
            'error': '사용자 순위 정보를 불러오는 중 오류가 발생했습니다.'
        }), 500
        
@app.route('/api/rankings/stats', methods=['GET'])
def get_ranking_stats():
    try:
        stats = ranking_service.get_ranking_stats() 

        return jsonify({
            'success': True,
            'stats': stats
        })
        
    except Exception as e:
        app.logger.error(f"랭킹 통계 API 오류: {str(e)}")
        return jsonify({
            'success': False,
            'error': '통계 정보를 불러오는 중 오류가 발생했습니다.'
        }), 500

# 알림 관련 API 엔드포인트들 - 팝업에서만 사용
@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'message': '로그인이 필요합니다.'}), 401
        
        limit = request.args.get('limit', 20, type=int)
        category = request.args.get('category', 'all')
        
        # 실제 DB 구현 시 사용할 쿼리 예시
        # notifications = db.get_user_notifications(user_id, limit, category)
        
        # 임시 데이터 (실제로는 DB에서 가져와야 함)
        notifications = [
            {
                'id': 1,
                'title': '긴급 실종자 신고 접수',
                'message': '새로운 긴급 실종자가 신고되었습니다. 확인이 필요합니다.',
                'category': 'reports',
                'type': 'critical',
                'is_read': False,
                'created_at': datetime.now().isoformat(),
                'time_display': '5분 전'
            },
            {
                'id': 2,
                'title': '새로운 목격 신고',
                'message': '김철수님에 대한 목격 신고가 접수되었습니다.',
                'category': 'witnesses',
                'type': 'info',
                'is_read': False,
                'created_at': datetime.now().isoformat(),
                'time_display': '15분 전'
            },
            {
                'id': 3,
                'title': '포인트 적립',
                'message': '목격 신고 승인으로 100포인트가 적립되었습니다.',
                'category': 'system',
                'type': 'success',
                'is_read': False,
                'created_at': datetime.now().isoformat(),
                'time_display': '1시간 전'
            }
        ]
        
        if category != 'all':
            notifications = [n for n in notifications if n['category'] == category]
        
        return jsonify({
            'success': True,
            'notifications': notifications[:limit],
            'total_count': len(notifications),
            'unread_count': len([n for n in notifications if not n['is_read']])
        })
        
    except Exception as e:
        app.logger.error(f"알림 조회 API 오류: {e}")
        return jsonify({'success': False, 'error': '알림을 불러오는 중 오류가 발생했습니다.'}), 500

@app.route('/api/notifications/<int:notification_id>/read', methods=['POST'])
def mark_notification_read(notification_id):
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'message': '로그인이 필요합니다.'}), 401
        
        # 실제 DB 구현 시 사용할 쿼리
        # success = db.mark_notification_read(notification_id, user_id)
        
        # 임시 응답
        success = True
        
        if success:
            return jsonify({
                'success': True,
                'message': '알림을 읽음으로 표시했습니다.'
            })
        else:
            return jsonify({
                'success': False,
                'message': '알림을 찾을 수 없습니다.'
            }), 404
            
    except Exception as e:
        app.logger.error(f"알림 읽음 처리 오류: {e}")
        return jsonify({'success': False, 'error': '알림 처리 중 오류가 발생했습니다.'}), 500

@app.route('/api/notifications/mark-all-read', methods=['POST'])
def mark_all_notifications_read():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'message': '로그인이 필요합니다.'}), 401
        
        # 실제 DB 구현 시 사용할 쿼리
        # count = db.mark_all_notifications_read(user_id)
        
        # 임시 응답
        count = 3
        
        return jsonify({
            'success': True,
            'message': f'{count}개의 알림을 읽음으로 표시했습니다.',
            'updated_count': count
        })
        
    except Exception as e:
        app.logger.error(f"모든 알림 읽음 처리 오류: {e}")
        return jsonify({'success': False, 'error': '알림 처리 중 오류가 발생했습니다.'}), 500

@app.route('/api/notifications/<int:notification_id>/delete', methods=['DELETE'])
def delete_notification(notification_id):
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'message': '로그인이 필요합니다.'}), 401
        
        # 실제 DB 구현 시 사용할 쿼리
        # success = db.delete_notification(notification_id, user_id)
        
        # 임시 응답
        success = True
        
        if success:
            return jsonify({
                'success': True,
                'message': '알림을 삭제했습니다.'
            })
        else:
            return jsonify({
                'success': False,
                'message': '알림을 찾을 수 없습니다.'
            }), 404
            
    except Exception as e:
        app.logger.error(f"알림 삭제 오류: {e}")
        return jsonify({'success': False, 'error': '알림 삭제 중 오류가 발생했습니다.'}), 500

@app.route('/api/notifications/delete-all', methods=['DELETE'])
def delete_all_notifications():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'message': '로그인이 필요합니다.'}), 401
        
        # 실제 DB 구현 시 사용할 쿼리
        # count = db.delete_all_notifications(user_id)
        
        # 임시 응답
        count = 5
        
        return jsonify({
            'success': True,
            'message': f'{count}개의 알림을 모두 삭제했습니다.',
            'deleted_count': count
        })
        
    except Exception as e:
        app.logger.error(f"모든 알림 삭제 오류: {e}")
        return jsonify({'success': False, 'error': '알림 삭제 중 오류가 발생했습니다.'}), 500

@app.route('/api/notifications/unread-count', methods=['GET'])
def get_unread_notifications_count():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'message': '로그인이 필요합니다.'}), 401
        
        # 실제 DB 구현 시 사용할 쿼리
        # count = db.get_unread_notifications_count(user_id)
        
        # 임시 응답
        count = 3
        
        return jsonify({
            'success': True,
            'unread_count': count
        })
        
    except Exception as e:
        app.logger.error(f"읽지 않은 알림 수 조회 오류: {e}")
        return jsonify({'success': False, 'error': '알림 수를 불러오는 중 오류가 발생했습니다.'}), 500

@app.route('/api/missing/recent')
def get_recent_missing():
    try:
        limit = request.args.get('limit', 5, type=int)

        try:
            response = requests.get("https://www.safetydata.go.kr/V2/api/DSSP-IF-20597", params={
                "serviceKey": "3FQG91W954658S1F",
                "returnType": "json",
                "pageNo": "1",
                "numOfRows": "500" 
            }, verify=False, timeout=10)
            
            response.raise_for_status()
            data = response.json()
            
            header = data.get('header', {})
            result_code = header.get('resultCode', '00')
            result_msg = header.get('resultMsg', 'OK')
            
            if result_code != '00':
                print(f"[API 오류] 코드: {result_code}, 메시지: {result_msg}")
                if result_code == '32':
                    print("❌ 등록되지 않은 IP 오류 - DB에서 대체 데이터 조회")
                return get_recent_missing_from_db(limit)
            
        except requests.exceptions.RequestException as req_e:
            print(f"❌ API 요청 실패: {req_e}")
            return get_recent_missing_from_db(limit)
        except Exception as api_e:
            print(f"❌ API 응답 처리 실패: {api_e}")
            return get_recent_missing_from_db(limit)

        if not data:
            print("❌ API 응답이 비어있습니다.")
            return get_recent_missing_from_db(limit)
            
        items = data.get("body", [])
        
        if not items or not isinstance(items, list):
            print("❌ API 응답의 body가 비어있거나 올바르지 않습니다.")
            return get_recent_missing_from_db(limit)

        parsed_items = []
        for item in items:
            if not isinstance(item, dict):
                continue
                
            raw_date = item.get("OCRN_DT", "")
            try:
                occr_date = datetime.strptime(raw_date, "%Y%m%d")
            except:
                occr_date = datetime.min  

            parsed_items.append({
                "id": item.get("SENU") or f"safe-{uuid.uuid4()}",
                "name": item.get("FLNM") or "이름없음",
                "age": item.get("NOW_AGE") or "?",
                "date": occr_date.strftime("%Y.%m.%d"),
                "location": item.get("OCRN_PLC") or "미상",
                "clothing": item.get("PHBB_SPFE") or "정보 없음",
                "image": "/static/images/placeholder.jpg",
                "upCount": 0,
                "sort_date": occr_date
            })

        filtered_items = [item for item in parsed_items if "테스트" not in item["name"]]
        sorted_items = sorted(filtered_items, key=lambda x: x["sort_date"], reverse=True)
        final_list = sorted_items[:limit]

        return jsonify({"success": True, "results": final_list})

    except Exception as e:
        print(f"❌ 실종자 API 전체 로딩 실패: {e}")
        return get_recent_missing_from_db(limit)

def get_recent_missing_from_db(limit=5):
    try:
        query = """
            SELECT external_id, name, age, missing_date, missing_location, features
            FROM api_missing_data
            WHERE status = 'active'
            ORDER BY missing_date DESC, registered_at DESC
            LIMIT %s
        """
        
        db_records = db.execute(query, (limit,)).fetchall()
        
        results = []
        for record in db_records:
            results.append({
                "id": record['external_id'],
                "name": record['name'],
                "age": record['age'] if record['age'] is not None else "?",
                "date": record['missing_date'].strftime("%Y.%m.%d") if record['missing_date'] else "날짜 미상",
                "location": record['missing_location'] if record['missing_location'] else "미상",
                "clothing": record['features'] if record['features'] else "정보 없음",
                "image": "/static/images/placeholder.jpg",
                "upCount": 0
            })
        
        return jsonify({"success": True, "results": results})
        
    except Exception as db_e:
        print(f"❌ DB 조회도 실패: {db_e}")
        return jsonify({"success": False, "error": "데이터를 불러올 수 없습니다.", "results": []}), 500

@app.route('/about')
def about():
    try:
        return render_template('public/about.html')
    except Exception as e:
        print(f"Error rendering about: {e}")
        return redirect(url_for('index'))

@app.route('/search')
def search():
    try:
        return render_template('public/missing_search.html')
    except Exception as e:
        print(f"Error rendering search: {e}")
        return redirect(url_for('index'))

@app.route('/api/missing/search', methods=['POST'])
def api_missing_search():
    try:
        data_from_client = request.get_json(force=True, silent=True) or {}
        keyword = data_from_client.get("keyword", "").strip()

        query = """
            SELECT external_id, name, age, gender, missing_date,
                   missing_location, features, image_url, danger_level
            FROM api_missing_data
            WHERE status = 'active'
        """
        query_params = []

        if keyword:
            query += """
                AND (
                    LOWER(name) LIKE %s OR
                    LOWER(features) LIKE %s OR
                    LOWER(missing_location) LIKE %s
                )
            """
            keyword_like = f"%{keyword.lower()}%"
            query_params.extend([keyword_like, keyword_like, keyword_like])
        
        query += " ORDER BY missing_date DESC, registered_at DESC"

        db_records = db.execute(query, tuple(query_params)).fetchall()

        parsed_items = []
        for record in db_records:
            gender_display = ""
            if record['gender'] == 0:
                gender_display = "여자"
            elif record['gender'] == 1:
                gender_display = "남자"
            else:
                gender_display = "알 수 없음"

            parsed_items.append({
                "id": record['external_id'],
                "name": record['name'],
                "age": record['age'] if record['age'] is not None else "?",
                "gender": gender_display,
                "date": record['missing_date'].strftime("%Y.%m.%d") if record['missing_date'] else "날짜 미상",
                "location": record['missing_location'] if record['missing_location'] else "미상",
                "description": record['features'] if record['features'] else "정보 없음",
                "image": record['image_url'] if record['image_url'] else "/static/images/placeholder.jpg",
                "dangerLevel": record['danger_level'],
                "upCount": 0,
            })

        return jsonify({"success": True, "results": parsed_items, "total": len(parsed_items)})

    except Exception as e:
        print(f"[ERROR] /api/missing/search: {e}")
        return jsonify({"success": False, "message": "서버 오류 발생", "error": str(e)}), 500

def safe_password_check(stored_hash, password):
    try:
        return check_password_hash(stored_hash, password)
    except Exception as e:
        print(f"[로그인 오류] Werkzeug 비밀번호 검증 실패: {e}")
        try:
            if isinstance(stored_hash, str) and isinstance(password, str):
                if stored_hash == password:
                    return True
                
                if stored_hash.startswith('pbkdf2:'):
                    parts = stored_hash.split('$')
                    if len(parts) >= 3:
                        method_parts = parts[0].split(':')
                        if len(method_parts) >= 2:
                            return check_password_hash(stored_hash, password)
                
                if len(stored_hash) == 64:
                    import hashlib
                    hashed_input = hashlib.sha256(password.encode()).hexdigest()
                    return hashed_input == stored_hash
                    
                if len(stored_hash) == 32:
                    import hashlib
                    hashed_input = hashlib.md5(password.encode()).hexdigest()
                    return hashed_input == stored_hash
                    
            return False
        except Exception as fallback_e:
            print(f"[로그인 오류] 폴백 검증도 실패: {fallback_e}")
            return False

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('auth/login.html')

    try:
        email = request.form['email']
        password = request.form['password']

        db_instance = DBManager()
        db_instance.connect()
        user = db_instance.get_user_by_email(email)
        db_instance.disconnect()

        if not user:
            flash("존재하지 않는 이메일입니다.")
            return redirect(url_for('login'))

        if safe_password_check(user['password_hash'], password):
            session['user_id'] = user['id']
            session['email'] = user['email']
            session['nickname'] = user['nickname']
            flash("로그인 성공!")
            return redirect(url_for('index'))
        else:
            flash("이메일 또는 비밀번호가 잘못되었습니다.")
            return redirect(url_for('login'))
            
    except Exception as e:
        print(f"로그인 처리 중 오류: {e}")
        flash("로그인 처리 중 오류가 발생했습니다.")
        return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.clear()
    flash("로그아웃 되었습니다.")
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('auth/register.html')

    form = request.form
    model = DBManager()

    model.connect()  
    success = model.insert_user(form)
    model.disconnect()  

    if success:
        flash("회원가입이 완료되었습니다.")
        return redirect(url_for('login'))
    else:
        flash("회원가입에 실패했습니다.")
        return redirect(url_for('register'))

@app.route('/find_account', methods=['GET'])
def find_account():
    try:
        return render_template('auth/find_account.html')
    except Exception as e:
        print(f"Error rendering find_account: {e}")
        return redirect(url_for('index'))

@app.route('/api/find_id', methods=['POST'])
def api_find_id():
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({'success': False, 'message': '잘못된 요청 형식입니다.'}), 400

        name = data.get('name')
        phone = data.get('phone')

        model = DBManager()
        result = model.find_email_by_name_phone(name, phone)

        if result:
            return jsonify({
                'success': True,
                'email': result['email'],
                'created_at': str(result['created_at'])
            })
        else:
            return jsonify({'success': False, 'message': '일치하는 정보가 없습니다.'}), 404

    except Exception as e:
        import traceback
        print(f"[ERROR] /api/find_id: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': '서버 오류 발생'}), 500

@app.route('/api/send_reset_code', methods=['POST'])
def send_reset_code():
    try:
        data = request.get_json(force=True, silent=True)
        name = data.get('name')
        email = data.get('email')

        if not name or not email:
            return jsonify({'success': False, 'message': '이름과 이메일을 모두 입력해주세요.'}), 400

        model = DBManager()
        user = model.find_user_by_name_email(name, email)

        if not user:
            return jsonify({'success': False, 'message': '일치하는 사용자를 찾을 수 없습니다.'}), 404

        code = str(random.randint(100000, 999999))
        session['reset_code'] = code
        session['reset_email'] = email

        print(f"[DEBUG] 인증코드: {code} (테스트용 콘솔출력)")

        return jsonify({'success': True, 'message': '인증코드가 발송되었습니다.'})

    except Exception as e:
        import traceback
        print(f"[ERROR] /api/send_reset_code: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': '서버 오류 발생'}), 500
    
@app.route('/api/verify_reset_code', methods=['POST'])
def verify_reset_code():
    try:
        data = request.get_json(force=True, silent=True)
        email = data.get('email')
        code = data.get('code')

        if not email or not code:
            return jsonify({'success': False, 'message': '요청이 잘못되었습니다.'}), 400

        if session.get('reset_email') != email:
            return jsonify({'success': False, 'message': '이메일이 일치하지 않습니다.'}), 401

        if session.get('reset_code') != code:
            return jsonify({'success': False, 'message': '인증코드가 올바르지 않습니다.'}), 401

        return jsonify({'success': True, 'message': '인증 성공'})

    except Exception as e:
        import traceback
        print(f"[ERROR] /api/verify_reset_code: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': '서버 오류 발생'}), 500

@app.route('/api/reset_password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json(force=True, silent=True)
        email = data.get('email')
        new_password = data.get('new_password')

        if not email or not new_password:
            return jsonify({'success': False, 'message': '입력값 누락'}), 400

        model = DBManager()
        hashed_pw = generate_password_hash(new_password)
        result = model.update_password(email, hashed_pw)

        if result:
            return jsonify({'success': True, 'message': '비밀번호 변경 완료'})
        else:
            return jsonify({'success': False, 'message': 'DB 업데이트 실패'}), 500

    except Exception as e:
        import traceback
        print(f"[ERROR] /api/reset_password: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': '서버 오류 발생'}), 500

@app.route('/mypage')
def mypage():
    try:
        return render_template('user/mypage.html')
    except Exception as e:
        print(f"Error rendering mypage: {e}")
        return redirect(url_for('index'))

@app.route('/api/missing/<missing_id>', methods=['GET'])
def api_missing_detail(missing_id):
    try:
        query = """
            SELECT external_id, name, age, gender, missing_date,
                missing_location, features, image_url, danger_level
            FROM api_missing_data
            WHERE external_id = %s AND status = 'active'
        """
        result = db.execute(query, (missing_id,)).fetchone()

        if not result:
            return jsonify({"success": False, "message": "해당 실종자를 찾을 수 없습니다."}), 404
    
        related_query = """
            SELECT external_id, name, age, gender, missing_date,
                missing_location, features, image_url, danger_level
            FROM api_missing_data
            WHERE status = 'active' AND gender = %s
                AND age BETWEEN %s AND %s
                AND external_id != %s
            ORDER BY missing_date DESC
            LIMIT 3
        """
        age = result['age'] or 0
        related = db.execute(related_query, (result['gender'], age - 3, age + 3, missing_id)).fetchall()

        related_items = []
        for r in related:
            related_items.append({
                "id": r["external_id"],
                "name": r["name"],
                "age": r["age"],
                "gender": r["gender"],
                "main_image": r["image_url"],
                "location": r["missing_location"],
                "missing_date": r["missing_date"].strftime("%Y.%m.%d") if r["missing_date"] else "정보없음",
                "danger_level": r["danger_level"],
                "recommend_count": 0,
                "witness_count": 0
            })

        result["related"] = related_items

        return jsonify({"success": True, "data": result})

    except Exception as e:
        print(f"[ERROR] /api/missing/<id>: {e}")
        return jsonify({"success": False, "message": "서버 오류"}), 500

@app.route('/missing/<missing_id>')
def missing_detail(missing_id):
    return render_template("user/missing_detail.html", missing_id=missing_id)

@app.route('/missing_report')
def missing_report():
    try:
        return render_template('user/missing_report.html')
    except Exception as e:
        print(f"Error rendering missing_report: {e}")
        return redirect(url_for('index'))

@app.route('/report')
def report_redirect():
    return redirect(url_for('missing_report'))

@app.route('/witness/<int:missing_id>')
def witness_report(missing_id):
    db_witness = None 
    try:
        db_witness = DBManager()
        db_witness.connect()

        selected = db_witness.get_missing_person_by_external_id(str(missing_id))
        
        print(f"DB에서 조회된 실종자 정보: {selected}")

        if not selected:
            flash(f"해당 실종자 (ID: {missing_id})를 찾을 수 없습니다.")
            return redirect(url_for('search'))

        formatted_selected = {
            "nm": selected.get("name", "이름 없음"),
            "ageNow": selected.get("age", 0),
            "sexdstn": selected.get("gender", "알 수 없음"),
            "occrde": selected.get("missing_date", "날짜 미상"),
            "occrAdres": selected.get("missing_location", "").strip() or "미상",
            "features": selected.get("features", "").strip() or "특이사항 없음",
            "SENU": selected.get("external_id")
        }
        
        return render_template('user/missing_witness.html', missing=formatted_selected, missing_id=missing_id)

    except Exception as e:
        print(f"Error rendering witness_report: {e}")
        flash("목격 신고 페이지를 로드하는 중 오류가 발생했습니다.")
        return redirect(url_for('search'))
    finally:
        if db_witness:
            db_witness.disconnect()

@app.route('/pointshop')
def pointshop():
    try:
        return render_template('user/pointshop.html')
    except Exception as e:
        print(f"Error rendering pointshop: {e}")
        return redirect(url_for('index'))

@app.route('/api/login', methods=['POST'])
def api_login():
    try:
        return jsonify({"status": "success", "message": "로그인 성공"})
    except Exception as e:
        print(f"API login error: {e}")
        return jsonify({"status": "error", "message": "로그인 처리 중 오류가 발생했습니다."}), 500

@app.route('/api/register', methods=['POST'])
def api_register():
    try:
        return jsonify({"status": "success", "message": "회원가입 성공"})
    except Exception as e:
        print(f"API register error: {e}")
        return jsonify({"status": "error", "message": "회원가입 처리 중 오류가 발생했습니다."}), 500

@app.route('/api/missing/report', methods=['POST'])
def api_missing_report():
    try:
        return jsonify({"status": "success", "message": "신고 접수 완료"})
    except Exception as e:
        print(f"API missing report error: {e}")
        return jsonify({"status": "error", "message": "신고 처리 중 오류가 발생했습니다."}), 500

# UP 버튼 API 엔드포인트 추가
@app.route('/api/missing/<missing_id>/up', methods=['POST'])
def api_missing_up(missing_id):
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'message': '로그인이 필요합니다.'}), 401
        
        data = request.get_json(force=True, silent=True) or {}
        count = data.get('count', 1)
        
        # 실제 DB 구현 시 사용할 쿼리
        # success = db.increment_missing_up_count(missing_id, user_id)
        
        # 임시 응답
        success = True
        
        if success:
            return jsonify({
                'success': True,
                'message': 'UP 완료',
                'new_count': count
            })
        else:
            return jsonify({
                'success': False,
                'message': 'UP 처리 실패'
            }), 500
            
    except Exception as e:
        app.logger.error(f"UP 처리 오류: {e}")
        return jsonify({'success': False, 'error': 'UP 처리 중 오류가 발생했습니다.'}), 500

@app.route('/api/witness/report', methods=['POST'])
def api_witness_report():
    db_report = None
    saved_urls = []

    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'status': 'error', 'message': '로그인이 필요합니다.'}), 401

        form = request.form
        required_fields = ['witnessDate', 'witnessTime', 'witnessLocation', 'witnessDescription']
        missing_fields = [f for f in required_fields if not form.get(f)]
        if missing_fields:
            return jsonify({'status': 'error', 'message': f'필수 항목 누락: {", ".join(missing_fields)}'}), 400

        try:
            witness_datetime_str = f"{form.get('witnessDate')} {form.get('witnessTime')}"
            witness_datetime = datetime.strptime(witness_datetime_str, '%Y-%m-%d %H:%M')
            if witness_datetime > datetime.now():
                return jsonify({'status': 'error', 'message': '목격 시간은 미래일 수 없습니다.'}), 400
        except ValueError:
            return jsonify({'status': 'error', 'message': '날짜 또는 시간 형식이 잘못되었습니다.'}), 400

        uploaded_files = request.files
        allowed_ext = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
        max_size = 5 * 1024 * 1024

        for key in uploaded_files:
            file = uploaded_files[key]
            if file and file.filename and '.' in file.filename:
                ext = file.filename.rsplit('.', 1)[1].lower()
                if ext not in allowed_ext:
                    return jsonify({'status': 'error', 'message': f'허용되지 않는 확장자: {ext}'}), 400
                file.seek(0, 2)
                if file.tell() > max_size:
                    return jsonify({'status': 'error', 'message': '파일은 5MB를 초과할 수 없습니다.'}), 400
                file.seek(0)
                filename = f"witness_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}.{ext}"
                upload_dir = os.path.join('static', 'uploads')
                os.makedirs(upload_dir, exist_ok=True)
                filepath = os.path.join(upload_dir, filename)
                file.save(filepath)
                saved_urls.append('/' + filepath.replace('\\', '/'))

        missing_person_data = {}
        missing_id = form.get("missing_id")
        if missing_id:
            db_temp = DBManager()
            try:
                db_temp.connect()
                found_person = db_temp.get_missing_person_by_external_id(missing_id)
                if found_person:
                    missing_person_data = {
                        "missing_person_name": found_person.get("name", ""),
                        "missing_person_age": found_person.get("age", 0),
                        "missing_person_gender": "남성" if found_person.get("gender") == 1 else "여성" if found_person.get("gender") == 0 else "미상",
                        "missing_date": found_person.get("missing_date", "2000-01-01").strftime('%Y-%m-%d') if found_person.get("missing_date") else "2000-01-01",
                        "missing_location": found_person.get("missing_location", ""),
                        "missing_features": found_person.get("features", "")
                    }
                else:
                    print(f"DB에서 실종자 ID {missing_id}를 찾을 수 없습니다.")
            except Exception as e:
                print(f"DB에서 실종자 정보 조회 실패: {e}")
            finally:
                db_temp.disconnect()

        final_missing_date = (
            missing_person_data.get("missing_date")
            if missing_person_data.get("missing_date") and missing_person_data.get("missing_date") != "2000-01-01"
            else form.get("missingDate")
        )
        final_missing_location = missing_person_data.get("missing_location") or form.get("missingLocation", "")
        
        report_data = {
            "user_id": user_id,
            "missing_person_name": missing_person_data.get("missing_person_name") or form.get("missingPersonName", ""),
            "missing_person_age": missing_person_data.get("missing_person_age") or int(form.get("missingPersonAge", 0)),
            "missing_person_gender": missing_person_data.get("missing_person_gender") or form.get("missingPersonGender", "남성"),
            
            "missing_date": final_missing_date, 
            "missing_location": final_missing_location, 
            "missing_features": missing_person_data.get("missing_features") or form.get("missingFeatures", ""),

            "witness_datetime": witness_datetime,
            "time_accuracy": form.get("timeAccuracy", "approximate"),
            "location": form.get("witnessLocation"),
            "location_detail": form.get("locationDetail"),
            "location_accuracy": form.get("locationAccuracy", "approximate"),
            "description": form.get("witnessDescription"),
            "confidence": form.get("witnessConfidence", None),
            "distance": form.get("witnessDistance", None),
            "image_urls": json.dumps(saved_urls) if saved_urls else None,
            "status": "pending"
        }
        
        print("missing_date from DB:", missing_person_data.get("missing_date"))
        print("missing_date from form:", form.get("missingDate"))
        print("final missing_date (for DB):", final_missing_date)

        db_report = DBManager()
        db_report.connect()
        report_id = db_report.insert_witness_report(report_data)

        return jsonify({"status": "success", "message": "신고가 저장되었습니다.", "report_id": report_id})

    except Exception as e:
        print("신고 저장 오류:", e)
        for url in saved_urls:
            try:
                path = url[1:] 
                if os.path.exists(path):
                    os.remove(path)
            except Exception as file_e:
                print(f"파일 삭제 오류: {file_e}")
        return jsonify({'status': 'error', 'message': f'신고 저장 실패: {e}'}), 500
    finally:
        if db_report:
            db_report.disconnect()

@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': '2024-01-01T00:00:00',
        'version': '1.0.0'
    })

@app.route('/test/templates')
def test_templates():
    if not app.debug:
        return "Not Found", 404
    
    template_files = [
        'public/index.html',
        'public/about.html', 
        'public/missing_search.html',
        'public/ranking.html',
        'auth/login.html',
        'auth/register.html',
        'auth/find_account.html',
        'user/mypage.html',
        'user/missing_detail.html',
        'user/missing_report.html',
        'user/missing_witness.html',
        'user/pointshop.html'
    ]
    
    results = {}
    for template in template_files:
        try:
            render_template(template)
            results[template] = "✅ OK"
        except Exception as e:
            results[template] = f"❌ Error: {str(e)}"
    
    html = "<h1>템플릿 파일 상태</h1><ul>"
    for template, status in results.items():
        html += f"<li><strong>{template}</strong>: {status}</li>"
    html += "</ul>"
    
    return html

@app.errorhandler(404)
def page_not_found(error):
    return redirect(url_for('index'))

@app.errorhandler(500)
def internal_server_error(error):
    print(f"Internal server error: {error}")
    return redirect(url_for('index'))

@app.errorhandler(Exception)
def handle_exception(error):
    print(f"Unhandled exception: {error}")
    return redirect(url_for('index'))

@app.route('/admin/witness/approve', methods=['POST'])
def approve_witness_report():
    try:
        data = request.json
        report_id = data.get('report_id')
        user_id = data.get('user_id')

        db_admin = DBManager()
        db_admin.connect()

        db_admin.execute_query("UPDATE witness_reports SET is_approved = 1 WHERE id = %s", (report_id,))

        ranking_service_admin = RankingService(db_admin)
        ranking_service_admin.award_points_for_report(user_id)

        db_admin.disconnect()

        return jsonify({'status': 'success', 'message': '신고가 승인되었습니다.'})
    except Exception as e:
        print(f"승인 처리 오류: {e}")
        return jsonify({'status': 'error', 'message': '승인 처리 중 오류가 발생했습니다.'}), 500

scheduler = BackgroundScheduler()
scheduler.add_job(sync_missing_api_data, 'interval', hours=1)
sync_missing_api_data()
scheduler.start()
atexit.register(lambda: scheduler.shutdown())

if __name__ == '__main__':
    is_docker = os.getenv('IS_DOCKER', 'false').lower() == 'true'
    port = int(os.getenv('PORT', 5004))
    
    if is_docker:
        app.run(debug=False, host='0.0.0.0', port=port)
    else:
        app.run(debug=True, host='0.0.0.0', port=port, use_reloader=False)