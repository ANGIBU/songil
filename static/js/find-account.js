// static/js/find-account.js

let findPwEmailVerified = false;

// 계정 찾기 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeFindAccount();
    initializeFindIdForm();
    initializeFindPasswordForm();
    
    // 모든 탭의 폼 요소를 즉시 표시
    const allFormElements = document.querySelectorAll('.auth-form .form-group, .auth-form .btn-full, .auth-form .email-auth-section');
    allFormElements.forEach(element => {
        if (element) {
            element.classList.add('show');
        }
    });
});

// 계정 찾기 시스템 초기화
function initializeFindAccount() {
    // 모든 폼 요소를 즉시 표시
    const formElements = document.querySelectorAll('.form-group, .btn-full, .email-auth-section');
    formElements.forEach(element => {
        if (element) {
            element.classList.add('show');
        }
    });
    
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
    
    // 비밀번호 찾기 이메일 인증 버튼들
    const findPwSendCodeBtn = document.getElementById('findPwSendCodeBtn');
    if (findPwSendCodeBtn) {
        findPwSendCodeBtn.addEventListener('click', () => sendVerificationCode('findPw'));
    }
    
    const findPwVerifyBtn = document.getElementById('findPwVerifyBtn');
    if (findPwVerifyBtn) {
        findPwVerifyBtn.addEventListener('click', () => verifyEmailCode('findPw'));
    }
    
    const findPwResendBtn = document.getElementById('findPwResendBtn');
    if (findPwResendBtn) {
        findPwResendBtn.addEventListener('click', () => resendVerificationCode('findPw'));
    }
}

// 아이디 찾기 폼 초기화
function initializeFindIdForm() {
    const nameInput = document.getElementById('findIdName');
    const phoneInput = document.getElementById('findIdPhone');
    
    if (nameInput) {
        nameInput.addEventListener('blur', validateFindIdName);
        nameInput.addEventListener('input', clearFieldError.bind(null, 'findIdNameError'));
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
        phoneInput.addEventListener('blur', validateFindIdPhone);
    }
}

// 비밀번호 찾기 폼 초기화
function initializeFindPasswordForm() {
    const nameInput = document.getElementById('findPwName');
    const emailInput = document.getElementById('findPwEmail');
    const newPasswordInput = document.getElementById('newPassword');
    const newPasswordConfirmInput = document.getElementById('newPasswordConfirm');
    
    if (nameInput) {
        nameInput.addEventListener('blur', validateFindPwName);
        nameInput.addEventListener('input', clearFieldError.bind(null, 'findPwNameError'));
    }
    
    if (emailInput) {
        emailInput.addEventListener('blur', validateFindPwEmail);
        emailInput.addEventListener('input', clearFieldError.bind(null, 'findPwEmailError'));
    }
    
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            validateNewPassword(this.value);
        });
    }
    
    if (newPasswordConfirmInput) {
        newPasswordConfirmInput.addEventListener('input', validateNewPasswordConfirm);
    }
}

// 이메일 인증 코드 발송
async function sendVerificationCode(type) {
    const nameInput = document.getElementById(type === 'findId' ? 'findIdName' : 'findPwName');
    const emailInput = document.getElementById(type === 'findId' ? 'findIdEmail' : 'findPwEmail');
    const sendCodeBtn = document.getElementById(type === 'findId' ? 'findIdSendCodeBtn' : 'findPwSendCodeBtn');
    const verificationSection = document.getElementById(type === 'findId' ? 'findIdVerificationSection' : 'findPwVerificationSection');
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    
    // 유효성 검사
    if (type === 'findId') {
        if (!validateFindIdName() || !validateFindIdEmail()) {
            return;
        }
    } else {
        if (!validateFindPwName() || !validateFindPwEmail()) {
            return;
        }
    }
    
    const originalText = sendCodeBtn.innerHTML;
    sendCodeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 발송 중...';
    sendCodeBtn.disabled = true;
    
    try {
        // 이메일 인증 코드 발송 API 호출 시뮬레이션
        await simulateAPICall(1500);
        
        // 발송 성공
        verificationSection.style.display = 'block';
        sendCodeBtn.style.display = 'none';
        
        showNotification('인증코드가 발송되었습니다. 이메일을 확인해주세요.', 'success');
        startResendTimer(type);
        
    } catch (error) {
        showNotification('인증코드 발송에 실패했습니다. 다시 시도해주세요.', 'error');
        sendCodeBtn.innerHTML = originalText;
        sendCodeBtn.disabled = false;
    }
}

