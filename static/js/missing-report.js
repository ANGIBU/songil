// static/js/missing-report.js

<<<<<<< HEAD
// 실종자 신고 페이지 전용 JavaScript
let currentStep = 1;
let totalSteps = 5;
let formData = {};
let selectedPhotos = [];
let isSubmitting = false;

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeReportForm();
});

// 실종자 신고 폼 초기화
function initializeReportForm() {
    try {
        updateProgressBar();
        setupFormValidation();
        setupPhotoUpload();
        setupLocationFeatures();
        setupPageAnimations();
        setupKeyboardNavigation();
    } catch (error) {
        console.error('실종자 신고 폼 초기화 오류:', error);
=======
// 실종자 신고 페이지 JavaScript
let currentStep = 1;
let uploadedFiles = [];
let formData = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeReportForm();
    setupPhotoUpload();
    setupFormValidation();
});

// 신고 폼 초기화
function initializeReportForm() {
    // 오늘 날짜를 기본값으로 설정
    document.getElementById('missingDate').max = new Date().toISOString().split('T')[0];
    
    // 페이지 로드 애니메이션
    if (typeof gsap !== 'undefined') {
        gsap.from('.report-header', {
            duration: 0.8,
            y: -30,
            opacity: 0,
            ease: 'power2.out'
        });
        
        gsap.from('.form-step.active .form-group', {
            duration: 0.6,
            y: 20,
            opacity: 0,
            stagger: 0.1,
            delay: 0.3,
            ease: 'power2.out'
        });
>>>>>>> origin/gb
    }
}

// 다음 단계로 이동
function nextStep(step) {
<<<<<<< HEAD
    try {
        if (!validateCurrentStep()) {
            return;
        }
        
        saveCurrentStepData();
        
        if (step <= totalSteps) {
            changeStep(step);
        }
    } catch (error) {
        console.error('다음 단계 이동 오류:', error);
    }
=======
    if (!validateCurrentStep()) {
        return;
    }
    
    saveCurrentStepData();
    showStep(step);
>>>>>>> origin/gb
}

// 이전 단계로 이동
function prevStep(step) {
<<<<<<< HEAD
    try {
        if (step >= 1) {
            changeStep(step);
        }
    } catch (error) {
        console.error('이전 단계 이동 오류:', error);
    }
}

// 단계 변경
function changeStep(step) {
    try {
        const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        if (currentStepEl) {
            currentStepEl.classList.remove('active');
        }
        
        const newStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
        if (newStepEl) {
            newStepEl.classList.add('active');
        }
        
        currentStep = step;
        updateProgressBar();
        handleStepSpecificActions(step);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('단계 변경 오류:', error);
    }
}

// 진행률 바 업데이트
function updateProgressBar() {
    try {
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            
            step.classList.remove('active', 'completed');
            
            if (stepNumber < currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === currentStep) {
                step.classList.add('active');
            }
        });
        
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    } catch (error) {
        console.error('진행률 바 업데이트 오류:', error);
    }
=======
    showStep(step);
}

// 단계 표시
function showStep(step) {
    // 단계 버튼 업데이트
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        stepEl.classList.remove('active', 'completed');
        if (index + 1 < step) {
            stepEl.classList.add('completed');
        } else if (index + 1 === step) {
            stepEl.classList.add('active');
        }
    });
    
    // 진행률 바 업데이트
    const progressFill = document.querySelector('.progress-fill');
    progressFill.style.width = (step / 5) * 100 + '%';
    
    // 폼 단계 표시
    document.querySelectorAll('.form-step').forEach(formStep => {
        formStep.classList.remove('active');
    });
    document.querySelector(`[data-step="${step}"]`).classList.add('active');
    
    currentStep = step;
    
    // 최종 확인 단계일 때 요약 생성
    if (step === 5) {
        generateSummary();
    }
    
    // 애니메이션 효과
    if (typeof gsap !== 'undefined') {
        gsap.from('.form-step.active', {
            duration: 0.5,
            x: 30,
            opacity: 0,
            ease: 'power2.out'
        });
    }
    
    // 페이지 상단으로 스크롤
    document.querySelector('.report-form-section').scrollIntoView({ behavior: 'smooth' });
