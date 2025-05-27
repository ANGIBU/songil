// static/js/three-effects.js

/* ===== Three.js 3D 효과 전용 파일 ===== */

// 보안 시각화 클래스 - 범죄 예방을 나타내는 시각화
class SecurityVisualization {
    constructor(canvas, container) {
        this.canvas = canvas;
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.securityElements = [];
        this.particles = [];
        this.protectionFields = [];
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
            this.createSecurityElements();
            this.animate();
        } catch (error) {
            console.warn('Security Visualization initialization failed:', error);
            this.destroy();
        }
    }

    setupScene() {
        // Scene 설정
        this.scene = new THREE.Scene();
        
        // Camera 설정
        const aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera = new THREE.PerspectiveCamera(70, aspect, 0.1, 1000);
        this.camera.position.set(0, 10, 40);
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

        // 조명 설정
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(20, 40, 20);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // 보안을 상징하는 색상의 포인트 라이트들
        this.blueLight = new THREE.PointLight(0x3b82f6, 0.8, 60);
        this.blueLight.position.set(-25, 20, 15);
        this.scene.add(this.blueLight);

        this.greenLight = new THREE.PointLight(0x22c55e, 0.8, 60);
        this.greenLight.position.set(25, 20, 15);
        this.scene.add(this.greenLight);

        this.redLight = new THREE.PointLight(0xef4444, 0.6, 50);
        this.redLight.position.set(0, 30, -10);
        this.scene.add(this.redLight);
    }

    createSecurityElements() {
        this.createProtectionShields();
        this.createSecurityCameras();
        this.createSafetyNetwork();
        this.createPatrollingElements();
        this.createSecurityParticles();
    }

    createProtectionShields() {
        // 보호막을 나타내는 방패 형태들
        for (let i = 0; i < 6; i++) {
            const shieldGeometry = new THREE.ConeGeometry(2, 4, 6);
            const shieldMaterial = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(0.6, 0.7, 0.6),
                transparent: true,
                opacity: 0.7,
                shininess: 100
            });

            const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
            
            const angle = (i / 6) * Math.PI * 2;
            shield.position.set(
                Math.cos(angle) * 20,
                Math.sin(angle) * 5,
                Math.sin(angle) * 10
            );
            
            shield.rotation.set(
                Math.random() * Math.PI,
                angle,
                0
            );

            shield.userData = {
                originalPosition: shield.position.clone(),
                rotationSpeed: 0.005 + Math.random() * 0.01,
                floatSpeed: 0.003 + Math.random() * 0.007,
                floatRange: 3 + Math.random() * 4
            };

            shield.castShadow = true;
            shield.receiveShadow = true;
            
            this.scene.add(shield);
            this.securityElements.push(shield);
        }
    }

    createSecurityCameras() {
        // 보안 카메라를 나타내는 객체들
        for (let i = 0; i < 4; i++) {
            const cameraGroup = new THREE.Group();
            
            const bodyGeometry = new THREE.BoxGeometry(1.5, 1, 2);
            const bodyMaterial = new THREE.MeshPhongMaterial({
                color: 0x2d3748,
                shininess: 80
            });
            const cameraBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
            
            const lensGeometry = new THREE.CylinderGeometry(0.3, 0.5, 1, 8);
            const lensMaterial = new THREE.MeshPhongMaterial({
                color: 0x1a202c,
                shininess: 200
            });
            const lens = new THREE.Mesh(lensGeometry, lensMaterial);
            lens.position.set(0, 0, 1);
            lens.rotation.x = Math.PI / 2;
            
            cameraGroup.add(cameraBody);
            cameraGroup.add(lens);
            
            cameraGroup.position.set(
                (Math.random() - 0.5) * 50,
                10 + Math.random() * 15,
                (Math.random() - 0.5) * 30
            );
            
            cameraGroup.userData = {
                scanSpeed: 0.01 + Math.random() * 0.02,
                scanRange: Math.PI / 3,
                originalRotation: cameraGroup.rotation.y
            };
            
            this.scene.add(cameraGroup);
            this.securityElements.push(cameraGroup);
        }
    }

    createSafetyNetwork() {
        const networkPoints = [];
        for (let i = 0; i < 12; i++) {
            networkPoints.push(new THREE.Vector3(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 40
            ));
        }

        for (let i = 0; i < networkPoints.length; i++) {
            for (let j = i + 1; j < networkPoints.length; j++) {
                const distance = networkPoints[i].distanceTo(networkPoints[j]);
                if (distance < 25) {
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                        networkPoints[i], networkPoints[j]
                    ]);
                    
                    const lineMaterial = new THREE.LineBasicMaterial({
                        color: 0x3b82f6,
                        transparent: true,
                        opacity: 0.4
                    });
                    
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    line.userData = {
                        pulseSpeed: 0.05 + Math.random() * 0.1,
                        originalOpacity: 0.4
                    };
                    
                    this.scene.add(line);
                    this.protectionFields.push(line);
                }
            }
        }
    }

    createPatrollingElements() {
        for (let i = 0; i < 3; i++) {
            const patrolGeometry = new THREE.SphereGeometry(0.8, 8, 8);
            const patrolMaterial = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(0.1, 0.8, 0.6),
                transparent: true,
                opacity: 0.8,
                emissive: new THREE.Color().setHSL(0.1, 0.3, 0.1)
            });

            const patrol = new THREE.Mesh(patrolGeometry, patrolMaterial);
            
            patrol.position.set(
                (Math.random() - 0.5) * 40,
                Math.random() * 10,
                (Math.random() - 0.5) * 30
            );

            patrol.userData = {
                patrolPath: [
                    new THREE.Vector3((Math.random() - 0.5) * 40, Math.random() * 10, (Math.random() - 0.5) * 30),
                    new THREE.Vector3((Math.random() - 0.5) * 40, Math.random() * 10, (Math.random() - 0.5) * 30),
                    new THREE.Vector3((Math.random() - 0.5) * 40, Math.random() * 10, (Math.random() - 0.5) * 30)
                ],
                patrolSpeed: 0.01 + Math.random() * 0.02,
                currentTarget: 0
            };

            this.scene.add(patrol);
            this.securityElements.push(patrol);
        }
    }

    createSecurityParticles() {
        const particleCount = 150;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

            const colorType = Math.random();
            if (colorType < 0.4) {
                colors[i * 3] = 0.23; colors[i * 3 + 1] = 0.51; colors[i * 3 + 2] = 0.96;
            } else if (colorType < 0.8) {
                colors[i * 3] = 0.13; colors[i * 3 + 1] = 0.77; colors[i * 3 + 2] = 0.37;
            } else {
                colors[i * 3] = 1; colors[i * 3 + 1] = 0.45; colors[i * 3 + 2] = 0.1;
            }

            sizes[i] = Math.random() * 2 + 0.5;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleMaterial = new THREE.PointsMaterial({
            size: 1.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particles);
        this.particles.push(particles);
    }

    updateSecurityElements() {
        this.time += 0.01;

        this.securityElements.forEach((element, index) => {
            const userData = element.userData;
            
            if (userData.floatSpeed) {
                element.position.y = userData.originalPosition.y + 
                    Math.sin(this.time * userData.floatSpeed + index) * userData.floatRange;
                element.rotation.y += userData.rotationSpeed;
                element.rotation.z = Math.sin(this.time * 0.5 + index) * 0.1;
            } else if (userData.scanSpeed) {
                const scanAngle = Math.sin(this.time * userData.scanSpeed) * userData.scanRange;
                element.rotation.y = userData.originalRotation + scanAngle;
            } else if (userData.patrolPath) {
                const target = userData.patrolPath[userData.currentTarget];
                const distance = element.position.distanceTo(target);
                
                if (distance < 2) {
                    userData.currentTarget = (userData.currentTarget + 1) % userData.patrolPath.length;
                }
                
                element.position.lerp(target, userData.patrolSpeed);
                element.rotation.x += 0.02;
                element.rotation.y += 0.01;
            }
        });

        this.protectionFields.forEach((line, index) => {
            const userData = line.userData;
            const pulse = Math.sin(this.time * userData.pulseSpeed + index) * 0.3 + 0.7;
            line.material.opacity = userData.originalOpacity * pulse;
        });

        this.particles.forEach(particle => {
            const positions = particle.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(this.time + positions[i] * 0.01) * 0.05;
                positions[i] += Math.cos(this.time * 0.7 + positions[i + 2] * 0.01) * 0.03;
            }
            
            particle.geometry.attributes.position.needsUpdate = true;
            particle.rotation.y += 0.001;
        });

        if (this.blueLight) {
            this.blueLight.intensity = 0.6 + Math.sin(this.time * 0.8) * 0.3;
            this.blueLight.position.x = -25 + Math.sin(this.time * 0.3) * 8;
        }

        if (this.greenLight) {
            this.greenLight.intensity = 0.6 + Math.cos(this.time * 0.6) * 0.3;
            this.greenLight.position.x = 25 + Math.cos(this.time * 0.4) * 8;
        }

        if (this.redLight) {
            this.redLight.intensity = 0.4 + Math.sin(this.time * 1.2) * 0.2;
            this.redLight.position.y = 30 + Math.sin(this.time * 0.5) * 5;
        }

        this.camera.position.x = Math.sin(this.time * 0.1) * 3;
        this.camera.position.y = 10 + Math.cos(this.time * 0.08) * 2;
        this.camera.lookAt(0, 0, 0);
    }

    animate() {
        if (this.isDestroyed) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        try {
            this.updateSecurityElements();
            
            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        } catch (error) {
            console.warn('Security Visualization animation error:', error);
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
            console.warn('Security Visualization resize error:', error);
        }
    }

    destroy() {
        this.isDestroyed = true;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        this.securityElements.forEach(element => {
            if (element.geometry) element.geometry.dispose();
            if (element.material) element.material.dispose();
        });
        this.securityElements = [];
        
        this.protectionFields.forEach(field => {
            if (field.geometry) field.geometry.dispose();
            if (field.material) field.material.dispose();
        });
        this.protectionFields = [];
        
        this.particles.forEach(particle => {
            if (particle.geometry) particle.geometry.dispose();
            if (particle.material) particle.material.dispose();
        });
        this.particles = [];
        
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
        
        this.scene = null;
        this.camera = null;
    }
}

