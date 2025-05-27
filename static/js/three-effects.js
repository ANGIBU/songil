// static/js/three-effects.js

/* ===== Three.js 3D 효과 전용 파일 - Three.js 코드 제거됨 ===== */

// Three.js 효과들이 제거되었습니다.
// 기존 그라데이션 배경만 사용합니다.
// 호환성을 위해 빈 클래스들을 유지합니다.

console.log('Three.js effects disabled - using CSS gradients only');

// 보안 시각화 클래스 - 비활성화됨
class SecurityVisualization {
    constructor(canvas, container) {
        this.canvas = canvas;
        this.container = container;
        this.isDestroyed = true; // 즉시 비활성화
        console.log('SecurityVisualization disabled');
    }

    init() {
        // Three.js 코드 제거됨 - 아무것도 하지 않음
        return;
    }

    setupScene() {
        // Three.js 코드 제거됨
        return;
    }

    createSecurityElements() {
        // Three.js 코드 제거됨
        return;
    }

    createProtectionShields() {
        // Three.js 코드 제거됨
        return;
    }

    createSecurityCameras() {
        // Three.js 코드 제거됨
        return;
    }

    createSafetyNetwork() {
        // Three.js 코드 제거됨
        return;
    }

    createPatrollingElements() {
        // Three.js 코드 제거됨
        return;
    }

    createSecurityParticles() {
        // Three.js 코드 제거됨
        return;
    }

    updateSecurityElements() {
        // Three.js 코드 제거됨
        return;
    }

    animate() {
        // Three.js 코드 제거됨 - 애니메이션 루프 비활성화
        return;
    }

    onWindowResize() {
        // Three.js 코드 제거됨
        return;
    }

    destroy() {
        this.isDestroyed = true;
        console.log('SecurityVisualization destroyed (was already disabled)');
    }
}

// 파도 효과 클래스 - 비활성화됨
class WaveEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.isDestroyed = true; // 즉시 비활성화
        console.log('WaveEffect disabled');
    }

    init() {
        // Three.js 코드 제거됨 - 아무것도 하지 않음
        return;
    }

    setupScene() {
        // Three.js 코드 제거됨
        return;
    }

    createWaves() {
        // Three.js 코드 제거됨
        return;
    }

    updateWaves() {
        // Three.js 코드 제거됨
        return;
    }

    animate() {
        // Three.js 코드 제거됨 - 애니메이션 루프 비활성화
        return;
    }

    onWindowResize() {
        // Three.js 코드 제거됨
        return;
    }

    recreateWaves() {
        // Three.js 코드 제거됨
        return;
    }

    destroy() {
        this.isDestroyed = true;
        console.log('WaveEffect destroyed (was already disabled)');
    }
}

// 자연스러운 흐르는 3D 배경 효과 클래스 - 비활성화됨
class FlowingBackground3D {
    constructor(canvas, container) {
        this.canvas = canvas;
        this.container = container;
        this.isDestroyed = true; // 즉시 비활성화
        console.log('FlowingBackground3D disabled');
    }

    init() {
        // Three.js 코드 제거됨 - 아무것도 하지 않음
        return;
    }

    setupScene() {
        // Three.js 코드 제거됨
        return;
    }

    createObjects() {
        // Three.js 코드 제거됨
        return;
    }

    createFlowingGeometries() {
        // Three.js 코드 제거됨
        return;
    }

    createStreamingParticles() {
        // Three.js 코드 제거됨
        return;
    }

    createWavyConnections() {
        // Three.js 코드 제거됨
        return;
    }

    updateFlowingMotion() {
        // Three.js 코드 제거됨
        return;
    }

    animate() {
        // Three.js 코드 제거됨 - 애니메이션 루프 비활성화
        return;
    }

    onWindowResize() {
        // Three.js 코드 제거됨
        return;
    }

    destroy() {
        this.isDestroyed = true;
        console.log('FlowingBackground3D destroyed (was already disabled)');
    }
}

// 전역 객체로 내보내기 - 호환성 유지
if (typeof window !== 'undefined') {
    window.ThreeEffects = {
        SecurityVisualization: SecurityVisualization,
        WaveEffect: WaveEffect,
        FlowingBackground3D: FlowingBackground3D
    };
    
    // 디버깅을 위한 정보
    console.log('ThreeEffects classes available but disabled:', {
        SecurityVisualization: 'disabled',
        WaveEffect: 'disabled', 
        FlowingBackground3D: 'disabled'
    });
}

// CSS 그라데이션만 사용하는 메시지
console.log('Using clean CSS gradient backgrounds instead of Three.js effects');

// 개발자를 위한 정보
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('%c🎨 Three.js Effects Disabled', 'color: #f97316; font-size: 14px; font-weight: bold;');
    console.log('%c✨ Now using clean CSS gradients for better performance', 'color: #22c55e; font-size: 12px;');
}