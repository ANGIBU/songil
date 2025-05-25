// static/js/find-account.js

let findIdTimer = null;
let findPwTimer = null;
let findIdTimeLeft = 0;
let findPwTimeLeft = 0;

// 계정 찾기 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeFindAccount();
    initializeFindIdForm();
    initializeFindPasswordForm();
});

// 계정 찾기 시스템 초기화
function initializeFindAccount() {
    // 아이디 찾기 폼 이벤트
    const findIdForm = document.getElementById('findIdForm');
    if (findIdForm) {
        findIdForm.addEventListener('submit', handleFindId);
    }
    
    // 비밀번호 찾기 폼 이벤트
    const findPasswordForm = document.getElementById('findPasswordForm');
    if (findPasswordForm) {
        findPasswordForm.addEventListener('submit', handleFindPassword);
    }
    
    // 인증번호 발송 버튼들
    const findIdSendBtn = document.getElementById('findIdSendCodeBtn');
    if (findIdSendBtn) {
        findIdSendBtn.addEventListener('click', () => sendFindIdVerificationCode());
    }
    
    const findPwSendBtn = document.getElementById('findPwSendCodeBtn');
    if (findPwSendBtn) {
        findPwSendBtn.addEventListener('click', () => sendFindPwVerificationCode());
    }
}

// 아이디 찾기 폼 초기화
function initializeFindIdForm() {
    const nameInput = document.getElementById('findIdName');
    const phoneInput = document.getElementById('findIdPhone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
        
        phoneInput.addEventListener('blur', function() {
            validateFindIdPhone();
        });
    }
    
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            validateFindIdName();
        });
    }
}

// 비밀번호 찾기 폼 초기화
function initializeFindPasswordForm() {
    const emailInput = document.getElementById('findPwEmail');
    const phoneInput = document.getElementById('findPwPhone');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateFindPwEmail();
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
        
        phoneInput.addEventListener('blur', function() {
            validateFindPwPhone();
        });
    }
}

