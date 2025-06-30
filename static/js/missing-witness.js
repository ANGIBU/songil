// static/js/missing-witness.js

<<<<<<< HEAD
// 목격 신고 페이지 전용 JavaScript
let currentLocation = null;
let selectedFiles = [];
let map = null;
let marker = null;

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeWitnessForm();
=======
// 목격 신고 페이지 JavaScript
let uploadedFiles = [];
let selectedLocation = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeWitnessForm();
    setupEvidenceUpload();
    setupFormValidation();
>>>>>>> origin/gb
});

// 목격 신고 폼 초기화
function initializeWitnessForm() {
<<<<<<< HEAD
    try {
        setDefaultDateTime();
        setupFormValidation();
        setupFileUpload();
        setupMapFunctionality();
        setupFormSubmission();
        setupLocationEvents();
        setupPageAnimations();
    } catch (error) {
        console.error('목격 신고 폼 초기화 오류:', error);
    }
}

// 기본 날짜/시간 설정
function setDefaultDateTime() {
    try {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().slice(0, 5);
        
        const dateInput = document.getElementById('witnessDate');
        const timeInput = document.getElementById('witnessTime');
        
        if (dateInput) dateInput.value = today;
        if (timeInput) timeInput.value = currentTime;
    } catch (error) {
        console.error('기본 날짜 설정 오류:', error);
    }
}

