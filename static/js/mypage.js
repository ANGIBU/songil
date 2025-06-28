// static/js/mypage.js

// React 및 상태 관리
const { useState, useEffect, createElement } = React;

// 마이페이지 상태 관리
let mypageState = {
    currentTab: 'overview',
    userProfile: {
        id: null,
        name: '테스트사용자',
        email: 'test@example.com',
        phone: '010-1234-5678',
        birth: '1990-01-01',
        points: 1250,
        rank: 47,
        joinDate: '2024.05.01',
        level: '실버',
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
    notifications: {
        newMissingAlert: true,
        missingFoundAlert: true,
        witnessApprovalAlert: true,
        pointsEarnedAlert: true,
        investigationUpdateAlert: true,
        eventAlert: false,
        shopDiscountAlert: false
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
        
        // 알림 설정 로드
        await loadNotificationSettings();
        
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

// 알림 설정 로드
async function loadNotificationSettings() {
    try {
        const response = await fetch('/api/user/notification-settings');
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                mypageState.notifications = { ...mypageState.notifications, ...data.settings };
            }
        }
    } catch (error) {
        // 기본 설정 사용
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
    // 탭 전환 이벤트 (이미 HTML에서 onclick으로 처리됨)
    
    // 프로필 폼 이벤트
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileFormSubmit);
    }
    
    // 설정 폼 이벤트
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsFormSubmit);
    }
    
    // 프로필 이미지 변경 이벤트 (이미 HTML에서 onclick으로 처리됨)
    
    // 실시간 폼 유효성 검사
    setupFormValidation();
    
    // 키보드 단축키
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// 폼 유효성 검사 설정
function setupFormValidation() {
    const profileInputs = document.querySelectorAll('#profileForm input');
    profileInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', debounce(validateField, 300));
    });
}

// 필드 유효성 검사
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearFieldError(field);
    
    switch (fieldName) {
        case 'userName':
            if (!value) {
                showFieldError(field, '이름을 입력해주세요.');
                return false;
            }
            if (value.length < 2) {
                showFieldError(field, '이름은 2글자 이상이어야 합니다.');
                return false;
            }
            break;
            
        case 'userEmail':
            if (!value) {
                showFieldError(field, '이메일을 입력해주세요.');
                return false;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, '올바른 이메일 형식을 입력해주세요.');
                return false;
            }
            break;
            
        case 'userPhone':
            if (!value) {
                showFieldError(field, '휴대폰 번호를 입력해주세요.');
                return false;
            }
            const phoneRegex = /^010-\d{4}-\d{4}$/;
            if (!phoneRegex.test(value)) {
                showFieldError(field, '올바른 휴대폰 번호 형식을 입력해주세요. (010-0000-0000)');
                return false;
            }
            break;
            
        case 'newPassword':
            if (value && value.length < 8) {
                showFieldError(field, '비밀번호는 8자리 이상이어야 합니다.');
                return false;
            }
            break;
            
        case 'confirmPassword':
            const newPassword = document.getElementById('newPassword').value;
            if (newPassword && value !== newPassword) {
                showFieldError(field, '비밀번호가 일치하지 않습니다.');
                return false;
            }
            break;
    }
    
    return true;
}

// 필드 에러 표시
function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    
    // React를 사용한 에러 표시 애니메이션
    if (typeof React !== 'undefined') {
        const ErrorComponent = createElement('div', {
            className: 'error-animation',
            style: { 
                animation: 'shake 0.5s ease-in-out',
                display: 'inline-block'
            }
        });
    }
}

// 필드 에러 지우기
function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// 키보드 단축키 처리
function handleKeyboardShortcuts(event) {
    // Ctrl + S: 현재 탭의 폼 저장
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        
        if (mypageState.currentTab === 'profile') {
            const profileForm = document.getElementById('profileForm');
            if (profileForm) {
                profileForm.dispatchEvent(new Event('submit'));
            }
        } else if (mypageState.currentTab === 'settings') {
            const settingsForm = document.getElementById('settingsForm');
            if (settingsForm) {
                settingsForm.dispatchEvent(new Event('submit'));
            }
        }
    }
    
    // ESC: 모든 모달 닫기
    if (event.key === 'Escape') {
        closeAllModals();
    }
    
    // 숫자키 1-7: 탭 전환
    if (event.key >= '1' && event.key <= '7' && !event.ctrlKey && !event.altKey) {
        const tabNames = ['overview', 'profile', 'points', 'reports', 'witnesses', 'history', 'settings'];
        const tabIndex = parseInt(event.key) - 1;
        if (tabNames[tabIndex]) {
            switchTab(tabNames[tabIndex]);
        }
    }
}

