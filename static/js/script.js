// static/js/script.js

// React를 사용한 알림 시스템 관리
const { useState, useEffect, useCallback } = React;

// 전역 변수 및 설정
window.APP = {
    isLoggedIn: false,
    user: null,
    currentPage: null,
    notifications: [],
    config: {
        scrollOffset: 100
    },
    initialized: false
};

// DOM 완전 로딩 대기 함수
function waitForDOMReady() {
    return new Promise((resolve) => {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            resolve();
        } else {
            document.addEventListener('DOMContentLoaded', resolve, { once: true });
        }
    });
}

// 앱 초기화
async function initializeApp() {
    if (window.APP.initialized) return;
    
    try {
        await waitForDOMReady();
        
        optimizePageScroll();
        identifyCurrentPage();
        setupEventListeners();
        checkAuthStatus();
        handleResponsive();
        await initializeNotificationSystem();
        initializePageCards();
        
        window.APP.initialized = true;
        
    } catch (error) {
        console.error('앱 초기화 실패:', error);
    }
}

// 알림 시스템 초기화 - GSAP 애니메이션 추가
async function initializeNotificationSystem() {
    try {
        const notificationBellBtn = document.getElementById('notificationBellBtn');
        const notificationPanel = document.getElementById('notificationPanel');
        const notificationOverlay = document.getElementById('notificationOverlay');
        const closePanelBtn = document.getElementById('closePanelBtn');
        const deleteAllBtn = document.getElementById('deleteAllBtn');
        
        if (!notificationBellBtn || !notificationPanel || !notificationOverlay) {
            console.error('필수 알림 DOM 요소를 찾을 수 없습니다');
            return;
        }
        
        // 기존 이벤트 리스너 제거
        notificationBellBtn.removeEventListener('click', toggleNotificationPanel);
        
        // 알림 종 버튼 클릭 이벤트
        notificationBellBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleNotificationPanel();
        });
        
        // 닫기 버튼 이벤트
        if (closePanelBtn) {
            closePanelBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeNotificationPanel();
            });
        }
        
        // 전체 삭제 버튼 이벤트 - 커스텀 모달 사용
        if (deleteAllBtn) {
            deleteAllBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                showDeleteConfirmModal();
            });
        }
        
        // 오버레이 클릭으로 닫기
        notificationOverlay.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeNotificationPanel();
        });
        
        // 외부 클릭으로 닫기
        document.addEventListener('click', function(e) {
            if (!notificationPanel.contains(e.target) && !notificationBellBtn.contains(e.target)) {
                closeNotificationPanel();
            }
        });
        
        // ESC 키로 닫기
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeNotificationPanel();
                hideDeleteConfirmModal();
            }
        });
        
        // 알림 패널 스크롤 분리 설정
        setupNotificationPanelScrollIsolation();
        setupNotificationFilters();
        setupNotificationActions();
        updateNotificationBadge();
        startNotificationSimulation();
        
    } catch (error) {
        console.error('알림 시스템 초기화 실패:', error);
    }
}

