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
        // 점수 카운트업 애니메이션
        const pointsElement = document.querySelector(`.ranking-item[data-rank="${data.rank}"] .points`);
        if (pointsElement) {
            let currentValue = 0;
            const targetValue = data.points;
            const increment = targetValue / 60; // 60단계로 부드럽게
            const stepTime = 1500 / 60; // 1.5초
            
            pointsElement.textContent = '0건';
            
            const counter = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    currentValue = targetValue;
                    clearInterval(counter);
                }
                pointsElement.textContent = `${Math.floor(currentValue)}건`;
            }, stepTime);
            
            // 지연 시작
            setTimeout(() => {
                counter;
            }, index * 100);
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

// 통계 수치 카운트업 효과
function animateStatNumbers() {
    const statData = [15429, 8342, 1203];
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach((numberEl, index) => {
        if (!statData[index]) return;
        
        const targetValue = statData[index];
        let currentValue = 0;
        const increment = targetValue / 100; // 100단계로 나누어 부드럽게
        const duration = 2000; // 2초
        const stepTime = duration / 100;
        
        numberEl.textContent = '0';
        
        const counter = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(counter);
            }
            numberEl.textContent = Math.floor(currentValue).toLocaleString();
        }, stepTime);
    });
}

// CTA 배경 Three.js 효과 (애니메이션 없이)
function initializeCTABackground() {
    const container = document.getElementById('ctaThreeJSContainer');
    if (!container || typeof THREE === 'undefined') {
        return;
    }

    // 모바일에서는 성능을 위해 비활성화
    if (window.innerWidth <= 480) {
        return;
    }

    try {
        // Scene, Camera, Renderer 설정
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: window.innerWidth > 768,
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

        const bubbleCount = window.innerWidth > 768 ? 20 : 12;
        
        for (let i = 0; i < bubbleCount; i++) {
            const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial.clone());
            
            bubble.position.x = (Math.random() - 0.5) * 10;
            bubble.position.y = (Math.random() - 0.5) * 6;
            bubble.position.z = (Math.random() - 0.5) * 4;
            
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

            bubbles.forEach((bubble) => {
                bubble.userData.phase += 0.02;
                bubble.position.y = bubble.userData.originalY + Math.sin(bubble.userData.phase) * 0.5;
                
                bubble.position.x += bubble.userData.velocity.x;
                bubble.position.z += bubble.userData.velocity.z;
                
                bubble.material.opacity = 0.3 + Math.sin(bubble.userData.phase * 1.5) * 0.3;
                
                if (Math.abs(bubble.position.x) > 5) {
                    bubble.userData.velocity.x *= -1;
                }
                if (Math.abs(bubble.position.z) > 2) {
                    bubble.userData.velocity.z *= -1;
                }
                
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

        // 정리 함수
        window.ctaCleanup = () => {
            window.removeEventListener('resize', handleResize);
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
            bubbleGeometry.dispose();
            bubbleMaterial.dispose();
        };

    } catch (error) {
        console.warn('Failed to initialize CTA Three.js background:', error);
    }
}

// 메인 순위 페이지 클래스
class RankingPage {
    constructor() {
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
        // 통계 수치 카운트업 애니메이션
        setTimeout(() => {
            animateStatNumbers();
        }, 300);
        
        // 순위 패널 렌더링
        this.renderRankingPanel();
        
        // Three.js CTA 배경 초기화
        initializeCTABackground();
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
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

        // 페이지 언로드시 Three.js 리소스 정리
        window.addEventListener('beforeunload', () => {
            if (window.ctaCleanup) {
                window.ctaCleanup();
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
                        <div class="points">0건</div>
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
        
        // 순위 점수 카운트업 애니메이션
        setTimeout(() => {
            const rankingItems = document.querySelectorAll('.ranking-item');
            rankingItems.forEach((item, index) => {
                const pointsElement = item.querySelector('.points');
                const targetValue = data[index].points;
                
                if (pointsElement && targetValue) {
                    let currentValue = 0;
                    const increment = targetValue / 60;
                    const stepTime = 1500 / 60;
                    
                    const counter = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= targetValue) {
                            currentValue = targetValue;
                            clearInterval(counter);
                        }
                        pointsElement.textContent = `${Math.floor(currentValue)}건`;
                    }, stepTime);
                }
            });
        }, 500);
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