>>>>>>> origin/gb
}

// 현재 단계 유효성 검사
function validateCurrentStep() {
<<<<<<< HEAD
    try {
        const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        if (!currentStepEl) return false;
        
        const requiredFields = currentStepEl.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        switch (currentStep) {
            case 3:
                if (selectedPhotos.length === 0) {
                    if (window.showNotification) {
                        window.showNotification('최소 1장의 사진을 업로드해주세요.', 'warning');
                    }
                    isValid = false;
                }
                break;
            case 5:
                const agreements = currentStepEl.querySelectorAll('input[name^="agree"]');
                agreements.forEach(agreement => {
                    if (!agreement.checked) {
                        if (window.showNotification) {
                            window.showNotification('모든 필수 동의 항목을 체크해주세요.', 'warning');
                        }
                        isValid = false;
                    }
                });
                break;
        }
        
        if (!isValid && window.showNotification) {
            window.showNotification('입력 정보를 확인해주세요.', 'error');
        }
        
        return isValid;
    } catch (error) {
        console.error('단계 유효성 검사 오류:', error);
        return false;
    }
}

// 개별 필드 유효성 검사
function validateField(field) {
    try {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = '이 필드는 필수입니다.';
        }
        
        if (value) {
            switch (fieldName) {
                case 'missingName':
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = '이름은 2자 이상 입력해주세요.';
                    }
                    break;
                case 'missingAge':
                    const age = parseInt(value);
                    if (age < 0 || age > 120) {
                        isValid = false;
                        errorMessage = '올바른 나이를 입력해주세요.';
                    }
                    break;
                case 'reporterPhone':
                    const phoneRegex = /^01[0-9]-\d{4}-\d{4}$/;
                    if (!phoneRegex.test(value)) {
                        isValid = false;
                        errorMessage = '올바른 휴대폰 번호 형식을 입력해주세요. (예: 010-1234-5678)';
                    }
                    break;
                case 'missingDate':
                    const selectedDate = new Date(value);
                    const today = new Date();
                    if (selectedDate > today) {
                        isValid = false;
                        errorMessage = '미래 날짜는 선택할 수 없습니다.';
                    }
                    break;
                case 'clothing':
                    if (value.length < 10) {
                        isValid = false;
                        errorMessage = '착용 의상을 더 자세히 설명해주세요.';
                    }
                    break;
            }
        }
        
        if (isValid) {
            clearFieldError(field);
        } else {
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    } catch (error) {
        console.error('필드 유효성 검사 오류:', error);
        return false;
    }
}

// 필드 에러 표시
function showFieldError(field, message) {
    try {
        const fieldGroup = field.closest('.form-group');
        if (!fieldGroup) return;
        
        fieldGroup.classList.add('error');
        
        let errorElement = fieldGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            fieldGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } catch (error) {
        console.error('에러 표시 오류:', error);
    }
}

// 필드 에러 제거
function clearFieldError(field) {
    try {
        const fieldGroup = field.closest('.form-group');
        if (!fieldGroup) return;
        
        fieldGroup.classList.remove('error');
        
        const errorElement = fieldGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    } catch (error) {
        console.error('에러 제거 오류:', error);
    }
=======
    switch(currentStep) {
        case 1:
            return validateStep1();
        case 2:
            return validateStep2();
        case 3:
            return validateStep3();
        case 4:
            return validateStep4();
        default:
            return true;
    }
}

// 1단계 유효성 검사
function validateStep1() {
    let isValid = true;
    
    const name = document.getElementById('missingName').value.trim();
    if (!name) {
        showFieldError('missingNameError', '성명을 입력해주세요.');
        isValid = false;
    }
    
    const age = document.getElementById('missingAge').value;
    if (!age || age < 0 || age > 120) {
        showFieldError('missingAgeError', '올바른 나이를 입력해주세요.');
        isValid = false;
    }
    
    const gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) {
        showFieldError('genderError', '성별을 선택해주세요.');
        isValid = false;
    }
    
    return isValid;
}

