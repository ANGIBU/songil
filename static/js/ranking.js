// static/js/ranking.js

// React 컴포넌트 활용
const { useState, useEffect, useCallback } = React;

// 전체 순위 데이터 (단일 카테고리)
const rankingData = [
    {
        rank: 1,
        username: "시민영웅★★★",
        points: 12450,
        change: { type: 'up', value: 2 },
        stats: { reports: 23, witnesses: 89 },
        avatar: "fas fa-user-circle"
    },
    {
        rank: 2,
        username: "따뜻한마음",
        points: 9830,
        change: { type: 'down', value: 1 },
        stats: { reports: 15, witnesses: 67 },
        avatar: "fas fa-user-circle"
    },
    {
        rank: 3,
        username: "도움이되고싶어요",
        points: 8960,
        change: { type: 'up', value: 1 },
        stats: { reports: 8, witnesses: 78 },
        avatar: "fas fa-user-circle"
    },
    {
        rank: 4,
        username: "정의의사자",
        points: 7820,
        change: { type: 'same', value: 0 },
        stats: { reports: 12, witnesses: 45 },
        avatar: "fas fa-user-circle"
    },
    {
        rank: 5,
        username: "희망의빛",
        points: 6940,
        change: { type: 'up', value: 3 },
        stats: { reports: 6, witnesses: 52 },
        avatar: "fas fa-user-circle"
    },
    {
        rank: 6,
        username: "착한시민",
        points: 6120,
        change: { type: 'down', value: 2 },
        stats: { reports: 9, witnesses: 38 },
        avatar: "fas fa-user-circle"
    },
    {
        rank: 7,
        username: "사랑나눔",
        points: 5680,
        change: { type: 'same', value: 0 },
        stats: { reports: 4, witnesses: 41 },
        avatar: "fas fa-user-circle"
    },
    {
        rank: 8,
        username: "관찰자",
        points: 5240,
        change: { type: 'up', value: 1 },
        stats: { reports: 2, witnesses: 48 },
        avatar: "fas fa-user-circle"
    },
    {
        rank: 9,
        username: "경찰아저씨",
        points: 4890,
        change: { type: 'down', value: 1 },
        stats: { reports: 11, witnesses: 22 },
        avatar: "fas fa-user-circle"
    },
    {
        rank: 10,
        username: "평범한사람",
        points: 4150,
        change: { type: 'new', value: 0 },
        stats: { reports: 5, witnesses: 28 },
        avatar: "fas fa-user-circle"
    }
];

// 순위 아이템 React 컴포넌트
function RankingItem({ data }) {
    const getRankIcon = (rank) => {
        if (rank === 1) return 'fas fa-crown';
        if (rank <= 3) return 'fas fa-medal';
        return null;
    };

    const getChangeIcon = (changeType) => {
        switch (changeType) {
            case 'up': return 'fas fa-arrow-up';
            case 'down': return 'fas fa-arrow-down';
            case 'new': return 'fas fa-star';
            default: return null;
        }
    };

    const getChangeText = (change) => {
        if (change.type === 'same') return '-';
        if (change.type === 'new') return 'NEW';
        return change.value > 0 ? `+${change.value}` : change.value.toString();
    };

    const getStatsText = (stats) => {
        return `신고 ${stats.reports}건, 목격 ${stats.witnesses}건`;
    };

    return React.createElement('div', {
        className: `ranking-item rank-${data.rank}`,
        key: data.rank
    }, [
        React.createElement('div', { className: 'rank-number', key: 'rank' }, [
            getRankIcon(data.rank) && React.createElement('i', {
                className: getRankIcon(data.rank),
                key: 'icon'
            }),
            React.createElement('span', { key: 'number' }, data.rank)
        ]),
        React.createElement('div', { className: 'user-info', key: 'info' }, [
            React.createElement('div', { className: 'user-avatar', key: 'avatar' },
                React.createElement('i', { className: data.avatar })
            ),
            React.createElement('div', { className: 'user-details', key: 'details' }, [
                React.createElement('div', { className: 'username', key: 'name' }, data.username),
                React.createElement('div', { className: 'user-stats', key: 'stats' },
                    React.createElement('span', {
                        className: 'badge witnesses'
                    }, getStatsText(data.stats))
                )
            ])
        ]),
        React.createElement('div', { className: 'rank-score', key: 'score' }, [
            React.createElement('div', { className: 'points', key: 'points' }, 
                `${data.points.toLocaleString()}P`
            ),
            React.createElement('div', {
                className: `change ${data.change.type}`,
                key: 'change'
            }, [
                getChangeIcon(data.change.type) && React.createElement('i', {
                    className: getChangeIcon(data.change.type),
                    key: 'change-icon'
                }),
                React.createElement('span', { key: 'change-text' }, getChangeText(data.change))
            ])
        ])
    ]);
}

// 순위 패널 React 컴포넌트
function RankingPanel({ data }) {
    return React.createElement('div', {
        className: 'ranking-panel active'
    }, [
        React.createElement('div', { className: 'ranking-header-info', key: 'header' }, [
            React.createElement('h2', { key: 'title' }, '전체 랭킹 TOP 10'),
            React.createElement('p', { key: 'description' }, '실종자 신고, 목격 신고, 포인트를 종합한 전체 기간 순위입니다')
        ]),
        React.createElement('div', { className: 'ranking-list', key: 'list' },
            data.map(item =>
                React.createElement(RankingItem, {
                    key: item.rank,
                    data: item
                })
            )
        )
    ]);
}

// 통계 카운터 애니메이션 클래스
class StatCounter {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = parseInt(target.toString().replace(/[,%]/g, ''));
        this.duration = duration;
        this.current = 0;
        this.isAnimating = false;
    }

    start() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            
            // Easing function (ease-out cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            this.current = Math.floor(this.target * easeOut);
            
            this.element.textContent = this.current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// GSAP 애니메이션 관리자
