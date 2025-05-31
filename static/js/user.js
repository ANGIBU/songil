// static/js/user.js

// ===== 전역 변수 =====
window.userApp = {
    isLoggedIn: false,
    userId: null,
    userPoints: 0,
    notifications: [],
    currentPage: null
};

// ===== DOM 로드시 초기화 =====
document.addEventListener('DOMContentLoaded', function() {
    initializeUserApp();
});

// ===== 사용자 앱 초기화 =====
function initializeUserApp() {
    // 현재 페이지 확인
    window.userApp.currentPage = getCurrentPage();
    
    // 사용자 인증 상태 확인
    checkAuthenticationStatus();
    
    // 공통 이벤트 리스너 설정
    setupCommonEventListeners();
    
    // 반응형 처리
    setupResponsiveHandlers();
    
    // 알림 시스템 초기화
    initializeNotificationSystem();
    
    // 페이지별 초기화
    initializePageSpecific();
}

// ===== 현재 페이지 확인 =====
function getCurrentPage() {
    const path = window.location.pathname;
    
    if (path === '/' || path === '/index') return 'home';
    if (path.includes('/search')) return 'search';
    if (path.includes('/missing/')) return 'missing-detail';
    if (path.includes('/report')) return 'missing-report';
    if (path.includes('/witness')) return 'witness-report';
    if (path.includes('/mypage')) return 'mypage';
    if (path.includes('/notifications')) return 'notifications';
    if (path.includes('/pointshop')) return 'pointshop';
    if (path.includes('/ranking')) return 'ranking';
    if (path.includes('/about')) return 'about';
    if (path.includes('/login')) return 'login';
    if (path.includes('/register')) return 'register';
    
    return 'unknown';
}

// ===== 사용자 인증 상태 확인 =====
function checkAuthenticationStatus() {
    // 실제로는 서버 API 호출
    const token = localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
        window.userApp.isLoggedIn = true;
        window.userApp.userId = userId;
        updateUIForLoggedInUser();
    } else {
        window.userApp.isLoggedIn = false;
        updateUIForLoggedOutUser();
    }
}

// ===== 로그인 사용자 UI 업데이트 =====
function updateUIForLoggedInUser() {
    // 로그인 전용 요소 표시
    const loginRequiredElements = document.querySelectorAll('.login-required');
    loginRequiredElements.forEach(el => {
        el.style.display = 'block';
    });
    
    // 로그아웃 상태 요소 숨김
    const loggedOutElements = document.querySelectorAll('.logged-out-only');
    loggedOutElements.forEach(el => {
        el.style.display = 'none';
    });
    
    // 사용자 정보 로드
    loadUserInfo();
}

// ===== 로그아웃 사용자 UI 업데이트 =====
function updateUIForLoggedOutUser() {
    // 로그인 전용 요소 숨김
    const loginRequiredElements = document.querySelectorAll('.login-required');
    loginRequiredElements.forEach(el => {
        el.style.display = 'none';
    });
    
    // 로그아웃 상태 요소 표시
    const loggedOutElements = document.querySelectorAll('.logged-out-only');
    loggedOutElements.forEach(el => {
        el.style.display = 'block';
    });
}

// ===== 사용자 정보 로드 =====
async function loadUserInfo() {
    try {
        // 실제로는 API 호출
        const userInfo = {
            id: window.userApp.userId,
            name: '테스트사용자',
            points: 1250,
            rank: 47
        };
        
        window.userApp.userPoints = userInfo.points;
        
        // UI 업데이트
        updateUserInfoInUI(userInfo);
        
    } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        showNotification('사용자 정보를 불러오는데 실패했습니다.', 'error');
    }
}

// ===== UI에 사용자 정보 업데이트 =====
function updateUserInfoInUI(userInfo) {
    // 포인트 표시 업데이트
    const pointElements = document.querySelectorAll('.user-points, .points-amount');
    pointElements.forEach(el => {
        el.textContent = userInfo.points.toLocaleString();
    });
    
    // 사용자명 표시 업데이트
    const nameElements = document.querySelectorAll('.user-name, .username');
    nameElements.forEach(el => {
        el.textContent = userInfo.name;
    });
    
    // 순위 표시 업데이트
    const rankElements = document.querySelectorAll('.user-rank');
    rankElements.forEach(el => {
        el.textContent = `#${userInfo.rank}`;
    });
}

// ===== 공통 이벤트 리스너 설정 =====
function setupCommonEventListeners() {
    // 모든 링크에 클릭 애니메이션 추가
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a, button');
        if (link && !link.classList.contains('no-animation')) {
            addClickAnimation(link);
        }
    });
    
    // 폼 제출 이벤트
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.tagName === 'FORM') {
            handleFormSubmit(e);
        }
    });
    
    // 스크롤 이벤트
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 16); // 60fps
    });
    
    // 리사이즈 이벤트
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });
}

// ===== 클릭 애니메이션 =====
function addClickAnimation(element) {
    if (typeof gsap !== 'undefined') {
        gsap.to(element, {
            duration: 0.1,
            scale: 0.95,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1
        });
    }
}

