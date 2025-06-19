// static/js/about.js

// React 컴포넌트를 활용한 About 페이지 관리
const { useState, useEffect } = React;

// FAQ 데이터
const faqData = [
    {
        id: 1,
        question: "실종자 신고는 어떻게 하나요?",
        answer: "회원가입 후 '신고하기' 메뉴에서 실종자의 기본 정보, 사진, 실종 상황 등을 입력하면 됩니다. 신고된 정보는 관리자의 검토를 거쳐 경찰청에 전달되며, 승인 후 플랫폼에 공개됩니다."
    },
    {
        id: 2,
        question: "목격 신고시 포인트는 얼마나 받나요?",
        answer: "목격 신고의 정확성과 유용성에 따라 50P~500P까지 차등 지급됩니다. 실종자 발견에 결정적 도움을 준 정보는 추가 보너스 포인트를 받을 수 있습니다."
    },
    {
        id: 3,
        question: "개인정보는 어떻게 보호되나요?",
        answer: "실명은 이니셜로 처리되며, 연락처 등 민감한 정보는 암호화되어 관리자만 접근 가능합니다. 또한 실종자 발견 후에는 관련 게시물이 자동으로 비공개 처리됩니다."
    },
    {
        id: 4,
        question: "허위 신고나 목격 신고에 대한 제재가 있나요?",
        answer: "허위 신고가 확인되면 계정 정지 및 법적 조치가 취해질 수 있습니다. 정확하고 성실한 신고만이 실종자를 찾는데 도움이 됩니다."
    },
    {
        id: 5,
        question: "경찰청과는 어떻게 연계되나요?",
        answer: "공공데이터 API를 통해 경찰청 실종자 정보 시스템과 실시간 연동됩니다. 신고된 정보는 즉시 관할 경찰서에 전달되어 공식 수사가 시작됩니다."
    },
    {
        id: 6,
        question: "포인트로 무엇을 할 수 있나요?",
        answer: "포인트샵에서 다양한 기프티콘(카페, 편의점, 온라인 쇼핑몰 등)으로 교환하거나 랜덤박스를 구매할 수 있습니다. 또한 일정 포인트 이상 보유시 특별 혜택을 받을 수 있습니다."
    }
];

// FAQ 컴포넌트
function FAQComponent() {
    const [activeId, setActiveId] = useState(null);

    const toggleFAQ = (id) => {
        setActiveId(activeId === id ? null : id);
    };

    return React.createElement('div', { className: 'faq-list' },
        faqData.map(item => 
            React.createElement('div', {
                key: item.id,
                className: `faq-item ${activeId === item.id ? 'active' : ''}`,
            }, [
                React.createElement('div', {
                    className: 'faq-question',
                    onClick: () => toggleFAQ(item.id),
                    key: 'question'
                }, [
                    React.createElement('h3', { key: 'title' }, item.question),
                    React.createElement('i', { 
                        className: 'fas fa-chevron-down',
                        key: 'icon'
                    })
                ]),
                React.createElement('div', {
                    className: 'faq-answer',
                    key: 'answer'
                }, React.createElement('p', {}, item.answer))
            ])
        )
    );
}

// 통계 카운터 애니메이션
class CounterAnimation {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = parseInt(target.replace(/[,%]/g, ''));
        this.duration = duration;
        this.hasPercent = target.includes('%');
        this.startAnimation();
    }

    startAnimation() {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            
            // Ease-out function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(this.target * easeOut);
            
            this.element.textContent = current.toLocaleString() + (this.hasPercent ? '%' : '');
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }
}