// 폼 유효성 검사 설정
function setupFormValidation() {
    try {
        const form = document.getElementById('witnessForm');
        if (!form) return;
        
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        const dateInput = document.getElementById('witnessDate');
        if (dateInput) {
            dateInput.addEventListener('change', function() {
                validateWitnessDate(this);
            });
        }
    } catch (error) {
        console.error('폼 유효성 검사 설정 오류:', error);
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
                case 'witnessLocation':
                    if (value.length < 5) {
                        isValid = false;
                        errorMessage = '더 구체적인 위치를 입력해주세요.';
                    }
                    break;
                case 'witnessDescription':
                    if (value.length < 20) {
                        isValid = false;
                        errorMessage = '목격 상황을 더 자세히 설명해주세요. (최소 20자)';
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

// 목격 날짜 유효성 검사
function validateWitnessDate(dateField) {
    try {
        const selectedDate = new Date(dateField.value);
        const today = new Date();
        const missingDateStr = document.querySelector('input[name="missingDate"]').value;
        
        if (missingDateStr) {
            const missingDate = new Date(missingDateStr.replace(/\./g, '-'));
            
            if (selectedDate < missingDate) {
                showFieldError(dateField, '목격 날짜는 실종 날짜 이후여야 합니다.');
                return false;
            }
        }
        
        if (selectedDate > today) {
            showFieldError(dateField, '미래 날짜는 선택할 수 없습니다.');
            return false;
        }
        
        clearFieldError(dateField);
        return true;
    } catch (error) {
        console.error('날짜 유효성 검사 오류:', error);
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

// 파일 업로드 설정
function setupFileUpload() {
    try {
        const uploadArea = document.getElementById('evidenceUploadArea');
        const fileInput = document.getElementById('evidenceInput');
        const uploadedContainer = document.getElementById('uploadedEvidence');
        
        if (!uploadArea || !fileInput) return;
        
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function(e) {
            handleFileSelection(e.target.files);
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
            handleFileSelection(e.dataTransfer.files);
        });
    } catch (error) {
        console.error('파일 업로드 설정 오류:', error);
    }
}

// 파일 선택 처리
function handleFileSelection(files) {
    try {
        const maxFiles = 3;
        const maxSize = 10 * 1024 * 1024;
        const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'];
        
        if (selectedFiles.length + files.length > maxFiles) {
            if (window.showNotification) {
                window.showNotification(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`, 'warning');
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
            
            selectedFiles.push(file);
        }
        
        updateFilePreview();
    } catch (error) {
        console.error('파일 선택 처리 오류:', error);
    }
}

// 파일 미리보기 업데이트
function updateFilePreview() {
    try {
        const uploadedContainer = document.getElementById('uploadedEvidence');
        if (!uploadedContainer) return;
        
        if (selectedFiles.length === 0) {
            uploadedContainer.style.display = 'none';
            return;
        }
        
        uploadedContainer.style.display = 'block';
        uploadedContainer.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px;
                background: white;
                border: 1px solid var(--gray-200);
                border-radius: var(--radius-md);
                margin-bottom: 8px;
            `;
            
            const fileInfo = document.createElement('div');
            fileInfo.style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
            `;
            
            const fileIcon = document.createElement('i');
            fileIcon.className = file.type.startsWith('image/') ? 'fas fa-image' : 'fas fa-video';
            fileIcon.style.color = 'var(--primary-orange)';
            
            const fileName = document.createElement('span');
            fileName.textContent = file.name;
            fileName.style.fontSize = '14px';
            
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.style.cssText = `
                background: var(--danger-red);
                color: white;
                border: none;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            removeBtn.addEventListener('click', function() {
                removeFile(index);
            });
            
            fileInfo.appendChild(fileIcon);
            fileInfo.appendChild(fileName);
            fileItem.appendChild(fileInfo);
            fileItem.appendChild(removeBtn);
            uploadedContainer.appendChild(fileItem);
        });
    } catch (error) {
        console.error('파일 미리보기 업데이트 오류:', error);
    }
}

// 파일 제거
function removeFile(index) {
    try {
        selectedFiles.splice(index, 1);
        updateFilePreview();
    } catch (error) {
        console.error('파일 제거 오류:', error);
    }
}

// 지도 기능 설정
function setupMapFunctionality() {
    try {
        if (typeof kakao !== 'undefined' && kakao.maps) {
            kakao.maps.load(function() {
                // 지도 준비 완료
            });
        }
    } catch (error) {
        console.error('지도 기능 설정 오류:', error);
=======
    // 오늘 날짜를 최대값으로 설정
    document.getElementById('witnessDate').max = new Date().toISOString().split('T')[0];
    
    // 페이지 로드 애니메이션
    if (typeof gsap !== 'undefined') {
        gsap.from('.witness-header', {
            duration: 0.8,
            y: -30,
            opacity: 0,
            ease: 'power2.out'
        });
        
        gsap.from('.missing-summary', {
            duration: 0.6,
            y: 20,
            opacity: 0,
            delay: 0.2,
            ease: 'power2.out'
        });
        
        gsap.from('.form-section', {
            duration: 0.5,
            y: 20,
            opacity: 0,
            stagger: 0.1,
            delay: 0.4,
            ease: 'power2.out'
        });
    }
}

// 증거 자료 업로드 설정
function setupEvidenceUpload() {
    const uploadArea = document.getElementById('evidenceUploadArea');
    const evidenceInput = document.getElementById('evidenceInput');
    
    // 클릭으로 파일 선택
    uploadArea.addEventListener('click', () => {
        evidenceInput.click();
    });
    
    // 파일 선택 처리
    evidenceInput.addEventListener('change', handleEvidenceSelect);
    
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
        handleEvidenceFiles(files);
    });
}

// 증거 파일 선택 처리
function handleEvidenceSelect(e) {
    const files = Array.from(e.target.files);
    handleEvidenceFiles(files);
}

// 증거 파일 처리
function handleEvidenceFiles(files) {
    const validFiles = files.filter(file => {
        const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
        const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB
        return isValidType && isValidSize;
    });
    
    if (uploadedFiles.length + validFiles.length > 3) {
        if (window.showNotification) {
            window.showNotification('최대 3개 파일까지만 업로드 가능합니다.', 'warning');
        }
        return;
    }
    
    validFiles.forEach(file => {
        uploadedFiles.push(file);
        displayEvidenceFile(file);
    });
    
    updateEvidenceUploadArea();
}

// 증거 파일 표시
function displayEvidenceFile(file) {
    const uploadedEvidence = document.getElementById('uploadedEvidence');
    const fileItem = document.createElement('div');
    fileItem.className = 'evidence-item';
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const isVideo = file.type.startsWith('video/');
        fileItem.innerHTML = `
            <div class="evidence-preview">
                ${isVideo ? 
                    `<video src="${e.target.result}" controls></video>` :
                    `<img src="${e.target.result}" alt="증거 사진">`
                }
            </div>
            <div class="evidence-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <button class="remove-evidence" onclick="removeEvidence(${uploadedFiles.length - 1})">
                <i class="fas fa-times"></i>
            </button>
        `;
    };
    reader.readAsDataURL(file);
    
    uploadedEvidence.appendChild(fileItem);
}

// 증거 파일 제거
function removeEvidence(index) {
    uploadedFiles.splice(index, 1);
    const uploadedEvidence = document.getElementById('uploadedEvidence');
    uploadedEvidence.children[index].remove();
    updateEvidenceUploadArea();
}

// 업로드 영역 업데이트
function updateEvidenceUploadArea() {
    const uploadArea = document.getElementById('evidenceUploadArea');
    if (uploadedFiles.length >= 3) {
        uploadArea.style.display = 'none';
    } else {
        uploadArea.style.display = 'block';
>>>>>>> origin/gb
    }
}

// 현재 위치 가져오기
function getCurrentLocation() {
<<<<<<< HEAD
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
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                convertCoordinatesToAddress(lat, lng);
                
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

// 좌표를 주소로 변환
function convertCoordinatesToAddress(lat, lng) {
    try {
        if (typeof kakao === 'undefined' || !kakao.maps) {
            if (window.showNotification) {
                window.showNotification('지도 서비스를 사용할 수 없습니다.', 'error');
            }
            return;
        }
        
        const geocoder = new kakao.maps.services.Geocoder();
        const coord = new kakao.maps.LatLng(lat, lng);
        
        geocoder.coord2Address(coord.getLng(), coord.getLat(), function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                const address = result[0].address.address_name;
                const locationInput = document.getElementById('witnessLocation');
                
                if (locationInput) {
                    locationInput.value = address;
                    clearFieldError(locationInput);
                }
=======
    if (navigator.geolocation) {
        const btn = event.target.closest('.location-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 위치 확인 중...';
        btn.disabled = true;
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // 실제로는 역지오코딩 API를 사용해 주소로 변환
                document.getElementById('witnessLocation').value = `위도: ${lat.toFixed(6)}, 경도: ${lng.toFixed(6)}`;
>>>>>>> origin/gb
                
                if (window.showNotification) {
                    window.showNotification('현재 위치가 설정되었습니다.', 'success');
                }
                
<<<<<<< HEAD
                currentLocation = { lat: lat, lng: lng, address: address };
            } else {
                if (window.showNotification) {
                    window.showNotification('주소를 가져올 수 없습니다.', 'error');
                }
            }
        });
    } catch (error) {
        console.error('좌표 변환 오류:', error);
    }
}

// 지도 모달 열기
function openMapSelector() {
    try {
        const modal = document.getElementById('mapModal');
        if (!modal) return;
        
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
            initializeMap();
        }, 10);
        
        document.body.style.overflow = 'hidden';
    } catch (error) {
        console.error('지도 모달 열기 오류:', error);
=======
                btn.innerHTML = originalText;
                btn.disabled = false;
            },
            (error) => {
                if (window.showNotification) {
                    window.showNotification('위치 정보를 가져올 수 없습니다.', 'error');
                }
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        );
    }
}

// 지도 선택 모달 열기
function openMapSelector() {
    document.getElementById('mapModal').style.display = 'flex';
    
    // 모달 애니메이션
    if (typeof gsap !== 'undefined') {
        gsap.from('.modal-content', {
            duration: 0.3,
            scale: 0.8,
            opacity: 0,
            ease: 'power2.out'
        });
>>>>>>> origin/gb
    }
}

// 지도 모달 닫기
function closeMapModal() {
<<<<<<< HEAD
    try {
        const modal = document.getElementById('mapModal');
        if (!modal) return;
        
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
        document.body.style.overflow = '';
    } catch (error) {
        console.error('지도 모달 닫기 오류:', error);
    }
}

// 지도 초기화
function initializeMap() {
    try {
        if (typeof kakao === 'undefined' || !kakao.maps) return;
        
        const mapContainer = document.getElementById('location-map');
        if (!mapContainer) return;
        
        const mapOption = {
            center: new kakao.maps.LatLng(37.566826, 126.9786567),
            level: 3
        };
        
        map = new kakao.maps.Map(mapContainer, mapOption);
        
        kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
            const latlng = mouseEvent.latLng;
            
            if (marker) {
                marker.setMap(null);
            }
            
            marker = new kakao.maps.Marker({
                position: latlng
            });
            
            marker.setMap(map);
            
            currentLocation = {
                lat: latlng.getLat(),
                lng: latlng.getLng()
            };
            
            convertCoordinatesToAddress(latlng.getLat(), latlng.getLng());
        });
    } catch (error) {
        console.error('지도 초기화 오류:', error);
    }
}

