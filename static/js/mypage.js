// static/js/mypage.js

const { useState, useEffect, createElement } = React;

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
    currentPage: 0,
    activitiesPerPage: 5,
    isLoading: false,
    errors: {}
};

document.addEventListener('DOMContentLoaded', function() {
    initializeMyPage();
});

function initializeMyPage() {
    loadUserData();
    setupEventListeners();
    initializeAnimations();
    updateUI();
}

async function loadUserData() {
    try {
        mypageState.isLoading = true;
        updateLoadingState();
        
        setTimeout(() => {
            mypageState.userProfile = { 
                ...mypageState.userProfile, 
                name: '사용자',
                email: 'user@example.com',
                phone: '010-1234-5678'
            };
            
            mypageState.activityHistory = generate12ActivityData();
            mypageState.displayedActivities = mypageState.activityHistory.slice(0, mypageState.activitiesPerPage);
            
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

function generate12ActivityData() {
    const activities = [
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
        },
        {
            id: 4,
            type: 'witness_approved',
            title: '목격 신고 승인',
            description: '종로구 이○○님 목격 신고가 승인되어 100P를 받았습니다.',
            points: 100,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 5,
            type: 'missing_report',
            title: '실종자 신고 접수',
            description: '새로운 실종자 신고를 접수했습니다.',
            points: 0,
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
        },
        {
            id: 6,
            type: 'points_earned',
            title: '포인트 적립',
            description: '월간 활동 보상으로 200P가 적립되었습니다.',
            points: 200,
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 7,
            type: 'witness_submitted',
            title: '목격 신고 제출',
            description: '마포구 최○○님에 대한 목격 정보를 신고했습니다.',
            points: 0,
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
        },
        {
            id: 8,
            type: 'shop_purchase',
            title: '포인트샵 구매',
            description: '편의점 상품권 5,000원을 구매했습니다.',
            points: -300,
            timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 9,
            type: 'witness_approved',
            title: '목격 신고 승인',
            description: '영등포구 정○○님 목격 신고가 승인되어 120P를 받았습니다.',
            points: 120,
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 10,
            type: 'witness_submitted',
            title: '목격 신고 제출',
            description: '노원구 한○○님에 대한 목격 정보를 신고했습니다.',
            points: 0,
            timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
        },
        {
            id: 11,
            type: 'missing_report',
            title: '실종자 신고 접수',
            description: '긴급 실종자 신고를 접수했습니다.',
            points: 0,
            timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 12,
            type: 'points_earned',
            title: '포인트 적립',
            description: '신고 활동 보상으로 80P가 적립되었습니다.',
            points: 80,
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        }
    ];
    
    return activities;
}

function loadMoreActivities() {
    const button = document.querySelector('.load-more-btn');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로딩 중...';
    button.disabled = true;
    
    setTimeout(() => {
        const nextPage = mypageState.currentPage + 1;
        const startIndex = nextPage * mypageState.activitiesPerPage;
        const endIndex = startIndex + mypageState.activitiesPerPage;
        
        const newActivities = mypageState.activityHistory.slice(startIndex, endIndex);
        
        if (newActivities.length > 0) {
            mypageState.displayedActivities = mypageState.displayedActivities.concat(newActivities);
            mypageState.currentPage = nextPage;
            updateActivityFeed();
            
            if (typeof gsap !== 'undefined') {
                gsap.from('.activity-item:nth-last-child(-n+' + newActivities.length + ')', {
                    duration: 0.5,
                    y: 30,
                    opacity: 0,
                    stagger: 0.1,
                    ease: 'power2.out'
                });
            }
        }
        
        const remainingActivities = mypageState.activityHistory.length - mypageState.displayedActivities.length;
        if (remainingActivities <= 0) {
            document.getElementById('activityLoadMore').style.display = 'none';
        }
        
        button.innerHTML = originalText;
        button.disabled = false;
    }, 800);
}

function setupEventListeners() {
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('profileEditModal');
        if (modal && modal.classList.contains('show')) {
            const overlay = modal.querySelector('.modal-overlay');
            if (e.target === overlay) {
                closeProfileEditModal();
            }
        }
    });
    
    const editBtn = document.querySelector('.edit-nickname-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openProfileEditModal();
        });
    }
    
    const profileForm = document.getElementById('profileEditForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileEdit);
    }
    
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

function handleKeyboardShortcuts(event) {
    if (event.key === 'Escape') {
        closeProfileEditModal();
    }
    
    if (event.ctrlKey && event.key === 'e') {
        event.preventDefault();
        openProfileEditModal();
    }
}

