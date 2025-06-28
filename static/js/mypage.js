// static/js/mypage.js

// React 및 상태 관리
const { useState, useEffect, createElement } = React;

// 마이페이지 상태 관리
let mypageState = {
    userProfile: {
        id: null,
        name: '사용자',
        email: 'user@example.com',
        phone: '010-1234-5678',
        points: 1250,
        rank: 47,
        joinDate: '2024.05.01',
        badges: ['신규회원', '활동적 신고자', '목격 도우미'],
        stats: {
            reports: 3,
            witnesses: 12,
            witnessApprovalRate: 83,
            monthlyReports: 1,
            monthlyWitnesses: 5,
            monthlyPointsEarned: 750,
            monthlyPointsUsed: 500
        }
    },
    activityHistory: [],
    isLoading: false,
    errors: {}
};

document.addEventListener('DOMContentLoaded', function() {
    initializeMyPage();
});

// 마이페이지 초기화
function initializeMyPage() {
    loadUserData();
    setupEventListeners();
    initializeAnimations();
    updateUI();
}

// 사용자 데이터 로드
async function loadUserData() {
    try {
        mypageState.isLoading = true;
        updateLoadingState();
        
        // 사용자 기본 정보 로드
        const userResponse = await fetch('/api/user/profile', {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (userResponse.ok) {
            const userData = await userResponse.json();
            if (userData.success) {
                mypageState.userProfile = { ...mypageState.userProfile, ...userData.data };
            }
        }
        
        // 활동 내역 로드
        await loadActivityHistory();
        
    } catch (error) {
        handleError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
        mypageState.isLoading = false;
        updateLoadingState();
        updateUI();
    }
}

// 활동 내역 로드
async function loadActivityHistory() {
    try {
        const response = await fetch('/api/user/activity-history?limit=20');
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                mypageState.activityHistory = data.activities || getDummyActivityData();
            }
        } else {
            mypageState.activityHistory = getDummyActivityData();
        }
    } catch (error) {
        mypageState.activityHistory = getDummyActivityData();
    }
}

// 더미 활동 데이터
function getDummyActivityData() {
    return [
        {
            id: 1,
            type: 'witness_approved',
            title: '목격 신고 승인',
            description: '강남구 김○○님 목격 신고가 승인되어 150P를 받았습니다.',
            points: 150,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 2,
            type: 'witness_submitted',
            title: '목격 신고 제출',
            description: '서초구 박○○님에 대한 목격 정보를 신고했습니다.',
            points: 0,
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
        },
        {
            id: 3,
            type: 'shop_purchase',
            title: '포인트샵 구매',
            description: '스타벅스 아메리카노를 구매했습니다.',
            points: -500,
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        }
    ];
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 키보드 단축키
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // 모달 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('profileEditModal');
        if (modal && modal.classList.contains('show') && e.target === modal.querySelector('.modal-overlay')) {
            closeProfileEditModal();
        }
    });
}

// 키보드 단축키 처리
function handleKeyboardShortcuts(event) {
    // ESC: 모든 모달 닫기
    if (event.key === 'Escape') {
        closeProfileEditModal();
    }
    
    // Ctrl + E: 프로필 수정 모달 열기
    if (event.ctrlKey && event.key === 'e') {
        event.preventDefault();
        openProfileEditModal();
    }
}

