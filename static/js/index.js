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

// 자연스러운 흐르는 3D 배경 효과 클래스 - 마우스 반응 제거
class FlowingBackground3D {
    constructor(canvas, container) {
        this.canvas = canvas;
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.geometries = [];
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
            this.createObjects();
            this.animate();
        } catch (error) {
            console.warn('Flowing 3D Background initialization failed:', error);
            this.destroy();
        }
    }

    setupScene() {
        // Scene 설정
        this.scene = new THREE.Scene();
        
        // Camera 설정 - 더 넓은 시야
        const aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        this.camera.position.set(0, 20, 60);
        this.camera.lookAt(0, 0, 0);
        
        // Renderer 설정
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // 부드러운 환경광
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // 주 방향광
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(30, 50, 20);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // 색상이 있는 포인트 라이트들 - 물결처럼 움직일 예정
        this.pointLight1 = new THREE.PointLight(0x22c55e, 0.8, 80);
        this.pointLight1.position.set(-40, 15, 20);
        this.scene.add(this.pointLight1);

        this.pointLight2 = new THREE.PointLight(0xf97316, 0.8, 80);
        this.pointLight2.position.set(40, 15, 20);
        this.scene.add(this.pointLight2);

        this.pointLight3 = new THREE.PointLight(0x3b82f6, 0.6, 60);
        this.pointLight3.position.set(0, 30, -20);
        this.scene.add(this.pointLight3);
    }

    createObjects() {
        this.createFlowingGeometries();
        this.createStreamingParticles();
        this.createWavyConnections();
    }

    createFlowingGeometries() {
        // 다양한 기하학적 형태 생성 - 물결처럼 흐르도록
        const geometryTypes = [
            new THREE.SphereGeometry(1.5, 12, 12),
            new THREE.BoxGeometry(2.5, 2.5, 2.5),
            new THREE.ConeGeometry(1.5, 3, 6),
            new THREE.TetrahedronGeometry(2),
            new THREE.OctahedronGeometry(1.8),
            new THREE.IcosahedronGeometry(1.6)
        ];

        for (let i = 0; i < 20; i++) {
            const geometry = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];
            
            // 투명하고 부드러운 재질
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(
                    Math.random() * 0.15 + (i % 3 === 0 ? 0.1 : i % 3 === 1 ? 0.55 : 0.2), 
                    0.6,
                    0.7
                ),
                shininess: 80,
                transparent: true,
                opacity: 0.6
            });

            const mesh = new THREE.Mesh(geometry, material);
            
            // 넓은 범위에 배치
            mesh.position.set(
                (Math.random() - 0.5) * 120,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 80
            );
            
            // 물결 흐름을 위한 사용자 정의 속성
            mesh.userData = {
                initialPosition: mesh.position.clone(),
                flowSpeed: Math.random() * 0.008 + 0.005, // 더 부드러운 속도
                flowAmplitude: {
                    x: Math.random() * 15 + 8,
                    y: Math.random() * 10 + 5,
                    z: Math.random() * 12 + 6
                },
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.008,
                    y: (Math.random() - 0.5) * 0.008,
                    z: (Math.random() - 0.5) * 0.008
                },
                phaseOffset: Math.random() * Math.PI * 2,
                scaleWave: Math.random() * 0.3 + 0.8
            };
            
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            this.scene.add(mesh);
            this.geometries.push(mesh);
        }
    }

    createStreamingParticles() {
        // 흐르는 파티클 시스템
        const particleCount = 300;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        this.particleData = []; // 각 파티클의 흐름 데이터

        for (let i = 0; i < particleCount; i++) {
            // 넓은 영역에 배치
            positions[i * 3] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

            // 부드러운 색상 그라데이션
            const colorPhase = Math.random();
            if (colorPhase < 0.33) {
                colors[i * 3] = 0.13 + Math.random() * 0.2; // R
                colors[i * 3 + 1] = 0.77 + Math.random() * 0.2; // G 
                colors[i * 3 + 2] = 0.37 + Math.random() * 0.3; // B
            } else if (colorPhase < 0.66) {
                colors[i * 3] = 1; // R
                colors[i * 3 + 1] = 0.45 + Math.random() * 0.3; // G
                colors[i * 3 + 2] = 0.1 + Math.random() * 0.2; // B
            } else {
                colors[i * 3] = 0.23 + Math.random() * 0.3; // R
                colors[i * 3 + 1] = 0.51 + Math.random() * 0.3; // G
                colors[i * 3 + 2] = 0.96; // B
            }

            sizes[i] = Math.random() * 2 + 0.5;

            // 흐름 데이터 저장
            this.particleData.push({
                originalX: positions[i * 3],
                originalY: positions[i * 3 + 1],
                originalZ: positions[i * 3 + 2],
                flowSpeed: Math.random() * 0.01 + 0.005,
                waveAmplitude: Math.random() * 20 + 10,
                phaseOffset: Math.random() * Math.PI * 2
            });
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleMaterial = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particles);
        this.particles.push(particles);
    }

    createWavyConnections() {
        // 웨이브 형태의 연결선들
        for (let i = 0; i < 8; i++) {
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-60 + i * 15, -20, -30),
                new THREE.Vector3(-30 + i * 10, 0, 0),
                new THREE.Vector3(0 + i * 8, 15, 20),
                new THREE.Vector3(30 + i * 12, 0, 40),
                new THREE.Vector3(60 + i * 10, -15, 10)
            ]);

            const tubeGeometry = new THREE.TubeGeometry(curve, 50, 0.3, 6, false);
            const tubeMaterial = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(Math.random() * 0.6, 0.7, 0.5),
                transparent: true,
                opacity: 0.4,
                shininess: 100
            });

            const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
            tube.userData = {
                rotationSpeed: (Math.random() - 0.5) * 0.005,
                floatSpeed: Math.random() * 0.003 + 0.002
            };

            this.scene.add(tube);
            this.geometries.push(tube);
        }
    }

    updateFlowingMotion() {
        this.time += 0.008; // 더 부드러운 시간 진행
        
        // 기하학적 객체들의 물결 움직임
        this.geometries.forEach((mesh, index) => {
            const userData = mesh.userData;
            
            if (userData.flowSpeed) {
                // 물결처럼 흐르는 움직임
                const waveX = Math.sin(this.time * userData.flowSpeed + userData.phaseOffset) * userData.flowAmplitude.x;
                const waveY = Math.sin(this.time * userData.flowSpeed * 1.3 + userData.phaseOffset + Math.PI / 3) * userData.flowAmplitude.y;
                const waveZ = Math.cos(this.time * userData.flowSpeed * 0.8 + userData.phaseOffset) * userData.flowAmplitude.z;
                
                mesh.position.x = userData.initialPosition.x + waveX;
                mesh.position.y = userData.initialPosition.y + waveY;
                mesh.position.z = userData.initialPosition.z + waveZ;
                
                // 부드러운 회전
                mesh.rotation.x += userData.rotationSpeed.x;
                mesh.rotation.y += userData.rotationSpeed.y;
                mesh.rotation.z += userData.rotationSpeed.z;
                
                // 부드러운 크기 변화
                const scaleWave = Math.sin(this.time * userData.flowSpeed * 2 + userData.phaseOffset) * 0.2 + 1;
                mesh.scale.setScalar(userData.scaleWave * scaleWave);
            }
        });

        // 파티클들의 흐르는 움직임
        this.particles.forEach(particle => {
            const positions = particle.geometry.attributes.position.array;
            
            for (let i = 0; i < this.particleData.length; i++) {
                const data = this.particleData[i];
                const i3 = i * 3;
                
                // 물결 모양으로 흐르는 움직임
                const flowWaveX = Math.sin(this.time * data.flowSpeed + data.phaseOffset) * data.waveAmplitude;
                const flowWaveY = Math.cos(this.time * data.flowSpeed * 1.2 + data.phaseOffset) * (data.waveAmplitude * 0.6);
                const flowWaveZ = Math.sin(this.time * data.flowSpeed * 0.9 + data.phaseOffset + Math.PI / 4) * (data.waveAmplitude * 0.8);
                
                positions[i3] = data.originalX + flowWaveX;
                positions[i3 + 1] = data.originalY + flowWaveY;
                positions[i3 + 2] = data.originalZ + flowWaveZ;
            }
            
            particle.geometry.attributes.position.needsUpdate = true;
        });

        // 조명들도 물결처럼 움직임
        if (this.pointLight1) {
            this.pointLight1.position.x = -40 + Math.sin(this.time * 0.5) * 20;
            this.pointLight1.position.y = 15 + Math.cos(this.time * 0.3) * 8;
            this.pointLight1.intensity = 0.6 + Math.sin(this.time * 0.4) * 0.3;
        }

        if (this.pointLight2) {
            this.pointLight2.position.x = 40 + Math.cos(this.time * 0.6) * 18;
            this.pointLight2.position.y = 15 + Math.sin(this.time * 0.4) * 10;
            this.pointLight2.intensity = 0.6 + Math.cos(this.time * 0.5) * 0.3;
        }

        if (this.pointLight3) {
            this.pointLight3.position.y = 30 + Math.sin(this.time * 0.7) * 12;
            this.pointLight3.position.z = -20 + Math.cos(this.time * 0.3) * 15;
            this.pointLight3.intensity = 0.4 + Math.sin(this.time * 0.6) * 0.2;
        }

        // 카메라도 부드럽게 흔들림
        this.camera.position.x = Math.sin(this.time * 0.1) * 5;
        this.camera.position.y = 20 + Math.cos(this.time * 0.08) * 3;
        this.camera.lookAt(0, 0, 0);
    }

    animate() {
        if (this.isDestroyed) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        try {
            this.updateFlowingMotion();
            
            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        } catch (error) {
            console.warn('Flowing 3D Background animation error:', error);
            this.destroy();
        }
    }

    onWindowResize() {
        if (!this.renderer || !this.camera || this.isDestroyed) return;
        
        try {
            const width = this.container.offsetWidth;
            const height = this.container.offsetHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(width, height);
        } catch (error) {
            console.warn('Flowing 3D Background resize error:', error);
        }
    }

    destroy() {
        this.isDestroyed = true;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // 객체들 정리
        this.geometries.forEach(mesh => {
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) mesh.material.dispose();
        });
        this.geometries = [];
        
        this.particles.forEach(particle => {
            if (particle.geometry) particle.geometry.dispose();
            if (particle.material) particle.material.dispose();
        });
        this.particles = [];
        
        // 렌더러 정리
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
        
        this.scene = null;
        this.camera = null;
        this.particleData = null;
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
        
        // 페이지 준비 상태에서만 스타일 정리
        if (document.body.classList.contains('page-ready')) {
            gsap.set('.hero-title, .hero-description, .hero-buttons, .ranking-display', {
                clearProps: 'transform,opacity',
                opacity: 1,
                visibility: 'visible',
                transform: 'translateY(0)'
            });
        }
    }

    setupAnimations() {
        // 페이지가 준비되지 않았다면 대기
        if (document.body.classList.contains('page-loading')) {
            setTimeout(() => this.setupAnimations(), 100);
            return;
        }

        // 히어로 섹션 애니메이션 - 안정적인 시작
        this.timeline = gsap.timeline({ 
            delay: 0.6, // 페이지 준비 후 충분한 지연
            onStart: () => {
                // 애니메이션 시작 전 요소들이 표시되도록 보장
                gsap.set('.hero-title, .hero-description, .hero-buttons, .ranking-display', {
                    opacity: 1,
                    visibility: 'visible'
                });
            },
            onComplete: () => {
                // 애니메이션 완료 후 모든 요소의 스타일 고정
                gsap.set('.hero-title, .hero-description, .hero-buttons, .ranking-display', {
                    clearProps: 'all',
                    opacity: 1,
                    transform: 'none'
                });
                
                // 성능 최적화를 위한 클래스 추가
                document.body.classList.add('animations-complete');
            }
        });
        
        this.timeline
            .fromTo('.hero-title', {
                y: 50,
                opacity: 0
            }, {
                duration: 0.8,
                y: 0,
                opacity: 1,
                ease: 'power2.out'
            })
            .fromTo('.hero-description', {
                y: 30,
                opacity: 0
            }, {
                duration: 0.6,
                y: 0,
                opacity: 1,
                ease: 'power2.out'
            }, '-=0.4')
            .fromTo('.hero-buttons .btn', {
                y: 20,
                opacity: 0
            }, {
                duration: 0.5,
                y: 0,
                opacity: 1,
                stagger: 0.1,
                ease: 'power2.out'
            }, '-=0.3')
            .fromTo('.ranking-display', {
                x: 30,
                opacity: 0
            }, {
                duration: 0.8,
                x: 0,
                opacity: 1,
                ease: 'power2.out'
            }, '-=0.6')
            .fromTo('.ranking-item', {
                y: 15,
                opacity: 0
            }, {
                duration: 0.4,
                y: 0,
                opacity: 1,
                stagger: 0.08,
                ease: 'power2.out'
            }, '-=0.2');
        
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
        this.background3D = null;
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
            // 페이지 준비 상태 확인
            this.waitForPageReady().then(() => {
                if (this.isDestroyed) return;
                
                // React 컴포넌트 렌더링
                this.renderRankings();
                this.renderUrgentCards();
                
                // 3D 배경 캔버스 추가
                this.add3DBackgroundCanvas();
                
                // 시각화 초기화
                setTimeout(() => {
                    if (!this.isDestroyed) {
                        this.initWaveEffect();
                        this.init3DBackground();
                    }
                }, 100);
                
                // 애니메이션 초기화
                setTimeout(() => {
                    if (!this.isDestroyed) {
                        this.animations = new IndexAnimations();
                        this.scrollObserver = new ScrollObserver();
                    }
                }, 200);
                
                this.setupEventListeners();
                
                console.log('Index page initialized successfully');
            });
        } catch (error) {
            console.error('Index page setup error:', error);
        }
    }

    // 페이지 준비 상태 대기
    waitForPageReady() {
        return new Promise((resolve) => {
            if (document.body.classList.contains('page-ready')) {
                resolve();
                return;
            }
            
            const checkReady = () => {
                if (document.body.classList.contains('page-ready')) {
                    resolve();
                } else {
                    setTimeout(checkReady, 50);
                }
            };
            
            // 최대 2초 대기
            setTimeout(() => {
                console.warn('Page ready timeout, proceeding anyway');
                resolve();
            }, 2000);
            
            checkReady();
        });
    }

    // 3D 배경 캔버스 추가
    add3DBackgroundCanvas() {
        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;

        // 3D 배경 캔버스 생성
        const canvas3D = document.createElement('canvas');
        canvas3D.className = 'stats-3d-background';
        canvas3D.id = 'stats3DCanvas';
        
        // 캔버스를 stats-section에 추가
        statsSection.insertBefore(canvas3D, statsSection.firstChild);
    }

    // 3D 배경 초기화
    init3DBackground() {
        if (this.isDestroyed) return;
        
        const canvas3D = document.getElementById('stats3DCanvas');
        const container = document.querySelector('.stats-section');
        
        if (canvas3D && container && !this.isDestroyed) {
            this.background3D = new FlowingBackground3D(canvas3D, container);
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
                
                if (this.background3D) {
                    this.background3D.onWindowResize();
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
        
        if (this.background3D) {
            this.background3D.destroy();
            this.background3D = null;
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
        if (indexPage && indexPage.background3D) {
            indexPage.background3D.isDestroyed = true;
        }
    } else {
        // 페이지가 다시 보일 때 애니메이션 재개
        if (indexPage && indexPage.waveEffect) {
            indexPage.waveEffect.isDestroyed = false;
        }
        if (indexPage && indexPage.background3D) {
            indexPage.background3D.isDestroyed = false;
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
        testFlowingBackground: () => {
            if (indexPage && indexPage.background3D && !indexPage.isDestroyed) {
                console.log('Flowing 3D Background status:', {
                    isDestroyed: indexPage.background3D.isDestroyed,
                    geometriesCount: indexPage.background3D.geometries.length,
                    particlesCount: indexPage.background3D.particles.length,
                    currentTime: indexPage.background3D.time
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