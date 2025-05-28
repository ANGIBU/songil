// static/js/index.js

// React 컴포넌트 활용
const { useState, useEffect, useCallback, useMemo } = React;

// 실종자 검색 페이지의 데이터를 가져와서 긴급 실종자용으로 활용
const allMissingData = [
    {
        id: 1,
        name: "김○○",
        age: 32,
        gender: "남성",
        date: "2024-05-20",
        location: "서울시 강남구 역삼동",
        region: "seoul",
        description: "검은색 정장, 갈색 구두",
        physicalInfo: "175cm, 중간체형",
        dangerLevel: "high",
        upCount: 246,
        image: "/static/images/sample-missing-1.jpg"
    },
    {
        id: 2,
        name: "박○○",
        age: 8,
        gender: "남성",
        date: "2024-05-21",
        location: "부산시 해운대구 중동",
        region: "busan",
        description: "파란색 티셔츠, 검은색 반바지",
        physicalInfo: "120cm, 마른체형",
        dangerLevel: "high",
        upCount: 189,
        image: "/static/images/sample-missing-2.jpg"
    },
    {
        id: 3,
        name: "최○○",
        age: 67,
        gender: "여성",
        date: "2024-05-22",
        location: "대구시 중구 삼덕동",
        region: "daegu",
        description: "흰색 블라우스, 검은색 바지",
        physicalInfo: "160cm, 중간체형",
        dangerLevel: "high",
        upCount: 134,
        image: "/static/images/sample-missing-3.jpg"
    },
    {
        id: 4,
        name: "이○○",
        age: 45,
        gender: "남성",
        date: "2024-05-19",
        location: "인천시 남동구 구월동",
        region: "incheon",
        description: "회색 후드티, 청바지",
        physicalInfo: "168cm, 뚱뚱한체형",
        dangerLevel: "high",
        upCount: 87,
        image: "/static/images/placeholder.jpg"
    },
    {
        id: 5,
        name: "정○○",
        age: 23,
        gender: "여성",
        date: "2024-05-18",
        location: "광주시 서구 상무동",
        region: "gwangju",
        description: "분홍색 원피스, 흰색 운동화",
        physicalInfo: "165cm, 마른체형",
        dangerLevel: "high",
        upCount: 156,
        image: "/static/images/placeholder.jpg"
    },
    {
        id: 6,
        name: "홍○○",
        age: 14,
        gender: "남성",
        date: "2024-05-23",
        location: "대전시 유성구 봉명동",
        region: "daejeon",
        description: "교복, 검은색 가방",
        physicalInfo: "160cm, 마른체형",
        dangerLevel: "high",
        upCount: 23,
        image: "/static/images/placeholder.jpg"
    },
    {
        id: 7,
        name: "강○○",
        age: 28,
        gender: "여성",
        date: "2024-05-17",
        location: "울산시 남구 삼산동",
        region: "ulsan",
        description: "빨간색 코트, 검은색 부츠",
        physicalInfo: "162cm, 마른체형",
        dangerLevel: "high",
        upCount: 98,
        image: "/static/images/placeholder.jpg"
    },
    {
        id: 8,
        name: "윤○○",
        age: 52,
        gender: "남성",
        date: "2024-05-16",
        location: "경기도 성남시 분당구",
        region: "gyeonggi",
        description: "네이비 셔츠, 베이지 바지",
        physicalInfo: "172cm, 중간체형",
        dangerLevel: "high",
        upCount: 143,
        image: "/static/images/placeholder.jpg"
    }
];

// 순위 데이터
const rankingData = [
    { rank: 1, name: "김희망", points: 2847, region: "서울시", reports: 45, witnesses: 23 },
    { rank: 2, name: "박도움", points: 2134, region: "부산시", reports: 38, witnesses: 18 },
    { rank: 3, name: "이나눔", points: 1895, region: "대구시", reports: 42, witnesses: 15 },
    { rank: 4, name: "최참여", points: 1672, region: "인천시", reports: 36, witnesses: 12 },
    { rank: 5, name: "정협력", points: 1543, region: "광주시", reports: 29, witnesses: 14 }
];

// 정확히 8개의 긴급 실종자 데이터 선택
function getUrgentMissingData() {
    return allMissingData.slice(0, 8);
}

const urgentMissingData = getUrgentMissingData();

