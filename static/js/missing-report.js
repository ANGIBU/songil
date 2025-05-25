// static/js/missing-report.js

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
    }
}

// 다음 단계로 이동
function nextStep(step) {
    if (!validateCurrentStep()) {
        return;
    }
    
    saveCurrentStepData();
    showStep(step);
}

// 이전 단계로 이동
function prevStep(step) {
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
}

// 현재 단계 유효성 검사
function validateCurrentStep() {
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
}

// 현재 단계 데이터 저장
function saveCurrentStepData() {
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
}

// 폼 유효성 검사 설정
function setupFormValidation() {
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