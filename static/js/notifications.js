// static/js/notifications.js

// 알림 페이지 전용 JavaScript - React 기능 사용
const { useState, useEffect, useCallback } = React;

// 전역 변수
let currentFilter = 'all';
let notifications = [];
let notificationSystem = null;

// DOM 로딩 대기
function waitForNotificationDOM() {
    return new Promise((resolve) => {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            resolve();
        } else {
            document.addEventListener('DOMContentLoaded', resolve, { once: true });
        }
    });
}

// 알림 페이지 초기화
async function initializeNotifications() {
    try {
        await waitForNotificationDOM();
        
        // 페이지 로드 애니메이션
        animatePageLoad();
        
        // 알림 데이터 로드
        await loadNotifications();
        
        // 브라우저 알림 권한 요청
        requestNotificationPermission();
        
        // 실시간 알림 시작
        startRealTimeNotifications();
        
        // 이벤트 리스너 설정
        setupNotificationPageEvents();
        
    } catch (error) {
        console.error('알림 페이지 초기화 실패:', error);
    }
}

// 페이지 로드 애니메이션
function animatePageLoad() {
    try {
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
    } catch (error) {
        console.error('페이지 애니메이션 실패:', error);
    }
}

// 알림 페이지 이벤트 설정
function setupNotificationPageEvents() {
    try {
        // 필터 버튼들
        const filterBtns = document.querySelectorAll('.notification-filters .filter-btn');
        filterBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const filter = this.getAttribute('data-filter');
                    filterNotifications(filter);
                });
            }
        });
        
        // 정렬 셀렉트
        const sortSelect = document.getElementById('sortOrder');
        if (sortSelect) {
            sortSelect.addEventListener('change', sortNotifications);
        }
        
        // 읽음 상태 필터
        const readStatusSelect = document.getElementById('readStatus');
        if (readStatusSelect) {
            readStatusSelect.addEventListener('change', filterByReadStatus);
        }
        
        // 모든 읽음 처리 버튼
        const markAllReadBtn = document.querySelector('[onclick="markAllAsRead()"]');
        if (markAllReadBtn) {
            markAllReadBtn.removeAttribute('onclick');
            markAllReadBtn.addEventListener('click', markAllAsRead);
        }
        
        // 읽은 알림 삭제 버튼
        const deleteReadBtn = document.querySelector('[onclick="deleteReadNotifications()"]');
        if (deleteReadBtn) {
            deleteReadBtn.removeAttribute('onclick');
            deleteReadBtn.addEventListener('click', deleteReadNotifications);
        }
        
        // 더 보기 버튼
        const loadMoreBtn = document.querySelector('[onclick="loadMoreNotifications()"]');
        if (loadMoreBtn) {
            loadMoreBtn.removeAttribute('onclick');
            loadMoreBtn.addEventListener('click', loadMoreNotifications);
        }
        
        // 알림 설정 모달 관련
        const settingsBtn = document.querySelector('[onclick="toggleNotificationSettings()"]');
        if (settingsBtn) {
            settingsBtn.removeAttribute('onclick');
            settingsBtn.addEventListener('click', toggleNotificationSettings);
        }
        
        const closeSettingsBtn = document.querySelector('[onclick="closeNotificationSettings()"]');
        if (closeSettingsBtn) {
            closeSettingsBtn.removeAttribute('onclick');
            closeSettingsBtn.addEventListener('click', closeNotificationSettings);
        }
        
        const saveSettingsBtn = document.querySelector('[onclick="saveNotificationSettings()"]');
        if (saveSettingsBtn) {
            saveSettingsBtn.removeAttribute('onclick');
            saveSettingsBtn.addEventListener('click', saveNotificationSettings);
        }
        
        // 토스트 닫기 버튼
        const toastCloseBtn = document.querySelector('[onclick="closeToast()"]');
        if (toastCloseBtn) {
            toastCloseBtn.removeAttribute('onclick');
            toastCloseBtn.addEventListener('click', closeToast);
        }
        
        // 개별 알림 액션 버튼들 설정
        setupIndividualNotificationActions();
        
    } catch (error) {
        console.error('알림 페이지 이벤트 설정 실패:', error);
    }
}