// 알림 패널 스크롤 분리 설정
function setupNotificationPanelScrollIsolation() {
    try {
        const notificationPanel = document.getElementById('notificationPanel');
        const notificationItems = document.querySelector('.notification-items');
        
        if (!notificationPanel || !notificationItems) return;
        
        // 알림 패널 내에서 마우스 휠 이벤트 분리
        notificationPanel.addEventListener('wheel', function(e) {
            e.stopPropagation();
        }, { passive: true });
        
        // 알림 아이템 컨테이너에서 스크롤 이벤트 분리
        notificationItems.addEventListener('wheel', function(e) {
            e.stopPropagation();
            
            const isScrollable = notificationItems.scrollHeight > notificationItems.clientHeight;
            if (!isScrollable) return;
            
            const isAtTop = notificationItems.scrollTop === 0;
            const isAtBottom = notificationItems.scrollTop + notificationItems.clientHeight >= notificationItems.scrollHeight;
            
            // 스크롤이 맨 위나 맨 아래에 있을 때 바디 스크롤 방지
            if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // 터치 이벤트도 분리
        notificationPanel.addEventListener('touchmove', function(e) {
            e.stopPropagation();
        }, { passive: true });
        
    } catch (error) {
        console.error('알림 패널 스크롤 분리 설정 실패:', error);
    }
}

// 삭제 확인 모달 표시
function showDeleteConfirmModal() {
    try {
        const notifications = document.querySelectorAll('.notification-item');
        
        if (notifications.length === 0) {
            if (window.showNotification) {
                window.showNotification('삭제할 알림이 없습니다.', 'info');
            }
            return;
        }
        
        const modal = document.getElementById('deleteConfirmModal');
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        const cancelBtn = document.getElementById('cancelDeleteBtn');
        
        if (!modal) return;
        
        // 모달 표시
        modal.style.display = 'flex';
        
        // GSAP 애니메이션
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(modal, 
                { opacity: 0 },
                { duration: 0.3, opacity: 1, ease: 'power2.out' }
            );
            
            const content = modal.querySelector('.delete-confirm-content');
            if (content) {
                gsap.fromTo(content,
                    { scale: 0.8, opacity: 0 },
                    { duration: 0.3, scale: 1, opacity: 1, ease: 'back.out(1.7)', delay: 0.1 }
                );
            }
        }
        
        // 확인 버튼 이벤트
        const handleConfirm = function(e) {
            e.preventDefault();
            e.stopPropagation();
            confirmDeleteAllNotifications();
            hideDeleteConfirmModal();
            confirmBtn.removeEventListener('click', handleConfirm);
        };
        
        // 취소 버튼 이벤트
        const handleCancel = function(e) {
            e.preventDefault();
            e.stopPropagation();
            hideDeleteConfirmModal();
            cancelBtn.removeEventListener('click', handleCancel);
        };
        
        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
        
    } catch (error) {
        console.error('삭제 확인 모달 표시 실패:', error);
    }
}

// 삭제 확인 모달 숨기기
function hideDeleteConfirmModal() {
    try {
        const modal = document.getElementById('deleteConfirmModal');
        if (!modal) return;
        
        // GSAP 애니메이션
        if (typeof gsap !== 'undefined') {
            gsap.to(modal, {
                duration: 0.2,
                opacity: 0,
                ease: 'power2.in',
                onComplete: () => {
                    modal.style.display = 'none';
                }
            });
        } else {
            modal.style.display = 'none';
        }
        
    } catch (error) {
        console.error('삭제 확인 모달 숨기기 실패:', error);
    }
}

// 실제 전체 알림 삭제 실행
function confirmDeleteAllNotifications() {
    try {
        const notifications = document.querySelectorAll('.notification-item');
        
        if (notifications.length === 0) return;
        
        // GSAP 애니메이션으로 순차 삭제
        if (typeof gsap !== 'undefined') {
            notifications.forEach((notification, index) => {
                gsap.to(notification, {
                    duration: 0.2,
                    x: 100,
                    opacity: 0,
                    delay: index * 0.05,
                    ease: 'power2.in',
                    onComplete: () => {
                        notification.remove();
                        if (index === notifications.length - 1) {
                            updateNotificationBadge();
                            checkEmptyState();
                            
                            if (window.showNotification) {
                                window.showNotification(`${notifications.length}개의 알림을 모두 삭제했습니다.`, 'success');
                            }
                        }
                    }
                });
            });
        } else {
            notifications.forEach(notification => notification.remove());
            updateNotificationBadge();
            checkEmptyState();
            
            if (window.showNotification) {
                window.showNotification(`${notifications.length}개의 알림을 모두 삭제했습니다.`, 'success');
            }
        }
        
    } catch (error) {
        console.error('전체 알림 삭제 실행 실패:', error);
    }
}

// 알림 필터 설정
function setupNotificationFilters() {
    try {
        const filterBtns = document.querySelectorAll('.notification-filters .filter-btn');
        
        filterBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const filter = this.getAttribute('data-filter');
                    filterPanelNotifications(filter);
                });
            }
        });
    } catch (error) {
        console.error('알림 필터 설정 실패:', error);
    }
}

// 개별 알림 삭제 버튼 설정
function setupNotificationActions() {
    try {
        const deleteNotificationBtns = document.querySelectorAll('.delete-notification-btn');
        
        deleteNotificationBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const notificationId = this.getAttribute('data-id');
                    if (notificationId) {
                        deleteNotification(notificationId);
                    }
                });
            }
        });
    } catch (error) {
        console.error('알림 액션 설정 실패:', error);
    }
}