// 탭 전환 (전역 함수로 유지)
function switchTab(tabName) {
    mypageState.currentTab = tabName;
    
    // 탭 버튼 활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // 탭 콘텐츠 표시
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const activeContent = document.getElementById(tabName + 'Tab');
    if (activeContent) {
        activeContent.classList.add('active');
    }
    
    // 탭별 데이터 로드
    loadTabData(tabName);
    
    // 애니메이션 효과
    animateTabTransition();
}

// 탭별 데이터 로드
async function loadTabData(tabName) {
    switch (tabName) {
        case 'reports':
            await loadReportsData();
            break;
        case 'witnesses':
            await loadWitnessesData();
            break;
        case 'history':
            await loadHistoryData();
            break;
        case 'points':
            await loadPointsData();
            break;
    }
}

// 신고 내역 데이터 로드
async function loadReportsData() {
    try {
        const response = await fetch('/api/user/reports');
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                updateReportsTable(data.reports);
            }
        }
    } catch (error) {
        // 더미 데이터로 대체
        updateReportsTable(getDummyReportsData());
    }
}

// 목격 신고 데이터 로드
async function loadWitnessesData() {
    try {
        const response = await fetch('/api/user/witnesses');
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                updateWitnessesTable(data.witnesses);
            }
        }
    } catch (error) {
        // 더미 데이터로 대체
        updateWitnessesTable(getDummyWitnessesData());
    }
}

// 포인트 데이터 로드
async function loadPointsData() {
    try {
        const response = await fetch('/api/user/points-history');
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                updatePointsChart(data.points_history);
            }
        }
    } catch (error) {
        // 기본 차트 표시
    }
}