// 개별 알림 액션 설정
function setupIndividualNotificationActions() {
    try {
        // 읽음 처리 버튼들
        const markReadBtns = document.querySelectorAll('[onclick^="markAsRead("]');
        markReadBtns.forEach(btn => {
            const onclickAttr = btn.getAttribute('onclick');
            const idMatch = onclickAttr.match(/markAsRead\((\d+)\)/);
            if (idMatch) {
                const notificationId = idMatch[1];
                btn.removeAttribute('onclick');
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    markAsRead(parseInt(notificationId));
                });
            }
        });
        
        // 삭제 버튼들
        const deleteBtns = document.querySelectorAll('[onclick^="deleteNotification("]');
        deleteBtns.forEach(btn => {
            const onclickAttr = btn.getAttribute('onclick');
            const idMatch = onclickAttr.match(/deleteNotification\((\d+)\)/);
            if (idMatch) {
                const notificationId = idMatch[1];
                btn.removeAttribute('onclick');
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    deleteNotification(parseInt(notificationId));
                });
            }
        });
        
        // 액션 버튼들
        const actionBtns = document.querySelectorAll('[onclick^="viewReportDetail("], [onclick^="viewWitnessDetail("], [onclick^="viewMissingPerson("], [onclick^="goToPointShop()"], [onclick^="goToMyPage()"], [onclick^="resubmitWitnessReport("], [onclick^="startTutorial()"]');
        actionBtns.forEach(btn => {
            const onclickAttr = btn.getAttribute('onclick');
            btn.removeAttribute('onclick');
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                executeActionFromString(onclickAttr);
            });
        });
        
    } catch (error) {
        console.error('개별 알림 액션 설정 실패:', error);
    }
}

// 문자열로부터 액션 실행
function executeActionFromString(actionString) {
    try {
        if (actionString.includes('viewReportDetail(')) {
            const match = actionString.match(/viewReportDetail\(([^)]+)\)/);
            if (match) {
                const id = match[1].replace(/['"]/g, '');
                viewReportDetail(id);
            }
        } else if (actionString.includes('viewWitnessDetail(')) {
            const match = actionString.match(/viewWitnessDetail\(([^)]+)\)/);
            if (match) {
                const id = match[1].replace(/['"]/g, '');
                viewWitnessDetail(id);
            }
        } else if (actionString.includes('viewMissingPerson(')) {
            const match = actionString.match(/viewMissingPerson\(([^)]+)\)/);
            if (match) {
                const id = match[1].replace(/['"]/g, '');
                viewMissingPerson(id);
            }
        } else if (actionString.includes('goToPointShop()')) {
            goToPointShop();
        } else if (actionString.includes('goToMyPage()')) {
            goToMyPage();
        } else if (actionString.includes('resubmitWitnessReport(')) {
            const match = actionString.match(/resubmitWitnessReport\(([^)]+)\)/);
            if (match) {
                const id = match[1].replace(/['"]/g, '');
                resubmitWitnessReport(id);
            }
        } else if (actionString.includes('startTutorial()')) {
            startTutorial();
        }
    } catch (error) {
        console.error('액션 실행 실패:', error);
    }
}

// 브라우저 알림 권한 요청
function requestNotificationPermission() {
    try {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('알림 권한이 허용되었습니다.');
                    if (window.showNotification) {
                        window.showNotification('브라우저 알림이 활성화되었습니다.', 'success');
                    }
                }
            });
        }
    } catch (error) {
        console.error('알림 권한 요청 실패:', error);
    }
}

// 실시간 알림 시작
function startRealTimeNotifications() {
    try {
        // 10초마다 5% 확률로 새 알림 생성 (데모용)
        setInterval(() => {
            if (Math.random() > 0.95) {
                showNewNotification();
            }
        }, 10000);
    } catch (error) {
        console.error('실시간 알림 시작 실패:', error);
    }
}

// 새 알림 표시
function showNewNotification() {
    try {
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
                category: 'system',
                importance: 'low'
            },
            {
                title: '긴급 실종자',
                message: '회원님 근처에 새로운 실종자가 신고되었습니다.',
                category: 'reports',
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
                icon: '/static/images/favicon.png'
            });
        }
        
        // 페이지에 새 알림 추가
        addNotificationToPage(randomNotification);
        
    } catch (error) {
        console.error('새 알림 표시 실패:', error);
    }
}

