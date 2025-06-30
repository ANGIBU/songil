// static/js/notifications.js

// 알림 페이지 JavaScript
let currentFilter = 'all';
let notifications = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeNotifications();
    requestNotificationPermission();
    startRealTimeNotifications();
});

// 알림 페이지 초기화
function initializeNotifications() {
    // 페이지 로드 애니메이션
    if (typeof gsap !== 'undefined') {
        gsap.from('.notifications-header', {
            duration: 0.8,
            y: -30,
            opacity: 0,
            ease: 'power2.out'
        });
        
        gsap.from('.notifications-stats .stat-item', {
            duration: 0.6,
            y: 20,
            opacity: 0,
            stagger: 0.1,
            delay: 0.2,
            ease: 'power2.out'
        });
        
        gsap.from('.notification-item', {
            duration: 0.5,
            x: -30,
            opacity: 0,
            stagger: 0.1,
            delay: 0.4,
            ease: 'power2.out'
        });
    }
    
    // 알림 데이터 로드
    loadNotifications();
}

// 브라우저 알림 권한 요청
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('알림 권한이 허용되었습니다.');
            }
        });
    }
}

// 실시간 알림 시작
function startRealTimeNotifications() {
    // 실제로는 WebSocket이나 Server-Sent Events 사용
    // 여기서는 데모용으로 랜덤 알림 생성
    setInterval(() => {
        if (Math.random() > 0.95) { // 5% 확률
            showNewNotification();
        }
    }, 10000); // 10초마다 체크
}

// 새 알림 표시
function showNewNotification() {
    const notifications = [
        {
            title: '새로운 목격 신고',
            message: '회원님이 관심 등록한 실종자에 대한 새로운 목격 정보가 접수되었습니다.',
            category: 'witnesses',
            importance: 'normal'
        },
        {
            title: '포인트 적립',
            message: '일일 출석으로 50포인트가 적립되었습니다.',
            category: 'points',
            importance: 'low'
        },
        {
            title: '긴급 실종자',
            message: '회원님 근처에 새로운 실종자가 신고되었습니다.',
            category: 'system',
            importance: 'high'
        }
    ];
    
    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    
    // 토스트 알림 표시
    showToast(randomNotification.title, randomNotification.message);
    
    // 브라우저 알림
    if (Notification.permission === 'granted') {
        new Notification(randomNotification.title, {
            body: randomNotification.message,
            icon: '/static/images/placeholder.jpg'
        });
    }
    
    // 페이지에 새 알림 추가
    addNotificationToPage(randomNotification);
}

