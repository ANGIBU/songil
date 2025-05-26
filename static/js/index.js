// static/js/index.js

// React 컴포넌트 활용
const { useState, useEffect } = React;

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
        dangerLevel: "medium",
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
    },
    {
        id: 9,
        name: "서○○",
        age: 19,
        gender: "여성",
        date: "2024-05-20",
        location: "강원도 춘천시 후평동",
        region: "gangwon",
        description: "흰색 맨투맨, 청바지",
        physicalInfo: "158cm, 마른체형",
        dangerLevel: "medium",
        upCount: 76,
        period: "3일째",
        image: "/static/images/placeholder.jpg"
    },
    {
        id: 10,
        name: "조○○",
        age: 75,
        gender: "남성",
        date: "2024-05-15",
        location: "제주시 일도2동",
        region: "jeju",
        description: "갈색 자켓, 검은색 바지",
        physicalInfo: "165cm, 마른체형",
        dangerLevel: "high",
        upCount: 234,
        period: "8일째",
        image: "/static/images/placeholder.jpg"
    }
];

// 위험도가 높은 실종자들을 필터링하고 랜덤으로 8명 선택
function getUrgentMissingData() {
    const highDangerMissing = allMissingData.filter(person => person.dangerLevel === 'high');
    const mediumDangerMissing = allMissingData.filter(person => person.dangerLevel === 'medium');
    
    // 높은 위험도 우선, 부족하면 중간 위험도로 채움
    let urgentList = [...highDangerMissing];
    if (urgentList.length < 8) {
        urgentList = urgentList.concat(mediumDangerMissing.slice(0, 8 - urgentList.length));
    }
    
    // 배열을 섞어서 랜덤하게 배치
    for (let i = urgentList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [urgentList[i], urgentList[j]] = [urgentList[j], urgentList[i]];
    }
    
    return urgentList.slice(0, 8);
}

// 긴급 실종자 데이터 (동적으로 생성)
const urgentMissingData = getUrgentMissingData();