// 프로필 수정 모달 열기
function openProfileEditModal() {
    const modal = document.getElementById('profileEditModal');
    if (!modal) return;
    
    // 현재 사용자 정보로 폼 채우기
    const form = document.getElementById('profileEditForm');
    if (form) {
        const nicknameInput = form.querySelector('#newNickname');
        const emailInput = form.querySelector('#userEmail');
        const phoneInput = form.querySelector('#userPhone');
        
        if (nicknameInput) nicknameInput.value = mypageState.userProfile.name;
        if (emailInput) emailInput.value = mypageState.userProfile.email;
        if (phoneInput) phoneInput.value = mypageState.userProfile.phone;
    }
    
    modal.classList.add('show');
    
    // GSAP 애니메이션
    if (typeof gsap !== 'undefined') {
        const content = modal.querySelector('.modal-content');
        gsap.fromTo(content, 
            {
                scale: 0.8,
                opacity: 0,
                y: 50
            },
            {
                duration: 0.4,
                scale: 1,
                opacity: 1,
                y: 0,
                ease: 'back.out(1.7)'
            }
        );
    }
    
    // 포커스 설정
    setTimeout(() => {
        const firstInput = form.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 100);
}

// 프로필 수정 모달 닫기
function closeProfileEditModal() {
    const modal = document.getElementById('profileEditModal');
    if (!modal) return;
    
    // GSAP 애니메이션
    if (typeof gsap !== 'undefined') {
        const content = modal.querySelector('.modal-content');
        gsap.to(content, {
            duration: 0.3,
            scale: 0.8,
            opacity: 0,
            y: 50,
            ease: 'power2.in',
            onComplete: () => {
                modal.classList.remove('show');
            }
        });
    } else {
        modal.classList.remove('show');
    }
}

// 프로필 수정 처리
async function handleProfileEdit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // 유효성 검사
    const nickname = formData.get('newNickname').trim();
    const email = formData.get('userEmail').trim();
    const phone = formData.get('userPhone').trim();
    
    if (!nickname || nickname.length < 2 || nickname.length > 20) {
        handleError('닉네임은 2-20자 이내로 입력해주세요.');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        handleError('올바른 이메일 형식을 입력해주세요.');
        return;
    }
    
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
        handleError('올바른 휴대폰 번호 형식을 입력해주세요. (010-0000-0000)');
        return;
    }
    
    // 로딩 상태
    setButtonLoading(submitBtn, '저장 중...');
    
    try {
        const updateData = {
            name: nickname,
            email: email,
            phone: phone
        };
        
        const response = await fetch('/api/user/update-profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                // 상태 업데이트
                Object.assign(mypageState.userProfile, updateData);
                updateUI();
                
                showSuccess('프로필이 수정되었습니다.');
                closeProfileEditModal();
            } else {
                handleError(data.message || '프로필 수정에 실패했습니다.');
            }
        } else {
            handleError('서버 오류가 발생했습니다.');
        }
        
    } catch (error) {
        handleError('프로필 수정 중 오류가 발생했습니다.');
    } finally {
        resetButtonLoading(submitBtn, originalText);
    }
}

// 애니메이션 초기화
function initializeAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // 페이지 로드 애니메이션
    gsap.timeline()
        .from('.user-dashboard', {
            duration: 0.8,
            y: -30,
            opacity: 0,
            ease: 'power2.out'
        })
        .from('.dashboard-stats .stat-card', {
            duration: 0.6,
            y: 20,
            opacity: 0,
            stagger: 0.1,
            ease: 'power2.out'
        }, '-=0.4')
        .from('.recent-activity', {
            duration: 0.6,
            y: 30,
            opacity: 0,
            ease: 'power2.out'
        }, '-=0.2');
    
    // 스크롤 트리거 설정 (GSAP ScrollTrigger 플러그인이 있는 경우)
    if (gsap.registerPlugin && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // 통계 카드 애니메이션
        gsap.utils.toArray('.stat-card').forEach(card => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.6,
                scale: 0.9,
                opacity: 0,
                ease: 'back.out(1.7)'
            });
        });
    }
}

// UI 업데이트
function updateUI() {
    updateUserProfile();
    updateStats();
    updateActivityFeed();
}

// 사용자 프로필 업데이트
function updateUserProfile() {
    const profile = mypageState.userProfile;
    
    // 닉네임 업데이트 ("님" 제거)
    const nameElements = document.querySelectorAll('.username, .user-name');
    nameElements.forEach(el => {
        if (el) el.textContent = profile.name;
    });
    
    // 포인트 업데이트
    const pointElements = document.querySelectorAll('.stat-number');
    if (pointElements[0]) {
        animateNumber(pointElements[0], parseInt(pointElements[0].textContent.replace(/[^\d]/g, '')) || 0, profile.points, 'P');
    }
    
    // 순위 업데이트
    if (pointElements[1]) {
        pointElements[1].textContent = `${profile.rank}위`;
    }
    
    // 신고 건수 업데이트
    if (pointElements[2]) {
        pointElements[2].textContent = `${profile.stats.reports}건`;
    }
    
    // 목격 신고 건수 업데이트
    if (pointElements[3]) {
        pointElements[3].textContent = `${profile.stats.witnesses}건`;
    }
}

