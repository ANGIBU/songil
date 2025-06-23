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
        rank_info = None

        if user_id:
            # 사용자 순위 정보 가져오기 (API가 아니라 내부 서비스 호출)
            rank_info = ranking_service.get_user_ranking(user_id)
            print("🔍 get_user_ranking 결과:", rank_info)

        return render_template('public/ranking.html', rank_info=rank_info)

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

#  실종자 검색 API
@app.route('/api/missing/search', methods=['POST'])
def api_missing_search():
    params = {
        "serviceKey": '3FQG91W954658S1F',
        "returnType": "json",
        "pageNo": "1",
        "numOfRows": "500"
    }

    try:
        response = requests.get(API_URL, params=params, verify=False)
        data = response.json()
        items = data.get("body", [])

        # 클라이언트가 보낸 키워드
        data_from_client = request.get_json(force=True, silent=True) or {}
        keyword = data_from_client.get("keyword", "").lower()

        # 키워드 필터링
        if keyword:
            items = [item for item in items if keyword in str(item).lower()]

        return jsonify({"success": True, "results": items, "total": len(items)})

    except Exception as e:
        print(f"[ERROR] /api/missing/search: {e}")
        return jsonify({"success": False, "message": "서버 오류 발생"}), 500
    
    
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
        params = {
            "serviceKey": "3FQG91W954658S1F",
            "returnType": "json",
            "pageNo": "1",
            "numOfRows": "500"
        }

        response = requests.get(API_URL, params=params, verify=False)
        data = response.json()
        items = data.get("body", [])

        selected = next((item for item in items if str(item.get("SENU")) == str(missing_id)), None)

        if not selected:
            return jsonify({"success": False, "message": "해당 실종자를 찾을 수 없음"}), 404

        selected_gender = selected.get("GNDR_SE")
        selected_age = int(selected.get("NOW_AGE", -1)) if selected.get("NOW_AGE") else -1

        related = []
        for item in items:
            if item == selected:
                continue
            age = int(item.get("NOW_AGE", -1)) if item.get("NOW_AGE") else -1
            if item.get("GNDR_SE") == selected_gender and age != -1 and selected_age != -1 and abs(age - selected_age) <= 3:
                related.append({
                    "id": item.get("SENU"),
                    "name": item.get("FLNM", "이름없음"),
                    "age": age,
                    "gender": item.get("GNDR_SE"),
                    "main_image": item.get("PHOTO_SZ"),
                    "location": item.get("OCRN_PLC"),
                    "missing_date": item.get("OCRN_DT"),
                    "danger_level": "관심",  
                    "recommend_count": 0,  
                    "witness_count": 0     
                })

        # 최대 3개만 추출
        selected["related"] = related[:3]

        return jsonify({"success": True, "data": selected})

    except Exception as e:
        print(f"상세 API 오류: {e}")
        return jsonify({"success": False, "message": "서버 오류"}), 500

# 실종자 상세 페이지 렌더링
@app.route('/missing/<int:missing_id>')
def missing_detail(missing_id):
    try:
        params = {
            "serviceKey": "3FQG91W954658S1F",
            "returnType": "json",
            "pageNo": "1",
            "numOfRows": "500"
        }

        response = requests.get(API_URL, params=params, verify=False)
        data = response.json()
        items = data.get("body", [])

        selected = next((item for item in items if str(item.get("SENU")) == str(missing_id)), None)

        if not selected:
            flash("해당 실종자를 찾을 수 없습니다.")
            return redirect(url_for('search'))

        # 관련 실종자 정보도 추가
        selected_gender = selected.get("GNDR_SE")
        selected_age = int(selected.get("NOW_AGE", -1)) if selected.get("NOW_AGE") else -1

        related = []
        for item in items:
            if item == selected:
                continue
            age = int(item.get("NOW_AGE", -1)) if item.get("NOW_AGE") else -1
            if item.get("GNDR_SE") == selected_gender and age != -1 and selected_age != -1 and abs(age - selected_age) <= 3:
                related.append(item)

        selected["related"] = related[:3]

        return render_template("user/missing_detail.html", missing_id=missing_id, missing=selected)

    except Exception as e:
        print(f"Error rendering missing_detail: {e}")
        return redirect(url_for('search'))

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
    try:
        # Safe API 호출
        params = {
            "serviceKey": "3FQG91W954658S1F",
            "returnType": "json",
            "pageNo": "1",
            "numOfRows": "500"
        }
        response = requests.get(API_URL, params=params, verify=False)
        data = response.json()
        items = data.get("body", [])

        selected = next((item for item in items if str(item.get("SENU")) == str(missing_id)), None)

        if not selected:
            flash("해당 실종자를 찾을 수 없습니다.")
            return redirect(url_for('search'))

        return render_template('user/missing_witness.html', missing=selected, missing_id=missing_id)

    except Exception as e:
        print(f"Error rendering witness_report: {e}")
        return redirect(url_for('search'))

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
    try:
        # 로그인 사용자 정보 가져오기
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'status': 'error', 'message': '로그인이 필요합니다.'}), 401

        form = request.form

        # 날짜 + 시간 결합
        witness_datetime = f"{form.get('witnessDate')} {form.get('witnessTime')}"

        witness_lat = form.get("witnessLat")
        witness_lng = form.get("witnessLng")
        user_lat = form.get("userLat")
        user_lng = form.get("userLng")

        # 파일 업로드 처리 (image_urls는 문자열로 저장)
        uploaded_files = request.files
        saved_urls = []
        for key in uploaded_files:
            file = uploaded_files[key]
            if file and file.filename:
                filename = f"witness_{uuid.uuid4().hex}_{file.filename}"
                filepath = os.path.join('static', 'uploads', filename)
                file.save(filepath)
                saved_urls.append('/' + filepath.replace('\\', '/'))

        # DB에 저장
        db = DBManager()
        db.connect()
        db.insert_witness_report({
            "user_id": user_id,
            "missing_id": form.get("missing_id"),
            "witness_datetime": witness_datetime,
            "time_accuracy": form.get("timeAccuracy"),
            "location": form.get("witnessLocation"),
            "location_detail": form.get("locationDetail"),
            "location_accuracy": form.get("locationAccuracy"),
            "description": form.get("witnessDescription"),
            "confidence": form.get("witnessConfidence"),
            "distance": form.get("witnessDistance"),
            "image_urls": ','.join(saved_urls),
            "witness_name": form.get("witnessName"),
            "witness_phone": form.get("witnessPhone"),
            "agree_contact": int(bool(form.get("agreeContact"))),
             "witness_lat": witness_lat,
            "witness_lng": witness_lng,
            "user_lat": user_lat,
            "user_lng": user_lng
        })
        db.disconnect()

        return jsonify({"status": "success", "message": "신고가 저장되었습니다."})

    except Exception as e:
        print(f"API witness report error: {e}")
        return jsonify({'status': 'error', 'message': '저장 중 오류가 발생했습니다.'}), 500

# UP 버튼 클릭 API
@app.route('/api/missing/<int:missing_id>/up', methods=['POST'])
def api_missing_up(missing_id):
    try:
        # TODO: UP 카운트 증가 로직 구현
        return jsonify({"status": "success", "message": "UP 완료", "new_count": 0})
    except Exception as e:
        print(f"API missing up error: {e}")
        return jsonify({"status": "error", "message": "처리 중 오류가 발생했습니다."}), 500

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
        app.run(debug=True, host='0.0.0.0', port=port)