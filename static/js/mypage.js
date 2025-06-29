// static/js/mypage.js

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

// DOM 완전 로드 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 로드 완료 - 마이페이지 초기화 시작');
    setTimeout(() => {
        initializeMyPage();
    }, 100);
});

// 마이페이지 초기화
function initializeMyPage() {
    console.log('=== 마이페이지 초기화 시작 ===');
    
    // DOM 요소 확인
    const activityContainer = document.getElementById('activitySummary');
    const loadingContainer = document.getElementById('activityLoading');
    const loadMoreContainer = document.getElementById('activityLoadMore');
    
    console.log('DOM 요소 확인:');
    console.log('- activitySummary:', activityContainer);
    console.log('- activityLoading:', loadingContainer);
    console.log('- activityLoadMore:', loadMoreContainer);
    
    if (!activityContainer) {
        console.error('❌ 필수 DOM 요소를 찾을 수 없습니다!');
        return;
    }
    
    // 즉시 활동 데이터 생성 및 표시
    generateAndDisplayActivities();
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 사용자 프로필 업데이트
    updateUserProfile();
    
    console.log('=== 마이페이지 초기화 완료 ===');
}

// 활동 데이터 생성 및 즉시 표시
function generateAndDisplayActivities() {
    console.log('📊 활동 데이터 생성 및 표시 시작');
    
    // 로딩 표시
    showActivityLoading();
    
    // 활동 데이터 생성
    mypageState.activityHistory = generateFullActivityData();
    console.log('✅ 활동 데이터 생성 완료:', mypageState.activityHistory.length, '개');
    
    // 처음 5개 설정
    mypageState.currentDisplayCount = Math.min(mypageState.activitiesPerLoad, mypageState.activityHistory.length);
    mypageState.displayedActivities = mypageState.activityHistory.slice(0, mypageState.currentDisplayCount);
    
    console.log('📋 표시할 활동:', mypageState.displayedActivities.length, '개');
    console.log('🔄 남은 활동:', mypageState.activityHistory.length - mypageState.currentDisplayCount, '개');
    
    // 짧은 로딩 시간 후 표시 (UX 개선)
    setTimeout(() => {
        hideActivityLoading();
        renderActivityList();
        updateLoadMoreButton();
        console.log('✅ 활동 리스트 렌더링 완료');
    }, 500);
}

// 12개 활동 샘플 데이터 생성
function generateFullActivityData() {
    const now = new Date();
    
    const activities = [
        {
            id: 1,
            type: 'witness_approved',
            title: '목격 신고 승인',
            description: '강남구 김○○님 목격 신고가 승인되어 150P를 받았습니다.',
            points: 150,
            timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 2,
            type: 'witness_submitted',
            title: '목격 신고 제출',
            description: '서초구 박○○님에 대한 목격 정보를 신고했습니다.',
            points: 0,
            timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
        },
        {
            id: 3,
            type: 'shop_purchase',
            title: '포인트샵 구매',
            description: '스타벅스 아메리카노를 구매했습니다.',
            points: -500,
            timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 4,
            type: 'witness_approved',
            title: '목격 신고 승인',
            description: '영등포구 이○○님 목격 신고가 승인되어 200P를 받았습니다.',
            points: 200,
            timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 5,
            type: 'missing_report',
            title: '실종자 신고 제출',
            description: '새로운 실종자 신고를 접수했습니다.',
            points: 100,
            timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'approved'
        },
        {
            id: 6,
            type: 'witness_rejected',
            title: '목격 신고 반려',
            description: '제출한 목격 신고가 부정확한 정보로 반려되었습니다.',
            points: 0,
            timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'rejected'
        },
        {
            id: 7,
            type: 'shop_purchase',
            title: '포인트샵 구매',
            description: 'CGV 영화 관람권을 구매했습니다.',
            points: -1000,
            timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 8,
            type: 'witness_approved',
            title: '목격 신고 승인',
            description: '마포구 최○○님 목격 신고가 승인되어 150P를 받았습니다.',
            points: 150,
            timestamp: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 9,
            type: 'points_earned',
            title: '출석 체크 보상',
            description: '7일 연속 출석으로 보너스 포인트를 받았습니다.',
            points: 50,
            timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 10,
            type: 'witness_submitted',
            title: '목격 신고 제출',
            description: '용산구 정○○님에 대한 목격 정보를 신고했습니다.',
            points: 0,
            timestamp: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
        },
        {
            id: 11,
            type: 'witness_approved',
            title: '목격 신고 승인',
            description: '종로구 한○○님 목격 신고가 승인되어 150P를 받았습니다.',
            points: 150,
            timestamp: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 12,
            type: 'shop_purchase',
            title: '포인트샵 구매',
            description: '편의점 상품권을 구매했습니다.',
            points: -300,
            timestamp: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        }
    ];
    
    console.log('🎯 생성된 활동 데이터:', activities.length, '개');
    return activities;
}

