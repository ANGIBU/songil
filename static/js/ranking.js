// static/js/ranking.js

// React 컴포넌트 활용
const { useState, useEffect, useCallback } = React;

// 전체 순위 데이터 (건수 기준)
const rankingData = [
    {
        rank: 1,
        username: "시민영웅★★★",
        points: 89,
        change: { type: 'up', value: 2 },
        stats: { reports: 23, witnesses: 66 },
        avatar: "fas fa-user-circle"
    },
    {
        rank: 2,
        username: "따뜻한마음",
        points: 72,
        change: { type: 'down', value: 1 },
        stats: { reports: 15, witnesses: 57 },
        avatar: "fas fa-user-circle"
    },
    {
        rank: 3,
        username: "도움이되고싶어요",
        points: 68,
        change: { type: 'up', value: 1 },
        stats: { reports: 8, witnesses: 60 },
        avatar: "fas fa-user-circle"
    },
    {
        rank: 4,
        username: "정의의사자",
        points: 58,
        change: { type: 'same', value: 0 },
        stats: { reports: 12, witnesses: 46 },
        avatar: "fas fa-user-circle"
    },
    {
        rank: 5,
        username: "희망의빛",
        points: 52,
        change: { type: 'up', value: 3 },
        stats: { reports: 6, witnesses: 46 },
        avatar: "fas fa-user-circle"
    },
    {
        rank: 6,
        username: "착한시민",
        points: 47,
        change: { type: 'down', value: 2 },
        stats: { reports: 9, witnesses: 38 },
        avatar: "fas fa-user-circle"
    },
    {
        rank: 7,
        username: "사랑나눔",
        points: 43,
        change: { type: 'same', value: 0 },
        stats: { reports: 4, witnesses: 39 },
        avatar: "fas fa-user-circle"
    },
    {
        rank: 8,
        username: "관찰자",
        points: 39,
        change: { type: 'up', value: 1 },
        stats: { reports: 2, witnesses: 37 },
        avatar: "fas fa-user-circle"
    },
    {
        rank: 9,
        username: "경찰아저씨",
        points: 35,
        change: { type: 'down', value: 1 },
        stats: { reports: 11, witnesses: 24 },
        avatar: "fas fa-user-circle"
    },
    {
        rank: 10,
        username: "평범한사람",
        points: 31,
        change: { type: 'new', value: 0 },
        stats: { reports: 5, witnesses: 26 },
        avatar: "fas fa-user-circle"
    }
];

// 순위 아이템 React 컴포넌트
function RankingItem({ data, index }) {
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

    useEffect(() => {
        // 개별 랭킹 아이템 애니메이션
        const element = document.querySelector(`.ranking-item[data-rank="${data.rank}"]`);
        
        if (element) {
            const pointsElement = element.querySelector('.points');
            
            if (typeof gsap !== 'undefined') {
                // GSAP 애니메이션
                gsap.fromTo(element, 
                    {
                        opacity: 0,
                        x: -30
                    },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: "power2.out"
                    }
                );

                // 점수 카운트업 애니메이션
                if (pointsElement) {
                    const countObj = { value: 0 };
                    pointsElement.textContent = '0건'; // 초기값 설정
                    
                    gsap.to(countObj, {
                        value: data.points,
                        duration: 1.5,
                        delay: 0.5 + (index * 0.1),
                        ease: "power2.out",
                        onUpdate: function() {
                            pointsElement.textContent = `${Math.floor(countObj.value)}건`;
                        },
                        onComplete: function() {
                            pointsElement.textContent = `${data.points}건`;
                        }
                    });
                }
            } else {
                // GSAP가 없으면 즉시 표시
                if (pointsElement) {
                    pointsElement.textContent = `${data.points}건`;
                }
                element.style.opacity = '1';
                element.style.transform = 'none';
            }
        }
    }, [data, index]);

    return React.createElement('div', {
        className: `ranking-item rank-${data.rank}`,
        'data-rank': data.rank,
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
            React.createElement('div', { 
                className: 'points',
                key: 'points'
            }, '0건'),
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
    useEffect(() => {
        // 패널 전체 애니메이션
        const panel = document.querySelector('.ranking-panel');
        if (panel) {
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(panel,
                    {
                        opacity: 0,
                        y: 30
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out"
                    }
                );
            } else {
                // GSAP가 없으면 즉시 표시
                panel.style.opacity = '1';
                panel.style.transform = 'none';
            }
        }
    }, []);

    return React.createElement('div', {
        className: 'ranking-panel active'
    }, [
        React.createElement('div', { className: 'ranking-header-info', key: 'header' }, [
            React.createElement('h2', { key: 'title' }, '전체 랭킹 TOP 10'),
            React.createElement('p', { key: 'description' }, '실종자 신고와 목격 신고에 기여한 건수를 종합한 전체 기간 순위입니다')
        ]),
        React.createElement('div', { className: 'ranking-list', key: 'list' },
            data.map((item, index) =>
                React.createElement(RankingItem, {
                    key: item.rank,
                    data: item,
                    index: index
                })
            )
        )
    ]);
}