// 토스트 알림 표시
function showToast(title, message) {
    try {
        const toast = document.getElementById('notificationToast');
        if (!toast) return;
        
        const titleEl = toast.querySelector('.toast-title');
        const messageEl = toast.querySelector('.toast-message');
        
        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;
        
        toast.classList.add('show');
        
        // 5초 후 자동 숨김
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    } catch (error) {
        console.error('토스트 표시 실패:', error);
    }
}

// 토스트 닫기
function closeToast() {
    try {
        const toast = document.getElementById('notificationToast');
        if (toast) {
            toast.classList.remove('show');
        }
    } catch (error) {
        console.error('토스트 닫기 실패:', error);
    }
}

// 알림 필터링
function filterNotifications(category) {
    try {
        currentFilter = category;
        
        // 필터 버튼 업데이트
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            if (btn) {
                btn.classList.remove('active');
            }
        });
        
        const activeBtn = document.querySelector(`[data-filter="${category}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // 알림 아이템 필터링
        const notifications = document.querySelectorAll('.notification-item');
        const visibleNotifications = [];
        
        notifications.forEach(notification => {
            if (!notification) return;
            
            if (category === 'all' || notification.dataset.category === category) {
                notification.style.display = 'block';
                visibleNotifications.push(notification);
            } else {
                notification.style.display = 'none';
            }
        });
        
        // 애니메이션 효과
        if (typeof gsap !== 'undefined' && visibleNotifications.length > 0) {
            gsap.from(visibleNotifications, {
                duration: 0.4,
                x: -20,
                opacity: 0,
                stagger: 0.05,
                ease: 'power2.out'
            });
        }
    } catch (error) {
        console.error('알림 필터링 실패:', error);
    }
}

// 알림 정렬
function sortNotifications() {
    try {
        const sortSelect = document.getElementById('sortOrder');
        if (!sortSelect) return;
        
        const sortValue = sortSelect.value;
        const container = document.querySelector('.notifications-list .container');
        if (!container) return;
        
        const sections = Array.from(container.querySelectorAll('.notifications-section:not(.collapsed)'));
        
        sections.forEach(section => {
            const items = Array.from(section.querySelectorAll('.notification-item'));
            
            items.sort((a, b) => {
                switch(sortValue) {
                    case 'oldest':
                        return new Date(a.dataset.time || 0) - new Date(b.dataset.time || 0);
                    case 'importance':
                        const importanceA = a.classList.contains('important') ? 2 : (a.classList.contains('unread') ? 1 : 0);
                        const importanceB = b.classList.contains('important') ? 2 : (b.classList.contains('unread') ? 1 : 0);
                        return importanceB - importanceA;
                    case 'newest':
                    default:
                        return new Date(b.dataset.time || 0) - new Date(a.dataset.time || 0);
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
    } catch (error) {
        console.error('알림 정렬 실패:', error);
    }
}

// 읽음 상태별 필터링
function filterByReadStatus() {
    try {
        const readStatusSelect = document.getElementById('readStatus');
        if (!readStatusSelect) return;
        
        const readStatus = readStatusSelect.value;
        const notifications = document.querySelectorAll('.notification-item');
        
        notifications.forEach(notification => {
            if (!notification) return;
            
            const isUnread = notification.classList.contains('unread');
            let show = true;
            
            if (readStatus === 'unread' && !isUnread) {
                show = false;
            } else if (readStatus === 'read' && isUnread) {
                show = false;
            }
            
            notification.style.display = show ? 'block' : 'none';
        });
    } catch (error) {
        console.error('읽음 상태 필터링 실패:', error);
    }
}

// 알림을 읽음으로 표시
function markAsRead(notificationId) {
    try {
        const notification = document.querySelector(`[data-id="${notificationId}"]`);
        if (!notification) return;
        
        notification.classList.remove('unread');
        notification.classList.add('read');
        
        // 읽지 않은 알림 수 업데이트
        updateUnreadCount();
        
        if (window.showNotification) {
            window.showNotification('알림을 읽음으로 표시했습니다.', 'success');
        }
        
        // 서버에 읽음 상태 전송 (실제 구현 시)
        fetch(`/api/notifications/${notificationId}/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).catch(error => {
            console.error('서버 전송 실패:', error);
        });
        
    } catch (error) {
        console.error('알림 읽음 처리 실패:', error);
    }
}

