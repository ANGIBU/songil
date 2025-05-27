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
            height: '300px',
            opacity: 1,
            transform: 'translateY(0)'
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

// 개선된 파도 효과 Three.js 클래스 - 메모리 누수 방지
class WaveEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.waves = [];
        this.time = 0;
        this.isDestroyed = false;
        this.animationId = null;
        
        this.init();
    }

    init() {
        if (typeof THREE === 'undefined' || !this.canvas || this.isDestroyed) {
            return;
        }

        try {
            this.setupScene();
            this.createWaves();
            this.animate();
        } catch (error) {
            console.warn('Three.js initialization failed:', error);
            this.destroy();
        }
    }

    setupScene() {
        // Scene 설정
        this.scene = new THREE.Scene();
        
        // Camera 설정 
        this.camera = new THREE.OrthographicCamera(
            -window.innerWidth / 2, window.innerWidth / 2,
            window.innerHeight / 2, -window.innerHeight / 2,
            1, 1000
        );
        this.camera.position.z = 100;
        
        // Renderer 설정
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
    }

    createWaves() {
        // 여러 개의 곡선 파도 생성
        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.BufferGeometry();
            const vertices = [];
            const waveWidth = window.innerWidth + 200;
            const segments = 150;
            
            // 곡선 파도 정점 생성
            for (let j = 0; j <= segments; j++) {
                const x = (j / segments) * waveWidth - waveWidth / 2;
                vertices.push(x, 0, 0);
            }
            
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            
            // 파도별 고유 설정
            const waveSettings = {
                amplitude: 20 + Math.random() * 30,
                frequency: 0.01 + Math.random() * 0.02,
                speed: 0.5 + Math.random() * 1.5,
                phase: Math.random() * Math.PI * 2,
                opacity: 0.15 + Math.random() * 0.25,
                yOffset: (Math.random() - 0.5) * window.innerHeight * 0.8
            };
            
            // 재질 생성
            const material = new THREE.LineBasicMaterial({
                color: new THREE.Color().setHSL(0, 0, 0.9 + Math.random() * 0.1),
                transparent: true,
                opacity: waveSettings.opacity,
                linewidth: 2
            });
            
            const wave = new THREE.Line(geometry, material);
            wave.position.y = waveSettings.yOffset;
            wave.userData = waveSettings;
            
            this.scene.add(wave);
            this.waves.push(wave);
        }
    }

    updateWaves() {
        this.time += 0.016; // ~60fps
        
        this.waves.forEach((wave, index) => {
            if (!wave || !wave.userData) return;
            
            const settings = wave.userData;
            const positions = wave.geometry.attributes.position.array;
            
            // 각 정점의 Y 좌표를 곡선 파도로 업데이트
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const baseWave = Math.sin(x * settings.frequency + this.time * settings.speed + settings.phase);
                const harmonicWave = Math.sin(x * settings.frequency * 2 + this.time * settings.speed * 1.3 + settings.phase) * 0.3;
                const complexWave = Math.sin(x * settings.frequency * 0.5 + this.time * settings.speed * 0.7 + settings.phase) * 0.5;
                
                positions[i + 1] = (baseWave + harmonicWave + complexWave) * settings.amplitude;
            }
            
            wave.geometry.attributes.position.needsUpdate = true;
            
            // 파도 이동 (선택적)
            wave.position.x += Math.sin(this.time * 0.1 + index) * 0.5;
            
            // 투명도 변화
            const opacityVariation = Math.sin(this.time * 0.8 + index * 0.5) * 0.1;
            wave.material.opacity = settings.opacity + opacityVariation;
        });
    }

    animate() {
        if (this.isDestroyed) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        try {
            this.updateWaves();
            
            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        } catch (error) {
            console.warn('Wave animation error:', error);
            this.destroy();
        }
    }

    onWindowResize() {
        if (!this.renderer || !this.camera || this.isDestroyed) return;
        
        try {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            this.camera.left = -width / 2;
            this.camera.right = width / 2;
            this.camera.top = height / 2;
            this.camera.bottom = -height / 2;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(width, height);
        } catch (error) {
            console.warn('Wave resize error:', error);
        }
    }

    destroy() {
        this.isDestroyed = true;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // 웨이브 정리
        this.waves.forEach(wave => {
            if (wave && wave.geometry) {
                wave.geometry.dispose();
            }
            if (wave && wave.material) {
                wave.material.dispose();
            }
        });
        this.waves = [];
        
        // 렌더러 정리
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
        
        this.scene = null;
        this.camera = null;
    }
}

