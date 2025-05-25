// static/js/missing-detail.js

// 실종자 상세 페이지 JavaScript
let currentTab = 'situation';
let isBookmarked = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeMissingDetail();
});

function initializeMissingDetail() {
    // 페이지 로드 애니메이션
    if (typeof gsap !== 'undefined') {
        gsap.from('.missing-profile', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            ease: 'power2.out'
        });
        
        gsap.from('.basic-info-grid .info-item', {
            duration: 0.6,
            y: 20,
            opacity: 0,
            stagger: 0.1,
            delay: 0.3,
            ease: 'power2.out'
        });
    }
}

// 탭 전환
function switchTab(tabName) {
    // 탭 버튼 활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // 탭 콘텐츠 표시
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    currentTab = tabName;
    
    // 탭 전환 애니메이션
    if (typeof gsap !== 'undefined') {
        gsap.from('.tab-content.active', {
            duration: 0.5,
            y: 20,
            opacity: 0,
            ease: 'power2.out'
        });
    }
}

// 메인 이미지 변경
function changeMainImage(thumbnail) {
    const mainImage = document.getElementById('mainImage');
    const newSrc = thumbnail.querySelector('img').src;
    
    // 기존 활성 썸네일 제거
    document.querySelectorAll('.image-thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    
    // 새 썸네일 활성화
    thumbnail.classList.add('active');
    
    // 이미지 변경 애니메이션
    if (typeof gsap !== 'undefined') {
        gsap.to(mainImage, {
            duration: 0.3,
            opacity: 0,
            onComplete: () => {
                mainImage.src = newSrc;
                gsap.to(mainImage, {
                    duration: 0.3,
                    opacity: 1
                });
            }
        });
    } else {
        mainImage.src = newSrc;
    }
}

// UP 버튼 클릭
function handleUpClick() {
    const upCount = document.getElementById('upCount');
    const currentCount = parseInt(upCount.textContent);
    
    // 애니메이션 효과
    const upBtn = document.querySelector('.up-btn.large');
    if (typeof gsap !== 'undefined') {
        gsap.to(upBtn, {
            duration: 0.2,
            scale: 1.1,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1
        });
    }
    
    // 카운트 증가
    upCount.textContent = currentCount + 1;
    
    // 알림 표시
    if (window.showNotification) {
        window.showNotification('UP을 눌렀습니다! 실종자 찾기에 도움이 됩니다.', 'success');
    }
    
    // TODO: 서버에 UP 정보 전송
}

// 북마크 토글
function toggleBookmark() {
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    const icon = bookmarkBtn.querySelector('i');
    
    isBookmarked = !isBookmarked;
    
    if (isBookmarked) {
        icon.className = 'fas fa-bookmark';
        bookmarkBtn.classList.add('active');
        if (window.showNotification) {
            window.showNotification('관심 실종자로 등록되었습니다.', 'success');
        }
    } else {
        icon.className = 'far fa-bookmark';
        bookmarkBtn.classList.remove('active');
        if (window.showNotification) {
            window.showNotification('관심 실종자에서 해제되었습니다.', 'info');
        }
    }
    
    // TODO: 서버에 북마크 상태 전송
}

// 콘텐츠 공유
function shareContent() {
    const shareData = {
        title: '실종자 찾기 - 김○○ (32세)',
        text: '실종자를 목격하신 분은 신고 부탁드립니다.',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        // 폴백: URL 복사
        navigator.clipboard.writeText(window.location.href).then(() => {
            if (window.showNotification) {
                window.showNotification('링크가 클립보드에 복사되었습니다.', 'success');
            }
        });
    }
}