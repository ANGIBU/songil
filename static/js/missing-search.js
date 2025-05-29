// static/js/missing-search.js

// React 컴포넌트 활용
const { useState, useEffect, useCallback, useMemo } = React;

// 실종자 데이터 (샘플)
const sampleMissingData = [
    {
        id: 1,
        name: "김○○",
        age: 32,
        gender: "남성",
        date: "2024-05-20",
        location: "서울시 강남구 역삼동",
        region: "seoul",
        description: "검은색 정장, 갈색 구두",
        physicalInfo: "175cm, 중간체형",
        dangerLevel: "high",
        upCount: 246,
        period: "3일째",
        image: "/static/images/sample-missing-1.jpg"
    },
    {
        id: 2,
        name: "박○○",
        age: 8,
        gender: "남성",
        date: "2024-05-21",
        location: "부산시 해운대구 중동",
        region: "busan",
        description: "파란색 티셔츠, 검은색 반바지",
        physicalInfo: "120cm, 마른체형",
        dangerLevel: "high",
        upCount: 189,
        period: "2일째",
        image: "/static/images/sample-missing-2.jpg"
    },
    {
        id: 3,
        name: "최○○",
        age: 67,
        gender: "여성",
        date: "2024-05-22",
        location: "대구시 중구 삼덕동",
        region: "daegu",
        description: "흰색 블라우스, 검은색 바지",
        physicalInfo: "160cm, 중간체형",
        dangerLevel: "medium",
        upCount: 134,
        period: "1일째",
        image: "/static/images/sample-missing-3.jpg"
    },
    {
        id: 4,
        name: "이○○",
        age: 45,
        gender: "남성",
        date: "2024-05-19",
        location: "인천시 남동구 구월동",
        region: "incheon",
        description: "회색 후드티, 청바지",
        physicalInfo: "168cm, 뚱뚱한체형",
        dangerLevel: "low",
        upCount: 87,
        period: "4일째",
        image: "/static/images/placeholder.jpg"
    },
    {
        id: 5,
        name: "정○○",
        age: 23,
        gender: "여성",
        date: "2024-05-18",
        location: "광주시 서구 상무동",
        region: "gwangju",
        description: "분홍색 원피스, 흰색 운동화",
        physicalInfo: "165cm, 마른체형",
        dangerLevel: "medium",
        upCount: 156,
        period: "5일째",
        image: "/static/images/placeholder.jpg"
    },
    {
        id: 6,
        name: "홍○○",
        age: 14,
        gender: "남성",
        date: "2024-05-23",
        location: "대전시 유성구 봉명동",
        region: "daejeon",
        description: "교복, 검은색 가방",
        physicalInfo: "160cm, 마른체형",
        dangerLevel: "high",
        upCount: 23,
        period: "방금",
        image: "/static/images/placeholder.jpg"
    },
    // 추가 샘플 데이터 (페이지네이션 테스트용)
    {
        id: 7,
        name: "강○○",
        age: 55,
        gender: "여성",
        date: "2024-05-17",
        location: "울산시 남구 삼산동",
        region: "ulsan",
        description: "베이지색 코트, 검은색 핸드백",
        physicalInfo: "158cm, 중간체형",
        dangerLevel: "medium",
        upCount: 98,
        period: "6일째",
        image: "/static/images/placeholder.jpg"
    },
    {
        id: 8,
        name: "조○○",
        age: 29,
        gender: "남성",
        date: "2024-05-16",
        location: "경기도 수원시 영통구",
        region: "gyeonggi",
        description: "네이비 패딩, 청바지",
        physicalInfo: "172cm, 마른체형",
        dangerLevel: "low",
        upCount: 67,
        period: "7일째",
        image: "/static/images/placeholder.jpg"
    }
];

// 페이지네이션 관리자 클래스
class PaginationManager {
    constructor(itemsPerPage = 6) {
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.totalItems = 0;
        this.maxVisiblePages = 5;
        this.callbacks = [];
    }

    addCallback(callback) {
        this.callbacks.push(callback);
    }

    notify() {
        this.callbacks.forEach(callback => callback({
            currentPage: this.currentPage,
            totalPages: this.getTotalPages(),
            startIndex: this.getStartIndex(),
            endIndex: this.getEndIndex()
        }));
    }

    setTotalItems(count) {
        this.totalItems = count;
        if (this.currentPage > this.getTotalPages()) {
            this.currentPage = Math.max(1, this.getTotalPages());
        }
        this.renderPagination();
        this.notify();
    }

    getTotalPages() {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    getStartIndex() {
        return (this.currentPage - 1) * this.itemsPerPage;
    }

    getEndIndex() {
        return Math.min(this.getStartIndex() + this.itemsPerPage, this.totalItems);
    }

    goToPage(page) {
        const totalPages = this.getTotalPages();
        if (page >= 1 && page <= totalPages && page !== this.currentPage) {
            this.currentPage = page;
            this.renderPagination();
            this.notify();
            this.scrollToTop();
        }
    }

    nextPage() {
        if (this.currentPage < this.getTotalPages()) {
            this.goToPage(this.currentPage + 1);
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    renderPagination() {
        const pageNumbersContainer = document.getElementById('pageNumbers');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (!pageNumbersContainer) return;

        const totalPages = this.getTotalPages();
        
        // 이전/다음 버튼 상태 업데이트
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages;
        }

        // 페이지 번호 생성
        pageNumbersContainer.innerHTML = '';
        
        if (totalPages <= 1) return;

        const startPage = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + this.maxVisiblePages - 1);
        const adjustedStartPage = Math.max(1, endPage - this.maxVisiblePages + 1);

        // 첫 페이지와 점점점 표시
        if (adjustedStartPage > 1) {
            this.createPageButton(1, pageNumbersContainer);
            if (adjustedStartPage > 2) {
                this.createDots(pageNumbersContainer);
            }
        }

        // 페이지 번호들
        for (let i = adjustedStartPage; i <= endPage; i++) {
            this.createPageButton(i, pageNumbersContainer);
        }

        // 마지막 페이지와 점점점 표시
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                this.createDots(pageNumbersContainer);
            }
            this.createPageButton(totalPages, pageNumbersContainer);
        }
    }

    createPageButton(pageNum, container) {
        const button = document.createElement('button');
        button.className = `page-num ${pageNum === this.currentPage ? 'active' : ''}`;
        button.innerHTML = `<span>${pageNum}</span>`;
        button.addEventListener('click', () => this.goToPage(pageNum));
        container.appendChild(button);
    }

    createDots(container) {
        const dots = document.createElement('span');
        dots.className = 'page-dots';
        dots.textContent = '...';
        container.appendChild(dots);
    }
}

// ============ 필터 팝업 관리자 - 스크롤 버그 완전 해결 ============
class FilterPopupManager {
    constructor(searchManager) {
        this.searchManager = searchManager;
        this.overlay = null;
        this.modal = null;
        this.currentFilters = {
            sort: 'danger',
            region: '',
            age: '',
            period: ''
        };
        this.regionData = this.initRegionData();
        this.scrollY = 0; // 스크롤 위치 저장
        this.init();
    }