// 2단계 유효성 검사
function validateStep2() {
    let isValid = true;
    
    const date = document.getElementById('missingDate').value;
    if (!date) {
        showFieldError('missingDateError', '실종 날짜를 입력해주세요.');
        isValid = false;
    }
    
    const location = document.getElementById('missingLocation').value.trim();
    if (!location) {
        showFieldError('missingLocationError', '실종 장소를 입력해주세요.');
        isValid = false;
    }
    
    const clothing = document.getElementById('clothing').value.trim();
    if (!clothing) {
        showFieldError('clothingError', '착용 의상을 입력해주세요.');
        isValid = false;
    }
    
    return isValid;
}

// 3단계 유효성 검사 (사진은 선택사항)
function validateStep3() {
    return true;
}

// 4단계 유효성 검사
function validateStep4() {
    let isValid = true;
    
    const reporterName = document.getElementById('reporterName').value.trim();
    if (!reporterName) {
        showFieldError('reporterNameError', '신고자 성명을 입력해주세요.');
        isValid = false;
    }
    
    const relationship = document.getElementById('relationship').value;
    if (!relationship) {
        showFieldError('relationshipError', '실종자와의 관계를 선택해주세요.');
        isValid = false;
    }
    
    const phone = document.getElementById('reporterPhone').value.trim();
    if (!phone || !validatePhoneNumber(phone)) {
        showFieldError('reporterPhoneError', '올바른 휴대폰 번호를 입력해주세요.');
        isValid = false;
    }
    
    return isValid;
>>>>>>> origin/gb
}

// 현재 단계 데이터 저장
function saveCurrentStepData() {
<<<<<<< HEAD
    try {
        const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        if (!currentStepEl) return;
        
        const inputs = currentStepEl.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.name) {
                if (input.type === 'radio') {
                    if (input.checked) {
                        formData[input.name] = input.value;
                    }
                } else if (input.type === 'checkbox') {
                    formData[input.name] = input.checked;
                } else {
                    formData[input.name] = input.value;
                }
            }
        });
    } catch (error) {
        console.error('단계 데이터 저장 오류:', error);
    }
}

// 단계별 특별 처리
function handleStepSpecificActions(step) {
    try {
        switch (step) {
            case 5:
                generateConfirmationSummary();
                break;
        }
    } catch (error) {
        console.error('단계별 특별 처리 오류:', error);
    }
}