// 아이디 찾기 처리
async function handleFindId(e) {
    e.preventDefault();
    
    if (!validateFindIdForm()) {
        return;
    }
    
    const formData = new FormData(e.target);
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // 로딩 상태
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 찾는 중...';
    submitBtn.disabled = true;
    
    try {
        // API 호출 시뮬레이션
        await simulateAPICall(1500);
        
        // 결과 표시
        showFindIdResult({
            email: 'test****@example.com',
            joinDate: '2024.05.01'
        });
        
        showNotification('아이디를 찾았습니다!', 'success');
        
    } catch (error) {
        showFieldError('findIdVerificationError', '일치하는 정보가 없습니다.');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// 비밀번호 찾기 처리
async function handleFindPassword(e) {
    e.preventDefault();
    
    if (!validateFindPasswordForm()) {
        return;
    }
    
    const formData = new FormData(e.target);
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // 로딩 상태
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 발송 중...';
    submitBtn.disabled = true;
    
    try {
        // API 호출 시뮬레이션
        await simulateAPICall(2000);
        
        // 결과 표시
        showFindPasswordResult({
            email: formData.get('email')
        });
        
        showNotification('임시 비밀번호가 발송되었습니다!', 'success');
        
    } catch (error) {
        showFieldError('findPwVerificationError', '일치하는 정보가 없습니다.');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// 아이디 찾기 인증번호 발송
async function sendFindIdVerificationCode() {
    if (!validateFindIdName() || !validateFindIdPhone()) {
        return;
    }
    
    const sendBtn = document.getElementById('findIdSendCodeBtn');
    const originalText = sendBtn.textContent;
    
    sendBtn.textContent = '발송 중...';
    sendBtn.disabled = true;
    
    try {
        await simulateAPICall(1000);
        showNotification('인증번호가 발송되었습니다.', 'success');
        startFindIdTimer(180); // 3분
    } catch (error) {
        showFieldError('findIdVerificationError', '인증번호 발송에 실패했습니다.');
        sendBtn.textContent = originalText;
        sendBtn.disabled = false;
    }
}

// 비밀번호 찾기 인증번호 발송
async function sendFindPwVerificationCode() {
    if (!validateFindPwEmail() || !validateFindPwPhone()) {
        return;
    }
    
    const sendBtn = document.getElementById('findPwSendCodeBtn');
    const originalText = sendBtn.textContent;
    
    sendBtn.textContent = '발송 중...';
    sendBtn.disabled = true;
    
    try {
        await simulateAPICall(1000);
        showNotification('인증번호가 발송되었습니다.', 'success');
        startFindPwTimer(180); // 3분
    } catch (error) {
        showFieldError('findPwVerificationError', '인증번호 발송에 실패했습니다.');
        sendBtn.textContent = originalText;
        sendBtn.disabled = false;
    }
}

// 아이디 찾기 타이머
function startFindIdTimer(seconds) {
    findIdTimeLeft = seconds;
    const timerElement = document.getElementById('findIdTimer');
    const sendBtn = document.getElementById('findIdSendCodeBtn');
    
    findIdTimer = setInterval(() => {
        const minutes = Math.floor(findIdTimeLeft / 60);
        const secs = findIdTimeLeft % 60;
        
        timerElement.textContent = `${minutes}:${secs.toString().padStart(2, '0')} 후 재발송 가능`;
        
        findIdTimeLeft--;
        
        if (findIdTimeLeft < 0) {
            clearInterval(findIdTimer);
            timerElement.textContent = '';
            sendBtn.textContent = '재발송';
            sendBtn.disabled = false;
        }
    }, 1000);
}

// 비밀번호 찾기 타이머
function startFindPwTimer(seconds) {
    findPwTimeLeft = seconds;
    const timerElement = document.getElementById('findPwTimer');
    const sendBtn = document.getElementById('findPwSendCodeBtn');
    
    findPwTimer = setInterval(() => {
        const minutes = Math.floor(findPwTimeLeft / 60);
        const secs = findPwTimeLeft % 60;
        
        timerElement.textContent = `${minutes}:${secs.toString().padStart(2, '0')} 후 재발송 가능`;
        
        findPwTimeLeft--;
        
        if (findPwTimeLeft < 0) {
            clearInterval(findPwTimer);
            timerElement.textContent = '';
            sendBtn.textContent = '재발송';
            sendBtn.disabled = false;
        }
    }, 1000);
}

// 아이디 찾기 결과 표시
function showFindIdResult(data) {
    const form = document.getElementById('findIdForm');
    const result = document.getElementById('idResult');
    
    // 결과 데이터 설정
    document.getElementById('foundEmail').textContent = data.email;
    document.getElementById('joinDate').textContent = data.joinDate;
    
    // 폼 숨기기, 결과 표시
    if (typeof gsap !== 'undefined') {
        gsap.to(form, {
            duration: 0.3,
            opacity: 0,
            y: -20,
            onComplete: () => {
                form.style.display = 'none';
                result.style.display = 'block';
                
                gsap.from(result, {
                    duration: 0.5,
                    opacity: 0,
                    y: 20,
                    ease: 'power2.out'
                });
            }
        });
    } else {
        form.style.display = 'none';
        result.style.display = 'block';
    }
}

// 비밀번호 찾기 결과 표시
function showFindPasswordResult(data) {
    const form = document.getElementById('findPasswordForm');
    const result = document.getElementById('passwordResult');
    
    // 이메일 마스킹
    const email = data.email;
    const maskedEmail = maskEmail(email);
    document.getElementById('sentToEmail').textContent = maskedEmail;
    
    // 폼 숨기기, 결과 표시
    if (typeof gsap !== 'undefined') {
        gsap.to(form, {
            duration: 0.3,
            opacity: 0,
            y: -20,
            onComplete: () => {
                form.style.display = 'none';
                result.style.display = 'block';
                
                gsap.from(result, {
                    duration: 0.5,
                    opacity: 0,
                    y: 20,
                    ease: 'power2.out'
                });
            }
        });
    } else {
        form.style.display = 'none';
        result.style.display = 'block';
    }
}

// 이메일 마스킹 함수
function maskEmail(email) {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) {
        return localPart[0] + '***@' + domain;
    }
    
    const visibleChars = Math.ceil(localPart.length / 3);
    const maskedPart = localPart.substring(0, visibleChars) + '****';
    return maskedPart + '@' + domain;
}

// 유효성 검사 함수들
function validateFindIdForm() {
    return validateFindIdName() && 
           validateFindIdPhone() && 
           validateFindIdVerificationCode();
}

function validateFindPasswordForm() {
    return validateFindPwEmail() && 
           validateFindPwPhone() && 
           validateFindPwVerificationCode();
}

function validateFindIdName() {
    const name = document.getElementById('findIdName').value.trim();
    if (!name) {
        showFieldError('findIdNameError', '이름을 입력해주세요.');
        return false;
    }
    if (name.length < 2) {
        showFieldError('findIdNameError', '올바른 이름을 입력해주세요.');
        return false;
    }
    clearFieldError('findIdNameError');
    return true;
}

function validateFindIdPhone() {
    const phone = document.getElementById('findIdPhone').value.trim();
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    
    if (!phone) {
        showFieldError('findIdPhoneError', '휴대폰 번호를 입력해주세요.');
        return false;
    }
    if (!phoneRegex.test(phone)) {
        showFieldError('findIdPhoneError', '올바른 휴대폰 번호 형식으로 입력해주세요.');
        return false;
    }
    clearFieldError('findIdPhoneError');
    return true;
}

function validateFindIdVerificationCode() {
    const code = document.getElementById('findIdVerificationCode').value.trim();
    if (!code) {
        showFieldError('findIdVerificationError', '인증번호를 입력해주세요.');
        return false;
    }
    if (code.length !== 6) {
        showFieldError('findIdVerificationError', '6자리 인증번호를 입력해주세요.');
        return false;
    }
    clearFieldError('findIdVerificationError');
    return true;
}

function validateFindPwEmail() {
    const email = document.getElementById('findPwEmail').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showFieldError('findPwEmailError', '이메일을 입력해주세요.');
        return false;
    }
    if (!emailRegex.test(email)) {
        showFieldError('findPwEmailError', '올바른 이메일 형식을 입력해주세요.');
        return false;
    }
    clearFieldError('findPwEmailError');
    return true;
}

function validateFindPwPhone() {
    const phone = document.getElementById('findPwPhone').value.trim();
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    
    if (!phone) {
        showFieldError('findPwPhoneError', '휴대폰 번호를 입력해주세요.');
        return false;
    }
    if (!phoneRegex.test(phone)) {
        showFieldError('findPwPhoneError', '올바른 휴대폰 번호 형식으로 입력해주세요.');
        return false;
    }
    clearFieldError('findPwPhoneError');
    return true;
}

function validateFindPwVerificationCode() {
    const code = document.getElementById('findPwVerificationCode').value.trim();
    if (!code) {
        showFieldError('findPwVerificationError', '인증번호를 입력해주세요.');
        return false;
    }
    if (code.length !== 6) {
        showFieldError('findPwVerificationError', '6자리 인증번호를 입력해주세요.');
        return false;
    }
    clearFieldError('findPwVerificationError');
    return true;
}

// 유틸리티 함수들
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

function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        const inputId = errorId.replace('Error', '');
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            inputElement.classList.add('error');
        }
    }
}

function clearFieldError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.remove('show');
        
        const inputId = errorId.replace('Error', '');
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            inputElement.classList.remove('error');
        }
    }
}

function simulateAPICall(delay = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.2) { // 80% 성공률
                resolve({ success: true });
            } else {
                reject(new Error('API 오류'));
            }
        }, delay);
    });
}

function showNotification(message, type = 'info') {
    if (window.showNotification && typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        alert(message);
    }
}