    initRegionData() {
        return {
            seoul: {
                name: '서울특별시',
                districts: ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', 
                          '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', 
                          '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구']
            },
            gyeonggi: {
                name: '경기도',
                districts: ['고양시', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시', 
                          '동두천시', '부천시', '성남시', '수원시', '시흥시', '안산시', '안성시', '안양시', 
                          '양주시', '여주시', '오산시', '용인시', '의왕시', '의정부시', '이천시', '파주시', 
                          '평택시', '포천시', '하남시', '화성시']
            },
            gangwon: {
                name: '강원특별자치도',
                districts: ['춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '홍천군', 
                          '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군', '양구군', '인제군', 
                          '고성군', '양양군']
            },
            chungbuk: {
                name: '충청북도',
                districts: ['청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '진천군', '괴산군', 
                          '음성군', '단양군', '증평군']
            },
            chungnam: {
                name: '충청남도',
                districts: ['천안시', '공주시', '보령시', '아산시', '서산시', '논산시', '계룡시', '당진시', 
                          '금산군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군']
            },
            jeonbuk: {
                name: '전라북도',
                districts: ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', 
                          '무주군', '장수군', '임실군', '순창군', '고창군', '부안군']
            },
            jeonnam: {
                name: '전라남도',
                districts: ['목포시', '여수시', '순천시', '나주시', '광양시', '담양군', '곡성군', '구례군', 
                          '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군', '무안군', 
                          '함평군', '영광군', '장성군', '완도군', '진도군', '신안군']
            },
            gyeongbuk: {
                name: '경상북도',
                districts: ['포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시', 
                          '문경시', '경산시', '군위군', '의성군', '청송군', '영양군', '영덕군', '청도군', 
                          '고령군', '성주군', '칠곡군', '예천군', '봉화군', '울진군', '울릉군']
            },
            gyeongnam: {
                name: '경상남도',
                districts: ['창원시', '진주시', '통영시', '사천시', '김해시', '밀양시', '거제시', '양산시', 
                          '의령군', '함안군', '창녕군', '고성군', '남해군', '하동군', '산청군', '함양군', 
                          '거창군', '합천군']
            },
            jeju: {
                name: '제주특별자치도',
                districts: ['제주시', '서귀포시']
            }
        };
    }

    init() {
        this.overlay = document.getElementById('filterPopupOverlay');
        if (this.overlay) this.modal = this.overlay.querySelector('.filter-popup-modal');
        
        if (!this.overlay || !this.modal) {
            console.warn('Filter popup elements not found');
            return;
        }

        this.setupEventListeners();
        this.loadCurrentFilters();
    }

    setupEventListeners() {
        // 팝업 열기 버튼
        const openBtn = document.getElementById('filterPopupBtn');
        if (openBtn) {
            openBtn.addEventListener('click', () => this.openPopup());
        }

        // 팝업 닫기 버튼
        const closeBtn = document.getElementById('filterPopupClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closePopup());
        }

        // 오버레이 클릭시 닫기
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.closePopup();
                }
            });
        }

        // 필터 적용 버튼
        const applyBtn = document.getElementById('filterApplyBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyFilters());
        }

        // 탭 전환 이벤트
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // 지역 1단계 선택 이벤트
        document.addEventListener('change', (e) => {
            if (e.target.name === 'region-level1') {
                this.handleRegionLevel1Change(e.target.value);
            }
        });

        // 지역 뒤로가기 버튼
        document.addEventListener('click', (e) => {
            if (e.target.closest('#regionBackBtn')) {
                console.log('Region back button clicked');
                this.showRegionLevel1();
            }
        });

        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay && this.overlay.classList.contains('active')) {
                this.closePopup();
            }
        });
    }

    handleRegionLevel1Change(regionCode) {
        const regionLevel1 = document.getElementById('regionLevel1');
        const regionLevel2 = document.getElementById('regionLevel2');
        const regionLevel2Options = document.getElementById('regionLevel2Options');
        const regionLevel2Title = document.getElementById('regionLevel2Title');
        
        if (!regionCode) {
            // 전체 지역 선택시 2단계 숨김
            this.showRegionLevel1();
            return;
        }
        
        const regionInfo = this.regionData[regionCode];
        if (!regionInfo) {
            console.error('Region data not found for:', regionCode);
            return;
        }
        
        // 2단계 제목 업데이트
        if (regionLevel2Title) {
            regionLevel2Title.textContent = `${regionInfo.name} 세부 지역`;
        }
        
        // 2단계 지역 옵션 생성
        if (regionLevel2Options) {
            regionLevel2Options.innerHTML = '';
            
            // 전체 옵션 추가
            const allOption = document.createElement('label');
            allOption.className = 'filter-option';
            allOption.innerHTML = `
                <input type="radio" name="region-level2" value="${regionCode}" checked>
                <span class="checkmark"></span>
                전체 ${regionInfo.name}
            `;
            regionLevel2Options.appendChild(allOption);
            
            // 세부 지역 옵션들 추가
            regionInfo.districts.forEach(district => {
                const option = document.createElement('label');
                option.className = 'filter-option';
                option.innerHTML = `
                    <input type="radio" name="region-level2" value="${regionCode}-${district}">
                    <span class="checkmark"></span>
                    ${district}
                `;
                regionLevel2Options.appendChild(option);
            });
        }
        
        // 2단계로 전환 (단순한 show/hide)
        this.showRegionLevel2();
    }

    // 단순한 표시/숨김 함수들
    showRegionLevel2() {
        const regionLevel1 = document.getElementById('regionLevel1');
        const regionLevel2 = document.getElementById('regionLevel2');
        
        console.log('Showing region level 2');
        
        if (regionLevel1) {
            regionLevel1.classList.add('hide');
        }
        
        if (regionLevel2) {
            regionLevel2.classList.add('show');
        }
    }

    showRegionLevel1() {
        const regionLevel1 = document.getElementById('regionLevel1');
        const regionLevel2 = document.getElementById('regionLevel2');
        
        console.log('Showing region level 1');
        
        if (regionLevel2) {
            regionLevel2.classList.remove('show');
        }
        
        if (regionLevel1) {
            regionLevel1.classList.remove('hide');
        }
    }

    switchTab(tabName) {
        // 모든 탭 비활성화
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.filter-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // 선택된 탭 활성화
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        const selectedContent = document.getElementById(`tab-${tabName}`);
        
        if (selectedTab && selectedContent) {
            selectedTab.classList.add('active');
            selectedContent.classList.add('active');
            
            // 지역 탭 선택 시 초기 상태로 리셋
            if (tabName === 'region') {
                console.log('Region tab selected, resetting state');
                setTimeout(() => {
                    this.showRegionLevel1();
                }, 50);
            }
        }
    }

    // ============ 팝업 열기 - 스크롤 위치 보존 적용 ============
    openPopup() {
        if (!this.overlay) return;
        
        this.loadCurrentFilters();
        
        // 현재 스크롤 위치 저장
        this.scrollY = window.scrollY;
        
        // CSS 변수로 스크롤 위치 설정
        document.documentElement.style.setProperty('--scroll-y', `-${this.scrollY}px`);
        
        // body에 modal-open 클래스 추가 (스크롤 방지)
        document.body.classList.add('modal-open');
        
        // 팝업 표시
        this.overlay.classList.add('active');
        
        // 지역 탭 초기 상태 보장
        this.showRegionLevel1();
        
        console.log('Modal opened - scroll position preserved:', this.scrollY);
    }

    // ============ 팝업 닫기 - 스크롤 위치 복원 ============
    closePopup() {
        if (!this.overlay) return;
        
        // 팝업 숨김
        this.overlay.classList.remove('active');
        
        // body 클래스 제거
        document.body.classList.remove('modal-open');
        
        // 스크롤 위치 복원
        window.scrollTo(0, this.scrollY);
        
        // CSS 변수 초기화
        document.documentElement.style.removeProperty('--scroll-y');
        
        console.log('Modal closed - scroll position restored:', this.scrollY);
    }

    loadCurrentFilters() {
        const filters = this.searchManager.filters;
        
        // 정렬 라디오 버튼
        const sortRadio = document.querySelector(`input[name="sort"][value="${filters.sort}"]`);
        if (sortRadio) sortRadio.checked = true;

        // 지역 필터 로딩
        this.loadRegionFilter(filters.region);

        // 연령대 라디오 버튼
        const ageRadio = document.querySelector(`input[name="age"][value="${filters.age}"]`);
        if (ageRadio) ageRadio.checked = true;

        // 실종기간 라디오 버튼
        const periodRadio = document.querySelector(`input[name="period"][value="${filters.period}"]`);
        if (periodRadio) periodRadio.checked = true;
    }

    loadRegionFilter(regionValue) {
        console.log('Loading region filter:', regionValue);
        
        // 먼저 초기 상태로 리셋
        this.showRegionLevel1();
        
        if (!regionValue) {
            // 전체 지역 선택
            const allRegionRadio = document.querySelector('input[name="region-level1"][value=""]');
            if (allRegionRadio) allRegionRadio.checked = true;
            return;
        }
        
        // 세부 지역인 경우
        if (regionValue.includes('-')) {
            const [regionCode, district] = regionValue.split('-');
            
            // 1단계 지역 선택
            const level1Radio = document.querySelector(`input[name="region-level1"][value="${regionCode}"]`);
            if (level1Radio) {
                level1Radio.checked = true;
                
                // 2단계 지역 데이터 생성
                this.handleRegionLevel1Change(regionCode);
                
                // 2단계 지역 선택 (약간의 지연 후)
                setTimeout(() => {
                    const level2Radio = document.querySelector(`input[name="region-level2"][value="${regionValue}"]`);
                    if (level2Radio) {
                        level2Radio.checked = true;
                        console.log('Selected detail region:', regionValue);
                    } else {
                        console.error('Detail region radio not found:', regionValue);
                    }
                }, 100);
            }
        } else {
            // 도/시 전체인 경우
            const level1Radio = document.querySelector(`input[name="region-level1"][value="${regionValue}"]`);
            if (level1Radio) {
                level1Radio.checked = true;
                
                // 2단계 데이터 생성 후 전체 옵션 선택
                this.handleRegionLevel1Change(regionValue);
                
                setTimeout(() => {
                    const level2Radio = document.querySelector(`input[name="region-level2"][value="${regionValue}"]`);
                    if (level2Radio) {
                        level2Radio.checked = true;
                        console.log('Selected region:', regionValue);
                    } else {
                        console.error('Region radio not found:', regionValue);
                    }
                }, 100);
            }
        }
    }

    applyFilters() {
        // 정렬
        const sortValue = document.querySelector('input[name="sort"]:checked')?.value || 'danger';
        
        // 지역 - 2단계 지역 선택 확인
        let regionValue = '';
        const regionLevel2Input = document.querySelector('input[name="region-level2"]:checked');
        if (regionLevel2Input) {
            regionValue = regionLevel2Input.value;
        } else {
            const regionLevel1Input = document.querySelector('input[name="region-level1"]:checked');
            if (regionLevel1Input && regionLevel1Input.value) {
                regionValue = regionLevel1Input.value;
            }
        }
        
        // 연령대
        const ageValue = document.querySelector('input[name="age"]:checked')?.value || '';
        
        // 실종기간
        const periodValue = document.querySelector('input[name="period"]:checked')?.value || '';

        console.log('Applying filters:', { sort: sortValue, region: regionValue, age: ageValue, period: periodValue });

        // 필터 적용
        this.searchManager.updateFilter('sort', sortValue);
        this.searchManager.updateFilter('region', regionValue);
        this.searchManager.updateFilter('age', ageValue);
        this.searchManager.updateFilter('period', periodValue);

        // 활성 필터 업데이트
        this.updateActiveFilters();
        
        // 팝업 닫기
        this.closePopup();
        
        // 성공 알림
        if (window.showNotification) {
            window.showNotification('필터가 적용되었습니다.', 'success');
        }
    }

    updateActiveFilters() {
        const container = document.getElementById('activeFilters');
        if (!container) return;

        container.innerHTML = '';
        const filters = this.searchManager.filters;
        
        const filterLabels = {
            sort: {
                danger: '위험도순',
                up: 'UP순',
                recent: '최신순',
                old: '오래된순'
            },
            age: {
                child: '어린이 (0-12세)',
                teen: '청소년 (13-19세)',
                adult: '성인 (20-64세)',
                senior: '고령자 (65세 이상)'
            },
            period: {
                today: '오늘',
                week: '최근 1주일',
                month: '최근 1개월',
                '3month': '최근 3개월',
                year: '최근 1년'
            }
        };

        // 기본값이 아닌 필터들만 표시
        Object.keys(filters).forEach(key => {
            const value = filters[key];
            if (value && value !== 'danger' && key !== 'searchTerm') {
                let label = '';
                
                if (key === 'region') {
                    label = this.getRegionLabel(value);
                } else {
                    label = filterLabels[key]?.[value] || value;
                }
                
                if (label) {
                    this.createFilterTag(key, value, label, container);
                }
            }
        });

        // 활성 필터가 있을 때만 컨테이너 표시
        if (container.children.length > 0) {
            container.style.display = 'flex';
        } else {
            container.style.display = 'none';
        }
    }

    getRegionLabel(regionValue) {
        if (!regionValue) return '';
        
        // 세부 지역인 경우 (예: seoul-강남구)
        if (regionValue.includes('-')) {
            const [regionCode, district] = regionValue.split('-');
            const regionInfo = this.regionData[regionCode];
            if (regionInfo) {
                return `${regionInfo.name} ${district}`;
            }
        } else {
            // 도/시 전체인 경우
            const regionInfo = this.regionData[regionValue];
            if (regionInfo) {
                return regionInfo.name;
            }
        }
        
        return regionValue;
    }

    createFilterTag(filterKey, filterValue, label, container) {
        const tag = document.createElement('span');
        tag.className = 'filter-tag';
        tag.innerHTML = `
            <span>${label}</span>
            <i class="fas fa-times" data-filter="${filterKey}" title="필터 제거"></i>
        `;
        
        // 태그 제거 이벤트
        const removeIcon = tag.querySelector('i');
        removeIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeFilter(filterKey);
        });
        
        container.appendChild(tag);
    }

    removeFilter(filterKey) {
        const defaultValue = filterKey === 'sort' ? 'danger' : '';
        this.searchManager.updateFilter(filterKey, defaultValue);
        this.updateActiveFilters();
        
        // 성공 알림
        if (window.showNotification) {
            window.showNotification('필터가 제거되었습니다.', 'info');
        }
    }
}