// 지도에서 주소 검색
function searchLocation() {
    try {
        const searchInput = document.getElementById('mapSearchInput');
        if (!searchInput || !searchInput.value.trim()) return;
        
        if (typeof kakao === 'undefined' || !kakao.maps) return;
        
        const geocoder = new kakao.maps.services.Geocoder();
        
        geocoder.addressSearch(searchInput.value, function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                
                map.setCenter(coords);
                
                if (marker) {
                    marker.setMap(null);
                }
                
                marker = new kakao.maps.Marker({
                    position: coords
                });
                
                marker.setMap(map);
                
                currentLocation = {
                    lat: coords.getLat(),
                    lng: coords.getLng(),
                    address: result[0].address_name
                };
            } else {
                if (window.showNotification) {
                    window.showNotification('검색 결과가 없습니다.', 'warning');
                }
            }
        });
    } catch (error) {
        console.error('위치 검색 오류:', error);
    }
=======
    document.getElementById('mapModal').style.display = 'none';
>>>>>>> origin/gb
}

// 지도에서 위치 선택
function selectMapLocation() {
<<<<<<< HEAD
    try {
        if (!currentLocation || !currentLocation.address) {
            if (window.showNotification) {
                window.showNotification('지도에서 위치를 선택해주세요.', 'warning');
            }
            return;
        }
        
        const locationInput = document.getElementById('witnessLocation');
        if (locationInput) {
            locationInput.value = currentLocation.address;
            clearFieldError(locationInput);
        }
        
        closeMapModal();
        
        if (window.showNotification) {
            window.showNotification('위치가 설정되었습니다.', 'success');
        }
    } catch (error) {
        console.error('위치 선택 오류:', error);
    }
}

