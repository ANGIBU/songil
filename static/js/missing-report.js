// static/js/missing-report.js

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
        // 진행률 업데이트
        updateProgressBar();
        
        // 폼 유효성 검사 설정
        setupFormValidation();
        
        // 사진 업로드 설정
        setupPhotoUpload();
        
        // 위치 관련 설정
        setupLocationFeatures();
        
        // 도움말 사이드바 설정
        setupHelpSidebar();
        
        // 애니메이션 설정
        setupPageAnimations();
        
        // 키보드 네비게이션 설정
        setupKeyboardNavigation();
        
    } catch (error) {
        console.error('실종자 신고 폼 초기화 오류:', error);
    }
}

// 다음 단계로 이동
function nextStep(step) {
    try {
        // 현재 단계 유효성 검사
        if (!validateCurrentStep()) {
            return;
        }
        
        // 현재 단계 데이터 저장
        saveCurrentStepData();
        
        // 단계 변경
        if (step <= totalSteps) {
            changeStep(step);
        }
        
    } catch (error) {
        console.error('다음 단계 이동 오류:', error);
    }
}

// 이전 단계로 이동
function prevStep(step) {
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
        // 현재 단계 숨김
        const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        if (currentStepEl) {
            currentStepEl.classList.remove('active');
        }
        
        // 새 단계 표시
        const newStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
        if (newStepEl) {
            newStepEl.classList.add('active');
        }
        
        // 단계 업데이트
        currentStep = step;
        updateProgressBar();
        
        // 단계별 특별 처리
        handleStepSpecificActions(step);
        
        // 상단으로 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('단계 변경 오류:', error);
    }
}

// 진행률 바 업데이트
function updateProgressBar() {
    try {
        // 단계 표시 업데이트
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
        
        // 진행률 바 업데이트
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
            progressFill.style.width = `${percentage}%`;
        }
        
    } catch (error) {
        console.error('진행률 바 업데이트 오류:', error);
    }
}

// 현재 단계 유효성 검사
function validateCurrentStep() {
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
        
        // 단계별 특별 유효성 검사
        switch (currentStep) {
            case 3: // 사진 업로드 단계
                if (selectedPhotos.length === 0) {
                    if (window.showNotification) {
                        window.showNotification('최소 1장의 사진을 업로드해주세요.', 'warning');
                    }
                    isValid = false;
                }
                break;
            case 5: // 최종 확인 단계
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
        
        // 필수 필드 검사
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = '이 필드는 필수입니다.';
        }
        
        // 특별한 유효성 검사
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
}

// 현재 단계 데이터 저장
function saveCurrentStepData() {
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
            case 5: // 최종 확인 단계
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
        // 실종자 정보 요약
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
                    <div class="confirm-label">외모 특징</div>
                    <div class="confirm-value">${formData.physicalFeatures || '미입력'}</div>
                </div>
            `;
        }
        
        // 실종 상황 요약
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
        
        // 업로드된 사진 요약
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
        
        // 연락처 정보 요약
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
    return relationships[value] || '미선택';
}

// 폼 유효성 검사 설정
function setupFormValidation() {
    try {
        const form = document.getElementById('reportForm');
        if (!form) return;
        
        // 실시간 유효성 검사
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        // 전화번호 자동 형식 지정
        const phoneInputs = form.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', function() {
                formatPhoneNumber(this);
            });
        });
        
        // 폼 제출 이벤트
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
        
        // 클릭으로 파일 선택
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        // 파일 선택 시 처리
        fileInput.addEventListener('change', function(e) {
            handlePhotoSelection(e.target.files);
        });
        
        // 드래그 앤 드롭 지원
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
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        
        if (selectedPhotos.length + files.length > maxFiles) {
            if (window.showNotification) {
                window.showNotification(`최대 ${maxFiles}장의 사진만 업로드할 수 있습니다.`, 'warning');
            }
            return;
        }
        
        for (let file of files) {
            // 파일 크기 검사
            if (file.size > maxSize) {
                if (window.showNotification) {
                    window.showNotification(`${file.name}은 크기가 너무 큽니다. (최대 10MB)`, 'warning');
                }
                continue;
            }
            
            // 파일 형식 검사
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
                // 위치 정보 성공적으로 가져옴
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
    // 현재 위치 기능은 간단하게 구현
    // 실제로는 카카오 지도 API 등을 사용할 수 있음
}

// 도움말 사이드바 설정
function setupHelpSidebar() {
    try {
        // ESC 키로 도움말 닫기
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeHelpSidebar();
            }
        });
        
    } catch (error) {
        console.error('도움말 사이드바 설정 오류:', error);
    }
}

// 도움말 사이드바 토글
function toggleHelpSidebar() {
    try {
        const sidebar = document.getElementById('helpSidebar');
        if (!sidebar) return;
        
        sidebar.classList.toggle('open');
        
        if (sidebar.classList.contains('open')) {
            document.body.style.paddingRight = '400px';
        } else {
            document.body.style.paddingRight = '';
        }
        
    } catch (error) {
        console.error('도움말 사이드바 토글 오류:', error);
    }
}

// 도움말 사이드바 닫기
function closeHelpSidebar() {
    try {
        const sidebar = document.getElementById('helpSidebar');
        if (!sidebar) return;
        
        sidebar.classList.remove('open');
        document.body.style.paddingRight = '';
        
    } catch (error) {
        console.error('도움말 사이드바 닫기 오류:', error);
    }
}

// 키보드 네비게이션 설정
function setupKeyboardNavigation() {
    try {
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + 방향키로 단계 이동
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
        
        // 최종 데이터 저장
        saveCurrentStepData();
        
        // 제출 버튼 로딩 상태
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 신고 접수 중...';
        }
        
        // FormData 생성
        const formDataToSend = new FormData();
        
        // 기본 정보 추가
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });
        
        // 사진 파일 추가
        selectedPhotos.forEach((photo, index) => {
            formDataToSend.append(`photo_${index}`, photo);
        });
        
        // 서버에 제출
        const response = await fetch('/api/missing/report', {
            method: 'POST',
            body: formDataToSend
        });
        
        const result = await response.json();
        
        if (result.success) {
            if (window.showNotification) {
                window.showNotification('실종자 신고가 성공적으로 접수되었습니다.', 'success');
            }
            
            // 성공 페이지로 이동
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
        
        // 제출 버튼 복원
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
        // GSAP 사용 가능한 경우 애니메이션 적용
        if (typeof gsap !== 'undefined') {
            // 헤더 애니메이션
            gsap.from('.report-header', {
                duration: 0.8,
                y: -50,
                opacity: 0,
                ease: 'power2.out'
            });
            
            // 진행률 바 애니메이션
            gsap.from('.progress-bar', {
                duration: 0.8,
                y: 30,
                opacity: 0,
                delay: 0.2,
                ease: 'power2.out'
            });
            
            // 폼 단계 애니메이션
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
window.toggleHelpSidebar = toggleHelpSidebar;