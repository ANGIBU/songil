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

// ============ 수정된 페이지네이션 관리자 - 1페이지 문제 해결 ============
class PaginationManager {
    constructor(itemsPerPage = 6) {
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.totalItems = 0;
        this.maxVisiblePages = 5;
        this.callbacks = [];
        
        console.log('🔧 PaginationManager initialized:', {
            itemsPerPage: this.itemsPerPage,
            currentPage: this.currentPage
        });
    }

    addCallback(callback) {
        this.callbacks.push(callback);
    }

    notify() {
        const paginationInfo = {
            currentPage: this.currentPage,
            totalPages: this.getTotalPages(),
            startIndex: this.getStartIndex(),
            endIndex: this.getEndIndex(),
            totalItems: this.totalItems
        };
        
        console.log('📢 Pagination notify:', paginationInfo);
        
        this.callbacks.forEach(callback => {
            try {
                callback(paginationInfo);
            } catch (error) {
                console.error('Pagination callback error:', error);
            }
        });
    }

    setTotalItems(count) {
        console.log(`📊 Total items updated: ${this.totalItems} -> ${count}`);
        
        this.totalItems = count;
        
        // 현재 페이지가 총 페이지 수를 초과하는 경우 조정
        const totalPages = this.getTotalPages();
        if (this.currentPage > totalPages && totalPages > 0) {
            console.log(`📄 Current page ${this.currentPage} exceeds total pages ${totalPages}, adjusting to page 1`);
            this.currentPage = 1;
        }
        
        // 페이지네이션 UI 업데이트
        this.renderPagination();
        
        // 콜백 호출
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
        
        console.log(`🚀 Going to page: ${page} (current: ${this.currentPage}, total: ${totalPages})`);
        
        if (page >= 1 && page <= totalPages && page !== this.currentPage) {
            this.currentPage = page;
            this.renderPagination();
            this.notify();
            this.scrollToTop();
        } else {
            console.warn(`⚠️ Invalid page number: ${page}`);
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
        
        if (!pageNumbersContainer) {
            console.warn('⚠️ Page numbers container not found');
            return;
        }

        const totalPages = this.getTotalPages();
        
        console.log(`🎨 Rendering pagination: page ${this.currentPage}/${totalPages}`);
        
        // 이전/다음 버튼 상태 업데이트
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages;
        }

        // 페이지 번호 생성
        pageNumbersContainer.innerHTML = '';
        
        if (totalPages <= 1) {
            console.log('📄 Only one page, hiding pagination');
            return;
        }

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

// 필터 팝업 관리자 (기존과 동일)
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
        this.scrollY = 0;
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
            busan: {
                name: '부산광역시',
                districts: ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군']
            },
            daegu: {
                name: '대구광역시',
                districts: ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군']
            },
            incheon: {
                name: '인천광역시',
                districts: ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군']
            },
            gwangju: {
                name: '광주광역시',
                districts: ['동구', '서구', '남구', '북구', '광산구']
            },
            daejeon: {
                name: '대전광역시',
                districts: ['동구', '중구', '서구', '유성구', '대덕구']
            },
            ulsan: {
                name: '울산광역시',
                districts: ['중구', '남구', '동구', '북구', '울주군']
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
            this.showRegionLevel1();
            return;
        }
        
        const regionInfo = this.regionData[regionCode];
        if (!regionInfo) {
            console.error('Region data not found for:', regionCode);
            return;
        }
        
        if (regionLevel2Title) {
            regionLevel2Title.textContent = `${regionInfo.name} 세부 지역`;
        }
        
        if (regionLevel2Options) {
            regionLevel2Options.innerHTML = '';
            
            const allOption = document.createElement('label');
            allOption.className = 'filter-option';
            allOption.innerHTML = `
                <input type="radio" name="region-level2" value="${regionCode}" checked>
                <span class="checkmark"></span>
                전체 ${regionInfo.name}
            `;
            regionLevel2Options.appendChild(allOption);
            
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
        
        this.showRegionLevel2();
    }

    showRegionLevel2() {
        const regionLevel1 = document.getElementById('regionLevel1');
        const regionLevel2 = document.getElementById('regionLevel2');
        
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
        
        if (regionLevel2) {
            regionLevel2.classList.remove('show');
        }
        
        if (regionLevel1) {
            regionLevel1.classList.remove('hide');
        }
    }

    switchTab(tabName) {
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.filter-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        const selectedContent = document.getElementById(`tab-${tabName}`);
        
        if (selectedTab && selectedContent) {
            selectedTab.classList.add('active');
            selectedContent.classList.add('active');
            
            if (tabName === 'region') {
                setTimeout(() => {
                    this.showRegionLevel1();
                }, 50);
            }
        }
    }

    openPopup() {
        if (!this.overlay) return;
        
        this.loadCurrentFilters();
        this.scrollY = window.scrollY;
        document.documentElement.style.setProperty('--scroll-y', `-${this.scrollY}px`);
        document.body.classList.add('modal-open');
        this.overlay.classList.add('active');
        this.showRegionLevel1();
    }

    closePopup() {
        if (!this.overlay) return;
        
        this.overlay.classList.remove('active');
        document.body.classList.remove('modal-open');
        window.scrollTo(0, this.scrollY);
        document.documentElement.style.removeProperty('--scroll-y');
    }

    loadCurrentFilters() {
        const filters = this.searchManager.filters;
        
        const sortRadio = document.querySelector(`input[name="sort"][value="${filters.sort}"]`);
        if (sortRadio) sortRadio.checked = true;

        this.loadRegionFilter(filters.region);

        const ageRadio = document.querySelector(`input[name="age"][value="${filters.age}"]`);
        if (ageRadio) ageRadio.checked = true;

        const periodRadio = document.querySelector(`input[name="period"][value="${filters.period}"]`);
        if (periodRadio) periodRadio.checked = true;
    }

    loadRegionFilter(regionValue) {
        this.showRegionLevel1();
        
        if (!regionValue) {
            const allRegionRadio = document.querySelector('input[name="region-level1"][value=""]');
            if (allRegionRadio) allRegionRadio.checked = true;
            return;
        }
        
        if (regionValue.includes('-')) {
            const [regionCode, district] = regionValue.split('-');
            
            const level1Radio = document.querySelector(`input[name="region-level1"][value="${regionCode}"]`);
            if (level1Radio) {
                level1Radio.checked = true;
                this.handleRegionLevel1Change(regionCode);
                
                setTimeout(() => {
                    const level2Radio = document.querySelector(`input[name="region-level2"][value="${regionValue}"]`);
                    if (level2Radio) {
                        level2Radio.checked = true;
                    }
                }, 100);
            }
        } else {
            const level1Radio = document.querySelector(`input[name="region-level1"][value="${regionValue}"]`);
            if (level1Radio) {
                level1Radio.checked = true;
                this.handleRegionLevel1Change(regionValue);
                
                setTimeout(() => {
                    const level2Radio = document.querySelector(`input[name="region-level2"][value="${regionValue}"]`);
                    if (level2Radio) {
                        level2Radio.checked = true;
                    }
                }, 100);
            }
        }
    }

    applyFilters() {
        const sortValue = document.querySelector('input[name="sort"]:checked')?.value || 'danger';
        
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
        
        const ageValue = document.querySelector('input[name="age"]:checked')?.value || '';
        const periodValue = document.querySelector('input[name="period"]:checked')?.value || '';

        this.searchManager.updateFilter('sort', sortValue);
        this.searchManager.updateFilter('region', regionValue);
        this.searchManager.updateFilter('age', ageValue);
        this.searchManager.updateFilter('period', periodValue);

        this.updateActiveFilters();
        this.closePopup();
        
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

        if (container.children.length > 0) {
            container.style.display = 'flex';
        } else {
            container.style.display = 'none';
        }
    }

    getRegionLabel(regionValue) {
        if (!regionValue) return '';
        
        if (regionValue.includes('-')) {
            const [regionCode, district] = regionValue.split('-');
            const regionInfo = this.regionData[regionCode];
            if (regionInfo) {
                return `${regionInfo.name} ${district}`;
            }
        } else {
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
        
        if (window.showNotification) {
            window.showNotification('필터가 제거되었습니다.', 'info');
        }
    }
}

// 실종자 카드 React 컴포넌트
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
        
        console.log('🔍 SearchManager initialized with', this.data.length, 'items');
    }

