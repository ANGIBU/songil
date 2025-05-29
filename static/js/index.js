// static/js/index.js

// React 컴포넌트 활용 - 안전한 접근
const { useState, useEffect, useCallback, useMemo } = typeof React !== 'undefined' ? React : {};

// 실종자 데이터
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

// 정확히 8개의 긴급 실종자 데이터
const urgentMissingData = allMissingData.slice(0, 8);

// 통계 데이터
const statsData = [
    { label: "함께한 신고", value: 1847 },
    { label: "이루어진 상봉", value: 1203 },
    { label: "희망을 나눈 분들", value: 15429 },
    { label: "포기하지 않는 마음", value: 94, isPercent: true }
];

// HTML 기반 폴백 렌더링 함수들
function renderRankingFallback() {
    const rankingContainer = document.getElementById('topRankings');
    if (!rankingContainer) return;
    
    const html = rankingData.map(rank => `
        <div class="ranking-item">
            <div class="ranking-position">${rank.rank}</div>
            <div class="ranking-info">
                <div class="ranking-left">
                    <div class="ranking-name">${rank.name}</div>
                    <div class="ranking-points">
                        <i class="fas fa-coins"></i>
                        ${rank.points.toLocaleString()}P
                    </div>
                </div>
                <div class="ranking-stats">
                    <span class="stats-text">
                        <span class="stat-reports">제보 ${rank.reports}건</span>
                        <span class="stats-separator"> / </span>
                        <span class="stat-witnesses">해결 ${rank.witnesses}건</span>
                    </span>
                </div>
            </div>
        </div>
    `).join('');
    
    rankingContainer.innerHTML = html;
    console.log('✅ Ranking fallback rendered');
}

function renderUrgentCardsFallback() {
    const urgentContainer = document.querySelector('.urgent-cards');
    if (!urgentContainer) return;
    
    const html = urgentMissingData.map(data => `
        <div class="missing-card urgent" data-id="${data.id}">
            <div class="card-image">
                <img src="${data.image}" alt="실종자 사진" onerror="this.src='/static/images/placeholder.jpg'">
                <div class="danger-level ${data.dangerLevel}">
                    ${data.dangerLevel === 'high' ? '긴급' : data.dangerLevel === 'medium' ? '주의' : '관심'}
                </div>
            </div>
            <div class="card-content">
                <h3>${data.name} (${data.age}세)</h3>
                <div class="missing-info">
                    <p><i class="fas fa-calendar"></i> ${data.date.replace(/-/g, '.')} 실종</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${data.location}</p>
                    <p><i class="fas fa-tshirt"></i> ${data.description}</p>
                </div>
                <div class="card-actions">
                    <button class="up-btn" onclick="handleUpClick(this, ${data.id})">
                        <i class="fas fa-arrow-up"></i>
                        <span>${data.upCount}</span>
                    </button>
                    <a href="/missing/${data.id}" class="detail-btn">
                        <i class="fas fa-eye"></i>
                        상세보기
                    </a>
                </div>
            </div>
        </div>
    `).join('');
    
    urgentContainer.innerHTML = html;
    // 폴백 렌더링 완료 표시
    urgentContainer.setAttribute('data-fallback-rendered', 'true');
    console.log('✅ Urgent cards fallback rendered');
}

// React 순위 컴포넌트 - 안전한 버전
const RankingDisplay = typeof React !== 'undefined' ? React.memo(function RankingDisplay({ rankings }) {
    if (!rankings || !Array.isArray(rankings)) {
        console.warn('Invalid rankings data provided to RankingDisplay');
        return null;
    }

    return React.createElement('div', { style: { display: 'contents' } },
        rankings.map((rank, index) => {
            if (!rank || typeof rank.rank === 'undefined') {
                console.warn(`Invalid rank data at index ${index}:`, rank);
                return null;
            }

            return React.createElement('div', {
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
                        }, rank.name || '알 수 없음'),
                        React.createElement('div', {
                            className: 'ranking-points',
                            key: 'points'
                        }, [
                            React.createElement('i', {
                                className: 'fas fa-coins',
                                key: 'icon'
                            }),
                            `${(rank.points || 0).toLocaleString()}P`
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
                            }, `제보 ${rank.reports || 0}건`),
                            React.createElement('span', {
                                className: 'stats-separator',
                                key: 'separator'
                            }, ' / '),
                            React.createElement('span', {
                                className: 'stat-witnesses',
                                key: 'witnesses-text'
                            }, `해결 ${rank.witnesses || 0}건`)
                        ])
                    ])
                ])
            ]);
        }).filter(Boolean) // null 요소 제거
    );
}) : null;