// 모든 알림을 읽음으로 표시
function markAllAsRead() {
    try {
        const unreadNotifications = document.querySelectorAll('.notification-item.unread');
        
        unreadNotifications.forEach(notification => {
            if (notification) {
                notification.classList.remove('unread');
                notification.classList.add('read');
            }
        });
        
        updateUnreadCount();
        
        if (window.showNotification && unreadNotifications.length > 0) {
            window.showNotification(`${unreadNotifications.length}개의 알림을 읽음으로 표시했습니다.`, 'success');
        }
        
        // 서버에 전체 읽음 상태 전송
        fetch('/api/notifications/mark-all-read', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).catch(error => {
            console.error('서버 전송 실패:', error);
        });
        
    } catch (error) {
        console.error('모든 알림 읽음 처리 실패:', error);
    }
}

// 알림 삭제
function deleteNotification(notificationId) {
    try {
        const notification = document.querySelector(`[data-id="${notificationId}"]`);
        if (!notification) return;
        
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
    } catch (error) {
        console.error('알림 삭제 실패:', error);
    }
}

// 읽은 알림 삭제
function deleteReadNotifications() {
    try {
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
    } catch (error) {
        console.error('읽은 알림 삭제 실패:', error);
    }
}

// 알림 개수 업데이트
function updateNotificationCounts() {
    try {
        const totalNotifications = document.querySelectorAll('.notification-item').length;
        const unreadNotifications = document.querySelectorAll('.notification-item.unread').length;
        const importantNotifications = document.querySelectorAll('.notification-item.important').length;
        
        const totalEl = document.getElementById('totalNotifications');
        const unreadEl = document.getElementById('unreadNotifications');
        const importantEl = document.getElementById('importantNotifications');
        
        if (totalEl) totalEl.textContent = totalNotifications;
        if (unreadEl) unreadEl.textContent = unreadNotifications;
        if (importantEl) importantEl.textContent = importantNotifications;
        
        // 필터 버튼 카운트 업데이트
        updateFilterCounts();
    } catch (error) {
        console.error('알림 개수 업데이트 실패:', error);
    }
}

// 읽지 않은 알림 수 업데이트
function updateUnreadCount() {
    try {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const unreadEl = document.getElementById('unreadNotifications');
        if (unreadEl) {
            unreadEl.textContent = unreadCount;
        }
    } catch (error) {
        console.error('읽지 않은 알림 수 업데이트 실패:', error);
    }
}

// 필터 카운트 업데이트
function updateFilterCounts() {
    try {
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
    } catch (error) {
        console.error('필터 카운트 업데이트 실패:', error);
    }
}

// 섹션 토글
function toggleSection(sectionId) {
    try {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        const toggleIcon = section.querySelector('.toggle-icon');
        
        section.classList.toggle('collapsed');
        
        if (toggleIcon) {
            if (section.classList.contains('collapsed')) {
                toggleIcon.style.transform = 'rotate(0deg)';
            } else {
                toggleIcon.style.transform = 'rotate(180deg)';
            }
        }
    } catch (error) {
        console.error('섹션 토글 실패:', error);
    }
}