// 순위 React 컴포넌트
const RankingDisplay = React.memo(function RankingDisplay({ rankings }) {
    return React.createElement('div', { style: { display: 'contents' } },
        rankings.map((rank, index) =>
            React.createElement('div', {
                key: `ranking-${rank.rank}`,
                className: 'ranking-item'
            }, [
                React.createElement('div', {
                    className: 'ranking-position',
                    key: 'position'
                }, rank.rank),
                React.createElement('div', {
                    className: 'ranking-info',
                    key: 'info'
                }, [
                    React.createElement('div', {
                        className: 'ranking-left',
                        key: 'left'
                    }, [
                        React.createElement('div', {
                            className: 'ranking-name',
                            key: 'name'
                        }, rank.name),
                        React.createElement('div', {
                            className: 'ranking-points',
                            key: 'points'
                        }, [
                            React.createElement('i', {
                                className: 'fas fa-coins',
                                key: 'icon'
                            }),
                            `${rank.points.toLocaleString()}P`
                        ])
                    ]),
                    React.createElement('div', {
                        className: 'ranking-stats',
                        key: 'stats'
                    }, [
                        React.createElement('span', {
                            className: 'stats-text',
                            key: 'stats-text'
                        }, [
                            React.createElement('span', {
                                className: 'stat-reports',
                                key: 'reports-text'
                            }, `제보 ${rank.reports}건`),
                            React.createElement('span', {
                                className: 'stats-separator',
                                key: 'separator'
                            }, ' / '),
                            React.createElement('span', {
                                className: 'stat-witnesses',
                                key: 'witnesses-text'
                            }, `해결 ${rank.witnesses}건`)
                        ])
                    ])
                ])
            ])
        )
    );
});

// 실종자 카드 React 컴포넌트
const MissingCard = React.memo(function MissingCard({ data, onUpClick }) {
    const [upCount, setUpCount] = useState(data.upCount);
    const [isAnimating, setIsAnimating] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleUpClick = useCallback(() => {
        if (isAnimating) return;
        
        setIsAnimating(true);
        setUpCount(prev => prev + 1);
        onUpClick(data.id);
        
        setTimeout(() => setIsAnimating(false), 300);
    }, [isAnimating, onUpClick, data.id]);

    const getDangerLevelText = useCallback((level) => {
        switch (level) {
            case 'high': return '긴급';
            case 'medium': return '주의';
            case 'low': return '관심';
            default: return '일반';
        }
    }, []);

    const formatDate = useCallback((dateStr) => {
        return dateStr.replace(/-/g, '.');
    }, []);

    const handleImageLoad = useCallback(() => {
        setImageLoaded(true);
    }, []);

    const handleImageError = useCallback((e) => {
        e.target.src = '/static/images/placeholder.jpg';
        setImageLoaded(true);
    }, []);

    return React.createElement('div', {
        className: `missing-card urgent ${isAnimating ? 'animating' : ''}`,
        'data-id': data.id,
        style: {
            display: 'block',
            width: '100%',
            height: '300px'
        }
    }, [
        React.createElement('div', { className: 'card-image', key: 'image' }, [
            React.createElement('img', {
                src: data.image,
                alt: '실종자 사진',
                onLoad: handleImageLoad,
                onError: handleImageError,
                style: { 
                    opacity: imageLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                },
                key: 'img'
            }),
            React.createElement('div', {
                className: `danger-level ${data.dangerLevel}`,
                key: 'danger'
            }, getDangerLevelText(data.dangerLevel))
        ]),
        React.createElement('div', { className: 'card-content', key: 'content' }, [
            React.createElement('h3', { key: 'title' }, `${data.name} (${data.age}세)`),
            React.createElement('div', { className: 'missing-info', key: 'info' }, [
                React.createElement('p', { key: 'date' }, [
                    React.createElement('i', { className: 'fas fa-calendar', key: 'date-icon' }),
                    ` ${formatDate(data.date)} 실종`
                ]),
                React.createElement('p', { key: 'location' }, [
                    React.createElement('i', { className: 'fas fa-map-marker-alt', key: 'location-icon' }),
                    ` ${data.location}`
                ]),
                React.createElement('p', { key: 'description' }, [
                    React.createElement('i', { className: 'fas fa-tshirt', key: 'desc-icon' }),
                    ` ${data.description}`
                ])
            ]),
            React.createElement('div', { className: 'card-actions', key: 'actions' }, [
                React.createElement('button', {
                    className: 'up-btn',
                    onClick: handleUpClick,
                    key: 'up-btn',
                    disabled: isAnimating
                }, [
                    React.createElement('i', { className: 'fas fa-arrow-up', key: 'up-icon' }),
                    React.createElement('span', { key: 'count' }, upCount)
                ]),
                React.createElement('a', {
                    href: `/missing/${data.id}`,
                    className: 'detail-btn',
                    key: 'detail-btn'
                }, [
                    React.createElement('i', { className: 'fas fa-eye', key: 'detail-icon' }),
                    '상세보기'
                ])
            ])
        ])
    ]);
});