// 최종 확인 요약 생성
function generateConfirmationSummary() {
    try {
        const missingPersonSummary = document.getElementById('missingPersonSummary');
        if (missingPersonSummary) {
            missingPersonSummary.innerHTML = `
                <div class="confirm-item">
                    <div class="confirm-label">성명</div>
                    <div class="confirm-value">${formData.missingName || '미입력'}</div>
                </div>
                <div class="confirm-item">
                    <div class="confirm-label">나이</div>
                    <div class="confirm-value">${formData.missingAge || '미입력'}세</div>
                </div>
                <div class="confirm-item">
                    <div class="confirm-label">성별</div>
                    <div class="confirm-value">${formData.gender === 'male' ? '남성' : '여성'}</div>
                </div>
                <div class="confirm-item">
                    <div class="confirm-label">키</div>
                    <div class="confirm-value">${formData.height || '미입력'}cm</div>
                </div>
                <div class="confirm-item">
                    <div class="confirm-label">체중</div>
                    <div class="confirm-value">${formData.weight || '미입력'}kg</div>
                </div>
                <div class="confirm-item">
                    <div class="confirm-label">특징</div>
                    <div class="confirm-value">${formData.physicalFeatures || '미입력'}</div>
                </div>
            `;
        }
        
        const missingSituationSummary = document.getElementById('missingSituationSummary');
        if (missingSituationSummary) {
            missingSituationSummary.innerHTML = `
                <div class="confirm-item">
                    <div class="confirm-label">실종 날짜</div>
                    <div class="confirm-value">${formData.missingDate || '미입력'}</div>
                </div>
                <div class="confirm-item">
                    <div class="confirm-label">실종 시간</div>
                    <div class="confirm-value">${formData.missingTime || '미입력'}</div>
                </div>
                <div class="confirm-item">
                    <div class="confirm-label">실종 장소</div>
                    <div class="confirm-value">${formData.missingLocation || '미입력'}</div>
                </div>
                <div class="confirm-item">
                    <div class="confirm-label">착용 의상</div>
                    <div class="confirm-value">${formData.clothing || '미입력'}</div>
                </div>
                <div class="confirm-item">
                    <div class="confirm-label">실종 상황</div>
                    <div class="confirm-value">${formData.situation || '미입력'}</div>
                </div>
            `;
        }
        
        const uploadedPhotosSummary = document.getElementById('uploadedPhotosSummary');
        if (uploadedPhotosSummary) {
            if (selectedPhotos.length > 0) {
                uploadedPhotosSummary.innerHTML = selectedPhotos.map((photo, index) => `
                    <div class="confirm-photo">
                        <img src="${URL.createObjectURL(photo)}" alt="업로드된 사진 ${index + 1}">
                    </div>
                `).join('');
            } else {
                uploadedPhotosSummary.innerHTML = '<p>업로드된 사진이 없습니다.</p>';
            }
        }
        
        const contactSummary = document.getElementById('contactSummary');
        if (contactSummary) {
            contactSummary.innerHTML = `
                <div class="confirm-item">
                    <div class="confirm-label">신고자 성명</div>
                    <div class="confirm-value">${formData.reporterName || '미입력'}</div>
                </div>
                <div class="confirm-item">
                    <div class="confirm-label">실종자와의 관계</div>
                    <div class="confirm-value">${getRelationshipText(formData.relationship)}</div>
                </div>
                <div class="confirm-item">
                    <div class="confirm-label">휴대폰 번호</div>
                    <div class="confirm-value">${formData.reporterPhone || '미입력'}</div>
                </div>
                <div class="confirm-item">
                    <div class="confirm-label">비상 연락처</div>
                    <div class="confirm-value">${formData.emergencyPhone || '미입력'}</div>
                </div>
            `;
        }
    } catch (error) {
        console.error('확인 요약 생성 오류:', error);
    }
}

// 관계 텍스트 변환
function getRelationshipText(value) {
=======
    const currentStepEl = document.querySelector('.form-step.active');
    const inputs = currentStepEl.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (input.type === 'radio' || input.type === 'checkbox') {
            if (input.checked) {
                formData[input.name] = input.value;
            }
        } else {
            formData[input.name] = input.value;
        }
    });
}

// 사진 업로드 설정
function setupPhotoUpload() {
    const uploadArea = document.getElementById('photoUploadArea');
    const photoInput = document.getElementById('photoInput');
    
    // 클릭으로 파일 선택
    uploadArea.addEventListener('click', () => {
        photoInput.click();
    });
    
    // 파일 선택 처리
    photoInput.addEventListener('change', handleFileSelect);
    
    // 드래그 앤 드롭 처리
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    });
}

// 파일 선택 처리
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    handleFiles(files);
}

// 파일 처리
function handleFiles(files) {
    const validFiles = files.filter(file => {
        return file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024; // 10MB
    });
    
    if (uploadedFiles.length + validFiles.length > 5) {
        alert('최대 5장까지만 업로드 가능합니다.');
        return;
    }
    
    validFiles.forEach(file => {
        uploadedFiles.push(file);
        displayUploadedPhoto(file);
    });
    
    updateUploadArea();
}

// 업로드된 사진 표시
function displayUploadedPhoto(file) {
    const uploadedPhotos = document.getElementById('uploadedPhotos');
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item';
    
    const reader = new FileReader();
    reader.onload = (e) => {
        photoItem.innerHTML = `
            <img src="${e.target.result}" alt="업로드된 사진">
            <button class="remove-photo" onclick="removePhoto(${uploadedFiles.length - 1})">
                <i class="fas fa-times"></i>
            </button>
        `;
    };
    reader.readAsDataURL(file);
    
    uploadedPhotos.appendChild(photoItem);
}