// 더 많은 알림 로드
function loadMoreNotifications() {
    try {
        const btn = event.target;
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로딩 중...';
        btn.disabled = true;
        
        setTimeout(() => {
            // 더미 알림 추가
            const olderSection = document.getElementById('olderNotifications');
            if (!olderSection) {
                btn.innerHTML = originalText;
                btn.disabled = false;
                return;
            }
            
            const sectionContent = olderSection.querySelector('.section-content');
            if (!sectionContent) {
                btn.innerHTML = originalText;
                btn.disabled = false;
                return;
            }
            
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
                
                sectionContent.insertBefore(notification, sectionContent.lastElementChild);
            }
            
            // 애니메이션 효과
            if (typeof gsap !== 'undefined') {
                const newNotifications = sectionContent.querySelectorAll('.notification-item:nth-last-child(-n+5)');
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
    } catch (error) {
        console.error('더 많은 알림 로드 실패:', error);
    }
}

// 알림 설정 모달
function toggleNotificationSettings() {
    try {
        const modal = document.getElementById('notificationSettingsModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    } catch (error) {
        console.error('알림 설정 모달 열기 실패:', error);
    }
}

function closeNotificationSettings() {
    try {
        const modal = document.getElementById('notificationSettingsModal');
        if (modal) {
            modal.style.display = 'none';
        }
    } catch (error) {
        console.error('알림 설정 모달 닫기 실패:', error);
    }
}

function saveNotificationSettings() {
    try {
        closeNotificationSettings();
        
        if (window.showNotification) {
            window.showNotification('알림 설정이 저장되었습니다.', 'success');
        }
    } catch (error) {
        console.error('알림 설정 저장 실패:', error);
    }
}

// 액션 버튼 핸들러들
function viewReportDetail(id) {
    try {
        window.location.href = `/missing/${id}`;
    } catch (error) {
        console.error('신고 상세 보기 실패:', error);
    }
}

function viewWitnessDetail(id) {
    try {
        if (window.showNotification) {
            window.showNotification('목격 신고 상세 페이지로 이동합니다.', 'info');
        }
    } catch (error) {
        console.error('목격 상세 보기 실패:', error);
    }
}

function viewMissingPerson(id) {
    try {
        window.location.href = `/missing/${id}`;
    } catch (error) {
        console.error('실종자 상세 보기 실패:', error);
    }
}

function goToPointShop() {
    try {
        window.location.href = '/pointshop';
    } catch (error) {
        console.error('포인트샵 이동 실패:', error);
    }
}

function goToMyPage() {
    try {
        window.location.href = '/mypage';
    } catch (error) {
        console.error('마이페이지 이동 실패:', error);
    }
}

function resubmitWitnessReport(id) {
    try {
        if (window.showNotification) {
            window.showNotification('목격 신고 재작성 페이지로 이동합니다.', 'info');
        }
    } catch (error) {
        console.error('목격 신고 재작성 실패:', error);
    }
}

function startTutorial() {
    try {
        if (window.showNotification) {
            window.showNotification('튜토리얼을 시작합니다.', 'info');
        }
    } catch (error) {
        console.error('튜토리얼 시작 실패:', error);
    }
}

// 페이지에 새 알림 추가
function addNotificationToPage(notificationData) {
    try {
        const todaySection = document.querySelector('.notifications-section:first-child');
        if (!todaySection) return;
        
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
    } catch (error) {
        console.error('페이지에 새 알림 추가 실패:', error);
    }
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
async function loadNotifications() {
    try {
        // 실제로는 서버에서 알림 데이터를 가져옴
        const response = await fetch('/api/notifications?limit=20');
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                notifications = data.notifications;
                updateNotificationCounts();
            }
        }
    } catch (error) {
        console.error('알림 데이터 로드 실패:', error);
    }
}

// 모달 외부 클릭시 닫기
function setupModalCloseEvents() {
    try {
        const modal = document.getElementById('notificationSettingsModal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeNotificationSettings();
                }
            });
        }
    } catch (error) {
        console.error('모달 이벤트 설정 실패:', error);
    }
}

// 전역 함수 내보내기
window.initializeNotifications = initializeNotifications;
window.filterNotifications = filterNotifications;
window.sortNotifications = sortNotifications;
window.filterByReadStatus = filterByReadStatus;
window.markAsRead = markAsRead;
window.markAllAsRead = markAllAsRead;
window.deleteNotification = deleteNotification;
window.deleteReadNotifications = deleteReadNotifications;
window.loadMoreNotifications = loadMoreNotifications;
window.toggleNotificationSettings = toggleNotificationSettings;
window.closeNotificationSettings = closeNotificationSettings;
window.saveNotificationSettings = saveNotificationSettings;
window.closeToast = closeToast;
window.toggleSection = toggleSection;

// 즉시 실행
(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initializeNotifications();
            setupModalCloseEvents();
        });
    } else {
        initializeNotifications();
        setupModalCloseEvents();
    }
})();