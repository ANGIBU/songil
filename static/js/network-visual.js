// static/js/network-visual.js

// 네트워크 시각화 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeNetworkVisual();
});

function initializeNetworkVisual() {
    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;
    
    // Canvas 요소 생성
    const canvasElement = document.createElement('canvas');
    canvasElement.width = 400;
    canvasElement.height = 400;
    canvasElement.style.width = '100%';
    canvasElement.style.height = '100%';
    
    canvas.innerHTML = '';
    canvas.appendChild(canvasElement);
    
    const ctx = canvasElement.getContext('2d');
    
    // 네트워크 노드와 연결선 데이터
    const nodes = [];
    const connections = [];
    const nodeCount = 15;
    const centerX = canvasElement.width / 2;
    const centerY = canvasElement.height / 2;
    
    // 노드 생성
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: centerX + Math.cos(i * 2 * Math.PI / nodeCount) * (80 + Math.random() * 80),
            y: centerY + Math.sin(i * 2 * Math.PI / nodeCount) * (80 + Math.random() * 80),
            originalX: centerX + Math.cos(i * 2 * Math.PI / nodeCount) * (80 + Math.random() * 80),
            originalY: centerY + Math.sin(i * 2 * Math.PI / nodeCount) * (80 + Math.random() * 80),
            radius: 3 + Math.random() * 4,
            color: `hsla(${210 + Math.random() * 30}, 70%, ${60 + Math.random() * 20}%, 0.8)`,
            pulse: Math.random() * Math.PI * 2,
            speed: 0.02 + Math.random() * 0.03
        });
    }
    
    // 중앙 노드 추가
    nodes.push({
        x: centerX,
        y: centerY,
        originalX: centerX,
        originalY: centerY,
        radius: 8,
        color: '#ffffff',
        pulse: 0,
        speed: 0.01,
        isCenter: true
    });
    
    // 연결선 생성
    for (let i = 0; i < nodeCount; i++) {
        // 중앙 노드와 연결
        connections.push({
            from: i,
            to: nodeCount,
            opacity: 0.3 + Math.random() * 0.4
        });
        
        // 인접 노드들과 연결
        if (Math.random() > 0.6) {
            connections.push({
                from: i,
                to: (i + 1) % nodeCount,
                opacity: 0.2 + Math.random() * 0.3
            });
        }
        
        if (Math.random() > 0.8) {
            connections.push({
                from: i,
                to: (i + 2) % nodeCount,
                opacity: 0.1 + Math.random() * 0.2
            });
        }
    }
    
    let animationFrame;
    let mouseX = 0;
    let mouseY = 0;
    
    // 마우스 이벤트
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) * (canvasElement.width / rect.width);
        mouseY = (e.clientY - rect.top) * (canvasElement.height / rect.height);
    });
    
    canvas.addEventListener('mouseleave', function() {
        mouseX = centerX;
        mouseY = centerY;
    });
    
    // 애니메이션 루프
    function animate() {
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        
        // 배경 그라디언트
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
        
        // 노드 위치 업데이트 (마우스 인터랙션)
        nodes.forEach((node, index) => {
            if (!node.isCenter) {
                const dx = mouseX - node.originalX;
                const dy = mouseY - node.originalY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 100;
                
                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance * 30;
                    node.x = node.originalX + (dx / distance) * force;
                    node.y = node.originalY + (dy / distance) * force;
                } else {
                    node.x += (node.originalX - node.x) * 0.1;
                    node.y += (node.originalY - node.y) * 0.1;
                }
                
                // 펄스 애니메이션
                node.pulse += node.speed;
            }
        });
        
        // 연결선 그리기
        connections.forEach(conn => {
            const fromNode = nodes[conn.from];
            const toNode = nodes[conn.to];
            
            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(toNode.x, toNode.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${conn.opacity * 0.6})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        });
        
        // 노드 그리기
        nodes.forEach((node, index) => {
            const pulseSize = node.isCenter ? 
                node.radius + Math.sin(node.pulse * 2) * 2 : 
                node.radius + Math.sin(node.pulse) * 1;
                
            // 노드 글로우 효과
            const glowGradient = ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, pulseSize * 2
            );
            glowGradient.addColorStop(0, node.color);
            glowGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, pulseSize * 2, 0, Math.PI * 2);
            ctx.fillStyle = glowGradient;
            ctx.fill();
            
            // 노드 본체
            ctx.beginPath();
            ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.fill();
            
            // 중앙 노드에 아이콘 표시
            if (node.isCenter) {
                ctx.fillStyle = '#3b82f6';
                ctx.font = '20px FontAwesome';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🔗', node.x, node.y);
            }
        });
        
        animationFrame = requestAnimationFrame(animate);
    }
    
    // 애니메이션 시작
    animate();
    
    // 리사이즈 처리
    window.addEventListener('resize', function() {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            canvasElement.style.width = '100%';
            canvasElement.style.height = '100%';
        }
    });
    
    // 컴포넌트 정리
    return function cleanup() {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    };
}

// 파티클 효과 (선택사항)
function createParticleEffect(canvas) {
    const particles = [];
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: Math.random(),
            maxLife: 1,
            size: Math.random() * 2 + 1
        });
    }
    
    return particles;
}

// 성능 최적화를 위한 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}