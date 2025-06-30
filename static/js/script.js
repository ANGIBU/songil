// static/js/script.js

<<<<<<< HEAD
// React를 사용한 알림 시스템 관리
const { useState, useEffect, useCallback } = React;

// 전역 변수 및 설정
=======
// ===== 전역 변수 및 설정 =====
>>>>>>> origin/gb
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

<<<<<<< HEAD
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
=======
// ===== DOM 로드 완료 시 초기화 =====
document.addEventListener('DOMContentLoaded', function() {
    if (!window.APP.initialized) {
        initializeApp();
    }
});

// 이미 로드된 경우 즉시 초기화
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if (!window.APP.initialized) {
        initializeApp();
    }
}

// ===== 앱 초기화 =====
function initializeApp() {
    if (window.APP.initialized) return;
    
    try {
        // 현재 페이지 식별
        identifyCurrentPage();
        
        // 페이지 로딩 최적화 처리
        handlePageLoadOptimization();
        
        // 기본 이벤트 리스너 설정
        setupEventListeners();
        
        // 사용자 인증 상태 확인
        checkAuthStatus();
        
        // 반응형 처리
        handleResponsive();
        
        // 페이지별 카드 초기화
        initializePageCards();
        
        window.APP.initialized = true;
    } catch (error) {
        console.warn('앱 초기화 오류:', error);
    }
}

// ===== 페이지별 카드 초기화 =====
function initializePageCards() {
    // 홈페이지 긴급 실종자 카드들 초기화
    if (window.APP.currentPage === 'home') {
        setupHomePageCards();
    }
    
    // 모든 페이지의 실종자 카드 공통 이벤트 설정
    setupUniversalCardEvents();
}

// ===== 홈페이지 카드 설정 =====
>>>>>>> origin/gb
function setupHomePageCards() {
    try {
        const urgentCards = document.querySelectorAll('.urgent-cards .missing-card');
        
        urgentCards.forEach((card, index) => {
            if (!card) return;
            
<<<<<<< HEAD
            setupCardEvents(card);
        });
    } catch (error) {
        console.error('홈페이지 카드 설정 실패:', error);
    }
}

// 범용 카드 이벤트 설정
function setupUniversalCardEvents() {
    try {
=======
            // 카드 로드 애니메이션
            if (typeof gsap !== 'undefined') {
                gsap.from(card, {
                    duration: 0.6,
                    y: 50,
                    opacity: 0,
                    delay: index * 0.1,
                    ease: 'power2.out'
                });
            }
            
            // 개별 카드 이벤트 설정
            setupCardEvents(card);
        });
    } catch (error) {
        console.warn('홈페이지 카드 설정 오류:', error);
    }
}

// ===== 범용 카드 이벤트 설정 =====
function setupUniversalCardEvents() {
    try {
        // 모든 실종자 카드에 대한 공통 이벤트
>>>>>>> origin/gb
        const allCards = document.querySelectorAll('.missing-card');
        
        allCards.forEach(card => {
            if (card) {
                setupCardEvents(card);
            }
        });
    } catch (error) {
<<<<<<< HEAD
        console.error('범용 카드 이벤트 설정 실패:', error);
    }
}

// 개별 카드 이벤트 설정
=======
        console.warn('범용 카드 이벤트 설정 오류:', error);
    }
}

// ===== 개별 카드 이벤트 설정 =====
>>>>>>> origin/gb
function setupCardEvents(card) {
    if (!card) return;
    
    try {
<<<<<<< HEAD
        // UP 버튼 이벤트
        const upStat = card.querySelector('.card-stats .stat');
        if (upStat && upStat.innerHTML && upStat.innerHTML.includes('fa-arrow-up')) {
            upStat.removeEventListener('click', handleUpClick);
            upStat.addEventListener('click', handleUpClick);
            upStat.style.cursor = 'pointer';
        }
        
        // 카드 클릭 시 상세 페이지로 이동
=======
        // UP 버튼 이벤트 - 통일된 처리
        const upStat = card.querySelector('.card-stats .stat');
        if (upStat && upStat.innerHTML && upStat.innerHTML.includes('fa-arrow-up')) {
            // 기존 이벤트 리스너 제거 (중복 방지)
            upStat.removeEventListener('click', handleUpClick);
            upStat.addEventListener('click', handleUpClick);
            
            // 시각적 피드백을 위한 스타일 추가
            upStat.style.cursor = 'pointer';
            upStat.style.transition = 'all 0.2s ease';
        }
        
        // 카드 호버 효과 - 안전한 버전
        card.addEventListener('mouseenter', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, {
                    duration: 0.3,
                    y: -4,
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.12)',
                    ease: 'power2.out'
                });
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, {
                    duration: 0.3,
                    y: 0,
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                    ease: 'power2.out'
                });
            }
        });
        
        // 카드 클릭 시 상세 페이지로 이동 (detail-link가 없는 경우)
