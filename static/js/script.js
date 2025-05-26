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
    }
};

// ===== DOM 로드 완료 시 초기화 =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== 앱 초기화 =====
function initializeApp() {
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
    
    console.log('App initialized successfully');
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
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // 사용자 메뉴 토글
    const userBtn = document.querySelector('.user-btn');
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
    
    // 스크롤 이벤트
    window.addEventListener('scroll', handleScroll);
    
    // 리사이즈 이벤트
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // 모든 링크에 부드러운 스크롤 적용
    setupSmoothScroll();
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
                    repeat: 1
                });
            }
        });
    });
}

// ===== 사용자 인증 상태 확인 =====
function checkAuthStatus() {
    // 실제 구현에서는 서버 API 호출
    // 현재는 localStorage 시뮬레이션
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
}

// ===== 로그인 사용자 UI 업데이트 =====
function updateUIForLoggedUser() {
    // 로그인 필요 요소 표시
    const loginRequired = document.querySelectorAll('.login-required');
    loginRequired.forEach(el => el.style.display = 'flex');
    
    // 게스트 전용 요소 숨김
    const loggedOutOnly = document.querySelectorAll('.logged-out-only');
    loggedOutOnly.forEach(el => el.style.display = 'none');
    
    // 사용자 정보 업데이트
    if (window.APP.user) {
        const userNameEl = document.querySelector('.user-name');
        const userPointsEl = document.querySelector('.user-points');
        
        if (userNameEl) userNameEl.textContent = window.APP.user.name || '사용자';
        if (userPointsEl) userPointsEl.textContent = `${(window.APP.user.points || 0).toLocaleString()}P`;
    }
}

// ===== 게스트 사용자 UI 업데이트 =====
function updateUIForGuestUser() {
    // 로그인 필요 요소 숨김
    const loginRequired = document.querySelectorAll('.login-required');
    loginRequired.forEach(el => el.style.display = 'none');
    
    // 게스트 전용 요소 표시
    const loggedOutOnly = document.querySelectorAll('.logged-out-only');
    loggedOutOnly.forEach(el => el.style.display = 'flex');
}

// ===== 인증 초기화 =====
function initializeAuth() {
    checkAuthStatus();
}

// ===== 모바일 메뉴 토글 =====
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        toggle.classList.remove('active');
    } else {
        navMenu.classList.add('show');
        toggle.classList.add('active');
    }
    
    // GSAP 애니메이션
    if (typeof gsap !== 'undefined') {
        if (navMenu.classList.contains('show')) {
            gsap.fromTo(navMenu, 
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
            );
        }
    }
}

// ===== 사용자 메뉴 토글 =====
function toggleUserMenu() {
    const dropdown = document.getElementById('userMenuDropdown');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    } else {
        // 다른 드롭다운 닫기
        closeAllDropdowns();
        dropdown.classList.add('show');
        
        // GSAP 애니메이션
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(dropdown,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }
            );
        }
    }
}

// ===== 알림 토글 =====
function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    } else {
        // 다른 드롭다운 닫기
        closeAllDropdowns();
        dropdown.classList.add('show');
        
        // GSAP 애니메이션
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(dropdown,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
            );
        }
        
        // 알림 읽음 처리
        markNotificationsAsRead();
    }
}

// ===== 모든 드롭다운 닫기 =====
function closeAllDropdowns() {
    const dropdowns = [
        document.getElementById('userMenuDropdown'),
        document.getElementById('notificationDropdown')
    ];
    
    dropdowns.forEach(dropdown => {
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    });
}

// ===== 외부 클릭 처리 =====
function handleOutsideClick(event) {
    const userDropdown = document.getElementById('userMenuDropdown');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const userBtn = document.querySelector('.user-btn');
    const notificationBtn = document.querySelector('.notification-btn');
    
    // 사용자 메뉴 외부 클릭
    if (userDropdown && userDropdown.classList.contains('show') && 
        !userBtn.contains(event.target) && !userDropdown.contains(event.target)) {
        userDropdown.classList.remove('show');
    }
    
    // 알림 드롭다운 외부 클릭
    if (notificationDropdown && notificationDropdown.classList.contains('show') && 
        !notificationBtn.contains(event.target) && !notificationDropdown.contains(event.target)) {
        notificationDropdown.classList.remove('show');
    }
}

// ===== 스크롤 처리 =====
function handleScroll() {
    const scrollY = window.scrollY;
    const header = document.querySelector('.main-header');
    
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

// ===== 리사이즈 처리 =====
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
    
    // 모바일에서 메뉴 닫기
    if (width > 768) {
        const navMenu = document.getElementById('navMenu');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        if (navMenu) navMenu.classList.remove('show');
        if (toggle) toggle.classList.remove('active');
    }
}

