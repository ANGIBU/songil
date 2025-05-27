// static/js/script.js

// ===== 전역 변수 및 설정 =====
window.APP = {
    isLoggedIn: false,
    user: null,
    currentPage: null,
    notifications: [],
    config: {
        animationDuration: 0.3,
        scrollOffset: 100
    },
    initialized: false
};

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
        
        // 기본 이벤트 리스너 설정
        setupEventListeners();
        
        // 사용자 인증 상태 확인
        checkAuthStatus();
        
        // GSAP 애니메이션 초기화
        initializeAnimations();
        
        // 반응형 처리
        handleResponsive();
        
        window.APP.initialized = true;
        console.log('App initialized successfully');
    } catch (error) {
        console.error('App initialization error:', error);
    }
}

// ===== 현재 페이지 식별 =====
function identifyCurrentPage() {
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
    
    // 페이지별 CSS 클래스 추가
    document.body.classList.add(`page-${window.APP.currentPage}`);
}

// ===== 이벤트 리스너 설정 =====
function setupEventListeners() {
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
    
    // 알림 버튼
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', toggleNotifications);
    }
    
    // 외부 클릭시 드롭다운 닫기
    document.addEventListener('click', handleOutsideClick);
    
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
    
    // 모든 링크에 부드러운 스크롤 적용
    setupSmoothScroll();
    
    // 네비게이션 초기화
    initializeNavigation();
    
    // 키보드 접근성
    setupKeyboardNavigation();
}

// ===== 키보드 접근성 설정 =====
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // ESC 키로 모든 드롭다운 닫기
        if (e.key === 'Escape') {
            closeAllDropdowns();
            document.activeElement?.blur();
        }
        
        // Tab 키 네비게이션 향상
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    // 마우스 사용 시 키보드 네비게이션 스타일 제거
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });
}

// ===== 네비게이션 초기화 =====
function initializeNavigation() {
    // 현재 페이지에 따른 네비게이션 활성화
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/index')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
    
    // 네비게이션 링크 클릭 애니메이션
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // GSAP 애니메이션
            if (typeof gsap !== 'undefined') {
                gsap.to(this, {
                    duration: 0.1,
                    scale: 0.95,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.out',
                    onComplete: () => {
                        gsap.set(this, { clearProps: 'transform' });
                    }
                });
            }
        });
    });
}

// ===== 사용자 인증 상태 확인 =====
function checkAuthStatus() {
    // 실제 구현에서는 서버 API 호출
    // 현재는 localStorage 시뮬레이션
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
        console.warn('Auth status check failed:', error);
        window.APP.isLoggedIn = false;
        updateUIForGuestUser();
    }
}

// ===== 로그인 사용자 UI 업데이트 =====
function updateUIForLoggedUser() {
    // 로그인 필요 요소 표시
    const authRequired = document.querySelectorAll('.auth-required');
    authRequired.forEach(el => {
        el.style.display = 'flex';
        el.setAttribute('aria-hidden', 'false');
    });
    
    // 게스트 전용 요소 숨김
    const guestActions = document.querySelectorAll('.guest-actions');
    guestActions.forEach(el => {
        el.style.display = 'none';
        el.setAttribute('aria-hidden', 'true');
    });
    
    // 사용자 정보 업데이트
    if (window.APP.user) {
        const userNameEl = document.querySelector('.user-name');
        const userPointsEl = document.querySelector('.user-points');
        
        if (userNameEl) userNameEl.textContent = window.APP.user.name || '사용자';
        if (userPointsEl) userPointsEl.textContent = `${(window.APP.user.points || 0).toLocaleString()}P`;
    }
    
    // body 클래스 업데이트
    document.body.classList.add('user-authenticated');
    document.body.classList.remove('user-guest');
}

// ===== 게스트 사용자 UI 업데이트 =====
function updateUIForGuestUser() {
    // 로그인 필요 요소 숨김
    const authRequired = document.querySelectorAll('.auth-required');
    authRequired.forEach(el => {
        el.style.display = 'none';
        el.setAttribute('aria-hidden', 'true');
    });
    
    // 게스트 전용 요소 표시
    const guestActions = document.querySelectorAll('.guest-actions');
    guestActions.forEach(el => {
        el.style.display = 'flex';
        el.setAttribute('aria-hidden', 'false');
    });
    
    // body 클래스 업데이트
    document.body.classList.add('user-guest');
    document.body.classList.remove('user-authenticated');
}