// 토스트 알림 표시
function showToast(title, message) {
    const toast = document.getElementById('notificationToast');
    const titleEl = toast.querySelector('.toast-title');
    const messageEl = toast.querySelector('.toast-message');
    
    titleEl.textContent = title;
    messageEl.textContent = message;
    
    toast.classList.add('show');
    
    // 5초 후 자동 숨김
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// 토스트 닫기
function closeToast() {
    document.getElementById('notificationToast').classList.remove('show');
}

// 알림 필터링
function filterNotifications(category) {
    currentFilter = category;
    
    // 필터 버튼 업데이트
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${category}"]`).classList.add('active');
    
    // 알림 아이템 필터링
    const notifications = document.querySelectorAll('.notification-item');
    notifications.forEach(notification => {
        if (category === 'all' || notification.dataset.category === category) {
            notification.style.display = 'block';
        } else {
            notification.style.display = 'none';
        }
    });
    
    // 애니메이션 효과
    if (typeof gsap !== 'undefined') {
        const visibleNotifications = document.querySelectorAll('.notification-item[style*="block"], .notification-item:not([style*="none"])');
        gsap.from(visibleNotifications, {
            duration: 0.4,
            x: -20,
            opacity: 0,
            stagger: 0.05,
            ease: 'power2.out'
        });
    }
}

// 알림 정렬
function sortNotifications() {
    const sortValue = document.getElementById('sortOrder').value;
    const container = document.querySelector('.notifications-list .container');
    const sections = Array.from(container.querySelectorAll('.notifications-section:not(.collapsed)'));
    
    sections.forEach(section => {
        const items = Array.from(section.querySelectorAll('.notification-item'));
        
        items.sort((a, b) => {
            switch(sortValue) {
                case 'oldest':
                    return new Date(a.dataset.time) - new Date(b.dataset.time);
                case 'importance':
                    const importanceA = a.classList.contains('important') ? 2 : (a.classList.contains('unread') ? 1 : 0);
                    const importanceB = b.classList.contains('important') ? 2 : (b.classList.contains('unread') ? 1 : 0);
                    return importanceB - importanceA;
                case 'newest':
                default:
                    return new Date(b.dataset.time) - new Date(a.dataset.time);
            }
        });
        
        items.forEach(item => section.appendChild(item));
    });
    
    // 정렬 애니메이션
    if (typeof gsap !== 'undefined') {
        gsap.from('.notification-item', {
            duration: 0.4,
            y: 10,
            opacity: 0,
            stagger: 0.03,
            ease: 'power2.out'
        });
    }
}

// 읽음 상태별 필터링
function filterByReadStatus() {
    const readStatus = document.getElementById('readStatus').value;
    const notifications = document.querySelectorAll('.notification-item');
    
    notifications.forEach(notification => {
        const isUnread = notification.classList.contains('unread');
        let show = true;
        
        if (readStatus === 'unread' && !isUnread) {
            show = false;
        } else if (readStatus === 'read' && isUnread) {
            show = false;
        }
        
        notification.style.display = show ? 'block' : 'none';
    });
}

// 알림을 읽음으로 표시
function markAsRead(notificationId) {
    const notification = document.querySelector(`[data-id="${notificationId}"]`);
    notification.classList.remove('unread');
    
    // 읽지 않은 알림 수 업데이트
    updateUnreadCount();
    
    if (window.showNotification) {
        window.showNotification('알림을 읽음으로 표시했습니다.', 'success');
    }
}

// 모든 알림을 읽음으로 표시
function markAllAsRead() {
    const unreadNotifications = document.querySelectorAll('.notification-item.unread');
    unreadNotifications.forEach(notification => {
        notification.classList.remove('unread');
    });
    
    updateUnreadCount();
    
    if (window.showNotification) {
        window.showNotification(`${unreadNotifications.length}개의 알림을 읽음으로 표시했습니다.`, 'success');
    }
}

// 알림 삭제
function deleteNotification(notificationId) {
    const notification = document.querySelector(`[data-id="${notificationId}"]`);
    
    if (typeof gsap !== 'undefined') {
        gsap.to(notification, {
            duration: 0.3,
            x: 100,
            opacity: 0,
            onComplete: () => {
                notification.remove();
                updateNotificationCounts();
            }
        });
    } else {
        notification.remove();
        updateNotificationCounts();
    }
}

// 읽은 알림 삭제
function deleteReadNotifications() {
    const readNotifications = document.querySelectorAll('.notification-item:not(.unread)');
    
    if (readNotifications.length === 0) {
        if (window.showNotification) {
            window.showNotification('삭제할 읽은 알림이 없습니다.', 'info');
        }
        return;
    }
    
    if (confirm(`${readNotifications.length}개의 읽은 알림을 삭제하시겠습니까?`)) {
        readNotifications.forEach((notification, index) => {
            setTimeout(() => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(notification, {
                        duration: 0.2,
                        x: 100,
                        opacity: 0,
                        onComplete: () => {
                            notification.remove();
                            if (index === readNotifications.length - 1) {
                                updateNotificationCounts();
                            }
                        }
                    });
                } else {
                    notification.remove();
                    if (index === readNotifications.length - 1) {
                        updateNotificationCounts();
                    }
                }
            }, index * 50);
        });
        
        if (window.showNotification) {
            window.showNotification(`${readNotifications.length}개의 알림을 삭제했습니다.`, 'success');
        }
    }
}

// 알림 개수 업데이트
function updateNotificationCounts() {
    const totalNotifications = document.querySelectorAll('.notification-item').length;
    const unreadNotifications = document.querySelectorAll('.notification-item.unread').length;
    const importantNotifications = document.querySelectorAll('.notification-item.important').length;
    
    document.getElementById('totalNotifications').textContent = totalNotifications;
    document.getElementById('unreadNotifications').textContent = unreadNotifications;
    document.getElementById('importantNotifications').textContent = importantNotifications;
    
    // 필터 버튼 카운트 업데이트
    updateFilterCounts();
}

// 읽지 않은 알림 수 업데이트
function updateUnreadCount() {
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    document.getElementById('unreadNotifications').textContent = unreadCount;
}

// 필터 카운트 업데이트
function updateFilterCounts() {
    const categories = ['all', 'reports', 'witnesses', 'points', 'system'];
    
    categories.forEach(category => {
        let count;
        if (category === 'all') {
            count = document.querySelectorAll('.notification-item').length;
        } else {
            count = document.querySelectorAll(`.notification-item[data-category="${category}"]`).length;
        }
        
        const countElement = document.querySelector(`[data-filter="${category}"] .count`);
        if (countElement) {
            countElement.textContent = count;
        }
    });
}

// 섹션 토글
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const toggleIcon = section.querySelector('.toggle-icon');
    
    section.classList.toggle('collapsed');
    
    if (section.classList.contains('collapsed')) {
        toggleIcon.style.transform = 'rotate(0deg)';
    } else {
        toggleIcon.style.transform = 'rotate(180deg)';
    }
}

