// static/js/auth.js

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    initializeFormValidation();
    initializePasswordToggle();
    initializeTabSystem();
    initializeLoginAnimation();
    initializeEmailSaveFeature();
    
    // 모든 폼 요소를 즉시 표시
    const allFormElements = document.querySelectorAll('.auth-form .form-group, .auth-form .btn-full, .auth-form .form-options, .auth-form .auth-divider, .auth-form .social-login, .auth-form .auth-footer');
    allFormElements.forEach(element => {
        if (element) {
            element.classList.add('show');
        }
    });
});

// 인증 시스템 초기화
function initializeAuth() {
    // 로그인 폼 이벤트
<<<<<<< HEAD
    // const loginForm = document.getElementById('loginForm');
    // if (loginForm) {
    //     loginForm.addEventListener('submit', handleLogin);
    // }
=======
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
>>>>>>> origin/gb
    
    // 소셜 로그인 버튼 이벤트
    const googleLoginBtn = document.querySelector('.btn-google');
    const kakaoLoginBtn = document.querySelector('.btn-kakao');
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', handleGoogleLogin);
    }
    
    if (kakaoLoginBtn) {
        kakaoLoginBtn.addEventListener('click', handleKakaoLogin);
    }
}

// 이메일 저장 기능 초기화
function initializeEmailSaveFeature() {
    const saveEmailCheckbox = document.getElementById('saveEmail');
    const rememberCheckbox = document.getElementById('remember');
    const emailInput = document.getElementById('email');
    
    if (saveEmailCheckbox && rememberCheckbox) {
        // 로그인 상태 유지가 체크되면 이메일 저장도 자동 체크
        rememberCheckbox.addEventListener('change', function() {
            if (this.checked) {
                saveEmailCheckbox.checked = true;
            }
        });
        
        // 이메일 저장이 해제되면 로그인 상태 유지도 해제
        saveEmailCheckbox.addEventListener('change', function() {
            if (!this.checked) {
                rememberCheckbox.checked = false;
            }
        });
    }
    
    // 저장된 이메일 불러오기
    if (emailInput) {
        const savedEmail = localStorage.getItem('savedEmail');
        if (savedEmail) {
            emailInput.value = savedEmail;
            if (saveEmailCheckbox) {
                saveEmailCheckbox.checked = true;
            }
        }
    }
}

// 로그인 페이지 애니메이션 초기화
function initializeLoginAnimation() {
    // 로그인 페이지인지 확인
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    // 모든 폼 요소를 즉시 표시
    showLoginForm();
}

// 로그인 폼 요소들 즉시 표시
function showLoginForm() {
    const formElements = [
        document.getElementById('loginForm'),
        ...document.querySelectorAll('.form-group'),
        document.querySelector('.form-options'),
        document.querySelector('.btn-full'),
        document.querySelector('.auth-divider'),
        document.querySelector('.social-login'),
        document.querySelector('.auth-footer')
    ];
    
    formElements.forEach((element) => {
        if (element) {
            element.classList.add('show');
        }
    });
}

// 로그인 처리
async function handleLogin(e) {
    e.preventDefault();
<<<<<<< HEAD
    initializeAuth
=======
    
>>>>>>> origin/gb
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    const saveEmail = formData.get('saveEmail');
    
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
        
        // 이메일 저장 옵션 처리
        if (saveEmail) {
            localStorage.setItem('savedEmail', email);
        } else {
            localStorage.removeItem('savedEmail');
        }
        
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

// Google 로그인 처리
async function handleGoogleLogin() {
    const btn = document.querySelector('.btn-google');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;
    
    try {
        await simulateAPICall(2000);
        
        // 성공 시 사용자 정보 저장
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', 'google@example.com');
        localStorage.setItem('userName', 'Google 사용자');
        localStorage.setItem('userPoints', '1000');
        localStorage.setItem('loginMethod', 'google');
        
        showNotification('Google 로그인이 완료되었습니다!', 'success');
        
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
        
    } catch (error) {
        showNotification('Google 로그인에 실패했습니다.', 'error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// 카카오 로그인 처리
async function handleKakaoLogin() {
    const btn = document.querySelector('.btn-kakao');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;
    
    try {
        await simulateAPICall(2000);
        
        // 성공 시 사용자 정보 저장
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', 'kakao@example.com');
        localStorage.setItem('userName', '카카오 사용자');
        localStorage.setItem('userPoints', '1000');
        localStorage.setItem('loginMethod', 'kakao');
        
        showNotification('카카오 로그인이 완료되었습니다!', 'success');
        
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
        
    } catch (error) {
        showNotification('카카오 로그인에 실패했습니다.', 'error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// 이메일 인증 코드 발송
async function sendVerificationCode(email, purpose = 'register') {
    try {
        const response = await fetch('/api/auth/send-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: email,
                purpose: purpose // 'register', 'find-id', 'find-password'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            return { success: true, message: '인증코드가 발송되었습니다.' };
        } else {
            return { success: false, message: result.message || '발송에 실패했습니다.' };
        }
    } catch (error) {
        return { success: false, message: '네트워크 오류가 발생했습니다.' };
    }
}

// 이메일 인증 코드 확인
async function verifyEmailCode(email, code, purpose = 'register') {
    try {
        const response = await fetch('/api/auth/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: email,
                code: code,
                purpose: purpose
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            return { success: true, message: '인증이 완료되었습니다.' };
        } else {
            return { success: false, message: result.message || '인증에 실패했습니다.' };
        }
    } catch (error) {
        return { success: false, message: '네트워크 오류가 발생했습니다.' };
    }
}

// 재발송 타이머 시작
function startResendTimer(countdownElement, resendButton, seconds = 60) {
    let countdown = seconds;
    resendButton.disabled = true;
    
    const timer = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            resendButton.disabled = false;
            resendButton.innerHTML = '재발송';
        }
    }, 1000);
    
    return timer;
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
            clearValidationMessage(this.id + 'Validation');
        });
    });
    
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
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
    
    const textInputs = document.querySelectorAll('input[type="text"]');
    textInputs.forEach(input => {
        input.addEventListener('input', function() {
            clearFieldError(this.id + 'Error');
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

// 유효성 검사 메시지 표시
function showValidationMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = `validation-message ${type}`;
    }
}

// 유효성 검사 메시지 제거
function clearValidationMessage(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = '';
        element.className = 'validation-message';
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

// 알림 함수 (기본 script.js의 함수 사용하되, 없으면 간단한 버전 사용)
function showNotification(message, type = 'info') {
    // 전역 showNotification 함수가 있으면 사용
    if (window.showNotification && typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // 간단한 알림 구현
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // 애니메이션 CSS 추가
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);ㅈ
    
    // 3초 후 제거
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}