// 3D 시각화 효과 (Three.js 활용)
class ThreeDVisualization {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.init();
    }

    init() {
        if (typeof THREE === 'undefined') {
            this.createFallback();
            return;
        }

        // Scene 설정
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        this.renderer.setSize(200, 200);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        // 파티클 생성
        this.createParticles();
        
        // 카메라 위치
        this.camera.position.z = 5;
        
        // 애니메이션 시작
        this.animate();
        
        // 리사이즈 핸들러
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];

        for (let i = 0; i < 50; i++) {
            // 위치
            vertices.push(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8
            );
            
            // 색상 (파란색 계열)
            colors.push(
                0.2 + Math.random() * 0.3,  // R
                0.5 + Math.random() * 0.3,  // G
                0.8 + Math.random() * 0.2   // B
            );
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);

        // 연결선 추가
        this.createConnections();
    }

    createConnections() {
        const positions = this.particles.geometry.attributes.position.array;
        const lineGeometry = new THREE.BufferGeometry();
        const lineVertices = [];

        // 일부 점들을 연결
        for (let i = 0; i < positions.length; i += 9) {
            if (i + 6 < positions.length) {
                lineVertices.push(
                    positions[i], positions[i + 1], positions[i + 2],
                    positions[i + 3], positions[i + 4], positions[i + 5]
                );
            }
        }

        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lineVertices, 3));
        
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.3
        });

        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.scene.add(lines);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.particles) {
            this.particles.rotation.x += 0.001;
            this.particles.rotation.y += 0.002;
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        if (!this.renderer) return;
        
        this.camera.aspect = 1;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(200, 200);
    }

    createFallback() {
        this.container.innerHTML = `
            <div style="
                width: 200px;
                height: 200px;
                background: linear-gradient(135deg, #3b82f6, #60a5fa);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 3rem;
                box-shadow: 0 20px 60px rgba(59, 130, 246, 0.3);
            ">
                <i class="fas fa-users"></i>
            </div>
        `;
    }
}