// 실종자 카드 React 컴포넌트 - React key prop 경고 수정
function MissingCard({ data, onUpClick, viewMode = 'grid' }) {
    const [upCount, setUpCount] = useState(data.upCount);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleUpClick = useCallback(() => {
        if (isAnimating) return;
        
        setIsAnimating(true);
        setUpCount(prev => prev + 1);
        onUpClick(data.id);
        
        setTimeout(() => setIsAnimating(false), 300);
    }, [isAnimating, onUpClick, data.id]);

    const getDangerLevelText = useCallback((level) => {
        const levels = {
            'high': '긴급',
            'medium': '주의',
            'low': '관심'
        };
        return levels[level] || '일반';
    }, []);

    const formatDate = useCallback((dateStr) => {
        return dateStr.replace(/-/g, '.');
    }, []);

    if (viewMode === 'list') {
        return React.createElement('div', {
            className: `list-item ${isAnimating ? 'animating' : ''}`,
            'data-id': data.id
        }, [
            React.createElement('div', { className: 'list-image', key: 'image' },
                React.createElement('img', {
                    src: data.image,
                    alt: '실종자 사진',
                    onError: (e) => {
                        e.target.src = '/static/images/placeholder.jpg';
                    }
                })
            ),
            React.createElement('div', { className: 'list-content', key: 'content' }, [
                React.createElement('h3', { key: 'title' }, `${data.name} (${data.age}세)`),
                React.createElement('div', { className: 'missing-info', key: 'info' }, [
                    React.createElement('p', { key: 'date-info' }, [
                        React.createElement('i', { className: 'fas fa-calendar', key: 'date-icon' }),
                        ` ${formatDate(data.date)} 실종`
                    ]),
                    React.createElement('p', { key: 'location-info' }, [
                        React.createElement('i', { className: 'fas fa-map-marker-alt', key: 'location-icon' }),
                        ` ${data.location}`
                    ]),
                    React.createElement('p', { key: 'physical-info' }, [
                        React.createElement('i', { className: 'fas fa-user', key: 'physical-icon' }),
                        ` ${data.physicalInfo}`
                    ])
                ])
            ]),
            React.createElement('div', { className: 'list-actions', key: 'actions' }, [
                React.createElement('button', {
                    className: 'up-btn',
                    onClick: handleUpClick,
                    key: 'up-btn'
                }, [
                    React.createElement('i', { className: 'fas fa-arrow-up', key: 'up-icon' }),
                    React.createElement('span', { key: 'up-count' }, upCount)
                ]),
                React.createElement('a', {
                    href: `/missing/${data.id}`,
                    className: 'detail-btn',
                    key: 'detail-btn'
                }, [
                    React.createElement('i', { className: 'fas fa-eye', key: 'detail-icon' }),
                    '상세보기'
                ])
            ])
        ]);
    }

    // 그리드 뷰
    return React.createElement('div', {
        className: `missing-card ${isAnimating ? 'animating' : ''}`,
        'data-id': data.id,
        'data-danger': data.dangerLevel,
        'data-region': data.region,
        'data-age': data.age,
        'data-date': data.date
    }, [
        React.createElement('div', { className: 'card-image', key: 'image' }, [
            React.createElement('img', {
                src: data.image,
                alt: '실종자 사진',
                onError: (e) => {
                    e.target.src = '/static/images/placeholder.jpg';
                },
                key: 'img'
            }),
            React.createElement('div', {
                className: `danger-level ${data.dangerLevel}`,
                key: 'danger'
            }, getDangerLevelText(data.dangerLevel)),
            React.createElement('div', {
                className: 'missing-period',
                key: 'period'
            }, data.period)
        ]),
        React.createElement('div', { className: 'card-content', key: 'content' }, [
            React.createElement('h3', { key: 'title' }, `${data.name} (${data.age}세)`),
            React.createElement('div', { className: 'missing-info', key: 'info' }, [
                React.createElement('p', { key: 'date-info' }, [
                    React.createElement('i', { className: 'fas fa-calendar', key: 'date-icon' }),
                    ` ${formatDate(data.date)} 실종`
                ]),
                React.createElement('p', { key: 'location-info' }, [
                    React.createElement('i', { className: 'fas fa-map-marker-alt', key: 'location-icon' }),
                    ` ${data.location}`
                ]),
                React.createElement('p', { key: 'physical-info' }, [
                    React.createElement('i', { className: 'fas fa-user', key: 'physical-icon' }),
                    ` ${data.physicalInfo}`
                ]),
                React.createElement('p', { key: 'description-info' }, [
                    React.createElement('i', { className: 'fas fa-tshirt', key: 'description-icon' }),
                    ` ${data.description}`
                ])
            ]),
            React.createElement('div', { className: 'card-actions', key: 'actions' }, [
                React.createElement('button', {
                    className: 'up-btn',
                    onClick: handleUpClick,
                    key: 'up-btn'
                }, [
                    React.createElement('i', { className: 'fas fa-arrow-up', key: 'up-icon' }),
                    React.createElement('span', { key: 'up-count' }, upCount)
                ]),
                React.createElement('a', {
                    href: `/missing/${data.id}`,
                    className: 'detail-btn',
                    key: 'detail-btn'
                }, [
                    React.createElement('i', { className: 'fas fa-eye', key: 'detail-icon' }),
                    '상세보기'
                ])
            ])
        ])
    ]);
}