// 이메일 인증 코드 확인
async function verifyEmailCode(type) {
    const codeInput = document.getElementById(type === 'findId' ? 'findIdVerificationCode' : 'findPwVerificationCode');
    const verifyBtn = document.getElementById(type === 'findId' ? 'findIdVerifyBtn' : 'findPwVerifyBtn');
    const authStatus = document.getElementById(type === 'findId' ? 'findIdAuthStatus' : 'findPwAuthStatus');
    const verificationSection = document.getElementById(type === 'findId' ? 'findIdVerificationSection' : 'findPwVerificationSection');
    const submitBtn = document.getElementById(type === 'findId' ? 'findIdSubmitBtn' : 'findPwSubmitBtn');
    
    const code = codeInput.value.trim();
    
    if (!code || code.length !== 6) {
        showNotification('6자리 인증코드를 입력해주세요.', 'error');
        return;
    }
    
    const originalText = verifyBtn.innerHTML;
    verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 확인 중...';
    verifyBtn.disabled = true;
    
    try {
        // 인증 코드 확인 API 호출 시뮬레이션
        await simulateAPICall(1000);
        
        // 인증 성공
        verificationSection.style.display = 'none';
        authStatus.style.display = 'block';
        submitBtn.disabled = false;
        
        if (type === 'findId') {
            findIdEmailVerified = true;
        } else {
            findPwEmailVerified = true;
        }
        
        showNotification('이메일 인증이 완료되었습니다.', 'success');
        
        // GSAP 애니메이션
        if (typeof gsap !== 'undefined') {
            gsap.from(authStatus, {
                duration: 0.6,
                scale: 0.9,
                opacity: 0,
                ease: 'back.out(1.7)'
            });
        }
        
    } catch (error) {
        showNotification('인증코드가 올바르지 않습니다. 다시 확인해주세요.', 'error');
        codeInput.value = '';
        verifyBtn.innerHTML = originalText;
        verifyBtn.disabled = false;
    }
}

// 인증 코드 재발송
async function resendVerificationCode(type) {
    const emailInput = document.getElementById(type === 'findId' ? 'findIdEmail' : 'findPwEmail');
    const email = emailInput.value.trim();
    
    try {
        await simulateAPICall(1000);
        
        showNotification('인증코드가 재발송되었습니다.', 'success');
        startResendTimer(type);
        
    } catch (error) {
        showNotification('재발송에 실패했습니다. 다시 시도해주세요.', 'error');
    }
}

// 재발송 타이머 시작
function startResendTimer(type) {
    const resendBtn = document.getElementById(type === 'findId' ? 'findIdResendBtn' : 'findPwResendBtn');
    const countdown = document.getElementById(type === 'findId' ? 'findIdCountdown' : 'findPwCountdown');
    let seconds = 60;
    
    resendBtn.disabled = true;
    
    const timer = setInterval(() => {
        seconds--;
        countdown.textContent = seconds;
        
        if (seconds <= 0) {
            clearInterval(timer);
            resendBtn.disabled = false;
            resendBtn.innerHTML = '재발송';
        }
    }, 1000);
}