// React 실종자 카드 컴포넌트 - 안전한 버전
const MissingCard = typeof React !== 'undefined' ? React.memo(function MissingCard({ data, onUpClick }) {
    if (!data || !data.id) {
        console.warn('Invalid data provided to MissingCard:', data);
        return null;
    }

    const [upCount, setUpCount] = useState(data.upCount || 0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleUpClick = useCallback(() => {
        if (isAnimating) return;
        
        setIsAnimating(true);
        setUpCount(prev => prev + 1);
        if (onUpClick && typeof onUpClick === 'function') {
            onUpClick(data.id);
        }
        
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
        if (!dateStr) return '날짜 미상';
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
        'data-id': data.id
    }, [
        React.createElement('div', { className: 'card-image', key: 'image' }, [
            React.createElement('img', {
                src: data.image || '/static/images/placeholder.jpg',
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
                className: `danger-level ${data.dangerLevel || 'low'}`,
                key: 'danger'
            }, getDangerLevelText(data.dangerLevel))
        ]),
        React.createElement('div', { className: 'card-content', key: 'content' }, [
            React.createElement('h3', { key: 'title' }, `${data.name || '미상'} (${data.age || '?'}세)`),
            React.createElement('div', { className: 'missing-info', key: 'info' }, [
                React.createElement('p', { key: 'date' }, [
                    React.createElement('i', { className: 'fas fa-calendar', key: 'date-icon' }),
                    ` ${formatDate(data.date)} 실종`
                ]),
                React.createElement('p', { key: 'location' }, [
                    React.createElement('i', { className: 'fas fa-map-marker-alt', key: 'location-icon' }),
                    ` ${data.location || '위치 미상'}`
                ]),
                React.createElement('p', { key: 'description' }, [
                    React.createElement('i', { className: 'fas fa-tshirt', key: 'desc-icon' }),
                    ` ${data.description || '설명 없음'}`
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
}) : null;

// 통계 카운터 애니메이션 클래스 - 안전성 강화
class StatCounter {
    constructor(element, target, duration = 2000) {
        if (!element) {
            console.warn('StatCounter: Invalid element provided');
            return;
        }

        this.element = element;
        
        // 원본 텍스트에서 %가 있는지 확인
        const originalText = element.textContent || target.toString();
        this.hasPercent = originalText.includes('%');
        
        // 숫자만 추출
        this.target = parseInt(target.toString().replace(/[,%]/g, ''));
        if (isNaN(this.target)) {
            console.warn('StatCounter: Invalid target value:', target);
            this.target = 0;
        }

        this.duration = duration;
        this.current = 0;
        this.isAnimating = false;
        this.animationId = null;
        
        // 시작 시 0으로 설정
        this.element.textContent = '0' + (this.hasPercent ? '%' : '');
    }

    start() {
        if (this.isAnimating || !this.element) return;
        
        this.isAnimating = true;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            if (!this.isAnimating || !this.element) return;
            
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            
            // Easing function (ease-out cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            this.current = Math.floor(this.target * easeOut);
            
            this.element.textContent = this.current.toLocaleString() + 
                (this.hasPercent ? '%' : '');
            
            if (progress < 1) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                this.animationId = null;
                
                // 애니메이션 완료 후 최종 값 확실히 설정
                this.element.textContent = this.target.toLocaleString() + 
                    (this.hasPercent ? '%' : '');
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

// 스크롤 감지를 위한 IntersectionObserver 클래스
class ScrollTriggerObserver {
    constructor() {
        this.observers = new Map();
        this.isDestroyed = false;
        this.init();
    }

    init() {
        if (this.isDestroyed) return;
        
        // 통계 섹션 스크롤 감지 - 더 정확한 감지
        this.observeStatsSection();
        
        console.log('📊 Scroll trigger observer initialized for stats section');
    }

    observeStatsSection() {
        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) {
            console.warn('Stats section not found for scroll detection');
            return;
        }

        // 옵션 설정 - 섹션이 30% 보일 때 트리거
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -20% 0px', // 하단 20% 마진으로 더 정확한 감지
            threshold: [0.3] // 30% 보일 때 트리거
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('📊 Stats section is in view - triggering animation!');
                    this.triggerStatsAnimation(entry.target);
                    // 한 번만 실행되도록 관찰 중지
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        observer.observe(statsSection);
        this.observers.set('stats', observer);
        
        console.log('👁️ Stats section observer started');
    }

    triggerStatsAnimation(statsSection) {
        if (this.isDestroyed) return;
        
        try {
            // CSS 클래스로 즉시 표시
            statsSection.classList.add('in-view');
            
            // GSAP 애니메이션 (있을 경우)
            if (typeof gsap !== 'undefined') {
                this.animateStatsWithGSAP(statsSection);
            } else {
                // CSS만으로 애니메이션 처리
                this.animateStatsWithCSS(statsSection);
            }
            
            // 통계 카운터 애니메이션 시작 (1초 지연)
            setTimeout(() => {
                this.startStatsCounters();
            }, 1000);
            
        } catch (error) {
            console.error('Stats animation failed:', error);
            // 에러 시에도 표시는 보장
            statsSection.style.opacity = '1';
            statsSection.style.visibility = 'visible';
            statsSection.style.transform = 'translateY(0)';
        }
    }

    animateStatsWithGSAP(statsSection) {
        const container = statsSection.querySelector('.container');
        const title = statsSection.querySelector('h2');
        const message = statsSection.querySelector('.hope-message');
        const statsGrid = statsSection.querySelector('.stats-grid');
        const statItems = statsSection.querySelectorAll('.stat-item');

        // 순차적 애니메이션
        const timeline = gsap.timeline();

        // 섹션 전체 페이드인
        timeline.fromTo(statsSection, {
            opacity: 0,
            y: 50
        }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        });

        // 컨테이너 애니메이션
        timeline.fromTo(container, {
            opacity: 0,
            y: 30
        }, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.4");

        // 제목 애니메이션
        timeline.fromTo(title, {
            opacity: 0,
            y: 20
        }, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.3");

        // 메시지 애니메이션
        timeline.fromTo(message, {
            opacity: 0,
            y: 20
        }, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.2");

        // 통계 그리드 애니메이션
        timeline.fromTo(statsGrid, {
            opacity: 0,
            y: 40
        }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.1");

        // 개별 통계 아이템 애니메이션
        timeline.fromTo(statItems, {
            opacity: 0,
            y: 30,
            scale: 0.9
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.4)"
        }, "-=0.4");

        console.log('✨ GSAP stats animation started');
    }

    animateStatsWithCSS(statsSection) {
        const container = statsSection.querySelector('.container');
        const title = statsSection.querySelector('h2');
        const message = statsSection.querySelector('.hope-message');
        const statsGrid = statsSection.querySelector('.stats-grid');
        const statItems = statsSection.querySelectorAll('.stat-item');

        // CSS 트랜지션으로 순차 애니메이션
        setTimeout(() => {
            if (container) {
                container.style.opacity = '1';
                container.style.visibility = 'visible';
                container.style.transform = 'translateY(0)';
            }
        }, 200);

        setTimeout(() => {
            if (title) {
                title.style.opacity = '1';
                title.style.visibility = 'visible';
                title.style.transform = 'translateY(0)';
            }
        }, 400);

        setTimeout(() => {
            if (message) {
                message.style.opacity = '1';
                message.style.visibility = 'visible';
                message.style.transform = 'translateY(0)';
            }
        }, 600);

        setTimeout(() => {
            if (statsGrid) {
                statsGrid.style.opacity = '1';
                statsGrid.style.visibility = 'visible';
                statsGrid.style.transform = 'translateY(0)';
            }
        }, 800);

        // 개별 아이템 순차 애니메이션
        statItems.forEach((item, index) => {
            setTimeout(() => {
                if (item) {
                    item.style.opacity = '1';
                    item.style.visibility = 'visible';
                    item.style.transform = 'translateY(0) scale(1)';
                }
            }, 1000 + (index * 150));
        });

        console.log('🎨 CSS stats animation started');
    }

    startStatsCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach((number, index) => {
            if (!number.dataset.animated) {
                number.dataset.animated = 'true';
                
                setTimeout(() => {
                    // 숫자 표시 먼저
                    number.style.opacity = '1';
                    number.style.visibility = 'visible';
                    number.style.transform = 'scale(1)';
                    
                    // 카운터 애니메이션 시작
                    const targetValue = number.dataset.count || number.textContent;
                    const counter = new StatCounter(number, targetValue, 2500);
                    counter.start();
                    
                    console.log(`🔢 Started counter for: ${targetValue}`);
                }, index * 200);
            }
        });
    }

    destroy() {
        this.isDestroyed = true;
        
        this.observers.forEach(observer => {
            if (observer && observer.disconnect) {
                observer.disconnect();
            }
        });
        this.observers.clear();
        
        console.log('🧹 Scroll trigger observer destroyed');
    }
}

// 드라마틱한 애니메이션 관리자 - 스크롤 감지 강화
class DramaticAnimations {
    constructor() {
        this.isDestroyed = false;
        this.scrollTriggers = [];
        this.counters = [];
        this.scrollObserver = null;
        this.init();
    }

    init() {
        if (this.isDestroyed) return;

        try {
            if (typeof gsap === 'undefined') {
                console.warn('GSAP not loaded, using CSS fallback animations');
                this.cssOnlyMode();
                return;
            }

            if (typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
            }

            this.startDramaticSequence();
            this.setupScrollAnimations();
            
            console.log('✨ Dramatic animations initialized - objects will appear from invisibility');
        } catch (error) {
            console.error('Animation initialization failed:', error);
            this.cssOnlyMode();
        }
    }

    cssOnlyMode() {
        // CSS만으로 애니메이션 처리 - 드라마틱하게
        console.log('🎨 Using CSS-only dramatic animation mode');
        
        const animateElements = document.querySelectorAll(`
            .hero-title,
            .hero-description,
            .hero-buttons,
            .ranking-display,
            .urgent-cards,
            .intro-steps,
            .step,
            .section-header
        `);
        
        animateElements.forEach((element, index) => {
            if (element) {
                setTimeout(() => {
                    element.style.transition = 'all 0.8s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.style.visibility = 'visible';
                    element.classList.add('animate-complete');
                }, index * 150);
            }
        });

        // 스크롤 감지 ObserverList 시작 (CSS 모드에서도)
        this.initializeScrollObserver();
    }

    startDramaticSequence() {
        const animationSequence = [
            { selector: '.hero-title', delay: 0.2 },
            { selector: '.hero-description', delay: 0.4 },
            { selector: '.hero-buttons', delay: 0.6 },
            { selector: '.ranking-display', delay: 0.8 },
            { selector: '.section-header', delay: 1.2 },
            { selector: '.urgent-cards', delay: 1.4 },
            { selector: '.intro-text h2', delay: 1.8 },
            { selector: '.intro-steps', delay: 2.0 }
        ];

        animationSequence.forEach(({ selector, delay }) => {
            const element = document.querySelector(selector);
            if (element) {
                try {
                    // 완전히 숨겨진 상태에서 시작
                    gsap.fromTo(element, {
                        opacity: 0,
                        y: 30,
                        visibility: 'hidden'
                    }, {
                        opacity: 1,
                        y: 0,
                        visibility: 'visible',
                        duration: 0.8,
                        delay: delay,
                        ease: "power2.out",
                        onComplete: () => {
                            element.classList.add('animate-complete');
                            gsap.set(element, { clearProps: 'transform' });
                        }
                    });
                } catch (error) {
                    console.warn(`Animation failed for ${selector}:`, error);
                    // 폴백 처리
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.style.visibility = 'visible';
                }
            }
        });

        // 개별 요소들 - 더 드라마틱하게
        setTimeout(() => this.animateCards(), 1600);
        setTimeout(() => this.animateSteps(), 2200);
        
        // 스크롤 감지 Observer 초기화
        setTimeout(() => this.initializeScrollObserver(), 500);
    }

    initializeScrollObserver() {
        try {
            this.scrollObserver = new ScrollTriggerObserver();
            console.log('👁️ Scroll observer initialized for stats section');
        } catch (error) {
            console.error('Scroll observer initialization failed:', error);
            // 폴백으로 6초 후 통계 표시
            setTimeout(() => {
                this.fallbackStatsDisplay();
            }, 6000);
        }
    }

    fallbackStatsDisplay() {
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            console.log('⚠️ Fallback stats display activated');
            statsSection.classList.add('in-view');
            statsSection.style.opacity = '1';
            statsSection.style.visibility = 'visible';
            statsSection.style.transform = 'translateY(0)';
            
            // 카운터도 시작
            setTimeout(() => {
                if (this.scrollObserver) {
                    this.scrollObserver.startStatsCounters();
                }
            }, 1000);
        }
    }

    animateCards() {
        const cards = document.querySelectorAll('.missing-card');
        if (cards.length === 0) return;
        
        try {
            // 완전히 숨겨진 상태에서 시작
            gsap.fromTo(cards, {
                opacity: 0,
                y: 50,
                scale: 0.9
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "back.out(1.7)",
                onComplete: () => {
                    gsap.set(cards, { clearProps: 'transform' });
                }
            });
        } catch (error) {
            console.warn('Card animation failed:', error);
            cards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            });
        }
    }

    animateSteps() {
        const steps = document.querySelectorAll('.step');
        if (steps.length === 0) return;
        
        try {
            // 완전히 숨겨진 상태에서 시작
            gsap.fromTo(steps, {
                opacity: 0,
                y: 40,
                scale: 0.9
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.0,
                stagger: 0.2,
                ease: "back.out(1.7)",
                onComplete: () => {
                    gsap.set(steps, { clearProps: 'transform' });
                }
            });
        } catch (error) {
            console.warn('Steps animation failed:', error);
            steps.forEach(step => {
                step.style.opacity = '1';
                step.style.transform = 'translateY(0) scale(1)';
                step.style.visibility = 'visible';
            });
        }
    }

    setupScrollAnimations() {
        // ScrollTrigger는 통계 섹션에 사용하지 않음 (IntersectionObserver 사용)
        console.log('📜 Scroll animations setup completed');
    }

    animateUpButton(button) {
        if (this.isDestroyed || typeof gsap === 'undefined') return;
        
        try {
            const timeline = gsap.timeline();
            
            timeline
                .to(button, {
                    scale: 1.15,
                    duration: 0.15,
                    ease: 'power2.out'
                })
                .to(button, {
                    scale: 1,
                    duration: 0.4,
                    ease: 'elastic.out(1.5, 0.3)',
                    onComplete: () => {
                        gsap.set(button, { clearProps: 'transform' });
                    }
                });
                
            const countElement = button.querySelector('span');
            if (countElement) {
                gsap.fromTo(countElement, 
                    { scale: 1.4 },
                    {
                        scale: 1,
                        duration: 0.5,
                        ease: 'back.out(1.4)',
                        onComplete: () => {
                            gsap.set(countElement, { clearProps: 'transform' });
                        }
                    }
                );
            }
        } catch (error) {
            console.warn('Button animation failed:', error);
        }
    }

    destroy() {
        this.isDestroyed = true;
        
        this.scrollTriggers.forEach(trigger => {
            if (trigger && trigger.kill) trigger.kill();
        });
        this.scrollTriggers = [];
        
        this.counters.forEach(counter => {
            if (counter && counter.stop) counter.stop();
        });
        this.counters = [];

        if (this.scrollObserver) {
            this.scrollObserver.destroy();
            this.scrollObserver = null;
        }
    }
}

// 메인 홈페이지 관리 클래스 - 스크롤 감지 강화
class DramaticIndexPage {
    constructor() {
        this.animations = null;
        this.isDestroyed = false;
        this.eventCleanup = null;
        this.resizeTimeout = null;
        this.renderAttempts = 0;
        this.maxRenderAttempts = 3;
        this.init();
    }

    init() {
        if (this.isDestroyed) return;
        
        document.documentElement.classList.remove('no-js');
        document.documentElement.classList.add('js-enabled');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.handleDOMReady());
        } else {
            this.handleDOMReady();
        }
    }

    handleDOMReady() {
        if (this.isDestroyed) return;
        
        console.log('🚀 Starting dramatic index page initialization with enhanced scroll detection...');
        
        // 즉시 폴백 콘텐츠 표시 (안전장치)
        this.renderFallbackContent();
        
        // React 컴포넌트 시도
        setTimeout(() => {
            this.attemptReactRender();
        }, 100);
        
        // 드라마틱 애니메이션 초기화 (스크롤 감지 포함)
        setTimeout(() => {
            this.initializeAnimations();
            this.setupEventListeners();
        }, 200);

        // 강제 표시 타이머 (10초 후) - 통계 섹션은 제외
        setTimeout(() => {
            this.forceShowContent();
        }, 10000);
    }

    renderFallbackContent() {
        console.log('📋 Rendering fallback content for dramatic entrance...');
        
        try {
            renderRankingFallback();
            renderUrgentCardsFallback();
            this.ensureStatsDisplay();
            console.log('✅ Fallback content rendered successfully');
        } catch (error) {
            console.error('❌ Fallback rendering failed:', error);
        }
    }

    attemptReactRender() {
        if (this.renderAttempts >= this.maxRenderAttempts) {
            console.log('⚠️ Max React render attempts reached, using fallback');
            return;
        }

        this.renderAttempts++;
        
        try {
            if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
                console.warn(`React not available (attempt ${this.renderAttempts})`);
                if (this.renderAttempts < this.maxRenderAttempts) {
                    setTimeout(() => this.attemptReactRender(), 1000);
                }
                return;
            }

            this.renderReactComponents();
            console.log('✅ React components rendered successfully for dramatic animation');
        } catch (error) {
            console.error(`❌ React rendering failed (attempt ${this.renderAttempts}):`, error);
            if (this.renderAttempts < this.maxRenderAttempts) {
                setTimeout(() => this.attemptReactRender(), 1000);
            }
        }
    }

    renderReactComponents() {
        this.renderRankings();
        this.renderUrgentCards();
    }

    renderRankings() {
        const rankingContainer = document.getElementById('topRankings');
        if (!rankingContainer || !RankingDisplay) return;

        try {
            const root = ReactDOM.createRoot(rankingContainer);
            root.render(
                React.createElement(RankingDisplay, {
                    rankings: rankingData
                })
            );
        } catch (error) {
            console.error('React ranking rendering failed:', error);
            renderRankingFallback();
        }
    }

    renderUrgentCards() {
        const urgentContainer = document.querySelector('.urgent-cards');
        if (!urgentContainer || !MissingCard) return;

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
            // React 렌더링 완료 표시
            urgentContainer.setAttribute('data-react-rendered', 'true');
        } catch (error) {
            console.error('React cards rendering failed:', error);
            renderUrgentCardsFallback();
        }
    }

    ensureStatsDisplay() {
        const statsNumbers = document.querySelectorAll('.stat-number');
        
        statsNumbers.forEach((element, index) => {
            if (!element.textContent || element.textContent === '0') {
                const statData = statsData[index];
                if (statData) {
                    element.textContent = statData.value + (statData.isPercent ? '%' : '');
                    element.setAttribute('data-count', statData.value + (statData.isPercent ? '%' : ''));
                }
            }
        });
    }

    forceShowContent() {
        console.log('🔄 Force showing content after 10 seconds (emergency fallback, excluding stats)...');
        
        const hiddenElements = document.querySelectorAll(`
            .intro-steps,
            .step,
            .hero-title,
            .hero-description,
            .section-header
        `);
        
        hiddenElements.forEach(element => {
            if (element) {
                const computed = window.getComputedStyle(element);
                if (computed.opacity === '0' || computed.visibility === 'hidden') {
                    element.style.transition = 'all 0.8s ease';
                    element.style.opacity = '1';
                    element.style.visibility = 'visible';
                    element.style.transform = 'translateY(0)';
                    element.classList.add('animate-complete');
                }
            }
        });
        
        // 통계 섹션은 스크롤 감지에서만 처리
        console.log('📊 Stats section will only show on scroll detection');
    }

    initializeAnimations() {
        try {
            this.animations = new DramaticAnimations();
            console.log('✅ Dramatic animations initialized with enhanced scroll detection!');
        } catch (error) {
            console.error('❌ Animation initialization failed:', error);
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

    destroy() {
        this.isDestroyed = true;
        
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
        
        console.log('🧹 Dramatic index page destroyed');
    }
}

// 전역 UP 버튼 핸들러 - 안전성 강화
function handleUpClick(button, missingId) {
    if (!button) return;
    
    try {
        const countSpan = button.querySelector('span');
        if (countSpan) {
            const currentCount = parseInt(countSpan.textContent) || 0;
            countSpan.textContent = currentCount + 1;
        }
        
        if (indexPage && indexPage.animations && !indexPage.isDestroyed) {
            indexPage.animations.animateUpButton(button);
        }
        
        if (window.showNotification) {
            window.showNotification('소중한 참여에 감사합니다! 함께라면 찾을 수 있어요.', 'success');
        }
    } catch (error) {
        console.error('UP 버튼 클릭 처리 중 오류:', error);
    }
}

// 드라마틱한 초기화
let indexPage = null;

try {
    indexPage = new DramaticIndexPage();
} catch (error) {
    console.error('Index page initialization failed:', error);
    
    // 최소한의 폴백 초기화
    document.addEventListener('DOMContentLoaded', () => {
        renderRankingFallback();
        renderUrgentCardsFallback();
    });
}

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    if (indexPage) {
        indexPage.destroy();
        indexPage = null;
    }
});

// 전역 함수 내보내기
window.handleUpClick = handleUpClick;

// 개발자 도구 - 안전성 강화
if (typeof window !== 'undefined') {
    window.indexPageDebug = {
        get instance() { return indexPage; },
        get data() { 
            return {
                missing: urgentMissingData,
                ranking: rankingData,
                stats: statsData
            };
        },
        forceRender: () => {
            if (indexPage) {
                indexPage.renderFallbackContent();
            }
        },
        forceShowStats: () => {
            const statsSection = document.querySelector('.stats-section');
            if (statsSection) {
                statsSection.classList.add('in-view');
                console.log('🔧 Force showing stats section');
            }
        },
        testScrollDetection: () => {
            const statsSection = document.querySelector('.stats-section');
            if (statsSection) {
                statsSection.scrollIntoView({ behavior: 'smooth' });
                console.log('📜 Scrolling to stats section for testing');
            }
        },
        testDramaticAnimations: () => {
            if (typeof gsap !== 'undefined' && indexPage && !indexPage.isDestroyed) {
                try {
                    gsap.fromTo('.missing-card', {
                        opacity: 0,
                        y: 50,
                        scale: 0.9
                    }, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: 'back.out(1.7)'
                    });
                } catch (error) {
                    console.error('Test animation failed:', error);
                }
            }
        },
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
            try {
                indexPage = new DramaticIndexPage();
            } catch (error) {
                console.error('Reinitialization failed:', error);
            }
        }
    };
}

console.log('📜 Enhanced index.js loaded successfully - ready for spectacular entrance with scroll detection!');