// 활동 로딩 표시
function showActivityLoading() {
    const loadingContainer = document.getElementById('activityLoading');
    const activityContainer = document.getElementById('activitySummary');
    
    if (loadingContainer) {
        loadingContainer.style.display = 'block';
    }
    if (activityContainer) {
        activityContainer.style.display = 'none';
    }
    
    console.log('⏳ 활동 로딩 상태 표시');
}

// 활동 로딩 숨김
function hideActivityLoading() {
    const loadingContainer = document.getElementById('activityLoading');
    const activityContainer = document.getElementById('activitySummary');
    
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
    if (activityContainer) {
        activityContainer.style.display = 'block';
    }
    
    console.log('✅ 활동 로딩 상태 숨김');
}

// 활동 리스트 렌더링
function renderActivityList() {
    const activityContainer = document.getElementById('activitySummary');
    
    if (!activityContainer) {
        console.error('❌ 활동 컨테이너를 찾을 수 없습니다!');
        return;
    }
    
    console.log('🎨 활동 리스트 렌더링 시작:', mypageState.displayedActivities.length, '개');
    
    // 기존 내용 제거
    activityContainer.innerHTML = '';
    
    // 활동이 없는 경우
    if (!mypageState.displayedActivities || mypageState.displayedActivities.length === 0) {
        activityContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #6b7280;">
                <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                <p>아직 활동 내역이 없습니다.</p>
            </div>
        `;
        console.log('📭 활동 내역 없음 메시지 표시');
        return;
    }
    
    // 활동 항목들 생성
    mypageState.displayedActivities.forEach((activity, index) => {
        const activityElement = createActivityElement(activity);
        activityElement.style.animationDelay = `${index * 0.1}s`;
        activityContainer.appendChild(activityElement);
        
        // GSAP 애니메이션이 있으면 적용
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(activityElement, 
                {
                    opacity: 0,
                    y: 20,
                    scale: 0.95
                },
                {
                    duration: 0.4,
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    delay: index * 0.1,
                    ease: 'power2.out'
                }
            );
        }
    });
    
    console.log('✅ 활동 리스트 렌더링 완료:', mypageState.displayedActivities.length, '개 표시됨');
}

// 더보기 활동 로드
function loadMoreActivities() {
    if (mypageState.loadMoreLoading) {
        console.log('🔄 이미 로딩 중입니다.');
        return;
    }
    
    const remainingCount = mypageState.activityHistory.length - mypageState.currentDisplayCount;
    if (remainingCount <= 0) {
        console.log('🚫 더 이상 로드할 활동이 없습니다.');
        return;
    }
    
    console.log('📥 더보기 로딩 시작... 남은 활동:', remainingCount, '개');
    
    mypageState.loadMoreLoading = true;
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const originalText = loadMoreBtn ? loadMoreBtn.innerHTML : '';
    
    // 로딩 상태 표시
    if (loadMoreBtn) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로딩 중...';
    }
    
    // 로딩 시뮬레이션
    setTimeout(() => {
        const nextCount = Math.min(
            mypageState.currentDisplayCount + mypageState.activitiesPerLoad,
            mypageState.activityHistory.length
        );
        
        const newActivities = mypageState.activityHistory.slice(mypageState.currentDisplayCount, nextCount);
        console.log('📋 새로 로드할 활동:', newActivities.length, '개');
        
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
        
        console.log('✅ 더보기 로딩 완료. 현재 표시:', mypageState.currentDisplayCount, '개');
        
    }, 800);
}

// DOM에 활동 추가
function appendActivitiesToDOM(activities) {
    const activityContainer = document.getElementById('activitySummary');
    if (!activityContainer) {
        console.error('❌ 활동 컨테이너를 찾을 수 없습니다.');
        return;
    }
    
    console.log('➕ DOM에 활동 추가:', activities.length, '개');
    
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
    
    if (!loadMoreContainer) {
        console.error('❌ 더보기 버튼 요소를 찾을 수 없습니다.');
        return;
    }
    
    const remainingCount = mypageState.activityHistory.length - mypageState.currentDisplayCount;
    
    console.log('🔄 더보기 버튼 업데이트 - 남은 활동:', remainingCount, '개');
    
    if (remainingCount > 0) {
        loadMoreContainer.style.display = 'block';
        console.log('👆 더보기 버튼 표시');
    } else {
        loadMoreContainer.style.display = 'none';
        console.log('🙈 더보기 버튼 숨김');
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    console.log('🎯 이벤트 리스너 설정 시작');
    
    // 키보드 단축키
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // 모달 관련 이벤트
    setupModalEvents();
    
    console.log('✅ 이벤트 리스너 설정 완료');
}

// 모달 이벤트 설정
function setupModalEvents() {
    // 모달 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('profileEditModal');
        if (modal && modal.classList.contains('show')) {
            const overlay = modal.querySelector('.modal-overlay');
            if (e.target === overlay) {
                closeProfileEditModal();
            }
        }
    });
    
    // 닉네임 수정 버튼
    const editBtn = document.querySelector('.edit-nickname-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openProfileEditModal();
        });
    }
    
    // 폼 제출
    const profileForm = document.getElementById('profileEditForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileEdit);
    }
    
    // 모달 닫기 버튼들
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

// 사용자 프로필 업데이트
function updateUserProfile() {
    const profile = mypageState.userProfile;
    
    // 닉네임 업데이트 ("님" 추가)
    const nameElements = document.querySelectorAll('.username, .user-name');
    nameElements.forEach(el => {
        if (el) el.textContent = profile.name + ' 님';
    });
    
    // 통계 업데이트
    const statValues = document.querySelectorAll('.stat-value');
    
    if (statValues[0]) {
        animateNumber(statValues[0], parseInt(statValues[0].textContent.replace(/[^\d]/g, '')) || 0, profile.points, 'P');
    }
    
    if (statValues[1]) {
        statValues[1].textContent = `${profile.rank}위`;
    }
    
    if (statValues[2]) {
        statValues[2].textContent = `${profile.stats.reports}건`;
    }
    
    if (statValues[3]) {
        statValues[3].textContent = `${profile.stats.witnesses}건`;
    }
    
    console.log('👤 사용자 프로필 업데이트 완료');
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

// 프로필 수정 모달 관련 함수들
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
    document.body.classList.add('modal-open');
    
    // GSAP 애니메이션
    if (typeof gsap !== 'undefined') {
        const content = modal.querySelector('.modal-content');
        if (content) {
            gsap.fromTo(content, 
                { scale: 0.8, opacity: 0, y: 50 },
                { duration: 0.4, scale: 1, opacity: 1, y: 0, ease: 'back.out(1.7)' }
            );
        }
    }
    
    setTimeout(() => {
        const firstInput = form ? form.querySelector('input') : null;
        if (firstInput) firstInput.focus();
    }, 100);
}

function closeProfileEditModal() {
    const modal = document.getElementById('profileEditModal');
    if (!modal) return;
    
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
}

async function handleProfileEdit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.btn-primary');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    
    // 유효성 검사
    const nickname = formData.get('newNickname') ? formData.get('newNickname').trim() : '';
    const email = formData.get('userEmail') ? formData.get('userEmail').trim() : '';
    const phone = formData.get('userPhone') ? formData.get('userPhone').trim() : '';
    
    if (!nickname || nickname.length < 2 || nickname.length > 20) {
        if (window.showNotification) {
            window.showNotification('닉네임은 2-20자 이내로 입력해주세요.', 'error');
        }
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        if (window.showNotification) {
            window.showNotification('올바른 이메일 형식을 입력해주세요.', 'error');
        }
        return;
    }
    
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
        if (window.showNotification) {
            window.showNotification('올바른 휴대폰 번호 형식을 입력해주세요. (010-0000-0000)', 'error');
        }
        return;
    }
    
    // 로딩 상태
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 저장 중...';
    }
    
    // 서버 요청 시뮬레이션
    setTimeout(() => {
        mypageState.userProfile.name = nickname;
        mypageState.userProfile.email = email;
        mypageState.userProfile.phone = phone;
        
        updateUserProfile();
        
        if (window.showNotification) {
            window.showNotification('프로필이 수정되었습니다.', 'success');
        }
        closeProfileEditModal();
        
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }, 1000);
}

// 전역 함수로 내보내기
window.openProfileEditModal = openProfileEditModal;
window.closeProfileEditModal = closeProfileEditModal;
window.handleProfileEdit = handleProfileEdit;
window.loadMoreActivities = loadMoreActivities;