// 통계 카운터 애니메이션 클래스
class StatCounter {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = parseInt(target.toString().replace(/[,%]/g, ''));
        this.duration = duration;
        this.hasPercent = target.toString().includes('%');
        this.current = 0;
        this.isAnimating = false;
        this.animationId = null;
    }

    start() {
        if (this.isAnimating || !this.element) return;
        this.isAnimating = true;
        
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            if (!this.isAnimating) return;
            
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            
            // Easing function (ease-out cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            this.current = Math.floor(this.target * easeOut);
            
            if (this.element) {
                this.element.textContent = this.current.toLocaleString() + 
                    (this.hasPercent ? '%' : '');
            }
            
            if (progress < 1) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                this.animationId = null;
            }
        };
        
        this.animationId = requestAnimationFrame(animate);
    }

    stop() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// GSAP 애니메이션 관리자 - 완전히 개선됨
class IndexAnimations {
    constructor() {
        this.isInitialized = false;
        this.timeline = null;
        this.scrollTriggers = [];
        this.isDestroyed = false;
        this.animationQueue = [];
        this.init();
    }

    init() {
        if (this.isDestroyed) return;

        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded, using fallback animations');
            this.fallbackAnimations();
            return;
        }

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        this.cleanup();
        this.setupAnimations();
        this.isInitialized = true;
        
        console.log('✨ Index animations initialized with GSAP');
    }

    cleanup() {
        if (this.timeline) {
            this.timeline.kill();
            this.timeline = null;
        }
        
        this.scrollTriggers.forEach(trigger => {
            if (trigger) trigger.kill();
        });
        this.scrollTriggers = [];
    }

    setupAnimations() {
        // 메인 타임라인 생성
        this.timeline = gsap.timeline({
            onComplete: () => {
                console.log('🎬 All entrance animations completed');
                this.removeLoadingScreen();
            }
        });

        // 순차적 애니메이션 설정
        this.animateHeroSection();
        this.animateUrgentSection();
        this.animateIntroSection();
        this.setupScrollAnimations();
    }

    animateHeroSection() {
        const heroElements = [
            '.hero-title',
            '.hero-description', 
            '.hero-buttons',
            '.ranking-display'
        ];

        heroElements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                this.timeline.fromTo(element, {
                    opacity: 0,
                    y: 50,
                    scale: 0.95
                }, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "power2.out"
                }, index * 0.2);
            }
        });

        // 랭킹 아이템들 개별 애니메이션
        const rankingItems = document.querySelectorAll('.ranking-item');
        if (rankingItems.length > 0) {
            this.timeline.fromTo(rankingItems, {
                opacity: 0,
                x: 30
            }, {
                opacity: 1,
                x: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            }, 0.6);
        }
    }

    animateUrgentSection() {
        const sectionHeader = document.querySelector('.urgent-section .section-header');
        if (sectionHeader) {
            this.timeline.fromTo(sectionHeader, {
                opacity: 0,
                y: 30
            }, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, 1.2);
        }

        // 긴급 카드들 애니메이션
        const urgentCards = document.querySelectorAll('.missing-card');
        if (urgentCards.length > 0) {
            this.timeline.fromTo(urgentCards, {
                opacity: 0,
                y: 40,
                scale: 0.9
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "back.out(1.7)"
            }, 1.5);
        }
    }

    animateIntroSection() {
        const introTitle = document.querySelector('.intro-text h2');
        if (introTitle) {
            this.timeline.fromTo(introTitle, {
                opacity: 0,
                y: 30
            }, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, 2.2);
        }

        const steps = document.querySelectorAll('.step');
        if (steps.length > 0) {
            this.timeline.fromTo(steps, {
                opacity: 0,
                y: 50,
                scale: 0.9
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "back.out(1.7)"
            }, 2.5);
        }
    }

    setupScrollAnimations() {
        if (typeof ScrollTrigger === 'undefined') {
            this.setupIntersectionObserver();
            return;
        }

        // 통계 섹션 애니메이션
        const statsTrigger = ScrollTrigger.create({
            trigger: '.stats-section',
            start: 'top 80%',
            end: 'bottom 20%',
            onEnter: () => {
                this.animateStatsSection();
            },
            once: true
        });
        this.scrollTriggers.push(statsTrigger);
    }

    animateStatsSection() {
        const statsItems = document.querySelectorAll('.stat-item');
        
        gsap.fromTo(statsItems, {
            opacity: 0,
            y: 50,
            scale: 0.9
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)",
            onComplete: () => {
                // 통계 카운터 시작
                const statNumbers = document.querySelectorAll('.stat-number');
                statNumbers.forEach(number => {
                    if (!number.dataset.animated) {
                        number.dataset.animated = 'true';
                        const counter = new StatCounter(number, number.dataset.count);
                        counter.start();
                    }
                });
            }
        });
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.classList.contains('stats-section')) {
                    this.animateStatsSection();
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    removeLoadingScreen() {
        const loadingScreen = document.getElementById('pageLoading');
        if (loadingScreen) {
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    loadingScreen.classList.add('fade-out');
                    setTimeout(() => {
                        if (loadingScreen.parentNode) {
                            loadingScreen.parentNode.removeChild(loadingScreen);
                        }
                    }, 100);
                }
            });
        }
    }

    fallbackAnimations() {
        // GSAP 없을 때 기본 CSS 애니메이션으로 대체
        const elements = document.querySelectorAll(`
            .hero-title,
            .hero-description,
            .hero-buttons,
            .ranking-display,
            .urgent-cards,
            .intro-steps,
            .stats-grid,
            .section-header
        `);
        
        elements.forEach((element, index) => {
            if (element) {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.style.visibility = 'visible';
                    element.style.transition = 'all 0.6s ease';
                    element.classList.add('animated');
                }, index * 100);
            }
        });

        // 로딩 화면 제거
        setTimeout(() => this.removeLoadingScreen(), 1000);
    }

    animateUpButton(button) {
        if (!this.isInitialized || this.isDestroyed || typeof gsap === 'undefined') return;
        
        const timeline = gsap.timeline();
        
        timeline
            .to(button, {
                scale: 1.1,
                duration: 0.15,
                ease: 'power2.out'
            })
            .to(button, {
                scale: 1,
                duration: 0.3,
                ease: 'elastic.out(1.5, 0.3)'
            });
            
        const countElement = button.querySelector('span');
        if (countElement) {
            gsap.fromTo(countElement, 
                { scale: 1.3 },
                {
                    scale: 1,
                    duration: 0.4,
                    ease: 'back.out(1.4)'
                }
            );
        }
    }

    destroy() {
        this.isDestroyed = true;
        this.cleanup();
        this.isInitialized = false;
    }
}