// 위치 관련 이벤트 설정
function setupLocationEvents() {
    try {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMapModal();
            }
        });
        
        const modal = document.getElementById('mapModal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeMapModal();
                }
            });
        }
        
        const searchInput = document.getElementById('mapSearchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    searchLocation();
                }
            });
        }
    } catch (error) {
        console.error('위치 이벤트 설정 오류:', error);
    }
}

// 폼 제출 설정
function setupFormSubmission() {
    try {
        const form = document.getElementById('witnessForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitWitnessReport();
        });
    } catch (error) {
        console.error('폼 제출 설정 오류:', error);
    }
}

// 목격 신고 제출
async function submitWitnessReport() {
    try {
        const form = document.getElementById('witnessForm');
        if (!form) return;
        
        if (!validateForm(form)) {
            if (window.showNotification) {
                window.showNotification('입력 정보를 확인해주세요.', 'error');
            }
            return;
        }
        
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 신고 중...';
        }
        
        const formData = new FormData();
        
        const formElements = form.elements;
        for (let element of formElements) {
            if (element.name && element.type !== 'file' && element.type !== 'checkbox') {
                formData.append(element.name, element.value);
            }
        }
        
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                formData.append(checkbox.name, 'true');
            }
        });
        
        selectedFiles.forEach((file, index) => {
            formData.append(`evidence_${index}`, file);
        });
        
        if (currentLocation) {
            formData.append('latitude', currentLocation.lat);
            formData.append('longitude', currentLocation.lng);
        }
        
        const response = await fetch('/api/witness/submit', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            if (window.showNotification) {
                window.showNotification('목격 신고가 성공적으로 접수되었습니다.', 'success');
            }
            
            setTimeout(() => {
                window.location.href = '/witness/success';
            }, 2000);
        } else {
            throw new Error(result.message || '신고 접수에 실패했습니다.');
        }
    } catch (error) {
        console.error('목격 신고 제출 오류:', error);
        
        if (window.showNotification) {
            window.showNotification(error.message || '신고 접수 중 오류가 발생했습니다.', 'error');
        }
        
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 목격 정보 신고하기';
        }
    }
}