// 검색 및 필터 관리 클래스
class SearchManager {
    constructor() {
        this.filters = {
            searchTerm: '',
            sort: 'danger',
            region: '',
            age: '',
            period: ''
        };
        this.data = [...sampleMissingData];
        this.filteredData = [...this.data];
        this.callbacks = [];
    }

    addCallback(callback) {
        this.callbacks.push(callback);
    }

    notify() {
        this.callbacks.forEach(callback => callback(this.filteredData));
    }

    updateFilter(key, value) {
        this.filters[key] = value;
        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.data];

        // 검색어 필터
        if (this.filters.searchTerm) {
            const term = this.filters.searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(term) ||
                item.location.toLowerCase().includes(term) ||
                item.description.toLowerCase().includes(term)
            );
        }

        // 지역 필터
        if (this.filters.region) {
            filtered = filtered.filter(item => this.matchesRegion(item.region, this.filters.region));
        }

        // 연령 필터
        if (this.filters.age) {
            filtered = filtered.filter(item => this.matchesAgeGroup(item.age, this.filters.age));
        }

        // 기간 필터
        if (this.filters.period) {
            filtered = filtered.filter(item => this.matchesPeriod(item.date, this.filters.period));
        }

        // 정렬
        filtered = this.sortData(filtered, this.filters.sort);

        this.filteredData = filtered;
        this.notify();
    }

    matchesRegion(itemRegion, filterRegion) {
        if (!filterRegion) return true;
        
        // 세부 지역 필터인 경우 (예: seoul-강남구)
        if (filterRegion.includes('-')) {
            const [regionCode, district] = filterRegion.split('-');
            // 아이템의 지역이 해당 지역 코드와 매치되는지 확인
            // 실제로는 더 정교한 매칭 로직이 필요할 수 있음
            return itemRegion === regionCode;
        } else {
            // 도/시 전체 필터인 경우
            return itemRegion === filterRegion;
        }
    }

    matchesAgeGroup(age, group) {
        switch (group) {
            case 'child': return age >= 0 && age <= 12;
            case 'teen': return age >= 13 && age <= 19;
            case 'adult': return age >= 20 && age <= 64;
            case 'senior': return age >= 65;
            default: return true;
        }
    }

    matchesPeriod(dateStr, period) {
        const cardDate = new Date(dateStr);
        const today = new Date();
        const diffDays = Math.floor((today - cardDate) / (1000 * 60 * 60 * 24));

        switch (period) {
            case 'today': return diffDays === 0;
            case 'week': return diffDays <= 7;
            case 'month': return diffDays <= 30;
            case '3month': return diffDays <= 90;
            case 'year': return diffDays <= 365;
            default: return true;
        }
    }

    sortData(data, sortType) {
        return data.sort((a, b) => {
            switch (sortType) {
                case 'danger':
                    return this.getDangerWeight(b) - this.getDangerWeight(a);
                case 'up':
                    return b.upCount - a.upCount;
                case 'recent':
                    return new Date(b.date) - new Date(a.date);
                case 'old':
                    return new Date(a.date) - new Date(b.date);
                default:
                    return 0;
            }
        });
    }

    getDangerWeight(item) {
        const weights = { 'high': 3, 'medium': 2, 'low': 1 };
        return weights[item.dangerLevel] || 0;
    }

    resetFilters() {
        this.filters = {
            searchTerm: '',
            sort: 'danger',
            region: '',
            age: '',
            period: ''
        };
        this.applyFilters();
    }
}