// 알림 패널 토글 - GSAP 애니메이션 적용
function toggleNotificationPanel() {
    try {
        const panel = document.getElementById('notificationPanel');
        const overlay = document.getElementById('notificationOverlay');
        
        if (!panel || !overlay) {
            console.error('알림 패널 또는 오버레이를 찾을 수 없습니다');
            return;
        }
        
        const isOpen = panel.classList.contains('show');
        
        if (isOpen) {
            closeNotificationPanel();
        } else {
            openNotificationPanel();
        }
    } catch (error) {
        console.error('알림 패널 토글 실패:', error);
    }
}

// 알림 패널 열기 - GSAP 애니메이션
function openNotificationPanel() {
    try {
        const panel = document.getElementById('notificationPanel');
        const overlay = document.getElementById('notificationOverlay');
        
        if (!panel || !overlay) {
            console.error('알림 패널 요소를 찾을 수 없습니다');
            return;
        }
        
        closeAllDropdowns();
        
        // CSS 클래스 추가
        panel.classList.add('show');
        overlay.classList.add('show');
        
        // GSAP 애니메이션
        if (typeof gsap !== 'undefined') {
            // 패널 초기 상태 설정
            gsap.set(panel, {
                display: 'block',
                visibility: 'visible',
                opacity: 0,
                scale: 0.8,
                x: 50,
                transformOrigin: 'top right'
            });
            
            // 오버레이 초기 상태 설정
            gsap.set(overlay, {
                display: 'block',
                visibility: 'visible',
                opacity: 0
            });
            
            // 오버레이 애니메이션
            gsap.to(overlay, {
                duration: 0.3,
                opacity: 1,
                ease: 'power2.out'
            });
            
            // 패널 애니메이션 (알림 목록 애니메이션 제거)
            gsap.to(panel, {
                duration: 0.4,
                opacity: 1,
                scale: 1,
                x: 0,
                ease: 'back.out(1.7)'
            });
        }
        
        // 접근성을 위한 포커스 이동
        const firstFocusable = panel.querySelector('button, a, [tabindex="0"]');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 400);
        }
        
    } catch (error) {
        console.error('알림 패널 열기 실패:', error);
    }
}

// 알림 패널 닫기 - GSAP 애니메이션
function closeNotificationPanel() {
    try {
        const panel = document.getElementById('notificationPanel');
        const overlay = document.getElementById('notificationOverlay');
        
        if (!panel || !overlay) return;
        
        // GSAP 애니메이션
        if (typeof gsap !== 'undefined') {
            // 오버레이 애니메이션
            gsap.to(overlay, {
                duration: 0.2,
                opacity: 0,
                ease: 'power2.out'
            });
            
            // 패널 애니메이션
            gsap.to(panel, {
                duration: 0.3,
                opacity: 0,
                scale: 0.8,
                x: 50,
                ease: 'power2.in',
                onComplete: () => {
                    panel.classList.remove('show');
                    overlay.classList.remove('show');
                    gsap.set([panel, overlay], {
                        display: 'none',
                        visibility: 'hidden'
                    });
                }
            });
        } else {
            // GSAP가 없는 경우 기본 처리
            panel.classList.remove('show');
            overlay.classList.remove('show');
        }
        
    } catch (error) {
        console.error('알림 패널 닫기 실패:', error);
    }
}

// 개별 알림 삭제 - GSAP 애니메이션
function deleteNotification(notificationId) {
    try {
        const notification = document.querySelector(`[data-id="${notificationId}"]`);
        if (!notification) return;
        
        // GSAP 애니메이션으로 삭제
        if (typeof gsap !== 'undefined') {
            gsap.to(notification, {
                duration: 0.3,
                x: 100,
                opacity: 0,
                height: 0,
                marginBottom: 0,
                paddingTop: 0,
                paddingBottom: 0,
                ease: 'power2.in',
                onComplete: () => {
                    notification.remove();
                    updateNotificationBadge();
                    checkEmptyState();
                    
                    if (window.showNotification) {
                        window.showNotification('알림을 삭제했습니다.', 'success');
                    }
                }
            });
        } else {
            notification.remove();
            updateNotificationBadge();
            checkEmptyState();
        }
        
    } catch (error) {
        console.error('알림 삭제 실패:', error);
    }
}

