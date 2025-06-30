// static/js/mypage.js

// 마이페이지 JavaScript
let currentTab = 'overview';

document.addEventListener('DOMContentLoaded', function() {
    initializeMyPage();
});

// 마이페이지 초기화
function initializeMyPage() {
    // 페이지 로드 애니메이션
    if (typeof gsap !== 'undefined') {
        gsap.from('.user-dashboard', {
            duration: 0.8,
            y: -30,
            opacity: 0,
            ease: 'power2.out'
        });
        
        gsap.from('.dashboard-stats .stat-card', {
            duration: 0.6,
            y: 20,
            opacity: 0,
            stagger: 0.1,
            delay: 0.2,
            ease: 'power2.out'
        });
        
        gsap.from('.recent-activity', {
            duration: 0.6,
            y: 30,
            opacity: 0,
            delay: 0.5,
            ease: 'power2.out'
        });
    }
    
    // 프로필 폼 이벤트
    setupProfileForm();
    
    // 설정 폼 이벤트
    setupSettingsForm();
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

// 프로필 이미지 변경
function changeProfileImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('profileImage').src = e.target.result;
                
                if (window.showNotification) {
                    window.showNotification('프로필 사진이 변경되었습니다.', 'success');
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// 프로필 폼 설정
function setupProfileForm() {
    const form = document.getElementById('profileForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // 로딩 상태
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 저장 중...';
            submitBtn.disabled = true;
            
            try {
                // API 호출 시뮬레이션
                await simulateAPICall(1500);
                
                if (window.showNotification) {
                    window.showNotification('개인정보가 수정되었습니다.', 'success');
                }
                
            } catch (error) {
                if (window.showNotification) {
                    window.showNotification('정보 수정 중 오류가 발생했습니다.', 'error');
                }
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// 설정 폼 설정
function setupSettingsForm() {
    const form = document.getElementById('settingsForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // 로딩 상태
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 저장 중...';
            submitBtn.disabled = true;
            
            try {
                // API 호출 시뮬레이션
                await simulateAPICall(1000);
                
                if (window.showNotification) {
                    window.showNotification('알림 설정이 저장되었습니다.', 'success');
                }
                
            } catch (error) {
                if (window.showNotification) {
                    window.showNotification('설정 저장 중 오류가 발생했습니다.', 'error');
                }
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// 프로필 폼 리셋
function resetProfileForm() {
    document.getElementById('profileForm').reset();
    if (window.showNotification) {
        window.showNotification('변경사항이 취소되었습니다.', 'info');
    }
}

// 신고 상세보기
function viewReportDetail(reportId) {
    // 실제로는 상세 페이지로 이동
    if (window.showNotification) {
        window.showNotification('신고 상세 페이지로 이동합니다.', 'info');
    }
}

// 목격 신고 상세보기
function viewWitnessDetail(witnessId) {
    // 실제로는 상세 페이지로 이동
    if (window.showNotification) {
        window.showNotification('목격 신고 상세 페이지로 이동합니다.', 'info');
    }
}

// 활동 내역 필터링
function filterHistory() {
    const type = document.getElementById('historyType').value;
    const period = document.getElementById('historyPeriod').value;
    const search = document.getElementById('historySearch').value;
    
    console.log('필터링:', { type, period, search });
    
    // 실제로는 서버에서 필터링된 데이터를 가져옴
    if (window.showNotification) {
        window.showNotification('활동 내역을 필터링했습니다.', 'info');
    }
}

// 더 많은 내역 로드
function loadMoreHistory() {
    const btn = event.target;
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로딩 중...';
    btn.disabled = true;
    
    setTimeout(() => {
        // 더미 내역 추가
        const timeline = document.querySelector('.activity-timeline');
        
        const newItem = document.createElement('div');
        newItem.className = 'timeline-item';
        newItem.innerHTML = `
            <div class="timeline-date">2024.05.20</div>
            <div class="timeline-content">
                <div class="activity-card bonus">
                    <div class="activity-icon">
                        <i class="fas fa-gift"></i>
                    </div>
                    <div class="activity-details">
                        <div class="activity-title">회원가입 보너스</div>
                        <div class="activity-description">플랫폼 가입을 환영합니다!</div>
                        <div class="activity-meta">12:00</div>
                    </div>
                    <div class="activity-result">
                        <span class="points positive">+100P</span>
                    </div>
                </div>
            </div>
        `;
        
        timeline.appendChild(newItem);
        
        // 애니메이션 효과
        if (typeof gsap !== 'undefined') {
            gsap.from(newItem, {
                duration: 0.5,
                y: 30,
                opacity: 0,
                ease: 'power2.out'
            });
        }
        
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        if (window.showNotification) {
            window.showNotification('새로운 활동 내역이 로드되었습니다.', 'success');
        }
    }, 1000);
}

// 유틸리티 함수
function simulateAPICall(delay = 1000) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}