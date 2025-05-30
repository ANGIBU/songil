// static/js/missing-detail.js

// 실종자 상세 페이지 JavaScript
let isBookmarked = false;
let upClicked = false;
let recommendClicked = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeMissingDetail();
});

function initializeMissingDetail() {
    // 페이지 로드 애니메이션
    animatePageLoad();
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 스크롤 애니메이션 설정
    setupScrollAnimations();
    
    // 이미지 레이지 로딩
    setupLazyLoading();
}

// 페이지 로드 애니메이션
function animatePageLoad() {
    // GSAP 사용 가능 여부 확인
    if (typeof gsap !== 'undefined') {
        // 기본 정보 섹션 애니메이션
        gsap.timeline()
            .from('.profile-image-section', {
                duration: 0.8,
                x: -30,
                opacity: 0,
                ease: 'power3.out'
            })
            .from('.profile-details', {
                duration: 0.8,
                x: 30,
                opacity: 0,
                ease: 'power3.out'
            }, '-=0.4')
            .from('.info-item', {
                duration: 0.5,
                y: 20,
                opacity: 0,
                stagger: 0.1,
                ease: 'power2.out'
            }, '-=0.3')
            .from('.action-btn', {
                duration: 0.6,
                scale: 0.8,
                opacity: 0,
                stagger: 0.15,
                ease: 'back.out(1.7)'
            }, '-=0.2');
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 스크롤 시 헤더 효과
    let lastScroll = 0;
    window.addEventListener('scroll', throttle(() => {
        const currentScroll = window.pageYOffset;
        const header = document.querySelector('.header');
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, 100));
    
    // 이미지 썸네일 클릭 이벤트
    document.querySelectorAll('.image-thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function() {
            changeMainImage(this);
        });
    });
    
    // 키보드 네비게이션
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // ESC 키로 모달이나 팝업 닫기
            closeAllModals();
        }
    });
}

// 스크롤 애니메이션 설정
function setupScrollAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // 관련 실종자 카드 애니메이션
        gsap.utils.toArray('.missing-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.6,
                y: 50,
                opacity: 0,
                delay: index * 0.1,
                ease: 'power2.out'
            });
        });
        
        // 목격 정보 애니메이션
        gsap.utils.toArray('.witness-item').forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.6,
                x: -30,
                opacity: 0,
                delay: index * 0.15,
                ease: 'power2.out'
            });
        });
    }
}

// 메인 이미지 변경
function changeMainImage(thumbnail) {
    const mainImage = document.getElementById('mainImage');
    const newSrc = thumbnail.querySelector('img').src;
    
    // 이미 활성화된 썸네일이면 무시
    if (thumbnail.classList.contains('active')) return;
    
    // 기존 활성 썸네일 제거
    document.querySelectorAll('.image-thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    
    // 새 썸네일 활성화
    thumbnail.classList.add('active');
    
    // 이미지 변경 애니메이션
    if (typeof gsap !== 'undefined') {
        gsap.to(mainImage, {
            duration: 0.2,
            opacity: 0,
            scale: 0.95,
            onComplete: () => {
                mainImage.src = newSrc;
                gsap.to(mainImage, {
                    duration: 0.3,
                    opacity: 1,
                    scale: 1,
                    ease: 'power2.out'
                });
            }
        });
    } else {
        // GSAP 없을 때 기본 처리
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = newSrc;
            mainImage.style.opacity = '1';
        }, 200);
    }
}