// ============ 수정된 애니메이션 관리자 - 안전한 방식 ============
class SearchAnimations {
    constructor() {
        this.isInitialized = false;
        this.scrollTriggers = [];
        this.isDestroyed = false;
        this.animationReady = false;
        this.init();
    }

    init() {
        // 애니메이션 준비 클래스 추가 확인
        this.checkAnimationReady();
        
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded, using fallback animations');
            this.fallbackAnimations();
            return;
        }

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // 애니메이션 준비가 되었을 때만 시작
        if (this.animationReady) {
            this.startSequentialAnimations();
        }
        
        this.isInitialized = true;
        console.log('✨ Search animations initialized safely');
    }
    
    // 애니메이션 준비 상태 확인
    checkAnimationReady() {
        const body = document.body;
        const hasAnimationClass = body.classList.contains('js-animation-ready');
        
        if (!hasAnimationClass) {
            console.log('⚠️ Animation not ready - elements will remain visible for safety');
            this.animationReady = false;
        } else {
            console.log('✅ Animation ready - will start sequential animations');
            this.animationReady = true;
        }
    }

    // 안전한 순차 애니메이션
    startSequentialAnimations() {
        if (!this.animationReady) {
            console.log('Skipping animations - not ready');
            return;
        }
        
        // 애니메이션할 요소들 순서대로 정의
        const animationSequence = [
            { selector: '.search-title', delay: 0.1 },
            { selector: '.search-controls', delay: 0.3 },
            { selector: '.search-results-info', delay: 0.5 },
            { selector: '.missing-grid', delay: 0.7 },
            { selector: '.missing-list-view', delay: 0.7 },
            { selector: '.pagination', delay: 0.9 }
        ];

        animationSequence.forEach(({ selector, delay }) => {
            const element = document.querySelector(selector);
            if (element && !this.isDestroyed) {
                gsap.fromTo(element, {
                    opacity: 0,
                    y: 30,
                    visibility: 'hidden'
                }, {
                    opacity: 1,
                    y: 0,
                    visibility: 'visible',
                    duration: 0.8,
                    delay: delay,
                    ease: "power2.out",
                    onComplete: () => {
                        if (element) {
                            element.classList.add('animate-complete');
                            gsap.set(element, { clearProps: 'transform,opacity' });
                        }
                    }
                });
            }
        });

        console.log('🎨 Safe sequential animations started');
    }

    // 검색 결과 애니메이션
    animateSearchResults() {
        if (!this.isInitialized || this.isDestroyed) return;

        const cards = document.querySelectorAll('.missing-card:not(.animated), .list-item:not(.animated)');
        if (cards.length === 0) return;

        // 애니메이션이 준비되지 않았다면 바로 표시
        if (!this.animationReady) {
            cards.forEach(card => {
                if (card) {
                    card.classList.add('animated');
                    card.style.opacity = '1';
                    card.style.visibility = 'visible';
                    card.style.transform = 'translateY(0)';
                }
            });
            return;
        }

        // GSAP 애니메이션
        gsap.fromTo(cards, {
            opacity: 0,
            y: 40,
            scale: 0.95
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.4)",
            onComplete: () => {
                cards.forEach(card => {
                    if (card) {
                        card.classList.add('animated');
                        gsap.set(card, { clearProps: 'transform,opacity' });
                    }
                });
            }
        });

        console.log('🎨 Search results animated');
    }

    // 필터 변경 애니메이션
    animateFilterChange() {
        if (!this.isInitialized || this.isDestroyed) return;

        const container = document.querySelector('.missing-grid, .missing-list-view');
        if (!container) return;

        // 기존 animated 클래스 제거
        const existingCards = container.querySelectorAll('.animated');
        existingCards.forEach(card => card.classList.remove('animated'));

        // 애니메이션이 준비되지 않았다면 바로 표시
        if (!this.animationReady) {
            setTimeout(() => {
                this.animateSearchResults();
            }, 150);
            return;
        }

        // GSAP 애니메이션
        gsap.fromTo(container, 
            { opacity: 0.4, y: 20, scale: 0.97 },
            { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => {
                    setTimeout(() => {
                        this.animateSearchResults();
                    }, 150);
                }
            }
        );
    }

    // UP 버튼 애니메이션
    animateUpButton(button) {
        if (!this.isInitialized || this.isDestroyed) return;

        // 애니메이션이 준비되지 않았다면 간단한 효과만
        if (!this.animationReady || typeof gsap === 'undefined') {
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
            return;
        }

        // GSAP 애니메이션
        const timeline = gsap.timeline();
        
        timeline
            .to(button, {
                scale: 1.15,
                rotation: 8,
                duration: 0.15,
                ease: 'power2.out'
            })
            .to(button, {
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: 'elastic.out(1.2, 0.3)',
                onComplete: () => {
                    gsap.set(button, { clearProps: 'transform' });
                }
            });

        const countElement = button.querySelector('span');
        if (countElement) {
            gsap.fromTo(countElement, 
                { scale: 1.3, color: '#22c55e' },
                {
                    scale: 1,
                    color: 'inherit',
                    duration: 0.5,
                    ease: 'back.out(1.4)',
                    onComplete: () => {
                        gsap.set(countElement, { clearProps: 'transform' });
                    }
                }
            );
        }

        this.createUpParticles(button);
    }

    // 파티클 효과
    createUpParticles(button) {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: linear-gradient(135deg, #22c55e 0%, #4ade80 100%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${centerX}px;
                top: ${centerY}px;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (i / 6) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            
            if (typeof gsap !== 'undefined') {
                gsap.to(particle, {
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: 0,
                    scale: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    onComplete: () => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }
                });
            } else {
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 800);
            }
        }
    }

    // 뷰 전환 애니메이션
    animateViewToggle(viewMode) {
        if (!this.isInitialized || this.isDestroyed) return;

        const container = document.querySelector('.view-container');
        if (!container) return;

        // 애니메이션이 준비되지 않았다면 바로 표시
        if (!this.animationReady) {
            setTimeout(() => {
                this.animateSearchResults();
            }, 100);
            return;
        }

        // GSAP 애니메이션
        gsap.fromTo(container,
            { opacity: 0, scale: 0.96, y: 15 },
            { 
                opacity: 1, 
                scale: 1, 
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                onComplete: () => {
                    setTimeout(() => {
                        this.animateSearchResults();
                    }, 100);
                }
            }
        );

        console.log(`🎨 View toggled to ${viewMode}`);
    }

    // 폴백 애니메이션
    fallbackAnimations() {
        const elements = document.querySelectorAll(`
            .search-title,
            .search-controls,
            .search-results-info,
            .missing-grid,
            .missing-list-view,
            .missing-card,
            .list-item,
            .pagination
        `);
        
        elements.forEach((element, index) => {
            if (element && !this.isDestroyed) {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.style.visibility = 'visible';
                    element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    element.classList.add('animate-complete');
                }, index * 150);
            }
        });

        console.log('🎨 Fallback animations applied');
    }

    // 정리 함수
    destroy() {
        this.isDestroyed = true;
        
        this.scrollTriggers.forEach(trigger => {
            if (trigger && trigger.kill) {
                trigger.kill();
            }
        });
        this.scrollTriggers = [];
        
        console.log('🧹 Search animations destroyed');
    }
}