// GSAP 스크롤 애니메이션
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        if (typeof gsap === 'undefined') return;

        // ScrollTrigger 등록
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        this.setupAnimations();
    }

    setupAnimations() {
        // 히어로 섹션 애니메이션
        gsap.timeline({ delay: 0.5 })
            .from('.hero-content h1', {
                duration: 1,
                y: 50,
                opacity: 0,
                ease: 'power3.out'
            })
            .from('.hero-subtitle', {
                duration: 0.8,
                y: 30,
                opacity: 0,
                ease: 'power2.out'
            }, '-=0.5')
            .from('.hero-stats .stat', {
                duration: 0.6,
                y: 20,
                opacity: 0,
                stagger: 0.2,
                ease: 'power2.out'
            }, '-=0.3');

        // 미션/비전 카드 애니메이션
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.from('.mission-card, .vision-card', {
                scrollTrigger: {
                    trigger: '.mission-vision',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 50,
                opacity: 0,
                stagger: 0.3,
                ease: 'power2.out'
            });

            // 프로세스 스텝 애니메이션
            gsap.from('.process-step', {
                scrollTrigger: {
                    trigger: '.how-it-works',
                    start: 'top 70%',
                    end: 'bottom 30%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                x: -50,
                opacity: 0,
                stagger: 0.2,
                ease: 'power2.out'
            });

            // 기능 카드 애니메이션
            gsap.from('.feature-card', {
                scrollTrigger: {
                    trigger: '.key-features',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.6,
                y: 40,
                opacity: 0,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }

        // 배경 애니메이션
        this.setupBackgroundAnimation();
    }

    setupBackgroundAnimation() {
        // 플로팅 애니메이션
        gsap.to('.visual-icon', {
            y: -20,
            duration: 3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });

        // 파티클 효과
        this.createFloatingElements();
    }

    createFloatingElements() {
        const container = document.querySelector('.about-header');
        if (!container) return;

        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${4 + Math.random() * 6}px;
                height: ${4 + Math.random() * 6}px;
                background: rgba(59, 130, 246, 0.3);
                border-radius: 50%;
                pointer-events: none;
                z-index: 0;
            `;
            
            container.appendChild(particle);
            
            gsap.set(particle, {
                x: Math.random() * container.offsetWidth,
                y: Math.random() * container.offsetHeight
            });
            
            gsap.to(particle, {
                y: '-=50',
                x: `+=${Math.random() * 100 - 50}`,
                duration: 8 + Math.random() * 4,
                ease: 'none',
                repeat: -1,
                yoyo: true,
                delay: Math.random() * 2
            });
        }
    }
}

// 부드러운 스크롤
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(window, {
                            duration: 1.2,
                            scrollTo: { y: targetElement.offsetTop - 100 },
                            ease: 'power3.inOut'
                        });
                    } else {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }
}

// Intersection Observer를 활용한 요소 관찰
class ElementObserver {
    constructor() {
        this.observedElements = new Set();
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
                    
                    // 통계 카운터 애니메이션 트리거
                    if (entry.target.classList.contains('stat')) {
                        this.animateCounter(entry.target);
                    }
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        });
    }

    observeElements() {
        const elementsToObserve = document.querySelectorAll(
            '.stat, .mission-card, .vision-card, .feature-card, .process-step'
        );
        
        elementsToObserve.forEach(el => {
            this.observer.observe(el);
        });
    }

    animateCounter(statElement) {
        const numberElement = statElement.querySelector('.number');
        if (numberElement && !this.observedElements.has(numberElement)) {
            this.observedElements.add(numberElement);
            const target = numberElement.textContent;
            new CounterAnimation(numberElement, target);
        }
    }
}

// 메인 About 페이지 클래스
class AboutPage {
    constructor() {
        this.init();
    }

    init() {
        // DOM이 로드된 후 초기화
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // React FAQ 컴포넌트 렌더링
        this.renderFAQComponent();
        
        // 3D 시각화 초기화
        this.init3DVisualization();
        
        // 애니메이션 초기화
        this.scrollAnimations = new ScrollAnimations();
        
        // 부드러운 스크롤 초기화
        this.smoothScroll = new SmoothScroll();
        
        // 요소 관찰자 초기화
        this.elementObserver = new ElementObserver();
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        console.log('About page initialized successfully');
    }

    renderFAQComponent() {
        const faqContainer = document.querySelector('.faq-list');
        if (faqContainer && typeof React !== 'undefined') {
            const root = ReactDOM.createRoot(faqContainer);
            root.render(React.createElement(FAQComponent));
        } else {
            // React가 없는 경우 일반 JavaScript로 FAQ 구현
            this.setupVanillaFAQ();
        }
    }

    setupVanillaFAQ() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.faq-question')) {
                const faqItem = e.target.closest('.faq-item');
                const isActive = faqItem.classList.contains('active');
                
                // 모든 FAQ 닫기
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // 클릭된 FAQ 토글
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            }
        });
    }

    init3DVisualization() {
        const visualContainer = document.querySelector('.visual-icon');
        if (visualContainer) {
            new ThreeDVisualization(visualContainer);
        }
    }

    setupEventListeners() {
        // 윈도우 리사이즈 핸들러
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // 키보드 네비게이션
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }

    handleResize() {
        // 반응형 조정
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }

    handleKeyboardNavigation(e) {
        // 접근성을 위한 키보드 네비게이션
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
        
        if (e.key === 'Escape') {
            // 열린 FAQ 닫기
            document.querySelectorAll('.faq-item.active').forEach(item => {
                item.classList.remove('active');
            });
        }
    }
}

// 페이지 로드 시 자동 초기화
new AboutPage();

// 전역 함수 (하위 호환성을 위해)
window.toggleFAQ = function(element) {
    const faqItem = element.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // 모든 FAQ 닫기
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 클릭된 FAQ 토글
    if (!isActive) {
        faqItem.classList.add('active');
    }
};

// 디버깅을 위한 개발자 도구
if (process?.env?.NODE_ENV === 'development') {
    window.aboutPageDebug = {
        reinitialize: () => new AboutPage(),
        testAnimations: () => {
            if (typeof gsap !== 'undefined') {
                gsap.to('.feature-card', {
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