// 신고 내역 테이블 업데이트
function updateReportsTable(reports) {
    const tbody = document.querySelector('.reports-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = reports.map(report => `
        <tr>
            <td>#${report.id}</td>
            <td>
                <div class="missing-person-info">
                    <strong>${report.name} (${report.age}세)</strong>
                    <div class="location">${report.location}</div>
                </div>
            </td>
            <td>${formatDateTime(report.created_at)}</td>
            <td><span class="status ${report.status}">${getStatusText(report.status)}</span></td>
            <td>
                ${report.status === 'active' ? `
                    <div class="progress-info">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${report.progress}%"></div>
                        </div>
                        <span>${report.progress}% 진행</span>
                    </div>
                ` : `
                    <div class="resolved-info">
                        <i class="fas fa-check-circle"></i>
                        발견완료
                    </div>
                `}
            </td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="viewReportDetail('${report.id}')">
                    <i class="fas fa-eye"></i>
                    상세보기
                </button>
            </td>
        </tr>
    `).join('');
}

// 목격 신고 테이블 업데이트
function updateWitnessesTable(witnesses) {
    const tbody = document.querySelector('.witnesses-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = witnesses.map(witness => `
        <tr>
            <td>#W${witness.id}</td>
            <td>${witness.missing_person_name} (${witness.missing_person_age}세)</td>
            <td>${formatDateTime(witness.witness_datetime)}</td>
            <td>${witness.location}</td>
            <td><span class="status ${witness.status}">${getStatusText(witness.status)}</span></td>
            <td>
                ${witness.status === 'approved' ? 
                    `<span class="points earned">+${witness.points}P</span>` :
                    `<span class="points pending">대기중</span>`
                }
            </td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="viewWitnessDetail('${witness.id}')">
                    <i class="fas fa-eye"></i>
                    상세보기
                </button>
            </td>
        </tr>
    `).join('');
}

// 더미 신고 데이터
function getDummyReportsData() {
    return [
        {
            id: '2024-0520-001',
            name: '김○○',
            age: 32,
            location: '강남구 역삼동',
            created_at: '2024-05-20T22:30:00Z',
            status: 'active',
            progress: 65
        },
        {
            id: '2024-0518-003',
            name: '이○○',
            age: 8,
            location: '서초구 반포동',
            created_at: '2024-05-18T15:20:00Z',
            status: 'resolved',
            progress: 100
        }
    ];
}

// 더미 목격 신고 데이터
function getDummyWitnessesData() {
    return [
        {
            id: '2024052301',
            missing_person_name: '김○○',
            missing_person_age: 32,
            witness_datetime: '2024-05-23T14:30:00Z',
            location: '강남역 2번출구',
            status: 'approved',
            points: 150
        },
        {
            id: '2024052205',
            missing_person_name: '박○○',
            missing_person_age: 28,
            witness_datetime: '2024-05-22T16:45:00Z',
            location: '서초구 반포동',
            status: 'pending',
            points: 0
        }
    ];
}

// 상태 텍스트 변환
function getStatusText(status) {
    const statusMap = {
        'active': '수사중',
        'resolved': '해결',
        'approved': '승인',
        'pending': '검토중',
        'rejected': '거부'
    };
    return statusMap[status] || status;
}

// 날짜 시간 포맷팅
function formatDateTime(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}.${month}.${day}<br>${hours}:${minutes}`;
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
    
    // 스크롤 트리거 설정
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
    
    // 성취도 애니메이션
    gsap.utils.toArray('.achievement').forEach((achievement, index) => {
        gsap.from(achievement, {
            scrollTrigger: {
                trigger: achievement,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.5,
            x: -50,
            opacity: 0,
            delay: index * 0.1,
            ease: 'power2.out'
        });
    });
}

// 탭 전환 애니메이션
function animateTabTransition() {
    if (typeof gsap === 'undefined') return;
    
    const activeContent = document.querySelector('.tab-content.active');
    if (activeContent) {
        gsap.from(activeContent, {
            duration: 0.5,
            y: 20,
            opacity: 0,
            ease: 'power2.out'
        });
    }
}

// 프로필 이미지 변경 (전역 함수로 유지)
function changeProfileImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            // 파일 크기 검사 (5MB 제한)
            if (file.size > 5 * 1024 * 1024) {
                handleError('파일 크기는 5MB를 초과할 수 없습니다.');
                return;
            }
            
            // 파일 형식 검사
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                handleError('JPG, PNG, GIF, WEBP 형식의 이미지만 업로드 가능합니다.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const profileImage = document.getElementById('profileImage');
                if (profileImage) {
                    profileImage.src = e.target.result;
                    
                    // 애니메이션 효과
                    if (typeof gsap !== 'undefined') {
                        gsap.from(profileImage, {
                            duration: 0.5,
                            scale: 0.8,
                            opacity: 0,
                            ease: 'back.out(1.7)'
                        });
                    }
                    
                    showSuccess('프로필 사진이 변경되었습니다.');
                    
                    // 서버에 업로드 (실제 구현 시)
                    uploadProfileImage(file);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// 프로필 이미지 업로드
async function uploadProfileImage(file) {
    try {
        const formData = new FormData();
        formData.append('profile_image', file);
        
        const response = await fetch('/api/user/upload-profile-image', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                mypageState.userProfile.profileImage = data.imageUrl;
            }
        }
    } catch (error) {
        handleError('프로필 이미지 업로드 중 오류가 발생했습니다.');
    }
}

// 프로필 폼 제출 처리
async function handleProfileFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // 유효성 검사
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        handleError('입력 정보를 확인해주세요.');
        return;
    }
    
    // 비밀번호 확인
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    
    if (newPassword && newPassword !== confirmPassword) {
        handleError('새 비밀번호가 일치하지 않습니다.');
        return;
    }
    
    // 로딩 상태
    setButtonLoading(submitBtn, '저장 중...');
    
    try {
        const updateData = {
            name: formData.get('userName'),
            email: formData.get('userEmail'),
            phone: formData.get('userPhone'),
            birth: formData.get('userBirth')
        };
        
        if (newPassword) {
            updateData.currentPassword = currentPassword;
            updateData.newPassword = newPassword;
        }
        
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
                
                showSuccess('개인정보가 수정되었습니다.');
                
                // 비밀번호 필드 초기화
                if (newPassword) {
                    form.querySelector('[name="currentPassword"]').value = '';
                    form.querySelector('[name="newPassword"]').value = '';
                    form.querySelector('[name="confirmPassword"]').value = '';
                }
            } else {
                handleError(data.message || '정보 수정에 실패했습니다.');
            }
        } else {
            handleError('서버 오류가 발생했습니다.');
        }
        
    } catch (error) {
        handleError('정보 수정 중 오류가 발생했습니다.');
    } finally {
        resetButtonLoading(submitBtn, originalText);
    }
}