// 완전히 개선된 파도 효과 Three.js 클래스 - 모든 방향 잘림 완전 해결
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
        this.scene = new THREE.Scene();
        
        // 화면을 완전히 커버하도록 더 넓은 범위로 카메라 설정 - 모든 방향 확장
        const baseWidth = window.innerWidth;
        const baseHeight = window.innerHeight;
        
        // 상하좌우 모든 방향으로 2배 확장
        const width = baseWidth * 2;
        const height = baseHeight * 2;
        
        this.camera = new THREE.OrthographicCamera(
            -width / 2, width / 2,
            height / 2, -height / 2,
            1, 1000
        );
        this.camera.position.z = 100;
        
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        
        // 캔버스 크기를 실제 컨테이너 크기에 맞게 설정
        this.renderer.setSize(baseWidth, baseHeight);
        this.renderer.setClearColor(0x000000, 0);
    }

    createWaves() {
        // 화면을 완전히 덮도록 파도 생성 범위 대대적 확장
        for (let i = 0; i < 20; i++) { // 15개에서 20개로 증가
            const geometry = new THREE.BufferGeometry();
            const vertices = [];
            
            // 화면 너비보다 훨씬 큰 범위로 설정 - 모든 방향 확장
            const waveWidth = window.innerWidth * 3.5; // 2.5배에서 3.5배로 증가
            const segments = 500; // 400에서 500으로 증가
            
            // 파도 정점 생성 - 완전한 좌우 상하 커버
            for (let j = 0; j <= segments; j++) {
                const x = (j / segments) * waveWidth - waveWidth / 2;
                vertices.push(x, 0, 0);
            }
            
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            
            const waveSettings = {
                amplitude: 50 + Math.random() * 80, // 진폭 더욱 증가
                frequency: 0.003 + Math.random() * 0.020, // 주파수 범위 더 확장
                speed: 0.1 + Math.random() * 2.5, // 속도 범위 더욱 확장
                phase: Math.random() * Math.PI * 2,
                opacity: 0.08 + Math.random() * 0.45, // 더 다양한 투명도
                yOffset: (Math.random() - 0.5) * window.innerHeight * 2.5, // 수직 범위 대폭 확장
                horizontalFlow: (Math.random() - 0.5) * 5, // 수평 흐름 더 강화
                verticalFlow: (Math.random() - 0.5) * 3 // 수직 흐름 추가
            };
            
            const material = new THREE.LineBasicMaterial({
                color: new THREE.Color().setHSL(0, 0, 0.8 + Math.random() * 0.2), // 더 밝게
                transparent: true,
                opacity: waveSettings.opacity,
                linewidth: 8 // 선 굵기 더 증가
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
            
            // 각 정점의 Y 좌표를 매우 복잡한 곡선 파도로 업데이트
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                
                // 다중 사인파 조합으로 더욱 자연스러운 파도 생성
                const baseWave = Math.sin(x * settings.frequency + this.time * settings.speed + settings.phase);
                const harmonicWave1 = Math.sin(x * settings.frequency * 2.3 + this.time * settings.speed * 1.5 + settings.phase) * 0.4;
                const harmonicWave2 = Math.sin(x * settings.frequency * 0.6 + this.time * settings.speed * 0.9 + settings.phase) * 0.7;
                const complexWave = Math.sin(x * settings.frequency * 1.7 + this.time * settings.speed * 1.2 + settings.phase) * 0.3;
                const noiseWave1 = Math.sin(x * settings.frequency * 3.5 + this.time * settings.speed * 0.7) * 0.2;
                const noiseWave2 = Math.cos(x * settings.frequency * 2.8 + this.time * settings.speed * 0.5) * 0.15;
                
                // 더 복잡한 파동 패턴
                const turbulence = Math.sin(x * settings.frequency * 4.2 + this.time * settings.speed * 0.8) * 0.1;
                
                positions[i + 1] = (baseWave + harmonicWave1 + harmonicWave2 + complexWave + noiseWave1 + noiseWave2 + turbulence) * settings.amplitude;
            }
            
            wave.geometry.attributes.position.needsUpdate = true;
            
            // 파도의 다방향 이동 - 완전한 흐름을 위한 대폭 개선
            const horizontalMovement = Math.sin(this.time * 0.05 + index * 0.5) * 6 + settings.horizontalFlow;
            const verticalMovement = Math.cos(this.time * 0.03 + index * 0.4) * 4 + settings.verticalFlow;
            const diagonalMovement = Math.sin(this.time * 0.04 + index * 0.6) * 3;
            
            wave.position.x = horizontalMovement + diagonalMovement;
            wave.position.y = settings.yOffset + verticalMovement;
            
            // 투명도 변화 - 더욱 다이나믹하게
            const opacityVariation = Math.sin(this.time * 0.4 + index * 0.6) * 0.25;
            const baseOpacity = Math.max(0.03, settings.opacity + opacityVariation);
            wave.material.opacity = baseOpacity;
            
            // 색상 변화 더 강화
            const hueShift = Math.sin(this.time * 0.08 + index * 0.25) * 0.15;
            const lightnessShift = Math.cos(this.time * 0.06 + index * 0.3) * 0.1;
            wave.material.color.setHSL(0, 0, 0.8 + hueShift + lightnessShift);
            
            // 파도 회전 효과 추가
            wave.rotation.z = Math.sin(this.time * 0.02 + index * 0.1) * 0.05;
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
            // 새로운 화면 크기에 맞게 더 넓은 범위로 설정 - 모든 방향 확장
            const baseWidth = window.innerWidth;
            const baseHeight = window.innerHeight;
            
            // 상하좌우 모든 방향으로 2배 확장
            const width = baseWidth * 2;
            const height = baseHeight * 2;
            
            // 카메라 범위를 새로운 화면 크기에 맞게 조정
            this.camera.left = -width / 2;
            this.camera.right = width / 2;
            this.camera.top = height / 2;
            this.camera.bottom = -height / 2;
            this.camera.updateProjectionMatrix();
            
            // 렌더러 크기 조정
            this.renderer.setSize(baseWidth, baseHeight);
            
            // 파도 범위도 새로운 화면 크기에 맞게 재생성
            this.recreateWaves();
            
        } catch (error) {
            console.warn('Wave resize error:', error);
        }
    }

    recreateWaves() {
        // 기존 파도 제거
        this.waves.forEach(wave => {
            if (wave && wave.geometry) {
                wave.geometry.dispose();
            }
            if (wave && wave.material) {
                wave.material.dispose();
            }
            if (wave) {
                this.scene.remove(wave);
            }
        });
        this.waves = [];
        
        // 새로운 화면 크기에 맞는 파도 생성
        this.createWaves();
    }

    destroy() {
        this.isDestroyed = true;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        this.waves.forEach(wave => {
            if (wave && wave.geometry) {
                wave.geometry.dispose();
            }
            if (wave && wave.material) {
                wave.material.dispose();
            }
        });
        this.waves = [];
        
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
        
        this.scene = null;
        this.camera = null;
    }
}