// GSAP 카운터 애니메이션 클래스
class GSAPRankingAnimator {
    constructor() {
        this.isAnimating = false;
        this.hasAnimated = false;
        this.isGSAPReady = typeof gsap !== 'undefined';
        this.statData = [15429, 8342, 1203];
        
        // 페이지 로드시 즉시 숫자 설정
        this.setInitialNumbers();
    }

    // 초기 숫자 설정 (GSAP 없어도 보이도록)
    setInitialNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (this.isGSAPReady) {
            // GSAP가 있으면 0에서 시작 (애니메이션 예정)
            statNumbers.forEach(numberEl => {
                numberEl.textContent = '0';
            });
        } else {
            // GSAP가 없으면 즉시 최종값 표시
            statNumbers.forEach((numberEl, index) => {
                if (this.statData[index]) {
                    numberEl.textContent = this.statData[index].toLocaleString();
                }
            });
        }
    }

    // 통계 카드 애니메이션
    animateStatCards() {
        if (this.hasAnimated) return;

        const statCards = document.querySelectorAll('.stat-card');
        const statNumbers = document.querySelectorAll('.stat-number');
        const statLabels = document.querySelectorAll('.stat-label');

        if (!this.isGSAPReady) {
            // GSAP가 없으면 즉시 표시
            statNumbers.forEach((numberEl, index) => {
                if (this.statData[index]) {
                    numberEl.textContent = this.statData[index].toLocaleString();
                }
            });
            this.hasAnimated = true;
            return;
        }

        // GSAP 애니메이션
        // 카드 나타나기 애니메이션
        gsap.fromTo(statCards, 
            {
                opacity: 0,
                y: 50,
                scale: 0.9
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "back.out(1.7)"
            }
        );

        // 숫자 카운트업 애니메이션 - 0에서 시작
        statNumbers.forEach((numberEl, index) => {
            const targetValue = this.statData[index];
            if (!targetValue) return;
            
            const countObj = { value: 0 };
            
            // 초기값을 0으로 설정
            numberEl.textContent = '0';
            
            gsap.to(countObj, {
                value: targetValue,
                duration: 2,
                delay: 0.5 + (index * 0.3),
                ease: "power2.out",
                onUpdate: function() {
                    numberEl.textContent = Math.floor(countObj.value).toLocaleString();
                },
                onComplete: function() {
                    numberEl.textContent = targetValue.toLocaleString();
                }
            });
        });

        // 라벨 페이드인 애니메이션
        gsap.fromTo(statLabels,
            {
                opacity: 0,
                y: 20
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: 1,
                stagger: 0.1,
                ease: "power2.out"
            }
        );

        this.hasAnimated = true;
    }

    // CTA 섹션 애니메이션
    animateCTASection() {
        if (!this.isGSAPReady) return;

        const cta = document.querySelector('.personal-ranking-cta');
        if (cta) {
            gsap.fromTo(cta,
                {
                    opacity: 0,
                    y: 30
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: cta,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }
    }

    // 혜택 섹션 애니메이션
    animateBenefitsSection() {
        if (!this.isGSAPReady) return;

        const benefits = document.querySelector('.ranking-benefits');
        const benefitItems = document.querySelectorAll('.benefit-item');

        if (benefits) {
            gsap.fromTo(benefits,
                {
                    opacity: 0,
                    y: 30
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: benefits,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none none"
                    }
                }
            );

            gsap.fromTo(benefitItems,
                {
                    opacity: 0,
                    y: 30
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: benefits,
                        start: "top 70%",
                        end: "bottom 20%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }
    }

    // 모든 애니메이션 초기화
    initializeAnimations() {
        // 페이지 로드 시 통계 카드 애니메이션 실행
        this.animateStatCards();
        
        // Three.js CTA 배경 효과 초기화
        this.initializeCTABackground();
        
        // 스크롤 기반 애니메이션들 설정
        this.animateCTASection();
        this.animateBenefitsSection();
    }

    // CTA 배경 Three.js 효과
    initializeCTABackground() {
        const container = document.getElementById('ctaThreeJSContainer');
        if (!container || typeof THREE === 'undefined') {
            console.warn('Three.js not available or container not found');
            return;
        }

        // 모바일에서는 성능을 위해 비활성화
        if (window.innerWidth <= 480) {
            console.log('Three.js CTA background disabled on mobile for performance');
            return;
        }

        try {
            // Scene, Camera, Renderer 설정
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ 
                alpha: true, 
                antialias: window.innerWidth > 768, // 모바일에서는 안티알리아싱 비활성화
                powerPreference: "low-power"
            });

            renderer.setSize(container.offsetWidth, container.offsetHeight);
            renderer.setClearColor(0x000000, 0);
            container.appendChild(renderer.domElement);

            // 보글보글 구체들 생성
            const bubbles = [];
            const bubbleGeometry = new THREE.SphereGeometry(0.1, 8, 6);
            const bubbleMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0.6
            });

            // 디바이스에 따라 구체 개수 조정
            const bubbleCount = window.innerWidth > 768 ? 20 : 12;
            
            for (let i = 0; i < bubbleCount; i++) {
                const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial.clone());
                
                // 랜덤 위치 설정
                bubble.position.x = (Math.random() - 0.5) * 10;
                bubble.position.y = (Math.random() - 0.5) * 6;
                bubble.position.z = (Math.random() - 0.5) * 4;
                
                // 개별 속도와 방향 설정
                bubble.userData = {
                    velocity: {
                        x: (Math.random() - 0.5) * 0.02,
                        y: (Math.random() - 0.5) * 0.02,
                        z: (Math.random() - 0.5) * 0.01
                    },
                    originalY: bubble.position.y,
                    phase: Math.random() * Math.PI * 2,
                    scale: 0.5 + Math.random() * 0.5
                };
                
                bubble.scale.setScalar(bubble.userData.scale);
                scene.add(bubble);
                bubbles.push(bubble);
            }

            camera.position.z = 5;

            // 애니메이션 루프
            const animate = () => {
                requestAnimationFrame(animate);

                bubbles.forEach((bubble, index) => {
                    // 위아래 보글보글 움직임
                    bubble.userData.phase += 0.02;
                    bubble.position.y = bubble.userData.originalY + Math.sin(bubble.userData.phase) * 0.5;
                    
                    // 좌우 미세 움직임
                    bubble.position.x += bubble.userData.velocity.x;
                    bubble.position.z += bubble.userData.velocity.z;
                    
                    // 투명도 변화로 반짝임 효과
                    bubble.material.opacity = 0.3 + Math.sin(bubble.userData.phase * 1.5) * 0.3;
                    
                    // 경계 충돌 처리
                    if (Math.abs(bubble.position.x) > 5) {
                        bubble.userData.velocity.x *= -1;
                    }
                    if (Math.abs(bubble.position.z) > 2) {
                        bubble.userData.velocity.z *= -1;
                    }
                    
                    // 미세한 회전
                    bubble.rotation.x += 0.01;
                    bubble.rotation.y += 0.01;
                });

                renderer.render(scene, camera);
            };

            animate();

            // 리사이즈 처리
            const handleResize = () => {
                if (container.offsetWidth && container.offsetHeight) {
                    camera.aspect = container.offsetWidth / container.offsetHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(container.offsetWidth, container.offsetHeight);
                }
            };

            window.addEventListener('resize', handleResize);

            // 정리 함수 저장
            this.ctaCleanup = () => {
                window.removeEventListener('resize', handleResize);
                if (container && renderer.domElement) {
                    container.removeChild(renderer.domElement);
                }
                renderer.dispose();
                bubbleGeometry.dispose();
                bubbleMaterial.dispose();
            };

            console.log('CTA Three.js background initialized successfully');

        } catch (error) {
            console.warn('Failed to initialize CTA Three.js background:', error);
        }
    }

    // 정리 함수
    dispose() {
        if (this.ctaCleanup) {
            this.ctaCleanup();
        }
    }
}