// UP 버튼 클릭
function handleUpClick() {
    if (upClicked) {
        showNotification('이미 UP을 누르셨습니다.', 'info');
        return;
    }
    
    const upBtn = document.querySelector('.up-btn');
    const upCount = document.getElementById('upCount');
    const currentCount = parseInt(upCount.textContent);
    const newCount = currentCount + 1;
    
    // 버튼 비활성화
    upClicked = true;
    upBtn.style.opacity = '0.7';
    upBtn.style.cursor = 'not-allowed';
    
    // 카운트 애니메이션
    if (typeof gsap !== 'undefined') {
        // 버튼 애니메이션
        gsap.timeline()
            .to(upBtn, {
                duration: 0.1,
                scale: 0.95,
                ease: 'power2.in'
            })
            .to(upBtn, {
                duration: 0.3,
                scale: 1.1,
                ease: 'elastic.out(1, 0.5)'
            })
            .to(upBtn, {
                duration: 0.2,
                scale: 1,
                ease: 'power2.out'
            });
        
        // 숫자 카운트업 애니메이션
        const countObj = { count: currentCount };
        gsap.to(countObj, {
            count: newCount,
            duration: 0.6,
            ease: 'power2.out',
            onUpdate: function() {
                upCount.textContent = Math.floor(countObj.count);
            }
        });
        
        // 파티클 효과
        createParticleEffect(upBtn);
    } else {
        // GSAP 없을 때
        upCount.textContent = newCount;
    }
    
    // 알림 표시
    showNotification('UP을 눌렀습니다! 실종자 찾기에 도움이 됩니다.', 'success');
    
    // 서버에 UP 정보 전송
    sendUpToServer(newCount);
}

// 추천 버튼 클릭
function handleRecommendClick() {
    if (recommendClicked) {
        showNotification('이미 응원하셨습니다.', 'info');
        return;
    }
    
    const recommendBtn = document.querySelector('.recommendation-btn');
    const recommendCount = document.getElementById('recommendCount');
    const currentCount = parseInt(recommendCount.textContent);
    const newCount = currentCount + 1;
    
    // 버튼 활성화
    recommendClicked = true;
    recommendBtn.classList.add('active');
    
    // 카운트 애니메이션
    if (typeof gsap !== 'undefined') {
        // 버튼 애니메이션
        gsap.timeline()
            .to(recommendBtn, {
                duration: 0.1,
                scale: 0.9,
                ease: 'power2.in'
            })
            .to(recommendBtn, {
                duration: 0.4,
                scale: 1.2,
                ease: 'elastic.out(1, 0.5)'
            })
            .to(recommendBtn, {
                duration: 0.2,
                scale: 1,
                ease: 'power2.out'
            });
        
        // 숫자 카운트업 애니메이션
        const countObj = { count: currentCount };
        gsap.to(countObj, {
            count: newCount,
            duration: 0.6,
            ease: 'power2.out',
            onUpdate: function() {
                recommendCount.textContent = Math.floor(countObj.count);
            }
        });
        
        // 응원 파티클 효과
        createSupportParticleEffect(recommendBtn);
    } else {
        // GSAP 없을 때
        recommendCount.textContent = newCount;
    }
    
    // 알림 표시
    showNotification('응원했습니다! 실종자 찾기에 도움이 됩니다.', 'success');
    
    // 서버에 추천 정보 전송
    sendRecommendToServer(newCount);
}

// UP 파티클 효과
function createParticleEffect(element) {
    if (typeof gsap === 'undefined') return;
    
    const rect = element.getBoundingClientRect();
    const particles = 10;
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.className = 'up-particle';
        particle.innerHTML = '<i class="fas fa-arrow-up"></i>';
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            color: var(--secondary-green);
            font-size: 20px;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (i / particles) * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        
        gsap.to(particle, {
            duration: 1,
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance - 30,
            opacity: 0,
            scale: 0.3,
            ease: 'power2.out',
            onComplete: () => particle.remove()
        });
    }
}

// 응원 파티클 효과
function createSupportParticleEffect(element) {
    if (typeof gsap === 'undefined') return;
    
    const rect = element.getBoundingClientRect();
    const particles = 8;
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.className = 'support-particle';
        particle.innerHTML = '<i class="fas fa-arrow-up"></i>';
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            color: var(--secondary-green);
            font-size: 16px;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (i / particles) * Math.PI * 2;
        const distance = 40 + Math.random() * 40;
        
        gsap.to(particle, {
            duration: 1.2,
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance - 40,
            opacity: 0,
            scale: 0.2,
            rotation: 360,
            ease: 'power2.out',
            onComplete: () => particle.remove()
        });
    }
}

