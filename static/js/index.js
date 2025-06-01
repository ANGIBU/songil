// static/js/index.js

// 안전한 라이브러리 접근
const safeReact = (() => {
    try {
        return typeof React !== 'undefined' ? React : null;
    } catch {
        return null;
    }
})();

const safeReactDOM = (() => {
    try {
        return typeof ReactDOM !== 'undefined' ? ReactDOM : null;
    } catch {
        return null;
    }
})();

const safeGSAP = (() => {
    try {
        return typeof gsap !== 'undefined' ? gsap : null;
    } catch {
        return null;
    }
})();

const safeTHREE = (() => {
    try {
        return typeof THREE !== 'undefined' ? THREE : null;
    } catch {
        return null;
    }
})();

// React 훅 안전한 접근
const { useState, useEffect, useCallback } = safeReact || {};

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

// 긴급 실종자 데이터 (8개)
const urgentMissingData = allMissingData.slice(0, 8);

// 통계 데이터
const statsData = [
    { label: "함께한 신고", value: 1847 },
    { label: "이루어진 상봉", value: 1203 },
    { label: "희망을 나눈 분들", value: 15429 },
    { label: "포기하지 않는 마음", value: 94, isPercent: true }
];

// Three.js 희망 효과 관리자
class HopeEffectManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.animationId = null;
        this.container = null;
        this.isDestroyed = false;
        this.isActive = false;
    }

    init(container) {
        if (!safeTHREE || this.isDestroyed || !container) {
            return false;
        }

        this.container = container;
        
        try {
            this.setupScene();
            this.createParticles();
            this.setupEventListeners();
            this.startAnimation();
            this.isActive = true;
            
            return true;
        } catch (error) {
            this.cleanup();
            return false;
        }
    }

    setupScene() {
        const rect = this.container.getBoundingClientRect();
        
        this.scene = new safeTHREE.Scene();
        this.camera = new safeTHREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000);
        this.camera.position.z = 10;
        
        this.renderer = new safeTHREE.WebGLRenderer({ 
            alpha: true,
            antialias: false,
            powerPreference: "low-power"
        });
        
        this.renderer.setSize(rect.width, rect.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.renderer.setClearColor(0x000000, 0);
        
        const canvas = this.renderer.domElement;
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.6;
        `;
        
        this.container.appendChild(canvas);
    }

    createParticles() {
        const particleCount = 80;
        const geometry = new safeTHREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = -12 + Math.random() * 4;
            positions[i3 + 2] = (Math.random() - 0.5) * 8;
            
            velocities[i3] = (Math.random() - 0.5) * 0.01;
            velocities[i3 + 1] = 0.005 + Math.random() * 0.01;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.008;
        }
        
        geometry.setAttribute('position', new safeTHREE.BufferAttribute(positions, 3));
        
        const material = new safeTHREE.PointsMaterial({
            color: 0xffd700,
            size: 0.3,
            transparent: true,
            opacity: 0.8,
            blending: safeTHREE.AdditiveBlending,
            sizeAttenuation: true,
            depthTest: false,
            depthWrite: false
        });
        
        const particles = new safeTHREE.Points(geometry, material);
        this.scene.add(particles);
        this.particles.push({ mesh: particles, velocities });
        
        const ambientLight = new safeTHREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);
    }

    setupEventListeners() {
        this.resizeHandler = () => {
            if (!this.container || this.isDestroyed) return;
            
            try {
                const rect = this.container.getBoundingClientRect();
                this.camera.aspect = rect.width / rect.height;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(rect.width, rect.height);
            } catch (error) {
                // 조용히 처리
            }
        };
        
        window.addEventListener('resize', this.resizeHandler);
    }

    startAnimation() {
        if (this.isDestroyed) return;
        
        const animate = () => {
            if (this.isDestroyed) return;
            
            this.animationId = requestAnimationFrame(animate);
            this.updateParticles();
            
            try {
                this.renderer.render(this.scene, this.camera);
            } catch (error) {
                this.cleanup();
            }
        };
        
        animate();
    }

    updateParticles() {
        this.particles.forEach(({ mesh, velocities }) => {
            const positions = mesh.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];
                
                if (positions[i + 1] > 12) {
                    positions[i] = (Math.random() - 0.5) * 20;
                    positions[i + 1] = -12;
                    positions[i + 2] = (Math.random() - 0.5) * 8;
                }
                
                if (positions[i] > 12) positions[i] = -12;
                if (positions[i] < -12) positions[i] = 12;
            }
            
            mesh.geometry.attributes.position.needsUpdate = true;
        });
    }

    cleanup() {
        this.isDestroyed = true;
        this.isActive = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
            this.resizeHandler = null;
        }
        
        if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
        
        this.scene = null;
        this.camera = null;
        this.particles = [];
        this.container = null;
    }

    destroy() {
        this.cleanup();
    }
}

// GSAP 애니메이션 관리자 클래스
class GSAPAnimationManager {
    constructor() {
        this.isDestroyed = false;
        this.timelines = [];
        this.isGSAPReady = false;
        this.hopeEffect = null;
        this.initGSAP();
    }

    initGSAP() {
        if (!safeGSAP) {
            return false;
        }

        try {
            safeGSAP.defaults({
                ease: "power2.out",
                duration: 0.6
            });

            this.isGSAPReady = true;
            return true;
        } catch (error) {
            return false;
        }
    }

    prepareAnimationElements() {
        if (!this.isGSAPReady) {
            return;
        }

        try {
            document.body.classList.add('gsap-animation-ready');
            
            const elementsToAnimate = [
                { selector: '.hero-title', class: 'gsap-slide-up' },
                { selector: '.hero-description', class: 'gsap-slide-up' },
                { selector: '.hero-buttons', class: 'gsap-slide-up' },
                { selector: '.ranking-display', class: 'gsap-slide-left' },
                { selector: '.urgent-section .section-header', class: 'gsap-fade-in' },
                { selector: '.urgent-section .missing-card', class: 'gsap-stagger-item' },
                { selector: '.intro-section h2', class: 'gsap-fade-in' },
                { selector: '.step', class: 'gsap-stagger-item' },
                { selector: '.stats-section h2', class: 'gsap-fade-in' },
                { selector: '.hope-message', class: 'gsap-fade-in' },
                { selector: '.stat-item', class: 'gsap-stagger-item' }
            ];

            elementsToAnimate.forEach(config => {
                const elements = document.querySelectorAll(config.selector);
                elements.forEach(el => {
                    if (el) {
                        el.classList.add(config.class);
                    }
                });
            });
        } catch (error) {
            // 조용히 처리
        }
    }

    initializeHopeEffect() {
        if (!safeTHREE) {
            return;
        }

        try {
            const statsSection = document.querySelector('.stats-section');
            if (!statsSection) {
                return;
            }

            statsSection.style.position = 'relative';
            statsSection.style.overflow = 'hidden';

            this.hopeEffect = new HopeEffectManager();
            const success = this.hopeEffect.init(statsSection);
            
            if (!success) {
                this.hopeEffect = null;
            }
        } catch (error) {
            this.hopeEffect = null;
        }
    }

    createMasterTimeline() {
        if (!this.isGSAPReady) return null;

        try {
            const masterTL = safeGSAP.timeline({ paused: true });

            // 히어로 섹션
            masterTL.to('.hero-title', {
                opacity: 1,
                y: 0,
                visibility: 'visible',
                duration: 0.6,
                ease: "power3.out"
            }, 0)
            .to('.hero-description', {
                opacity: 1,
                y: 0,
                visibility: 'visible',
                duration: 0.5,
                ease: "power2.out"
            }, 0.15)
            .to('.hero-buttons', {
                opacity: 1,
                y: 0,
                visibility: 'visible',
                duration: 0.5,
                ease: "power2.out"
            }, 0.3)
            .to('.ranking-display', {
                opacity: 1,
                x: 0,
                visibility: 'visible',
                duration: 0.6,
                ease: "power2.out"
            }, 0.25);

            // 긴급 실종자 섹션
            masterTL.to('.urgent-section .section-header', {
                opacity: 1,
                visibility: 'visible',
                duration: 0.5,
                ease: "power2.out"
            }, 0.6);

            const urgentCards = document.querySelectorAll('.urgent-section .missing-card');
            if (urgentCards.length > 0) {
                masterTL.to(urgentCards, {
                    opacity: 1,
                    y: 0,
                    visibility: 'visible',
                    duration: 0.4,
                    stagger: 0.06,
                    ease: "power2.out"
                }, 0.8);
            }

            // 소개 섹션
            masterTL.to('.intro-section h2', {
                opacity: 1,
                visibility: 'visible',
                duration: 0.5,
                ease: "power2.out"
            }, 1.2);

            const steps = document.querySelectorAll('.step');
            if (steps.length > 0) {
                masterTL.to(steps, {
                    opacity: 1,
                    y: 0,
                    visibility: 'visible',
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "power2.out"
                }, 1.4);
            }

            // 통계 섹션
            masterTL.to('.stats-section h2', {
                opacity: 1,
                visibility: 'visible',
                duration: 0.5,
                ease: "power2.out"
            }, 1.8)
            .to('.hope-message', {
                opacity: 1,
                visibility: 'visible',
                duration: 0.5,
                ease: "power2.out"
            }, 2.0);

            const statItems = document.querySelectorAll('.stat-item');
            if (statItems.length > 0) {
                masterTL.to(statItems, {
                    opacity: 1,
                    y: 0,
                    visibility: 'visible',
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "power2.out"
                }, 2.2);
            }

            this.timelines.push(masterTL);
            return masterTL;
        } catch (error) {
            return null;
        }
    }

    createFloatingAnimation() {
        if (!this.isGSAPReady) {
            return;
        }

        try {
            const statItems = document.querySelectorAll('.stat-item');
            
            if (statItems.length === 0) {
                return;
            }

            statItems.forEach((item, index) => {
                const floatingTL = safeGSAP.timeline({ repeat: -1, yoyo: true });
                
                const baseDelay = index * 0.3;
                const yMovement = 8 + Math.random() * 6;
                const xMovement = 4 + Math.random() * 4;
                const duration = 2.5 + Math.random() * 1.5;
                
                floatingTL
                    .to(item, {
                        y: yMovement,
                        x: xMovement * (Math.random() > 0.5 ? 1 : -1),
                        rotation: (Math.random() - 0.5) * 2,
                        duration: duration,
                        ease: "sine.inOut"
                    }, baseDelay)
                    .to(item, {
                        y: -yMovement * 0.7,
                        x: xMovement * 0.6 * (Math.random() > 0.5 ? 1 : -1),
                        rotation: (Math.random() - 0.5) * 1.5,
                        duration: duration * 0.8,
                        ease: "sine.inOut"
                    })
                    .to(item, {
                        y: 0,
                        x: 0,
                        rotation: 0,
                        duration: duration * 0.6,
                        ease: "sine.inOut"
                    });

                this.timelines.push(floatingTL);
            });
        } catch (error) {
            // 조용히 처리
        }
    }

    startMainAnimation() {
        if (!this.isGSAPReady) {
            setTimeout(() => {
                this.initializeHopeEffect();
            }, 2000);
            return;
        }

        try {
            const masterAnimation = this.createMasterTimeline();
            if (masterAnimation) {
                masterAnimation.play();
                
                setTimeout(() => {
                    this.createFloatingAnimation();
                }, 3000);
                
                setTimeout(() => {
                    if (document.querySelectorAll('.stat-item').length > 0) {
                        this.createFloatingAnimation();
                    }
                }, 5000);
            }

            setTimeout(() => {
                this.initializeHopeEffect();
            }, 200);
        } catch (error) {
            setTimeout(() => {
                this.initializeHopeEffect();
            }, 2000);
        }
    }

    destroy() {
        this.isDestroyed = true;

        if (this.hopeEffect) {
            this.hopeEffect.destroy();
            this.hopeEffect = null;
        }

        this.timelines.forEach(tl => {
            if (tl && tl.kill) {
                try {
                    tl.kill();
                } catch (error) {
                    // 조용히 처리
                }
            }
        });
        this.timelines = [];
    }
}

// HTML 기반 폴백 렌더링 함수들
function renderRankingFallback() {
    try {
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
    } catch (error) {
        // 조용히 처리
    }
}

function renderUrgentCardsFallback() {
    try {
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
    } catch (error) {
        // 조용히 처리
    }
}

// React 컴포넌트들 - 안전한 버전
const RankingDisplay = safeReact ? safeReact.memo(function RankingDisplay({ rankings }) {
    if (!rankings || !Array.isArray(rankings)) {
        return null;
    }

    try {
        return safeReact.createElement('div', { style: { display: 'contents' } },
            rankings.map((rank, index) => {
                if (!rank || typeof rank.rank === 'undefined') {
                    return null;
                }

                return safeReact.createElement('div', {
                    key: `ranking-${rank.rank}`,
                    className: 'ranking-item'
                }, [
                    safeReact.createElement('div', {
                        className: 'ranking-position',
                        key: 'position'
                    }, rank.rank),
                    safeReact.createElement('div', {
                        className: 'ranking-info',
                        key: 'info'
                    }, [
                        safeReact.createElement('div', {
                            className: 'ranking-left',
                            key: 'left'
                        }, [
                            safeReact.createElement('div', {
                                className: 'ranking-name',
                                key: 'name'
                            }, rank.name || '알 수 없음'),
                            safeReact.createElement('div', {
                                className: 'ranking-points',
                                key: 'points'
                            }, [
                                safeReact.createElement('i', {
                                    className: 'fas fa-coins',
                                    key: 'icon'
                                }),
                                `${(rank.points || 0).toLocaleString()}P`
                            ])
                        ]),
                        safeReact.createElement('div', {
                            className: 'ranking-stats',
                            key: 'stats'
                        }, [
                            safeReact.createElement('span', {
                                className: 'stats-text',
                                key: 'stats-text'
                            }, [
                                safeReact.createElement('span', {
                                    className: 'stat-reports',
                                    key: 'reports-text'
                                }, `제보 ${rank.reports || 0}건`),
                                safeReact.createElement('span', {
                                    className: 'stats-separator',
                                    key: 'separator'
                                }, ' / '),
                                safeReact.createElement('span', {
                                    className: 'stat-witnesses',
                                    key: 'witnesses-text'
                                }, `해결 ${rank.witnesses || 0}건`)
                            ])
                        ])
                    ])
                ]);
            }).filter(Boolean)
        );
    } catch (error) {
        return null;
    }
}) : null;

const MissingCard = safeReact ? safeReact.memo(function MissingCard({ data, onUpClick }) {
    if (!data || !data.id) {
        return null;
    }

    try {
        const [upCount, setUpCount] = useState(data.upCount || 0);

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

        const handleImageError = useCallback((e) => {
            e.target.src = '/static/images/placeholder.jpg';
        }, []);

        return safeReact.createElement('div', {
            className: 'missing-card urgent',
            'data-id': data.id
        }, [
            safeReact.createElement('div', { className: 'card-image', key: 'image' }, [
                safeReact.createElement('img', {
                    src: data.image || '/static/images/placeholder.jpg',
                    alt: '실종자 사진',
                    onError: handleImageError,
                    key: 'img'
                }),
                safeReact.createElement('div', {
                    className: `danger-level ${data.dangerLevel || 'low'}`,
                    key: 'danger'
                }, getDangerLevelText(data.dangerLevel))
            ]),
            safeReact.createElement('div', { className: 'card-content', key: 'content' }, [
                safeReact.createElement('h3', { key: 'title' }, `${data.name || '미상'} (${data.age || '?'}세)`),
                safeReact.createElement('div', { className: 'missing-info', key: 'info' }, [
                    safeReact.createElement('p', { key: 'date' }, [
                        safeReact.createElement('i', { className: 'fas fa-calendar', key: 'date-icon' }),
                        ` ${formatDate(data.date)} 실종`
                    ]),
                    safeReact.createElement('p', { key: 'location' }, [
                        safeReact.createElement('i', { className: 'fas fa-map-marker-alt', key: 'location-icon' }),
                        ` ${data.location || '위치 미상'}`
                    ]),
                    safeReact.createElement('p', { key: 'description' }, [
                        safeReact.createElement('i', { className: 'fas fa-tshirt', key: 'desc-icon' }),
                        ` ${data.description || '설명 없음'}`
                    ])
                ]),
                safeReact.createElement('div', { className: 'card-actions', key: 'actions' }, [
                    safeReact.createElement('button', {
                        className: 'up-btn',
                        onClick: handleUpClick,
                        key: 'up-btn'
                    }, [
                        safeReact.createElement('i', { className: 'fas fa-arrow-up', key: 'up-icon' }),
                        safeReact.createElement('span', { key: 'count' }, upCount)
                    ]),
                    safeReact.createElement('a', {
                        href: `/missing/${data.id}`,
                        className: 'detail-btn',
                        key: 'detail-btn'
                    }, [
                        safeReact.createElement('i', { className: 'fas fa-eye', key: 'detail-icon' }),
                        '상세보기'
                    ])
                ])
            ])
        ]);
    } catch (error) {
        return null;
    }
}) : null;

// 통합 홈페이지 관리 클래스
class EnhancedIndexPage {
    constructor() {
        this.isDestroyed = false;
        this.renderAttempts = 0;
        this.maxRenderAttempts = 2;
        this.animationManager = null;
        this.eventCleanup = null;
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
        
        try {
            this.animationManager = new GSAPAnimationManager();
            this.animationManager.prepareAnimationElements();
            
            this.renderFallbackContent();
            
            setTimeout(() => {
                this.attemptReactRender();
            }, 100);
            
            this.setupEventListeners();
            
            setTimeout(() => {
                this.animationManager.initializeHopeEffect();
            }, 200);
            
            setTimeout(() => {
                this.animationManager.startMainAnimation();
            }, 100);
        } catch (error) {
            this.fallbackInit();
        }
    }

    fallbackInit() {
        try {
            this.renderFallbackContent();
            this.setupEventListeners();
        } catch (error) {
            // 최후의 조용한 처리
        }
    }

    renderFallbackContent() {
        try {
            renderRankingFallback();
            renderUrgentCardsFallback();
        } catch (error) {
            // 조용히 처리
        }
    }

    attemptReactRender() {
        if (this.renderAttempts >= this.maxRenderAttempts) {
            return;
        }

        this.renderAttempts++;
        
        try {
            if (!safeReact || !safeReactDOM) {
                if (this.renderAttempts < this.maxRenderAttempts) {
                    setTimeout(() => this.attemptReactRender(), 1000);
                }
                return;
            }

            this.renderReactComponents();
        } catch (error) {
            if (this.renderAttempts < this.maxRenderAttempts) {
                setTimeout(() => this.attemptReactRender(), 1000);
            }
        }
    }

    renderReactComponents() {
        try {
            this.renderRankings();
            this.renderUrgentCards();
        } catch (error) {
            // 조용히 처리
        }
    }

    renderRankings() {
        try {
            const rankingContainer = document.getElementById('topRankings');
            if (!rankingContainer || !RankingDisplay || !safeReactDOM) return;

            const root = safeReactDOM.createRoot(rankingContainer);
            root.render(
                safeReact.createElement(RankingDisplay, {
                    rankings: rankingData
                })
            );
        } catch (error) {
            renderRankingFallback();
        }
    }

    renderUrgentCards() {
        try {
            const urgentContainer = document.querySelector('.urgent-cards');
            if (!urgentContainer || !MissingCard || !safeReactDOM) return;

            const handleUpClick = (cardId) => {
                if (this.isDestroyed) return;
                
                if (window.showNotification) {
                    window.showNotification('소중한 참여에 감사합니다! 함께라면 찾을 수 있어요.', 'success');
                }
            };

            const root = safeReactDOM.createRoot(urgentContainer);
            root.render(
                safeReact.createElement(safeReact.Fragment, null,
                    urgentMissingData.map(data =>
                        safeReact.createElement(MissingCard, {
                            key: `missing-card-${data.id}`,
                            data: data,
                            onUpClick: handleUpClick
                        })
                    )
                )
            );
            urgentContainer.setAttribute('data-react-rendered', 'true');
        } catch (error) {
            renderUrgentCardsFallback();
        }
    }

    setupEventListeners() {
        if (this.isDestroyed) return;
        
        try {
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
        } catch (error) {
            // 조용히 처리
        }
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
    }
}

// 전역 UP 버튼 핸들러
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
        // 조용히 처리
    }
}

// 초기화
let indexPage = null;

try {
    indexPage = new EnhancedIndexPage();
} catch (error) {
    document.addEventListener('DOMContentLoaded', () => {
        try {
            renderRankingFallback();
            renderUrgentCardsFallback();
            
            if (safeTHREE) {
                try {
                    const statsSection = document.querySelector('.stats-section');
                    if (statsSection) {
                        const hopeEffect = new HopeEffectManager();
                        setTimeout(() => {
                            hopeEffect.init(statsSection);
                        }, 2000);
                    }
                } catch (effectError) {
                    // 조용히 처리
                }
            }
        } catch (finalError) {
            // 최종적으로 조용히 처리
        }
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