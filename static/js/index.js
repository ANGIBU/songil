// static/js/index.js

// React 컴포넌트 활용 - 안전한 접근
const { useState, useEffect, useCallback, useMemo } = typeof React !== 'undefined' ? React : {};

// GSAP 안전한 접근
const gsap = typeof window !== 'undefined' && window.gsap ? window.gsap : null;
const ScrollTrigger = typeof window !== 'undefined' && window.ScrollTrigger ? window.ScrollTrigger : null;

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

// GSAP 애니메이션 관리자 클래스
class GSAPAnimationManager {
    constructor() {
        this.isDestroyed = false;
        this.timelines = [];
        this.scrollTriggers = [];
        this.loadingOverlay = null;
        this.initGSAP();
    }

    initGSAP() {
        if (!gsap) {
            console.warn('GSAP not available - animations will be skipped');
            return false;
        }

        // ScrollTrigger 등록
        if (ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
        }

        // GSAP 기본 설정
        gsap.defaults({
            ease: "power2.out",
            duration: 0.8
        });

        return true;
    }

    createLoadingOverlay() {
        if (this.loadingOverlay) return this.loadingOverlay;

        this.loadingOverlay = document.createElement('div');
        this.loadingOverlay.className = 'page-loading-overlay';
        this.loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">잠시만 기다려주세요...</div>
            </div>
        `;

        document.body.appendChild(this.loadingOverlay);
        return this.loadingOverlay;
    }

    removeLoadingOverlay() {
        if (!this.loadingOverlay) return;

        if (gsap) {
            gsap.to(this.loadingOverlay, {
                opacity: 0,
                duration: 0.6,
                ease: "power2.inOut",
                onComplete: () => {
                    if (this.loadingOverlay && this.loadingOverlay.parentNode) {
                        this.loadingOverlay.parentNode.removeChild(this.loadingOverlay);
                        this.loadingOverlay = null;
                    }
                }
            });
        } else {
            this.loadingOverlay.classList.add('fade-out');
            setTimeout(() => {
                if (this.loadingOverlay && this.loadingOverlay.parentNode) {
                    this.loadingOverlay.parentNode.removeChild(this.loadingOverlay);
                    this.loadingOverlay = null;
                }
            }, 600);
        }
    }

    prepareAnimationElements() {
        if (!gsap) return;

        // 모든 애니메이션 요소에 초기 상태 클래스 추가
        const elementsConfig = [
            { selector: '.hero-title', class: 'gsap-slide-up' },
            { selector: '.hero-description', class: 'gsap-slide-up' },
            { selector: '.hero-buttons', class: 'gsap-slide-up' },
            { selector: '.ranking-display', class: 'gsap-slide-left' },
            { selector: '.section-header', class: 'gsap-fade-in' },
            { selector: '.missing-card', class: 'gsap-stagger-item' },
            { selector: '.step', class: 'gsap-stagger-item' },
            { selector: '.stat-item', class: 'gsap-stagger-item' },
            { selector: '.hope-message', class: 'gsap-fade-in' }
        ];

        elementsConfig.forEach(config => {
            const elements = document.querySelectorAll(config.selector);
            elements.forEach(el => {
                el.classList.add(config.class);
            });
        });
    }

    createHeroAnimation() {
        if (!gsap) return null;

        const tl = gsap.timeline({ paused: true });

        // 히어로 텍스트 애니메이션
        tl.to('.hero-title', {
            opacity: 1,
            y: 0,
            visibility: 'visible',
            duration: 1,
            ease: "power3.out"
        })
        .to('.hero-description', {
            opacity: 1,
            y: 0,
            visibility: 'visible',
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.6")
        .to('.hero-buttons', {
            opacity: 1,
            y: 0,
            visibility: 'visible',
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.4")
        .to('.ranking-display', {
            opacity: 1,
            x: 0,
            visibility: 'visible',
            duration: 1,
            ease: "power2.out"
        }, "-=0.4");

        this.timelines.push(tl);
        return tl;
    }

    createUrgentCardsAnimation() {
        if (!gsap) return null;

        const cards = document.querySelectorAll('.missing-card');
        if (cards.length === 0) return null;

        const tl = gsap.timeline({ paused: true });

        tl.to(cards, {
            opacity: 1,
            y: 0,
            visibility: 'visible',
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        });

        this.timelines.push(tl);
        return tl;
    }

    createStepsAnimation() {
        if (!gsap) return null;

        const steps = document.querySelectorAll('.step');
        if (steps.length === 0) return null;

        const tl = gsap.timeline({ paused: true });

        tl.to(steps, {
            opacity: 1,
            y: 0,
            visibility: 'visible',
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out"
        });

        this.timelines.push(tl);
        return tl;
    }

    createStatsAnimation() {
        if (!gsap) return null;

        const statItems = document.querySelectorAll('.stat-item');
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (statItems.length === 0) return null;

        const tl = gsap.timeline({ paused: true });

        // 통계 카드들 나타나기
        tl.to(statItems, {
            opacity: 1,
            y: 0,
            visibility: 'visible',
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        });

        // 숫자 카운터 애니메이션
        statNumbers.forEach((numberEl, index) => {
            const statData = statsData[index];
            if (statData) {
                const targetValue = statData.value;
                const isPercent = statData.isPercent;
                
                tl.to({ count: 0 }, {
                    count: targetValue,
                    duration: 2,
                    ease: "power2.out",
                    onUpdate: function() {
                        const currentCount = Math.round(this.targets()[0].count);
                        numberEl.textContent = currentCount + (isPercent ? '%' : '');
                    }
                }, "-=0.5");
            }
        });

        this.timelines.push(tl);
        return tl;
    }

    setupScrollTriggers() {
        if (!gsap || !ScrollTrigger) return;

        // 긴급 실종자 섹션 스크롤 트리거
        const urgentTrigger = ScrollTrigger.create({
            trigger: '.urgent-section',
            start: 'top 80%',
            onEnter: () => {
                const animation = this.createUrgentCardsAnimation();
                if (animation) animation.play();
            },
            once: true
        });
        this.scrollTriggers.push(urgentTrigger);

        // 소개 단계 섹션 스크롤 트리거
        const introTrigger = ScrollTrigger.create({
            trigger: '.intro-section',
            start: 'top 70%',
            onEnter: () => {
                const animation = this.createStepsAnimation();
                if (animation) animation.play();
            },
            once: true
        });
        this.scrollTriggers.push(introTrigger);

        // 통계 섹션 스크롤 트리거
        const statsTrigger = ScrollTrigger.create({
            trigger: '.stats-section',
            start: 'top 70%',
            onEnter: () => {
                const animation = this.createStatsAnimation();
                if (animation) animation.play();
            },
            once: true
        });
        this.scrollTriggers.push(statsTrigger);

        // 헤더 섹션들 페이드인
        const headers = document.querySelectorAll('.section-header');
        headers.forEach(header => {
            const headerTrigger = ScrollTrigger.create({
                trigger: header,
                start: 'top 85%',
                onEnter: () => {
                    if (gsap) {
                        gsap.to(header, {
                            opacity: 1,
                            y: 0,
                            visibility: 'visible',
                            duration: 0.8,
                            ease: "power2.out"
                        });
                    }
                },
                once: true
            });
            this.scrollTriggers.push(headerTrigger);
        });

        // 희망 메시지 애니메이션
        const hopeMessage = document.querySelector('.hope-message');
        if (hopeMessage) {
            const hopeTrigger = ScrollTrigger.create({
                trigger: hopeMessage,
                start: 'top 80%',
                onEnter: () => {
                    if (gsap) {
                        gsap.to(hopeMessage, {
                            opacity: 1,
                            visibility: 'visible',
                            duration: 1,
                            ease: "power2.out"
                        });
                    }
                },
                once: true
            });
            this.scrollTriggers.push(hopeTrigger);
        }
    }

    startMainAnimation() {
        if (!gsap) return;

        // 로딩 오버레이 제거 후 메인 애니메이션 시작
        setTimeout(() => {
            this.removeLoadingOverlay();
            
            setTimeout(() => {
                const heroAnimation = this.createHeroAnimation();
                if (heroAnimation) {
                    heroAnimation.play();
                }
                
                // 스크롤 트리거 설정
                this.setupScrollTriggers();
            }, 300);
        }, 1000);
    }

    destroy() {
        this.isDestroyed = true;

        // 모든 타임라인 정리
        this.timelines.forEach(tl => {
            if (tl && tl.kill) {
                tl.kill();
            }
        });
        this.timelines = [];

        // 모든 스크롤 트리거 정리
        this.scrollTriggers.forEach(trigger => {
            if (trigger && trigger.kill) {
                trigger.kill();
            }
        });
        this.scrollTriggers = [];

        // 로딩 오버레이 정리
        if (this.loadingOverlay && this.loadingOverlay.parentNode) {
            this.loadingOverlay.parentNode.removeChild(this.loadingOverlay);
            this.loadingOverlay = null;
        }

        console.log('🧹 GSAP Animation Manager destroyed');
    }
}

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
        }).filter(Boolean)
    );
}) : null;

// React 실종자 카드 컴포넌트 - 안전한 버전
const MissingCard = typeof React !== 'undefined' ? React.memo(function MissingCard({ data, onUpClick }) {
    if (!data || !data.id) {
        console.warn('Invalid data provided to MissingCard:', data);
        return null;
    }

    const [upCount, setUpCount] = useState(data.upCount || 0);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleUpClick = useCallback(() => {
        setUpCount(prev => prev + 1);
        if (onUpClick && typeof onUpClick === 'function') {
            onUpClick(data.id);
        }
    }, [onUpClick, data.id]);

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
        className: 'missing-card urgent',
        'data-id': data.id
    }, [
        React.createElement('div', { className: 'card-image', key: 'image' }, [
            React.createElement('img', {
                src: data.image || '/static/images/placeholder.jpg',
                alt: '실종자 사진',
                onLoad: handleImageLoad,
                onError: handleImageError,
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
                    key: 'up-btn'
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

// GSAP 통합 홈페이지 관리 클래스
class EnhancedIndexPage {
    constructor() {
        this.isDestroyed = false;
        this.renderAttempts = 0;
        this.maxRenderAttempts = 3;
        this.animationManager = null;
        this.init();
    }

    init() {
        if (this.isDestroyed) return;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.handleDOMReady());
        } else {
            this.handleDOMReady();
        }
    }

    handleDOMReady() {
        if (this.isDestroyed) return;
        
        console.log('🚀 Starting enhanced index page with GSAP...');
        
        // GSAP 애니메이션 매니저 초기화
        this.animationManager = new GSAPAnimationManager();
        
        // 로딩 오버레이 생성
        this.animationManager.createLoadingOverlay();
        
        // 애니메이션 요소 준비
        this.animationManager.prepareAnimationElements();
        
        // 즉시 폴백 콘텐츠 표시
        this.renderFallbackContent();
        
        // React 컴포넌트 시도
        setTimeout(() => {
            this.attemptReactRender();
        }, 100);
        
        // 통계 데이터 표시
        this.ensureStatsDisplay();
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        // 메인 애니메이션 시작
        this.animationManager.startMainAnimation();
    }

    renderFallbackContent() {
        console.log('📋 Rendering fallback content...');
        
        try {
            renderRankingFallback();
            renderUrgentCardsFallback();
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
            console.log('✅ React components rendered successfully');
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
                if (statData && !gsap) {
                    // GSAP가 없을 때만 직접 설정
                    element.textContent = statData.value + (statData.isPercent ? '%' : '');
                    element.setAttribute('data-count', statData.value + (statData.isPercent ? '%' : ''));
                }
            }
        });
    }

    setupEventListeners() {
        if (this.isDestroyed) return;
        
        const clickHandler = (e) => {
            if (this.isDestroyed) return;
            
            if (e.target.closest('.up-btn')) {
                if (window.showNotification) {
                    window.showNotification('소중한 참여에 감사합니다! 함께라면 찾을 수 있어요.', 'success');
                }
            }
        };
        
        document.addEventListener('click', clickHandler);
        
        this.eventCleanup = () => {
            document.removeEventListener('click', clickHandler);
        };
    }

    destroy() {
        this.isDestroyed = true;
        
        if (this.animationManager) {
            this.animationManager.destroy();
            this.animationManager = null;
        }
        
        if (this.eventCleanup) {
            this.eventCleanup();
            this.eventCleanup = null;
        }
        
        console.log('🧹 Enhanced index page destroyed');
    }
}

// 전역 UP 버튼 핸들러 - 단순화된 버전
function handleUpClick(button, missingId) {
    if (!button) return;
    
    try {
        const countSpan = button.querySelector('span');
        if (countSpan) {
            const currentCount = parseInt(countSpan.textContent) || 0;
            countSpan.textContent = currentCount + 1;
        }
        
        if (window.showNotification) {
            window.showNotification('소중한 참여에 감사합니다! 함께라면 찾을 수 있어요.', 'success');
        }
    } catch (error) {
        console.error('UP 버튼 클릭 처리 중 오류:', error);
    }
}

// GSAP 통합 초기화
let indexPage = null;

try {
    indexPage = new EnhancedIndexPage();
} catch (error) {
    console.error('Enhanced index page initialization failed:', error);
    
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

// 개발자 도구 - GSAP 통합 버전
if (typeof window !== 'undefined') {
    window.indexPageDebug = {
        get instance() { return indexPage; },
        get animationManager() { return indexPage?.animationManager; },
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
        testAnimation: () => {
            if (indexPage?.animationManager) {
                const heroAnim = indexPage.animationManager.createHeroAnimation();
                if (heroAnim) heroAnim.restart();
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
                indexPage = new EnhancedIndexPage();
            } catch (error) {
                console.error('Reinitialization failed:', error);
            }
        }
    };
}

console.log('📜 Enhanced index.js with GSAP transitions loaded successfully!');