>>>>>>> origin/gb
        const detailLink = card.querySelector('.detail-link');
        if (!detailLink) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function(e) {
<<<<<<< HEAD
=======
                // UP 버튼 클릭은 제외
>>>>>>> origin/gb
                if (!e.target.closest('.stat')) {
                    const cardId = this.dataset.id || extractCardId(this);
                    if (cardId) {
                        window.location.href = `/missing/${cardId}`;
                    }
                }
            });
        }
    } catch (error) {
<<<<<<< HEAD
        console.error('카드 이벤트 설정 실패:', error);
    }
}

// UP 클릭 핸들러
=======
        console.warn('카드 이벤트 설정 오류:', error);
    }
}

// ===== UP 클릭 핸들러 - 통일된 처리 =====
>>>>>>> origin/gb
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
        
<<<<<<< HEAD
        stat.innerHTML = `<i class="fas fa-arrow-up"></i> ${newCount}`;
        
=======
        // 아이콘과 숫자 유지하면서 카운트 업데이트
        stat.innerHTML = `<i class="fas fa-arrow-up"></i> ${newCount}`;
        
        // 애니메이션 효과
        if (typeof gsap !== 'undefined') {
            gsap.timeline()
                .to(stat, {
                    duration: 0.1,
                    scale: 0.9,
                    ease: 'power2.in'
                })
                .to(stat, {
                    duration: 0.4,
                    scale: 1.2,
                    ease: 'elastic.out(1, 0.5)'
                })
                .to(stat, {
                    duration: 0.2,
                    scale: 1,
                    ease: 'power2.out'
                });
            
            // 파티클 효과
            createUpParticleEffect(stat);
        }
        
        // 알림 표시
>>>>>>> origin/gb
        if (window.showNotification) {
            window.showNotification('UP을 눌렀습니다! 실종자 찾기에 도움이 됩니다.', 'success');
        }
        
<<<<<<< HEAD
=======
        // 서버에 UP 정보 전송
>>>>>>> origin/gb
        const cardId = extractCardId(stat.closest('.missing-card'));
        if (cardId) {
            sendUpToServer(cardId, newCount);
        }
    } catch (error) {
<<<<<<< HEAD
        console.error('UP 클릭 처리 실패:', error);
    }
}

// 카드 ID 추출
=======
        console.warn('UP 클릭 처리 오류:', error);
    }
}

// ===== UP 파티클 효과 =====
function createUpParticleEffect(element) {
    if (typeof gsap === 'undefined' || !element) return;
    
    try {
        const rect = element.getBoundingClientRect();
        const particles = 6;
        
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'up-particle';
            particle.innerHTML = '<i class="fas fa-arrow-up"></i>';
            particle.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                color: #22c55e;
                font-size: 14px;
                pointer-events: none;
                z-index: 1000;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (i / particles) * Math.PI * 2;
            const distance = 30 + Math.random() * 30;
            
            gsap.to(particle, {
                duration: 1,
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance - 30,
                opacity: 0,
                scale: 0.3,
                rotation: 180,
                ease: 'power2.out',
                onComplete: () => {
                    if (particle && particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }
            });
        }
    } catch (error) {
        console.warn('파티클 효과 오류:', error);
    }
}

// ===== 카드 ID 추출 =====
>>>>>>> origin/gb
function extractCardId(card) {
    if (!card) return null;
    
    try {
<<<<<<< HEAD
=======
        // data-id 속성에서 추출
>>>>>>> origin/gb
        if (card.dataset && card.dataset.id) {
            return card.dataset.id;
        }
        
<<<<<<< HEAD
=======
        // detail-link href에서 추출
>>>>>>> origin/gb
        const detailLink = card.querySelector('.detail-link');
        if (detailLink && detailLink.href) {
            const match = detailLink.href.match(/\/missing\/(\d+)/);
            return match ? match[1] : null;
        }
        
<<<<<<< HEAD
        const pathMatch = window.location.pathname.match(/\/missing\/(\d+)/);
        return pathMatch ? pathMatch[1] : null;
    } catch (error) {
        console.error('카드 ID 추출 실패:', error);
=======
        // URL에서 추출 (상세 페이지인 경우)
        const pathMatch = window.location.pathname.match(/\/missing\/(\d+)/);
        return pathMatch ? pathMatch[1] : null;
    } catch (error) {
        console.warn('카드 ID 추출 오류:', error);
>>>>>>> origin/gb
        return null;
    }
}

