// static/js/register.js

let currentStep = 1;
let verificationTimer = null;
let verificationTimeLeft = 0;

// 회원가입 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeRegister();
    initializeEmailCheck();
    initializeVerification();
    initializeAgreements();
});

// 회원가입 시스템 초기화
function initializeRegister() {
    // 단계별 폼 표시
    showStep(1);
    
    // 폼 제출 이벤트
    const step1Form = document.getElementById('step1Form');
    if (step1Form) {
        step1Form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateStep1()) {
                nextStep(2);
            }
        });
    }
    
    const step2Form = document.getElementById('step2Form');
    if (step2Form) {
        step2Form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateStep2()) {
                completeRegistration();
            }
        });
    }
}

// 단계 전환 애니메이션
window.nextStep = function(step) {
    if (step === 2 && !validateStep1()) {
        return;
    }
    
    if (step === 3 && !validateStep2()) {
        return;
    }
    
    const currentForm = document.querySelector(`.step-form[data-step="${currentStep}"]`);
    const nextForm = document.querySelector(`.step-form[data-step="${step}"]`);
    
    if (typeof gsap !== 'undefined') {
        // 현재 폼 숨기기
        gsap.to(currentForm, {
            duration: 0.3,
            opacity: 0,
            x: -50,
            onComplete: () => {
                currentForm.classList.remove('active');
                nextForm.classList.add('active');
                
                // 다음 폼 표시
                gsap.fromTo(nextForm, 
                    { opacity: 0, x: 50 },
                    { duration: 0.3, opacity: 1, x: 0 }
                );
            }
        });
    } else {
        currentForm.classList.remove('active');
        nextForm.classList.add('active');
    }
    
    currentStep = step;
    updateProgressBar(step);
    updateStepStatus(step);
};

window.prevStep = function(step) {
    const currentForm = document.querySelector(`.step-form[data-step="${currentStep}"]`);
    const prevForm = document.querySelector(`.step-form[data-step="${step}"]`);
    
    if (typeof gsap !== 'undefined') {
        gsap.to(currentForm, {
            duration: 0.3,
            opacity: 0,
            x: 50,
            onComplete: () => {
                currentForm.classList.remove('active');
                prevForm.classList.add('active');
                
                gsap.fromTo(prevForm,
                    { opacity: 0, x: -50 },
                    { duration: 0.3, opacity: 1, x: 0 }
                );
            }
        });
    } else {
        currentForm.classList.remove('active');
        prevForm.classList.add('active');
    }
    
    currentStep = step;
    updateProgressBar(step);
    updateStepStatus(step);
};

// 단계 표시
function showStep(step) {
    document.querySelectorAll('.step-form').forEach(form => {
        form.classList.remove('active');
    });
    
    const targetForm = document.querySelector(`.step-form[data-step="${step}"]`);
    if (targetForm) {
        targetForm.classList.add('active');
    }
    
    updateProgressBar(step);
    updateStepStatus(step);
}

// 진행률 바 업데이트
function updateProgressBar(step) {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const percentage = (step / 3) * 100;
        progressFill.style.width = percentage + '%';
    }
}

// 단계 상태 업데이트
function updateStepStatus(step) {
    document.querySelectorAll('.step').forEach((stepElement, index) => {
        const stepNumber = index + 1;
        
        stepElement.classList.remove('active', 'completed');
        
        if (stepNumber < step) {
            stepElement.classList.add('completed');
        } else if (stepNumber === step) {
            stepElement.classList.add('active');
        }
    });
}

// 1단계 유효성 검사
function validateStep1() {
    let isValid = true;
    
    // 이름 검사
    const lastName = document.getElementById('lastName').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    
    if (!lastName) {
        showFieldError('lastNameError', '성을 입력해주세요.');
        isValid = false;
    }
    
    if (!firstName) {
        showFieldError('firstNameError', '이름을 입력해주세요.');
        isValid = false;
    }
    
    // 이메일 검사
    const email = document.getElementById('email').value.trim();
    if (!validateEmailField(document.getElementById('email'))) {
        isValid = false;
    }
    
    // 휴대폰 검사
    if (!validatePhoneField(document.getElementById('phone'))) {
        isValid = false;
    }
    
    // 비밀번호 검사
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    
    if (password.length < 8) {
        showFieldError('passwordError', '비밀번호는 8자 이상이어야 합니다.');
        isValid = false;
    }
    
    if (password !== passwordConfirm) {
        showFieldError('passwordConfirmError', '비밀번호가 일치하지 않습니다.');
        isValid = false;
    }
    
    if (isValid) {
        // 2단계로 넘어갈 때 휴대폰 번호 표시
        const phoneDisplay = document.getElementById('phoneDisplay');
        if (phoneDisplay) {
            phoneDisplay.textContent = document.getElementById('phone').value;
        }
    }
    
    return isValid;
}

// 2단계 유효성 검사
function validateStep2() {
    let isValid = true;
    
    // 인증번호 검사
    const verificationCode = document.getElementById('verificationCode').value.trim();
    if (!verificationCode || verificationCode.length !== 6) {
        showFieldError('verificationError', '6자리 인증번호를 입력해주세요.');
        isValid = false;
    }
    
    // 필수 약관 동의 검사
    const agreeTerms = document.querySelector('input[name="agreeTerms"]').checked;
    const agreePrivacy = document.querySelector('input[name="agreePrivacy"]').checked;
    
    if (!agreeTerms || !agreePrivacy) {
        showNotification('필수 약관에 동의해주세요.', 'error');
        isValid = false;
    }
    
    return isValid;
}

