# /home/livon/projects/songil/app.py
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


db = DBManager()
db.connect()
ranking_service = RankingService(db)
app = Flask(__name__)
app.secret_key = 'songil_secret_key_2024'

# ==================== PUBLIC 페이지 (비로그인도 접근 가능) ====================

API_URL = "https://www.safetydata.go.kr/V2/api/DSSP-IF-20597"
SERVICE_KEY = "3FQG91W954658S1F"

# 메인 페이지
@app.route('/')
def index():
    try:
        return render_template('public/index.html')
    except Exception as e:
        print(f"Error rendering index: {e}")
        return "페이지를 불러오는 중 오류가 발생했습니다.", 500
    
# 순위 페이지 (기본)
@app.route('/ranking')
def ranking():
    try:
        user_id = session.get('user_id')
        rankings = ranking_service.get_rankings(limit=1000)  # 최대 100위까지 받아온다고 가정
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
    
# 랭킹 API
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

# 랭킹 페이지 렌더링
@app.route('/api/rankings/user/<int:user_id>', methods=['GET'])
def get_user_ranking(user_id):
    """특정 사용자의 순위 정보"""
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
        
        
# 랭킹 통계 API
@app.route('/api/rankings/stats', methods=['GET'])
def get_ranking_stats():
    """랭킹 통계 정보"""
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


# 최근 실종자 목록 API
@app.route('/api/missing/recent')
def get_recent_missing():
    try:
        limit = request.args.get('limit', 5, type=int)

        response = requests.get("https://www.safetydata.go.kr/V2/api/DSSP-IF-20597", params={
            "serviceKey": "3FQG91W954658S1F",
            "returnType": "json",
            "pageNo": "1",
            "numOfRows": "500" 
        }, verify=False)

        data = response.json()
        items = data.get("body", [])

        parsed_items = []
        for item in items:
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
                "sort_date": occr_date  # 정렬용 내부 필드
            })

        # 테스트가 포함된 항목 필터링
        filtered_items = [item for item in parsed_items if "테스트" not in item["name"]]
        

        # 최신 날짜순 정렬
        sorted_items = sorted(filtered_items, key=lambda x: x["sort_date"], reverse=True)

        # 상위 limit개만 반환
        final_list = sorted_items[:limit]

        return jsonify({"success": True, "results": final_list})

    except Exception as e:
        print("❌ 실종자 API 로딩 실패:", e)
        return jsonify({"success": False, "error": str(e)}), 500

# 사이트 소개
@app.route('/about')
def about():
    try:
        return render_template('public/about.html')
    except Exception as e:
        print(f"Error rendering about: {e}")
        return redirect(url_for('index'))

#  실종자 조회 페이지 렌더링
@app.route('/search')
def search():
    try:
        return render_template('public/missing_search.html')
    except Exception as e:
        print(f"Error rendering search: {e}")
        return redirect(url_for('index'))

# 실종자 검색 API
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

            # 여기서 JSON 응답의 키 이름을 프론트엔드에서 기대하는 이름으로 변경합니다.
            parsed_items.append({
                "id": record['external_id'],
                "name": record['name'],
                "age": record['age'] if record['age'] is not None else "?",
                "gender": gender_display,
                "date": record['missing_date'].strftime("%Y.%m.%d") if record['missing_date'] else "날짜 미상",
                "location": record['missing_location'] if record['missing_location'] else "미상",
                "description": record['features'] if record['features'] else "정보 없음", # <-- 'clothing' 대신 'description'으로 변경
                "image": record['image_url'] if record['image_url'] else "/static/images/placeholder.jpg",
                "dangerLevel": record['danger_level'], # <-- 'danger_level' 대신 'dangerLevel' (카멜케이스)로 변경
                "upCount": 0,
            })

        return jsonify({"success": True, "results": parsed_items, "total": len(parsed_items)})

    except Exception as e:
        print(f"[ERROR] /api/missing/search: {e}")
        return jsonify({"success": False, "message": "서버 오류 발생", "error": str(e)}), 500

    
    