// 자연스러운 흐르는 3D 배경 효과 클래스
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
        this.scene = new THREE.Scene();
        
        const aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        this.camera.position.set(0, 20, 60);
        this.camera.lookAt(0, 0, 0);
        
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

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(30, 50, 20);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

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
            
            mesh.position.set(
                (Math.random() - 0.5) * 120,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 80
            );
            
            mesh.userData = {
                initialPosition: mesh.position.clone(),
                flowSpeed: Math.random() * 0.008 + 0.005,
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
        const particleCount = 300;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        this.particleData = [];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

            const colorPhase = Math.random();
            if (colorPhase < 0.33) {
                colors[i * 3] = 0.13 + Math.random() * 0.2;
                colors[i * 3 + 1] = 0.77 + Math.random() * 0.2;
                colors[i * 3 + 2] = 0.37 + Math.random() * 0.3;
            } else if (colorPhase < 0.66) {
                colors[i * 3] = 1;
                colors[i * 3 + 1] = 0.45 + Math.random() * 0.3;
                colors[i * 3 + 2] = 0.1 + Math.random() * 0.2;
            } else {
                colors[i * 3] = 0.23 + Math.random() * 0.3;
                colors[i * 3 + 1] = 0.51 + Math.random() * 0.3;
                colors[i * 3 + 2] = 0.96;
            }

            sizes[i] = Math.random() * 2 + 0.5;

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
        this.time += 0.008;
        
        this.geometries.forEach((mesh, index) => {
            const userData = mesh.userData;
            
            if (userData.flowSpeed) {
                const waveX = Math.sin(this.time * userData.flowSpeed + userData.phaseOffset) * userData.flowAmplitude.x;
                const waveY = Math.sin(this.time * userData.flowSpeed * 1.3 + userData.phaseOffset + Math.PI / 3) * userData.flowAmplitude.y;
                const waveZ = Math.cos(this.time * userData.flowSpeed * 0.8 + userData.phaseOffset) * userData.flowAmplitude.z;
                
                mesh.position.x = userData.initialPosition.x + waveX;
                mesh.position.y = userData.initialPosition.y + waveY;
                mesh.position.z = userData.initialPosition.z + waveZ;
                
                mesh.rotation.x += userData.rotationSpeed.x;
                mesh.rotation.y += userData.rotationSpeed.y;
                mesh.rotation.z += userData.rotationSpeed.z;
                
                const scaleWave = Math.sin(this.time * userData.flowSpeed * 2 + userData.phaseOffset) * 0.2 + 1;
                mesh.scale.setScalar(userData.scaleWave * scaleWave);
            }
        });

        this.particles.forEach(particle => {
            const positions = particle.geometry.attributes.position.array;
            
            for (let i = 0; i < this.particleData.length; i++) {
                const data = this.particleData[i];
                const i3 = i * 3;
                
                const flowWaveX = Math.sin(this.time * data.flowSpeed + data.phaseOffset) * data.waveAmplitude;
                const flowWaveY = Math.cos(this.time * data.flowSpeed * 1.2 + data.phaseOffset) * (data.waveAmplitude * 0.6);
                const flowWaveZ = Math.sin(this.time * data.flowSpeed * 0.9 + data.phaseOffset + Math.PI / 4) * (data.waveAmplitude * 0.8);
                
                positions[i3] = data.originalX + flowWaveX;
                positions[i3 + 1] = data.originalY + flowWaveY;
                positions[i3 + 2] = data.originalZ + flowWaveZ;
            }
            
            particle.geometry.attributes.position.needsUpdate = true;
        });

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
        
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
        
        this.scene = null;
        this.camera = null;
        this.particleData = null;
    }
}

// 전역 객체로 내보내기
if (typeof window !== 'undefined') {
    window.ThreeEffects = {
        SecurityVisualization,
        WaveEffect,
        FlowingBackground3D
    };
}