// ===== 모바일 메뉴 토글 =====
function toggleMobileMenu() {
    const mobileNav = document.querySelector('.mobile-nav');
    const toggle = document.querySelector('.mobile-menu-btn');
    
    if (!mobileNav || !toggle) return;
    
    const isOpen = mobileNav.classList.contains('active');
    
    if (isOpen) {
        // 메뉴 닫기
        mobileNav.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        
        // GSAP 애니메이션으로 부드럽게 닫기
        if (typeof gsap !== 'undefined') {
            gsap.to(mobileNav, {
                duration: 0.3,
                opacity: 0,
                y: -20,
                ease: "power2.out",
                onComplete: () => {
                    mobileNav.style.display = 'none';
                }
            });
        } else {
            mobileNav.style.display = 'none';
        }
    } else {
        // 메뉴 열기
        mobileNav.classList.add('active');
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        mobileNav.style.display = 'block';
        
        // GSAP 애니메이션으로 부드럽게 열기
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(mobileNav, 
                { opacity: 0, y: -20 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.3, 
                    ease: "power2.out",
                    onComplete: () => {
                        // 포커스를 첫 번째 링크로 이동
                        const firstLink = mobileNav.querySelector('a');
                        if (firstLink) firstLink.focus();
                    }
                }
            );
        }
    }
}

// ===== 사용자 메뉴 토글 =====
function toggleUserMenu() {
    const dropdown = document.getElementById('userMenuDropdown');
    
    if (!dropdown) return;
    
    const isOpen = dropdown.classList.contains('show');
    
    if (isOpen) {
        dropdown.classList.remove('show');
        dropdown.setAttribute('aria-hidden', 'true');
    } else {
        // 다른 드롭다운 닫기
        closeAllDropdowns();
        dropdown.classList.add('show');
        dropdown.setAttribute('aria-hidden', 'false');
        
        // GSAP 애니메이션
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(dropdown,
                { opacity: 0, y: -10, scale: 0.95 },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    duration: 0.2, 
                    ease: "back.out(1.7)",
                    onComplete: () => {
                        gsap.set(dropdown, { clearProps: 'transform' });
                    }
                }
            );
        }
    }
}

// ===== 알림 토글 =====
function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    
    if (!dropdown) return;
    
    const isOpen = dropdown.classList.contains('show');
    
    if (isOpen) {
        dropdown.classList.remove('show');
        dropdown.setAttribute('aria-hidden', 'true');
    } else {
        // 다른 드롭다운 닫기
        closeAllDropdowns();
        dropdown.classList.add('show');
        dropdown.setAttribute('aria-hidden', 'false');
        
        // GSAP 애니메이션
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(dropdown,
                { opacity: 0, y: -10, scale: 0.95 },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    duration: 0.3, 
                    ease: "back.out(1.7)",
                    onComplete: () => {
                        gsap.set(dropdown, { clearProps: 'transform' });
                    }
                }
            );
        }
        
        // 알림 읽음 처리
        setTimeout(() => markNotificationsAsRead(), 1000);
    }
}

// ===== 모든 드롭다운 닫기 =====
function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-menu, .user-dropdown, .notification-dropdown');
    
    dropdowns.forEach(dropdown => {
        if (dropdown) {
            dropdown.classList.remove('show');
            dropdown.setAttribute('aria-hidden', 'true');
        }
    });
}

