// static/js/script.js

// ===== 전역 변수 및 설정 =====
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
function setupHomePageCards() {
    try {
        const urgentCards = document.querySelectorAll('.urgent-cards .missing-card');
        
        urgentCards.forEach((card, index) => {
            if (!card) return;
            
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
        const allCards = document.querySelectorAll('.missing-card');
        
        allCards.forEach(card => {
            if (card) {
                setupCardEvents(card);
            }
        });
    } catch (error) {
        console.warn('범용 카드 이벤트 설정 오류:', error);
    }
}

// ===== 개별 카드 이벤트 설정 =====
function setupCardEvents(card) {
    if (!card) return;
    
    try {
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
        const detailLink = card.querySelector('.detail-link');
        if (!detailLink) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function(e) {
                // UP 버튼 클릭은 제외
                if (!e.target.closest('.stat')) {
                    const cardId = this.dataset.id || extractCardId(this);
                    if (cardId) {
                        window.location.href = `/missing/${cardId}`;
                    }
                }
            });
        }
    } catch (error) {
        console.warn('카드 이벤트 설정 오류:', error);
    }
}

// ===== UP 클릭 핸들러 - 통일된 처리 =====
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
        if (window.showNotification) {
            window.showNotification('UP을 눌렀습니다! 실종자 찾기에 도움이 됩니다.', 'success');
        }
        
        // 서버에 UP 정보 전송
        const cardId = extractCardId(stat.closest('.missing-card'));
        if (cardId) {
            sendUpToServer(cardId, newCount);
        }
    } catch (error) {
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
function extractCardId(card) {
    if (!card) return null;
    
    try {
        // data-id 속성에서 추출
        if (card.dataset && card.dataset.id) {
            return card.dataset.id;
        }
        
        // detail-link href에서 추출
        const detailLink = card.querySelector('.detail-link');
        if (detailLink && detailLink.href) {
            const match = detailLink.href.match(/\/missing\/(\d+)/);
            return match ? match[1] : null;
        }
        
        // URL에서 추출 (상세 페이지인 경우)
        const pathMatch = window.location.pathname.match(/\/missing\/(\d+)/);
        return pathMatch ? pathMatch[1] : null;
    } catch (error) {
        console.warn('카드 ID 추출 오류:', error);
        return null;
    }
}

// ===== 서버에 UP 정보 전송 =====
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
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        
        // 즉시 상단으로 스크롤
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
        
        // 추가 안전장치
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);
    } catch (error) {
        console.warn('스크롤 최적화 오류:', error);
    }
}

// ===== 현재 페이지 식별 =====
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
        
        // 페이지별 CSS 클래스 추가
        if (document.body) {
            document.body.classList.add(`page-${window.APP.currentPage}`);
        }
    } catch (error) {
        console.warn('페이지 식별 오류:', error);
    }
}

// ===== 이벤트 리스너 설정 =====
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
        
        // 알림 버튼
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', toggleNotifications);
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
        const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
        
        internalLinks.forEach(link => {
            if (link) {
                link.addEventListener('click', function(e) {
                    // 페이지 전환 시 상단으로 스크롤 준비
                    if ('scrollRestoration' in history) {
                        history.scrollRestoration = 'manual';
                    }
                });
            }
        });
        
        // popstate 이벤트에서 스크롤 최적화
        window.addEventListener('popstate', function() {
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 0);
        });
    } catch (error) {
        console.warn('페이지 전환 최적화 오류:', error);
    }
}

// ===== 키보드 접근성 설정 =====
function setupKeyboardNavigation() {
    try {
        document.addEventListener('keydown', function(e) {
            if (!e) return;
            
            // ESC 키로 모든 드롭다운 닫기
            if (e.key === 'Escape') {
                closeAllDropdowns();
                if (document.activeElement && document.activeElement.blur) {
                    document.activeElement.blur();
                }
            }
            
            // Tab 키 네비게이션 향상
            if (e.key === 'Tab') {
                if (document.body) {
                    document.body.classList.add('keyboard-nav');
                }
            }
        });
        
        // 마우스 사용 시 키보드 네비게이션 스타일 제거
        document.addEventListener('mousedown', function() {
            if (document.body) {
                document.body.classList.remove('keyboard-nav');
            }
        });
    } catch (error) {
        console.warn('키보드 접근성 설정 오류:', error);
    }
}

// ===== 나머지 함수들 (안전성 강화) =====

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
        console.warn('네비게이션 초기화 오류:', error);
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
        console.warn('인증 상태 확인 오류:', error);
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
        console.warn('로그인 UI 업데이트 오류:', error);
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
        console.warn('게스트 UI 업데이트 오류:', error);
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
        console.warn('모바일 메뉴 토글 오류:', error);
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
        console.warn('드롭다운 닫기 오류:', error);
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
        console.warn('스크롤 처리 오류:', error);
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
        console.warn('반응형 처리 오류:', error);
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
        console.warn('알림 표시 오류:', error);
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