# ==================== AUTH 페이지 (인증 관련) ====================

# 로그인 페이지
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('auth/login.html')

    email = request.form['email']
    password = request.form['password']

    db = DBManager()
    db.connect()
    user = db.get_user_by_email(email)
    db.disconnect()

    if not user:
        flash("존재하지 않는 이메일입니다.")
        return redirect(url_for('login'))

    if check_password_hash(user['password_hash'], password):
        session['user_id'] = user['id']
        session['email'] = user['email']
        session['nickname'] = user['nickname']
        flash("로그인 성공!")
        return redirect(url_for('index'))
    else:
        flash("이메일 또는 비밀번호가 잘못되었습니다.")
        return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.clear()
    flash("로그아웃 되었습니다.")
    return redirect(url_for('index'))
    


# 회원가입 페이지
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



# 아이디/비밀번호 찾기 페이지
@app.route('/find_account', methods=['GET'])
def find_account():
    try:
        return render_template('auth/find_account.html')
    except Exception as e:
        print(f"Error rendering find_account: {e}")
        return redirect(url_for('index'))

# 아이디 찾기 API
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

# 비밀번호 찾기 API  
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

        # 인증코드 생성
        code = str(random.randint(100000, 999999))
        session['reset_code'] = code
        session['reset_email'] = email

        print(f"[DEBUG] 인증코드: {code} (테스트용 콘솔출력)")

        # TODO: 이메일로 코드 전송 기능 추가 예정

        return jsonify({'success': True, 'message': '인증코드가 발송되었습니다.'})

    except Exception as e:
        import traceback
        print(f"[ERROR] /api/send_reset_code: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': '서버 오류 발생'}), 500
    
# 비밀번호 재설정 페이지
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

# 비밀번호 재설정 API  
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




# ==================== USER 페이지 (로그인 필요) ====================

# 마이페이지
@app.route('/mypage')
def mypage():
    try:
        # TODO: 로그인 체크 로직 추가
        return render_template('user/mypage.html')
    except Exception as e:
        print(f"Error rendering mypage: {e}")
        return redirect(url_for('index'))

# 알림 페이지
@app.route('/notifications')
def notifications():
    try:
        # TODO: 로그인 체크 로직 추가
        return render_template('user/notifications.html')
    except Exception as e:
        print(f"Error rendering notifications: {e}")
        return redirect(url_for('index'))

# 실종자 상세 페이지
@app.route('/api/missing/<missing_id>', methods=['GET'])
def api_missing_detail(missing_id):
    try:
        # 실종자 기본 정보
        query = """
            SELECT external_id, name, age, gender, missing_date,
                missing_location, features, image_url, danger_level
            FROM api_missing_data
            WHERE external_id = %s AND status = 'active'
        """
        result = db.execute(query, (missing_id,)).fetchone()

        if not result:
            return jsonify({"success": False, "message": "해당 실종자를 찾을 수 없습니다."}), 404
    
        # 관련 실종자 추천
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

        # 추천 데이터 가공
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


# 실종자 상세 페이지 렌더링
@app.route('/missing/<missing_id>')
def missing_detail(missing_id):
    return render_template("user/missing_detail.html", missing_id=missing_id)

# 실종자 신고 페이지
@app.route('/missing_report')
def missing_report():
    try:
        # TODO: 로그인 체크 로직 추가
        return render_template('user/missing_report.html')
    except Exception as e:
        print(f"Error rendering missing_report: {e}")
        return redirect(url_for('index'))

# 기존 라우트도 유지 (하위 호환성)
@app.route('/report')
def report_redirect():
    return redirect(url_for('missing_report'))

# 목격 신고 페이지
@app.route('/witness/<int:missing_id>')
def witness_report(missing_id):
    db = None 
    try:
        db = DBManager()
        db.connect()

        selected = db.get_missing_person_by_external_id(str(missing_id))
        
        # 로그 추가: DB 조회 결과 확인
        print(f"DB에서 조회된 실종자 정보: {selected}")

        if not selected:
            flash(f"해당 실종자 (ID: {missing_id})를 찾을 수 없습니다.")
            return redirect(url_for('search'))

        formatted_selected = {
            "nm": selected.get("name", "이름 없음"),
            "ageNow": selected.get("age", 0), # 숫자로 변환 필요할 수 있음
            "sexdstn": selected.get("gender", "알 수 없음"),
            "occrde": selected.get("missing_date", "날짜 미상"), # "YYYYMMDD" 형식으로 가정
            "occrAdres": selected.get("location", "미상"),
            "SENU": selected.get("id") # DB의 고유 ID를 SENU로 매핑 (필터링 위함)
        }


        return render_template('user/missing_witness.html', missing=formatted_selected, missing_id=missing_id)

    except Exception as e:
        print(f"Error rendering witness_report: {e}")
        flash("목격 신고 페이지를 로드하는 중 오류가 발생했습니다.")
        return redirect(url_for('search'))
    finally:
        if db:
            db.disconnect()

# 포인트샵 페이지
@app.route('/pointshop')
def pointshop():
    try:
        # TODO: 로그인 체크 로직 추가
        return render_template('user/pointshop.html')
    except Exception as e:
        print(f"Error rendering pointshop: {e}")
        return redirect(url_for('index'))

# 상세 순위 페이지
@app.route('/ranking/detail')
def ranking_detail():
    try:
        # TODO: 로그인 체크 로직 추가
        return render_template('user/ranking_detail.html')
    except Exception as e:
        print(f"Error rendering ranking_detail: {e}")
        return redirect(url_for('ranking'))

# ==================== API 엔드포인트 (추후 백엔드 구현시 사용) ====================

# 로그인 처리 API
@app.route('/api/login', methods=['POST'])
def api_login():
    try:
        # TODO: 로그인 로직 구현
        return jsonify({"status": "success", "message": "로그인 성공"})
    except Exception as e:
        print(f"API login error: {e}")
        return jsonify({"status": "error", "message": "로그인 처리 중 오류가 발생했습니다."}), 500

# 회원가입 처리 API  
@app.route('/api/register', methods=['POST'])
def api_register():
    try:
        # TODO: 회원가입 로직 구현
        return jsonify({"status": "success", "message": "회원가입 성공"})
    except Exception as e:
        print(f"API register error: {e}")
        return jsonify({"status": "error", "message": "회원가입 처리 중 오류가 발생했습니다."}), 500

# 실종자 신고 API
@app.route('/api/missing/report', methods=['POST'])
def api_missing_report():
    try:
        # TODO: 실종자 신고 로직 구현
        return jsonify({"status": "success", "message": "신고 접수 완료"})
    except Exception as e:
        print(f"API missing report error: {e}")
        return jsonify({"status": "error", "message": "신고 처리 중 오류가 발생했습니다."}), 500

# 목격 신고 API
@app.route('/api/witness/report', methods=['POST'])
def api_witness_report():
    db = None
    saved_urls = [] # 오류 발생 시 파일 삭제를 위해 saved_urls를 미리 정의

    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'status': 'error', 'message': '로그인이 필요합니다.'}), 401

        form = request.form
        required_fields = ['witnessDate', 'witnessTime', 'witnessLocation', 'witnessDescription']
        missing_fields = [f for f in required_fields if not form.get(f)]
        if missing_fields:
            return jsonify({'status': 'error', 'message': f'필수 항목 누락: {", ".join(missing_fields)}'}), 400

        # 날짜/시간 처리
        try:
            witness_datetime_str = f"{form.get('witnessDate')} {form.get('witnessTime')}"
            witness_datetime = datetime.strptime(witness_datetime_str, '%Y-%m-%d %H:%M')
            if witness_datetime > datetime.now():
                return jsonify({'status': 'error', 'message': '목격 시간은 미래일 수 없습니다.'}), 400
        except ValueError:
            return jsonify({'status': 'error', 'message': '날짜 또는 시간 형식이 잘못되었습니다.'}), 400

        # 파일 처리 (이 부분은 변경 없음)
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

        # 실종자 기본정보 DB에서 조회 (API 호출 대신)
        missing_person_data = {}
        missing_id = form.get("missing_id") # 이 missing_id는 external_id에 해당
        if missing_id:
            db_temp = DBManager() # 임시 DBManager 인스턴스 (아래 db 변수와 분리)
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

        # missing_date 로직 수정: API/DB에서 2000-01-01이 오면 폼 데이터 사용
        final_missing_date = (
            missing_person_data.get("missing_date")
            if missing_person_data.get("missing_date") and missing_person_data.get("missing_date") != "2000-01-01"
            else form.get("missingDate")
        )
        final_missing_location = missing_person_data.get("missing_location") or form.get("missingLocation", "")
        
        # 신고 데이터 구성
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
            "image_urls": json.dumps(saved_urls) if saved_urls else None, # JSON 형태로 저장
            "status": "pending"
        }
        
        print("missing_date from DB:", missing_person_data.get("missing_date"))
        print("missing_date from form:", form.get("missingDate"))
        print("final missing_date (for DB):", final_missing_date)

        # DB 저장 (새로운 witness_reports 테이블에 저장)
        db = DBManager()
        db.connect()
        report_id = db.insert_witness_report(report_data)

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
        if db:
            db.disconnect()