// 빈 상태 확인
function checkEmptyState() {
    try {
        const notificationItems = document.getElementById('notificationItems');
        const notificationEmpty = document.getElementById('notificationEmpty');
        const notifications = document.querySelectorAll('.notification-item');
        
        if (notifications.length === 0) {
            if (notificationItems) notificationItems.style.display = 'none';
            if (notificationEmpty) notificationEmpty.style.display = 'flex';
        } else {
            if (notificationItems) notificationItems.style.display = 'block';
            if (notificationEmpty) notificationEmpty.style.display = 'none';
        }
    } catch (error) {
        console.error('빈 상태 확인 실패:', error);
    }
}

// 패널 알림 필터링 - 등장 애니메이션 제거
function filterPanelNotifications(category) {
    try {
        // 필터 버튼 업데이트
        const filterBtns = document.querySelectorAll('.notification-filters .filter-btn');
        filterBtns.forEach(btn => {
            if (btn) {
                btn.classList.remove('active');
            }
        });
        
        const activeBtn = document.querySelector(`[data-filter="${category}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // 알림 아이템 필터링 (애니메이션 제거)
        const notifications = document.querySelectorAll('.notification-item');
        
        notifications.forEach(notification => {
            if (!notification) return;
            
            if (category === 'all' || notification.dataset.category === category) {
                notification.style.display = 'flex';
            } else {
                notification.style.display = 'none';
            }
        });
        
    } catch (error) {
        console.error('패널 알림 필터링 실패:', error);
    }
}

// 알림 배지 업데이트
function updateNotificationBadge() {
    try {
        const badge = document.getElementById('notificationBadge');
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = 'N';
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
        
        updateFilterCounts();
        
    } catch (error) {
        console.error('알림 배지 업데이트 실패:', error);
    }
}

// 필터 카운트 업데이트
function updateFilterCounts() {
    try {
        const categories = ['all', 'reports', 'witnesses', 'system'];
        
        categories.forEach(category => {
            let count;
            if (category === 'all') {
                count = document.querySelectorAll('.notification-item').length;
            } else {
                count = document.querySelectorAll(`.notification-item[data-category="${category}"]`).length;
            }
            
            const countElement = document.getElementById(`${category}Count`);
            if (countElement) {
                countElement.textContent = count;
            }
        });
        
    } catch (error) {
        console.error('필터 카운트 업데이트 실패:', error);
    }
}

// 새 알림 추가 - GSAP 애니메이션
function addNewNotification(notificationData) {
    try {
        const notificationItems = document.getElementById('notificationItems');
        const notificationEmpty = document.getElementById('notificationEmpty');
        
        if (!notificationItems) return;
        
        // 빈 상태 숨기기
        if (notificationEmpty) {
            notificationEmpty.style.display = 'none';
        }
        if (notificationItems.style.display === 'none') {
            notificationItems.style.display = 'block';
        }
        
        const newNotification = document.createElement('div');
        newNotification.className = 'notification-item unread';
        newNotification.dataset.category = notificationData.category;
        const notificationId = Date.now();
        newNotification.dataset.id = notificationId;
        
        const iconClass = getNotificationIconClass(notificationData.category, notificationData.type);
        
        newNotification.innerHTML = `
            <div class="notification-icon ${notificationData.type || 'info'}">
                <i class="${iconClass}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${notificationData.title}</div>
                <div class="notification-message">${notificationData.message}</div>
                <div class="notification-time">방금 전</div>
            </div>
            <div class="notification-actions">
                <button class="delete-notification-btn" data-id="${notificationId}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // 맨 위에 추가
        notificationItems.insertBefore(newNotification, notificationItems.firstChild);
        
        // 새로 추가된 버튼에 이벤트 추가
        const newDeleteBtn = newNotification.querySelector('.delete-notification-btn');
        if (newDeleteBtn) {
            newDeleteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const id = this.getAttribute('data-id');
                deleteNotification(id);
            });
        }
        
        // GSAP 애니메이션
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(newNotification, 
                {
                    x: -50,
                    opacity: 0,
                    scale: 0.9
                },
                {
                    duration: 0.4,
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    ease: 'back.out(1.7)'
                }
            );
        }
        
        updateNotificationBadge();
        
        // 브라우저 알림 표시 (alert 대신 브라우저 Notification API 사용)
        if (Notification.permission === 'granted') {
            new Notification(notificationData.title, {
                body: notificationData.message,
                icon: '/static/images/favicon.png'
            });
        }
        
    } catch (error) {
        console.error('새 알림 추가 실패:', error);
    }
}

