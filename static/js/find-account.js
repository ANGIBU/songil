// 통합된 아이디/비밀번호 찾기 JavaScript

let findPwEmailVerified = false;

document.addEventListener('DOMContentLoaded', function() {
    // 초기화 함수들
    initializeFindAccount();
    setupTabs();
    setupFindIdForm();
    setupFindPasswordForm();
    setupPasswordChangeForm();
    
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
    
    // 입력 필드 이벤트 리스너 추가
    setupInputValidation();
}

// 탭 전환 설정
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

// 탭 전환 함수
function switchTab(tabName) {
    // 모든 탭 버튼과 콘텐츠 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // 선택된 탭 활성화
    const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
    const tabContent = document.getElementById(tabName);
    
    if (tabBtn) tabBtn.classList.add('active');
    if (tabContent) tabContent.classList.add('active');
    
    // 결과 섹션 숨기기 및 폼 초기화
    hideAllResults();
    resetForms();
}

// 입력 필드 유효성 검사 설정
function setupInputValidation() {
    // 아이디 찾기 입력 필드
    const findIdName = document.getElementById('findIdName');
    const findIdPhone = document.getElementById('findIdPhone');
    
    if (findIdName) {
        findIdName.addEventListener('blur', validateFindIdName);
        findIdName.addEventListener('input', () => clearFieldError('findIdNameError'));
    }
    
    if (findIdPhone) {
        findIdPhone.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
        findIdPhone.addEventListener('blur', validateFindIdPhone);
    }
    
    // 비밀번호 찾기 입력 필드
    const findPwName = document.getElementById('findPwName');
    const findPwEmail = document.getElementById('findPwEmail');
    
    if (findPwName) {
        findPwName.addEventListener('blur', validateFindPwName);
        findPwName.addEventListener('input', () => clearFieldError('findPwNameError'));
    }
    
    if (findPwEmail) {
        findPwEmail.addEventListener('blur', validateFindPwEmail);
        findPwEmail.addEventListener('input', () => clearFieldError('findPwEmailError'));
    }
}

// 아이디 찾기 폼 설정
function setupFindIdForm() {
    const form = document.getElementById('findIdForm');
    if (form) {
        form.addEventListener('submit', handleFindId);
    }
}

// 아이디 찾기 처리
async function handleFindId(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('findIdSubmitBtn');
    const name = document.getElementById('findIdName').value.trim();
    const phone = document.getElementById('findIdPhone').value.trim();
    
    // 유효성 검사
    if (!validateFindIdForm()) {
        return;
    }
    
    // 버튼 비활성화 및 로딩 상태
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 찾는 중...';
    
    try {
        const response = await fetch('/api/find_id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, phone })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showFindIdResult({
                email: data.email,
                joinDate: data.created_at
            });
            showNotification('아이디를 찾았습니다!', 'success');
        } else {
            showFindIdError();
            showNotification(data.message || '입력하신 정보와 일치하는 계정을 찾을 수 없습니다.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showFindIdError();
        showNotification('서버 오류가 발생했습니다. 다시 시도해주세요.', 'error');
    } finally {
        // 버튼 복원
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// 비밀번호 찾기 폼 설정
function setupFindPasswordForm() {
    const form = document.getElementById('findPasswordForm');
    const sendCodeBtn = document.getElementById('findPwSendCodeBtn');
    const verifyBtn = document.getElementById('findPwVerifyBtn');
    const resendBtn = document.getElementById('findPwResendBtn');
    
    if (form) {
        form.addEventListener('submit', handleFindPassword);
    }
    
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', sendVerificationCode);
    }
    
    if (verifyBtn) {
        verifyBtn.addEventListener('click', verifyEmailCode);
    }
    
    if (resendBtn) {
        resendBtn.addEventListener('click', resendVerificationCode);
    }
}

// 이메일 인증코드 발송
async function sendVerificationCode() {
    const nameInput = document.getElementById('findPwName');
    const emailInput = document.getElementById('findPwEmail');
    const sendCodeBtn = document.getElementById('findPwSendCodeBtn');
    const verificationSection = document.getElementById('findPwVerificationSection');
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    
    // 유효성 검사
    if (!validateFindPwName() || !validateFindPwEmail()) {
        return;
    }
    
    const originalText = sendCodeBtn.innerHTML;
    sendCodeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 발송 중...';
    sendCodeBtn.disabled = true;
    
    try {
        const response = await fetch('/api/send_reset_code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // 발송 성공
            verificationSection.style.display = 'block';
            sendCodeBtn.style.display = 'none';
            
            showNotification('인증코드가 발송되었습니다. 이메일을 확인해주세요.', 'success');
            startResendTimer();
        } else {
            showNotification(data.message || '인증코드 발송에 실패했습니다.', 'error');
            sendCodeBtn.innerHTML = originalText;
            sendCodeBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('서버 오류가 발생했습니다. 다시 시도해주세요.', 'error');
        sendCodeBtn.innerHTML = originalText;
        sendCodeBtn.disabled = false;
    }
}

// 이메일 인증 코드 확인
async function verifyEmailCode() {
    const codeInput = document.getElementById('findPwVerificationCode');
    const verifyBtn = document.getElementById('findPwVerifyBtn');
    const authStatus = document.getElementById('findPwAuthStatus');
    const verificationSection = document.getElementById('findPwVerificationSection');
    const submitBtn = document.getElementById('findPwSubmitBtn');
    const email = document.getElementById('findPwEmail').value.trim();
    
    const code = codeInput.value.trim();
    
    if (!code || code.length !== 6) {
        showNotification('6자리 인증코드를 입력해주세요.', 'error');
        return;
    }
    
    const originalText = verifyBtn.innerHTML;
    verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 확인 중...';
    verifyBtn.disabled = true;
    
    try {
        const response = await fetch('/api/verify_reset_code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, code })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // 인증 성공
            verificationSection.style.display = 'none';
            authStatus.style.display = 'block';
            submitBtn.disabled = false;
            findPwEmailVerified = true;
            
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
        } else {
            showNotification(data.message || '인증코드가 올바르지 않습니다.', 'error');
            codeInput.value = '';
            verifyBtn.innerHTML = originalText;
            verifyBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('서버 오류가 발생했습니다. 다시 시도해주세요.', 'error');
        verifyBtn.innerHTML = originalText;
        verifyBtn.disabled = false;
    }
}

// 인증 코드 재발송
async function resendVerificationCode() {
    const emailInput = document.getElementById('findPwEmail');
    const email = emailInput.value.trim();
    
    try {
        const response = await fetch('/api/send_reset_code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                name: document.getElementById('findPwName').value.trim(), 
                email 
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('인증코드가 재발송되었습니다.', 'success');
            startResendTimer();
        } else {
            showNotification('재발송에 실패했습니다. 다시 시도해주세요.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('서버 오류가 발생했습니다.', 'error');
    }
}

// 재발송 타이머 시작
function startResendTimer() {
    const resendBtn = document.getElementById('findPwResendBtn');
    const countdown = document.getElementById('findPwCountdown');
    let seconds = 60;
    
    resendBtn.disabled = true;
    
    const timer = setInterval(() => {
        seconds--;
        if (countdown) countdown.textContent = seconds;
        
        if (seconds <= 0) {
            clearInterval(timer);
            resendBtn.disabled = false;
            resendBtn.innerHTML = '재발송';
        }
    }, 1000);
}

// 비밀번호 찾기 다음 단계
function handleFindPassword(e) {
    e.preventDefault();
    
    if (!findPwEmailVerified) {
        showNotification('이메일 인증을 완료해주세요.', 'error');
        return;
    }
    
    showPasswordChangeForm();
    showNotification('본인 확인이 완료되었습니다. 새 비밀번호를 설정해주세요.', 'success');
}

// 비밀번호 변경 폼 설정
function setupPasswordChangeForm() {
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('newPasswordConfirm');
    
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            validateNewPassword(this.value);
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validateNewPasswordConfirm);
    }
}

// 비밀번호 변경
window.changePassword = async function() {
    const email = document.getElementById('findPwEmail').value.trim();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('newPasswordConfirm').value;
    
    if (!validateNewPasswordForm()) {
        return;
    }
    
    try {
        const response = await fetch('/api/reset_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, new_password: newPassword })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showPasswordChanged();
            showNotification('비밀번호가 성공적으로 변경되었습니다.', 'success');
        } else {
            showNotification(data.message || '비밀번호 변경에 실패했습니다.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('서버 오류가 발생했습니다.', 'error');
    }
};

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
                result.style.opacity = '1';
                result.style.visibility = 'visible';
                
                gsap.fromTo(result, 
                    { opacity: 0, y: 20 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.5, 
                        ease: 'power2.out'
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
    
    if (resultHeader) {
        resultHeader.innerHTML = `
            <i class="fas fa-times-circle"></i>
            <h3>아이디 찾기 실패</h3>
        `;
    }
    
    if (resultContent) {
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
    }
    
    if (resultActions) {
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
    }
    
    // 폼 숨기기, 결과 표시 (showFindIdResult와 동일한 애니메이션)
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
                        ease: 'power2.out'
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
    const form = document.querySelector('#find-password .auth-form');
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

// 결과 섹션 숨기기
function hideAllResults() {
    const results = document.querySelectorAll('.result-section, #idResult, #passwordChangeForm, #passwordChanged');
    results.forEach(result => {
        if (result) result.style.display = 'none';
    });
    
    // 폼들 다시 보이기
    document.querySelectorAll('.auth-form').forEach(form => {
        if (form) form.style.display = 'block';
    });
}

// 폼 초기화
function resetForms() {
    // 아이디 찾기 폼 초기화
    const findIdForm = document.getElementById('findIdForm');
    if (findIdForm) findIdForm.reset();
    
    // 비밀번호 찾기 폼 초기화
    const findPwForm = document.getElementById('findPasswordForm');
    if (findPwForm) findPwForm.reset();
    
    // 비밀번호 변경 폼 초기화
    const pwChangeForm = document.getElementById('passwordChangeForm');
    if (pwChangeForm) {
        const inputs = pwChangeForm.querySelectorAll('input');
        inputs.forEach(input => input.value = '');
    }
    
    // 상태 초기화
    findPwEmailVerified = false;
    
    // 인증 관련 요소 숨기기
    const verificationSection = document.getElementById('findPwVerificationSection');
    const authStatus = document.getElementById('findPwAuthStatus');
    const sendCodeBtn = document.getElementById('findPwSendCodeBtn');
    const submitBtn = document.getElementById('findPwSubmitBtn');
    
    if (verificationSection) verificationSection.style.display = 'none';
    if (authStatus) authStatus.style.display = 'none';
    if (sendCodeBtn) {
        sendCodeBtn.style.display = 'block';
        sendCodeBtn.disabled = false;
    }
    if (submitBtn) submitBtn.disabled = true;
    
    // 에러 메시지 모두 제거
    clearAllErrors();
}

// 유효성 검사 함수들
function validateFindIdForm() {
    return validateFindIdName() && validateFindIdPhone();
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

function validateNewPasswordForm() {
    const password = document.getElementById('newPassword').value;
    return validateNewPassword(password) && validateNewPasswordConfirm();
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
            if (Math.random() > 0.2) {
                resolve({ success: true });
            } else {
                reject(new Error('API 오류'));
            }
        }, delay);
    });
}

// fallback 알림 함수
const fallbackNotification = (message, type = 'info') => {
    alert(`[${type}] ${message}`);
};

// 안전한 알림 함수 설정
let safeNotify = typeof window.showNotification === 'function' && window.showNotification !== showNotification
    ? window.showNotification
    : fallbackNotification;

// showNotification 함수 정의
function showNotification(message, type = 'info') {
    safeNotify(message, type);
}

function clearAllErrors() {
    // 에러 메시지 제거
    const errorElements = document.querySelectorAll('.error-message.show');
    errorElements.forEach(el => el.classList.remove('show'));

    // input 필드에 있는 .error 클래스 제거
    const errorInputs = document.querySelectorAll('input.error');
    errorInputs.forEach(el => el.classList.remove('error'));
}