// 플로팅 버튼 관리자
class FloatingButtons {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        const mainBtn = document.querySelector('.floating-btn.main-btn');
        const subBtns = document.querySelector('.floating-sub-btns');
        
        if (!mainBtn || !subBtns) return;

        mainBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });

        // 외부 클릭시 닫기
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.floating-report-btns') && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        const subBtns = document.querySelector('.floating-sub-btns');
        const mainBtn = document.querySelector('.floating-btn.main-btn');
        
        subBtns.classList.add('open');
        
        if (typeof gsap !== 'undefined') {
            gsap.to(mainBtn, {
                rotation: 45,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
            
            gsap.from(subBtns.children, {
                scale: 0,
                opacity: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: 'back.out(1.7)'
            });
        }
    }

    close() {
        this.isOpen = false;
        const subBtns = document.querySelector('.floating-sub-btns');
        const mainBtn = document.querySelector('.floating-btn.main-btn');
        
        subBtns.classList.remove('open');
        
        if (typeof gsap !== 'undefined') {
            gsap.to(mainBtn, {
                rotation: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    }
}

// 검색 입력 디바운서
class SearchDebouncer {
    constructor(callback, delay = 500) {
        this.callback = callback;
        this.delay = delay;
        this.timeoutId = null;
    }

    execute(value) {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.callback(value);
        }, this.delay);
    }

    cancel() {
        clearTimeout(this.timeoutId);
    }
}

// ============ 메인 검색 페이지 클래스 - 안전한 방식으로 수정 ============
class MissingSearchPage {
    constructor() {
        this.searchManager = new SearchManager();
        this.paginationManager = new PaginationManager(6);
        this.filterPopupManager = null;
        this.animations = null;
        this.floatingButtons = null;
        this.searchDebouncer = null;
        this.viewMode = 'grid';
        this.currentPageData = [];
        this.reactRoots = new Map();
        this.isViewChanging = false;
        this.isDestroyed = false;
        this.init();
    }

    init() {
        if (this.isDestroyed) return;
        
        // 안전한 초기화 - 애니메이션 준비 클래스는 나중에 추가
        console.log('🚀 Starting missing search page initialization...');
        
        // DOM 준비 상태 확인
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.handleDOMReady());
        } else {
            this.handleDOMReady();
        }
    }

    handleDOMReady() {
        if (this.isDestroyed) return;
        
        // 뷰 초기화 (가장 먼저 실행)
        this.initializeViews();
        
        // 즉시 React 컴포넌트 렌더링 (콘텐츠가 보이도록)
        this.renderComponents();
        
        // 애니메이션과 이벤트 리스너 설정
        setTimeout(() => {
            this.initializeAnimations();
            this.setupManagers();
            this.setupEventListeners();
            
            // 모든 준비가 완료된 후에만 애니메이션 클래스 추가
            this.enableAnimations();
        }, 500); // 충분한 시간을 두고 활성화
    }

    // 애니메이션 활성화 (모든 준비 완료 후)
    enableAnimations() {
        // JavaScript와 모든 라이브러리가 로드된 것을 확인
        const hasReact = typeof React !== 'undefined';
        const hasGSAP = typeof gsap !== 'undefined';
        
        console.log('🎨 Checking animation readiness:', { hasReact, hasGSAP });
        
        if (hasReact) {
            // 애니메이션 준비 클래스 추가
            document.body.classList.add('js-animation-ready');
            console.log('✅ Animations enabled - smooth transitions will start');
            
            // 애니메이션 시작
            if (this.animations) {
                this.animations.startSequentialAnimations();
            }
        } else {
            console.log('⚠️ Keeping elements visible - React not ready');
        }
    }

    initializeViews() {
        const gridView = document.getElementById('missingGrid');
        const listView = document.getElementById('missingList');
        
        if (gridView && listView) {
            console.log('Initializing views - ensuring visibility');
            
            // 뷰 상태 초기화 (안전하게)
            gridView.classList.remove('view-hidden');
            listView.classList.remove('view-active');
            
            // 뷰 버튼 상태 초기화
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const gridBtn = document.querySelector('[data-view="grid"]');
            if (gridBtn) {
                gridBtn.classList.add('active');
            }
            
            this.viewMode = 'grid';
            console.log('Views initialized safely');
        }
    }

    renderComponents() {
        if (this.isDestroyed) return;
        
        try {
            // 초기 데이터 렌더링
            this.handleDataChange(this.searchManager.filteredData);
            console.log('✅ React components rendered successfully');
        } catch (error) {
            console.error('❌ React rendering failed:', error);
            // 폴백으로 기본 HTML 표시
            this.showFallbackContent();
        }
    }

    // React 렌더링 실패 시 폴백
    showFallbackContent() {
        const gridContainer = document.getElementById('missingGrid');
        if (gridContainer) {
            gridContainer.innerHTML = '<p>실종자 목록을 불러오는 중입니다...</p>';
        }
    }

    initializeAnimations() {
        if (this.isDestroyed) return;
        
        try {
            this.animations = new SearchAnimations();
            console.log('✅ Animations initialized');
        } catch (error) {
            console.error('❌ Animation initialization failed:', error);
        }
    }

    setupManagers() {
        if (this.isDestroyed) return;
        
        // 필터 팝업 초기화
        this.filterPopupManager = new FilterPopupManager(this.searchManager);
        
        // 검색 관리자 콜백 등록
        this.searchManager.addCallback((data) => this.handleDataChange(data));
        
        // 페이지네이션 콜백 등록
        this.paginationManager.addCallback((paginationInfo) => this.handlePaginationChange(paginationInfo));
        
        // 검색 디바운서 설정
        this.searchDebouncer = new SearchDebouncer((value) => {
            this.searchManager.updateFilter('searchTerm', value);
        });
        
        // 플로팅 버튼 초기화
        this.floatingButtons = new FloatingButtons();
    }

    setupEventListeners() {
        if (this.isDestroyed) return;
        
        // 검색 입력
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchDebouncer.execute(e.target.value.trim());
                this.showSearchStatus(e.target.value.trim());
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchDebouncer.cancel();
                    this.searchManager.updateFilter('searchTerm', e.target.value.trim());
                }
            });
        }

        // 뷰 토글
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-btn')) {
                const btn = e.target.closest('.view-btn');
                const viewMode = btn.dataset.view;
                
                if (viewMode === this.viewMode || this.isViewChanging) return;
                
                console.log(`=== VIEW TOGGLE: ${this.viewMode} -> ${viewMode} ===`);
                this.switchToView(viewMode);
            }
        });

        // 검색 버튼
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    this.searchDebouncer.cancel();
                    this.searchManager.updateFilter('searchTerm', searchInput.value.trim());
                }
            });
        }

        // 리셋 버튼
        const resetBtn = document.getElementById('filterResetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }

        // 페이지네이션 버튼
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.paginationManager.prevPage());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.paginationManager.nextPage());
        }

        // 리사이즈 핸들러
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    // 안전한 뷰 전환
    async switchToView(targetViewMode) {
        if (this.isViewChanging || this.isDestroyed) return;
        this.isViewChanging = true;
        
        console.log(`🔄 Switching to ${targetViewMode} view...`);
        
        try {
            const gridView = document.getElementById('missingGrid');
            const listView = document.getElementById('missingList');
            
            if (!gridView || !listView) {
                console.error('❌ View containers not found!');
                return;
            }
            
            // 뷰 모드 업데이트
            this.viewMode = targetViewMode;
            
            // 버튼 상태 업데이트
            this.updateViewButtons(targetViewMode);
            
            // CSS 클래스로 뷰 전환
            if (targetViewMode === 'list') {
                console.log('📋 Activating list view...');
                gridView.classList.add('view-hidden');
                listView.classList.add('view-active');
            } else {
                console.log('📊 Activating grid view...');
                listView.classList.remove('view-active');
                gridView.classList.remove('view-hidden');
            }
            
            // 애니메이션 트리거
            if (this.animations && !this.animations.isDestroyed) {
                this.animations.animateViewToggle(targetViewMode);
            }
            
            // React 컴포넌트 재렌더링
            await this.delayedReactRender();
            
            console.log(`✅ Successfully switched to ${targetViewMode} view`);
            
        } catch (error) {
            console.error('❌ Error during view switch:', error);
        } finally {
            this.isViewChanging = false;
        }
    }

    async delayedReactRender() {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('🔄 Re-rendering React components...');
                if (this.currentPageData && this.currentPageData.length > 0) {
                    this.renderResults(this.currentPageData);
                }
                resolve();
            }, 200);
        });
    }

    updateViewButtons(activeViewMode) {
        console.log(`🔘 Updating view buttons for: ${activeViewMode}`);
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-view="${activeViewMode}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    handleDataChange(data) {
        if (this.isDestroyed) return;
        
        // 페이지네이션 업데이트
        this.paginationManager.setTotalItems(data.length);
        
        // 총 개수 업데이트
        const totalCountElement = document.getElementById('totalCount');
        if (totalCountElement) {
            totalCountElement.textContent = data.length;
        }
        
        // 결과 없음 표시
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = data.length === 0 ? 'block' : 'none';
        }

        // 활성 필터 업데이트
        if (this.filterPopupManager) {
            this.filterPopupManager.updateActiveFilters();
        }

        // 애니메이션 트리거
        if (this.animations && !this.animations.isDestroyed) {
            this.animations.animateFilterChange();
        }
    }

    handlePaginationChange(paginationInfo) {
        if (this.isDestroyed) return;
        
        const { startIndex, endIndex } = paginationInfo;
        this.currentPageData = this.searchManager.filteredData.slice(startIndex, endIndex);
        this.renderResults(this.currentPageData);
    }

    showSearchStatus(term) {
        const inputGroup = document.querySelector('.search-input-group');
        if (inputGroup) {
            if (term.length > 0) {
                inputGroup.classList.add('searching');
            } else {
                inputGroup.classList.remove('searching');
            }
        }
    }

    renderResults(data) {
        if (this.isDestroyed || data.length === 0) return;

        const gridContainer = document.getElementById('missingGrid');
        const listContainer = document.getElementById('missingList');
        
        // React 렌더링
        if (typeof React !== 'undefined' && gridContainer) {
            this.renderWithReact(data, gridContainer, listContainer);
        } else {
            console.warn('React not available, showing fallback');
            this.showFallbackContent();
        }

        // 애니메이션 트리거
        setTimeout(() => {
            if (this.animations && !this.animations.isDestroyed) {
                this.animations.animateSearchResults();
            }
        }, 250);
    }

    renderWithReact(data, gridContainer, listContainer) {
        const handleUpClick = (cardId) => {
            if (this.isDestroyed) return;
            
            console.log(`UP clicked for card ${cardId}`);
            
            const button = document.querySelector(`[data-id="${cardId}"] .up-btn`);
            if (button && this.animations && !this.animations.isDestroyed) {
                this.animations.animateUpButton(button);
            }
            
            if (window.showNotification) {
                window.showNotification('UP을 눌렀습니다! 실종자 찾기에 도움이 됩니다.', 'success');
            }
        };

        // 기존 React 루트 정리
        ['grid', 'list'].forEach(key => {
            if (this.reactRoots.has(key)) {
                try {
                    this.reactRoots.get(key).unmount();
                } catch (e) {
                    console.warn(`Error unmounting ${key} root:`, e);
                }
            }
        });

        // 그리드 뷰 렌더링
        if (gridContainer) {
            gridContainer.innerHTML = '';
            try {
                const gridRoot = ReactDOM.createRoot(gridContainer);
                this.reactRoots.set('grid', gridRoot);
                
                gridRoot.render(
                    React.createElement(React.Fragment, null,
                        data.map(item =>
                            React.createElement(MissingCard, {
                                key: `grid-${item.id}`,
                                data: item,
                                onUpClick: handleUpClick,
                                viewMode: 'grid'
                            })
                        )
                    )
                );
            } catch (error) {
                console.error('Grid rendering failed:', error);
                gridContainer.innerHTML = '<p>그리드 뷰를 불러올 수 없습니다.</p>';
            }
        }

        // 리스트 뷰 렌더링
        if (listContainer) {
            listContainer.innerHTML = '';
            try {
                const listRoot = ReactDOM.createRoot(listContainer);
                this.reactRoots.set('list', listRoot);
                
                listRoot.render(
                    React.createElement(React.Fragment, null,
                        data.map(item =>
                            React.createElement(MissingCard, {
                                key: `list-${item.id}`,
                                data: item,
                                onUpClick: handleUpClick,
                                viewMode: 'list'
                            })
                        )
                    )
                );
            } catch (error) {
                console.error('List rendering failed:', error);
                listContainer.innerHTML = '<p>리스트 뷰를 불러올 수 없습니다.</p>';
            }
        }
    }

    resetFilters() {
        if (this.isDestroyed) return;
        
        // 폼 리셋
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        
        // 검색 관리자 리셋
        this.searchManager.resetFilters();
        
        // 페이지네이션 리셋
        this.paginationManager.currentPage = 1;
        
        // 애니메이션
        if (this.animations && !this.animations.isDestroyed) {
            this.animations.animateFilterChange();
        }
        
        // 활성 필터 업데이트
        if (this.filterPopupManager) {
            this.filterPopupManager.updateActiveFilters();
        }
        
        // 알림
        if (window.showNotification) {
            window.showNotification('필터가 초기화되었습니다.', 'info');
        }
    }

    handleResize() {
        if (this.isDestroyed) return;
        
        // 반응형 조정
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }

    // 정리 함수
    destroy() {
        this.isDestroyed = true;
        
        // React 루트 정리
        this.reactRoots.forEach(root => {
            try {
                root.unmount();
            } catch (e) {
                console.warn('Error unmounting React root:', e);
            }
        });
        this.reactRoots.clear();
        
        // 애니메이션 정리
        if (this.animations) {
            this.animations.destroy();
            this.animations = null;
        }
        
        // 타이머 정리
        if (this.searchDebouncer) {
            this.searchDebouncer.cancel();
        }
        
        console.log('🧹 Missing search page destroyed');
    }
}

