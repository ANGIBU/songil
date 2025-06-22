// static/js/missing-witness.js

// 목격 신고 페이지 JavaScript
let uploadedFiles = [];
let selectedLocation = null;
let placeService = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeWitnessForm();
    setupEvidenceUpload();
    setupFormValidation();
});

// 목격 신고 폼 초기화
function initializeWitnessForm() {
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
    }
}

// 현재 위치 가져오기
function getCurrentLocation() {
    if (navigator.geolocation) {
        const btn = event.target.closest('.location-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 위치 확인 중...';
        btn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // 좌표 저장 (숨겨진 input 필드)
                document.getElementById('witnessLat').value = lat;
                document.getElementById('witnessLng').value = lng;
                document.getElementById('userLat').value = lat;
                document.getElementById('userLng').value = lng;

                // ✅ 카카오 지도 역지오코딩 (사람이 알아볼 주소로 변환)
                const geocoder = new kakao.maps.services.Geocoder();
                const coord = new kakao.maps.LatLng(lat, lng);

                geocoder.coord2Address(lng, lat, function(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        const address = result[0].road_address 
                            ? result[0].road_address.address_name 
                            : result[0].address.address_name;

                        document.getElementById('witnessLocation').value = address;

                        if (window.showNotification) {
                            window.showNotification('현재 위치가 자동으로 입력되었습니다.', 'success');
                        }
                    } else {
                        document.getElementById('witnessLocation').value = `위도: ${lat.toFixed(6)}, 경도: ${lng.toFixed(6)}`;
                    }
                });

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

    kakao.maps.load(() => {
        initializeKakaoMap();
    });

    if (typeof gsap !== 'undefined') {
        gsap.from('.modal-content', {
            duration: 0.3,
            scale: 0.8,
            opacity: 0,
            ease: 'power2.out'
        });
    }
}



// 지도 모달 닫기
function closeMapModal() {
    document.getElementById('mapModal').style.display = 'none';
}

// 지도에서 위치 선택
function selectMapLocation() {
    if (selectedLocation) {
        document.getElementById('witnessLocation').value = selectedLocation.address;
        document.getElementById('witnessLat').value = selectedLocation.lat;
        document.getElementById('witnessLng').value = selectedLocation.lng;
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

    if (!placeService) {
        console.error("placeService가 초기화되지 않았습니다.");
        return;
    }

    placeService.keywordSearch(query, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            const place = result[0]; // 첫 번째 결과 사용
            const lat = parseFloat(place.y);
            const lng = parseFloat(place.x);

            const newPosition = new kakao.maps.LatLng(lat, lng);

            // ✅ 기존 지도와 마커를 활용해서 위치 이동
            window.kakaoMap.setCenter(newPosition);
            window.kakaoMarker.setPosition(newPosition);

            // ✅ 주소 입력창과 selectedLocation 갱신
            document.getElementById('witnessLocation').value = place.place_name;

            selectedLocation = {
                lat: lat,
                lng: lng,
                address: place.place_name
            };

            if (window.showNotification) {
                window.showNotification('장소 검색 완료', 'success');
            }
        } else {
            if (window.showNotification) {
                window.showNotification('검색 결과가 없습니다.', 'error');
            }
        }
    });
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
                
                // 실제 API 호출
                const response = await fetch('/api/witness/report', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (result.status === 'success') {
                    showSuccessPage();
                } else {
                    window.showNotification(result.message || '신고 처리 중 오류가 발생했습니다.', 'error');
                }
                
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

function initializeKakaoMap() {
    const mapContainer = document.getElementById('location-map');
    const mapOption = {
        center: new kakao.maps.LatLng(37.5665, 126.9780),
        level: 3
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);
    window.kakaoMap = map;

    const geocoder = new kakao.maps.services.Geocoder();
    const marker = new kakao.maps.Marker({
        position: map.getCenter(),
        map: map
    });
    window.kakaoMarker = marker;

    kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
        const latlng = mouseEvent.latLng;

        marker.setPosition(latlng);

        geocoder.coord2Address(latlng.getLng(), latlng.getLat(), function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                const address = result[0].road_address 
                    ? result[0].road_address.address_name 
                    : result[0].address.address_name;

                document.getElementById('witnessLocation').value = address;
                selectedLocation = {
                    lat: latlng.getLat(),
                    lng: latlng.getLng(),
                    address: address
                };
                if (window.showNotification) {
                    window.showNotification('위치가 선택되었습니다.', 'success');
                }
            }
        });
    });
}

window.openMapSelector = openMapSelector;