// 북마크 토글
function toggleBookmark() {
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    const icon = bookmarkBtn.querySelector('i');
    
    isBookmarked = !isBookmarked;
    
    // 애니메이션
    if (typeof gsap !== 'undefined') {
        gsap.timeline()
            .to(bookmarkBtn, {
                duration: 0.1,
                scale: 0.8,
                ease: 'power2.in'
            })
            .to(bookmarkBtn, {
                duration: 0.3,
                scale: 1.1,
                ease: 'elastic.out(1, 0.5)',
                onComplete: () => {
                    // 아이콘 변경
                    if (isBookmarked) {
                        icon.className = 'fas fa-bookmark';
                        bookmarkBtn.classList.add('active');
                    } else {
                        icon.className = 'far fa-bookmark';
                        bookmarkBtn.classList.remove('active');
                    }
                }
            })
            .to(bookmarkBtn, {
                duration: 0.2,
                scale: 1,
                ease: 'power2.out'
            });
    } else {
        // GSAP 없을 때
        if (isBookmarked) {
            icon.className = 'fas fa-bookmark';
            bookmarkBtn.classList.add('active');
        } else {
            icon.className = 'far fa-bookmark';
            bookmarkBtn.classList.remove('active');
        }
    }
    
    // 알림 표시
    if (isBookmarked) {
        showNotification('관심 실종자로 등록되었습니다.', 'success');
    } else {
        showNotification('관심 실종자에서 해제되었습니다.', 'info');
    }
    
    // 서버에 북마크 상태 전송
    sendBookmarkToServer(isBookmarked);
}

// 콘텐츠 공유
function shareContent() {
    const shareData = {
        title: '실종자 찾기 - 김○○ (32세)',
        text: '실종자를 목격하신 분은 신고 부탁드립니다. 작은 정보도 큰 도움이 됩니다.',
        url: window.location.href
    };
    
    // Web Share API 지원 확인
    if (navigator.share && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        navigator.share(shareData)
            .then(() => {
                showNotification('공유가 완료되었습니다.', 'success');
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    copyToClipboard();
                }
            });
    } else {
        // 데스크톱에서는 공유 모달 표시
        showShareModal(shareData);
    }
}

// 공유 모달 표시
function showShareModal(shareData) {
    const modalHTML = `
        <div class="share-modal-overlay" id="shareModal">
            <div class="share-modal">
                <div class="share-modal-header">
                    <h3>공유하기</h3>
                    <button class="modal-close" onclick="closeShareModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="share-modal-body">
                    <div class="share-options">
                        <button class="share-option" onclick="shareToKakao()">
                            <img src="/static/images/kakao-icon.png" alt="카카오톡">
                            <span>카카오톡</span>
                        </button>
                        <button class="share-option" onclick="shareToFacebook()">
                            <i class="fab fa-facebook-f"></i>
                            <span>페이스북</span>
                        </button>
                        <button class="share-option" onclick="shareToTwitter()">
                            <i class="fab fa-twitter"></i>
                            <span>트위터</span>
                        </button>
                        <button class="share-option" onclick="copyToClipboard()">
                            <i class="fas fa-link"></i>
                            <span>링크 복사</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 모달 페이드인
    setTimeout(() => {
        document.getElementById('shareModal').classList.add('active');
    }, 10);
}

// 공유 모달 닫기
function closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// 링크 복사
function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showNotification('링크가 클립보드에 복사되었습니다.', 'success');
        closeShareModal();
    }).catch(() => {
        // 폴백: 구형 브라우저 지원
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('링크가 클립보드에 복사되었습니다.', 'success');
        closeShareModal();
    });
}

// 소셜 공유 함수들
function shareToKakao() {
    // 카카오 SDK 초기화 필요
    if (window.Kakao && window.Kakao.isInitialized()) {
        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '실종자 찾기 - 김○○ (32세)',
                description: '실종자를 목격하신 분은 신고 부탁드립니다.',
                imageUrl: window.location.origin + '/static/images/sample-missing-1.jpg',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href
                }
            }
        });
    } else {
        showNotification('카카오톡 공유 기능을 사용할 수 없습니다.', 'error');
    }
}

function shareToFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    closeShareModal();
}

function shareToTwitter() {
    const text = '실종자를 목격하신 분은 신고 부탁드립니다. 작은 정보도 큰 도움이 됩니다.';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
    closeShareModal();
}

// 이미지 레이지 로딩
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // 폴백: 모든 이미지 즉시 로드
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// 서버 통신 함수들
function sendUpToServer(newCount) {
    // 실제 구현 시 서버 API 호출
    fetch(`/api/missing/${getMissingId()}/up`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: newCount })
    }).catch(error => {
        console.error('UP 전송 실패:', error);
    });
}

function sendRecommendToServer(newCount) {
    // 실제 구현 시 서버 API 호출
    fetch(`/api/missing/${getMissingId()}/recommend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: newCount })
    }).catch(error => {
        console.error('추천 전송 실패:', error);
    });
}

