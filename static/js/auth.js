// static/js/auth.js

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    initializeFormValidation();
    initializePasswordToggle();
    initializeTabSystem();
});

// 인증 시스템 초기화
function initializeAuth() {
    // CSS 파일 로드
    const authCSS = document.createElement('link');
    authCSS.rel = 'stylesheet';
    authCSS.href = '/static/css/auth.css';
    document.head.appendChild(authCSS);
    
    // 로그인 폼 이벤트
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 애니메이션 초기화
    if (typeof gsap !== 'undefined') {
        initializeAuthAnimations();
    }
}

// 로그인 처리
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // 클라이언트 사이드 유효성 검사
    if (!validateEmail(email)) {
        showFieldError('emailError', '올바른 이메일 형식을 입력해주세요.');
        return;
    }
    
    if (!password || password.length < 6) {
        showFieldError('passwordError', '비밀번호는 6자 이상이어야 합니다.');
        return;
    }
    
    // 로딩 상태 표시
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로그인 중...';
    submitBtn.disabled = true;
    
    try {
        // 임시 로그인 처리 (실제로는 서버 API 호출)
        await simulateAPICall(1500);
        
        // 성공 시 로컬 스토리지에 저장
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', '테스트 사용자');
        localStorage.setItem('userPoints', '1250');
        
        if (remember) {
            localStorage.setItem('rememberLogin', 'true');
        }
        
        showNotification('로그인되었습니다!', 'success');
        
        // 메인 페이지로 리다이렉트
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
        
    } catch (error) {
        showFieldError('passwordError', '이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// 폼 유효성 검사 초기화
function initializeFormValidation() {
    // 실시간 유효성 검사
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateEmailField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this.id + 'Error');
        });
    });
    
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.id === 'password' && document.getElementById('passwordStrength')) {
                updatePasswordStrength(this.value);
            }
            
            if (this.id === 'passwordConfirm') {
                validatePasswordConfirm();
            }
            
            clearFieldError(this.id + 'Error');
        });
    });
    
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
        
        input.addEventListener('blur', function() {
            validatePhoneField(this);
        });
    });
}

// 이메일 유효성 검사
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateEmailField(input) {
    const email = input.value.trim();
    const errorElement = document.getElementById(input.id + 'Error');
    
    if (!email) {
        showFieldError(input.id + 'Error', '이메일을 입력해주세요.');
        return false;
    }
    
    if (!validateEmail(email)) {
        showFieldError(input.id + 'Error', '올바른 이메일 형식을 입력해주세요.');
        return false;
    }
    
    clearFieldError(input.id + 'Error');
    return true;
}