// 알림 아이콘 클래스 반환 - 모든 알림에 적절한 아이콘 추가
function getNotificationIconClass(category, type) {
    const iconMap = {
        'reports': {
            'critical': 'fas fa-exclamation-triangle',
            'info': 'fas fa-file-alt',
            'success': 'fas fa-check-circle'
        },
        'witnesses': {
            'info': 'fas fa-eye',
            'success': 'fas fa-eye',
            'critical': 'fas fa-binoculars'
        },
        'system': {
            'success': 'fas fa-coins',
            'info': 'fas fa-megaphone',
            'critical': 'fas fa-bell'
        }
    };
    
    if (iconMap[category] && iconMap[category][type]) {
        return iconMap[category][type];
    }
    
    // 기본 아이콘
    const defaultIcons = {
        'reports': 'fas fa-file-alt',
        'witnesses': 'fas fa-eye',
        'system': 'fas fa-megaphone'
    };
    
    return defaultIcons[category] || 'fas fa-bell';
}

// 실시간 알림 시뮬레이션
function startNotificationSimulation() {
    try {
        // 30초마다 2% 확률로 새 알림 생성
        setInterval(() => {
            if (Math.random() > 0.98) {
                const notifications = [
                    {
                        title: '새로운 목격 신고',
                        message: '김철수님에 대한 새로운 목격 정보가 접수되었습니다.',
                        category: 'witnesses',
                        type: 'info'
                    },
                    {
                        title: '포인트 적립',
                        message: '신고 승인으로 50포인트가 적립되었습니다.',
                        category: 'system',
                        type: 'success'
                    },
                    {
                        title: '긴급 실종자',
                        message: '근처에 새로운 긴급 실종자가 신고되었습니다.',
                        category: 'reports',
                        type: 'critical'
                    }
                ];
                
                const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
                addNewNotification(randomNotification);
            }
        }, 30000);
        
    } catch (error) {
        console.error('알림 시뮬레이션 시작 실패:', error);
    }
}

// 페이지별 카드 초기화
function initializePageCards() {
    if (window.APP.currentPage === 'home') {
        setupHomePageCards();
    }
    setupUniversalCardEvents();
}

// 홈페이지 카드 설정
function setupHomePageCards() {
    try {
        const urgentCards = document.querySelectorAll('.urgent-cards .missing-card');
        
        urgentCards.forEach((card, index) => {
            if (!card) return;
            
            setupCardEvents(card);
        });
    } catch (error) {
        console.error('홈페이지 카드 설정 실패:', error);
    }
}

// 범용 카드 이벤트 설정
function setupUniversalCardEvents() {
    try {
        const allCards = document.querySelectorAll('.missing-card');
        
        allCards.forEach(card => {
            if (card) {
                setupCardEvents(card);
            }
        });
    } catch (error) {
        console.error('범용 카드 이벤트 설정 실패:', error);
    }
}

// 개별 카드 이벤트 설정
function setupCardEvents(card) {
    if (!card) return;
    
    try {
        // UP 버튼 이벤트
        const upStat = card.querySelector('.card-stats .stat');
        if (upStat && upStat.innerHTML && upStat.innerHTML.includes('fa-arrow-up')) {
            upStat.removeEventListener('click', handleUpClick);
            upStat.addEventListener('click', handleUpClick);
            upStat.style.cursor = 'pointer';
        }
        
        // 카드 클릭 시 상세 페이지로 이동
        const detailLink = card.querySelector('.detail-link');
        if (!detailLink) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function(e) {
                if (!e.target.closest('.stat')) {
                    const cardId = this.dataset.id || extractCardId(this);
                    if (cardId) {
                        window.location.href = `/missing/${cardId}`;
                    }
                }
            });
        }
    } catch (error) {
        console.error('카드 이벤트 설정 실패:', error);
    }
}

