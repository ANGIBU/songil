// static/js/index.js

// ===== 전역 변수 및 설정 =====
window.indexApp = {
    initialized: false,
    animations: {
        gsapReady: false,
        reactReady: false
    },
    rankings: [],
    urgentMissing: [],
    stats: {
        reports: 1847,
        reunions: 1203,
        helpers: 15429,
        hope: 94
    }
};

// ===== DOM 로드 완료 시 초기화 =====
document.addEventListener('DOMContentLoaded', function() {
    if (!window.indexApp.initialized) {
        initializeIndexPage();
    }
});

// 이미 로드된 경우 즉시 초기화
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if (!window.indexApp.initialized) {
        initializeIndexPage();
    }
}

// ===== 인덱스 페이지 초기화 =====
function initializeIndexPage() {
    if (window.indexApp.initialized) return;
    
    try {
        // GSAP 및 React 로드 확인
        checkLibrariesLoaded();
        
        // 기본 이벤트 리스너 설정 (안전한 버전)
        setupSafeEventListeners();
        
        // 페이지 애니메이션 초기화
        initializePageAnimations();
        
        // 순위 데이터 초기화
        initializeRankingData();
        
        // 긴급 실종자 데이터 초기화
        initializeUrgentMissingData();
        
        // 통계 카운터 애니메이션
        initializeStatCounters();
        
        // UP 버튼 이벤트 설정 (안전한 버전)
        setupSafeUpButtonEvents();
        
        // 카드 호버 효과 설정 (안전한 버전)
        setupSafeCardHoverEffects();
        
        window.indexApp.initialized = true;
        
    } catch (error) {
        console.warn('Index 페이지 초기화 중 오류 발생:', error);
        // 폴백 모드로 기본 기능만 활성화
        setupFallbackMode();
    }
}

// ===== 라이브러리 로드 상태 확인 =====
function checkLibrariesLoaded() {
    // GSAP 로드 확인
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        window.indexApp.animations.gsapReady = true;
        gsap.registerPlugin(ScrollTrigger);
        
        // GSAP 애니메이션 준비 클래스 추가
        document.documentElement.classList.add('gsap-animation-ready');
    }
    
    // React 로드 확인
    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
        window.indexApp.animations.reactReady = true;
    }
}

// ===== 안전한 이벤트 리스너 설정 =====
function setupSafeEventListeners() {
    // 안전한 이벤트 위임 - null 체크 강화
    document.addEventListener('click', function(e) {
        // 안전한 타겟 확인
        if (!e || !e.target) return;
        
        try {
            // UP 버튼 클릭 처리 (안전한 버전)
            const upButton = e.target.closest('.up-btn');
            if (upButton) {
                e.preventDefault();
                e.stopPropagation();
                handleSafeUpClick(upButton);
                return;
            }
            
            // 카드 내부 stat 클릭 처리 (안전한 버전)
            const statElement = e.target.closest('.stat');
            if (statElement && statElement.innerHTML && statElement.innerHTML.includes('fa-arrow-up')) {
                e.preventDefault();
                e.stopPropagation();
                handleSafeUpClick(statElement);
                return;
            }
            
            // 상세보기 버튼 클릭
            const detailBtn = e.target.closest('.detail-btn');
            if (detailBtn) {
                const card = detailBtn.closest('.missing-card');
                if (card && card.dataset && card.dataset.id) {
                    window.location.href = `/missing/${card.dataset.id}`;
                }
                return;
            }
            
            // 카드 전체 클릭 (detail-link가 없는 경우)
            const card = e.target.closest('.missing-card');
            if (card && !card.querySelector('.detail-link') && card.dataset && card.dataset.id) {
                // stat 버튼 클릭이 아닌 경우에만
                if (!e.target.closest('.stat, .up-btn, .card-actions')) {
                    window.location.href = `/missing/${card.dataset.id}`;
                }
                return;
            }
            
        } catch (error) {
            console.warn('이벤트 처리 중 오류:', error);
        }
    });
    
    // 안전한 호버 이벤트 위임
    document.addEventListener('mouseenter', function(e) {
        if (!e || !e.target) return;
        
        try {
            // classList 존재 확인 후 접근
            if (e.target.classList && e.target.classList.contains('missing-card')) {
                handleSafeCardHover(e.target, true);
            }
        } catch (error) {
            console.warn('마우스 엔터 이벤트 오류:', error);
        }
    }, true);
    
    document.addEventListener('mouseleave', function(e) {
        if (!e || !e.target) return;
        
        try {
            // classList 존재 확인 후 접근
            if (e.target.classList && e.target.classList.contains('missing-card')) {
                handleSafeCardHover(e.target, false);
            }
        } catch (error) {
            console.warn('마우스 리브 이벤트 오류:', error);
        }
    }, true);
}