// 더 많은 알림 로드
function loadMoreNotifications() {
    const btn = event.target;
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로딩 중...';
    btn.disabled = true;
    
    setTimeout(() => {
        // 더미 알림 추가
        const olderSection = document.getElementById('olderNotifications').querySelector('.section-content');
        
        for (let i = 0; i < 5; i++) {
            const notification = document.createElement('div');
            notification.className = 'notification-item read';
            notification.dataset.category = 'system';
            notification.dataset.id = Date.now() + i;
            
            notification.innerHTML = `
                <div class="notification-icon info">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">이전 알림 ${i + 1}</div>
                    <div class="notification-message">이전에 받은 알림 내용입니다.</div>
                    <div class="notification-meta">
                        <span class="time">${Math.floor(Math.random() * 30) + 1}일 전</span>
                        <span class="category">공지사항</span>
                    </div>
                </div>
                <div class="notification-actions">
                    <button class="action-btn" onclick="deleteNotification(${Date.now() + i})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            olderSection.insertBefore(notification, olderSection.lastElementChild);
        }
        
        // 애니메이션 효과
        if (typeof gsap !== 'undefined') {
            const newNotifications = olderSection.querySelectorAll('.notification-item:nth-last-child(-n+5)');
            gsap.from(newNotifications, {
                duration: 0.5,
                x: -30,
                opacity: 0,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }
        
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        updateNotificationCounts();
        
        if (window.showNotification) {
            window.showNotification('새로운 알림을 불러왔습니다.', 'success');
        }
    }, 1000);
}

// 알림 설정 모달
function toggleNotificationSettings() {
    document.getElementById('notificationSettingsModal').style.display = 'flex';
}

function closeNotificationSettings() {
    document.getElementById('notificationSettingsModal').style.display = 'none';
}

function saveNotificationSettings() {
    // 설정 저장 로직
    closeNotificationSettings();
    
    if (window.showNotification) {
        window.showNotification('알림 설정이 저장되었습니다.', 'success');
    }
}

// 액션 버튼 핸들러들
function viewReportDetail(id) {
    window.location.href = `/missing/${id}`;
}

function viewWitnessDetail(id) {
    if (window.showNotification) {
        window.showNotification('목격 신고 상세 페이지로 이동합니다.', 'info');
    }
}

function viewMissingPerson(id) {
    window.location.href = `/missing/${id}`;
}

function goToPointShop() {
    window.location.href = '/pointshop';
}

function goToMyPage() {
    window.location.href = '/mypage';
}

function resubmitWitnessReport(id) {
    if (window.showNotification) {
        window.showNotification('목격 신고 재작성 페이지로 이동합니다.', 'info');
    }
}

function startTutorial() {
    if (window.showNotification) {
        window.showNotification('튜토리얼을 시작합니다.', 'info');
    }
}

// 페이지에 새 알림 추가
function addNotificationToPage(notificationData) {
    const todaySection = document.querySelector('.notifications-section:first-child');
    const newNotification = document.createElement('div');
    newNotification.className = `notification-item unread ${notificationData.importance === 'high' ? 'important' : ''}`;
    newNotification.dataset.category = notificationData.category;
    newNotification.dataset.id = Date.now();
    
    const iconClass = {
        'reports': 'fas fa-file-alt',
        'witnesses': 'fas fa-eye',
        'points': 'fas fa-coins',
        'system': 'fas fa-megaphone'
    };
    
    newNotification.innerHTML = `
        <div class="notification-icon ${notificationData.importance === 'high' ? 'critical' : 'info'}">
            <i class="${iconClass[notificationData.category]}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${notificationData.title}</div>
            <div class="notification-message">${notificationData.message}</div>
            <div class="notification-meta">
                <span class="time">방금 전</span>
                <span class="category">${getCategoryName(notificationData.category)}</span>
            </div>
        </div>
        <div class="notification-actions">
            <button class="action-btn" onclick="markAsRead(${Date.now()})">
                <i class="fas fa-check"></i>
            </button>
            <button class="action-btn" onclick="deleteNotification(${Date.now()})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // 첫 번째 위치에 추가
    todaySection.insertBefore(newNotification, todaySection.children[1]);
    
    // 애니메이션 효과
    if (typeof gsap !== 'undefined') {
        gsap.from(newNotification, {
            duration: 0.5,
            x: -50,
            opacity: 0,
            ease: 'power2.out'
        });
    }
    
    updateNotificationCounts();
}

// 카테고리 이름 반환
function getCategoryName(category) {
    const names = {
        'reports': '실종자 신고',
        'witnesses': '목격 신고',
        'points': '포인트',
        'system': '공지사항'
    };
    return names[category] || '기타';
}

// 알림 데이터 로드
function loadNotifications() {
    // 실제로는 서버에서 알림 데이터를 가져옴
    console.log('알림 데이터 로드 완료');
}

// 모달 외부 클릭시 닫기
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('notificationSettingsModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeNotificationSettings();
            }
        });
    }
});