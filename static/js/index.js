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
        period: "3일째",
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
        period: "2일째",
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
        period: "1일째",
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
        period: "4일째",
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
        period: "5일째",
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
        period: "방금",
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
        period: "6일째",
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
        period: "7일째",
        image: "/static/images/placeholder.jpg"
    }
];

// 순위 데이터 (제보와 해결로 변경)
const rankingData = [
    { rank: 1, name: "김희망", points: 2847, region: "서울시", reports: 23, witnesses: 45 },
    { rank: 2, name: "박도움", points: 2134, region: "부산시", reports: 18, witnesses: 38 },
    { rank: 3, name: "이나눔", points: 1895, region: "대구시", reports: 15, witnesses: 42 },
    { rank: 4, name: "최참여", points: 1672, region: "인천시", reports: 12, witnesses: 36 },
    { rank: 5, name: "정협력", points: 1543, region: "광주시", reports: 14, witnesses: 29 }
];

// 정확히 8개의 긴급 실종자 데이터 선택
function getUrgentMissingData() {
    return allMissingData.slice(0, 8);
}

// 긴급 실종자 데이터 (정확히 8개)
const urgentMissingData = getUrgentMissingData();

// 순위 React 컴포넌트 - 메모화로 성능 최적화
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

// 실종자 카드 React 컴포넌트 - 최적화 및 버그 수정
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
            }, getDangerLevelText(data.dangerLevel)),
            React.createElement('div', {
                className: 'missing-period',
                key: 'period'
            }, data.period)
        ]),
        React.createElement('div', { className: 'card-content', key: 'content' }, [
            React.createElement('h3', { key: 'title' }, `${data.name} (${data.age}세)`),
            React.createElement('div', { className: 'missing-info', key: 'info' }, [
                React.createElement('span', { key: 'date' }, [
                    React.createElement('i', { className: 'fas fa-calendar', key: 'date-icon' }),
                    ` ${formatDate(data.date)} 실종`
                ]),
                React.createElement('br', { key: 'br1' }),
                React.createElement('span', { key: 'location' }, [
                    React.createElement('i', { className: 'fas fa-map-marker-alt', key: 'location-icon' }),
                    ` ${data.location}`
                ]),
                React.createElement('br', { key: 'br2' }),
                React.createElement('span', { key: 'description' }, [
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

// 통계 카운터 애니메이션 클래스 - 개선된 버전
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

// GSAP 애니메이션 관리자 - 5개 스텝 균등 처리
class IndexAnimations {
    constructor() {
        this.isInitialized = false;
        this.timeline = null;
        this.scrollTriggers = [];
        this.isDestroyed = false;
        this.init();
    }

    init() {
        if (typeof gsap === 'undefined' || this.isDestroyed) {
            console.warn('GSAP not loaded, skipping animations');
            return;
        }

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        this.cleanup();
        this.setupAnimations();
        this.isInitialized = true;
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
        // 페이지가 준비되지 않았다면 대기
        if (!document.body.classList.contains('page-ready')) {
            setTimeout(() => this.setupAnimations(), 100);
            return;
        }

        // 히어로 섹션 애니메이션 - 순차적 등장
        this.timeline = gsap.timeline({ 
            delay: 0.3,
            onComplete: () => {
                // 애니메이션 완료 후 성능 최적화
                document.body.classList.add('animations-complete');
            }
        });
        
        this.timeline
            .fromTo('.hero-title', {
                y: 60,
                opacity: 0
            }, {
                duration: 1,
                y: 0,
                opacity: 1,
                ease: 'power2.out'
            })
            .fromTo('.hero-description', {
                y: 40,
                opacity: 0
            }, {
                duration: 0.8,
                y: 0,
                opacity: 1,
                ease: 'power2.out'
            }, '-=0.5')
            .fromTo('.hero-buttons .btn', {
                y: 30,
                opacity: 0
            }, {
                duration: 0.6,
                y: 0,
                opacity: 1,
                stagger: 0.15,
                ease: 'power2.out'
            }, '-=0.4')
            .fromTo('.ranking-display', {
                x: 40,
                opacity: 0
            }, {
                duration: 1,
                x: 0,
                opacity: 1,
                ease: 'power2.out'
            }, '-=0.7')
            .fromTo('.ranking-item', {
                y: 20,
                opacity: 0
            }, {
                duration: 0.5,
                y: 0,
                opacity: 1,
                stagger: 0.1,
                ease: 'power2.out'
            }, '-=0.3');

        // ScrollTrigger 애니메이션들
        if (typeof ScrollTrigger !== 'undefined') {
            // 긴급 실종자 섹션
            const urgentTrigger = ScrollTrigger.create({
                trigger: '.urgent-section',
                start: 'top 75%',
                end: 'bottom 25%',
                onEnter: () => {
                    const cards = document.querySelectorAll('.urgent-cards .missing-card');
                    gsap.fromTo(cards, {
                        y: 50,
                        opacity: 0
                    }, {
                        duration: 0.7,
                        y: 0,
                        opacity: 1,
                        stagger: 0.12,
                        ease: 'power2.out'
                    });
                },
                once: true
            });
            this.scrollTriggers.push(urgentTrigger);

            // 소개 섹션 - 5개 스텝 균등 애니메이션
            const introTrigger = ScrollTrigger.create({
                trigger: '.intro-section',
                start: 'top 80%',
                end: 'bottom 20%',
                onEnter: () => {
                    const steps = document.querySelectorAll('.intro-steps .step');
                    gsap.fromTo(steps, {
                        y: 40,
                        opacity: 0
                    }, {
                        duration: 0.6,
                        y: 0,
                        opacity: 1,
                        stagger: 0.08, // 5개에 맞게 조정
                        ease: 'power2.out'
                    });
                },
                once: true
            });
            this.scrollTriggers.push(introTrigger);

            // 통계 섹션
            const statsTrigger = ScrollTrigger.create({
                trigger: '.stats-section',
                start: 'top 80%',
                end: 'bottom 20%',
                onEnter: () => {
                    const statItems = document.querySelectorAll('.stats-grid .stat-item');
                    gsap.fromTo(statItems, {
                        scale: 0.8,
                        opacity: 0
                    }, {
                        duration: 0.8,
                        scale: 1,
                        opacity: 1,
                        stagger: 0.1,
                        ease: 'back.out(1.7)'
                    });
                },
                once: true
            });
            this.scrollTriggers.push(statsTrigger);
        }
    }

    animateUpButton(button) {
        if (!this.isInitialized || this.isDestroyed) return;
        
        const timeline = gsap.timeline();
        
        timeline
            .to(button, {
                scale: 1.2,
                duration: 0.1,
                ease: 'power2.out'
            })
            .to(button, {
                scale: 1,
                duration: 0.2,
                ease: 'elastic.out(2, 0.3)'
            });
            
        const countElement = button.querySelector('span');
        if (countElement) {
            gsap.fromTo(countElement, 
                { scale: 1.5 },
                {
                    scale: 1,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
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

// Intersection Observer를 활용한 스크롤 트리거
class ScrollObserver {
    constructor() {
        this.counters = new Map();
        this.observer = null;
        this.isDestroyed = false;
        this.init();
    }

    init() {
        if (this.isDestroyed) return;
        this.setupIntersectionObserver();
        this.observeElements();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isDestroyed) {
                    entry.target.classList.add('in-view');
                    
                    if (entry.target.classList.contains('stat-item')) {
                        this.startStatCounter(entry.target);
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        });
    }

    observeElements() {
        if (this.isDestroyed) return;
        const elements = document.querySelectorAll('.stat-item, .missing-card, .step');
        elements.forEach(el => {
            if (this.observer) {
                this.observer.observe(el);
            }
        });
    }

    startStatCounter(statItem) {
        if (this.isDestroyed) return;
        
        const numberElement = statItem.querySelector('.stat-number');
        if (numberElement && !this.counters.has(numberElement)) {
            const counter = new StatCounter(numberElement, numberElement.textContent);
            this.counters.set(numberElement, counter);
            counter.start();
        }
    }

    destroy() {
        this.isDestroyed = true;
        
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        this.counters.forEach(counter => {
            counter.stop();
        });
        this.counters.clear();
    }
}

// 메인 홈페이지 관리 클래스 - 강화된 FOUC 방지 및 로딩 관리
class IndexPage {
    constructor() {
        this.waveEffect = null;
        this.background3D = null;
        this.securityViz = null;
        this.animations = null;
        this.scrollObserver = null;
        this.isDestroyed = false;
        this.eventCleanup = null;
        this.resizeTimeout = null;
        this.loadingSteps = {
            domReady: false,
            reactReady: false,
            threeReady: false,
            componentsReady: false
        };
        this.init();
    }

    init() {
        if (this.isDestroyed) return;
        
        // DOM 준비 상태 확인
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.handleDOMReady());
        } else {
            this.handleDOMReady();
        }
    }

    handleDOMReady() {
        if (this.isDestroyed) return;
        
        this.loadingSteps.domReady = true;
        this.showLoadingOverlay();
        
        // JavaScript 비활성화 감지
        document.documentElement.classList.remove('no-js');
        
        // 페이지 로딩 클래스 추가
        document.body.classList.add('page-loading');
        
        // 단계별 초기화
        this.initializeComponents();
    }

    showLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }

    async initializeComponents() {
        if (this.isDestroyed) return;
        
        try {
            // 1. React 컴포넌트 렌더링
            await this.renderComponents();
            this.loadingSteps.reactReady = true;
            
            // 2. Three.js 효과 초기화
            await this.initializeThreeEffects();
            this.loadingSteps.threeReady = true;
            
            // 3. 애니메이션 시스템 초기화
            await this.initializeAnimations();
            this.loadingSteps.componentsReady = true;
            
            // 4. 모든 준비 완료
            this.finishLoading();
            
        } catch (error) {
            console.error('Component initialization error:', error);
            this.finishLoading(); // 오류 발생 시에도 페이지 표시
        }
    }

    async renderComponents() {
        return new Promise((resolve) => {
            try {
                // React 컴포넌트 렌더링
                this.renderRankings();
                this.renderUrgentCards();
                
                // React 렌더링 완료 대기
                setTimeout(resolve, 100);
            } catch (error) {
                console.error('React rendering failed:', error);
                resolve();
            }
        });
    }

    async initializeThreeEffects() {
        return new Promise((resolve) => {
            try {
                // Three.js 효과들이 로드되었는지 확인
                if (typeof window.ThreeEffects === 'undefined') {
                    console.warn('ThreeEffects not loaded');
                    resolve();
                    return;
                }
                
                const { WaveEffect, FlowingBackground3D, SecurityVisualization } = window.ThreeEffects;
                
                // Wave 효과 초기화 - 개선된 버전
                const waveCanvas = document.getElementById('waveCanvas');
                if (waveCanvas && WaveEffect) {
                    this.waveEffect = new WaveEffect(waveCanvas);
                    console.log('Wave effect initialized with full screen coverage');
                }
                
                // 3D 배경 초기화
                const statsSection = document.querySelector('.stats-section');
                if (statsSection && FlowingBackground3D) {
                    // 캔버스 생성
                    const canvas3D = document.createElement('canvas');
                    canvas3D.className = 'stats-3d-background';
                    canvas3D.id = 'stats3DCanvas';
                    canvas3D.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                        z-index: 0;
                        opacity: 0.3;
                    `;
                    
                    statsSection.insertBefore(canvas3D, statsSection.firstChild);
                    this.background3D = new FlowingBackground3D(canvas3D, statsSection);
                }
                
                // 보안 시각화 초기화
                const heroVisual = document.querySelector('.hero-visual');
                if (heroVisual && SecurityVisualization) {
                    const securityCanvas = document.createElement('canvas');
                    securityCanvas.className = 'security-canvas';
                    securityCanvas.id = 'securityCanvas';
                    securityCanvas.style.cssText = `
                        width: 400px;
                        height: 400px;
                        border-radius: 20px;
                        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
                        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(34, 197, 94, 0.1) 50%, rgba(249, 115, 22, 0.1) 100%);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        z-index: -1;
                    `;
                    
                    // 히어로 비주얼에 배경으로 추가
                    heroVisual.style.position = 'relative';
                    heroVisual.appendChild(securityCanvas);
                    this.securityViz = new SecurityVisualization(securityCanvas, heroVisual);
                }
                
                setTimeout(resolve, 200);
            } catch (error) {
                console.error('Three.js initialization failed:', error);
                resolve();
            }
        });
    }

    async initializeAnimations() {
        return new Promise((resolve) => {
            try {
                this.animations = new IndexAnimations();
                this.scrollObserver = new ScrollObserver();
                this.setupEventListeners();
                
                setTimeout(resolve, 100);
            } catch (error) {
                console.error('Animation initialization failed:', error);
                resolve();
            }
        });
    }

    finishLoading() {
        if (this.isDestroyed) return;
        
        // 로딩 상태 제거
        document.body.classList.remove('page-loading');
        document.body.classList.add('page-ready');
        
        // 로딩 오버레이 숨기기
        setTimeout(() => {
            this.hideLoadingOverlay();
        }, 500);
        
        console.log('Index page ready with enhanced wave coverage');
    }

    renderRankings() {
        const rankingContainer = document.getElementById('topRankings');
        if (!rankingContainer || typeof React === 'undefined' || this.isDestroyed) {
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

        // 컨테이너 강제 스타일 설정
        urgentContainer.style.display = 'grid';
        urgentContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
        urgentContainer.style.gridTemplateRows = 'repeat(2, minmax(300px, auto))';
        urgentContainer.style.gap = '25px';
        urgentContainer.style.width = '100%';
        urgentContainer.style.maxWidth = '1200px';
        urgentContainer.style.margin = '0 auto';

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
                if (this.isDestroyed) return;
                
                if (this.waveEffect) {
                    this.waveEffect.onWindowResize();
                }
                
                if (this.background3D) {
                    this.background3D.onWindowResize();
                }
                
                if (this.securityViz) {
                    this.securityViz.onWindowResize();
                }
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

    destroy() {
        this.isDestroyed = true;
        
        if (this.waveEffect) {
            this.waveEffect.destroy();
            this.waveEffect = null;
        }
        
        if (this.background3D) {
            this.background3D.destroy();
            this.background3D = null;
        }
        
        if (this.securityViz) {
            this.securityViz.destroy();
            this.securityViz = null;
        }
        
        if (this.animations) {
            this.animations.destroy();
            this.animations = null;
        }
        
        if (this.scrollObserver) {
            this.scrollObserver.destroy();
            this.scrollObserver = null;
        }
        
        if (this.eventCleanup) {
            this.eventCleanup();
            this.eventCleanup = null;
        }
        
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = null;
        }
        
        console.log('Index page destroyed');
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

// Visibility API를 사용한 탭 전환 시 최적화
document.addEventListener('visibilitychange', () => {
    if (!indexPage) return;
    
    if (document.hidden) {
        // 페이지가 숨겨질 때 애니메이션 일시 정지
        if (indexPage.waveEffect) {
            indexPage.waveEffect.isDestroyed = true;
        }
        if (indexPage.background3D) {
            indexPage.background3D.isDestroyed = true;
        }
        if (indexPage.securityViz) {
            indexPage.securityViz.isDestroyed = true;
        }
    } else {
        // 페이지가 다시 보일 때 애니메이션 재개
        if (indexPage.waveEffect) {
            indexPage.waveEffect.isDestroyed = false;
        }
        if (indexPage.background3D) {
            indexPage.background3D.isDestroyed = false;
        }
        if (indexPage.securityViz) {
            indexPage.securityViz.isDestroyed = false;
        }
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
        get loadingSteps() { return indexPage?.loadingSteps; },
        testAnimations: () => {
            if (typeof gsap !== 'undefined' && indexPage && !indexPage.isDestroyed) {
                gsap.to('.missing-card', {
                    duration: 0.5,
                    scale: 1.05,
                    stagger: 0.1,
                    yoyo: true,
                    repeat: 1
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