    addCallback(callback) {
        this.callbacks.push(callback);
    }

    notify() {
        console.log('📢 SearchManager notify: filtered data count =', this.filteredData.length);
        this.callbacks.forEach(callback => {
            try {
                callback(this.filteredData);
            } catch (error) {
                console.error('SearchManager callback error:', error);
            }
        });
    }

    updateFilter(key, value) {
        console.log(`🔧 Filter updated: ${key} = "${value}"`);
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
        
        console.log('🎯 Filters applied:', {
            original: this.data.length,
            filtered: this.filteredData.length,
            filters: this.filters
        });
        
        this.notify();
    }

    matchesRegion(itemRegion, filterRegion) {
        if (!filterRegion) return true;
        
        if (filterRegion.includes('-')) {
            const [regionCode, district] = filterRegion.split('-');
            return itemRegion === regionCode;
        } else {
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

// 단순한 UP 버튼 애니메이션만 남김
class SimpleAnimations {
    constructor() {
        this.isDestroyed = false;
    }

    animateUpButton(button) {
        if (this.isDestroyed) return;

        // 간단한 스케일 애니메이션만 적용
        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
            if (!this.isDestroyed && button.style) {
                button.style.transform = 'scale(1)';
            }
        }, 200);

        // 카운트 애니메이션
        const countElement = button.querySelector('span');
        if (countElement) {
            countElement.style.color = '#22c55e';
            countElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                if (!this.isDestroyed && countElement.style) {
                    countElement.style.color = '';
                    countElement.style.transform = 'scale(1)';
                }
            }, 300);
        }
    }

    handleResize() {
        if (this.isDestroyed) return;
        
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }

    destroy() {
        this.isDestroyed = true;
    }
}