function openProfileEditModal() {
    try {
        const modal = document.getElementById('profileEditModal');
        if (!modal) {
            return;
        }
        
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
        
        setTimeout(() => {
            const firstInput = form ? form.querySelector('input') : null;
            if (firstInput) firstInput.focus();
        }, 100);
        
    } catch (error) {
        handleError('모달을 열 수 없습니다.');
    }
}

function closeProfileEditModal() {
    try {
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
        
    } catch (error) {
        console.error('모달 닫기 오류:', error);
    }
}

async function handleProfileEdit(event) {
    event.preventDefault();
    
    try {
        const form = event.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.btn-primary');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        
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
        
        if (submitBtn) {
            setButtonLoading(submitBtn, '저장 중...');
        }
        
        setTimeout(() => {
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

function initializeAnimations() {
    if (typeof gsap === 'undefined') return;
    
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
    
    if (gsap.registerPlugin && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
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

function updateUI() {
    updateUserProfile();
    updateStats();
    updateActivityFeed();
}

function updateUserProfile() {
    const profile = mypageState.userProfile;
    
    const nameElements = document.querySelectorAll('.username, .user-name');
    nameElements.forEach(el => {
        if (el) el.textContent = profile.name + ' 님';
    });
    
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers[0]) {
        animateNumber(statNumbers[0], parseInt(statNumbers[0].textContent.replace(/[^\d]/g, '')) || 0, profile.points, 'P');
    }
    
    if (statNumbers[1]) {
        statNumbers[1].textContent = `${profile.rank}위`;
    }
    
    if (statNumbers[2]) {
        statNumbers[2].textContent = `${profile.stats.reports}건`;
    }
    
    if (statNumbers[3]) {
        statNumbers[3].textContent = `${profile.stats.witnesses}건`;
    }
}

function updateStats() {
    const stats = mypageState.userProfile.stats;
}

function updateActivityFeed() {
    const activityContainer = document.querySelector('.activity-summary');
    const loadMoreContainer = document.getElementById('activityLoadMore');
    const emptyContainer = document.getElementById('activityEmpty');
    
    if (!activityContainer) return;
    
    if (mypageState.displayedActivities.length === 0) {
        activityContainer.innerHTML = '';
        loadMoreContainer.style.display = 'none';
        emptyContainer.style.display = 'block';
        return;
    }
    
    emptyContainer.style.display = 'none';
    
    activityContainer.innerHTML = mypageState.displayedActivities.map(activity => `
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
    
    const hasMoreActivities = mypageState.displayedActivities.length < mypageState.activityHistory.length;
    loadMoreContainer.style.display = hasMoreActivities ? 'block' : 'none';
    
    const remainingCount = mypageState.activityHistory.length - mypageState.displayedActivities.length;
    const loadMoreBtn = loadMoreContainer.querySelector('.load-more-btn');
    if (loadMoreBtn && remainingCount > 0) {
        const nextLoadCount = Math.min(5, remainingCount);
        loadMoreBtn.innerHTML = `<i class="fas fa-chevron-down"></i> 더보기 (${nextLoadCount}개 더 로드)`;
    }
}

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

function getStatusText(status) {
    const statusMap = {
        'pending': '검토중',
        'approved': '승인',
        'rejected': '거부',
        'completed': '완료'
    };
    return statusMap[status] || status;
}

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

function setButtonLoading(button, text) {
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
}

function resetButtonLoading(button, originalText) {
    button.disabled = false;
    button.innerHTML = originalText;
}

function updateLoadingState() {
    const loadingElements = document.querySelectorAll('.loading-overlay');
    loadingElements.forEach(el => {
        if (el) el.style.display = mypageState.isLoading ? 'flex' : 'none';
    });
}

function showSuccess(message) {
    if (window.showNotification) {
        window.showNotification(message, 'success');
    } else {
        alert(message);
    }
}

function showInfo(message) {
    if (window.showNotification) {
        window.showNotification(message, 'info');
    } else {
        alert(message);
    }
}

function handleError(message) {
    if (window.showNotification) {
        window.showNotification(message, 'error');
    } else {
        alert(message);
    }
}

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

window.openProfileEditModal = openProfileEditModal;
window.closeProfileEditModal = closeProfileEditModal;
window.handleProfileEdit = handleProfileEdit;
window.loadMoreActivities = loadMoreActivities;