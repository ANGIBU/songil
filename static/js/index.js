// static/js/index.js

// React 컴포넌트 활용 - 안전한 접근
const { useState, useEffect, useCallback, useMemo } = typeof React !== 'undefined' ? React : {};

// GSAP 안전한 접근
const gsap = typeof window !== 'undefined' && window.gsap ? window.gsap : null;

// Three.js 안전한 접근
const THREE = typeof window !== 'undefined' && window.THREE ? window.THREE : null;

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

// Three.js 희망 효과 관리자
class HopeEffectManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.lights = [];
        this.animationId = null;
        this.container = null;
        this.isDestroyed = false;
        this.isActive = false;
    }

    init(container) {
        if (!THREE || this.isDestroyed) {
            console.warn('Three.js not available or manager destroyed');
            return false;
        }

        this.container = container;
        
        try {
            this.setupScene();
            this.createParticles();
            this.createLights();
            this.setupEventListeners();
            this.startAnimation();
            this.isActive = true;
            
            console.log('✨ Hope effect initialized successfully');
            return true;
        } catch (error) {
            console.error('Hope effect initialization failed:', error);
            return false;
        }
    }

    setupScene() {
        const rect = this.container.getBoundingClientRect();
        
        // Scene 설정
        this.scene = new THREE.Scene();
        
        // Camera 설정
        this.camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000);
        this.camera.position.z = 10;
        
        // Renderer 설정
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true,
            powerPreference: "low-power"
        });
        this.renderer.setSize(rect.width, rect.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        
        // 캔버스 스타일 설정
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.renderer.domElement.style.pointerEvents = 'none';
        this.renderer.domElement.style.zIndex = '1';
        this.renderer.domElement.style.opacity = '0.7';
        
        this.container.appendChild(this.renderer.domElement);
    }

    createStarTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 20;
        
        // 뿌옇지만 확산되지 않는 원형 그라데이션
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.9)');
        gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.7)');
        gradient.addColorStop(0.85, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        // 원형 그리기
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 중심부 강조 (더 밝은 점)
        const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 8);
        centerGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        centerGradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
        
        ctx.fillStyle = centerGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        return new THREE.CanvasTexture(canvas);
    }

    createParticles() {
        // 별 모양 텍스처 생성
        const starTexture = this.createStarTexture();
        
        const particleCount = 150;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const scales = new Float32Array(particleCount);
        const opacities = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // 초기 위치 - 하단에서 시작
            positions[i3] = (Math.random() - 0.5) * 25; // x
            positions[i3 + 1] = -15 + Math.random() * 5; // y (하단)
            positions[i3 + 2] = (Math.random() - 0.5) * 10; // z
            
            // 상승 속도
            velocities[i3] = (Math.random() - 0.5) * 0.02; // x drift
            velocities[i3 + 1] = 0.005 + Math.random() * 0.015; // y (상승)
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.01; // z drift
            
            // 크기와 투명도 - 중간 크기를 최대로 제한
            scales[i] = 0.5 + Math.random() * 0.75; // 0.5~1.25 범위로 축소
            opacities[i] = 0.3 + Math.random() * 0.7;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
        geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
        
        // 희망의 빛을 표현하는 따뜻한 색상 - 별 모양 텍스처 적용
        const material = new THREE.PointsMaterial({
            color: 0xffd700, // 황금색
            size: 0.8, // 미세한 크기로 축소
            map: starTexture,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            vertexColors: false,
            alphaTest: 0.001,
            depthTest: false, // 깊이 테스트 비활성화
            depthWrite: false // 깊이 쓰기 비활성화
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.particles.push({ mesh: particles, velocities });
        
        // 추가 파티클 레이어 - 더 작고 밝은 별들
        const smallParticleCount = 80;
        const smallGeometry = new THREE.BufferGeometry();
        const smallPositions = new Float32Array(smallParticleCount * 3);
        const smallVelocities = new Float32Array(smallParticleCount * 3);
        
        for (let i = 0; i < smallParticleCount; i++) {
            const i3 = i * 3;
            smallPositions[i3] = (Math.random() - 0.5) * 30;
            smallPositions[i3 + 1] = -12 + Math.random() * 8;
            smallPositions[i3 + 2] = (Math.random() - 0.5) * 8;
            
            smallVelocities[i3] = (Math.random() - 0.5) * 0.015;
            smallVelocities[i3 + 1] = 0.008 + Math.random() * 0.02;
            smallVelocities[i3 + 2] = (Math.random() - 0.5) * 0.012;
        }
        
        smallGeometry.setAttribute('position', new THREE.BufferAttribute(smallPositions, 3));
        
        const smallMaterial = new THREE.PointsMaterial({
            color: 0xffffff, // 순백색
            size: 0.5, // 더 작은 별들로 축소
            map: starTexture,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            alphaTest: 0.001,
            depthTest: false, // 깊이 테스트 비활성화
            depthWrite: false // 깊이 쓰기 비활성화
        });
        
        const smallParticles = new THREE.Points(smallGeometry, smallMaterial);
        this.scene.add(smallParticles);
        this.particles.push({ mesh: smallParticles, velocities: smallVelocities });
    }

    createLights() {
        // 부드러운 앰비언트 라이트
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);
        
        // 움직이는 포인트 라이트들 - 따뜻한 색상
        const lightColors = [0xffd700, 0xffa500, 0xffff99, 0xffe4b5];
        
        for (let i = 0; i < 4; i++) {
            const light = new THREE.PointLight(lightColors[i], 0.8, 30);
            light.position.set(
                (Math.random() - 0.5) * 20,
                Math.random() * 10 - 5,
                Math.random() * 10 - 5
            );
            
            // 라이트 이동 정보
            light.userData = {
                originalX: light.position.x,
                originalY: light.position.y,
                originalZ: light.position.z,
                speed: 0.5 + Math.random() * 0.5,
                radius: 3 + Math.random() * 4,
                phase: Math.random() * Math.PI * 2
            };
            
            this.scene.add(light);
            this.lights.push(light);
        }
    }

    setupEventListeners() {
        this.resizeHandler = () => {
            if (!this.container || this.isDestroyed) return;
            
            const rect = this.container.getBoundingClientRect();
            this.camera.aspect = rect.width / rect.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(rect.width, rect.height);
        };
        
        window.addEventListener('resize', this.resizeHandler);
    }

    startAnimation() {
        if (this.isDestroyed) return;
        
        const animate = (time) => {
            if (this.isDestroyed) return;
            
            this.animationId = requestAnimationFrame(animate);
            this.updateParticles(time);
            this.updateLights(time);
            this.renderer.render(this.scene, this.camera);
        };
        
        animate(0);
    }

    updateParticles(time) {
        this.particles.forEach(({ mesh, velocities }) => {
            const positions = mesh.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                const velocityIndex = i;
                
                // 파티클 위치 업데이트
                positions[i] += velocities[velocityIndex];
                positions[i + 1] += velocities[velocityIndex + 1];
                positions[i + 2] += velocities[velocityIndex + 2];
                
                // 상단에 도달하면 하단에서 재시작
                if (positions[i + 1] > 15) {
                    positions[i] = (Math.random() - 0.5) * 25;
                    positions[i + 1] = -15;
                    positions[i + 2] = (Math.random() - 0.5) * 10;
                }
                
                // 좌우 경계 처리
                if (positions[i] > 15) positions[i] = -15;
                if (positions[i] < -15) positions[i] = 15;
            }
            
            mesh.geometry.attributes.position.needsUpdate = true;
        });
    }

    updateLights(time) {
        this.lights.forEach((light, index) => {
            const userData = light.userData;
            const t = time * 0.001 * userData.speed + userData.phase;
            
            light.position.x = userData.originalX + Math.sin(t) * userData.radius;
            light.position.y = userData.originalY + Math.sin(t * 0.7) * userData.radius * 0.5;
            light.position.z = userData.originalZ + Math.cos(t * 0.8) * userData.radius * 0.3;
            
            // 부드러운 밝기 변화
            light.intensity = 0.6 + Math.sin(t * 2) * 0.3;
        });
    }

    destroy() {
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
        this.lights = [];
        this.container = null;
        
        console.log('✨ Hope effect destroyed');
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
        if (!gsap) {
            console.warn('GSAP not available - animations will be skipped');
            return false;
        }

        // GSAP 기본 설정
        gsap.defaults({
            ease: "power2.out",
            duration: 0.6
        });

        this.isGSAPReady = true;
        return true;
    }

    prepareAnimationElements() {
        if (!this.isGSAPReady) {
            console.warn('GSAP not ready - all elements will remain visible');
            return;
        }

        // GSAP가 준비되면 body에 클래스 추가하여 애니메이션 준비
        document.body.classList.add('gsap-animation-ready');
        
        // 애니메이션할 요소들에 클래스 추가
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
                el.classList.add(config.class);
            });
        });
        
        console.log('✅ GSAP animation elements prepared');
    }

    initializeHopeEffect() {
        if (!THREE) {
            console.warn('Three.js not available - hope effect will be skipped');
            return;
        }

        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) {
            console.warn('Stats section not found - hope effect will be skipped');
            return;
        }

        // 통계 섹션에 포지션 relative 추가 (CSS에서 이미 설정되어 있지만 확실히)
        statsSection.style.position = 'relative';
        statsSection.style.overflow = 'hidden';

        this.hopeEffect = new HopeEffectManager();
        const success = this.hopeEffect.init(statsSection);
        
        if (success) {
            console.log('✨ Hope effect initialized for stats section');
        } else {
            this.hopeEffect = null;
        }
    }

    createMasterTimeline() {
        if (!this.isGSAPReady) return null;

        const masterTL = gsap.timeline({ paused: true });

        // 1. 히어로 섹션 애니메이션 (0초부터 시작)
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

        // 2. 긴급 실종자 섹션 헤더 (0.6초 후)
        masterTL.to('.urgent-section .section-header', {
            opacity: 1,
            visibility: 'visible',
            duration: 0.5,
            ease: "power2.out"
        }, 0.6);

        // 3. 긴급 실종자 카드들 (0.8초 후, stagger 효과)
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

        // 4. 소개 섹션 헤더 (1.2초 후)
        masterTL.to('.intro-section h2', {
            opacity: 1,
            visibility: 'visible',
            duration: 0.5,
            ease: "power2.out"
        }, 1.2);

        // 5. 소개 단계들 (1.4초 후)
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

        // 6. 통계 섹션 (1.8초 후)
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

        // 7. 통계 카드들 (2.2초 후)
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
    }

    createFloatingAnimation() {
        if (!this.isGSAPReady) {
            console.warn('GSAP not ready for floating animation');
            return;
        }

        const statItems = document.querySelectorAll('.stat-item');
        console.log('🌊 Found stat items:', statItems.length);
        
        if (statItems.length === 0) {
            console.warn('No stat items found for floating animation');
            return;
        }

        statItems.forEach((item, index) => {
            console.log(`🌊 Setting up floating for item ${index + 1}`);
            
            // 각각 다른 속도와 방향으로 floating 효과
            const floatingTL = gsap.timeline({ repeat: -1, yoyo: true });
            
            const baseDelay = index * 0.3; // 각 아이템마다 다른 시작 시간
            const yMovement = 8 + Math.random() * 6; // 8~14px 수직 움직임
            const xMovement = 4 + Math.random() * 4; // 4~8px 수평 움직임
            const duration = 2.5 + Math.random() * 1.5; // 2.5~4초 주기
            
            floatingTL
                .to(item, {
                    y: yMovement,
                    x: xMovement * (Math.random() > 0.5 ? 1 : -1), // 랜덤 방향
                    rotation: (Math.random() - 0.5) * 2, // -1도 ~ 1도 회전
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

        console.log('🌊 Floating animation started for stat items');
    }

    startMainAnimation() {
        if (!this.isGSAPReady) {
            console.warn('GSAP not ready - skipping animations');
            // GSAP 없이도 희망 효과는 시도
            setTimeout(() => {
                this.initializeHopeEffect();
            }, 2000);
            return;
        }

        const masterAnimation = this.createMasterTimeline();
        if (masterAnimation) {
            masterAnimation.play();
            console.log('🎬 Master animation started');
            
            // 통계 아이템들이 나타난 후 floating 애니메이션 시작 - 시간 단축
            setTimeout(() => {
                this.createFloatingAnimation();
            }, 3000); // 3초로 조정
            
            // 추가 안전장치 - 5초 후에도 한번 더 시도
            setTimeout(() => {
                if (document.querySelectorAll('.stat-item').length > 0) {
                    this.createFloatingAnimation();
                }
            }, 5000);
        }
    }

    destroy() {
        this.isDestroyed = true;

        // 희망 효과 정리
        if (this.hopeEffect) {
            this.hopeEffect.destroy();
            this.hopeEffect = null;
        }

        // 모든 타임라인 정리
        this.timelines.forEach(tl => {
            if (tl && tl.kill) {
                tl.kill();
            }
        });
        this.timelines = [];

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

// GSAP + Three.js 통합 홈페이지 관리 클래스
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
        
        console.log('🚀 Starting enhanced index page with GSAP + Three.js...');
        
        // GSAP 애니메이션 매니저 초기화
        this.animationManager = new GSAPAnimationManager();
        
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
        
        // 희망 효과 즉시 시작
        setTimeout(() => {
            this.animationManager.initializeHopeEffect();
        }, 200);
        
        // 메인 애니메이션 시작
        setTimeout(() => {
            this.animationManager.startMainAnimation();
        }, 100);
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
        // 통계 숫자는 HTML에서 직접 설정되므로 별도 처리 불필요
        console.log('✅ Stats display ready (no animation)');
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

// GSAP + Three.js 통합 초기화
let indexPage = null;

try {
    indexPage = new EnhancedIndexPage();
} catch (error) {
    console.error('Enhanced index page initialization failed:', error);
    
    // 최소한의 폴백 초기화
    document.addEventListener('DOMContentLoaded', () => {
        renderRankingFallback();
        renderUrgentCardsFallback();
        
        // Three.js 희망 효과만 별도로 시도
        if (THREE) {
            try {
                const statsSection = document.querySelector('.stats-section');
                if (statsSection) {
                    const hopeEffect = new HopeEffectManager();
                    setTimeout(() => {
                        hopeEffect.init(statsSection);
                    }, 2000);
                }
            } catch (effectError) {
                console.warn('Hope effect fallback failed:', effectError);
            }
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

// 개발자 도구 - GSAP + Three.js 통합 버전
if (typeof window !== 'undefined') {
    window.indexPageDebug = {
        get instance() { return indexPage; },
        get animationManager() { return indexPage?.animationManager; },
        get hopeEffect() { return indexPage?.animationManager?.hopeEffect; },
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
                const masterAnim = indexPage.animationManager.createMasterTimeline();
                if (masterAnim) masterAnim.restart();
            }
        },
        testHopeEffect: () => {
            if (indexPage?.animationManager) {
                indexPage.animationManager.initializeHopeEffect();
            }
        },
        testInstantLoad: () => {
            if (indexPage?.animationManager) {
                indexPage.animationManager.startMainAnimation();
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

console.log('📜 Enhanced index.js with GSAP + Three.js Hope Effect loaded successfully!');