// static/js/register.js

let currentStep = 1;
let isEmailVerified = false;

// 회원가입 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeRegister();
    initializeEmailCheck();
    initializeNicknameCheck();
    initializePasswordValidation();
    initializeEmailAuth();
    initializeAgreements();
    initializeAddressSearch();
    initializeFormValidation();
    
    // 모든 폼 요소를 즉시 표시
    const allFormElements = document.querySelectorAll('.auth-form .form-group, .auth-form .btn-full, .auth-form .agreement-section');
    allFormElements.forEach(element => {
        if (element) {
            element.classList.add('show');
        }
    });
});

// 회원가입 시스템 초기화
function initializeRegister() {
    showStep(1);
    
    // 모든 폼 요소를 즉시 표시
    const formElements = document.querySelectorAll('.form-group, .btn-full, .agreement-section');
    formElements.forEach(element => {
        if (element) {
            element.classList.add('show');
        }
    });
    
    const step1Form = document.getElementById('step1Form');
    if (step1Form) {
        step1Form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateStep1()) {
                nextStep(2);
            }
        });
    }
}

// 폼 유효성 검사 초기화
function initializeFormValidation() {
    // 실시간 유효성 검사
    const inputs = document.querySelectorAll('#step1Form input, #step1Form select');
    inputs.forEach(input => {
        input.addEventListener('input', checkFormValidity);
        input.addEventListener('change', checkFormValidity);
    });
    
    // 약관 체크박스 이벤트
    const checkboxes = document.querySelectorAll('#step1Form input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', checkFormValidity);
    });
    
    // 성별 버튼 이벤트
    const genderButtons = document.querySelectorAll('.gender-btn');
    genderButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 모든 버튼에서 active 클래스 제거
            genderButtons.forEach(btn => btn.classList.remove('active'));
            // 클릭된 버튼에 active 클래스 추가
            this.classList.add('active');
            // 라디오 버튼 체크
            const radioInput = this.querySelector('input[type="radio"]');
            if (radioInput) {
                radioInput.checked = true;
            }
            checkFormValidity();
        });
    });
    
    // 생년월일 숫자만 입력
    const birthDateInput = document.getElementById('birthDate');
    if (birthDateInput) {
        birthDateInput.addEventListener('input', function() {
            // 숫자만 허용
            this.value = this.value.replace(/\D/g, '');
            if (this.value.length > 8) {
                this.value = this.value.substring(0, 8);
            }
            checkFormValidity();
        });
        
        birthDateInput.addEventListener('blur', function() {
            validateBirthDate();
        });
    }
}

// 폼 유효성 검사 및 버튼 활성화
function checkFormValidity() {
    const nextBtn = document.getElementById('nextToEmailBtn');
    if (!nextBtn) return;
    
    // 필수 입력 필드 검사
    const requiredFields = [
        'fullName', 'email', 'nickname', 'password', 'passwordConfirm', 
        'birthDate', 'phone', 'address'
    ];
    
    let allFieldsValid = true;
    
    // 각 필드 검사
    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            allFieldsValid = false;
            break;
        }
    }
    
    // 성별 선택 검사
    const genderSelected = document.querySelector('input[name="gender"]:checked');
    if (!genderSelected) {
        allFieldsValid = false;
    }
    
    // 이메일 중복확인 검사
    const emailCheckBtn = document.getElementById('emailCheckBtn');
    const emailChecked = emailCheckBtn && emailCheckBtn.classList.contains('btn-success');
    
    // 닉네임 중복확인 검사
    const nicknameCheckBtn = document.getElementById('nicknameCheckBtn');
    const nicknameChecked = nicknameCheckBtn && nicknameCheckBtn.classList.contains('btn-success');
    
    // 비밀번호 유효성 검사
    const password = document.getElementById('password').value;
    const passwordValid = validatePassword(password);
    
    // 비밀번호 확인 검사
    const passwordConfirmValid = validatePasswordConfirm();
    
    // 생년월일 검사
    const birthDateValid = validateBirthDate();
    
    // 필수 약관 동의 검사
    const agreeTerms = document.querySelector('input[name="agreeTerms"]').checked;
    const agreePrivacy = document.querySelector('input[name="agreePrivacy"]').checked;
    
    // 모든 조건 확인
    const isValid = allFieldsValid && genderSelected && emailChecked && nicknameChecked && 
                   passwordValid && passwordConfirmValid && birthDateValid && agreeTerms && agreePrivacy;
    
    // 버튼 활성화/비활성화
    nextBtn.disabled = !isValid;
    
    if (isValid) {
        nextBtn.classList.remove('disabled');
        nextBtn.style.opacity = '1';
    } else {
        nextBtn.classList.add('disabled');
        nextBtn.style.opacity = '0.6';
    }
}