// Intersection Observer를 활용한 스크롤 트리거
class RankingScrollObserver {
    constructor() {
        this.animator = new GSAPRankingAnimator();
        this.init();
    }

    init() {
        // 즉시 통계 카드 애니메이션 시작 (페이지 로드시)
        setTimeout(() => {
            this.animator.animateStatCards();
        }, 100);
        
        this.setupIntersectionObserver();
        this.observeElements();
        
        // GSAP 애니메이션 초기화
        this.animator.initializeAnimations();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        });
    }

    observeElements() {
        const elements = document.querySelectorAll('.ranking-stats, .ranking-panel');
        elements.forEach(el => this.observer.observe(el));
    }
}

// 메인 순위 페이지 클래스
class RankingPage {
    constructor() {
        this.scrollObserver = null;
        this.animator = null;
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
        // GSAP ScrollTrigger 등록 (안전하게)
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && gsap.registerPlugin) {
            try {
                gsap.registerPlugin(ScrollTrigger);
                console.log('GSAP ScrollTrigger registered successfully');
            } catch (error) {
                console.warn('Failed to register GSAP ScrollTrigger:', error);
            }
        } else {
            console.warn('GSAP or ScrollTrigger not available, animations will be disabled');
        }

        // 초기 렌더링 (먼저 실행)
        this.renderRankingPanel();
        
