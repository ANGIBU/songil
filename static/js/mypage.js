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
    displayedActivities: [],
    isLoading: false,
    loadMoreLoading: false,
    currentDisplayCount: 0,
    activitiesPerLoad: 5,
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
}

// 사용자 데이터 로드
async function loadUserData() {
    try {
        mypageState.isLoading = true;
        updateLoadingState();
        
        console.log('사용자 데이터 로딩 시작...');
        
        // 사용자 기본 정보 설정
        mypageState.userProfile = { 
            ...mypageState.userProfile, 
            name: '사용자',
            email: 'user@example.com',
            phone: '010-1234-5678'
        };
        
        // 활동 내역 로드 - 12개 샘플 데이터
        mypageState.activityHistory = getFullActivityData();
        console.log('로드된 활동 내역:', mypageState.activityHistory.length, '개');
        
        // 처음 5개만 표시용으로 설정
        mypageState.currentDisplayCount = Math.min(mypageState.activitiesPerLoad, mypageState.activityHistory.length);
        mypageState.displayedActivities = mypageState.activityHistory.slice(0, mypageState.currentDisplayCount);
        
        console.log('표시할 활동:', mypageState.displayedActivities.length, '개');
        console.log('남은 활동:', mypageState.activityHistory.length - mypageState.currentDisplayCount, '개');
        
        mypageState.isLoading = false;
        updateLoadingState();
        
        // UI 업데이트
        updateUI();
        updateLoadMoreButton();
        
        console.log('사용자 데이터 로딩 완료');
        
    } catch (error) {
        console.error('사용자 데이터 로딩 오류:', error);
        handleError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
        mypageState.isLoading = false;
        updateLoadingState();
    }
}