// 메인 홈페이지 관리 클래스
class IndexPage {
    constructor() {
        this.animations = null;
        this.isDestroyed = false;
        this.eventCleanup = null;
        this.resizeTimeout = null;
        this.initTimeout = null;
        this.init();
    }

    init() {
        if (this.isDestroyed) return;
        
        // JavaScript 비활성화 감지 제거
        document.documentElement.classList.remove('no-js');
        
        // DOM 준비 상태 확인
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.handleDOMReady());
        } else {
            this.handleDOMReady();
        }
    }

    handleDOMReady() {
        if (this.isDestroyed) return;
        
        // 안전한 초기화를 위한 지연
        this.initTimeout = setTimeout(() => {
            this.initializeComponents();
        }, 100);
    }

    async initializeComponents() {
        if (this.isDestroyed) return;
        
        try {
            console.log('🚀 Starting index page initialization...');
            
            // 1. React 컴포넌트 렌더링
            await this.renderComponents();
            
            // 2. 애니메이션 시스템 초기화
            await this.initializeAnimations();
            
            // 3. 이벤트 리스너 설정
            this.setupEventListeners();
            
            console.log('✅ Index page initialized successfully');
            
        } catch (error) {
            console.error('❌ Component initialization error:', error);
            // 에러 시 로딩 화면 제거
            this.removeLoadingScreen();
        }
    }

    async renderComponents() {
        return new Promise((resolve) => {
            try {
                this.renderRankings();
                this.renderUrgentCards();
                setTimeout(resolve, 100);
            } catch (error) {
                console.error('React rendering failed:', error);
                resolve();
            }
        });
    }

    async initializeAnimations() {
        return new Promise((resolve) => {
            try {
                this.animations = new IndexAnimations();
                setTimeout(resolve, 200);
            } catch (error) {
                console.error('Animation initialization failed:', error);
                this.removeLoadingScreen();
                resolve();
            }
        });
    }

    renderRankings() {
        const rankingContainer = document.getElementById('topRankings');
        if (!rankingContainer || typeof React === 'undefined' || this.isDestroyed) {
            console.warn('Ranking container not found or React not available');
            return;
        }

        try {
            const root = ReactDOM.createRoot(rankingContainer);
            root.render(
                React.createElement(RankingDisplay, {
                    rankings: rankingData
                })
            );
        } catch (error) {
            console.error('Ranking rendering failed:', error);
        }
    }

    renderUrgentCards() {
        const urgentContainer = document.querySelector('.urgent-cards');
        if (!urgentContainer || typeof React === 'undefined' || this.isDestroyed) {
            console.warn('React not available or container not found');
            return;
        }

        const handleUpClick = (cardId) => {
            if (this.isDestroyed) return;
            
            const button = document.querySelector(`[data-id="${cardId}"] .up-btn`);
            if (button && this.animations && !this.isDestroyed) {
                this.animations.animateUpButton(button);
            }
            
            if (window.showNotification) {
                window.showNotification('소중한 참여에 감사합니다! 함께라면 찾을 수 있어요.', 'success');
            }
        };

        try {
            const root = ReactDOM.createRoot(urgentContainer);
            root.render(
                React.createElement(React.Fragment, null,
                    urgentMissingData.map(data =>
                        React.createElement(MissingCard, {
                            key: `missing-card-${data.id}`,
                            data: data,
                            onUpClick: handleUpClick
                        })
                    )
                )
            );
        } catch (error) {
            console.error('React rendering failed:', error);
        }
    }

    setupEventListeners() {
        if (this.isDestroyed) return;
        
        const resizeHandler = () => {
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            this.resizeTimeout = setTimeout(() => {
                console.log('Window resized - layout adjusted');
            }, 250);
        };
        
        window.addEventListener('resize', resizeHandler);

        const clickHandler = (e) => {
            if (this.isDestroyed) return;
            
            if (e.target.closest('.up-btn')) {
                const button = e.target.closest('.up-btn');
                
                if (this.animations && !this.isDestroyed) {
                    this.animations.animateUpButton(button);
                }
            }
        };
        
        document.addEventListener('click', clickHandler);

        const keyHandler = (e) => {
            if (e.key === 'Escape') {
                document.activeElement?.blur();
            }
        };
        
        document.addEventListener('keydown', keyHandler);
        
        this.eventCleanup = () => {
            window.removeEventListener('resize', resizeHandler);
            document.removeEventListener('click', clickHandler);
            document.removeEventListener('keydown', keyHandler);
            
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
                this.resizeTimeout = null;
            }
        };
    }

    removeLoadingScreen() {
        const loadingScreen = document.getElementById('pageLoading');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                }
            }, 500);
        }
    }

    destroy() {
        this.isDestroyed = true;
        
        if (this.initTimeout) {
            clearTimeout(this.initTimeout);
            this.initTimeout = null;
        }
        
        if (this.animations) {
            this.animations.destroy();
            this.animations = null;
        }
        
        if (this.eventCleanup) {
            this.eventCleanup();
            this.eventCleanup = null;
        }
        
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = null;
        }
        
        console.log('🧹 Index page destroyed');
    }
}