// UP 클릭 핸들러
function handleUpClick(e) {
    if (!e) return;
    
    try {
        e.preventDefault();
        e.stopPropagation();
        
        const stat = e.currentTarget;
        if (!stat) return;
        
        // UP 카운트 증가
        const countText = stat.textContent ? stat.textContent.trim() : '';
        const currentCount = parseInt(countText.replace(/\D/g, '')) || 0;
        const newCount = currentCount + 1;
        
        stat.innerHTML = `<i class="fas fa-arrow-up"></i> ${newCount}`;
        
        if (window.showNotification) {
            window.showNotification('UP을 눌렀습니다! 실종자 찾기에 도움이 됩니다.', 'success');
        }
        
        const cardId = extractCardId(stat.closest('.missing-card'));
        if (cardId) {
            sendUpToServer(cardId, newCount);
        }
    } catch (error) {
        console.error('UP 클릭 처리 실패:', error);
    }
}

// 카드 ID 추출
function extractCardId(card) {
    if (!card) return null;
    
    try {
        if (card.dataset && card.dataset.id) {
            return card.dataset.id;
        }
        
        const detailLink = card.querySelector('.detail-link');
        if (detailLink && detailLink.href) {
            const match = detailLink.href.match(/\/missing\/(\d+)/);
            return match ? match[1] : null;
        }
        
        const pathMatch = window.location.pathname.match(/\/missing\/(\d+)/);
        return pathMatch ? pathMatch[1] : null;
    } catch (error) {
        console.error('카드 ID 추출 실패:', error);
        return null;
    }
}

// 서버에 UP 정보 전송
function sendUpToServer(cardId, newCount) {
    if (!cardId) return;
    
    try {
        fetch(`/api/missing/${cardId}/up`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                count: newCount 
            })
        }).catch(error => {
            console.error('서버 전송 실패:', error);
        });
    } catch (error) {
        console.error('UP 서버 전송 중 실패:', error);
    }
}

// 스크롤 위치 최적화
function optimizePageScroll() {
    try {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
        
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);
    } catch (error) {
        console.error('스크롤 최적화 실패:', error);
    }
}

// 현재 페이지 식별
function identifyCurrentPage() {
    try {
        const path = window.location.pathname;
        
        if (path === '/' || path === '/index') {
            window.APP.currentPage = 'home';
        } else if (path.includes('/search')) {
            window.APP.currentPage = 'search';
        } else if (path.includes('/about')) {
            window.APP.currentPage = 'about';
        } else if (path.includes('/ranking')) {
            window.APP.currentPage = 'ranking';
        } else if (path.includes('/login')) {
            window.APP.currentPage = 'login';
        } else if (path.includes('/register')) {
            window.APP.currentPage = 'register';
        } else {
            window.APP.currentPage = 'unknown';
        }
        
        if (document.body) {
            document.body.classList.add(`page-${window.APP.currentPage}`);
        }
    } catch (error) {
        console.error('페이지 식별 실패:', error);
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    try {
        // 모바일 메뉴 토글
        const mobileToggle = document.querySelector('.mobile-menu-btn');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', toggleMobileMenu);
        }
        
        // 사용자 메뉴 토글
        const userBtn = document.querySelector('.profile-btn');
        if (userBtn) {
            userBtn.addEventListener('click', toggleUserMenu);
        }
        
        // 스크롤 이벤트
        let isScrolling = false;
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                requestAnimationFrame(() => {
                    handleScroll();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
        
        // 리사이즈 이벤트
        window.addEventListener('resize', debounce(handleResize, 250));
        
        setupSmoothScroll();
        initializeNavigation();
        setupKeyboardNavigation();
        setupPageTransitionOptimization();
        
    } catch (error) {
        console.error('이벤트 리스너 설정 실패:', error);
    }
}

// 나머지 함수들은 기존과 동일하게 유지
function setupPageTransitionOptimization() {
    try {
        const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
        
        internalLinks.forEach(link => {
            if (link) {
                link.addEventListener('click', function(e) {
                    if ('scrollRestoration' in history) {
                        history.scrollRestoration = 'manual';
                    }
                });
            }
        });
        
        window.addEventListener('popstate', function() {
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 0);
        });
    } catch (error) {
        console.error('페이지 전환 최적화 실패:', error);
    }
}

function setupKeyboardNavigation() {
    try {
        document.addEventListener('keydown', function(e) {
            if (!e) return;
            
            if (e.key === 'Escape') {
                closeAllDropdowns();
                closeNotificationPanel();
                hideDeleteConfirmModal();
                if (document.activeElement && document.activeElement.blur) {
                    document.activeElement.blur();
                }
            }
            
            if (e.key === 'Tab') {
                if (document.body) {
                    document.body.classList.add('keyboard-nav');
                }
            }
        });
        
        document.addEventListener('mousedown', function() {
            if (document.body) {
                document.body.classList.remove('keyboard-nav');
            }
        });
    } catch (error) {
        console.error('키보드 접근성 설정 실패:', error);
    }
}

function initializeNavigation() {
    try {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '/' && href === '/index')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    } catch (error) {
        console.error('네비게이션 초기화 실패:', error);
    }
}