# 헬스체크 엔드포인트
@app.route('/health')
def health_check():
    """서버 상태 확인"""
    return jsonify({
        'status': 'healthy',
        'timestamp': '2024-01-01T00:00:00',
        'version': '1.0.0'
    })

# ==================== 템플릿 테스트 라우트 (개발용) ====================

@app.route('/test/templates')
def test_templates():
    """템플릿 파일 존재 여부를 확인하는 개발용 라우트"""
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
        'user/notifications.html',
        'user/missing_detail.html',
        'user/missing_report.html',
        'user/missing_witness.html',
        'user/pointshop.html',
        'user/ranking_detail.html'
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

# ==================== 에러 핸들러 ====================

@app.errorhandler(404)
def page_not_found(error):
    """404 에러 처리 - 홈페이지로 리다이렉트"""
    return redirect(url_for('index'))

@app.errorhandler(500)
def internal_server_error(error):
    """500 에러 처리 - 홈페이지로 리다이렉트"""
    print(f"Internal server error: {error}")
    return redirect(url_for('index'))

@app.errorhandler(Exception)
def handle_exception(error):
    """모든 예외 처리"""
    print(f"Unhandled exception: {error}")
    return redirect(url_for('index'))



# ==================== 관리자 ==================== ( 추후예정 )
@app.route('/admin/witness/approve', methods=['POST'])
def approve_witness_report():
    try:
        data = request.json
        report_id = data.get('report_id')
        user_id = data.get('user_id')

        db = DBManager()
        db.connect()

        # 승인 처리
        db.execute_query("UPDATE witness_reports SET is_approved = 1 WHERE id = %s", (report_id,))

        # 포인트 지급
        ranking_service = RankingService(db)
        ranking_service.award_points_for_report(user_id)

        db.disconnect()

        return jsonify({'status': 'success', 'message': '신고가 승인되었습니다.'})
    except Exception as e:
        print(f"승인 처리 오류: {e}")
        return jsonify({'status': 'error', 'message': '승인 처리 중 오류가 발생했습니다.'}), 500




scheduler = BackgroundScheduler()
scheduler.add_job(sync_missing_api_data, 'interval', hours=1)
sync_missing_api_data()
scheduler.start()
atexit.register(lambda: scheduler.shutdown())

# ==================== 개발 설정 ====================

if __name__ == '__main__':
    # Docker 환경 체크
    is_docker = os.getenv('IS_DOCKER', 'false').lower() == 'true'
    port = int(os.getenv('PORT', 5004))
    
    if is_docker:
        # Docker 환경에서는 모든 인터페이스에서 접근 가능하도록 설정
        app.run(debug=False, host='0.0.0.0', port=port)
    else:
        # 로컬 개발 환경
        app.run(debug=True, host='0.0.0.0', port=port, use_reloader=False)