// 단계 전환
window.nextStep = function(step) {
    if (step === 2 && !validateStep1()) {
        return;
    }
    
    if (step === 3 && !isEmailVerified) {
        showNotification('이메일 인증을 완료해주세요.', 'error');
        return;
    }
    
    const currentForm = document.querySelector(`.step-form[data-step="${currentStep}"]`);
    const nextForm = document.querySelector(`.step-form[data-step="${step}"]`);
    
    // 2단계로 넘어갈 때 정보 표시
    if (step === 2) {
        const nameDisplay = document.getElementById('nameDisplay');
        const emailDisplay = document.getElementById('emailDisplay');
        if (nameDisplay) nameDisplay.textContent = document.getElementById('fullName').value;
        if (emailDisplay) emailDisplay.textContent = document.getElementById('email').value;
    }
    
    if (typeof gsap !== 'undefined') {
        gsap.to(currentForm, {
            duration: 0.3,
            opacity: 0,
            x: -50,
            onComplete: () => {
                currentForm.classList.remove('active');
                nextForm.classList.add('active');
                
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
    
    if (step === 3) {
        showCompletionAnimation();
    }
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

// 이메일 중복 확인
function initializeEmailCheck() {
    const emailCheckBtn = document.getElementById('emailCheckBtn');
    const emailInput = document.getElementById('email');
    
    if (emailCheckBtn && emailInput) {
        emailCheckBtn.addEventListener('click', checkEmailDuplicate);
        emailInput.addEventListener('input', function() {
            clearEmailValidation();
            checkFormValidity();
        });
    }
}

async function checkEmailDuplicate() {
    const email = document.getElementById('email').value.trim();
    const emailCheckBtn = document.getElementById('emailCheckBtn');
    
    if (!validateEmail(email)) {
        showValidationMessage('emailValidation', '올바른 이메일 형식을 입력해주세요.', 'invalid');
        return;
    }
    
    const originalText = emailCheckBtn.textContent;
    emailCheckBtn.textContent = '확인 중...';
    emailCheckBtn.disabled = true;
    
    try {
        await simulateAPICall(1000);
        
        // 90% 확률로 사용 가능
        if (Math.random() > 0.1) {
            showValidationMessage('emailValidation', '사용 가능한 이메일입니다.', 'valid');
            emailCheckBtn.textContent = '확인완료';
            emailCheckBtn.classList.add('btn-success');
            checkFormValidity();
        } else {
            showValidationMessage('emailValidation', '이미 사용중인 이메일입니다.', 'invalid');
            emailCheckBtn.textContent = originalText;
            emailCheckBtn.disabled = false;
        }
    } catch (error) {
        showValidationMessage('emailValidation', '이메일 확인 중 오류가 발생했습니다.', 'invalid');
        emailCheckBtn.textContent = originalText;
        emailCheckBtn.disabled = false;
    }
}

function clearEmailValidation() {
    const emailCheckBtn = document.getElementById('emailCheckBtn');
    const emailValidation = document.getElementById('emailValidation');
    
    if (emailValidation) {
        emailValidation.textContent = '';
        emailValidation.className = 'validation-message';
    }
    
    if (emailCheckBtn) {
        emailCheckBtn.textContent = '중복확인';
        emailCheckBtn.disabled = false;
        emailCheckBtn.classList.remove('btn-success');
    }
}

// 닉네임 중복 확인
function initializeNicknameCheck() {
    const nicknameCheckBtn = document.getElementById('nicknameCheckBtn');
    const nicknameInput = document.getElementById('nickname');
    
    if (nicknameCheckBtn && nicknameInput) {
        nicknameCheckBtn.addEventListener('click', checkNicknameDuplicate);
        nicknameInput.addEventListener('input', function() {
            clearNicknameValidation();
            checkFormValidity();
        });
    }
}

async function checkNicknameDuplicate() {
    const nickname = document.getElementById('nickname').value.trim();
    const nicknameCheckBtn = document.getElementById('nicknameCheckBtn');
    
    if (!validateNickname(nickname)) {
        return;
    }
    
    const originalText = nicknameCheckBtn.textContent;
    nicknameCheckBtn.textContent = '확인 중...';
    nicknameCheckBtn.disabled = true;
    
    try {
        await simulateAPICall(1000);
        
        // 90% 확률로 사용 가능
        if (Math.random() > 0.1) {
            showValidationMessage('nicknameValidation', '사용 가능한 닉네임입니다.', 'valid');
            nicknameCheckBtn.textContent = '확인완료';
            nicknameCheckBtn.classList.add('btn-success');
            checkFormValidity();
        } else {
            showValidationMessage('nicknameValidation', '이미 사용중인 닉네임입니다.', 'invalid');
            nicknameCheckBtn.textContent = originalText;
            nicknameCheckBtn.disabled = false;
        }
    } catch (error) {
        showValidationMessage('nicknameValidation', '닉네임 확인 중 오류가 발생했습니다.', 'invalid');
        nicknameCheckBtn.textContent = originalText;
        nicknameCheckBtn.disabled = false;
    }
}

function clearNicknameValidation() {
    const nicknameCheckBtn = document.getElementById('nicknameCheckBtn');
    const nicknameValidation = document.getElementById('nicknameValidation');
    
    if (nicknameValidation) {
        nicknameValidation.textContent = '';
        nicknameValidation.className = 'validation-message';
    }
    
    if (nicknameCheckBtn) {
        nicknameCheckBtn.textContent = '중복확인';
        nicknameCheckBtn.disabled = false;
        nicknameCheckBtn.classList.remove('btn-success');
    }
}

function validateNickname(nickname) {
    if (!nickname) {
        showValidationMessage('nicknameValidation', '닉네임을 입력해주세요.', 'invalid');
        return false;
    }
    
    if (nickname.length < 2 || nickname.length > 12) {
        showValidationMessage('nicknameValidation', '닉네임은 2~12자여야 합니다.', 'invalid');
        return false;
    }
    
    // 한글, 영문, 숫자만 허용
    const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;
    if (!nicknameRegex.test(nickname)) {
        showValidationMessage('nicknameValidation', '한글, 영문, 숫자만 사용 가능합니다.', 'invalid');
        return false;
    }
    
    // 특수문자나 공백 체크
    if (/[\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(nickname)) {
        showValidationMessage('nicknameValidation', '특수문자와 공백은 사용할 수 없습니다.', 'invalid');
        return false;
    }
    
    clearFieldError('nicknameError');
    return true;
}

// 비밀번호 유효성 검사
function initializePasswordValidation() {
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('passwordConfirm');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            validatePassword(this.value);
            checkFormValidity();
        });
    }
    
    if (passwordConfirmInput) {
        passwordConfirmInput.addEventListener('input', function() {
            validatePasswordConfirm();
            checkFormValidity();
        });
    }
}

function validatePassword(password) {
    const validation = document.getElementById('passwordValidation');
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

// 생년월일 유효성 검사
function validateBirthDate() {
    const birthDate = document.getElementById('birthDate').value.trim();
    
    if (!birthDate) {
        showFieldError('birthDateError', '생년월일을 입력해주세요.');
        return false;
    }
    
    if (birthDate.length !== 8) {
        showFieldError('birthDateError', '생년월일을 8자리로 입력해주세요. (예: 20020101)');
        return false;
    }
    
    // 날짜 형식 검증
    const year = parseInt(birthDate.substring(0, 4));
    const month = parseInt(birthDate.substring(4, 6));
    const day = parseInt(birthDate.substring(6, 8));
    
    const currentYear = new Date().getFullYear();
    
    if (year < 1900 || year > currentYear) {
        showFieldError('birthDateError', '올바른 연도를 입력해주세요.');
        return false;
    }
    
    if (month < 1 || month > 12) {
        showFieldError('birthDateError', '올바른 월을 입력해주세요.');
        return false;
    }
    
    if (day < 1 || day > 31) {
        showFieldError('birthDateError', '올바른 일을 입력해주세요.');
        return false;
    }
    
    // 실제 날짜 유효성 검사
    const testDate = new Date(year, month - 1, day);
    if (testDate.getFullYear() !== year || testDate.getMonth() !== month - 1 || testDate.getDate() !== day) {
        showFieldError('birthDateError', '유효하지 않은 날짜입니다.');
        return false;
    }
    
    clearFieldError('birthDateError');
    return true;
}

// 이메일 인증
function initializeEmailAuth() {
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    const verifyCodeBtn = document.getElementById('verifyCodeBtn');
    const resendBtn = document.getElementById('resendBtn');
    
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', sendVerificationCode);
    }
    
    if (verifyCodeBtn) {
        verifyCodeBtn.addEventListener('click', verifyEmailCode);
    }
    
    if (resendBtn) {
        resendBtn.addEventListener('click', resendVerificationCode);
    }
}

async function sendVerificationCode() {
    const email = document.getElementById('emailDisplay').textContent;
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    const verificationSection = document.getElementById('verificationSection');
    
    const originalText = sendCodeBtn.innerHTML;
    sendCodeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 발송 중...';
    sendCodeBtn.disabled = true;
    
    try {
        await simulateAPICall(1500);
        
        // 발송 성공
        verificationSection.style.display = 'block';
        sendCodeBtn.style.display = 'none';
        
        showNotification('인증코드가 발송되었습니다. 이메일을 확인해주세요.', 'success');
        startResendTimer();
        
    } catch (error) {
        showNotification('인증코드 발송에 실패했습니다. 다시 시도해주세요.', 'error');
        sendCodeBtn.innerHTML = originalText;
        sendCodeBtn.disabled = false;
    }
}

async function verifyEmailCode() {
    const code = document.getElementById('verificationCode').value.trim();
    const verifyCodeBtn = document.getElementById('verifyCodeBtn');
    
    if (!code || code.length !== 6) {
        showNotification('6자리 인증코드를 입력해주세요.', 'error');
        return;
    }
    
    const originalText = verifyCodeBtn.innerHTML;
    verifyCodeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 확인 중...';
    verifyCodeBtn.disabled = true;
    
    try {
        await simulateAPICall(1000);
        
        // 인증 성공
        const email = document.getElementById('emailDisplay').textContent;
        document.getElementById('verifiedEmail').textContent = email;
        
        const verificationSection = document.getElementById('verificationSection');
        const authSuccess = document.getElementById('authSuccess');
        const step2NextBtn = document.getElementById('step2NextBtn');
        
        verificationSection.style.display = 'none';
        authSuccess.style.display = 'block';
        step2NextBtn.disabled = false;
        
        isEmailVerified = true;
        
        showNotification('이메일 인증이 완료되었습니다.', 'success');
        
        // GSAP 애니메이션
        if (typeof gsap !== 'undefined') {
            gsap.from(authSuccess, {
                duration: 0.6,
                scale: 0.9,
                opacity: 0,
                ease: 'back.out(1.7)'
            });
        }
        
    } catch (error) {
        showNotification('인증코드가 올바르지 않습니다. 다시 확인해주세요.', 'error');
        document.getElementById('verificationCode').value = '';
        verifyCodeBtn.innerHTML = originalText;
        verifyCodeBtn.disabled = false;
    }
}

async function resendVerificationCode() {
    const email = document.getElementById('emailDisplay').textContent;
    
    try {
        await simulateAPICall(1000);
        
        showNotification('인증코드가 재발송되었습니다.', 'success');
        startResendTimer();
        
    } catch (error) {
        showNotification('재발송에 실패했습니다. 다시 시도해주세요.', 'error');
    }
}

function startResendTimer() {
    const resendBtn = document.getElementById('resendBtn');
    const countdown = document.getElementById('countdown');
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

// 주소 검색
function initializeAddressSearch() {
    const addressSearchBtn = document.getElementById('addressSearchBtn');
    if (addressSearchBtn) {
        addressSearchBtn.addEventListener('click', searchAddress);
    }
}

function searchAddress() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('postcode').value = data.zonecode;
            
            let addr = ''; // 주소 변수
            
            // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }
            
            // 주소 정보를 해당 필드에 넣는다.
            document.getElementById('address').value = addr;
            
            // 커서를 상세주소 필드로 이동한다.
            document.getElementById('detailAddress').focus();
            
            showNotification('주소가 입력되었습니다.', 'success');
            checkFormValidity();
        }
    }).open();
}