// ===== 반응형 처리 =====
function handleResponsive() {
    handleResize();
    
    // 터치 디바이스 감지
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
}

// ===== GSAP 애니메이션 초기화 =====
function initializeAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // ScrollTrigger 등록
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // 페이지 로드 애니메이션
    gsap.from('.main-header', {
        duration: 0.6,
        y: -100,
        opacity: 0,
        ease: "power2.out"
    });
    
    // 페이지별 애니메이션 초기화
    initializePageAnimations();
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

// ===== 홈페이지 애니메이션 =====
function initializeHomeAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // 히어로 섹션 애니메이션
    const heroTitle = document.querySelector('.hero-title');
    const heroDesc = document.querySelector('.hero-description');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (heroTitle) {
        gsap.from(heroTitle, {
            duration: 0.8,
            y: 50,
            opacity: 0,
            ease: "power2.out",
            delay: 0.3
        });
    }
    
    if (heroDesc) {
        gsap.from(heroDesc, {
            duration: 0.8,
            y: 30,
            opacity: 0,
            ease: "power2.out",
            delay: 0.5
        });
    }
    
    if (heroButtons) {
        gsap.from(heroButtons, {
            duration: 0.8,
            y: 30,
            opacity: 0,
            ease: "power2.out",
            delay: 0.7
        });
    }
}

// ===== 검색 페이지 애니메이션 =====
function initializeSearchAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // 검색 카드 스타거 애니메이션
    const cards = document.querySelectorAll('.missing-card');
    if (cards.length > 0) {
        gsap.from(cards, {
            duration: 0.6,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            ease: "power2.out"
        });
    }
}

// ===== About 페이지 애니메이션 =====
function initializeAboutAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    // FAQ 아이템 애니메이션
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        gsap.from(faqItems, {
            scrollTrigger: {
                trigger: '.faq-section',
                start: 'top 80%'
            },
            duration: 0.5,
            x: -30,
            opacity: 0,
            stagger: 0.1,
            ease: "power2.out"
        });
    }
}

// ===== 랭킹 페이지 애니메이션 =====
function initializeRankingAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // 랭킹 아이템 애니메이션
    const rankingItems = document.querySelectorAll('.ranking-item');
    if (rankingItems.length > 0) {
        gsap.from(rankingItems, {
            duration: 0.6,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.3
        });
    }
}

// ===== 스크롤 애니메이션 트리거 =====
function triggerScrollAnimations() {
    if (typeof gsap === 'undefined') return;
    
    const animateElements = document.querySelectorAll('.animate-on-scroll:not(.animated)');
    
    animateElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animated');
            
            gsap.fromTo(element,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
            );
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
                if (typeof gsap !== 'undefined') {
                    gsap.to(window, {
                        duration: 0.8,
                        scrollTo: { y: targetElement.offsetTop - 100 },
                        ease: "power2.inOut"
                    });
                } else {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
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
    
    setTimeout(() => {
        unreadItems.forEach(item => {
            item.classList.remove('unread');
        });
        
        if (notificationBadge) {
            notificationBadge.style.display = 'none';
        }
    }, 1000);
}

// ===== 로딩 인디케이터 =====
function showLoading(target = 'body') {
    const targetEl = typeof target === 'string' ? document.querySelector(target) : target;
    
    if (!targetEl) return;
    
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <span>로딩 중...</span>
        </div>
    `;
    
    targetEl.appendChild(loader);
    
    if (typeof gsap !== 'undefined') {
        gsap.from(loader, {
            duration: 0.3,
            opacity: 0,
            ease: "power2.out"
        });
    }
    
    return loader;
}

function hideLoading(loader) {
    if (!loader) return;
    
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

// ===== 토스트 알림 =====
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(toast,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
        
        setTimeout(() => {
            gsap.to(toast, {
                duration: 0.3,
                opacity: 0,
                y: -50,
                ease: "power2.out",
                onComplete: () => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }
            });
        }, duration);
    } else {
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, duration);
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

// ===== 전역 함수 내보내기 =====
window.toggleMobileMenu = toggleMobileMenu;
window.toggleUserMenu = toggleUserMenu;
window.toggleNotifications = toggleNotifications;
window.initializeNavigation = initializeNavigation;
window.initializeAuth = initializeAuth;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showToast = showToast;

console.log('Script.js loaded successfully');