// 실종자 카드 React 컴포넌트
function MissingCard({ data, onUpClick }) {
    const [upCount, setUpCount] = useState(data.upCount);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleUpClick = () => {
        if (isAnimating) return;
        
        setIsAnimating(true);
        setUpCount(prev => prev + 1);
        onUpClick(data.id);
        
        setTimeout(() => setIsAnimating(false), 300);
    };

    const getDangerLevelText = (level) => {
        switch (level) {
            case 'high': return '긴급';
            case 'medium': return '주의';
            case 'low': return '관심';
            default: return '일반';
        }
    };

    const formatDate = (dateStr) => {
        return dateStr.replace(/-/g, '.');
    };

    return React.createElement('div', {
        className: `missing-card urgent ${isAnimating ? 'animating' : ''}`,
        'data-id': data.id
    }, [
        React.createElement('div', { className: 'card-image', key: 'image' }, [
            React.createElement('img', {
                src: data.image,
                alt: '실종자 사진',
                onError: (e) => {
                    e.target.src = '/static/images/placeholder.jpg';
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
            React.createElement('p', { className: 'missing-info', key: 'info' }, [
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
}

// 통계 카운터 애니메이션 클래스
class StatCounter {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = parseInt(target.toString().replace(/[,%]/g, ''));
        this.duration = duration;
        this.hasPercent = target.toString().includes('%');
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
            
            this.element.textContent = this.current.toLocaleString() + 
                (this.hasPercent ? '%' : '');
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Three.js 네트워크 시각화 클래스
class NetworkVisualization {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.nodes = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.currentRotation = { x: 0, y: 0 };
        this.isDestroyed = false;
        
        this.init();
    }

    init() {
        if (typeof THREE === 'undefined') {
            this.createFallback();
            return;
        }

        this.setupScene();
        this.createNodes();
        this.createConnections();
        this.setupEventListeners();
        this.animate();
    }

    setupScene() {
        // Scene 설정
        this.scene = new THREE.Scene();
        
        // Camera 설정
        const aspectRatio = this.container.offsetWidth / this.container.offsetHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
        this.camera.position.set(0, 0, 15);
        
        // Renderer 설정
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // 기존 내용 제거 후 렌더러 추가
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);
    }

    createNodes() {
        const nodeCount = 25;
        const nodeGeometry = new THREE.SphereGeometry(0.15, 8, 6);
        
        for (let i = 0; i < nodeCount; i++) {
            // 노드 색상 (파란색 계열)
            const hue = 0.6 + Math.random() * 0.1; // 파란색 계열
            const saturation = 0.7 + Math.random() * 0.3;
            const lightness = 0.5 + Math.random() * 0.3;
            
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(hue, saturation, lightness),
                transparent: true,
                opacity: 0.8
            });
            
            const node = new THREE.Mesh(nodeGeometry, material);
            
            // 구형 배치
            const radius = 6 + Math.random() * 4;
            const phi = Math.acos(-1 + (2 * i) / nodeCount);
            const theta = Math.sqrt(nodeCount * Math.PI) * phi;
            
            node.position.setFromSphericalCoords(radius, phi, theta);
            node.userData = {
                originalPosition: node.position.clone(),
                phase: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 0.5
            };
            
            this.scene.add(node);
            this.nodes.push(node);
        }
        
        // 중앙 허브 노드
        const hubMaterial = new THREE.MeshBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.9
        });
        
        const hubNode = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 12, 8),
            hubMaterial
        );
        
        hubNode.position.set(0, 0, 0);
        hubNode.userData = { isHub: true, phase: 0, speed: 0.2 };
        
        this.scene.add(hubNode);
        this.nodes.push(hubNode);
    }

    createConnections() {
        const lineGeometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const opacities = [];
        
        // 모든 노드를 중앙 허브와 연결
        const hubNode = this.nodes[this.nodes.length - 1]; // 마지막이 허브
        
        for (let i = 0; i < this.nodes.length - 1; i++) {
            const node = this.nodes[i];
            
            // 허브와 연결
            positions.push(
                node.position.x, node.position.y, node.position.z,
                hubNode.position.x, hubNode.position.y, hubNode.position.z
            );
            
            // 색상 (파란색 계열)
            colors.push(0.2, 0.5, 0.9, 0.2, 0.5, 0.9);
            
            // 투명도
            const opacity = 0.3 + Math.random() * 0.4;
            opacities.push(opacity, opacity);
        }
        
        // 일부 노드들 간의 추가 연결
        for (let i = 0; i < this.nodes.length - 1; i++) {
            if (Math.random() > 0.7) {
                const j = Math.floor(Math.random() * (this.nodes.length - 1));
                if (i !== j) {
                    const nodeA = this.nodes[i];
                    const nodeB = this.nodes[j];
                    
                    positions.push(
                        nodeA.position.x, nodeA.position.y, nodeA.position.z,
                        nodeB.position.x, nodeB.position.y, nodeB.position.z
                    );
                    
                    colors.push(0.2, 0.4, 0.8, 0.2, 0.4, 0.8);
                    
                    const opacity = 0.1 + Math.random() * 0.2;
                    opacities.push(opacity, opacity);
                }
            }
        }
        
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.scene.add(lines);
        this.connections = lines;
    }

    setupEventListeners() {
        // 마우스 움직임 추적
        this.container.addEventListener('mousemove', (event) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        });
        
        // 리사이즈 핸들러
        window.addEventListener('resize', () => this.onWindowResize());
    }

    animate() {
        if (this.isDestroyed) return;
        
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // 노드 애니메이션
        this.nodes.forEach((node, index) => {
            if (node.userData.isHub) {
                // 허브 노드 회전
                node.rotation.x = Math.sin(time * 0.3) * 0.1;
                node.rotation.y = time * 0.2;
                
                // 허브 노드 크기 변화
                const scale = 1 + Math.sin(time * 2) * 0.1;
                node.scale.setScalar(scale);
            } else {
                // 일반 노드들의 궤도 운동
                const phase = node.userData.phase + time * node.userData.speed;
                const radius = node.userData.originalPosition.length();
                
                node.position.x = node.userData.originalPosition.x + Math.sin(phase) * 0.5;
                node.position.y = node.userData.originalPosition.y + Math.cos(phase) * 0.5;
                node.position.z = node.userData.originalPosition.z + Math.sin(phase * 0.7) * 0.3;
                
                // 마우스 인터랙션
                const mouseInfluence = 0.5;
                node.position.x += this.mouse.x * mouseInfluence;
                node.position.y += this.mouse.y * mouseInfluence;
            }
        });
        
        // 전체 씬 회전
        this.targetRotation.x = this.mouse.y * 0.2;
        this.targetRotation.y = this.mouse.x * 0.2;
        
        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.05;
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.05;
        
        this.scene.rotation.x = this.currentRotation.x;
        this.scene.rotation.y = this.currentRotation.y + time * 0.1;
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    onWindowResize() {
        if (!this.renderer || !this.camera || this.isDestroyed) return;
        
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    createFallback() {
        this.container.innerHTML = `
            <div class="network-placeholder">
                <i class="fas fa-network-wired"></i>
                <div>연결된 시민들이<br>함께 찾아요</div>
            </div>
        `;
    }

    destroy() {
        this.isDestroyed = true;
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // 메모리 정리
        this.nodes = [];
        this.connections = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }
}

// GSAP 애니메이션 관리자 (버그 수정 버전)
class IndexAnimations {
    constructor() {
        this.isInitialized = false;
        this.timeline = null;
        this.scrollTriggers = [];
        this.init();
    }

    init() {
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded, skipping animations');
            return;
        }

        // ScrollTrigger 등록
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // 기존 애니메이션 정리
        this.cleanup();
        
        this.setupAnimations();
        this.isInitialized = true;
    }

    cleanup() {
        // 기존 타임라인 정리
        if (this.timeline) {
            this.timeline.kill();
            this.timeline = null;
        }
        
        // ScrollTrigger 정리
        this.scrollTriggers.forEach(trigger => {
            if (trigger) trigger.kill();
        });
        this.scrollTriggers = [];
        
        // 모든 GSAP 애니메이션 초기화
        gsap.set('*', {clearProps: 'all'});
    }

    setupAnimations() {
        // 히어로 섹션 초기 애니메이션 (수정됨)
        this.timeline = gsap.timeline({ delay: 0.5 });
        
        this.timeline
            .from('.hero-title', {
                duration: 1.2,
                y: 80,
                opacity: 0,
                ease: 'power3.out',
                clearProps: 'transform,opacity' // 애니메이션 완료 후 속성 정리
            })
            .from('.hero-description', {
                duration: 1,
                y: 40,
                opacity: 0,
                ease: 'power2.out',
                clearProps: 'transform,opacity'
            }, '-=0.6')
            .from('.hero-buttons .btn', {
                duration: 0.8,
                y: 30,
                opacity: 0,
                stagger: 0.2,
                ease: 'power2.out',
                clearProps: 'transform,opacity'
            }, '-=0.4')
            .from('#network-canvas', {
                duration: 1.5,
                scale: 0.8,
                opacity: 0,
                ease: 'back.out(1.7)',
                clearProps: 'transform,opacity'
            }, '-=1');

        // ScrollTrigger 애니메이션들 (수정됨)
        if (typeof ScrollTrigger !== 'undefined') {
            // 긴급 실종자 섹션
            const urgentTrigger = ScrollTrigger.create({
                trigger: '.urgent-section',
                start: 'top 70%',
                end: 'bottom 30%',
                onEnter: () => {
                    gsap.from('.urgent-cards .missing-card', {
                        duration: 0.8,
                        y: 60,
                        opacity: 0,
                        stagger: 0.2,
                        ease: 'power2.out',
                        clearProps: 'transform,opacity'
                    });
                },
                once: true // 한 번만 실행되도록 설정
            });
            this.scrollTriggers.push(urgentTrigger);

            // 소개 섹션 스텝들
            const introTrigger = ScrollTrigger.create({
                trigger: '.intro-section',
                start: 'top 80%',
                end: 'bottom 20%',
                onEnter: () => {
                    gsap.from('.intro-steps .step', {
                        duration: 0.6,
                        y: 40,
                        opacity: 0,
                        stagger: 0.15,
                        ease: 'power2.out',
                        clearProps: 'transform,opacity'
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
                    gsap.from('.stats-grid .stat-item', {
                        duration: 0.8,
                        scale: 0.8,
                        opacity: 0,
                        stagger: 0.1,
                        ease: 'back.out(1.7)',
                        clearProps: 'transform,opacity'
                    });
                },
                once: true
            });
            this.scrollTriggers.push(statsTrigger);
        }

        // 배경 애니메이션
        this.setupBackgroundAnimations();
    }

    setupBackgroundAnimations() {
        // 히어로 섹션 배경 파티클
        this.createFloatingParticles('.hero-section', 8);
    }

    createFloatingParticles(containerSelector, count) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

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
            `;
            
            container.appendChild(particle);
            
            // 랜덤 초기 위치
            gsap.set(particle, {
                x: Math.random() * container.offsetWidth,
                y: Math.random() * container.offsetHeight,
                scale: Math.random() * 0.5 + 0.5
            });
            
            // 플로팅 애니메이션
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
            
            // 페이드 애니메이션
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

    // UP 버튼 클릭 애니메이션 (수정됨)
    animateUpButton(button) {
        if (!this.isInitialized) return;
        
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
                clearProps: 'transform' // 애니메이션 완료 후 transform 정리
            });
            
        // 숫자 증가 애니메이션
        const countElement = button.querySelector('span');
        if (countElement) {
            gsap.fromTo(countElement, 
                { scale: 1.5 },
                {
                    scale: 1,
                    duration: 0.3,
                    ease: 'back.out(1.7)',
                    clearProps: 'transform'
                }
            );
        }
    }

    // 소멸자 추가
    destroy() {
        this.cleanup();
        this.isInitialized = false;
    }
}

// Intersection Observer를 활용한 스크롤 트리거
class ScrollObserver {
    constructor() {
        this.counters = new Map();
        this.observer = null;
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
                    if (entry.target.classList.contains('stat-item')) {
                        this.startStatCounter(entry.target);
                    }
                } else {
                    // 스크rol� 아웃 시에도 클래스 유지 (버그 수정)
                    // entry.target.classList.remove('in-view');
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });
    }

    observeElements() {
        const elements = document.querySelectorAll('.stat-item, .missing-card, .step');
        elements.forEach(el => this.observer.observe(el));
    }

    startStatCounter(statItem) {
        const numberElement = statItem.querySelector('.stat-number');
        if (numberElement && !this.counters.has(numberElement)) {
            const counter = new StatCounter(numberElement, numberElement.textContent);
            this.counters.set(numberElement, counter);
            counter.start();
        }
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        this.counters.clear();
    }
}

// 메인 홈페이지 관리 클래스 (수정됨)
class IndexPage {
    constructor() {
        this.networkViz = null;
        this.animations = null;
        this.scrollObserver = null;
        this.isDestroyed = false;
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
        if (this.isDestroyed) return;
        
        // React 컴포넌트 렌더링
        this.renderUrgentCards();
        
        // 네트워크 시각화 초기화 (딜레이 추가)
        setTimeout(() => {
            if (!this.isDestroyed) {
                this.initNetworkVisualization();
            }
        }, 100);
        
        // 애니메이션 시스템 초기화 (딜레이 추가)
        setTimeout(() => {
            if (!this.isDestroyed) {
                this.animations = new IndexAnimations();
            }
        }, 200);
        
        // 스크롤 관찰자 초기화 (딜레이 추가)
        setTimeout(() => {
            if (!this.isDestroyed) {
                this.scrollObserver = new ScrollObserver();
            }
        }, 300);
        
        // 희망의 빛 효과 초기화
        setTimeout(() => {
            if (!this.isDestroyed) {
                this.initHopeLightEffect();
            }
        }, 500);
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        console.log('Index page initialized successfully');
    }

    // React 컴포넌트 렌더링
    renderUrgentCards() {
        const urgentContainer = document.querySelector('.urgent-cards');
        if (!urgentContainer || typeof React === 'undefined') {
            console.warn('React not available or container not found');
            return;
        }

        const handleUpClick = (cardId) => {
            console.log(`UP clicked for card ${cardId}`);
            
            // 애니메이션 트리거
            const button = document.querySelector(`[data-id="${cardId}"] .up-btn`);
            if (button && this.animations) {
                this.animations.animateUpButton(button);
            }
            
            // 희망적인 알림 표시
            if (window.showNotification) {
                window.showNotification('소중한 참여에 감사합니다! 함께라면 찾을 수 있어요.', 'success');
            }
        };

        try {
            const root = ReactDOM.createRoot(urgentContainer);
            root.render(
                React.createElement('div', { style: { display: 'contents' } },
                    urgentMissingData.map(data =>
                        React.createElement(MissingCard, {
                            key: data.id,
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

    // 희망의 빛 효과 초기화
    initHopeLightEffect() {
        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;

        // 빛 효과 요소 생성
        const hopeLight = document.createElement('div');
        hopeLight.className = 'hope-light';
        statsSection.appendChild(hopeLight);

        // 주기적으로 빛 효과 실행
        setInterval(() => {
            hopeLight.style.animation = 'none';
            setTimeout(() => {
                hopeLight.style.animation = 'hopeLightMove 15s ease-in-out';
            }, 100);
        }, 18000); // 18초마다 실행
    }

    initNetworkVisualization() {
        const networkContainer = document.getElementById('network-canvas');
        if (networkContainer && !this.isDestroyed) {
            this.networkViz = new NetworkVisualization(networkContainer);
        }
    }

    setupEventListeners() {
        // 리사이즈 핸들러
        let resizeTimeout;
        const resizeHandler = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (this.networkViz && !this.isDestroyed) {
                    this.networkViz.onWindowResize();
                }
            }, 250);
        };
        
        window.addEventListener('resize', resizeHandler);

        // 버튼 클릭 이벤트 (React가 없는 경우의 폴백)
        const clickHandler = (e) => {
            if (e.target.closest('.up-btn')) {
                const button = e.target.closest('.up-btn');
                const card = button.closest('.missing-card');
                
                if (card && this.animations && !this.isDestroyed) {
                    this.animations.animateUpButton(button);
                }
            }
        };
        
        document.addEventListener('click', clickHandler);

        // 키보드 접근성
        const keyHandler = (e) => {
            if (e.key === 'Escape') {
                // ESC 키로 포커스 해제
                document.activeElement?.blur();
            }
        };
        
        document.addEventListener('keydown', keyHandler);
        
        // 정리용 이벤트 리스너 저장
        this.eventCleanup = () => {
            window.removeEventListener('resize', resizeHandler);
            document.removeEventListener('click', clickHandler);
            document.removeEventListener('keydown', keyHandler);
        };
    }

    // 개발자 도구용 메서드
    refreshNetworkViz() {
        if (this.networkViz) {
            this.networkViz.destroy();
        }
        
        const container = document.getElementById('network-canvas');
        if (container && !this.isDestroyed) {
            this.networkViz = new NetworkVisualization(container);
        }
    }

    // 소멸자 추가
    destroy() {
        this.isDestroyed = true;
        
        if (this.networkViz) {
            this.networkViz.destroy();
            this.networkViz = null;
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
        }
        
        console.log('Index page destroyed');
    }
}

// 페이지 로드 시 자동 초기화
const indexPage = new IndexPage();

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    if (indexPage) {
        indexPage.destroy();
    }
});

// 전역 함수 (하위 호환성을 위해)
window.handleUpClick = function(button, missingId) {
    const countSpan = button.querySelector('span');
    if (countSpan) {
        const currentCount = parseInt(countSpan.textContent);
        countSpan.textContent = currentCount + 1;
    }
    
    if (indexPage && indexPage.animations) {
        indexPage.animations.animateUpButton(button);
    }
    
    if (window.showNotification) {
        window.showNotification('소중한 참여에 감사합니다! 함께라면 찾을 수 있어요.', 'success');
    }
};

// 개발자 도구
if (typeof window !== 'undefined') {
    window.indexPageDebug = {
        instance: indexPage,
        refreshNetworkViz: () => indexPage && indexPage.refreshNetworkViz(),
        testAnimations: () => {
            if (typeof gsap !== 'undefined') {
                gsap.to('.missing-card', {
                    duration: 0.5,
                    scale: 1.05,
                    stagger: 0.1,
                    yoyo: true,
                    repeat: 1,
                    clearProps: 'transform'
                });
            }
        },
        networkData: urgentMissingData,
        destroyInstance: () => {
            if (indexPage) {
                indexPage.destroy();
            }
        }
    };
}