// ===== 외부 클릭 처리 =====
function handleOutsideClick(event) {
    const userDropdown = document.getElementById('userMenuDropdown');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const userBtn = document.querySelector('.profile-btn');
    const notificationBtn = document.querySelector('.notification-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    
    // 사용자 메뉴 외부 클릭
    if (userDropdown && userDropdown.classList.contains('show') && 
        userBtn && !userBtn.contains(event.target) && !userDropdown.contains(event.target)) {
        userDropdown.classList.remove('show');
        userDropdown.setAttribute('aria-hidden', 'true');
    }
    
    // 알림 드롭다운 외부 클릭
    if (notificationDropdown && notificationDropdown.classList.contains('show') && 
        notificationBtn && !notificationBtn.contains(event.target) && !notificationDropdown.contains(event.target)) {
        notificationDropdown.classList.remove('show');
        notificationDropdown.setAttribute('aria-hidden', 'true');
    }
    
    // 모바일 메뉴 외부 클릭
    if (mobileNav && mobileNav.classList.contains('active') &&
        mobileBtn && !mobileBtn.contains(event.target) && !mobileNav.contains(event.target)) {
        toggleMobileMenu();
    }
}

// ===== 스크롤 처리 - 최적화됨 =====
function handleScroll() {
    const scrollY = window.scrollY;
    const header = document.querySelector('.header');
    
    // 헤더 스크롤 효과
    if (header) {
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // 스크롤 기반 애니메이션 트리거
    triggerScrollAnimations();
}

// ===== 리사이즈 처리 - 개선됨 =====
function handleResize() {
    const width = window.innerWidth;
    
    // 모바일/데스크톱 구분
    if (width <= 768) {
        document.body.classList.add('mobile');
        document.body.classList.remove('desktop');
    } else {
        document.body.classList.add('desktop');
        document.body.classList.remove('mobile');
    }
    
    // 데스크톱에서 모바일 메뉴 자동 닫기
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
        
        // 모든 드롭다운 닫기
        closeAllDropdowns();
    }
}

// ===== 반응형 처리 =====
function handleResponsive() {
    handleResize();
    
    // 터치 디바이스 감지
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
    
    // 고해상도 디스플레이 감지
    if (window.devicePixelRatio > 1) {
        document.body.classList.add('high-dpi');
    }
}

// ===== GSAP 애니메이션 초기화 =====
function initializeAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // ScrollTrigger 등록
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // 페이지 로드 애니메이션 - 안전한 방식으로 수정
    gsap.fromTo('.header', {
        y: -100,
        opacity: 0
    }, {
        duration: 0.6,
        y: 0,
        opacity: 1,
        ease: "power2.out",
        onComplete: () => {
            gsap.set('.header', { clearProps: 'transform,opacity' });
        }
    });
    
    // 페이지별 애니메이션 초기화
    setTimeout(() => initializePageAnimations(), 100);
}

// ===== 페이지별 애니메이션 초기화 =====
function initializePageAnimations() {
    switch (window.APP.currentPage) {
        case 'home':
            initializeHomeAnimations();
            break;
        case 'search':
            initializeSearchAnimations();
            break;
        case 'about':
            initializeAboutAnimations();
            break;
        case 'ranking':
            initializeRankingAnimations();
            break;
    }
}

// ===== 홈페이지 기본 애니메이션 =====
function initializeHomeAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // 기본 요소들 애니메이션 (index.js에서 더 상세한 애니메이션 처리됨)
    const fadeElements = document.querySelectorAll('.fade-in-up:not(.animated)');
    
    fadeElements.forEach((element, index) => {
        gsap.fromTo(element, {
            y: 30,
            opacity: 0
        }, {
            duration: 0.6,
            y: 0,
            opacity: 1,
            ease: "power2.out",
            delay: index * 0.1,
            onComplete: () => {
                element.classList.add('animated');
                gsap.set(element, { clearProps: 'transform,opacity' });
            }
        });
    });
}

// ===== 검색 페이지 애니메이션 =====
function initializeSearchAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // 검색 결과 애니메이션
    const cards = document.querySelectorAll('.missing-card:not(.animated)');
    if (cards.length > 0) {
        gsap.fromTo(cards, {
            y: 30,
            opacity: 0
        }, {
            duration: 0.6,
            y: 0,
            opacity: 1,
            stagger: 0.1,
            ease: "power2.out",
            onComplete: () => {
                cards.forEach(card => {
                    card.classList.add('animated');
                    gsap.set(card, { clearProps: 'transform,opacity' });
                });
            }
        });
    }
}

// ===== About 페이지 애니메이션 =====
function initializeAboutAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    // 섹션별 애니메이션
    const sections = document.querySelectorAll('.section:not(.animated)');
    sections.forEach(section => {
        gsap.fromTo(section, {
            y: 50,
            opacity: 0
        }, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                once: true
            },
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: "power2.out",
            onComplete: () => {
                section.classList.add('animated');
                gsap.set(section, { clearProps: 'transform,opacity' });
            }
        });
    });
}

// ===== 랭킹 페이지 애니메이션 =====
function initializeRankingAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // 랭킹 아이템 애니메이션
    const rankingItems = document.querySelectorAll('.ranking-item:not(.animated)');
    if (rankingItems.length > 0) {
        gsap.fromTo(rankingItems, {
            y: 30,
            opacity: 0
        }, {
            duration: 0.6,
            y: 0,
            opacity: 1,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.3,
            onComplete: () => {
                rankingItems.forEach(item => {
                    item.classList.add('animated');
                    gsap.set(item, { clearProps: 'transform,opacity' });
                });
            }
        });
    }
}

// ===== 스크롤 애니메이션 트리거 - 성능 최적화 =====
function triggerScrollAnimations() {
    if (typeof gsap === 'undefined') return;
    
    const animateElements = document.querySelectorAll('.animate-on-scroll:not(.animated)');
    
    animateElements.forEach(element => {
        const elementRect = element.getBoundingClientRect();
        const elementTop = elementRect.top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animated');
            
            gsap.fromTo(element, {
                opacity: 0,
                y: 30
            }, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => {
                    gsap.set(element, { clearProps: 'transform,opacity' });
                }
            });
        }
    });
}