<<<<<<< HEAD
// 서버에 UP 정보 전송
=======
// ===== 서버에 UP 정보 전송 =====
>>>>>>> origin/gb
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
<<<<<<< HEAD
            console.error('서버 전송 실패:', error);
        });
    } catch (error) {
        console.error('UP 서버 전송 중 실패:', error);
    }
}

// 스크롤 위치 최적화
function optimizePageScroll() {
    try {
=======
            console.warn('서버 전송 오류:', error);
        });
    } catch (error) {
        console.warn('UP 서버 전송 중 오류:', error);
    }
}

// ===== 페이지 로딩 최적화 처리 =====
function handlePageLoadOptimization() {
    // 페이지 스크롤 위치 최적화
    optimizePageScroll();
}

// ===== 스크롤 위치 최적화 =====
function optimizePageScroll() {
    try {
        // 스크롤 복원 비활성화
>>>>>>> origin/gb
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        
<<<<<<< HEAD
=======
        // 즉시 상단으로 스크롤
>>>>>>> origin/gb
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
        
<<<<<<< HEAD
=======
        // 추가 안전장치
>>>>>>> origin/gb
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);
    } catch (error) {
<<<<<<< HEAD
        console.error('스크롤 최적화 실패:', error);
    }
}

// 현재 페이지 식별
=======
        console.warn('스크롤 최적화 오류:', error);
    }
}

// ===== 현재 페이지 식별 =====
>>>>>>> origin/gb
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
        
<<<<<<< HEAD
=======
        // 페이지별 CSS 클래스 추가
>>>>>>> origin/gb
        if (document.body) {
            document.body.classList.add(`page-${window.APP.currentPage}`);
        }
    } catch (error) {
<<<<<<< HEAD
        console.error('페이지 식별 실패:', error);
    }
}

// 이벤트 리스너 설정
=======
        console.warn('페이지 식별 오류:', error);
    }
}

// ===== 이벤트 리스너 설정 =====
>>>>>>> origin/gb
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
        
<<<<<<< HEAD
        // 스크롤 이벤트
=======
        // 알림 버튼
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', toggleNotifications);
        }
        
        // 스크롤 이벤트 - 쓰로틀링 적용
>>>>>>> origin/gb
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
        
<<<<<<< HEAD
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
=======
        // 리사이즈 이벤트 - 디바운싱 적용
        window.addEventListener('resize', debounce(handleResize, 250));
        
        // 모든 링크에 부드러운 스크롤 적용
        setupSmoothScroll();
        
        // 네비게이션 초기화
        initializeNavigation();
        
        // 키보드 접근성
        setupKeyboardNavigation();
        
        // 페이지 전환 시 스크롤 최적화
        setupPageTransitionOptimization();
        
        // 안전한 동적 카드 이벤트 위임
        setupSafeDelegatedCardEvents();
        
    } catch (error) {
        console.warn('이벤트 리스너 설정 오류:', error);
    }
}

// ===== 안전한 동적 카드 이벤트 위임 =====
function setupSafeDelegatedCardEvents() {
    try {
        // 문서 레벨에서 이벤트 위임을 통해 동적으로 추가되는 카드들도 처리
        document.addEventListener('click', function(e) {
            if (!e || !e.target) return;
            
            try {
                // UP 버튼 클릭 처리
                const closestStat = e.target.closest('.missing-card .stat');
                if (closestStat && closestStat.innerHTML && closestStat.innerHTML.includes('fa-arrow-up')) {
                    handleUpClick(e);
                }
            } catch (error) {
                console.warn('위임된 클릭 이벤트 오류:', error);
            }
        });
        
        // 안전한 호버 효과 위임
        document.addEventListener('mouseenter', function(e) {
            if (!e || !e.target) return;
            
            try {
                if (e.target.classList && e.target.classList.contains('missing-card')) {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(e.target, {
                            duration: 0.3,
                            y: -4,
                            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.12)',
                            ease: 'power2.out'
                        });
                    }
                }
            } catch (error) {
                console.warn('위임된 마우스 엔터 오류:', error);
            }
        }, true);
        
        document.addEventListener('mouseleave', function(e) {
            if (!e || !e.target) return;
            
            try {
                if (e.target.classList && e.target.classList.contains('missing-card')) {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(e.target, {
                            duration: 0.3,
                            y: 0,
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                            ease: 'power2.out'
                        });
                    }
                }
            } catch (error) {
                console.warn('위임된 마우스 리브 오류:', error);
            }
        }, true);
        
    } catch (error) {
        console.warn('안전한 위임 이벤트 설정 오류:', error);
    }
}

