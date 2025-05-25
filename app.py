# app.py
from flask import Flask, render_template, request, redirect, url_for, session
import os

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'

# ==================== PUBLIC 페이지 (비로그인도 접근 가능) ====================

# 메인 페이지
@app.route('/')
def index():
    return render_template('public/index.html')

# 사이트 소개
@app.route('/about')
def about():
    return render_template('public/about.html')

# 실종자 조회 (공개)
@app.route('/search')
def search():
    return render_template('public/missing_search.html')

# 순위 페이지 (기본)
@app.route('/ranking')
def ranking():
    return render_template('public/ranking.html')

# ==================== AUTH 페이지 (인증 관련) ====================

# 로그인 페이지
@app.route('/login')
def login():
    return render_template('auth/login.html')

# 회원가입 페이지
@app.route('/register')
def register():
    return render_template('auth/register.html')

# 아이디/비밀번호 찾기
@app.route('/find_account')
def find_account():
    return render_template('auth/find_account.html')

# 로그아웃 처리
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

# ==================== USER 페이지 (로그인 필요) ====================

# 마이페이지
@app.route('/mypage')
def mypage():
    # TODO: 로그인 체크 로직 추가
    return render_template('user/mypage.html')

# 알림 페이지
@app.route('/notifications')
def notifications():
    # TODO: 로그인 체크 로직 추가
    return render_template('user/notifications.html')

# 실종자 상세 페이지 (로그인 필요)
@app.route('/missing/<int:missing_id>')
def missing_detail(missing_id):
    # TODO: 로그인 체크 로직 추가
    return render_template('user/missing_detail.html', missing_id=missing_id)

# 실종자 신고 페이지
@app.route('/report')
def missing_report():
    # TODO: 로그인 체크 로직 추가
    return render_template('user/missing_report.html')

# 목격 신고 페이지
@app.route('/witness/<int:missing_id>')
def witness_report(missing_id):
    # TODO: 로그인 체크 로직 추가
    return render_template('user/missing_witness.html', missing_id=missing_id)

# 포인트샵 페이지
@app.route('/pointshop')
def pointshop():
    # TODO: 로그인 체크 로직 추가
    return render_template('user/pointshop.html')

# 상세 순위 페이지
@app.route('/ranking/detail')
def ranking_detail():
    # TODO: 로그인 체크 로직 추가
    return render_template('user/ranking_detail.html')

# ==================== ADMIN 페이지 (관리자 권한 필요) ====================

# 관리자 대시보드
@app.route('/admin')
@app.route('/admin/dashboard')
def admin_dashboard():
    # TODO: 관리자 권한 체크 로직 추가
    return render_template('admin/dashboard.html')

# 실종자 관리
@app.route('/admin/missing')
def admin_missing():
    # TODO: 관리자 권한 체크 로직 추가
    return render_template('admin/missing_manage.html')

# 사용자 관리
@app.route('/admin/users')
def admin_users():
    # TODO: 관리자 권한 체크 로직 추가
    return render_template('admin/user_manage.html')

# 목격신고 관리
@app.route('/admin/witness')
def admin_witness():
    # TODO: 관리자 권한 체크 로직 추가
    return render_template('admin/witness_manage.html')

# 통계 페이지
@app.route('/admin/statistics')
def admin_statistics():
    # TODO: 관리자 권한 체크 로직 추가
    return render_template('admin/statistics.html')

# ==================== API 엔드포인트 (추후 백엔드 구현시 사용) ====================

# 로그인 처리 API
@app.route('/api/login', methods=['POST'])
def api_login():
    # TODO: 로그인 로직 구현
    return {"status": "success", "message": "로그인 성공"}

# 회원가입 처리 API  
@app.route('/api/register', methods=['POST'])
def api_register():
    # TODO: 회원가입 로직 구현
    return {"status": "success", "message": "회원가입 성공"}

# 실종자 신고 API
@app.route('/api/missing/report', methods=['POST'])
def api_missing_report():
    # TODO: 실종자 신고 로직 구현
    return {"status": "success", "message": "신고 접수 완료"}

# 목격 신고 API
@app.route('/api/witness/report', methods=['POST'])
def api_witness_report():
    # TODO: 목격 신고 로직 구현
    return {"status": "success", "message": "목격 신고 접수 완료"}

# ==================== 에러 핸들러 ====================

@app.errorhandler(404)
def page_not_found(error):
    return render_template('public/index.html'), 404

@app.errorhandler(500)
def internal_server_error(error):
    return render_template('public/index.html'), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)