        // 스크롤 관찰자 초기화
        this.scrollObserver = new RankingScrollObserver();
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        console.log('Ranking page initialized with GSAP animations');
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

        // 스크롤 이벤트 (GSAP ScrollTrigger와 함께 사용)
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));

        // 페이지 언로드시 Three.js 리소스 정리
        window.addEventListener('beforeunload', () => {
            if (this.scrollObserver && this.scrollObserver.animator) {
                this.scrollObserver.animator.dispose();
            }
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
        const createRankingItemHTML = (data, index) => {
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
                <div class="ranking-item rank-${data.rank}" data-rank="${data.rank}" data-index="${index}">
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
                        <div class="points">${data.points}건</div>
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
                <p>실종자 신고와 목격 신고에 기여한 건수를 종합한 전체 기간 순위입니다</p>
            </div>
            <div class="ranking-list">
                ${data.map((item, index) => createRankingItemHTML(item, index)).join('')}
            </div>
        `;

        // Vanilla JS에서도 애니메이션 적용
        this.applyVanillaAnimations(data);
    }

    applyVanillaAnimations(data) {
        if (typeof gsap === 'undefined') {
            // GSAP가 없으면 즉시 모든 점수 표시
            const rankingItems = document.querySelectorAll('.ranking-item');
            rankingItems.forEach((item, index) => {
                const pointsElement = item.querySelector('.points');
                if (pointsElement && data[index]) {
                    pointsElement.textContent = `${data[index].points}건`;
                }
            });
            return;
        }

        // 랭킹 아이템들 애니메이션
        const rankingItems = document.querySelectorAll('.ranking-item');
        
        gsap.fromTo(rankingItems,
            {
                opacity: 0,
                x: -30
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            }
        );

        // 점수 카운트업
        rankingItems.forEach((item, index) => {
            const pointsElement = item.querySelector('.points');
            if (pointsElement && data[index]) {
                const targetValue = data[index].points;
                const countObj = { value: 0 };
                
                // 초기값 설정
                pointsElement.textContent = '0건';
                
                gsap.to(countObj, {
                    value: targetValue,
                    duration: 1.5,
                    delay: 0.5 + (index * 0.1),
                    ease: "power2.out",
                    onUpdate: function() {
                        pointsElement.textContent = `${Math.floor(countObj.value)}건`;
                    },
                    onComplete: function() {
                        pointsElement.textContent = `${targetValue}건`;
                    }
                });
            }
        });
    }

    handleResize() {
        // 반응형 조정
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }

        // GSAP ScrollTrigger 새로고침 (안전하게)
        if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh) {
            try {
                ScrollTrigger.refresh();
            } catch (error) {
                console.warn('Failed to refresh ScrollTrigger:', error);
            }
        }
    }

    handleScroll() {
        // 추가 스크롤 이벤트 처리 (필요시)
    }

    // 쓰로틀 유틸리티
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
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
        animator: rankingPage.scrollObserver?.animator
    };
}