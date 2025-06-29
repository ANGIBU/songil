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
        
        // 사용자 기본 정보 로드 (임시 데이터 사용)
        setTimeout(() => {
            mypageState.userProfile = { 
                ...mypageState.userProfile, 
                name: '사용자',
                email: 'user@example.com',
                phone: '010-1234-5678'
            };
            
            // 활동 내역 로드
            mypageState.activityHistory = getDummyActivityData();
            
            mypageState.isLoading = false;
            updateLoadingState();
            updateUI();
        }, 500);
        
    } catch (error) {
        handleError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
        mypageState.isLoading = false;
        updateLoadingState();
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
    
    // 모달 외부 클릭 시 닫기 - 이벤트 위임 사용
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('profileEditModal');
        if (modal && modal.classList.contains('show')) {
            const overlay = modal.querySelector('.modal-overlay');
            if (e.target === overlay) {
                closeProfileEditModal();
            }
        }
    });
    
    // 닉네임 수정 버튼 이벤트 설정
    const editBtn = document.querySelector('.edit-nickname-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openProfileEditModal();
        });
    }
    
    // 폼 제출 이벤트 설정
    const profileForm = document.getElementById('profileEditForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileEdit);
    }
    
    // 모달 닫기 버튼들 이벤트 설정
    const closeButtons = document.querySelectorAll('.close-modal, .btn-secondary');
    closeButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                closeProfileEditModal();
            });
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
    try {
        const modal = document.getElementById('profileEditModal');
        if (!modal) {
            return;
        }
        
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
        
        // 모달 표시
        modal.classList.add('show');
        document.body.classList.add('modal-open');
        
        // GSAP 애니메이션
        if (typeof gsap !== 'undefined') {
            const content = modal.querySelector('.modal-content');
            if (content) {
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
        }
        
        // 포커스 설정
        setTimeout(() => {
            const firstInput = form ? form.querySelector('input') : null;
            if (firstInput) firstInput.focus();
        }, 100);
        
    } catch (error) {
        handleError('모달을 열 수 없습니다.');
    }
}

// 프로필 수정 모달 닫기
function closeProfileEditModal() {
    try {
        const modal = document.getElementById('profileEditModal');
        if (!modal) return;
        
        // GSAP 애니메이션
        if (typeof gsap !== 'undefined') {
            const content = modal.querySelector('.modal-content');
            if (content) {
                gsap.to(content, {
                    duration: 0.3,
                    scale: 0.8,
                    opacity: 0,
                    y: 50,
                    ease: 'power2.in',
                    onComplete: () => {
                        modal.classList.remove('show');
                        document.body.classList.remove('modal-open');
                    }
                });
            } else {
                modal.classList.remove('show');
                document.body.classList.remove('modal-open');
            }
        } else {
            modal.classList.remove('show');
            document.body.classList.remove('modal-open');
        }
        
    } catch (error) {
        console.error('모달 닫기 오류:', error);
    }
}

// 프로필 수정 처리
async function handleProfileEdit(event) {
    event.preventDefault();
    
    try {
        const form = event.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.btn-primary');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        
        // 유효성 검사
        const nickname = formData.get('newNickname') ? formData.get('newNickname').trim() : '';
        const email = formData.get('userEmail') ? formData.get('userEmail').trim() : '';
        const phone = formData.get('userPhone') ? formData.get('userPhone').trim() : '';
        
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
        if (submitBtn) {
            setButtonLoading(submitBtn, '저장 중...');
        }
        
        // 서버 요청 시뮬레이션
        setTimeout(() => {
            // 상태 업데이트
            mypageState.userProfile.name = nickname;
            mypageState.userProfile.email = email;
            mypageState.userProfile.phone = phone;
            
            updateUI();
            
            showSuccess('프로필이 수정되었습니다.');
            closeProfileEditModal();
            
            if (submitBtn) {
                resetButtonLoading(submitBtn, originalText);
            }
        }, 1000);
        
    } catch (error) {
        handleError('프로필 수정 중 오류가 발생했습니다.');
    }
}

// 애니메이션 초기화
function initializeAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // 페이지 로드 애니메이션 (shadow 효과 제거)
    gsap.timeline()
        .from('.user-dashboard', {
            duration: 0.8,
            y: -30,
            opacity: 0,
            ease: 'power2.out'
        })
        .from('.dashboard-stats-simple', {
            duration: 0.6,
            y: 20,
            opacity: 0,
            ease: 'power2.out'
        }, '-=0.4')
        .from('.recent-activity', {
            duration: 0.6,
            y: 30,
            opacity: 0,
            ease: 'power2.out'
        }, '-=0.2');
    
    // 스크롤 트리거 설정 (shadow 효과 제거)
    if (gsap.registerPlugin && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // 통계 항목 개별 애니메이션 (shadow 제거)
        gsap.utils.toArray('.stat-item').forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.4,
                x: -30,
                opacity: 0,
                delay: index * 0.1,
                ease: 'power2.out'
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

// 사용자 프로필 업데이트 (닉네임에 "님" 추가)
function updateUserProfile() {
    const profile = mypageState.userProfile;
    
    // 닉네임 업데이트 ("님" 추가)
    const nameElements = document.querySelectorAll('.username, .user-name');
    nameElements.forEach(el => {
        if (el) el.textContent = profile.name + ' 님';
    });
    
    // 통계 숫자 업데이트
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // 포인트 업데이트
    if (statNumbers[0]) {
        animateNumber(statNumbers[0], parseInt(statNumbers[0].textContent.replace(/[^\d]/g, '')) || 0, profile.points, 'P');
    }
    
    // 순위 업데이트
    if (statNumbers[1]) {
        statNumbers[1].textContent = `${profile.rank}위`;
    }
    
    // 신고 건수 업데이트
    if (statNumbers[2]) {
        statNumbers[2].textContent = `${profile.stats.reports}건`;
    }
    
    // 목격 신고 건수 업데이트
    if (statNumbers[3]) {
        statNumbers[3].textContent = `${profile.stats.witnesses}건`;
    }
}

// 통계 업데이트
function updateStats() {
    const stats = mypageState.userProfile.stats;
    
    // 필요한 경우 추가 통계 업데이트 수행
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
    } else {
        alert(message);
    }
}

// 정보 메시지 표시
function showInfo(message) {
    if (window.showNotification) {
        window.showNotification(message, 'info');
    } else {
        alert(message);
    }
}

// 에러 처리
function handleError(message) {
    if (window.showNotification) {
        window.showNotification(message, 'error');
    } else {
        alert(message);
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

// 전역 함수로 내보내기 - 중요: HTML에서 사용할 수 있도록
window.openProfileEditModal = openProfileEditModal;
window.closeProfileEditModal = closeProfileEditModal;
window.handleProfileEdit = handleProfileEdit;