# app.py
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import os

app = Flask(__name__)
app.secret_key = 'your-secret-key-here-change-in-production'

# ==================== PUBLIC 페이지 (비로그인도 접근 가능) ====================

# 메인 페이지
@app.route('/')
def index():
    try:
        return render_template('public/index.html')
    except Exception as e:
        print(f"Error rendering index: {e}")
        return "페이지를 불러오는 중 오류가 발생했습니다.", 500

# 사이트 소개
@app.route('/about')
def about():
    try:
        return render_template('public/about.html')
    except Exception as e:
        print(f"Error rendering about: {e}")
        return redirect(url_for('index'))

# 실종자 조회 (공개)
@app.route('/search')
def search():
    try:
        return render_template('public/missing_search.html')
    except Exception as e:
        print(f"Error rendering search: {e}")
        return redirect(url_for('index'))

# 순위 페이지 (기본)
@app.route('/ranking')
def ranking():
    try:
        return render_template('public/ranking.html')
    except Exception as e:
        print(f"Error rendering ranking: {e}")
        return redirect(url_for('index'))

# ==================== AUTH 페이지 (인증 관련) ====================

# 로그인 페이지
@app.route('/login')
def login():
    try:
        return render_template('auth/login.html')
    except Exception as e:
        print(f"Error rendering login: {e}")
        return redirect(url_for('index'))

# 회원가입 페이지
@app.route('/register')
def register():
    try:
        return render_template('auth/register.html')
    except Exception as e:
        print(f"Error rendering register: {e}")
        return redirect(url_for('index'))

# 아이디/비밀번호 찾기
@app.route('/find_account')
def find_account():
    try:
        return render_template('auth/find_account.html')
    except Exception as e:
        print(f"Error rendering find_account: {e}")
        return redirect(url_for('index'))

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
@app.route('/missing/<int:missing_id>')
def missing_detail(missing_id):
    try:
        # TODO: 로그인 체크 로직 추가
        # TODO: missing_id 유효성 검사
        return render_template('user/missing_detail.html', missing_id=missing_id)
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
        # TODO: 로그인 체크 로직 추가
        # TODO: missing_id 유효성 검사
        return render_template('user/missing_witness.html', missing_id=missing_id)
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
        # TODO: 목격 신고 로직 구현
        return jsonify({"status": "success", "message": "목격 신고 접수 완료"})
    except Exception as e:
        print(f"API witness report error: {e}")
        return jsonify({"status": "error", "message": "목격 신고 처리 중 오류가 발생했습니다."}), 500

# UP 버튼 클릭 API
@app.route('/api/missing/<int:missing_id>/up', methods=['POST'])
def api_missing_up(missing_id):
    try:
        # TODO: UP 카운트 증가 로직 구현
        return jsonify({"status": "success", "message": "UP 완료", "new_count": 0})
    except Exception as e:
        print(f"API missing up error: {e}")
        return jsonify({"status": "error", "message": "처리 중 오류가 발생했습니다."}), 500

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

# ==================== 개발 설정 ====================

if __name__ == '__main__':
    # Docker 환경 체크
    is_docker = os.getenv('IS_DOCKER', 'false').lower() == 'true'
    port = 5004
    
    if is_docker:
        # Docker 환경에서는 모든 인터페이스에서 접근 가능하도록 설정
        app.run(debug=False, host='0.0.0.0', port=port)
    else:
        # 로컬 개발 환경
        app.run(debug=True, host='0.0.0.0', port=port)