// 설정 폼 제출 처리
async function handleSettingsFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // 로딩 상태
    setButtonLoading(submitBtn, '저장 중...');
    
    try {
        // 알림 설정 수집
        const settings = {};
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            settings[checkbox.name] = checkbox.checked;
        });
        
        const response = await fetch('/api/user/update-notification-settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ settings })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                // 상태 업데이트
                mypageState.notifications = { ...mypageState.notifications, ...settings };
                
                showSuccess('알림 설정이 저장되었습니다.');
            } else {
                handleError(data.message || '설정 저장에 실패했습니다.');
            }
        } else {
            handleError('서버 오류가 발생했습니다.');
        }
        
    } catch (error) {
        handleError('설정 저장 중 오류가 발생했습니다.');
    } finally {
        resetButtonLoading(submitBtn, originalText);
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
    
    // 이름 업데이트
    const nameElements = document.querySelectorAll('.username, .user-name');
    nameElements.forEach(el => {
        if (el) el.textContent = profile.name + '님';
    });
    
    // 포인트 업데이트
    const pointElements = document.querySelectorAll('.stat-number, .points-amount');
    pointElements.forEach((el, index) => {
        if (el && index === 0) {
            animateNumber(el, parseInt(el.textContent.replace(/[^\d]/g, '')) || 0, profile.points);
        }
    });
    
    // 순위 업데이트
    const rankElements = document.querySelectorAll('.stat-number');
    if (rankElements[1]) {
        rankElements[1].textContent = `#${profile.rank}`;
    }
    
    // 프로필 폼 업데이트
    updateProfileForm();
}

// 프로필 폼 업데이트
function updateProfileForm() {
    const profile = mypageState.userProfile;
    const form = document.getElementById('profileForm');
    if (!form) return;
    
    const fields = {
        'userName': profile.name,
        'userEmail': profile.email,
        'userPhone': profile.phone,
        'userBirth': profile.birth
    };
    
    Object.entries(fields).forEach(([name, value]) => {
        const field = form.querySelector(`[name="${name}"]`);
        if (field && value) {
            field.value = value;
        }
    });
}

// 통계 업데이트
function updateStats() {
    const stats = mypageState.userProfile.stats;
    
    // 월간 통계 업데이트
    const monthlyStats = document.querySelectorAll('.monthly-item .stat-value');
    if (monthlyStats.length >= 4) {
        monthlyStats[0].textContent = `${stats.monthlyReports}건`;
        monthlyStats[1].textContent = `${stats.monthlyWitnesses}건`;
        monthlyStats[2].textContent = `+${stats.monthlyPointsEarned}P`;
        monthlyStats[3].textContent = `-${stats.monthlyPointsUsed}P`;
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
function animateNumber(element, from, to, duration = 1000) {
    if (typeof gsap !== 'undefined') {
        const obj = { value: from };
        gsap.to(obj, {
            duration: duration / 1000,
            value: to,
            ease: 'power2.out',
            onUpdate: function() {
                element.textContent = Math.floor(obj.value).toLocaleString();
            }
        });
    } else {
        element.textContent = to.toLocaleString();
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
        el.style.display = mypageState.isLoading ? 'flex' : 'none';
    });
}

// 프로필 폼 리셋 (전역 함수로 유지)
function resetProfileForm() {
    const form = document.getElementById('profileForm');
    if (form) {
        form.reset();
        updateProfileForm(); // 원래 데이터로 복원
        showInfo('변경사항이 취소되었습니다.');
    }
}

// 신고 상세보기 (전역 함수로 유지)
function viewReportDetail(reportId) {
    window.location.href = `/missing-report/${reportId}`;
}

// 목격 신고 상세보기 (전역 함수로 유지)
function viewWitnessDetail(witnessId) {
    window.location.href = `/witness-report/${witnessId}`;
}

// 활동 내역 필터링 (전역 함수로 유지)
async function filterHistory() {
    const type = document.getElementById('historyType')?.value || 'all';
    const period = document.getElementById('historyPeriod')?.value || 'all';
    const search = document.getElementById('historySearch')?.value || '';
    
    try {
        const params = new URLSearchParams({ type, period, search, limit: 50 });
        const response = await fetch(`/api/user/activity-history?${params}`);
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                mypageState.activityHistory = data.activities;
                updateHistoryTimeline();
                showSuccess('활동 내역을 필터링했습니다.');
            }
        }
    } catch (error) {
        handleError('필터링 중 오류가 발생했습니다.');
    }
}