// ===== 안전한 UP 클릭 처리 =====
function handleSafeUpClick(element) {
    if (!element) return;
    
    try {
        // 현재 카운트 추출 (안전한 방식)
        let currentCount = 0;
        const textContent = element.textContent || element.innerText || '';
        const countMatch = textContent.match(/\d+/);
        if (countMatch) {
            currentCount = parseInt(countMatch[0]) || 0;
        }
        
        const newCount = currentCount + 1;
        
        // innerHTML 업데이트 (안전한 방식)
        if (element.querySelector('i')) {
            // 기존 아이콘이 있는 경우
            element.innerHTML = `<i class="fas fa-arrow-up"></i> ${newCount}`;
        } else {
            // 아이콘이 없는 경우
            element.innerHTML = `<i class="fas fa-arrow-up"></i><span>${newCount}</span>`;
        }
        
        // 애니메이션 효과 (GSAP 사용 가능한 경우)
        if (window.indexApp.animations.gsapReady && typeof gsap !== 'undefined') {
            gsap.timeline()
                .to(element, {
                    duration: 0.1,
                    scale: 0.9,
                    ease: 'power2.in'
                })
                .to(element, {
                    duration: 0.4,
                    scale: 1.2,
                    ease: 'elastic.out(1, 0.5)'
                })
                .to(element, {
                    duration: 0.2,
                    scale: 1,
                    ease: 'power2.out'
                });
            
            // 파티클 효과
            createSafeUpParticles(element);
        }
        
        // 알림 표시
        if (window.showNotification) {
            window.showNotification('UP을 눌렀습니다! 실종자 찾기에 도움이 됩니다.', 'success');
        }
        
        // 서버에 UP 정보 전송 (안전한 방식)
        const card = element.closest('.missing-card');
        if (card && card.dataset && card.dataset.id) {
            sendUpToServer(card.dataset.id, newCount);
        }
        
    } catch (error) {
        console.warn('UP 클릭 처리 중 오류:', error);
    }
}

// ===== 안전한 카드 호버 처리 =====
function handleSafeCardHover(card, isEntering) {
    if (!card || !window.indexApp.animations.gsapReady) return;
    
    try {
        if (typeof gsap !== 'undefined') {
            if (isEntering) {
                gsap.to(card, {
                    duration: 0.3,
                    y: -4,
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.12)',
                    ease: 'power2.out'
                });
            } else {
                gsap.to(card, {
                    duration: 0.3,
                    y: 0,
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                    ease: 'power2.out'
                });
            }
        }
    } catch (error) {
        console.warn('카드 호버 애니메이션 오류:', error);
    }
}