function checkAuthStatus() {
    try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
            window.APP.isLoggedIn = true;
            window.APP.user = JSON.parse(userData);
            updateUIForLoggedUser();
        } else {
            window.APP.isLoggedIn = false;
            updateUIForGuestUser();
        }
    } catch (error) {
        window.APP.isLoggedIn = false;
        updateUIForGuestUser();
        console.error('인증 상태 확인 실패:', error);
    }
}

function updateUIForLoggedUser() {
    try {
        const authRequired = document.querySelectorAll('.auth-required');
        authRequired.forEach(el => {
            if (el) {
                el.style.display = 'flex';
                el.setAttribute('aria-hidden', 'false');
            }
        });
        
        const guestActions = document.querySelectorAll('.guest-actions');
        guestActions.forEach(el => {
            if (el) {
                el.style.display = 'none';
                el.setAttribute('aria-hidden', 'true');
            }
        });
        
        if (window.APP.user) {
            const userNameEl = document.querySelector('.user-name');
            const userPointsEl = document.querySelector('.user-points');
            
            if (userNameEl) userNameEl.textContent = window.APP.user.name || '사용자';
            if (userPointsEl) userPointsEl.textContent = `${(window.APP.user.points || 0).toLocaleString()}P`;
        }
        
        if (document.body) {
            document.body.classList.add('user-authenticated');
            document.body.classList.remove('user-guest');
        }
    } catch (error) {
        console.error('로그인 UI 업데이트 실패:', error);
    }
}

function updateUIForGuestUser() {
    try {
        const authRequired = document.querySelectorAll('.auth-required');
        authRequired.forEach(el => {
            if (el) {
                el.style.display = 'none';
                el.setAttribute('aria-hidden', 'true');
            }
        });
        
        const guestActions = document.querySelectorAll('.guest-actions');
        guestActions.forEach(el => {
            if (el) {
                el.style.display = 'flex';
                el.setAttribute('aria-hidden', 'false');
            }
        });
        
        if (document.body) {
            document.body.classList.add('user-guest');
            document.body.classList.remove('user-authenticated');
        }
    } catch (error) {
        console.error('게스트 UI 업데이트 실패:', error);
    }
}

function toggleMobileMenu() {
    try {
        const mobileNav = document.querySelector('.mobile-nav');
        const toggle = document.querySelector('.mobile-menu-btn');
        
        if (!mobileNav || !toggle) return;
        
        const isOpen = mobileNav.classList.contains('active');
        
        if (isOpen) {
            mobileNav.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            mobileNav.style.display = 'none';
        } else {
            mobileNav.classList.add('active');
            toggle.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
            mobileNav.style.display = 'block';
            
            const firstLink = mobileNav.querySelector('a');
            if (firstLink && firstLink.focus) firstLink.focus();
        }
    } catch (error) {
        console.error('모바일 메뉴 토글 실패:', error);
    }
}

function toggleUserMenu() {
    try {
        const dropdown = document.getElementById('userMenuDropdown');
        if (!dropdown) return;
        
        const isOpen = dropdown.classList.contains('show');
        
        if (isOpen) {
            dropdown.classList.remove('show');
            dropdown.setAttribute('aria-hidden', 'true');
        } else {
            closeAllDropdowns();
            dropdown.classList.add('show');
            dropdown.setAttribute('aria-hidden', 'false');
        }
    } catch (error) {
        console.error('사용자 메뉴 토글 실패:', error);
    }
}

function closeAllDropdowns() {
    try {
        const dropdowns = document.querySelectorAll('.dropdown-menu, .user-dropdown, .notification-dropdown');
        
        dropdowns.forEach(dropdown => {
            if (dropdown) {
                dropdown.classList.remove('show');
                dropdown.setAttribute('aria-hidden', 'true');
            }
        });
    } catch (error) {
        console.error('드롭다운 닫기 실패:', error);
    }
}

