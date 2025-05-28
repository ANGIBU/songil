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

// 순위 데이터 (제보와 해결 건수 바꿈)
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

// GSAP 애니메이션 관리자 - 매우 부드럽고 자연스러운 물흐르는 애니메이션
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
            console.warn('GSAP not loaded, using CSS animations');
            this.initializeCSSAnimations();
            return;
        }

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        this.cleanup();
        this.setupGSAPAnimations();
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

    // CSS 애니메이션 폴백 - 부드러운 스태거 효과
    initializeCSSAnimations() {
        setTimeout(() => {
            // 순차적으로 요소들 애니메이션
            const animateElement = (selector, delay = 0) => {
                setTimeout(() => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('animate-in');
                        }, index * 100); // 100ms 간격으로 순차 애니메이션
                    });
                }, delay);
            };

            // 히어로 섹션부터 순차적으로
            animateElement('.hero-title', 200);
            animateElement('.hero-description', 600);
            animateElement('.hero-buttons', 1000);
            animateElement('.ranking-display', 800);
            animateElement('.ranking-item', 1200);
            
            // 스크롤 애니메이션도 설정
            this.setupScrollAnimations();
        }, 300);
    }

    // GSAP 애니메이션 - 매우 부드럽고 자연스럽게
    setupGSAPAnimations() {
        // 페이지가 준비되지 않았다면 대기
        setTimeout(() => {
            this.startHeroAnimations();
        }, 100);
    }

    startHeroAnimations() {
        // 메인 타임라인 - 매우 부드럽고 연속적인 흐름
        this.timeline = gsap.timeline({ 
            delay: 0.1,
            onComplete: () => {
                document.body.classList.add('animations-complete');
                console.log('✨ Smooth animations completed');
            }
        });
        
        // 히어로 제목 - 부드럽게 아래에서 위로
        this.timeline
            .fromTo('.hero-title', {
                y: 80,
                opacity: 0,
                scale: 0.9
            }, {
                duration: 1.8,
                y: 0,
                opacity: 1,
                scale: 1,
                ease: 'power2.out'
            })
            // 설명 텍스트 - 제목과 자연스럽게 연결
            .fromTo('.hero-description', {
                y: 60,
                opacity: 0
            }, {
                duration: 1.6,
                y: 0,
                opacity: 1,
                ease: 'power2.out'
            }, '-=1.2') // 제목 애니메이션과 많이 겹치게
            // 버튼들 - 살짝 바운스 효과
            .fromTo('.hero-buttons .btn', {
                y: 50,
                opacity: 0,
                scale: 0.8
            }, {
                duration: 1.4,
                y: 0,
                opacity: 1,
                scale: 1,
                stagger: 0.15,
                ease: 'back.out(1.3)'
            }, '-=1.0')
            // 순위 디스플레이 - 오른쪽에서 부드럽게
            .fromTo('.ranking-display', {
                x: 100,
                y: 80,
                opacity: 0,
                scale: 0.85
            }, {
                duration: 2.0,
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
                ease: 'power2.out'
            }, '-=1.4')
            // 순위 아이템들 - 물흐르듯 순차적으로
            .fromTo('.ranking-item', {
                y: 40,
                opacity: 0,
                scale: 0.9
            }, {
                duration: 1.2,
                y: 0,
                opacity: 1,
                scale: 1,
                stagger: 0.12,
                ease: 'power2.out'
            }, '-=1.0');

        // ScrollTrigger 애니메이션들 - 모두 부드럽게
        if (typeof ScrollTrigger !== 'undefined') {
            this.setupScrollTriggers();
        } else {
            // ScrollTrigger 없을 때 폴백
            setTimeout(() => this.setupScrollAnimations(), 2000);
        }
    }

    setupScrollTriggers() {
        // 긴급 실종자 섹션 - 매우 부드러운 스태거
        const urgentTrigger = ScrollTrigger.create({
            trigger: '.urgent-section',
            start: 'top 85%',
            end: 'bottom 15%',
            onEnter: () => {
                // 헤더 먼저 부드럽게
                gsap.fromTo('.urgent-section .section-header', {
                    y: 60,
                    opacity: 0
                }, {
                    duration: 1.5,
                    y: 0,
                    opacity: 1,
                    ease: 'power2.out'
                });
                
                // 카드들 - 파도처럼 연속적으로
                setTimeout(() => {
                    const cards = document.querySelectorAll('.urgent-cards .missing-card');
                    gsap.fromTo(cards, {
                        y: 80,
                        opacity: 0,
                        scale: 0.85
                    }, {
                        duration: 1.4,
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        stagger: {
                            amount: 1.2,
                            from: "start",
                            ease: "power2.out"
                        },
                        ease: 'power2.out'
                    });
                }, 400);
            },
            once: true
        });
        this.scrollTriggers.push(urgentTrigger);

        // 소개 섹션 - 5개 스텝 물결 효과
        const introTrigger = ScrollTrigger.create({
            trigger: '.intro-section',
            start: 'top 80%',
            end: 'bottom 20%',
            onEnter: () => {
                // 제목 먼저
                gsap.fromTo('.intro-text h2', {
                    y: 50,
                    opacity: 0
                }, {
                    duration: 1.6,
                    y: 0,
                    opacity: 1,
                    ease: 'power2.out'
                });
                
                // 스텝들 - 물결처럼 연속적으로
                setTimeout(() => {
                    const steps = document.querySelectorAll('.intro-steps .step');
                    gsap.fromTo(steps, {
                        y: 100,
                        opacity: 0,
                        scale: 0.8
                    }, {
                        duration: 1.6,
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        stagger: {
                            amount: 1.0,
                            from: "start",
                            ease: "power2.out"
                        },
                        ease: 'back.out(1.2)'
                    });
                }, 600);
            },
            once: true
        });
        this.scrollTriggers.push(introTrigger);

        // 통계 섹션 - 가장 임팩트 있게
        const statsTrigger = ScrollTrigger.create({
            trigger: '.stats-section',
            start: 'top 80%',
            end: 'bottom 20%',
            onEnter: () => {
                // 제목과 메시지
                gsap.fromTo('.stats-section h2, .hope-message', {
                    y: 60,
                    opacity: 0
                }, {
                    duration: 1.8,
                    y: 0,
                    opacity: 1,
                    stagger: 0.3,
                    ease: 'power2.out'
                });
                
                // 통계 아이템들 - 스케일과 함께 드라마틱하게
                setTimeout(() => {
                    const statItems = document.querySelectorAll('.stats-grid .stat-item');
                    gsap.fromTo(statItems, {
                        scale: 0.6,
                        opacity: 0,
                        y: 80
                    }, {
                        duration: 1.8,
                        scale: 1,
                        opacity: 1,
                        y: 0,
                        stagger: {
                            amount: 0.8,
                            from: "start",
                            ease: "power2.out"
                        },
                        ease: 'back.out(1.6)'
                    });
                }, 800);
            },
            once: true
        });
        this.scrollTriggers.push(statsTrigger);
    }

    // 스크롤 애니메이션 폴백 (ScrollTrigger 없을 때)
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    
                    if (target.classList.contains('urgent-section')) {
                        this.animateUrgentSection();
                    } else if (target.classList.contains('intro-section')) {
                        this.animateIntroSection();
                    } else if (target.classList.contains('stats-section')) {
                        this.animateStatsSection();
                    }
                    
                    observer.unobserve(target);
                }
            });
        }, observerOptions);

        // 관찰 대상 등록
        const sections = document.querySelectorAll('.urgent-section, .intro-section, .stats-section');
        sections.forEach(section => observer.observe(section));
    }

    animateUrgentSection() {
        setTimeout(() => {
            document.querySelector('.urgent-section .section-header')?.classList.add('animate-in');
        }, 200);
        
        setTimeout(() => {
            const cards = document.querySelectorAll('.urgent-cards .missing-card');
            cards.forEach((card, index) => {
                setTimeout(() => card.classList.add('animate-in'), index * 150);
            });
        }, 800);
    }

    animateIntroSection() {
        setTimeout(() => {
            document.querySelector('.intro-text h2')?.classList.add('animate-in');
        }, 200);
        
        setTimeout(() => {
            const steps = document.querySelectorAll('.intro-steps .step');
            steps.forEach((step, index) => {
                setTimeout(() => step.classList.add('animate-in'), index * 200);
            });
        }, 800);
    }

    animateStatsSection() {
        setTimeout(() => {
            document.querySelector('.stats-section h2')?.classList.add('animate-in');
        }, 200);
        
        setTimeout(() => {
            document.querySelector('.hope-message')?.classList.add('animate-in');
        }, 600);
        
        setTimeout(() => {
            const items = document.querySelectorAll('.stats-grid .stat-item');
            items.forEach((item, index) => {
                setTimeout(() => item.classList.add('animate-in'), index * 200);
            });
        }, 1200);
    }

    animateUpButton(button) {
        if (!this.isInitialized || this.isDestroyed) return;
        
        if (typeof gsap !== 'undefined') {
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

// 메인 홈페이지 관리 클래스
class IndexPage {
    constructor() {
        this.animations = null;
        this.scrollObserver = null;
        this.isDestroyed = false;
        this.eventCleanup = null;
        this.resizeTimeout = null;
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
        
        // JavaScript 비활성화 감지 제거
        document.documentElement.classList.remove('no-js');
        
        // 단계별 초기화
        setTimeout(() => this.initializeComponents(), 100);
    }

    async initializeComponents() {
        if (this.isDestroyed) return;
        
        try {
            // 1. React 컴포넌트 렌더링
            await this.renderComponents();
            
            // 2. 애니메이션 시스템 초기화
            await this.initializeAnimations();
            
            // 3. 이벤트 리스너 설정
            this.setupEventListeners();
            
            console.log('✨ Index page loaded with smooth flowing animations');
            
        } catch (error) {
            console.error('Component initialization error:', error);
        }
    }

    async renderComponents() {
        return new Promise((resolve) => {
            try {
                this.renderRankings();
                this.renderUrgentCards();
                setTimeout(resolve, 50);
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
                this.scrollObserver = new ScrollObserver();
                setTimeout(resolve, 100);
            } catch (error) {
                console.error('Animation initialization failed:', error);
                resolve();
            }
        });
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
                console.log('Window resized - animations adjusted');
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