// 통계 업데이트
function updateStats() {
    const stats = mypageState.userProfile.stats;
    
    // 승인률 업데이트
    const approvalRateElement = document.querySelector('.approval-rate');
    if (approvalRateElement) {
        approvalRateElement.innerHTML = `<i class="fas fa-check"></i> 승인률 ${stats.witnessApprovalRate}%`;
    }
}

// 활동 피드 업데이트
function updateActivityFeed() {
    const activityContainer = document.querySelector('.activity-summary');
    if (!activityContainer || !mypageState.activityHistory.length) return;
    
    const recentActivities = mypageState.activityHistory.slice(0, 3);
    
    activityContainer.innerHTML = recentActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${getActivityIconClass(activity.type)}">
                <i class="fas ${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${getTimeAgo(activity.timestamp)}</div>
            </div>
            ${activity.points !== 0 ? `
                <div class="activity-points ${activity.points > 0 ? 'positive' : 'negative'}">
                    ${activity.points > 0 ? '+' : ''}${activity.points}P
                </div>
            ` : `
                <div class="activity-status ${activity.status}">${getStatusText(activity.status)}</div>
            `}
        </div>
    `).join('');
}

// 활동 아이콘 클래스
function getActivityIconClass(type) {
    const classMap = {
        'witness_approved': 'success',
        'witness_submitted': 'info',
        'shop_purchase': 'purchase',
        'missing_report': 'info',
        'points_earned': 'success'
    };
    return classMap[type] || 'info';
}

// 활동 아이콘
function getActivityIcon(type) {
    const iconMap = {
        'witness_approved': 'fa-check',
        'witness_submitted': 'fa-eye',
        'shop_purchase': 'fa-shopping-cart',
        'missing_report': 'fa-plus-circle',
        'points_earned': 'fa-coins'
    };
    return iconMap[type] || 'fa-info-circle';
}

// 상태 텍스트 변환
function getStatusText(status) {
    const statusMap = {
        'pending': '검토중',
        'approved': '승인',
        'rejected': '거부',
        'completed': '완료'
    };
    return statusMap[status] || status;
}

// 시간 차이 계산
function getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMs = now - past;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    return past.toLocaleDateString('ko-KR');
}

// 숫자 애니메이션
function animateNumber(element, from, to, suffix = '', duration = 1000) {
    if (typeof gsap !== 'undefined') {
        const obj = { value: from };
        gsap.to(obj, {
            duration: duration / 1000,
            value: to,
            ease: 'power2.out',
            onUpdate: function() {
                element.textContent = Math.floor(obj.value).toLocaleString() + suffix;
            }
        });
    } else {
        element.textContent = to.toLocaleString() + suffix;
    }
}

// 버튼 로딩 상태 설정
function setButtonLoading(button, text) {
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
}

// 버튼 로딩 상태 해제
function resetButtonLoading(button, originalText) {
    button.disabled = false;
    button.innerHTML = originalText;
}

// 로딩 상태 업데이트
function updateLoadingState() {
    const loadingElements = document.querySelectorAll('.loading-overlay');
    loadingElements.forEach(el => {
        if (el) el.style.display = mypageState.isLoading ? 'flex' : 'none';
    });
}

// 성공 메시지 표시
function showSuccess(message) {
    if (window.showNotification) {
        window.showNotification(message, 'success');
    }
}

// 정보 메시지 표시
function showInfo(message) {
    if (window.showNotification) {
        window.showNotification(message, 'info');
    }
}

// 에러 처리
function handleError(message) {
    if (window.showNotification) {
        window.showNotification(message, 'error');
    }
}

// 디바운스 유틸리티
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 날짜 포맷팅
function formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes);
}

// 전역 함수로 내보내기
window.openProfileEditModal = openProfileEditModal;
window.closeProfileEditModal = closeProfileEditModal;
window.handleProfileEdit = handleProfileEdit;