// ===== 안전한 UP 파티클 효과 =====
function createSafeUpParticles(element) {
    if (!element || !window.indexApp.animations.gsapReady || typeof gsap === 'undefined') return;
    
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
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }
            });
        }
    } catch (error) {
        console.warn('파티클 효과 생성 오류:', error);
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

// ===== 페이지 애니메이션 초기화 =====
function initializePageAnimations() {
    if (!window.indexApp.animations.gsapReady) return;
    
    try {
        // 히어로 섹션 애니메이션
        gsap.timeline()
            .from('.hero-title', {
                duration: 1,
                y: 60,
                opacity: 0,
                ease: 'power3.out'
            })
            .from('.hero-description', {
                duration: 0.8,
                y: 40,
                opacity: 0,
                ease: 'power2.out'
            }, '-=0.5')
            .from('.hero-buttons', {
                duration: 0.6,
                y: 30,
                opacity: 0,
                ease: 'power2.out'
            }, '-=0.3')
            .from('.ranking-display', {
                duration: 1,
                x: 80,
                opacity: 0,
                ease: 'power2.out'
            }, '-=0.7');
        
        // 스크롤 기반 애니메이션
        setupScrollAnimations();
        
    } catch (error) {
        console.warn('페이지 애니메이션 초기화 오류:', error);
    }
}

// ===== 스크롤 애니메이션 설정 =====
function setupScrollAnimations() {
    if (!window.indexApp.animations.gsapReady || typeof ScrollTrigger === 'undefined') return;
    
    try {
        // 섹션 헤더 애니메이션
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 50,
                opacity: 0,
                ease: 'power2.out'
            });
        });
        
        // 실종자 카드 애니메이션
        gsap.utils.toArray('.missing-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.6,
                y: 40,
                opacity: 0,
                delay: (index % 4) * 0.1,
                ease: 'power2.out'
            });
        });
        
        // 소개 스텝 애니메이션
        gsap.utils.toArray('.step').forEach((step, index) => {
            gsap.from(step, {
                scrollTrigger: {
                    trigger: step,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 60,
                opacity: 0,
                delay: index * 0.2,
                ease: 'power2.out'
            });
        });
        
    } catch (error) {
        console.warn('스크롤 애니메이션 설정 오류:', error);
    }
}

// ===== 순위 데이터 초기화 =====
function initializeRankingData() {
    try {
        window.indexApp.rankings = [
            { position: 1, name: '김희망', points: 2847, reports: 45, witnesses: 23 },
            { position: 2, name: '박도움', points: 2134, reports: 38, witnesses: 18 },
            { position: 3, name: '이나눔', points: 1895, reports: 42, witnesses: 15 },
            { position: 4, name: '최참여', points: 1672, reports: 36, witnesses: 12 },
            { position: 5, name: '정협력', points: 1543, reports: 29, witnesses: 14 }
        ];
        
        // React 컴포넌트가 사용 가능한 경우 렌더링
        if (window.indexApp.animations.reactReady) {
            renderRankingComponent();
        }
        
    } catch (error) {
        console.warn('순위 데이터 초기화 오류:', error);
    }
}

// ===== 긴급 실종자 데이터 초기화 =====
function initializeUrgentMissingData() {
    try {
        window.indexApp.urgentMissing = [
            { id: 1, name: '김○○', age: 32, date: '2024.05.20', location: '서울시 강남구 역삼동', clothing: '검은색 정장, 갈색 구두', upCount: 246 },
            { id: 2, name: '박○○', age: 8, date: '2024.05.21', location: '부산시 해운대구 중동', clothing: '파란색 티셔츠, 검은색 반바지', upCount: 189 },
            { id: 3, name: '최○○', age: 67, date: '2024.05.22', location: '대구시 중구 삼덕동', clothing: '흰색 블라우스, 검은색 바지', upCount: 134 },
            { id: 4, name: '이○○', age: 45, date: '2024.05.19', location: '인천시 남동구 구월동', clothing: '회색 후드티, 청바지', upCount: 87 },
            { id: 5, name: '정○○', age: 23, date: '2024.05.18', location: '광주시 서구 상무동', clothing: '분홍색 원피스, 흰색 운동화', upCount: 156 },
            { id: 6, name: '홍○○', age: 14, date: '2024.05.23', location: '대전시 유성구 봉명동', clothing: '교복, 검은색 가방', upCount: 23 },
            { id: 7, name: '강○○', age: 28, date: '2024.05.17', location: '울산시 남구 삼산동', clothing: '빨간색 코트, 검은색 부츠', upCount: 98 },
            { id: 8, name: '윤○○', age: 52, date: '2024.05.16', location: '경기도 성남시 분당구', clothing: '네이비 셔츠, 베이지 바지', upCount: 143 }
        ];
        
        // React 컴포넌트가 사용 가능한 경우 렌더링
        if (window.indexApp.animations.reactReady) {
            renderUrgentMissingComponent();
        }
        
    } catch (error) {
        console.warn('긴급 실종자 데이터 초기화 오류:', error);
    }
}