// ===== 부드러운 스크롤 설정 =====
function setupSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
                    gsap.to(window, {
                        duration: 0.8,
                        scrollTo: { y: targetElement.offsetTop - 100 },
                        ease: "power2.inOut"
                    });
                } else {
                    // 폴백 스크롤
                    const targetOffset = targetElement.offsetTop - 100;
                    window.scrollTo({
                        top: targetOffset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ===== 알림 읽음 처리 =====
function markNotificationsAsRead() {
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    const notificationBadge = document.querySelector('.notification-badge');
    
    if (unreadItems.length > 0) {
        unreadItems.forEach(item => {
            item.classList.remove('unread');
        });
        
        if (notificationBadge) {
            // 뱃지 숨김 애니메이션
            if (typeof gsap !== 'undefined') {
                gsap.to(notificationBadge, {
                    duration: 0.3,
                    scale: 0,
                    opacity: 0,
                    ease: "back.in(2)",
                    onComplete: () => {
                        notificationBadge.style.display = 'none';
                    }
                });
            } else {
                notificationBadge.style.display = 'none';
            }
        }
    }
}

// ===== 로딩 인디케이터 - 개선된 버전 =====
function showLoading(target = 'body', message = '로딩 중...') {
    const targetEl = typeof target === 'string' ? document.querySelector(target) : target;
    
    if (!targetEl) return null;
    
    // 기존 로딩 제거
    const existingLoader = targetEl.querySelector('.loading-overlay');
    if (existingLoader) {
        existingLoader.remove();
    }
    
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-live', 'polite');
    loader.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner-ring"></div>
            <span class="loading-text">${message}</span>
        </div>
    `;
    
    // CSS 스타일 추가
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
        opacity: 0;
    `;
    
    targetEl.appendChild(loader);
    
    if (typeof gsap !== 'undefined') {
        gsap.to(loader, {
            duration: 0.3,
            opacity: 1,
            ease: "power2.out"
        });
    } else {
        loader.style.opacity = '1';
    }
    
    return loader;
}

function hideLoading(loader) {
    if (!loader || !loader.parentNode) return;
    
    if (typeof gsap !== 'undefined') {
        gsap.to(loader, {
            duration: 0.3,
            opacity: 0,
            ease: "power2.out",
            onComplete: () => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }
        });
    } else {
        if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
        }
    }
}

// ===== 알림 시스템 (완전히 개선됨) =====
function showNotification(message, type = 'info', duration = 3000) {
    // 토스트 컨테이너 확인/생성
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
    
    // 토스트 스타일
    toast.style.cssText = `
        background: ${getToastBgColor(type)};
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        pointer-events: auto;
        transform: translateX(100%);
        opacity: 0;
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        backdrop-filter: blur(10px);
    `;
    
    toastContainer.appendChild(toast);
    
    // 애니메이션
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(toast,
            { opacity: 0, x: 100, scale: 0.9 },
            { 
                opacity: 1, 
                x: 0, 
                scale: 1, 
                duration: 0.3, 
                ease: "back.out(1.7)" 
            }
        );
        
        // 자동 제거
        setTimeout(() => {
            gsap.to(toast, {
                duration: 0.3,
                opacity: 0,
                x: 100,
                scale: 0.9,
                ease: "power2.out",
                onComplete: () => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }
            });
        }, duration);
    } else {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, duration);
    }
    
    return toast;
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

// ===== 유틸리티 함수 =====
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

// ===== 접근성 개선 함수 =====
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
    `;
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ===== 에러 처리 =====
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('일시적인 오류가 발생했습니다. 페이지를 새로고침해주세요.', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('요청 처리 중 오류가 발생했습니다.', 'error');
    e.preventDefault();
});

// ===== 전역 함수 내보내기 =====
window.toggleMobileMenu = toggleMobileMenu;
window.toggleUserMenu = toggleUserMenu;
window.toggleNotifications = toggleNotifications;
window.initializeNavigation = initializeNavigation;
window.checkAuthStatus = checkAuthStatus;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showNotification = showNotification;
window.announceToScreenReader = announceToScreenReader;
window.debounce = debounce;
window.throttle = throttle;

console.log('Script.js loaded successfully');

// ===== CSS 스타일 주입 (토스트 및 로딩 스피너) =====
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
    `;
    document.head.appendChild(style);
}