// 히스토리 타임라인 업데이트
function updateHistoryTimeline() {
    const timeline = document.querySelector('.activity-timeline');
    if (!timeline) return;
    
    const groupedActivities = groupActivitiesByDate(mypageState.activityHistory);
    
    timeline.innerHTML = Object.entries(groupedActivities).map(([date, activities]) => `
        <div class="timeline-item">
            <div class="timeline-date">${date}</div>
            <div class="timeline-content">
                ${activities.map(activity => `
                    <div class="activity-card ${getActivityIconClass(activity.type)}">
                        <div class="activity-icon">
                            <i class="fas ${getActivityIcon(activity.type)}"></i>
                        </div>
                        <div class="activity-details">
                            <div class="activity-title">${activity.title}</div>
                            <div class="activity-description">${activity.description}</div>
                            <div class="activity-meta">${new Date(activity.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        <div class="activity-result">
                            ${activity.points !== 0 ? `
                                <span class="points ${activity.points > 0 ? 'positive' : 'negative'}">
                                    ${activity.points > 0 ? '+' : ''}${activity.points}P
                                </span>
                            ` : `
                                <span class="status ${activity.status}">${getStatusText(activity.status)}</span>
                            `}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// 활동을 날짜별로 그룹화
function groupActivitiesByDate(activities) {
    return activities.reduce((groups, activity) => {
        const date = new Date(activity.timestamp).toLocaleDateString('ko-KR');
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(activity);
        return groups;
    }, {});
}

// 더 많은 내역 로드 (전역 함수로 유지)
async function loadMoreHistory() {
    const btn = event.target;
    const originalText = btn.innerHTML;
    
    setButtonLoading(btn, '로딩 중...');
    
    try {
        const offset = mypageState.activityHistory.length;
        const response = await fetch(`/api/user/activity-history?limit=20&offset=${offset}`);
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.activities.length > 0) {
                mypageState.activityHistory.push(...data.activities);
                updateHistoryTimeline();
                
                // 새로운 항목 애니메이션
                if (typeof gsap !== 'undefined') {
                    const newItems = document.querySelectorAll('.timeline-item:nth-last-child(-n+' + data.activities.length + ')');
                    gsap.from(newItems, {
                        duration: 0.5,
                        y: 30,
                        opacity: 0,
                        stagger: 0.1,
                        ease: 'power2.out'
                    });
                }
                
                showSuccess('새로운 활동 내역이 로드되었습니다.');
            } else {
                showInfo('더 이상 불러올 내역이 없습니다.');
                btn.style.display = 'none';
            }
        }
    } catch (error) {
        handleError('내역을 불러오는 중 오류가 발생했습니다.');
    } finally {
        resetButtonLoading(btn, originalText);
    }
}

// 모든 모달 닫기
function closeAllModals() {
    const modals = document.querySelectorAll('.modal, .purchase-modal, .points-history-modal, .success-modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
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

// React 컴포넌트 예시 (향후 확장용)
function createReactComponent() {
    if (typeof React === 'undefined') return null;
    
    const ProfileComponent = React.createElement('div', {
        className: 'react-profile-component',
        style: { padding: '20px', background: '#f9fafb', borderRadius: '8px' }
    }, [
        React.createElement('h3', { key: 'title' }, '프로필 정보'),
        React.createElement('p', { key: 'name' }, `이름: ${mypageState.userProfile.name}`),
        React.createElement('p', { key: 'points' }, `포인트: ${mypageState.userProfile.points.toLocaleString()}P`)
    ]);
    
    return ProfileComponent;
}

// 전역 함수로 내보내기
window.switchTab = switchTab;
window.changeProfileImage = changeProfileImage;
window.resetProfileForm = resetProfileForm;
window.viewReportDetail = viewReportDetail;
window.viewWitnessDetail = viewWitnessDetail;
window.filterHistory = filterHistory;
window.loadMoreHistory = loadMoreHistory;