// ===== 통계 카운터 애니메이션 초기화 =====
function initializeStatCounters() {
    try {
        const statItems = document.querySelectorAll('.stat-number');
        
        if (statItems.length === 0) return;
        
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
        
        statItems.forEach(item => observer.observe(item));
        
    } catch (error) {
        console.warn('통계 카운터 초기화 오류:', error);
    }
}

// ===== 카운터 애니메이션 =====
function animateCounter(element) {
    if (!element) return;
    
    try {
        const text = element.textContent || element.innerText || '';
        const target = parseInt(text.replace(/[^\d]/g, '')) || 0;
        
        if (target === 0) return;
        
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // 원래 텍스트 형식 유지 (%, 숫자 등)
            if (text.includes('%')) {
                element.textContent = Math.floor(current) + '%';
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
        
    } catch (error) {
        console.warn('카운터 애니메이션 오류:', error);
    }
}

// ===== React 순위 컴포넌트 렌더링 =====
function renderRankingComponent() {
    if (!window.indexApp.animations.reactReady) return;
    
    try {
        const container = document.getElementById('topRankings');
        if (!container) return;
        
        const RankingComponent = () => {
            return React.createElement('div', null,
                window.indexApp.rankings.map(rank => 
                    React.createElement('div', {
                        key: rank.position,
                        className: 'ranking-item'
                    },
                        React.createElement('div', { className: 'ranking-position' }, rank.position),
                        React.createElement('div', { className: 'ranking-info' },
                            React.createElement('div', { className: 'ranking-left' },
                                React.createElement('div', { className: 'ranking-name' }, rank.name),
                                React.createElement('div', { className: 'ranking-points' },
                                    React.createElement('i', { className: 'fas fa-coins' }),
                                    ` ${rank.points.toLocaleString()}P`
                                )
                            ),
                            React.createElement('div', { className: 'ranking-stats' },
                                React.createElement('span', { className: 'stats-text' },
                                    React.createElement('span', { className: 'stat-reports' }, `제보 ${rank.reports}건`),
                                    React.createElement('span', { className: 'stats-separator' }, ' / '),
                                    React.createElement('span', { className: 'stat-witnesses' }, `해결 ${rank.witnesses}건`)
                                )
                            )
                        )
                    )
                )
            );
        };
        
        ReactDOM.render(React.createElement(RankingComponent), container);
        
    } catch (error) {
        console.warn('React 순위 컴포넌트 렌더링 오류:', error);
    }
}

// ===== React 긴급 실종자 컴포넌트 렌더링 =====
function renderUrgentMissingComponent() {
    if (!window.indexApp.animations.reactReady) return;
    
    try {
        const container = document.getElementById('urgentCardsGrid');
        if (!container) return;
        
        const UrgentMissingComponent = () => {
            return React.createElement('div', { className: 'urgent-cards-react' },
                window.indexApp.urgentMissing.map(missing => 
                    React.createElement('div', {
                        key: missing.id,
                        className: 'missing-card urgent',
                        'data-id': missing.id
                    },
                        React.createElement('div', { className: 'card-image' },
                            React.createElement('img', {
                                src: `/static/images/sample-missing-${missing.id}.jpg`,
                                alt: '실종자 사진',
                                onError: (e) => { e.target.src = '/static/images/placeholder.jpg'; }
                            }),
                            React.createElement('div', { className: 'danger-level high' }, '긴급')
                        ),
                        React.createElement('div', { className: 'card-content' },
                            React.createElement('h3', null, `${missing.name} (${missing.age}세)`),
                            React.createElement('div', { className: 'missing-info' },
                                React.createElement('p', null,
                                    React.createElement('i', { className: 'fas fa-calendar' }),
                                    ` ${missing.date} 실종`
                                ),
                                React.createElement('p', null,
                                    React.createElement('i', { className: 'fas fa-map-marker-alt' }),
                                    ` ${missing.location}`
                                ),
                                React.createElement('p', null,
                                    React.createElement('i', { className: 'fas fa-tshirt' }),
                                    ` ${missing.clothing}`
                                )
                            ),
                            React.createElement('div', { className: 'card-actions' },
                                React.createElement('button', {
                                    className: 'up-btn',
                                    onClick: (e) => handleSafeUpClick(e.target)
                                },
                                    React.createElement('i', { className: 'fas fa-arrow-up' }),
                                    React.createElement('span', null, missing.upCount)
                                ),
                                React.createElement('a', {
                                    href: `/missing/${missing.id}`,
                                    className: 'detail-btn'
                                },
                                    React.createElement('i', { className: 'fas fa-eye' }),
                                    ' 상세보기'
                                )
                            )
                        )
                    )
                )
            );
        };
        
        ReactDOM.render(React.createElement(UrgentMissingComponent), container);
        
    } catch (error) {
        console.warn('React 긴급 실종자 컴포넌트 렌더링 오류:', error);
    }
}

// ===== 안전한 UP 버튼 이벤트 설정 =====
function setupSafeUpButtonEvents() {
    try {
        // 기존 HTML에 있는 UP 버튼들에 대한 직접적인 이벤트 설정
        const upButtons = document.querySelectorAll('.up-btn, .card-stats .stat');
        
        upButtons.forEach(button => {
            if (!button || !button.innerHTML) return;
            
            // fa-arrow-up 아이콘이 있는 경우에만 이벤트 추가
            if (button.innerHTML.includes('fa-arrow-up')) {
                // 기존 이벤트 리스너 제거 (중복 방지)
                button.removeEventListener('click', handleSafeUpClick);
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSafeUpClick(this);
                });
            }
        });
        
    } catch (error) {
        console.warn('UP 버튼 이벤트 설정 오류:', error);
    }
}

