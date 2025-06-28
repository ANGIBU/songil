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

// DOM 완전 로딩 대기 함수 - 타이밍 문제 해결
function waitForDOMReady() {
    return new Promise((resolve) => {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            resolve();
        } else {
            document.addEventListener('DOMContentLoaded', resolve, { once: true });
        }
    });
}

// 앱 초기화 - 안전한 DOM 로딩 보장
async function initializeApp() {
    if (window.APP.initialized) return;
    
    try {
        await waitForDOMReady();
        
        // 스크롤 위치 최적화
        optimizePageScroll();
        
        // 현재 페이지 식별
        identifyCurrentPage();
        
        // 기본 이벤트 리스너 설정
        setupEventListeners();
        
        // 사용자 인증 상태 확인
        checkAuthStatus();
        
        // 반응형 처리
        handleResponsive();
        
        // 알림 시스템 초기화 - 가장 중요한 부분
        await initializeNotificationSystem();
        
        // 페이지별 카드 초기화
        initializePageCards();
        
        window.APP.initialized = true;
        
    } catch (error) {
        console.error('앱 초기화 실패:', error);
    }
}

// 알림 시스템 초기화 - 완전히 재작성
async function initializeNotificationSystem() {
    try {
        // DOM 요소들 존재 확인
        const notificationBellBtn = document.getElementById('notificationBellBtn');
        const notificationPanel = document.getElementById('notificationPanel');
        const notificationOverlay = document.getElementById('notificationOverlay');
        const closePanelBtn = document.getElementById('closePanelBtn');
        const markAllReadBtn = document.getElementById('markAllReadBtn');
        
        if (!notificationBellBtn || !notificationPanel || !notificationOverlay) {
            console.error('필수 알림 DOM 요소를 찾을 수 없습니다');
            return;
        }
        
        // 기존 이벤트 리스너 제거 (중복 방지)
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
        
        // 모두 읽음 버튼 이벤트
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                markAllNotificationsAsRead();
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
            }
        });
        
        // 필터 버튼 이벤트 설정
        setupNotificationFilters();
        
        // 개별 알림 읽음 버튼 이벤트 설정
        setupNotificationActions();
        
        // 초기 알림 배지 업데이트
        updateNotificationBadge();
        
        // 실시간 알림 시뮬레이션 시작
        startNotificationSimulation();
        
    } catch (error) {
        console.error('알림 시스템 초기화 실패:', error);
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

// 알림 액션 설정
function setupNotificationActions() {
    try {
        const markReadBtns = document.querySelectorAll('.mark-read-btn');
        
        markReadBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const notificationId = this.getAttribute('data-id');
                    if (notificationId) {
                        markPanelNotificationAsRead(notificationId);
                    }
                });
            }
        });
    } catch (error) {
        console.error('알림 액션 설정 실패:', error);
    }
}

// 알림 패널 토글 - 단순화된 버전
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

// 알림 패널 열기 - CSS 기반 단순화
function openNotificationPanel() {
    try {
        const panel = document.getElementById('notificationPanel');
        const overlay = document.getElementById('notificationOverlay');
        
        if (!panel || !overlay) {
            console.error('알림 패널 요소를 찾을 수 없습니다');
            return;
        }
        
        // 다른 드롭다운 닫기
        closeAllDropdowns();
        
        // CSS 클래스로 표시 상태 관리
        panel.classList.add('show');
        overlay.classList.add('show');
        
        // GSAP 애니메이션이 있는 경우에만 실행
        if (typeof gsap !== 'undefined') {
            // CSS 전환과 충돌하지 않도록 즉시 설정
            gsap.set(panel, {
                display: 'block',
                visibility: 'visible',
                opacity: 1,
                transform: 'translateX(0) scale(1)'
            });
            
            gsap.set(overlay, {
                display: 'block',
                visibility: 'visible',
                opacity: 1
            });
        }
        
        // 접근성을 위한 포커스 이동
        const firstFocusable = panel.querySelector('button, a, [tabindex="0"]');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
        
    } catch (error) {
        console.error('알림 패널 열기 실패:', error);
    }
}

// 알림 패널 닫기 - CSS 기반 단순화
function closeNotificationPanel() {
    try {
        const panel = document.getElementById('notificationPanel');
        const overlay = document.getElementById('notificationOverlay');
        
        if (!panel || !overlay) return;
        
        // CSS 클래스로 숨김 상태 관리
        panel.classList.remove('show');
        overlay.classList.remove('show');
        
        // GSAP가 있는 경우 CSS와 충돌하지 않도록 처리
        if (typeof gsap !== 'undefined') {
            // 애니메이션 완료 후 완전히 숨김
            setTimeout(() => {
                if (!panel.classList.contains('show')) {
                    gsap.set(panel, {
                        display: 'none',
                        visibility: 'hidden'
                    });
                    gsap.set(overlay, {
                        display: 'none',
                        visibility: 'hidden'
                    });
                }
            }, 300); // CSS 전환 시간과 일치
        }
        
    } catch (error) {
        console.error('알림 패널 닫기 실패:', error);
    }
}