// 전체 폼 유효성 검사
function validateForm(form) {
    try {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        const agreements = form.querySelectorAll('input[name^="agree"]');
        agreements.forEach(agreement => {
            if (!agreement.checked) {
                if (window.showNotification) {
                    window.showNotification('모든 필수 동의 항목을 체크해주세요.', 'warning');
                }
                isValid = false;
            }
        });
        
        return isValid;
    } catch (error) {
        console.error('폼 유효성 검사 오류:', error);
        return false;
    }
}

// 페이지 애니메이션 설정
function setupPageAnimations() {
    try {
        if (typeof gsap !== 'undefined') {
            gsap.from('.witness-header', {
                duration: 0.8,
                y: -50,
                opacity: 0,
                ease: 'power2.out'
            });
            
            gsap.from('.summary-card', {
                duration: 0.8,
                y: 50,
                opacity: 0,
                delay: 0.2,
                ease: 'power2.out'
            });
            
            gsap.from('.form-section', {
                duration: 0.6,
                y: 30,
                opacity: 0,
                delay: 0.4,
                stagger: 0.1,
                ease: 'power2.out'
            });
            
            gsap.from('.guide-item', {
                scrollTrigger: {
                    trigger: '.witness-guide',
                    start: 'top 80%'
                },
                duration: 0.6,
                y: 50,
                opacity: 0,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }
    } catch (error) {
        console.error('페이지 애니메이션 설정 오류:', error);
    }
}

// 전역 함수로 내보내기
window.getCurrentLocation = getCurrentLocation;
window.openMapSelector = openMapSelector;
window.closeMapModal = closeMapModal;
window.searchLocation = searchLocation;
window.selectMapLocation = selectMapLocation;
=======
    if (selectedLocation) {
        document.getElementById('witnessLocation').value = selectedLocation.address;
        closeMapModal();
        
        if (window.showNotification) {
            window.showNotification('위치가 선택되었습니다.', 'success');
        }
    } else {
        if (window.showNotification) {
            window.showNotification('위치를 선택해주세요.', 'warning');
        }
    }
}

// 위치 검색
function searchLocation() {
    const searchInput = document.getElementById('mapSearchInput');
    const query = searchInput.value.trim();
    
    if (!query) {
        if (window.showNotification) {
            window.showNotification('검색어를 입력해주세요.', 'warning');
        }
        return;
    }
    
    // 실제로는 지도 API의 검색 기능 사용
    console.log('위치 검색:', query);
    
    if (window.showNotification) {
        window.showNotification('검색 기능은 지도 API 연동 후 사용 가능합니다.', 'info');
    }
}

// 폼 유효성 검사 설정
function setupFormValidation() {
    // 실시간 유효성 검사
    const requiredInputs = document.querySelectorAll('input[required], textarea[required], select[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // 휴대폰 번호 자동 포맷팅
    const phoneInput = document.getElementById('witnessPhone');
    phoneInput.addEventListener('input', function() {
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
}

// 필드 유효성 검사
function validateField(field) {
    const fieldId = field.id;
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    switch(fieldId) {
        case 'witnessDate':
            if (!value) {
                message = '목격 날짜를 선택해주세요.';
                isValid = false;
            } else if (new Date(value) > new Date()) {
                message = '미래 날짜는 선택할 수 없습니다.';
                isValid = false;
            }
            break;
            
        case 'witnessTime':
            if (!value) {
                message = '목격 시간을 입력해주세요.';
                isValid = false;
            }
            break;
            
        case 'witnessLocation':
            if (!value) {
                message = '목격 장소를 입력해주세요.';
                isValid = false;
            } else if (value.length < 5) {
                message = '구체적인 장소를 입력해주세요.';
                isValid = false;
            }
            break;
            
        case 'witnessDescription':
            if (!value) {
                message = '목격 상황을 설명해주세요.';
                isValid = false;
            } else if (value.length < 20) {
                message = '더 자세한 설명을 입력해주세요. (최소 20자)';
                isValid = false;
            }
            break;
            
        case 'witnessName':
            if (!value) {
                message = '성명을 입력해주세요.';
                isValid = false;
            }
            break;
            
        case 'witnessPhone':
            if (!value) {
                message = '연락처를 입력해주세요.';
                isValid = false;
            } else if (!validatePhoneNumber(value)) {
                message = '올바른 휴대폰 번호를 입력해주세요.';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(fieldId + 'Error', message);
        field.classList.add('error');
    } else {
        clearFieldError(field);
        field.classList.remove('error');
    }
    
    return isValid;
}

// 폼 제출 처리
document.addEventListener('DOMContentLoaded', function() {
    const witnessForm = document.getElementById('witnessForm');
    if (witnessForm) {
        witnessForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // 전체 폼 유효성 검사
            const requiredFields = this.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            // 체크박스 검사
            const agreements = this.querySelectorAll('input[type="checkbox"][required]');
            agreements.forEach(checkbox => {
                if (!checkbox.checked) {
                    if (window.showNotification) {
                        window.showNotification('모든 필수 동의사항에 체크해주세요.', 'error');
                    }
                    isValid = false;
                }
            });
            
            if (!isValid) {
                return;
            }
            
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerHTML;
            
            // 로딩 상태
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 신고 접수 중...';
            submitBtn.disabled = true;
            
            try {
                // 폼 데이터 수집
                const formData = new FormData(this);
                
                // 파일 데이터 추가
                uploadedFiles.forEach((file, index) => {
                    formData.append(`evidence_${index}`, file);
                });
                
                // API 호출 시뮬레이션
                await simulateAPICall(2000);
                
                // 성공 처리
                showSuccessPage();
                
            } catch (error) {
                if (window.showNotification) {
                    window.showNotification('목격 신고 접수 중 오류가 발생했습니다.', 'error');
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
    const formSection = document.querySelector('.witness-form-section .container');
    formSection.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>목격 신고가 접수되었습니다</h2>
            <p>신고번호: <strong>#W2024-${Date.now().toString().slice(-6)}</strong></p>
            
            <div class="points-earned">
                <div class="points-info">
                    <i class="fas fa-coins"></i>
                    <span>예상 포인트: 100~500P</span>
                </div>
                <p>정보 검토 후 포인트가 지급됩니다</p>
            </div>
            
            <div class="next-steps">
                <h3>다음 단계</h3>
                <div class="step-list">
                    <div class="next-step completed">
                        <i class="fas fa-check"></i>
                        <span>목격 정보 접수 완료</span>
                    </div>
                    <div class="next-step">
                        <i class="fas fa-search"></i>
                        <span>관리자 검토 (1-2시간 소요)</span>
                    </div>
                    <div class="next-step">
                        <i class="fas fa-coins"></i>
                        <span>포인트 지급 및 알림</span>
                    </div>
                </div>
            </div>
            
            <div class="action-buttons">
                <a href="/missing/1" class="btn btn-primary">
                    <i class="fas fa-arrow-left"></i>
                    실종자 정보로 돌아가기
                </a>
                <a href="/search" class="btn btn-secondary">
                    <i class="fas fa-search"></i>
                    다른 실종자 보기
                </a>
            </div>
        </div>
    `;
    
    // 성공 페이지 애니메이션
    if (typeof gsap !== 'undefined') {
        gsap.from('.success-content', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            ease: 'power2.out'
        });
    }
    
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 유틸리티 함수들
function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFieldError(field) {
    const errorId = field.id + 'Error';
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function validatePhoneNumber(phone) {
    const phoneRegex = /^010-?\d{4}-?\d{4}$/;
    return phoneRegex.test(phone);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function simulateAPICall(delay = 1000) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

// 모달 외부 클릭시 닫기
document.addEventListener('DOMContentLoaded', function() {
    const mapModal = document.getElementById('mapModal');
    if (mapModal) {
        mapModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeMapModal();
            }
        });
    }
});
>>>>>>> origin/gb