// ===== 안전한 카드 호버 효과 설정 =====
function setupSafeCardHoverEffects() {
    try {
        const cards = document.querySelectorAll('.missing-card');
        
        cards.forEach(card => {
            if (!card) return;
            
            card.addEventListener('mouseenter', function() {
                handleSafeCardHover(this, true);
            });
            
            card.addEventListener('mouseleave', function() {
                handleSafeCardHover(this, false);
            });
        });
        
    } catch (error) {
        console.warn('카드 호버 효과 설정 오류:', error);
    }
}

// ===== 폴백 모드 설정 =====
function setupFallbackMode() {
    try {
        // 기본적인 클릭 이벤트만 설정
        document.addEventListener('click', function(e) {
            if (!e || !e.target) return;
            
            // UP 버튼 기본 처리
            if (e.target.classList && (e.target.classList.contains('up-btn') || 
                (e.target.closest('.stat') && e.target.closest('.stat').innerHTML && 
                 e.target.closest('.stat').innerHTML.includes('fa-arrow-up')))) {
                
                e.preventDefault();
                const button = e.target.closest('.up-btn, .stat');
                if (button) {
                    const count = parseInt(button.textContent.replace(/\D/g, '')) || 0;
                    button.innerHTML = `<i class="fas fa-arrow-up"></i> ${count + 1}`;
                }
            }
        });
        
        console.log('폴백 모드로 실행 중');
        
    } catch (error) {
        console.warn('폴백 모드 설정 오류:', error);
    }
}

// ===== 전역 함수 내보내기 =====
window.handleSafeUpClick = handleSafeUpClick;
window.initializeIndexPage = initializeIndexPage;
window.animateCounter = animateCounter;

// ===== 에러 처리 강화 =====
window.addEventListener('error', function(e) {
    console.warn('전역 오류 감지:', e.error);
    if (e.error && e.error.message && e.error.message.includes('contains')) {
        console.log('contains 관련 오류를 감지했습니다. 폴백 모드로 전환합니다.');
        setupFallbackMode();
    }
});

// ===== 페이지 언로드 시 정리 =====
window.addEventListener('beforeunload', function() {
    try {
        // 이벤트 리스너 정리
        if (window.indexApp.initialized) {
            window.indexApp.initialized = false;
        }
    } catch (error) {
        console.warn('페이지 언로드 정리 오류:', error);
    }
});