// 이메일 중복 확인
function initializeEmailCheck() {
    const emailCheckBtn = document.getElementById('emailCheckBtn');
    if (emailCheckBtn) {
        emailCheckBtn.addEventListener('click', async function() {
            const email = document.getElementById('email').value.trim();
            
            if (!validateEmail(email)) {
                showFieldError('emailError', '올바른 이메일 형식을 입력해주세요.');
                return;
            }
            
            // 버튼 상태 변경
            const originalText = this.textContent;
            this.textContent = '확인 중...';
            this.disabled = true;
            
            try {
                // API 호출 시뮬레이션
                await simulateAPICall(1000);
                
                // 랜덤하게 중복/사용가능 결정 (90% 확률로 사용 가능)
                if (Math.random() > 0.1) {
                    showFieldSuccess('emailSuccess', '사용 가능한 이메일입니다.');
                    clearFieldError('emailError');
                    this.textContent = '확인완료';
                    this.classList.add('btn-success');
                } else {
                    showFieldError('emailError', '이미 사용중인 이메일입니다.');
                    this.textContent = originalText;
                    this.disabled = false;
                }
            } catch (error) {
                showFieldError('emailError', '이메일 확인 중 오류가 발생했습니다.');
                this.textContent = originalText;
                this.disabled = false;
            }
        });
    }
}

// 인증번호 발송 및 타이머
function initializeVerification() {
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', sendVerificationCode);
    }
}

async function sendVerificationCode() {
    const phone = document.getElementById('phone').value.trim();
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    
    if (!validatePhoneField(document.getElementById('phone'))) {
        return;
    }
    
    // 버튼 상태 변경
    const originalText = sendCodeBtn.textContent;
    sendCodeBtn.textContent = '발송 중...';
    sendCodeBtn.disabled = true;
    
    try {
        // API 호출 시뮬레이션
        await simulateAPICall(1500);
        
        showNotification('인증번호가 발송되었습니다.', 'success');
        
        // 타이머 시작 (3분)
        startVerificationTimer(180);
        
    } catch (error) {
        showFieldError('verificationError', '인증번호 발송에 실패했습니다.');
        sendCodeBtn.textContent = originalText;
        sendCodeBtn.disabled = false;
    }
}

function startVerificationTimer(seconds) {
    verificationTimeLeft = seconds;
    const timerElement = document.getElementById('verificationTimer');
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    
    verificationTimer = setInterval(() => {
        const minutes = Math.floor(verificationTimeLeft / 60);
        const secs = verificationTimeLeft % 60;
        
        timerElement.textContent = `${minutes}:${secs.toString().padStart(2, '0')} 후 재발송 가능`;
        
        verificationTimeLeft--;
        
        if (verificationTimeLeft < 0) {
            clearInterval(verificationTimer);
            timerElement.textContent = '';
            sendCodeBtn.textContent = '재발송';
            sendCodeBtn.disabled = false;
        }
    }, 1000);
}

// 약관 동의 처리
function initializeAgreements() {
    const agreeAllCheckbox = document.getElementById('agreeAll');
    if (agreeAllCheckbox) {
        agreeAllCheckbox.addEventListener('change', function() {
            const allCheckboxes = document.querySelectorAll('.agreement-list input[type="checkbox"]');
            allCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    // 개별 체크박스 변경 시 전체 동의 상태 업데이트
    const individualCheckboxes = document.querySelectorAll('.agreement-list input[type="checkbox"]');
    individualCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const allChecked = Array.from(individualCheckboxes).every(cb => cb.checked);
            if (agreeAllCheckbox) {
                agreeAllCheckbox.checked = allChecked;
            }
        });
    });
}

// 회원가입 완료
async function completeRegistration() {
    const step2Form = document.getElementById('step2Form');
    const submitBtn = step2Form.querySelector('button[type="button"]:last-child');
    
    // 로딩 상태
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 가입 처리 중...';
    submitBtn.disabled = true;
    
    try {
        // API 호출 시뮬레이션
        await simulateAPICall(2000);
        
        // 성공 시 3단계로 이동
        nextStep(3);
        
        // 성공 애니메이션
        if (typeof gsap !== 'undefined') {
            gsap.from('.completion-icon', {
                duration: 0.8,
                scale: 0,
                rotation: 180,
                delay: 0.3,
                ease: 'back.out(1.7)'
            });
            
            gsap.from('.completion-section h2', {
                duration: 0.6,
                y: 30,
                opacity: 0,
                delay: 0.8,
                ease: 'power2.out'
            });
            
            gsap.from('.welcome-benefits', {
                duration: 0.8,
                y: 50,
                opacity: 0,
                delay: 1.2,
                ease: 'power2.out'
            });
        }
        
        showNotification('회원가입이 완료되었습니다!', 'success');
        
    } catch (error) {
        showFieldError('verificationError', '회원가입 처리 중 오류가 발생했습니다.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// 유틸리티 함수들 (auth.js에 있는 함수들을 여기서도 사용)
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateEmailField(input) {
    const email = input.value.trim();
    
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

function validatePhoneField(input) {
    const phone = input.value.trim();
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    
    if (!phone) {
        showFieldError(input.id + 'Error', '휴대폰 번호를 입력해주세요.');
        return false;
    }
    
    if (!phoneRegex.test(phone)) {
        showFieldError(input.id + 'Error', '올바른 휴대폰 번호 형식으로 입력해주세요.');
        return false;
    }
    
    clearFieldError(input.id + 'Error');
    return true;
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

function showFieldSuccess(successId, message) {
    const successElement = document.getElementById(successId);
    if (successElement) {
        successElement.textContent = message;
        successElement.classList.add('show');
        
        const inputId = successId.replace('Success', '');
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            inputElement.classList.add('success');
        }
    }
}

function simulateAPICall(delay = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.05) { // 95% 성공률
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