// ===== 페이지 전환 최적화 =====
function setupPageTransitionOptimization() {
    try {
        // 모든 내부 링크에 최적화 적용
>>>>>>> origin/gb
        const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
        
        internalLinks.forEach(link => {
            if (link) {
                link.addEventListener('click', function(e) {
<<<<<<< HEAD
=======
                    // 페이지 전환 시 상단으로 스크롤 준비
>>>>>>> origin/gb
                    if ('scrollRestoration' in history) {
                        history.scrollRestoration = 'manual';
                    }
                });
            }
        });
        
<<<<<<< HEAD
=======
        // popstate 이벤트에서 스크롤 최적화
>>>>>>> origin/gb
        window.addEventListener('popstate', function() {
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 0);
        });
    } catch (error) {
<<<<<<< HEAD
        console.error('페이지 전환 최적화 실패:', error);
    }
}

=======
        console.warn('페이지 전환 최적화 오류:', error);
    }
}

// ===== 키보드 접근성 설정 =====
>>>>>>> origin/gb
function setupKeyboardNavigation() {
    try {
        document.addEventListener('keydown', function(e) {
            if (!e) return;
            
<<<<<<< HEAD
            if (e.key === 'Escape') {
                closeAllDropdowns();
                closeNotificationPanel();
                hideDeleteConfirmModal();
=======
            // ESC 키로 모든 드롭다운 닫기
            if (e.key === 'Escape') {
                closeAllDropdowns();
>>>>>>> origin/gb
                if (document.activeElement && document.activeElement.blur) {
                    document.activeElement.blur();
                }
            }
            
<<<<<<< HEAD
=======
            // Tab 키 네비게이션 향상
>>>>>>> origin/gb
            if (e.key === 'Tab') {
                if (document.body) {
                    document.body.classList.add('keyboard-nav');
                }
            }
        });
        
<<<<<<< HEAD
=======
        // 마우스 사용 시 키보드 네비게이션 스타일 제거
>>>>>>> origin/gb
        document.addEventListener('mousedown', function() {
            if (document.body) {
                document.body.classList.remove('keyboard-nav');
            }
        });
    } catch (error) {
<<<<<<< HEAD
        console.error('키보드 접근성 설정 실패:', error);
    }
}

=======
        console.warn('키보드 접근성 설정 오류:', error);
    }
}

// ===== 나머지 함수들 (안전성 강화) =====

>>>>>>> origin/gb
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
<<<<<<< HEAD
        console.error('네비게이션 초기화 실패:', error);
=======
        console.warn('네비게이션 초기화 오류:', error);
>>>>>>> origin/gb
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
<<<<<<< HEAD
        console.error('인증 상태 확인 실패:', error);
=======
        console.warn('인증 상태 확인 오류:', error);
>>>>>>> origin/gb
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
<<<<<<< HEAD
        console.error('로그인 UI 업데이트 실패:', error);
=======
        console.warn('로그인 UI 업데이트 오류:', error);
>>>>>>> origin/gb
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
<<<<<<< HEAD
        console.error('게스트 UI 업데이트 실패:', error);
=======
        console.warn('게스트 UI 업데이트 오류:', error);
>>>>>>> origin/gb
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
<<<<<<< HEAD
        console.error('모바일 메뉴 토글 실패:', error);
=======
        console.warn('모바일 메뉴 토글 오류:', error);
>>>>>>> origin/gb
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
<<<<<<< HEAD
        console.error('사용자 메뉴 토글 실패:', error);
=======
        console.warn('사용자 메뉴 토글 오류:', error);
    }
}

function toggleNotifications() {
    try {
        const dropdown = document.getElementById('notificationDropdown');
        if (!dropdown) return;
        
        const isOpen = dropdown.classList.contains('show');
        
        if (isOpen) {
            dropdown.classList.remove('show');
            dropdown.setAttribute('aria-hidden', 'true');
        } else {
            closeAllDropdowns();
            dropdown.classList.add('show');
            dropdown.setAttribute('aria-hidden', 'false');
            
            setTimeout(() => markNotificationsAsRead(), 1000);
        }
    } catch (error) {
        console.warn('알림 토글 오류:', error);
>>>>>>> origin/gb
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
<<<<<<< HEAD
        console.error('드롭다운 닫기 실패:', error);
=======
        console.warn('드롭다운 닫기 오류:', error);
>>>>>>> origin/gb
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
<<<<<<< HEAD
        console.error('스크롤 처리 실패:', error);
=======
        console.warn('스크롤 처리 오류:', error);
>>>>>>> origin/gb
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
<<<<<<< HEAD
            closeNotificationPanel();
        }
        
    } catch (error) {
        console.error('리사이즈 처리 실패:', error);
=======
        }
        
        recalculateCardLayouts();
    } catch (error) {
        console.warn('리사이즈 처리 오류:', error);
    }
}