// ===== 폼 제출 처리 =====
function handleFormSubmit(event) {
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (submitButton) {
        // 로딩 상태 표시
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 처리 중...';
        submitButton.disabled = true;
        
        // 실제 제출 후 복원 (다른 함수에서 처리)
        form.addEventListener('submit-complete', function() {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        });
    }
}

// ===== 스크롤 처리 =====
function handleScroll() {
    const scrollY = window.scrollY;
    
    // 헤더 스크롤 효과
    const header = document.querySelector('header, .header');
    if (header) {
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // 스크롤 기반 애니메이션
    if (typeof gsap !== 'undefined') {
        handleScrollAnimations();
    }
}

// ===== 스크롤 애니메이션 처리 =====
function handleScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    animateElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            if (!element.classList.contains('animated')) {
                element.classList.add('animated');
                
                gsap.fromTo(element, 
                    {
                        opacity: 0,
                        y: 30
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out'
                    }
                );
            }
        }
    });
}

// ===== 리사이즈 처리 =====
function handleResize() {
    // 모바일/데스크톱 전환 처리
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle('mobile', isMobile);
    document.body.classList.toggle('desktop', !isMobile);
    
    // 레이아웃 재계산
    recalculateLayouts();
}

// ===== 레이아웃 재계산 =====
function recalculateLayouts() {
    // 그리드 레이아웃 재계산
    const grids = document.querySelectorAll('.auto-grid');
    grids.forEach(grid => {
        adjustGridColumns(grid);
    });
}

// ===== 그리드 컬럼 조정 =====
function adjustGridColumns(grid) {
    const containerWidth = grid.offsetWidth;
    const minColumnWidth = 280;
    const columnCount = Math.floor(containerWidth / minColumnWidth);
    
    grid.style.gridTemplateColumns = `repeat(${Math.max(1, columnCount)}, 1fr)`;
}

// ===== 반응형 핸들러 설정 =====
function setupResponsiveHandlers() {
    // 초기 반응형 클래스 설정
    handleResize();
    
    // 터치 디바이스 감지
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
}

// ===== 알림 시스템 초기화 =====
function initializeNotificationSystem() {
    // 알림 컨테이너 생성
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
}

// ===== 알림 표시 =====
function showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 16px 20px;
        margin-bottom: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-left: 4px solid ${getNotificationColor(type)};
        pointer-events: auto;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    // 아이콘과 메시지 추가
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas ${getNotificationIcon(type)} flex-shrink-0" style="color: ${getNotificationColor(type)};"></i>
            <span style="flex: 1; color: #374151; font-size: 14px; line-height: 1.5;">${message}</span>
            <button onclick="closeNotification(this)" style="background: none; border: none; color: #9ca3af; cursor: pointer; padding: 0; font-size: 16px;" title="닫기">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    container.appendChild(notification);
    
    // 애니메이션으로 표시
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // 자동 제거
    if (duration > 0) {
        setTimeout(() => {
            closeNotification(notification);
        }, duration);
    }
    
    return notification;
}

// ===== 알림 색상 반환 =====
function getNotificationColor(type) {
    const colors = {
        'success': '#22c55e',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#3b82f6'
    };
    return colors[type] || colors['info'];
}

// ===== 알림 아이콘 반환 =====
function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons['info'];
}

