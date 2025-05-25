// static/js/script.js

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeAnimations();
    initializeMobileMenu();
    initializeAuthState();
});

// 앱 초기화
function initializeApp() {
    console.log('실종자 찾기 플랫폼 초기화됨');
    
    // 페이지 로드 시 GSAP 애니메이션
    if (typeof gsap !== 'undefined') {
        gsap.from('.hero-title', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power2.out'
        });
        
        gsap.from('.hero-description', {
            duration: 1,
            y: 30,
            opacity: 0,
            delay: 0.3,
            ease: 'power2.out'
        });
        
        gsap.from('.hero-buttons .btn', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            delay: 0.6,
            stagger: 0.2,
            ease: 'power2.out'
        });
    }
}

// 애니메이션 초기화
function initializeAnimations() {
    // 통계 카운트업 애니메이션
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = parseInt(target.dataset.count);
                animateCounter(target, finalNumber);
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
    
    // 카드 등장 애니메이션
    if (typeof gsap !== 'undefined') {
        const cards = document.querySelectorAll('.missing-card');
        
        gsap.set(cards, {
            y: 50,
            opacity: 0
        });
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.to(entry.target, {
                        duration: 0.8,
                        y: 0,
                        opacity: 1,
                        ease: 'power2.out'
                    });
                    cardObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        cards.forEach(card => {
            cardObserver.observe(card);
        });
        
        // 스텝 애니메이션
        const steps = document.querySelectorAll('.step');
        gsap.set(steps, {
            y: 30,
            opacity: 0
        });
        
        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.to(entry.target, {
                        duration: 0.6,
                        y: 0,
                        opacity: 1,
                        ease: 'power2.out',
                        delay: Math.random() * 0.3
                    });
                    stepObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        steps.forEach(step => {
            stepObserver.observe(step);
        });
    }
}

// 카운터 애니메이션 함수
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 40);
}

// 모바일 메뉴 초기화
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            
            // 아이콘 변경
            const icon = this.querySelector('i');
            if (mobileNav.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // 모바일 메뉴 링크 클릭 시 메뉴 닫기
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
            });
        });
    }
}

// 인증 상태 초기화 (임시 - 실제로는 서버에서 확인)
function initializeAuthState() {
    // 임시로 로컬스토리지를 사용하여 로그인 상태 시뮬레이션
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        document.body.classList.add('user-authenticated');
        // 사용자 정보 표시 (임시)
        const userName = localStorage.getItem('userName') || '사용자';
        const userPoints = localStorage.getItem('userPoints') || '0';
        
        // 필요시 사용자 정보 업데이트
        updateUserInfo(userName, userPoints);
    }
}

// 사용자 정보 업데이트
function updateUserInfo(name, points) {
    // 포인트 정보 업데이트 등 필요한 UI 업데이트 수행
    console.log(`사용자: ${name}, 포인트: ${points}`);
}

// UP 버튼 클릭 이벤트
document.addEventListener('click', function(e) {
    if (e.target.closest('.up-btn')) {
        e.preventDefault();
        const upBtn = e.target.closest('.up-btn');
        const countSpan = upBtn.querySelector('span');
        const currentCount = parseInt(countSpan.textContent);
        
        // UP 애니메이션
        if (typeof gsap !== 'undefined') {
            gsap.to(upBtn, {
                duration: 0.2,
                scale: 1.1,
                ease: 'power2.out',
                yoyo: true,
                repeat: 1
            });
        }
        
        // 카운트 증가
        countSpan.textContent = currentCount + 1;
        
        // 임시로 알림 표시
        showNotification('UP을 눌렀습니다!', 'success');
    }
});

// 알림 표시 함수
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 스타일 설정
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // 타입별 배경색
    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // 애니메이션으로 표시
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 3초 후 제거
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// 로그인 시뮬레이션 함수 (개발용)
function simulateLogin(username = '테스트사용자', points = 1250) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', username);
    localStorage.setItem('userPoints', points);
    document.body.classList.add('user-authenticated');
    updateUserInfo(username, points);
    showNotification('로그인되었습니다!', 'success');
}

// 로그아웃 시뮬레이션 함수 (개발용)
function simulateLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPoints');
    document.body.classList.remove('user-authenticated');
    showNotification('로그아웃되었습니다!', 'info');
}

// 개발용 콘솔 명령어
if (typeof window !== 'undefined') {
    window.devTools = {
        login: simulateLogin,
        logout: simulateLogout,
        notify: showNotification
    };
    
    console.log('개발용 도구 사용법:');
    console.log('- devTools.login() : 로그인 시뮬레이션');
    console.log('- devTools.logout() : 로그아웃 시뮬레이션');
    console.log('- devTools.notify("메시지", "타입") : 알림 표시');
}

// 스크롤 시 헤더 그림자 효과
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 0) {
        header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});

// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});