// 아이디 찾기 처리
async function handleFindId(e) {
    e.preventDefault();
    
    if (!validateFindIdForm()) {
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 찾는 중...';
    submitBtn.disabled = true;
    
    try {
        // API 호출 시뮬레이션 - 70% 확률로 성공
        await simulateAPICall(1500);
        
        const name = document.getElementById('findIdName').value;
        const phone = document.getElementById('findIdPhone').value;
        
        // 70% 확률로 성공 시뮬레이션
        if (Math.random() > 0.3) {
            // 성공 - 결과 표시
            const maskedEmail = generateMaskedEmailFromPhone(name, phone);
            
            showFindIdResult({
                email: maskedEmail,
                joinDate: '2024.05.01'
            });
            
            showNotification('아이디를 찾았습니다!', 'success');
        } else {
            // 실패 - 등록된 정보 없음
            showFindIdError();
            showNotification('입력하신 정보와 일치하는 계정을 찾을 수 없습니다.', 'error');
        }
        
    } catch (error) {
        showFindIdError();
        showNotification('아이디 찾기 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
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
    
    if (!findPwEmailVerified) {
        showNotification('이메일 인증을 완료해주세요.', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 확인 중...';
    submitBtn.disabled = true;
    
    try {
        // API 호출 시뮬레이션
        await simulateAPICall(1500);
        
        // 비밀번호 변경 폼 표시
        showPasswordChangeForm();
        
        showNotification('본인 확인이 완료되었습니다. 새 비밀번호를 설정해주세요.', 'success');
        
    } catch (error) {
        showNotification('일치하는 정보가 없습니다.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// 비밀번호 변경 처리
window.changePassword = async function() {
    if (!validateNewPasswordForm()) {
        return;
    }
    
    try {
        await simulateAPICall(1000);
        
        // 비밀번호 변경 완료 표시
        showPasswordChanged();
        
        showNotification('비밀번호가 성공적으로 변경되었습니다.', 'success');
        
    } catch (error) {
        showNotification('비밀번호 변경에 실패했습니다.', 'error');
    }
};

// 아이디 찾기 결과 표시 - 트랜지션 문제 해결
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
                result.style.opacity = '1'; // 명시적으로 투명도 설정
                result.style.visibility = 'visible'; // 가시성 설정
                
                gsap.fromTo(result, 
                    { opacity: 0, y: 20 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.5, 
                        ease: 'power2.out',
                        onComplete: () => {
                            // 애니메이션 완료 후 CSS 속성 고정
                            result.style.opacity = '1';
                            result.style.transform = 'translateY(0)';
                        }
                    }
                );
            }
        });
    } else {
        form.style.display = 'none';
        result.style.display = 'block';
        result.style.opacity = '1';
        result.style.visibility = 'visible';
    }
}

// 아이디 찾기 실패 표시
function showFindIdError() {
    const form = document.getElementById('findIdForm');
    const result = document.getElementById('idResult');
    
    // 에러 상태로 결과 설정
    result.classList.add('error');
    
    // 에러 아이콘과 메시지로 변경
    const resultHeader = result.querySelector('.result-header');
    const resultContent = result.querySelector('.result-content');
    const resultActions = result.querySelector('.result-actions');
    
    resultHeader.innerHTML = `
        <i class="fas fa-times-circle"></i>
        <h3>아이디 찾기 실패</h3>
    `;
    
    resultContent.innerHTML = `
        <p>입력하신 정보와 일치하는 계정을 찾을 수 없습니다.</p>
        <div class="found-id">
            <span>등록된 회원 정보가 없습니다</span>
        </div>
        <div class="result-info">
            <p><strong>다음 사항을 확인해주세요:</strong></p>
            <ul style="text-align: left; margin-top: 10px; padding-left: 20px;">
                <li>성함과 전화번호가 정확한지 확인해주세요</li>
                <li>가입 시 사용한 전화번호인지 확인해주세요</li>
                <li>다른 전화번호로 가입했을 가능성을 확인해주세요</li>
                <li>아직 회원가입을 하지 않으셨다면 회원가입을 진행해주세요</li>
            </ul>
        </div>
    `;
    
    resultActions.innerHTML = `
        <a href="/register" class="btn btn-primary">
            <i class="fas fa-user-plus"></i>
            회원가입하기
        </a>
        <button class="btn btn-secondary" onclick="resetFindIdForm()">
            <i class="fas fa-redo"></i>
            다시 시도
        </button>
    `;
    
    // 폼 숨기기, 결과 표시
    if (typeof gsap !== 'undefined') {
        gsap.to(form, {
            duration: 0.3,
            opacity: 0,
            y: -20,
            onComplete: () => {
                form.style.display = 'none';
                result.style.display = 'block';
                result.style.opacity = '1';
                result.style.visibility = 'visible';
                
                gsap.fromTo(result, 
                    { opacity: 0, y: 20 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.5, 
                        ease: 'power2.out',
                        onComplete: () => {
                            result.style.opacity = '1';
                            result.style.transform = 'translateY(0)';
                        }
                    }
                );
            }
        });
    } else {
        form.style.display = 'none';
        result.style.display = 'block';
        result.style.opacity = '1';
        result.style.visibility = 'visible';
    }
}

// 아이디 찾기 폼 리셋
window.resetFindIdForm = function() {
    const form = document.getElementById('findIdForm');
    const result = document.getElementById('idResult');
    
    // 에러 클래스 제거
    result.classList.remove('error');
    
    // 입력 필드 초기화
    document.getElementById('findIdName').value = '';
    document.getElementById('findIdPhone').value = '';
    
    // 에러 메시지 제거
    clearFieldError('findIdNameError');
    clearFieldError('findIdPhoneError');
    
    // 폼 다시 표시
    if (typeof gsap !== 'undefined') {
        gsap.to(result, {
            duration: 0.3,
            opacity: 0,
            y: -20,
            onComplete: () => {
                result.style.display = 'none';
                form.style.display = 'block';
                
                gsap.fromTo(form, 
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                );
            }
        });
    } else {
        result.style.display = 'none';
        form.style.display = 'block';
    }
};

// 비밀번호 변경 폼 표시
function showPasswordChangeForm() {
    const form = document.getElementById('findPasswordForm');
    const changeForm = document.getElementById('passwordChangeForm');
    
    if (typeof gsap !== 'undefined') {
        gsap.to(form, {
            duration: 0.3,
            opacity: 0,
            y: -20,
            onComplete: () => {
                form.style.display = 'none';
                changeForm.style.display = 'block';
                
                gsap.from(changeForm, {
                    duration: 0.5,
                    opacity: 0,
                    y: 20,
                    ease: 'power2.out'
                });
            }
        });
    } else {
        form.style.display = 'none';
        changeForm.style.display = 'block';
    }
}

// 비밀번호 변경 완료 표시
function showPasswordChanged() {
    const changeForm = document.getElementById('passwordChangeForm');
    const changedForm = document.getElementById('passwordChanged');
    
    if (typeof gsap !== 'undefined') {
        gsap.to(changeForm, {
            duration: 0.3,
            opacity: 0,
            y: -20,
            onComplete: () => {
                changeForm.style.display = 'none';
                changedForm.style.display = 'block';
                
                gsap.from(changedForm, {
                    duration: 0.5,
                    opacity: 0,
                    y: 20,
                    ease: 'power2.out'
                });
            }
        });
    } else {
        changeForm.style.display = 'none';
        changedForm.style.display = 'block';
    }
}

// 새 비밀번호 유효성 검사
function validateNewPassword(password) {
    const validation = document.getElementById('newPasswordValidation');
    if (!validation) return false;
    
    const minLength = password.length >= 8;
    const maxLength = password.length <= 15;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    let message = '';
    let isValid = true;
    
    if (!minLength || !maxLength) {
        message = '비밀번호는 8~15자여야 합니다.';
        isValid = false;
    } else if (!hasLetter) {
        message = '영문자를 포함해야 합니다.';
        isValid = false;
    } else if (!hasNumber) {
        message = '숫자를 포함해야 합니다.';
        isValid = false;
    } else {
        message = '사용 가능한 비밀번호입니다.';
        isValid = true;
    }
    
    validation.textContent = message;
    validation.className = `password-validation ${isValid ? 'valid' : 'invalid'}`;
    
    return isValid;
}

function validateNewPasswordConfirm() {
    const password = document.getElementById('newPassword').value;
    const passwordConfirm = document.getElementById('newPasswordConfirm').value;
    
    if (passwordConfirm && password !== passwordConfirm) {
        showFieldError('newPasswordConfirmError', '비밀번호가 일치하지 않습니다.');
        return false;
    }
    
    clearFieldError('newPasswordConfirmError');
    return true;
}

// 유효성 검사 함수들
function validateFindIdForm() {
    return validateFindIdName() && validateFindIdPhone();
}

function validateFindPasswordForm() {
    return validateFindPwName() && validateFindPwEmail();
}

function validateNewPasswordForm() {
    const password = document.getElementById('newPassword').value;
    return validateNewPassword(password) && validateNewPasswordConfirm();
}

function validateFindIdName() {
    const name = document.getElementById('findIdName').value.trim();
    if (!name || name.length < 2) {
        showFieldError('findIdNameError', '성함을 정확히 입력해주세요.');
        return false;
    }
    clearFieldError('findIdNameError');
    return true;
}

function validateFindIdPhone() {
    const phone = document.getElementById('findIdPhone').value.trim();
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    
    if (!phone) {
        showFieldError('findIdPhoneError', '전화번호를 입력해주세요.');
        return false;
    }
    if (!phoneRegex.test(phone)) {
        showFieldError('findIdPhoneError', '올바른 전화번호 형식으로 입력해주세요. (010-0000-0000)');
        return false;
    }
    clearFieldError('findIdPhoneError');
    return true;
}

function validateFindPwName() {
    const name = document.getElementById('findPwName').value.trim();
    if (!name || name.length < 2) {
        showFieldError('findPwNameError', '성함을 정확히 입력해주세요.');
        return false;
    }
    clearFieldError('findPwNameError');
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

function generateMaskedEmailFromPhone(name, phone) {
    // 전화번호 기반 시뮬레이션용 이메일 생성
    const domains = ['gmail.com', 'naver.com', 'daum.net', 'hanmail.net'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const phoneNumbers = phone.replace(/-/g, '');
    const localPart = name.toLowerCase() + phoneNumbers.substring(7);
    
    return maskEmail(localPart + '@' + domain);
}

function generateMaskedEmail(name) {
    // 시뮬레이션용 이메일 생성
    const domains = ['gmail.com', 'naver.com', 'daum.net', 'hanmail.net'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const localPart = name.toLowerCase() + Math.floor(Math.random() * 1000);
    
    return maskEmail(localPart + '@' + domain);
}

function maskEmail(email) {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) {
        return localPart[0] + '***@' + domain;
    }
    
    const visibleChars = Math.ceil(localPart.length / 3);
    const maskedPart = localPart.substring(0, visibleChars) + '****';
    return maskedPart + '@' + domain;
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
            if (Math.random() > 0.2) {
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