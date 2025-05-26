// static/js/register.js

let currentStep = 1;
let isPassVerified = false;

// 회원가입 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeRegister();
    initializeEmailCheck();
    initializePasswordValidation();
    initializePassAuth();
    initializeAgreements();
    initializeAddressSearch();
});

// 회원가입 시스템 초기화
function initializeRegister() {
    showStep(1);
    
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

// 단계 전환
window.nextStep = function(step) {
    if (step === 2 && !validateStep1()) {
        return;
    }
    
    if (step === 3 && !isPassVerified) {
        showNotification('PASS 인증을 완료해주세요.', 'error');
        return;
    }
    
    const currentForm = document.querySelector(`.step-form[data-step="${currentStep}"]`);
    const nextForm = document.querySelector(`.step-form[data-step="${step}"]`);
    
    // 2단계로 넘어갈 때 정보 표시
    if (step === 2) {
        const nameDisplay = document.getElementById('nameDisplay');
        const phoneDisplay = document.getElementById('phoneDisplay');
        if (nameDisplay) nameDisplay.textContent = document.getElementById('fullName').value;
        if (phoneDisplay) phoneDisplay.textContent = document.getElementById('phone').value;
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

// 비밀번호 유효성 검사
function initializePasswordValidation() {
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('passwordConfirm');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            validatePassword(this.value);
        });
    }
    
    if (passwordConfirmInput) {
        passwordConfirmInput.addEventListener('input', function() {
            validatePasswordConfirm();
        });
    }
}

function validatePassword(password) {
    const validation = document.getElementById('passwordValidation');
    if (!validation) return;
    
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

// PASS 인증
function initializePassAuth() {
    const passAuthBtn = document.getElementById('passAuthBtn');
    if (passAuthBtn) {
        passAuthBtn.addEventListener('click', performPassAuth);
    }
}

async function performPassAuth() {
    const authBtn = document.getElementById('passAuthBtn');
    const authStatus = document.getElementById('authStatus');
    const nextBtn = document.getElementById('step2NextBtn');
    
    const originalText = authBtn.innerHTML;
    authBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 인증 중...';
    authBtn.disabled = true;
    
    try {
        await simulateAPICall(3000);
        
        // 인증 성공
        const name = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        
        document.getElementById('verifiedName').textContent = name;
        document.getElementById('verifiedPhone').textContent = phone;
        
        authStatus.style.display = 'block';
        authBtn.style.display = 'none';
        nextBtn.disabled = false;
        isPassVerified = true;
        
        showNotification('PASS 인증이 완료되었습니다.', 'success');
        
    } catch (error) {
        showNotification('PASS 인증에 실패했습니다. 다시 시도해주세요.', 'error');
        authBtn.innerHTML = originalText;
        authBtn.disabled = false;
    }
}

// 주소 검색
function initializeAddressSearch() {
    const addressSearchBtn = document.getElementById('addressSearchBtn');
    if (addressSearchBtn) {
        addressSearchBtn.addEventListener('click', searchAddress);
    }
}

function searchAddress() {
    // 실제 구현에서는 Daum 우편번호 API 사용
    // 여기서는 시뮬레이션
    const postcode = document.getElementById('postcode');
    const address = document.getElementById('address');
    
    // 시뮬레이션 데이터
    postcode.value = '12345';
    address.value = '서울특별시 강남구 테헤란로 123';
    
    showNotification('주소가 입력되었습니다.', 'success');
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
        });
    }
    
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
    const birthDate = document.getElementById('birthDate').value;
    if (!birthDate) {
        showFieldError('birthDateError', '생년월일을 선택해주세요.');
        isValid = false;
    }
    
    // 휴대폰 검사
    if (!validatePhoneField(document.getElementById('phone'))) {
        isValid = false;
    }
    
    // 성별 검사
    const gender = document.getElementById('gender').value;
    if (!gender) {
        showFieldError('genderError', '성별을 선택해주세요.');
        isValid = false;
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
            <li>필수항목: 성명, 이메일, 비밀번호, 생년월일, 휴대폰번호, 성별, 주소</li>
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
        <p>성명: 안기부부<br>
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