// 전화번호 형식 처리
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 11) {
        value = value.substring(0, 11);
        value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (value.length >= 7) {
        value = value.replace(/(\d{3})(\d{3,4})(\d{0,4})/, '$1-$2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{0,4})/, '$1-$2');
    }
    
    input.value = value;
}

function validatePhoneField(input) {
    const phone = input.value.trim();
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    
    if (!phone) {
        showFieldError(input.id + 'Error', '휴대폰 번호를 입력해주세요.');
        return false;
    }
    
    if (!phoneRegex.test(phone)) {
        showFieldError(input.id + 'Error', '올바른 휴대폰 번호 형식으로 입력해주세요. (010-0000-0000)');
        return false;
    }
    
    clearFieldError(input.id + 'Error');
    return true;
}

// 비밀번호 강도 체크
function updatePasswordStrength(password) {
    const strengthElement = document.getElementById('passwordStrength');
    if (!strengthElement) return;
    
    let score = 0;
    let feedback = [];
    
    if (password.length >= 8) score++;
    else feedback.push('8자 이상');
    
    if (/[a-z]/.test(password)) score++;
    else feedback.push('소문자');
    
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('대문자');
    
    if (/\d/.test(password)) score++;
    else feedback.push('숫자');
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    else feedback.push('특수문자');
    
    let strengthText = '';
    let strengthClass = '';
    
    if (score < 2) {
        strengthText = '약함 - 다음을 포함해주세요: ' + feedback.join(', ');
        strengthClass = 'weak';
    } else if (score < 4) {
        strengthText = '보통 - 더 강한 비밀번호를 권장합니다';
        strengthClass = 'medium';
    } else {
        strengthText = '강함 - 안전한 비밀번호입니다';
        strengthClass = 'strong';
    }
    
    strengthElement.textContent = strengthText;
    strengthElement.className = `password-strength ${strengthClass}`;
}

// 비밀번호 확인 검사
function validatePasswordConfirm() {
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const errorElement = document.getElementById('passwordConfirmError');
    
    if (passwordConfirm && password !== passwordConfirm) {
        showFieldError('passwordConfirmError', '비밀번호가 일치하지 않습니다.');
        return false;
    }
    
    clearFieldError('passwordConfirmError');
    return true;
}

// 비밀번호 토글 기능
function initializePasswordToggle() {
    // togglePassword 함수를 전역으로 정의
    window.togglePassword = function(inputId) {
        const input = document.getElementById(inputId);
        const toggle = input.parentNode.querySelector('.password-toggle i');
        
        if (input.type === 'password') {
            input.type = 'text';
            toggle.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            toggle.className = 'fas fa-eye';
        }
    };
}

// 탭 시스템 초기화
function initializeTabSystem() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // 모든 탭 비활성화
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 선택된 탭 활성화
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// 전역 탭 전환 함수
window.switchTab = function(tabId) {
    const tabBtn = document.querySelector(`[data-tab="${tabId}"]`);
    if (tabBtn) {
        tabBtn.click();
    }
};

// 에러 메시지 표시
function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        // 해당 입력 필드에 에러 클래스 추가
        const inputId = errorId.replace('Error', '');
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            inputElement.classList.add('error');
        }
    }
}

// 에러 메시지 제거
function clearFieldError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.remove('show');
        
        // 해당 입력 필드에서 에러 클래스 제거
        const inputId = errorId.replace('Error', '');
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            inputElement.classList.remove('error');
        }
    }
}

// 성공 메시지 표시
function showFieldSuccess(successId, message) {
    const successElement = document.getElementById(successId);
    if (successElement) {
        successElement.textContent = message;
        successElement.classList.add('show');
        
        // 해당 입력 필드에 성공 클래스 추가
        const inputId = successId.replace('Success', '');
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            inputElement.classList.add('success');
        }
    }
}

// 클립보드에 복사
window.copyToClipboard = function(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('클립보드에 복사되었습니다!', 'success');
    }).catch(() => {
        // 폴백: 텍스트 선택
        const range = document.createRange();
        range.selectNode(element);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        showNotification('텍스트를 선택했습니다. Ctrl+C로 복사하세요.', 'info');
    });
};

// API 호출 시뮬레이션
function simulateAPICall(delay = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 90% 확률로 성공
            if (Math.random() > 0.1) {
                resolve({ success: true });
            } else {
                reject(new Error('API 오류'));
            }
        }, delay);
    });
}

// 인증 애니메이션 초기화
function initializeAuthAnimations() {
    // 페이지 로드 애니메이션
    gsap.from('.auth-container', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: 'power2.out'
    });
    
    gsap.from('.auth-logo', {
        duration: 1,
        scale: 0,
        rotation: 180,
        delay: 0.3,
        ease: 'back.out(1.7)'
    });
    
    gsap.from('.auth-header h1', {
        duration: 0.6,
        y: 30,
        opacity: 0,
        delay: 0.5,
        ease: 'power2.out'
    });
    
    gsap.from('.auth-header p', {
        duration: 0.6,
        y: 20,
        opacity: 0,
        delay: 0.7,
        ease: 'power2.out'
    });
    
    // 폼 요소들 순차적 등장
    gsap.from('.form-group', {
        duration: 0.5,
        y: 20,
        opacity: 0,
        delay: 0.9,
        stagger: 0.1,
        ease: 'power2.out'
    });
}

// 알림 함수 (기본 script.js의 함수 사용하되, 없으면 간단한 버전 사용)
function showNotification(message, type = 'info') {
    // 전역 showNotification 함수가 있으면 사용
    if (window.showNotification && typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // 간단한 알림 구현
    alert(message);
}