// 페이지 로드 시 자동 초기화
let missingSearchPage = null;

// 즉시 초기화
console.log('🚀 Initializing missing search page...');
missingSearchPage = new MissingSearchPage();

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    if (missingSearchPage) {
        missingSearchPage.destroy();
        missingSearchPage = null;
    }
});

// 전역 함수 (하위 호환성을 위해)
window.performSearch = function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput && missingSearchPage && missingSearchPage.searchManager) {
        missingSearchPage.searchManager.updateFilter('searchTerm', searchInput.value.trim());
    }
};

window.resetFilters = function() {
    if (missingSearchPage) {
        missingSearchPage.resetFilters();
    }
};

window.toggleView = function(viewMode) {
    if (missingSearchPage) {
        missingSearchPage.switchToView(viewMode);
    }
};

window.handleUpClick = function(button, missingId) {
    const countSpan = button.querySelector('span');
    if (countSpan) {
        const currentCount = parseInt(countSpan.textContent);
        countSpan.textContent = currentCount + 1;
    }
    
    if (missingSearchPage && missingSearchPage.animations) {
        missingSearchPage.animations.animateUpButton(button);
    }
    
    if (window.showNotification) {
        window.showNotification('UP을 눌렀습니다! 실종자 찾기에 도움이 됩니다.', 'success');
    }
};