function handleScroll() {
    try {
        const scrollY = window.scrollY;
        const header = document.querySelector('.header');
        
        if (header) {
            if (scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    } catch (error) {
        console.error('스크롤 처리 실패:', error);
    }
}

function handleResize() {
    try {
        const width = window.innerWidth;
        
        if (document.body) {
            if (width <= 768) {
                document.body.classList.add('mobile');
                document.body.classList.remove('desktop');
            } else {
                document.body.classList.add('desktop');
                document.body.classList.remove('mobile');
            }
        }
        
        if (width > 768) {
            const mobileNav = document.querySelector('.mobile-nav');
            const toggle = document.querySelector('.mobile-menu-btn');
            
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                mobileNav.style.display = 'none';
            }
            if (toggle) {
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
            
            closeAllDropdowns();
            closeNotificationPanel();
        }
        
    } catch (error) {
        console.error('리사이즈 처리 실패:', error);
    }
}

function handleResponsive() {
    try {
        handleResize();
        
        if ('ontouchstart' in window && document.body) {
            document.body.classList.add('touch-device');
        }
        
        if (window.devicePixelRatio > 1 && document.body) {
            document.body.classList.add('high-dpi');
        }
    } catch (error) {
        console.error('반응형 처리 실패:', error);
    }
}

function setupSmoothScroll() {
    try {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        
        scrollLinks.forEach(link => {
            if (link) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const targetOffset = targetElement.offsetTop - 100;
                        window.scrollTo({
                            top: targetOffset,
                            behavior: 'smooth'
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.error('부드러운 스크롤 설정 실패:', error);
    }
}

// 유틸리티 함수들
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function showNotification(message, type = 'info', duration = 3000) {
    try {
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            toastContainer.setAttribute('role', 'region');
            toastContainer.setAttribute('aria-label', '알림 메시지');
            toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
                max-width: 400px;
            `;
            document.body.appendChild(toastContainer);
        }
        
        const toast = document.createElement('div');
        toast.className = `notification-toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${getToastIcon(type)}"></i>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()" aria-label="알림 닫기">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        toast.style.cssText = `
            background: ${getToastBgColor(type)};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            pointer-events: auto;
            opacity: 1;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 300px;
            backdrop-filter: blur(10px);
            transform: translateX(0);
        `;
        
        toastContainer.appendChild(toast);
        
        // GSAP 애니메이션
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(toast, 
                {
                    x: 100,
                    opacity: 0
                },
                {
                    duration: 0.4,
                    x: 0,
                    opacity: 1,
                    ease: 'back.out(1.7)'
                }
            );
        }
        
        setTimeout(() => {
            if (toast.parentNode) {
                if (typeof gsap !== 'undefined') {
                    gsap.to(toast, {
                        duration: 0.3,
                        x: 100,
                        opacity: 0,
                        ease: 'power2.in',
                        onComplete: () => {
                            if (toast.parentNode) {
                                toast.parentNode.removeChild(toast);
                            }
                        }
                    });
                } else {
                    toast.parentNode.removeChild(toast);
                }
            }
        }, duration);
        
        return toast;
    } catch (error) {
        console.error('알림 표시 실패:', error);
        return null;
    }
}

function getToastIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons['info'];
}

function getToastBgColor(type) {
    const colors = {
        'success': 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
        'error': 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
        'warning': 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        'info': 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
    };
    return colors[type] || colors['info'];
}

// 전역 함수 내보내기
window.toggleMobileMenu = toggleMobileMenu;
window.toggleUserMenu = toggleUserMenu;
window.toggleNotificationPanel = toggleNotificationPanel;
window.openNotificationPanel = openNotificationPanel;
window.closeNotificationPanel = closeNotificationPanel;
window.filterPanelNotifications = filterPanelNotifications;
window.deleteNotification = deleteNotification;
window.addNewNotification = addNewNotification;
window.showNotification = showNotification;
window.setupCardEvents = setupCardEvents;
window.handleUpClick = handleUpClick;
window.showDeleteConfirmModal = showDeleteConfirmModal;
window.hideDeleteConfirmModal = hideDeleteConfirmModal;

// 즉시 실행 및 백업 초기화
(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
    
    window.addEventListener('load', function() {
        if (!window.APP.initialized) {
            setTimeout(initializeApp, 100);
        }
    });
})();