// GSAP 애니메이션 관리자 (버그 수정 및 개선)
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
        
        // clearProps를 신중하게 적용 - 레이아웃 유지
        gsap.set('.hero-title, .hero-description, .hero-buttons, .ranking-display', {
            clearProps: 'transform,opacity',
            opacity: 1,
            transform: 'translateY(0)'
        });
    }

    setupAnimations() {
        // 히어로 섹션 애니메이션 - 요소가 사라지지 않도록 수정
        this.timeline = gsap.timeline({ 
            delay: 0.5,
            onComplete: () => {
                // 애니메이션 완료 후 모든 요소의 스타일 고정
                gsap.set('.hero-title, .hero-description, .hero-buttons, .ranking-display', {
                    clearProps: 'all',
                    opacity: 1,
                    transform: 'none'
                });
            }
        });
        
        this.timeline
            .fromTo('.hero-title', {
                y: 80,
                opacity: 0
            }, {
                duration: 1.2,
                y: 0,
                opacity: 1,
                ease: 'power3.out'
            })
            .fromTo('.hero-description', {
                y: 40,
                opacity: 0
            }, {
                duration: 1,
                y: 0,
                opacity: 1,
                ease: 'power2.out'
            }, '-=0.6')
            .fromTo('.hero-buttons .btn', {
                y: 30,
                opacity: 0
            }, {
                duration: 0.8,
                y: 0,
                opacity: 1,
                stagger: 0.2,
                ease: 'power2.out'
            }, '-=0.4')
            .fromTo('.ranking-display', {
                x: 50,
                opacity: 0
            }, {
                duration: 1.2,
                x: 0,
                opacity: 1,
                ease: 'power2.out'
            }, '-=0.8')
            .fromTo('.ranking-item', {
                y: 20,
                opacity: 0
            }, {
                duration: 0.6,
                y: 0,
                opacity: 1,
                stagger: 0.1,
                ease: 'power2.out'
            }, '-=0.4');

        // ScrollTrigger 애니메이션들 - 타이밍 개선
        if (typeof ScrollTrigger !== 'undefined') {
            // 긴급 실종자 섹션 - 즉각 반응하도록 개선
            const urgentTrigger = ScrollTrigger.create({
                trigger: '.urgent-section',
                start: 'top 80%', // 더 일찍 트리거
                end: 'bottom 20%',
                onEnter: () => {
                    const cards = document.querySelectorAll('.urgent-cards .missing-card');
                    gsap.fromTo(cards, {
                        y: 60,
                        opacity: 0
                    }, {
                        duration: 0.8,
                        y: 0,
                        opacity: 1,
                        stagger: 0.15,
                        ease: 'power2.out',
                        onComplete: () => {
                            // 애니메이션 완료 후 스타일 고정
                            gsap.set(cards, {
                                clearProps: 'transform,opacity',
                                opacity: 1,
                                transform: 'translateY(0)'
                            });
                        }
                    });
                },
                once: true
            });
            this.scrollTriggers.push(urgentTrigger);

            // 소개 섹션 - 반응성 개선
            const introTrigger = ScrollTrigger.create({
                trigger: '.intro-section',
                start: 'top 85%', // 더 일찍 트리거
                end: 'bottom 15%',
                onEnter: () => {
                    const steps = document.querySelectorAll('.intro-steps .step');
                    gsap.fromTo(steps, {
                        y: 40,
                        opacity: 0
                    }, {
                        duration: 0.6,
                        y: 0,
                        opacity: 1,
                        stagger: 0.15,
                        ease: 'power2.out',
                        onComplete: () => {
                            gsap.set(steps, {
                                clearProps: 'transform,opacity',
                                opacity: 1,
                                transform: 'translateY(0)'
                            });
                        }
                    });
                },
                once: true
            });
            this.scrollTriggers.push(introTrigger);

            // 통계 섹션 - 안정적인 애니메이션
            const statsTrigger = ScrollTrigger.create({
                trigger: '.stats-section',
                start: 'top 85%',
                end: 'bottom 15%',
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
                        ease: 'back.out(1.7)',
                        onComplete: () => {
                            gsap.set(statItems, {
                                clearProps: 'transform,opacity',
                                opacity: 1,
                                transform: 'scale(1)'
                            });
                        }
                    });
                },
                once: true
            });
            this.scrollTriggers.push(statsTrigger);
        }

        this.setupBackgroundAnimations();
    }

    setupBackgroundAnimations() {
        this.createFloatingParticles('.hero-section', 6);
    }

    createFloatingParticles(containerSelector, count) {
        const container = document.querySelector(containerSelector);
        if (!container || this.isDestroyed) return;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${3 + Math.random() * 8}px;
                height: ${3 + Math.random() * 8}px;
                background: linear-gradient(45deg, 
                    rgba(59, 130, 246, 0.3), 
                    rgba(96, 165, 250, 0.2));
                border-radius: 50%;
                pointer-events: none;
                z-index: 0;
                will-change: transform, opacity;
            `;
            
            container.appendChild(particle);
            
            gsap.set(particle, {
                x: Math.random() * container.offsetWidth,
                y: Math.random() * container.offsetHeight,
                scale: Math.random() * 0.5 + 0.5
            });
            
            gsap.to(particle, {
                y: '-=100',
                x: `+=${Math.random() * 200 - 100}`,
                rotation: Math.random() * 360,
                duration: 10 + Math.random() * 10,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: Math.random() * 5
            });
            
            gsap.to(particle, {
                opacity: Math.random() * 0.5 + 0.3,
                duration: 3 + Math.random() * 3,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: Math.random() * 3
            });
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
                ease: 'elastic.out(2, 0.3)',
                onComplete: () => {
                    gsap.set(button, { clearProps: 'transform' });
                }
            });
            
        const countElement = button.querySelector('span');
        if (countElement) {
            gsap.fromTo(countElement, 
                { scale: 1.5 },
                {
                    scale: 1,
                    duration: 0.3,
                    ease: 'back.out(1.7)',
                    onComplete: () => {
                        gsap.set(countElement, { clearProps: 'transform' });
                    }
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

// Intersection Observer를 활용한 스크롤 트리거 - 개선된 버전
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

// 메인 홈페이지 관리 클래스 - 완전히 개선된 버전
class IndexPage {
    constructor() {
        this.waveEffect = null;
        this.animations = null;
        this.scrollObserver = null;
        this.isDestroyed = false;
        this.eventCleanup = null;
        this.resizeTimeout = null;
        this.init();
    }

    init() {
        if (this.isDestroyed) return;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        if (this.isDestroyed) return;
        
        try {
            // React 컴포넌트 렌더링
            this.renderRankings();
            this.renderUrgentCards();
            
            // 시각화 초기화 - 안전한 지연
            setTimeout(() => {
                if (!this.isDestroyed) {
                    this.initWaveEffect();
                }
            }, 100);
            
            // 애니메이션 초기화 - 안전한 지연
            setTimeout(() => {
                if (!this.isDestroyed) {
                    this.animations = new IndexAnimations();
                    this.scrollObserver = new ScrollObserver();
                }
            }, 300);
            
            this.setupEventListeners();
            
            console.log('Index page initialized successfully');
        } catch (error) {
            console.error('Index page setup error:', error);
        }
    }

    // 순위 렌더링 - 에러 핸들링 강화
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

    // React 컴포넌트 렌더링 - 안정성 대폭 강화
    renderUrgentCards() {
        const urgentContainer = document.querySelector('.urgent-cards');
        if (!urgentContainer || typeof React === 'undefined' || this.isDestroyed) {
            console.warn('React not available or container not found');
            return;
        }

        const handleUpClick = (cardId) => {
            if (this.isDestroyed) return;
            
            console.log(`UP clicked for card ${cardId}`);
            
            const button = document.querySelector(`[data-id="${cardId}"] .up-btn`);
            if (button && this.animations && !this.isDestroyed) {
                this.animations.animateUpButton(button);
            }
            
            if (window.showNotification) {
                window.showNotification('소중한 참여에 감사합니다! 함께라면 찾을 수 있어요.', 'success');
            }
        };

        // 컨테이너 강제 스타일 설정 - 버그 수정
        urgentContainer.style.display = 'grid';
        urgentContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
        urgentContainer.style.gridTemplateRows = 'repeat(2, minmax(300px, auto))';
        urgentContainer.style.gap = '25px';
        urgentContainer.style.width = '100%';
        urgentContainer.style.maxWidth = '1200px';
        urgentContainer.style.margin = '0 auto';
        urgentContainer.style.opacity = '1';
        urgentContainer.style.transform = 'translateY(0)';

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
            
            // 렌더링 후 안정성 확보
            setTimeout(() => {
                if (this.isDestroyed) return;
                
                urgentContainer.style.display = 'grid';
                urgentContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
                urgentContainer.style.gridTemplateRows = 'repeat(2, minmax(300px, auto))';
                urgentContainer.style.gap = '25px';
                urgentContainer.style.opacity = '1';
                urgentContainer.style.transform = 'translateY(0)';
                
                // 각 카드 안정성 확보
                const cards = urgentContainer.querySelectorAll('.missing-card');
                cards.forEach((card, index) => {
                    if (index < 8) {
                        card.style.display = 'block';
                        card.style.width = '100%';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }, 50);
            
        } catch (error) {
            console.error('React rendering failed:', error);
        }
    }

    initWaveEffect() {
        if (this.isDestroyed) return;
        
        const waveCanvas = document.getElementById('waveCanvas');
        if (waveCanvas && !this.isDestroyed) {
            this.waveEffect = new WaveEffect(waveCanvas);
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
                
                // 리사이즈 시 그리드 레이아웃 재적용
                const urgentContainer = document.querySelector('.urgent-cards');
                if (urgentContainer) {
                    urgentContainer.style.display = 'grid';
                    urgentContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
                    urgentContainer.style.gridTemplateRows = 'repeat(2, minmax(300px, auto))';
                    urgentContainer.style.gap = '25px';
                    urgentContainer.style.opacity = '1';
                    urgentContainer.style.transform = 'translateY(0)';
                }
            }, 250);
        };
        
        window.addEventListener('resize', resizeHandler);

        const clickHandler = (e) => {
            if (this.isDestroyed) return;
            
            if (e.target.closest('.up-btn')) {
                const button = e.target.closest('.up-btn');
                const card = button.closest('.missing-card');
                
                if (card && this.animations && !this.isDestroyed) {
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        indexPage = new IndexPage();
    });
} else {
    indexPage = new IndexPage();
}

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    if (indexPage) {
        indexPage.destroy();
        indexPage = null;
    }
});

// Visibility API를 사용한 탭 전환 시 최적화
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 페이지가 숨겨질 때 애니메이션 일시 정지
        if (indexPage && indexPage.waveEffect) {
            indexPage.waveEffect.isDestroyed = true;
        }
    } else {
        // 페이지가 다시 보일 때 애니메이션 재개
        if (indexPage && indexPage.waveEffect) {
            indexPage.waveEffect.isDestroyed = false;
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

// 개발자 도구 - 메모리 누수 방지
if (typeof window !== 'undefined') {
    window.indexPageDebug = {
        get instance() { return indexPage; },
        testAnimations: () => {
            if (typeof gsap !== 'undefined' && indexPage && !indexPage.isDestroyed) {
                gsap.to('.missing-card', {
                    duration: 0.5,
                    scale: 1.05,
                    stagger: 0.1,
                    yoyo: true,
                    repeat: 1,
                    onComplete: () => {
                        gsap.set('.missing-card', { clearProps: 'transform' });
                    }
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