// 12개 활동 샘플 데이터
function getFullActivityData() {
    const baseTime = new Date();
    
    return [
        {
            id: 1,
            type: 'witness_approved',
            title: '목격 신고 승인',
            description: '강남구 김○○님 목격 신고가 승인되어 150P를 받았습니다.',
            points: 150,
            timestamp: new Date(baseTime.getTime() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 2,
            type: 'witness_submitted',
            title: '목격 신고 제출',
            description: '서초구 박○○님에 대한 목격 정보를 신고했습니다.',
            points: 0,
            timestamp: new Date(baseTime.getTime() - 5 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
        },
        {
            id: 3,
            type: 'shop_purchase',
            title: '포인트샵 구매',
            description: '스타벅스 아메리카노를 구매했습니다.',
            points: -500,
            timestamp: new Date(baseTime.getTime() - 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 4,
            type: 'witness_approved',
            title: '목격 신고 승인',
            description: '영등포구 이○○님 목격 신고가 승인되어 200P를 받았습니다.',
            points: 200,
            timestamp: new Date(baseTime.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 5,
            type: 'missing_report',
            title: '실종자 신고 제출',
            description: '새로운 실종자 신고를 접수했습니다.',
            points: 100,
            timestamp: new Date(baseTime.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'approved'
        },
        {
            id: 6,
            type: 'witness_rejected',
            title: '목격 신고 반려',
            description: '제출한 목격 신고가 부정확한 정보로 반려되었습니다.',
            points: 0,
            timestamp: new Date(baseTime.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'rejected'
        },
        {
            id: 7,
            type: 'shop_purchase',
            title: '포인트샵 구매',
            description: 'CGV 영화 관람권을 구매했습니다.',
            points: -1000,
            timestamp: new Date(baseTime.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 8,
            type: 'witness_approved',
            title: '목격 신고 승인',
            description: '마포구 최○○님 목격 신고가 승인되어 150P를 받았습니다.',
            points: 150,
            timestamp: new Date(baseTime.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 9,
            type: 'points_earned',
            title: '출석 체크 보상',
            description: '7일 연속 출석으로 보너스 포인트를 받았습니다.',
            points: 50,
            timestamp: new Date(baseTime.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 10,
            type: 'witness_submitted',
            title: '목격 신고 제출',
            description: '용산구 정○○님에 대한 목격 정보를 신고했습니다.',
            points: 0,
            timestamp: new Date(baseTime.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
        },
        {
            id: 11,
            type: 'witness_approved',
            title: '목격 신고 승인',
            description: '종로구 한○○님 목격 신고가 승인되어 150P를 받았습니다.',
            points: 150,
            timestamp: new Date(baseTime.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 12,
            type: 'shop_purchase',
            title: '포인트샵 구매',
            description: '편의점 상품권을 구매했습니다.',
            points: -300,
            timestamp: new Date(baseTime.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        }
    ];
}

// 더보기 활동 로드
function loadMoreActivities() {
    if (mypageState.loadMoreLoading) {
        console.log('이미 로딩 중입니다.');
        return;
    }
    
    const remainingCount = mypageState.activityHistory.length - mypageState.currentDisplayCount;
    if (remainingCount <= 0) {
        console.log('더 이상 로드할 활동이 없습니다.');
        return;
    }
    
    console.log('더보기 로딩 시작... 남은 활동:', remainingCount, '개');
    
    mypageState.loadMoreLoading = true;
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const originalText = loadMoreBtn ? loadMoreBtn.innerHTML : '';
    
    // 로딩 상태 표시
    if (loadMoreBtn) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner"></i> 로딩 중...';
    }
    
    // 로딩 시뮬레이션
    setTimeout(() => {
        const nextCount = Math.min(
            mypageState.currentDisplayCount + mypageState.activitiesPerLoad,
            mypageState.activityHistory.length
        );
        
        const newActivities = mypageState.activityHistory.slice(mypageState.currentDisplayCount, nextCount);
        console.log('새로 로드할 활동:', newActivities.length, '개');
        
        // 새로운 활동들을 화면에 추가
        appendActivitiesToDOM(newActivities);
        
        mypageState.currentDisplayCount = nextCount;
        mypageState.displayedActivities = mypageState.activityHistory.slice(0, nextCount);
        
        // 버튼 상태 복원
        if (loadMoreBtn) {
            loadMoreBtn.disabled = false;
            loadMoreBtn.innerHTML = originalText;
        }
        mypageState.loadMoreLoading = false;
        
        updateLoadMoreButton();
        
        // 성공 메시지
        showSuccess(`${newActivities.length}개의 활동이 추가로 로드되었습니다.`);
        
        console.log('더보기 로딩 완료. 현재 표시:', mypageState.currentDisplayCount, '개');
        
    }, 800);
}

// DOM에 활동 추가
function appendActivitiesToDOM(activities) {
    const activityContainer = document.querySelector('.activity-summary');
    if (!activityContainer) {
        console.error('활동 컨테이너를 찾을 수 없습니다.');
        return;
    }
    
    console.log('DOM에 활동 추가:', activities.length, '개');
    
    activities.forEach((activity, index) => {
        const activityElement = createActivityElement(activity);
        activityElement.style.animationDelay = `${index * 0.1}s`;
        activityContainer.appendChild(activityElement);
        
        // GSAP 애니메이션
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(activityElement, 
                {
                    opacity: 0,
                    y: 30,
                    scale: 0.9
                },
                {
                    duration: 0.5,
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    delay: index * 0.1,
                    ease: 'back.out(1.7)'
                }
            );
        }
    });
}

// 활동 요소 생성
function createActivityElement(activity) {
    const activityDiv = document.createElement('div');
    activityDiv.className = 'activity-item';
    activityDiv.innerHTML = `
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
    `;
    return activityDiv;
}

// 더보기 버튼 업데이트
function updateLoadMoreButton() {
    const loadMoreContainer = document.getElementById('activityLoadMore');
    const remainingCountSpan = document.getElementById('remainingCount');
    
    if (!loadMoreContainer || !remainingCountSpan) {
        console.error('더보기 버튼 요소를 찾을 수 없습니다.');
        return;
    }
    
    const remainingCount = mypageState.activityHistory.length - mypageState.currentDisplayCount;
    
    console.log('더보기 버튼 업데이트 - 남은 활동:', remainingCount, '개');
    
    if (remainingCount > 0) {
        loadMoreContainer.style.display = 'block';
        remainingCountSpan.textContent = remainingCount;
    } else {
        loadMoreContainer.style.display = 'none';
    }
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
    
    // 페이지 로드 애니메이션
    gsap.timeline()
        .from('.user-dashboard', {
            duration: 0.8,
            y: -30,
            opacity: 0,
            ease: 'power2.out'
        })
        .from('.user-stats-container', {
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
    
    // 스크롤 트리거 설정
    if (gsap.registerPlugin && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // 통계 항목 개별 애니메이션
        gsap.utils.toArray('.stat').forEach((item, index) => {
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
    console.log('UI 업데이트 시작...');
    updateUserProfile();
    updateStats();
    updateActivityFeed();
    console.log('UI 업데이트 완료');
}

// 사용자 프로필 업데이트 (닉네임에 "님" 추가)
function updateUserProfile() {
    const profile = mypageState.userProfile;
    
    // 닉네임 업데이트 ("님" 추가)
    const nameElements = document.querySelectorAll('.username, .user-name');
    nameElements.forEach(el => {
        if (el) el.textContent = profile.name + ' 님';
    });
    
    // 통계 숫자 업데이트 - 새로운 구조에 맞게 수정
    const statValues = document.querySelectorAll('.stat-value');
    
    // 포인트 업데이트
    if (statValues[0]) {
        animateNumber(statValues[0], parseInt(statValues[0].textContent.replace(/[^\d]/g, '')) || 0, profile.points, 'P');
    }
    
    // 순위 업데이트
    if (statValues[1]) {
        statValues[1].textContent = `${profile.rank}위`;
    }
    
    // 신고 건수 업데이트
    if (statValues[2]) {
        statValues[2].textContent = `${profile.stats.reports}건`;
    }
    
    // 목격 신고 건수 업데이트
    if (statValues[3]) {
        statValues[3].textContent = `${profile.stats.witnesses}건`;
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
    if (!activityContainer) {
        console.error('활동 컨테이너를 찾을 수 없습니다.');
        return;
    }
    
    console.log('활동 피드 업데이트 - 표시할 활동:', mypageState.displayedActivities.length, '개');
    
    // 기존 내용 제거
    activityContainer.innerHTML = '';
    
    // 표시할 활동들이 있는지 확인
    if (mypageState.displayedActivities && mypageState.displayedActivities.length > 0) {
        // 표시할 활동들 추가
        mypageState.displayedActivities.forEach((activity, index) => {
            const activityElement = createActivityElement(activity);
            activityElement.style.animationDelay = `${index * 0.1}s`;
            activityContainer.appendChild(activityElement);
        });
        
        console.log('활동 피드에', mypageState.displayedActivities.length, '개 활동이 추가되었습니다.');
    } else {
        console.log('표시할 활동이 없습니다.');
        activityContainer.innerHTML = '<div class="no-activities">아직 활동 내역이 없습니다.</div>';
    }
}

// 활동 아이콘 클래스
function getActivityIconClass(type) {
    const classMap = {
        'witness_approved': 'success',
        'witness_submitted': 'info',
        'witness_rejected': 'rejected',
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
        'witness_rejected': 'fa-times',
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
window.loadMoreActivities = loadMoreActivities;