// ===== 알림 닫기 =====
function closeNotification(element) {
    const notification = element.closest ? element.closest('.notification') : element;
    
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===== 페이지별 초기화 =====
function initializePageSpecific() {
    switch (window.userApp.currentPage) {
        case 'home':
            initializeHomePage();
            break;
        case 'search':
            initializeSearchPage();
            break;
        case 'missing-detail':
            initializeMissingDetailPage();
            break;
        case 'ranking':
            initializeRankingPage();
            break;
    }
}

// ===== 실종자 상세 페이지 초기화 =====
function initializeMissingDetailPage() {
    // 실종자 상세 페이지 관련 초기화
    // missing-detail.js에서 처리되므로 여기서는 기본 설정만
}

// ===== 랭킹 페이지 초기화 =====
function initializeRankingPage() {
    // 랭킹 페이지 관련 초기화
}

// ===== 홈페이지 초기화 =====
function initializeHomePage() {
    // Three.js 3D 요소 초기화
    if (typeof THREE !== 'undefined') {
        initializeThreeJSElements();
    }
    
    // 통계 카운터 애니메이션
    initializeCounterAnimations();
}

// ===== Three.js 요소 초기화 =====
function initializeThreeJSElements() {
    const container = document.getElementById('hero-3d-container');
    if (!container) return;
    
    try {
        // 간단한 3D 네트워크 시각화
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        
        // 파티클 생성
        const particles = createNetworkParticles();
        scene.add(particles);
        
        camera.position.z = 5;
        
        // 애니메이션 루프
        function animate() {
            requestAnimationFrame(animate);
            
            particles.rotation.x += 0.001;
            particles.rotation.y += 0.002;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // 리사이즈 처리
        window.addEventListener('resize', () => {
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        });
        
    } catch (error) {
        console.warn('Three.js 초기화 실패:', error);
        // 폴백 2D 요소 표시
        showFallbackHeroElement(container);
    }
}

// ===== 네트워크 파티클 생성 =====
function createNetworkParticles() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    
    for (let i = 0; i < 100; i++) {
        vertices.push(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
        
        colors.push(
            0.3 + Math.random() * 0.4,
            0.5 + Math.random() * 0.3,
            0.8 + Math.random() * 0.2
        );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    return new THREE.Points(geometry, material);
}

// ===== 폴백 히어로 요소 =====
function showFallbackHeroElement(container) {
    container.innerHTML = `
        <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(239, 68, 68, 0.1));
            border-radius: 16px;
        ">
            <div style="text-align: center; color: #6b7280;">
                <i class="fas fa-network-wired" style="font-size: 48px; margin-bottom: 16px; color: #3b82f6;"></i>
                <p>함께 찾아요, 소중한 사람을</p>
            </div>
        </div>
    `;
}

// ===== 카운터 애니메이션 초기화 =====
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('.counter-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// ===== 카운터 애니메이션 =====
function animateCounter(element) {
    const target = parseInt(element.dataset.target || element.textContent.replace(/,/g, ''));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// ===== 검색 페이지 초기화 =====
function initializeSearchPage() {
    // 무한 스크롤 설정
    setupInfiniteScroll();
    
    // 필터 이벤트 설정
    setupFilterEvents();
}

// ===== 필터 이벤트 설정 =====
function setupFilterEvents() {
    // 필터 관련 이벤트 설정
}

// ===== 무한 스크롤 설정 =====
function setupInfiniteScroll() {
    let loading = false;
    let hasMore = true;
    
    window.addEventListener('scroll', () => {
        if (loading || !hasMore) return;
        
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        
        if (scrollTop + clientHeight >= scrollHeight - 1000) {
            loading = true;
            loadMoreContent();
        }
    });
}

// ===== 더 많은 컨텐츠 로드 =====
async function loadMoreContent() {
    try {
        // 로딩 인디케이터 표시
        showLoadingIndicator();
        
        // API 호출 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 컨텐츠 추가 (실제로는 API 데이터 사용)
        const newContent = generateDummyContent();
        appendContentToGrid(newContent);
        
        hideLoadingIndicator();
        
    } catch (error) {
        console.error('컨텐츠 로드 실패:', error);
        showNotification('더 많은 내용을 불러오는데 실패했습니다.', 'error');
    }
    
    loading = false;
}

// ===== 더미 컨텐츠 생성 =====
function generateDummyContent() {
    // 실제로는 서버에서 데이터를 받아옴
    return [];
}

// ===== 컨텐츠를 그리드에 추가 =====
function appendContentToGrid(content) {
    // 실제로는 받은 데이터로 DOM 요소 생성 후 추가
}

// ===== 로딩 인디케이터 표시 =====
function showLoadingIndicator() {
    const existing = document.getElementById('loading-indicator');
    if (existing) return;
    
    const indicator = document.createElement('div');
    indicator.id = 'loading-indicator';
    indicator.style.cssText = `
        text-align: center;
        padding: 40px;
        color: #6b7280;
    `;
    indicator.innerHTML = `
        <i class="fas fa-spinner fa-spin" style="font-size: 24px; margin-bottom: 12px;"></i>
        <p>더 많은 내용을 불러오는 중...</p>
    `;
    
    const container = document.querySelector('.content-grid, .results-container');
    if (container) {
        container.appendChild(indicator);
    }
}

// ===== 로딩 인디케이터 숨김 =====
function hideLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// ===== API 호출 유틸리티 =====
async function apiCall(endpoint, options = {}) {
    const baseURL = window.location.origin;
    const token = localStorage.getItem('userToken');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(`${baseURL}${endpoint}`, finalOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('API 호출 실패:', error);
        throw error;
    }
}

// ===== 폼 유효성 검사 유틸리티 =====
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        const errorElement = field.parentNode.querySelector('.error-message');
        
        if (!value) {
            showFieldError(field, '이 필드는 필수입니다.');
            isValid = false;
        } else if (errorElement) {
            hideFieldError(field);
        }
    });
    
    return isValid;
}

// ===== 필드 에러 표시 =====
function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.cssText = 'color: #ef4444; font-size: 12px; margin-top: 4px;';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

// ===== 필드 에러 숨김 =====
function hideFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// ===== 디바운스 유틸리티 =====
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

// ===== 랜덤 ID 생성 =====
function generateRandomId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// ===== 날짜 포맷팅 =====
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

// ===== 시간 차이 계산 =====
function getTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    return formatDate(date, 'YYYY.MM.DD');
}

// ===== 전역 함수로 내보내기 =====
window.showNotification = showNotification;
window.closeNotification = closeNotification;
window.apiCall = apiCall;
window.validateForm = validateForm;
window.showFieldError = showFieldError;
window.hideFieldError = hideFieldError;
window.debounce = debounce;
window.formatDate = formatDate;
window.getTimeAgo = getTimeAgo;