// 약관 동의
function initializeAgreements() {
    const agreeAllCheckbox = document.getElementById('agreeAll');
    if (agreeAllCheckbox) {
        agreeAllCheckbox.addEventListener('change', function() {
            const allCheckboxes = document.querySelectorAll('.agreement-list input[type="checkbox"]');
            allCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            checkFormValidity();
        });
    }
    
    const individualCheckboxes = document.querySelectorAll('.agreement-list input[type="checkbox"]');
    individualCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const allChecked = Array.from(individualCheckboxes).every(cb => cb.checked);
            if (agreeAllCheckbox) {
                agreeAllCheckbox.checked = allChecked;
            }
            checkFormValidity();
        });
    });
}

// 팝업 함수들
window.showTermsPopup = function() {
    showPopup('이용약관', getTermsContent());
};

window.showPrivacyPopup = function() {
    showPopup('개인정보처리방침', getPrivacyContent());
};

window.showMarketingPopup = function() {
    showPopup('마케팅 정보 수신 동의', getMarketingContent());
};

function showPopup(title, content) {
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay';
    
    popupOverlay.innerHTML = `
        <div class="popup-content">
            <div class="popup-header">
                <h3>${title}</h3>
                <button class="popup-close" onclick="closePopup(this)">&times;</button>
            </div>
            <div class="popup-body">
                ${content}
            </div>
            <div class="popup-footer">
                <button class="btn btn-primary" onclick="closePopup(this)">확인</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(popupOverlay);
    
    // 팝업 외부 클릭시 닫기
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            document.body.removeChild(popupOverlay);
        }
    });
}

window.closePopup = function(btn) {
    const popupOverlay = btn.closest('.popup-overlay');
    if (popupOverlay) {
        document.body.removeChild(popupOverlay);
    }
};

// 1단계 유효성 검사
function validateStep1() {
    let isValid = true;
    
    // 성함 검사
    const fullName = document.getElementById('fullName').value.trim();
    if (!fullName || fullName.length < 2) {
        showFieldError('fullNameError', '성함을 정확히 입력해주세요.');
        isValid = false;
    }
    
    // 이메일 검사
    const email = document.getElementById('email').value.trim();
    const emailCheckBtn = document.getElementById('emailCheckBtn');
    if (!validateEmail(email)) {
        showValidationMessage('emailValidation', '올바른 이메일 형식을 입력해주세요.', 'invalid');
        isValid = false;
    } else if (!emailCheckBtn.classList.contains('btn-success')) {
        showValidationMessage('emailValidation', '이메일 중복확인을 해주세요.', 'invalid');
        isValid = false;
    }
    
    // 닉네임 검사
    const nickname = document.getElementById('nickname').value.trim();
    const nicknameCheckBtn = document.getElementById('nicknameCheckBtn');
    if (!validateNickname(nickname)) {
        isValid = false;
    } else if (!nicknameCheckBtn.classList.contains('btn-success')) {
        showValidationMessage('nicknameValidation', '닉네임 중복확인을 해주세요.', 'invalid');
        isValid = false;
    }
    
    // 비밀번호 검사
    const password = document.getElementById('password').value;
    if (!validatePassword(password)) {
        isValid = false;
    }
    
    // 비밀번호 확인 검사
    if (!validatePasswordConfirm()) {
        isValid = false;
    }
    
    // 생년월일 검사
    if (!validateBirthDate()) {
        isValid = false;
    }
    
    // 휴대폰 검사
    if (!validatePhoneField(document.getElementById('phone'))) {
        isValid = false;
    }
    
    // 성별 검사
    const genderSelected = document.querySelector('input[name="gender"]:checked');
    if (!genderSelected) {
        showFieldError('genderError', '성별을 선택해주세요.');
        isValid = false;
    } else {
        clearFieldError('genderError');
    }
    
    // 주소 검사
    const address = document.getElementById('address').value.trim();
    if (!address) {
        showFieldError('addressError', '주소를 입력해주세요.');
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

// 완료 애니메이션
function showCompletionAnimation() {
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
}

// 유틸리티 함수들
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

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

function showValidationMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = `validation-message ${type}`;
    }
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
            if (Math.random() > 0.05) {
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

// 전화번호 입력 이벤트 추가
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
            checkFormValidity();
        });
    }
});

// 약관 내용
function getTermsContent() {
    return `
        <h4>제1조 (목적)</h4>
        <p>이 약관은 손길 서비스(이하 "회사")가 제공하는 실종자 찾기 플랫폼 서비스의 이용에 관한 조건 및 절차를 규정함을 목적으로 합니다.</p>
        
        <h4>제2조 (용어의 정의)</h4>
        <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
        <ol>
            <li>"서비스"란 회사가 제공하는 실종자 신고, 목격 정보 제보, 포인트 시스템 등 모든 서비스를 말합니다.</li>
            <li>"이용자"란 회사의 서비스에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
            <li>"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
        </ol>
        
        <h4>제3조 (약관의 효력 및 변경)</h4>
        <p>이 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.</p>
    `;
}

function getPrivacyContent() {
    return `
        <h4>개인정보 수집 및 이용 동의</h4>
        
        <h4>1. 개인정보 수집 목적</h4>
        <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
        <ul>
            <li>회원 가입 및 관리</li>
            <li>실종자 신고 및 목격 정보 제보 서비스 제공</li>
            <li>본인 확인 및 연령 확인</li>
            <li>서비스 이용에 따른 요금 정산</li>
            <li>고객 상담 및 불만 처리</li>
        </ul>
        
        <h4>2. 수집하는 개인정보의 항목</h4>
        <p>회사는 다음과 같은 개인정보를 수집합니다:</p>
        <ul>
            <li>필수항목: 성명, 이메일, 비밀번호, 닉네임, 생년월일, 휴대폰번호, 성별, 주소</li>
            <li>선택항목: 마케팅 수신 동의 여부</li>
            <li>자동 수집 항목: IP주소, 접속 로그, 서비스 이용 기록</li>
        </ul>
        
        <h4>3. 개인정보의 보유 및 이용기간</h4>
        <p>회사는 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계 법령에 의해 보존할 필요가 있는 경우 법령에서 정한 기간 동안 보관합니다.</p>
        
        <h4>4. 개인정보 처리의 위탁</h4>
        <p>회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>
        <ul>
            <li>SMS 발송: (주)알리고</li>
            <li>본인인증: 한국정보인증(주)</li>
        </ul>
        
        <h4>5. 개인정보 보호책임자</h4>
        <p>성명: 안기부<br>
        연락처: facecom2000@gmail.com<br>
        전화번호: 010-7905-5370</p>
        
        <p>정보주체는 개인정보보호법 등 관계 법령을 위반하여 신고·상담이나 처리결과 등에 대하여 불만이나 의견이 있으시면 개인정보보호위원회 개인정보보호 종합지원 포털(www.privacy.go.kr)의 개인정보보호 신고센터를 이용하실 수 있습니다.</p>
    `;
}

function getMarketingContent() {
    return `
        <h4>마케팅 정보 수신 동의</h4>
        
        <h4>1. 마케팅 정보 수신 목적</h4>
        <p>회사는 다음의 목적으로 마케팅 정보를 발송합니다:</p>
        <ul>
            <li>신규 서비스 및 이벤트 정보 안내</li>
            <li>맞춤형 서비스 제공을 위한 정보 분석</li>
            <li>서비스 개선을 위한 설문조사</li>
            <li>혜택 및 프로모션 정보 제공</li>
        </ul>
        
        <h4>2. 마케팅 정보 수신 방법</h4>
        <p>마케팅 정보는 다음의 방법으로 발송됩니다:</p>
        <ul>
            <li>이메일</li>
            <li>SMS</li>
            <li>앱 푸시 알림</li>
            <li>우편</li>
        </ul>
        
        <h4>3. 마케팅 정보 수신 동의 철회</h4>
        <p>마케팅 정보 수신에 동의하신 경우에도 언제든지 다음의 방법으로 수신을 거부하실 수 있습니다:</p>
        <ul>
            <li>마이페이지 > 정보수신설정에서 변경</li>
            <li>고객센터 연락 (010-7905-5370)</li>
            <li>수신거부 링크 클릭</li>
        </ul>
        
        <p><strong>※ 마케팅 정보 수신 동의는 선택사항으로 동의하지 않으셔도 서비스 이용에 제한은 없습니다.</strong></p>
    `;
}