function sendBookmarkToServer(bookmarked) {
    // 실제 구현 시 서버 API 호출
    fetch(`/api/missing/${getMissingId()}/bookmark`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookmarked: bookmarked })
    }).catch(error => {
        console.error('북마크 전송 실패:', error);
    });
}

// 실종자 ID 가져오기
function getMissingId() {
    // URL에서 ID 추출 또는 데이터 속성에서 가져오기
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1] || '1';
}

// 알림 표시 함수 (window.showNotification이 없을 경우 대비)
function showNotification(message, type = 'info') {
    if (window.showNotification) {
        window.showNotification(message, type);
    } else {
        // 간단한 알림 구현
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// 모든 모달 닫기
function closeAllModals() {
    document.querySelectorAll('.modal-overlay, .share-modal-overlay').forEach(modal => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
}

// 유틸리티 함수: 쓰로틀
function throttle(func, wait) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, wait);
        }
    };
}

// CSS 추가 (공유 모달)
const modalStyles = `
<style>
.share-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.share-modal-overlay.active {
    opacity: 1;
}

.share-modal {
    background: white;
    border-radius: 16px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    transform: scale(0.9);
    transition: transform 0.3s ease;
}

.share-modal-overlay.active .share-modal {
    transform: scale(1);
}

.share-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
}

.share-modal-header h3 {
    font-size: 20px;
    font-weight: 600;
    color: #111827;
}

.modal-close {
    width: 36px;
    height: 36px;
    border: none;
    background: #f3f4f6;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.modal-close:hover {
    background: #e5e7eb;
}

.share-modal-body {
    padding: 24px;
}

.share-options {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}

.share-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.share-option:hover {
    background: #f3f4f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.share-option i {
    font-size: 24px;
    color: #374151;
}

.share-option img {
    width: 24px;
    height: 24px;
}

.share-option span {
    font-size: 12px;
    color: #6b7280;
}

.up-particle, .support-particle {
    position: fixed;
    pointer-events: none;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
</style>
`;

// 스타일 추가
document.head.insertAdjacentHTML('beforeend', modalStyles);

// 전역 함수로 내보내기
window.changeMainImage = changeMainImage;
window.handleUpClick = handleUpClick;
window.handleRecommendClick = handleRecommendClick;
window.toggleBookmark = toggleBookmark;
window.shareContent = shareContent;
window.closeShareModal = closeShareModal;
window.shareToKakao = shareToKakao;
window.shareToFacebook = shareToFacebook;
window.shareToTwitter = shareToTwitter;
window.copyToClipboard = copyToClipboard;