class RankingAnimations {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded, skipping animations');
            return;
        }

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        this.setupAnimations();
        this.isInitialized = true;
    }

    setupAnimations() {
        // 헤더 애니메이션 - visible-on-load 클래스가 있어도 애니메이션 적용
        gsap.timeline({ delay: 0.3 })
            .from('.ranking-title h1', {
                duration: 1,
                y: 30,
                opacity: 0,
                ease: 'power2.out'
            })
            .from('.ranking-title p', {
                duration: 0.8,
                y: 20,
                opacity: 0,
                ease: 'power2.out'
            }, '-=0.5')
            .from('.ranking-stats .stat-card', {
                duration: 0.6,
                y: 40,
                opacity: 0,
                stagger: 0.1,
                ease: 'back.out(1.7)'
            }, '-=0.4');

        // 순위 아이템 초기 애니메이션
        this.animateRankingItems();
    }

    animateRankingItems() {
        if (!this.isInitialized) return;

        const items = document.querySelectorAll('.ranking-item');
        if (items.length === 0) return;

        gsap.from(items, {
            duration: 0.8,
            y: 50,
            opacity: 0,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.3
        });
    }
}

// Intersection Observer를 활용한 스크롤 트리거
class RankingScrollObserver {
    constructor() {
        this.counters = new Map();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.observeElements();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // 통계 카운터 시작
                    if (entry.target.classList.contains('stat-card')) {
                        this.startStatCounter(entry.target);
                    }
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });
    }

    observeElements() {
        const elements = document.querySelectorAll('.stat-card, .ranking-item');
        elements.forEach(el => this.observer.observe(el));
    }

    startStatCounter(statCard) {
        const numberElement = statCard.querySelector('.stat-number');
        if (numberElement && !this.counters.has(numberElement)) {
            const counter = new StatCounter(numberElement, numberElement.textContent);
            this.counters.set(numberElement, counter);
            counter.start();
        }
    }
}

// 메인 순위 페이지 클래스
class RankingPage {
    constructor() {
        this.animations = null;
        this.scrollObserver = null;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // 애니메이션 시스템 초기화
        this.animations = new RankingAnimations();
        
        // 스크롤 관찰자 초기화
        this.scrollObserver = new RankingScrollObserver();
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        // 초기 렌더링
        this.renderRankingPanel();
        
        console.log('Ranking page initialized successfully');
    }

    setupEventListeners() {
        // 리사이즈 핸들러
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    renderRankingPanel() {
        const container = document.getElementById('totalRanking');
        
        if (!container) return;
        
        // 로딩 메시지 제거
        const loadingElement = container.querySelector('.ranking-loading');
        if (loadingElement) {
            loadingElement.remove();
        }
        
        // React 렌더링
        if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
            const root = ReactDOM.createRoot(container);
            root.render(
                React.createElement(RankingPanel, {
                    data: rankingData
                })
            );
        } else {
            console.warn('React not available, falling back to vanilla JS');
            this.renderWithVanilla(rankingData, container);
        }
    }

    renderWithVanilla(data, container) {
        const createRankingItemHTML = (data) => {
            const rankIcon = data.rank <= 3 ? 
                `<i class="${data.rank === 1 ? 'fas fa-crown' : 'fas fa-medal'}"></i>` : '';
            
            const changeIcon = data.change.type !== 'same' && data.change.type !== 'new' ? 
                `<i class="fas fa-arrow-${data.change.type === 'up' ? 'up' : 'down'}"></i>` : 
                (data.change.type === 'new' ? '<i class="fas fa-star"></i>' : '');
            
            const getStatsText = (stats) => {
                return `신고 ${stats.reports}건, 목격 ${stats.witnesses}건`;
            };

            const getChangeText = (change) => {
                if (change.type === 'same') return '-';
                if (change.type === 'new') return 'NEW';
                return change.value > 0 ? `+${change.value}` : change.value.toString();
            };
            
            return `
                <div class="ranking-item rank-${data.rank}">
                    <div class="rank-number">
                        ${rankIcon}
                        <span>${data.rank}</span>
                    </div>
                    <div class="user-info">
                        <div class="user-avatar">
                            <i class="${data.avatar}"></i>
                        </div>
                        <div class="user-details">
                            <div class="username">${data.username}</div>
                            <div class="user-stats">
                                <span class="badge witnesses">${getStatsText(data.stats)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="rank-score">
                        <div class="points">${data.points.toLocaleString()}P</div>
                        <div class="change ${data.change.type}">
                            ${changeIcon}
                            <span>${getChangeText(data.change)}</span>
                        </div>
                    </div>
                </div>
            `;
        };
        
        container.innerHTML = `
            <div class="ranking-header-info">
                <h2>전체 랭킹 TOP 10</h2>
                <p>실종자 신고, 목격 신고, 포인트를 종합한 전체 기간 순위입니다</p>
            </div>
            <div class="ranking-list">
                ${data.map(item => createRankingItemHTML(item)).join('')}
            </div>
        `;
    }

    handleResize() {
        // 반응형 조정
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }
}

// 페이지 로드 시 자동 초기화
const rankingPage = new RankingPage();

// 개발자 도구
if (typeof window !== 'undefined') {
    window.rankingPageDebug = {
        instance: rankingPage,
        data: rankingData,
        testAnimations: () => {
            if (typeof gsap !== 'undefined') {
                gsap.to('.ranking-item', {
                    duration: 0.5,
                    scale: 1.05,
                    stagger: 0.1,
                    yoyo: true,
                    repeat: 1
                });
            }
        }
    };
}