// 패널 알림 필터링
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
        
        // 알림 아이템 필터링
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

// 개별 알림을 읽음으로 표시
function markPanelNotificationAsRead(notificationId) {
    try {
        const notification = document.querySelector(`[data-id="${notificationId}"]`);
        if (!notification) return;
        
        notification.classList.remove('unread');
        notification.classList.add('read');
        
        // 읽음 버튼 제거
        const readBtn = notification.querySelector('.mark-read-btn');
        if (readBtn) {
            readBtn.remove();
        }
        
        // 알림 배지 업데이트
        updateNotificationBadge();
        
        if (window.showNotification) {
            window.showNotification('알림을 읽음으로 표시했습니다.', 'success');
        }
        
    } catch (error) {
        console.error('알림 읽음 처리 실패:', error);
    }
}

// 모든 알림을 읽음으로 표시
function markAllNotificationsAsRead() {
    try {
        const unreadNotifications = document.querySelectorAll('.notification-item.unread');
        
        unreadNotifications.forEach(notification => {
            if (notification) {
                notification.classList.remove('unread');
                notification.classList.add('read');
                
                const readBtn = notification.querySelector('.mark-read-btn');
                if (readBtn) {
                    readBtn.remove();
                }
            }
        });
        
        updateNotificationBadge();
        
        if (window.showNotification && unreadNotifications.length > 0) {
            window.showNotification(`${unreadNotifications.length}개의 알림을 읽음으로 표시했습니다.`, 'success');
        }
        
    } catch (error) {
        console.error('모든 알림 읽음 처리 실패:', error);
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
        
        // 필터 카운트 업데이트
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

// 새 알림 추가
function addNewNotification(notificationData) {
    try {
        const notificationItems = document.getElementById('notificationItems');
        if (!notificationItems) return;
        
        const newNotification = document.createElement('div');
        newNotification.className = 'notification-item unread';
        newNotification.dataset.category = notificationData.category;
        newNotification.dataset.id = Date.now();
        
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
                <button class="mark-read-btn" data-id="${Date.now()}">
                    <i class="fas fa-check"></i>
                </button>
            </div>
        `;
        
        // 맨 위에 추가
        notificationItems.insertBefore(newNotification, notificationItems.firstChild);
        
        // 새로 추가된 버튼에 이벤트 추가
        const newReadBtn = newNotification.querySelector('.mark-read-btn');
        if (newReadBtn) {
            newReadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const id = this.getAttribute('data-id');
                markPanelNotificationAsRead(id);
            });
        }
        
        // 알림 배지 업데이트
        updateNotificationBadge();
        
        // 브라우저 알림 표시 (권한이 있는 경우)
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

// 알림 아이콘 클래스 반환
function getNotificationIconClass(category, type) {
    const iconMap = {
        'reports': 'fas fa-file-alt',
        'witnesses': 'fas fa-eye',
        'points': 'fas fa-coins',
        'system': 'fas fa-megaphone'
    };
    
    return iconMap[category] || 'fas fa-bell';
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
        
        // 스크롤 이벤트 - 쓰로틀링 적용
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
        
        // 리사이즈 이벤트 - 디바운싱 적용
        window.addEventListener('resize', debounce(handleResize, 250));
        
        // 부드러운 스크롤 설정
        setupSmoothScroll();
        
        // 네비게이션 초기화
        initializeNavigation();
        
        // 키보드 접근성
        setupKeyboardNavigation();
        
        // 페이지 전환 최적화
        setupPageTransitionOptimization();
        
    } catch (error) {
        console.error('이벤트 리스너 설정 실패:', error);
    }
}

// 페이지 전환 최적화
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

// 키보드 접근성 설정
function setupKeyboardNavigation() {
    try {
        document.addEventListener('keydown', function(e) {
            if (!e) return;
            
            if (e.key === 'Escape') {
                closeAllDropdowns();
                closeNotificationPanel();
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

// 나머지 함수들
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
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
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
window.markPanelNotificationAsRead = markPanelNotificationAsRead;
window.markAllNotificationsAsRead = markAllNotificationsAsRead;
window.addNewNotification = addNewNotification;
window.showNotification = showNotification;
window.setupCardEvents = setupCardEvents;
window.handleUpClick = handleUpClick;

// 즉시 실행 및 백업 초기화
(function() {
    // DOM 준비 상태에 따른 즉시 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
    
    // 윈도우 로드 완료 후 백업 초기화
    window.addEventListener('load', function() {
        if (!window.APP.initialized) {
            setTimeout(initializeApp, 100);
        }
    });
})();