// 페이지 로드 시 자동 초기화
let indexPage = null;

// 즉시 초기화
document.documentElement.classList.add('no-js'); // JavaScript 비활성화 대비
indexPage = new IndexPage();

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    if (indexPage) {
        indexPage.destroy();
        indexPage = null;
    }
});

// 전역 함수 (하위 호환성을 위해)
window.handleUpClick = function(button, missingId) {
    const countSpan = button.querySelector('span');
    if (countSpan) {
        const currentCount = parseInt(countSpan.textContent);
        countSpan.textContent = currentCount + 1;
    }
    
    if (indexPage && indexPage.animations && !indexPage.isDestroyed) {
        indexPage.animations.animateUpButton(button);
    }
    
    if (window.showNotification) {
        window.showNotification('소중한 참여에 감사합니다! 함께라면 찾을 수 있어요.', 'success');
    }
};

// 개발자 도구
if (typeof window !== 'undefined') {
    window.indexPageDebug = {
        get instance() { return indexPage; },
        testAnimations: () => {
            if (typeof gsap !== 'undefined' && indexPage && !indexPage.isDestroyed) {
                gsap.to('.missing-card', {
                    duration: 0.6,
                    y: -10,
                    stagger: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.out'
                });
            }
        },
        get networkData() { return urgentMissingData; },
        get rankingData() { return rankingData; },
        destroyInstance: () => {
            if (indexPage) {
                indexPage.destroy();
                indexPage = null;
            }
        },
        reinitialize: () => {
            if (indexPage) {
                indexPage.destroy();
            }
            indexPage = new IndexPage();
        }
    };
}