// 플로팅 버튼 관리자 (기존과 동일)
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

// 검색 입력 디바운서 (기존과 동일)
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

// ============ 완전히 수정된 메인 검색 페이지 클래스 - 목록 뷰 기능 수정 ============
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
        
        console.log('🚀 Starting missing search page initialization...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.handleDOMReady());
        } else {
            this.handleDOMReady();
        }
    }

    handleDOMReady() {
        if (this.isDestroyed) return;
        
        console.log('📄 DOM ready - initializing components...');
        
        // 뷰 초기화
        this.initializeViews();
        
        // 관리자들 설정
        this.setupManagers();
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        // 초기 데이터 로딩 (가장 중요!)
        this.loadInitialData();
        
        // 간단한 애니메이션만 초기화
        this.animations = new SimpleAnimations();
        
        console.log('✅ Missing search page loaded fast!');
    }

    // ============ 중요: 초기 데이터 로딩 보장 ============
    loadInitialData() {
        console.log('🔄 Loading initial data...');
        
        // 검색 관리자 초기 필터링 실행
        this.searchManager.applyFilters();
        
        // 강제로 데이터 변경 이벤트 발생
        setTimeout(() => {
            console.log('🔄 Triggering initial data load...');
            this.handleDataChange(this.searchManager.filteredData);
        }, 100);
    }

    initializeViews() {
        const gridView = document.getElementById('missingGrid');
        const listView = document.getElementById('missingList');
        
        if (gridView && listView) {
            console.log('🖼️ Initializing views...');
            
            // ============ 뷰 상태 초기화 - 올바른 CSS 클래스 적용 ============
            // 그리드 뷰 활성화 (기본)
            gridView.style.display = 'grid';
            gridView.classList.remove('view-hidden');
            
            // 리스트 뷰 비활성화
            listView.style.display = 'none';
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
            
            console.log('✅ Views initialized - grid active');
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

        // ============ 완전히 수정된 뷰 토글 이벤트 리스너 ============
        const gridViewBtn = document.getElementById('gridViewBtn');
        const listViewBtn = document.getElementById('listViewBtn');
        
        if (gridViewBtn) {
            gridViewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔘 Grid view button clicked');
                this.switchToView('grid');
            });
        }
        
        if (listViewBtn) {
            listViewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔘 List view button clicked');
                this.switchToView('list');
            });
        }

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

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    // ============ 완전히 수정된 뷰 전환 함수 - 목록 뷰 기능 수정 ============
    switchToView(targetViewMode) {
        if (this.isViewChanging || this.isDestroyed) return;
        if (targetViewMode === this.viewMode) {
            console.log(`⚠️ Already in ${targetViewMode} view`);
            return;
        }
        
        this.isViewChanging = true;
        
        console.log(`🔄 Switching from ${this.viewMode} to ${targetViewMode} view...`);
        
        try {
            const gridView = document.getElementById('missingGrid');
            const listView = document.getElementById('missingList');
            
            if (!gridView || !listView) {
                console.error('❌ View containers not found!');
                return;
            }
            
            // ============ 이전 뷰 비활성화 ============
            if (this.viewMode === 'grid') {
                gridView.style.display = 'none';
                gridView.classList.add('view-hidden');
                gridView.classList.remove('view-active');
            } else {
                listView.style.display = 'none';
                listView.classList.remove('view-active');
            }
            
            // ============ 새 뷰 모드 설정 ============
            this.viewMode = targetViewMode;
            
            // ============ 새 뷰 활성화 ============
            if (targetViewMode === 'list') {
                console.log('📋 Activating list view...');
                listView.style.display = 'flex';
                listView.classList.add('view-active');
            } else {
                console.log('📊 Activating grid view...');
                gridView.style.display = 'grid';
                gridView.classList.remove('view-hidden');
                gridView.classList.add('view-active');
            }
            
            // ============ 버튼 상태 업데이트 ============
            this.updateViewButtons(targetViewMode);
            
            // ============ React 컴포넌트 재렌더링 ============
            setTimeout(() => {
                if (this.currentPageData && this.currentPageData.length > 0) {
                    console.log(`🎨 Re-rendering ${this.currentPageData.length} items for ${targetViewMode} view`);
                    this.renderResults(this.currentPageData);
                }
                
                console.log(`✅ Successfully switched to ${targetViewMode} view`);
            }, 50);
            
        } catch (error) {
            console.error('❌ Error during view switch:', error);
        } finally {
            this.isViewChanging = false;
        }
    }

    updateViewButtons(activeViewMode) {
        // 모든 뷰 버튼에서 active 클래스 제거
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 활성 뷰 버튼에 active 클래스 추가
        const activeBtn = document.querySelector(`[data-view="${activeViewMode}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            console.log(`🔘 Updated button state: ${activeViewMode} is now active`);
        }
    }

    // ============ 수정된 데이터 변경 핸들러 ============
    handleDataChange(data) {
        if (this.isDestroyed) return;
        
        console.log('📊 Data changed:', data.length, 'items');
        
        // 페이지네이션 업데이트 (이게 핵심!)
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
    }

    // ============ 수정된 페이지네이션 변경 핸들러 ============
    handlePaginationChange(paginationInfo) {
        if (this.isDestroyed) return;
        
        const { startIndex, endIndex } = paginationInfo;
        
        console.log('📄 Pagination changed:', {
            page: paginationInfo.currentPage,
            startIndex,
            endIndex,
            total: paginationInfo.totalItems
        });
        
        // 현재 페이지 데이터 추출
        this.currentPageData = this.searchManager.filteredData.slice(startIndex, endIndex);
        
        console.log('📦 Current page data:', this.currentPageData.length, 'items');
        
        // 결과 렌더링
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

    // ============ 수정된 결과 렌더링 - 뷰 모드별 최적화 ============
    renderResults(data) {
        if (this.isDestroyed) return;
        
        console.log(`🎨 Rendering ${data.length} items for ${this.viewMode} view`);

        const gridContainer = document.getElementById('missingGrid');
        const listContainer = document.getElementById('missingList');
        
        if (!gridContainer || !listContainer) {
            console.error('❌ Containers not found!');
            return;
        }
        
        if (data.length === 0) {
            console.log('📭 No data to render');
            gridContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">표시할 데이터가 없습니다.</p>';
            listContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">표시할 데이터가 없습니다.</p>';
            return;
        }

        // React 렌더링
        if (typeof React !== 'undefined') {
            this.renderWithReact(data, gridContainer, listContainer);
        } else {
            console.warn('⚠️ React not available, showing fallback');
            this.showFallbackContent();
        }
    }

    renderWithReact(data, gridContainer, listContainer) {
        const handleUpClick = (cardId) => {
            if (this.isDestroyed) return;
            
            console.log(`👍 UP clicked for card ${cardId}`);
            
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
                    console.warn(`⚠️ Error unmounting ${key} root:`, e);
                }
            }
        });

        // 그리드 뷰 렌더링
        try {
            gridContainer.innerHTML = '';
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
            
            console.log('✅ Grid view rendered successfully');
        } catch (error) {
            console.error('❌ Grid rendering failed:', error);
            gridContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #e74c3c;">그리드 뷰를 불러올 수 없습니다.</p>';
        }

        // 리스트 뷰 렌더링
        try {
            listContainer.innerHTML = '';
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
            
            console.log('✅ List view rendered successfully');
        } catch (error) {
            console.error('❌ List rendering failed:', error);
            listContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #e74c3c;">리스트 뷰를 불러올 수 없습니다.</p>';
        }
    }

    showFallbackContent() {
        const gridContainer = document.getElementById('missingGrid');
        const listContainer = document.getElementById('missingList');
        
        if (gridContainer) {
            gridContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">실종자 목록을 불러오는 중입니다...</p>';
        }
        if (listContainer) {
            listContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">실종자 목록을 불러오는 중입니다...</p>';
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

    enableAnimations() {
        const hasReact = typeof React !== 'undefined';
        const hasGSAP = typeof gsap !== 'undefined';
        
        console.log('🎨 Checking animation readiness:', { hasReact, hasGSAP });
        
        if (hasReact) {
            document.body.classList.add('js-animation-ready');
            console.log('✅ Animations enabled');
            
            if (this.animations) {
                this.animations.startSequentialAnimations();
            }
        } else {
            console.log('⚠️ Keeping elements visible - React not ready');
        }
    }

    resetFilters() {
        if (this.isDestroyed) return;
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        
        this.searchManager.resetFilters();
        this.paginationManager.currentPage = 1;
        
        if (this.filterPopupManager) {
            this.filterPopupManager.updateActiveFilters();
        }
        
        if (window.showNotification) {
            window.showNotification('필터가 초기화되었습니다.', 'info');
        }
    }

    handleResize() {
        if (this.isDestroyed) return;
        
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }

    destroy() {
        this.isDestroyed = true;
        
        this.reactRoots.forEach(root => {
            try {
                root.unmount();
            } catch (e) {
                console.warn('⚠️ Error unmounting React root:', e);
            }
        });
        this.reactRoots.clear();
        
        if (this.animations) {
            this.animations.destroy();
            this.animations = null;
        }
        
        if (this.searchDebouncer) {
            this.searchDebouncer.cancel();
        }
        
        console.log('🧹 Missing search page destroyed');
    }
}

// ============ 페이지 로드 시 자동 초기화 ============
let missingSearchPage = null;

console.log('🚀 Initializing missing search page...');
missingSearchPage = new MissingSearchPage();

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    if (missingSearchPage) {
        missingSearchPage.destroy();
        missingSearchPage = null;
    }
});

// 전역 함수들
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
    console.log(`🔧 toggleView called with: ${viewMode}`);
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

// ============ 개선된 디버깅 도구 ============
if (typeof window !== 'undefined') {
    window.missingSearchDebug = {
        get instance() { return missingSearchPage; },
        sampleData: sampleMissingData,
        
        // 뷰 상태 확인 - 수정됨
        checkViews: () => {
            const gridView = document.getElementById('missingGrid');
            const listView = document.getElementById('missingList');
            
            console.log('=== 뷰 상태 ===');
            console.log('Current view mode:', missingSearchPage?.viewMode);
            console.log('Grid view display:', gridView ? window.getComputedStyle(gridView).display : 'Not found');
            console.log('List view display:', listView ? window.getComputedStyle(listView).display : 'Not found');
            console.log('Grid view classes:', gridView ? Array.from(gridView.classList) : 'Not found');
            console.log('List view classes:', listView ? Array.from(listView.classList) : 'Not found');
            
            const cards = document.querySelectorAll('.missing-card');
            const listItems = document.querySelectorAll('.list-item');
            console.log('Grid cards count:', cards.length);
            console.log('List items count:', listItems.length);
            
            // 버튼 상태 확인
            const gridBtn = document.querySelector('[data-view="grid"]');
            const listBtn = document.querySelector('[data-view="list"]');
            console.log('Grid button active:', gridBtn ? gridBtn.classList.contains('active') : 'Not found');
            console.log('List button active:', listBtn ? listBtn.classList.contains('active') : 'Not found');
        },
        
        // 목록 뷰로 강제 전환
        forceListView: () => {
            console.log('🔧 Forcing list view...');
            if (missingSearchPage) {
                missingSearchPage.switchToView('list');
            }
        },
        
        // 그리드 뷰로 강제 전환
        forceGridView: () => {
            console.log('🔧 Forcing grid view...');
            if (missingSearchPage) {
                missingSearchPage.switchToView('grid');
            }
        },
        
        // 페이지네이션 상태 확인
        checkPagination: () => {
            const pagination = missingSearchPage?.paginationManager;
            if (!pagination) {
                console.log('❌ Pagination manager not found');
                return;
            }
            
            console.log('=== 페이지네이션 상태 ===');
            console.log('Current page:', pagination.currentPage);
            console.log('Total items:', pagination.totalItems);
            console.log('Total pages:', pagination.getTotalPages());
            console.log('Start index:', pagination.getStartIndex());
            console.log('End index:', pagination.getEndIndex());
            console.log('Items per page:', pagination.itemsPerPage);
            
            const data = missingSearchPage?.searchManager?.filteredData;
            if (data) {
                console.log('Available data:', data.length, 'items');
                console.log('Current page data:', data.slice(pagination.getStartIndex(), pagination.getEndIndex()));
            }
        },
        
        // 강제 1페이지 로드
        forceFirstPage: () => {
            console.log('🔧 Forcing first page load...');
            if (missingSearchPage?.paginationManager) {
                missingSearchPage.paginationManager.currentPage = 1;
                missingSearchPage.paginationManager.notify();
            }
        },
        
        // 데이터 재로드
        reloadData: () => {
            console.log('🔄 Reloading data...');
            if (missingSearchPage?.searchManager) {
                missingSearchPage.searchManager.applyFilters();
            }
        },
        
        // 완전 재초기화
        reinitialize: () => {
            console.log('🔄 Reinitializing page...');
            if (missingSearchPage) {
                missingSearchPage.destroy();
            }
            missingSearchPage = new MissingSearchPage();
        }
    };
    
    console.log('🛠️ Debug tools loaded - FAST LOADING optimized!');
    console.log('- window.missingSearchDebug.checkViews() : 뷰 상태 확인');
    console.log('- window.missingSearchDebug.forceListView() : 목록 뷰로 강제 전환');
    console.log('- window.missingSearchDebug.forceGridView() : 그리드 뷰로 강제 전환');
    console.log('- window.missingSearchDebug.checkPagination() : 페이지네이션 상태 확인');
    console.log('- window.missingSearchDebug.forceFirstPage() : 강제로 1페이지 로드');
    console.log('- window.missingSearchDebug.reloadData() : 데이터 재로드');
}