// 개발자 도구
if (typeof window !== 'undefined') {
    window.missingSearchDebug = {
        get instance() { return missingSearchPage; },
        sampleData: sampleMissingData,
        get animations() { return missingSearchPage ? missingSearchPage.animations : null; },
        
        checkVisibility: () => {
            const gridView = document.getElementById('missingGrid');
            const listView = document.getElementById('missingList');
            const cards = document.querySelectorAll('.missing-card');
            
            console.log('=== 가시성 체크 ===');
            console.log('Grid view:', gridView ? 'Found' : 'Not found');
            console.log('List view:', listView ? 'Found' : 'Not found');
            console.log('Cards count:', cards.length);
            console.log('Animation ready class:', document.body.classList.contains('js-animation-ready'));
            
            if (gridView) {
                console.log('Grid styles:', {
                    opacity: window.getComputedStyle(gridView).opacity,
                    visibility: window.getComputedStyle(gridView).visibility,
                    display: window.getComputedStyle(gridView).display
                });
            }
            
            cards.forEach((card, index) => {
                console.log(`Card ${index + 1}:`, {
                    opacity: window.getComputedStyle(card).opacity,
                    visibility: window.getComputedStyle(card).visibility,
                    display: window.getComputedStyle(card).display
                });
            });
        },
        
        forceShow: () => {
            console.log('🔧 Forcing all elements to show...');
            const elements = document.querySelectorAll('.missing-grid, .missing-card, .list-item');
            elements.forEach(el => {
                el.style.opacity = '1';
                el.style.visibility = 'visible';
                el.style.transform = 'translateY(0)';
                el.style.display = 'block';
            });
        },
        
        destroyInstance: () => {
            if (missingSearchPage) {
                missingSearchPage.destroy();
                missingSearchPage = null;
            }
        },
        
        reinitialize: () => {
            if (missingSearchPage) {
                missingSearchPage.destroy();
            }
            missingSearchPage = new MissingSearchPage();
        }
    };
    
    console.log('🛠️ Debug tools loaded!');
    console.log('- window.missingSearchDebug.checkVisibility() : 가시성 상태 확인');
    console.log('- window.missingSearchDebug.forceShow() : 강제로 모든 요소 표시');
}