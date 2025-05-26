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
    
    // 스크롤 이벤트
    window.addEventListener('scroll', handleScroll);
    
    // 리사이즈 이벤트
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // 모든 링크에 부드러운 스크롤 적용
    setupSmoothScroll();
    
    // 네비게이션 초기화
    initializeNavigation();
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
                    repeat: 1,
                    clearProps: 'transform'
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
    const authRequired = document.querySelectorAll('.auth-required');
    authRequired.forEach(el => el.style.display = 'flex');
    
    // 게스트 전용 요소 숨김
    const guestActions = document.querySelectorAll('.guest-actions');
    guestActions.forEach(el => el.style.display = 'none');
    
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
    authRequired.forEach(el => el.style.display = 'none');
    
    // 게스트 전용 요소 표시
    const guestActions = document.querySelectorAll('.guest-actions');
    guestActions.forEach(el => el.style.display = 'flex');
    
    // body 클래스 업데이트
    document.body.classList.add('user-guest');
    document.body.classList.remove('user-authenticated');
}

// ===== 모바일 메뉴 토글 =====
function toggleMobileMenu() {
    const mobileNav = document.querySelector('.mobile-nav');
    const toggle = document.querySelector('.mobile-menu-btn');
    
    if (!mobileNav || !toggle) return;
    
    if (mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        toggle.classList.remove('active');
        
        // GSAP 애니메이션
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
        mobileNav.classList.add('active');
        toggle.classList.add('active');
        mobileNav.style.display = 'block';
        
        // GSAP 애니메이션
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(mobileNav, 
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
            );
        }
    }
}

// ===== 사용자 메뉴 토글 =====
function toggleUserMenu() {
    const dropdown = document.getElementById('userMenuDropdown');
    
    if (!dropdown) return;
    
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
    
    if (!dropdown) return;
    
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
    const dropdowns = document.querySelectorAll('.dropdown-menu, .user-dropdown, .notification-dropdown');
    
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
    const userBtn = document.querySelector('.profile-btn');
    const notificationBtn = document.querySelector('.notification-btn');
    
    // 사용자 메뉴 외부 클릭
    if (userDropdown && userDropdown.classList.contains('show') && 
        userBtn && !userBtn.contains(event.target) && !userDropdown.contains(event.target)) {
        userDropdown.classList.remove('show');
    }
    
    // 알림 드롭다운 외부 클릭
    if (notificationDropdown && notificationDropdown.classList.contains('show') && 
        notificationBtn && !notificationBtn.contains(event.target) && !notificationDropdown.contains(event.target)) {
        notificationDropdown.classList.remove('show');
    }
}

// ===== 스크롤 처리 =====
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
        const mobileNav = document.querySelector('.mobile-nav');
        const toggle = document.querySelector('.mobile-menu-btn');
        
        if (mobileNav) {
            mobileNav.classList.remove('active');
            mobileNav.style.display = 'none';
        }
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
    gsap.from('.header', {
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

// ===== 홈페이지 기본 애니메이션 =====
function initializeHomeAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // 기본 요소들 애니메이션 (index.js에서 더 상세한 애니메이션 처리됨)
    const fadeElements = document.querySelectorAll('.fade-in-up:not(.animated)');
    
    fadeElements.forEach((element, index) => {
        gsap.from(element, {
            duration: 0.6,
            y: 30,
            opacity: 0,
            ease: "power2.out",
            delay: index * 0.1,
            onComplete: () => {
                element.classList.add('animated');
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
        gsap.from(cards, {
            duration: 0.6,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            ease: "power2.out",
            onComplete: () => {
                cards.forEach(card => card.classList.add('animated'));
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
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                once: true
            },
            duration: 0.8,
            y: 50,
            opacity: 0,
            ease: "power2.out",
            onComplete: () => {
                section.classList.add('animated');
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
        gsap.from(rankingItems, {
            duration: 0.6,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.3,
            onComplete: () => {
                rankingItems.forEach(item => item.classList.add('animated'));
            }
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
                if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
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

// ===== 알림 시스템 (개선됨) =====
function showNotification(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `notification-toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${getToastIcon(type)}"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // 토스트 컨테이너 확인/생성
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(toastContainer);
    }
    
    toast.style.pointerEvents = 'auto';
    toastContainer.appendChild(toast);
    
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(toast,
            { opacity: 0, x: 50, scale: 0.9 },
            { opacity: 1, x: 0, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
        
        setTimeout(() => {
            gsap.to(toast, {
                duration: 0.3,
                opacity: 0,
                x: 50,
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
window.checkAuthStatus = checkAuthStatus;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showNotification = showNotification;

console.log('Script.js loaded successfully');