function recalculateCardLayouts() {
    try {
        const cardContainers = document.querySelectorAll('.urgent-cards, .related-cards, .missing-grid, .missing-list-view');
        
        cardContainers.forEach(container => {
            if (container) {
                container.style.display = 'none';
                container.offsetHeight;
                container.style.display = '';
            }
        });
    } catch (error) {
        console.warn('카드 레이아웃 재계산 오류:', error);
>>>>>>> origin/gb
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
<<<<<<< HEAD
        console.error('반응형 처리 실패:', error);
=======
        console.warn('반응형 처리 오류:', error);
>>>>>>> origin/gb
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
<<<<<<< HEAD
        console.error('부드러운 스크롤 설정 실패:', error);
    }
}

// 유틸리티 함수들
=======
        console.warn('부드러운 스크롤 설정 오류:', error);
    }
}

function markNotificationsAsRead() {
    try {
        const unreadItems = document.querySelectorAll('.notification-item.unread');
        const notificationBadge = document.querySelector('.notification-badge');
        
        if (unreadItems.length > 0) {
            unreadItems.forEach(item => {
                if (item) {
                    item.classList.remove('unread');
                }
            });
            
            if (notificationBadge) {
                notificationBadge.style.display = 'none';
            }
        }
    } catch (error) {
        console.warn('알림 읽음 처리 오류:', error);
    }
}

// ===== 유틸리티 함수들 =====

>>>>>>> origin/gb
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

<<<<<<< HEAD
=======
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function showLoading(target = 'body', message = '처리 중...') {
    try {
        const targetEl = typeof target === 'string' ? document.querySelector(target) : target;
        
        if (!targetEl) return null;
        
        const existingLoader = targetEl.querySelector('.simple-loading');
        if (existingLoader) {
            existingLoader.remove();
        }
        
        const loader = document.createElement('div');
        loader.className = 'simple-loading';
        loader.setAttribute('role', 'status');
        loader.setAttribute('aria-live', 'polite');
        loader.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner-ring"></div>
                <span class="loading-text">${message}</span>
            </div>
        `;
        
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 1;
        `;
        
        targetEl.appendChild(loader);
        return loader;
    } catch (error) {
        console.warn('로딩 표시 오류:', error);
        return null;
    }
}

function hideLoading(loader) {
    try {
        if (loader && loader.parentNode) {
            loader.parentNode.removeChild(loader);
        }
    } catch (error) {
        console.warn('로딩 숨김 오류:', error);
    }
}

>>>>>>> origin/gb
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
<<<<<<< HEAD
            transform: translateX(0);
=======
>>>>>>> origin/gb
        `;
        
        toastContainer.appendChild(toast);
        
<<<<<<< HEAD
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
=======
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
>>>>>>> origin/gb
            }
        }, duration);
        
        return toast;
    } catch (error) {
<<<<<<< HEAD
        console.error('알림 표시 실패:', error);
=======
        console.warn('알림 표시 오류:', error);
>>>>>>> origin/gb
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

<<<<<<< HEAD
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
=======
// ===== 전역 함수 내보내기 =====
window.toggleMobileMenu = toggleMobileMenu;
window.toggleUserMenu = toggleUserMenu;
window.toggleNotifications = toggleNotifications;
window.initializeNavigation = initializeNavigation;
window.checkAuthStatus = checkAuthStatus;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showNotification = showNotification;
window.debounce = debounce;
window.throttle = throttle;
window.setupCardEvents = setupCardEvents;
window.handleUpClick = handleUpClick;

// ===== CSS 스타일 주입 =====
if (!document.querySelector('#dynamic-styles')) {
    const style = document.createElement('style');
    style.id = 'dynamic-styles';
    style.textContent = `
        .spinner-ring {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loading-text {
            color: #374151;
            font-size: 1rem;
            font-weight: 500;
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
        }
        
        .toast-close {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s ease;
            margin-left: auto;
        }
        
        .toast-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .keyboard-nav *:focus {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
        }
        
        .sr-only {
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            white-space: nowrap !important;
            border: 0 !important;
        }
        
        .up-particle {
            position: fixed;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
}
>>>>>>> origin/gb