// 사진 제거
function removePhoto(index) {
    uploadedFiles.splice(index, 1);
    const uploadedPhotos = document.getElementById('uploadedPhotos');
    uploadedPhotos.children[index].remove();
    updateUploadArea();
}

// 업로드 영역 업데이트
function updateUploadArea() {
    const uploadArea = document.getElementById('photoUploadArea');
    if (uploadedFiles.length >= 5) {
        uploadArea.style.display = 'none';
    } else {
        uploadArea.style.display = 'block';
    }
}

// 현재 위치 가져오기
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // 실제로는 역지오코딩 API를 사용해 주소로 변환
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                document.getElementById('missingLocation').value = `위도: ${lat.toFixed(6)}, 경도: ${lng.toFixed(6)}`;
                
                if (window.showNotification) {
                    window.showNotification('현재 위치가 설정되었습니다.', 'success');
                }
            },
            (error) => {
                if (window.showNotification) {
                    window.showNotification('위치 정보를 가져올 수 없습니다.', 'error');
                }
            }
        );
    }
}

// 요약 생성
function generateSummary() {
    // 실종자 정보 요약
    const missingPersonSummary = document.getElementById('missingPersonSummary');
    missingPersonSummary.innerHTML = `
        <div class="summary-item">
            <strong>성명:</strong> ${formData.missingName || document.getElementById('missingName').value}
        </div>
        <div class="summary-item">
            <strong>나이/성별:</strong> ${formData.missingAge || document.getElementById('missingAge').value}세 / ${getGenderText()}
        </div>
        <div class="summary-item">
            <strong>신체:</strong> ${formData.height || document.getElementById('height').value || '미입력'}cm, ${getBodyTypeText()}
        </div>
        <div class="summary-item">
            <strong>특징:</strong> ${formData.physicalFeatures || document.getElementById('physicalFeatures').value || '없음'}
        </div>
    `;
    
    // 실종 상황 요약
    const missingSituationSummary = document.getElementById('missingSituationSummary');
    missingSituationSummary.innerHTML = `
        <div class="summary-item">
            <strong>실종일시:</strong> ${formData.missingDate || document.getElementById('missingDate').value} ${formData.missingTime || document.getElementById('missingTime').value || ''}
        </div>
        <div class="summary-item">
            <strong>실종장소:</strong> ${formData.missingLocation || document.getElementById('missingLocation').value}
        </div>
        <div class="summary-item">
            <strong>착용의상:</strong> ${formData.clothing || document.getElementById('clothing').value}
        </div>
        <div class="summary-item">
            <strong>상황:</strong> ${formData.situation || document.getElementById('situation').value || '미입력'}
        </div>
    `;
    
    // 연락처 요약
    const contactSummary = document.getElementById('contactSummary');
    contactSummary.innerHTML = `
        <div class="summary-item">
            <strong>신고자:</strong> ${formData.reporterName || document.getElementById('reporterName').value} (${getRelationshipText()})
        </div>
        <div class="summary-item">
            <strong>연락처:</strong> ${formData.reporterPhone || document.getElementById('reporterPhone').value}
        </div>
    `;
    
    // 업로드된 사진 요약
    const uploadedPhotosSummary = document.getElementById('uploadedPhotosSummary');
    uploadedPhotosSummary.innerHTML = uploadedFiles.length > 0 ? 
        `${uploadedFiles.length}장의 사진이 업로드되었습니다.` : 
        '업로드된 사진이 없습니다.';
}

// 폼 제출 처리
document.addEventListener('DOMContentLoaded', function() {
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerHTML;
            
            // 최종 동의 확인
            const agreements = document.querySelectorAll('.final-agreements input[type="checkbox"]');
            const allAgreed = Array.from(agreements).every(cb => cb.checked);
            
            if (!allAgreed) {
                if (window.showNotification) {
                    window.showNotification('모든 동의사항에 체크해주세요.', 'error');
                }
                return;
            }
            
            // 로딩 상태
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 신고 접수 중...';
            submitBtn.disabled = true;
            
            try {
                // 폼 데이터 수집
                const finalFormData = new FormData();
                
                // 텍스트 데이터 추가
                Object.keys(formData).forEach(key => {
                    finalFormData.append(key, formData[key]);
                });
                
                // 현재 단계 데이터도 추가
                saveCurrentStepData();
                Object.keys(formData).forEach(key => {
                    finalFormData.append(key, formData[key]);
                });
                
                // 파일 데이터 추가
                uploadedFiles.forEach((file, index) => {
                    finalFormData.append(`photo_${index}`, file);
                });
                
                // API 호출 시뮬레이션
                await simulateAPICall(3000);
                
                // 성공 처리
                showSuccessPage();
                
            } catch (error) {
                if (window.showNotification) {
                    window.showNotification('신고 접수 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
                }
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// 성공 페이지 표시
function showSuccessPage() {
    const formSection = document.querySelector('.report-form-section .container');
    formSection.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>신고가 성공적으로 접수되었습니다</h2>
            <p>신고번호: <strong>#2024-${Date.now().toString().slice(-6)}</strong></p>
            
            <div class="next-steps">
                <h3>다음 단계</h3>
                <div class="step-list">
                    <div class="next-step">
                        <i class="fas fa-shield-alt"></i>
                        <span>1. 경찰청으로 자동 전달 (완료)</span>
                    </div>
                    <div class="next-step">
                        <i class="fas fa-user-check"></i>
                        <span>2. 관리자 검토 (1-2시간 소요)</span>
                    </div>
                    <div class="next-step">
                        <i class="fas fa-globe"></i>
                        <span>3. 플랫폼 공개 및 수색 시작</span>
                    </div>
                </div>
            </div>
            
            <div class="contact-info">
                <h3>중요 안내</h3>
                <ul>
                    <li>• 수사 진행 상황은 알림으로 안내드립니다</li>
                    <li>• 추가 정보가 필요시 연락드릴 수 있습니다</li>
                    <li>• 긴급상황시 즉시 112로 신고하세요</li>
                </ul>
            </div>
            
            <div class="action-buttons">
                <a href="/" class="btn btn-primary">
                    <i class="fas fa-home"></i>
                    홈으로 가기
                </a>
                <a href="/mypage" class="btn btn-secondary">
                    <i class="fas fa-user"></i>
                    마이페이지
                </a>
            </div>
        </div>
    `;
    
    if (typeof gsap !== 'undefined') {
        gsap.from('.success-content', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            ease: 'power2.out'
        });
    }
}

// 도움말 사이드바 토글
function toggleHelpSidebar() {
    const sidebar = document.getElementById('helpSidebar');
    sidebar.classList.toggle('active');
}

// 유틸리티 함수들
function getGenderText() {
    const gender = document.querySelector('input[name="gender"]:checked');
    return gender ? (gender.value === 'male' ? '남성' : '여성') : '미선택';
}

function getBodyTypeText() {
    const bodyType = document.getElementById('bodyType').value;
    const types = {
        'thin': '마른체형',
        'normal': '보통체형', 
        'heavy': '뚱뚱한체형',
        'muscular': '근육질체형'
    };
    return types[bodyType] || '미입력';
}

function getRelationshipText() {
    const relationship = document.getElementById('relationship').value;
>>>>>>> origin/gb
    const relationships = {
        'parent': '부모',
        'child': '자녀',
        'spouse': '배우자',
        'sibling': '형제/자매',
        'relative': '친척',
        'friend': '친구',
        'colleague': '동료',
        'other': '기타'
    };
<<<<<<< HEAD
    return relationships[value] || '미선택';
=======
    return relationships[relationship] || '미선택';
}

function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        const inputId = errorId.replace('Error', '');
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            inputElement.classList.add('error');
        }
    }
}

function validatePhoneNumber(phone) {
    const phoneRegex = /^010-?\d{4}-?\d{4}$/;
    return phoneRegex.test(phone);
}

function simulateAPICall(delay = 1000) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
>>>>>>> origin/gb
}

// 폼 유효성 검사 설정
function setupFormValidation() {
<<<<<<< HEAD
    try {
        const form = document.getElementById('reportForm');
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        const phoneInputs = form.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', function() {
                formatPhoneNumber(this);
            });
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitReport();
        });
    } catch (error) {
        console.error('폼 유효성 검사 설정 오류:', error);
    }
}

// 전화번호 형식 지정
function formatPhoneNumber(input) {
    try {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length >= 11) {
            value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        } else if (value.length >= 7) {
            value = value.replace(/(\d{3})(\d{4})/, '$1-$2');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})/, '$1-');
        }
        
        input.value = value;
    } catch (error) {
        console.error('전화번호 형식 지정 오류:', error);
    }
}

// 사진 업로드 설정
function setupPhotoUpload() {
    try {
        const uploadArea = document.getElementById('photoUploadArea');
        const fileInput = document.getElementById('photoInput');
        const uploadedContainer = document.getElementById('uploadedPhotos');
        
        if (!uploadArea || !fileInput) return;
        
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function(e) {
            handlePhotoSelection(e.target.files);
        });
        
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            handlePhotoSelection(e.dataTransfer.files);
        });
    } catch (error) {
        console.error('사진 업로드 설정 오류:', error);
    }
}

// 사진 선택 처리
function handlePhotoSelection(files) {
    try {
        const maxFiles = 5;
        const maxSize = 10 * 1024 * 1024;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        
        if (selectedPhotos.length + files.length > maxFiles) {
            if (window.showNotification) {
                window.showNotification(`최대 ${maxFiles}장의 사진만 업로드할 수 있습니다.`, 'warning');
            }
            return;
        }
        
        for (let file of files) {
            if (file.size > maxSize) {
                if (window.showNotification) {
                    window.showNotification(`${file.name}은 크기가 너무 큽니다. (최대 10MB)`, 'warning');
                }
                continue;
            }
            
            if (!allowedTypes.includes(file.type)) {
                if (window.showNotification) {
                    window.showNotification(`${file.name}은 지원하지 않는 파일 형식입니다.`, 'warning');
                }
                continue;
            }
            
            selectedPhotos.push(file);
        }
        
        updatePhotoPreview();
    } catch (error) {
        console.error('사진 선택 처리 오류:', error);
    }
}

// 사진 미리보기 업데이트
function updatePhotoPreview() {
    try {
        const uploadedContainer = document.getElementById('uploadedPhotos');
        if (!uploadedContainer) return;
        
        if (selectedPhotos.length === 0) {
            uploadedContainer.classList.remove('has-photos');
            return;
        }
        
        uploadedContainer.classList.add('has-photos');
        
        const photoGrid = uploadedContainer.querySelector('.photo-grid') || 
                         (() => {
                             const grid = document.createElement('div');
                             grid.className = 'photo-grid';
                             uploadedContainer.innerHTML = '';
                             uploadedContainer.appendChild(grid);
                             return grid;
                         })();
        
        photoGrid.innerHTML = '';
        
        selectedPhotos.forEach((photo, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            
            const img = document.createElement('img');
            img.src = URL.createObjectURL(photo);
            img.alt = `업로드된 사진 ${index + 1}`;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'photo-remove';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.addEventListener('click', function() {
                removePhoto(index);
            });
            
            photoItem.appendChild(img);
            photoItem.appendChild(removeBtn);
            photoGrid.appendChild(photoItem);
        });
    } catch (error) {
        console.error('사진 미리보기 업데이트 오류:', error);
    }
}

// 사진 제거
function removePhoto(index) {
    try {
        selectedPhotos.splice(index, 1);
        updatePhotoPreview();
        
        if (window.showNotification) {
            window.showNotification('사진이 제거되었습니다.', 'info');
        }
    } catch (error) {
        console.error('사진 제거 오류:', error);
    }
}

// 현재 위치 가져오기
function getCurrentLocation() {
    try {
        if (!navigator.geolocation) {
            if (window.showNotification) {
                window.showNotification('현재 위치를 가져올 수 없습니다.', 'error');
            }
            return;
        }
        
        const locationBtn = document.querySelector('.location-btn');
        if (locationBtn) {
            locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 위치 확인 중...';
            locationBtn.disabled = true;
        }
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                if (window.showNotification) {
                    window.showNotification('현재 위치가 설정되었습니다.', 'success');
                }
                
                if (locationBtn) {
                    locationBtn.innerHTML = '<i class="fas fa-crosshairs"></i> 현재 위치 사용';
                    locationBtn.disabled = false;
                }
            },
            function(error) {
                console.error('위치 정보 가져오기 실패:', error);
                if (window.showNotification) {
                    window.showNotification('현재 위치를 가져올 수 없습니다.', 'error');
                }
                
                if (locationBtn) {
                    locationBtn.innerHTML = '<i class="fas fa-crosshairs"></i> 현재 위치 사용';
                    locationBtn.disabled = false;
                }
            }
        );
    } catch (error) {
        console.error('현재 위치 가져오기 오류:', error);
    }
}

// 위치 관련 기능 설정
function setupLocationFeatures() {
    // 기본 위치 기능 설정
}

// 키보드 네비게이션 설정
function setupKeyboardNavigation() {
    try {
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        if (currentStep > 1) {
                            prevStep(currentStep - 1);
                        }
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        if (currentStep < totalSteps) {
                            nextStep(currentStep + 1);
                        }
                        break;
                }
            }
        });
    } catch (error) {
        console.error('키보드 네비게이션 설정 오류:', error);
    }
}

// 신고 제출
async function submitReport() {
    try {
        if (isSubmitting) return;
        isSubmitting = true;
        
        saveCurrentStepData();
        
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 신고 접수 중...';
        }
        
        const formDataToSend = new FormData();
        
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });
        
        selectedPhotos.forEach((photo, index) => {
            formDataToSend.append(`photo_${index}`, photo);
        });
        
        const response = await fetch('/api/missing/report', {
            method: 'POST',
            body: formDataToSend
        });
        
        const result = await response.json();
        
        if (result.success) {
            if (window.showNotification) {
                window.showNotification('실종자 신고가 성공적으로 접수되었습니다.', 'success');
            }
            
            setTimeout(() => {
                window.location.href = '/report/success';
            }, 2000);
        } else {
            throw new Error(result.message || '신고 접수에 실패했습니다.');
        }
    } catch (error) {
        console.error('신고 제출 오류:', error);
        
        if (window.showNotification) {
            window.showNotification(error.message || '신고 접수 중 오류가 발생했습니다.', 'error');
        }
        
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 신고 접수하기';
        }
        
        isSubmitting = false;
    }
}

// 페이지 애니메이션 설정
function setupPageAnimations() {
    try {
        if (typeof gsap !== 'undefined') {
            gsap.from('.report-header', {
                duration: 0.8,
                y: -50,
                opacity: 0,
                ease: 'power2.out'
            });
            
            gsap.from('.progress-bar', {
                duration: 0.8,
                y: 30,
                opacity: 0,
                delay: 0.2,
                ease: 'power2.out'
            });
            
            gsap.from('.form-step.active', {
                duration: 0.6,
                y: 40,
                opacity: 0,
                delay: 0.4,
                ease: 'power2.out'
            });
        }
    } catch (error) {
        console.error('페이지 애니메이션 설정 오류:', error);
    }
}

// 전역 함수로 내보내기
window.nextStep = nextStep;
window.prevStep = prevStep;
window.getCurrentLocation = getCurrentLocation;
=======
    // 실시간 유효성 검사
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            // 에러 상태 제거
            this.classList.remove('error');
            const errorId = this.id + 'Error';
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
    });
    
    // 휴대폰 번호 자동 포맷팅
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 11) {
                value = value.substring(0, 11);
                value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            } else if (value.length >= 7) {
                value = value.replace(/(\d{3})(\d{3,4})(\d{0,4})/, '$1-$2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{0,4})/, '$1-$2');
            }
            this.value = value;
        });
    });
}
>>>>>>> origin/gb
