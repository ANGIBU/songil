// static/js/missing-search.js

// React 컴포넌트 활용
const { useState, useEffect, useCallback, useMemo } = React;

// 디버그 모드 설정 (개발 시에만 true로 설정)
const DEBUG_MODE = false;

// 디버그 로그 함수
function debugLog(...args) {
    if (DEBUG_MODE) {
        console.log(...args);
    }
}

function debugWarn(...args) {
    if (DEBUG_MODE) {
        console.warn(...args);
    }
}

function debugError(...args) {
    console.error(...args); // 에러는 항상 출력
}

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
        witnessCount: 7,
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
        witnessCount: 5,
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
        witnessCount: 3,
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
        witnessCount: 2,
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
        witnessCount: 4,
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
        witnessCount: 1,
        period: "방금",
        image: "/static/images/placeholder.jpg"
    },
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
        witnessCount: 2,
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
        witnessCount: 3,
        period: "7일째",
        image: "/static/images/placeholder.jpg"
    }
];

// 상태 저장 키
const STORAGE_KEYS = {
    FILTERS: 'missing_search_filters',
    CURRENT_PAGE: 'missing_search_page',
    VIEW_MODE: 'missing_search_view'
};

// 페이지네이션 관리자
class PaginationManager {
    constructor(itemsPerPage = 6) {
        this.itemsPerPage = itemsPerPage;
        this.currentPage = this.loadCurrentPage();
        this.totalItems = 0;
        this.maxVisiblePages = 5;
        this.callbacks = [];
    }

    loadCurrentPage() {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEYS.CURRENT_PAGE);
            return saved ? parseInt(saved, 10) : 1;
        } catch (error) {
            debugWarn('Failed to load current page from storage:', error);
            return 1;
        }
    }

    saveCurrentPage() {
        try {
            sessionStorage.setItem(STORAGE_KEYS.CURRENT_PAGE, this.currentPage.toString());
        } catch (error) {
            debugWarn('Failed to save current page to storage:', error);
        }
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
        
        this.callbacks.forEach(callback => {
            try {
                callback(paginationInfo);
            } catch (error) {
                debugError('Pagination callback error:', error);
            }
        });
    }

    setTotalItems(count) {
        this.totalItems = count;
        
        const totalPages = this.getTotalPages();
        if (this.currentPage > totalPages && totalPages > 0) {
            this.currentPage = 1;
        }
        
        this.renderPagination();
        this.notify();
        this.saveCurrentPage();
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
            this.saveCurrentPage();
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
        
        if (!pageNumbersContainer) {
            debugWarn('Page numbers container not found');
            return;
        }

        const totalPages = this.getTotalPages();
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages;
        }

        pageNumbersContainer.innerHTML = '';
        
        if (totalPages <= 1) {
            return;
        }

        const startPage = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + this.maxVisiblePages - 1);
        const adjustedStartPage = Math.max(1, endPage - this.maxVisiblePages + 1);

        if (adjustedStartPage > 1) {
            this.createPageButton(1, pageNumbersContainer);
            if (adjustedStartPage > 2) {
                this.createDots(pageNumbersContainer);
            }
        }

        for (let i = adjustedStartPage; i <= endPage; i++) {
            this.createPageButton(i, pageNumbersContainer);
        }

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

// 필터 팝업 관리자
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
        this.scrollX = 0;
        this.scrollbarWidth = 0;
        this.originalBodyStyles = {};
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
            debugWarn('Filter popup elements not found');
            return;
        }

        this.calculateScrollbarWidth();
        this.setupEventListeners();
        this.loadCurrentFilters();
    }

    calculateScrollbarWidth() {
        const outer = document.createElement('div');
        outer.style.cssText = `
            visibility: hidden;
            overflow: scroll;
            msOverflowStyle: scrollbar;
            position: absolute;
            top: -9999px;
            width: 100px;
            height: 100px;
        `;
        document.body.appendChild(outer);
        
        const inner = document.createElement('div');
        inner.style.width = '100%';
        inner.style.height = '200px';
        outer.appendChild(inner);
        
        this.scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
        document.body.removeChild(outer);
        
        document.documentElement.style.setProperty('--scrollbar-width', `${this.scrollbarWidth}px`);
    }

    setupEventListeners() {
        const openBtn = document.getElementById('filterPopupBtn');
        if (openBtn) {
            openBtn.addEventListener('click', () => this.openPopup());
        }

        const closeBtn = document.getElementById('filterPopupClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closePopup());
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.closePopup();
                }
            });
        }

        const applyBtn = document.getElementById('filterApplyBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyFilters());
        }

        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        document.addEventListener('change', (e) => {
            if (e.target.name === 'region-level1') {
                this.handleRegionLevel1Change(e.target.value);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('#regionBackBtn')) {
                this.showRegionLevel1();
            }
        });

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
            debugError('Region data not found for:', regionCode);
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
        
        this.scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        this.scrollX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
        
        const bodyStyle = document.body.style;
        this.originalBodyStyles = {
            position: bodyStyle.position || '',
            top: bodyStyle.top || '',
            left: bodyStyle.left || '',
            width: bodyStyle.width || '',
            height: bodyStyle.height || '',
            overflow: bodyStyle.overflow || '',
            paddingRight: bodyStyle.paddingRight || '',
            margin: bodyStyle.margin || ''
        };
        
        this.calculateScrollbarWidth();
        
        document.body.style.position = 'fixed';
        document.body.style.top = '0px';
        document.body.style.left = '0px';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${this.scrollbarWidth}px`;
        document.body.style.margin = '0';
        
        document.body.classList.add('modal-open');
        this.overlay.classList.add('active');
        this.showRegionLevel1();
        
        const firstFocusable = this.modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            setTimeout(() => {
                firstFocusable.focus();
            }, 100);
        }
    }

    closePopup() {
        if (!this.overlay) return;
        
        this.overlay.classList.remove('active');
        document.body.classList.remove('modal-open');
        
        const bodyStyle = document.body.style;
        Object.keys(this.originalBodyStyles).forEach(prop => {
            if (this.originalBodyStyles[prop] === '') {
                bodyStyle.removeProperty(prop);
            } else {
                bodyStyle[prop] = this.originalBodyStyles[prop];
            }
        });
        
        setTimeout(() => {
            window.scrollTo({
                top: this.scrollY,
                left: this.scrollX,
                behavior: 'instant'
            });
        }, 0);
        
        const openBtn = document.getElementById('filterPopupBtn');
        if (openBtn) {
            setTimeout(() => {
                openBtn.focus();
            }, 100);
        }
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

// 통일된 실종자 카드 React 컴포넌트 - style.css와 완전히 동일
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

    // 통일된 카드 구조 - style.css의 .missing-card와 완전히 동일
    return React.createElement('div', {
        className: `missing-card ${isAnimating ? 'animating' : ''}`,
        'data-id': data.id
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
            }, getDangerLevelText(data.dangerLevel))
        ]),
        React.createElement('div', { className: 'card-content', key: 'content' }, [
            React.createElement('h4', { key: 'title' }, `${data.name} (${data.age}세)`),
            React.createElement('p', { className: 'location', key: 'location' }, [
                React.createElement('i', { className: 'fas fa-map-marker-alt', key: 'location-icon' }),
                ` ${data.location}`
            ]),
            React.createElement('p', { className: 'date', key: 'date' }, [
                React.createElement('i', { className: 'fas fa-calendar', key: 'date-icon' }),
                ` ${formatDate(data.date)} 실종`
            ]),
            React.createElement('div', { className: 'card-stats', key: 'stats' }, [
                React.createElement('span', { 
                    className: 'stat',
                    key: 'up-stat',
                    onClick: handleUpClick,
                    style: { cursor: 'pointer' }
                }, [
                    React.createElement('i', { className: 'fas fa-arrow-up', key: 'up-icon' }),
                    ` ${upCount}`
                ]),
                React.createElement('span', { className: 'stat', key: 'witness-stat' }, [
                    React.createElement('i', { className: 'fas fa-eye', key: 'witness-icon' }),
                    ` ${data.witnessCount}건`
                ])
            ])
        ]),
        React.createElement('a', {
            href: `/missing/${data.id}`,
            className: 'detail-link',
            key: 'detail-link'
        }, [
            '상세보기',
            React.createElement('i', { className: 'fas fa-arrow-right', key: 'arrow' })
        ])
    ]);
}

// 검색 및 필터 관리 클래스
class SearchManager {
    constructor() {
        this.filters = this.loadFilters();
        this.data = [...sampleMissingData];
        this.filteredData = [...this.data];
        this.callbacks = [];
    }

    loadFilters() {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEYS.FILTERS);
            return saved ? JSON.parse(saved) : {
                searchTerm: '',
                sort: 'danger',
                region: '',
                age: '',
                period: ''
            };
        } catch (error) {
            debugWarn('Failed to load filters from storage:', error);
            return {
                searchTerm: '',
                sort: 'danger',
                region: '',
                age: '',
                period: ''
            };
        }
    }

    saveFilters() {
        try {
            sessionStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(this.filters));
        } catch (error) {
            debugWarn('Failed to save filters to storage:', error);
        }
    }

    addCallback(callback) {
        this.callbacks.push(callback);
    }

    notify() {
        this.callbacks.forEach(callback => {
            try {
                callback(this.filteredData);
            } catch (error) {
                debugError('SearchManager callback error:', error);
            }
        });
    }

    updateFilter(key, value) {
        this.filters[key] = value;
        this.saveFilters();
        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.data];

        if (this.filters.searchTerm) {
            const term = this.filters.searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(term) ||
                item.location.toLowerCase().includes(term) ||
                item.description.toLowerCase().includes(term)
            );
        }

        if (this.filters.region) {
            filtered = filtered.filter(item => this.matchesRegion(item.region, this.filters.region));
        }

        if (this.filters.age) {
            filtered = filtered.filter(item => this.matchesAgeGroup(item.age, this.filters.age));
        }

        if (this.filters.period) {
            filtered = filtered.filter(item => this.matchesPeriod(item.date, this.filters.period));
        }

        filtered = this.sortData(filtered, this.filters.sort);

        this.filteredData = filtered;
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
        this.saveFilters();
        this.applyFilters();
    }
}

// 간단한 애니메이션 관리자
class SimpleAnimations {
    constructor() {
        this.isDestroyed = false;
    }

    animateUpButton(button) {
        if (this.isDestroyed) return;

        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
            if (!this.isDestroyed && button.style) {
                button.style.transform = 'scale(1)';
            }
        }, 200);

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

// 메인 검색 페이지 클래스
class MissingSearchPage {
    constructor() {
        this.searchManager = new SearchManager();
        this.paginationManager = new PaginationManager(6);
        this.filterPopupManager = null;
        this.animations = null;
        this.floatingButtons = null;
        this.searchDebouncer = null;
        this.viewMode = this.loadViewMode();
        this.currentPageData = [];
        this.reactRoots = new Map();
        this.isViewChanging = false;
        this.isDestroyed = false;
        this.init();
    }

    loadViewMode() {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEYS.VIEW_MODE);
            return saved || 'grid';
        } catch (error) {
            debugWarn('Failed to load view mode from storage:', error);
            return 'grid';
        }
    }

    saveViewMode() {
        try {
            sessionStorage.setItem(STORAGE_KEYS.VIEW_MODE, this.viewMode);
        } catch (error) {
            debugWarn('Failed to save view mode to storage:', error);
        }
    }

    init() {
        if (this.isDestroyed) return;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.handleDOMReady());
        } else {
            this.handleDOMReady();
        }
    }

    handleDOMReady() {
        if (this.isDestroyed) return;
        
        this.initializeViews();
        this.setupManagers();
        this.setupEventListeners();
        this.loadInitialData();
        this.animations = new SimpleAnimations();
    }

    loadInitialData() {
        // 저장된 필터 적용
        const searchInput = document.getElementById('searchInput');
        if (searchInput && this.searchManager.filters.searchTerm) {
            searchInput.value = this.searchManager.filters.searchTerm;
        }

        this.searchManager.applyFilters();
        
        setTimeout(() => {
            this.handleDataChange(this.searchManager.filteredData);
        }, 100);
    }

    initializeViews() {
        const gridView = document.getElementById('missingGrid');
        const listView = document.getElementById('missingList');
        
        if (gridView && listView) {
            if (this.viewMode === 'list') {
                gridView.style.display = 'none';
                gridView.classList.add('view-hidden');
                listView.style.display = 'grid';
                listView.classList.add('view-active');
            } else {
                gridView.style.display = 'grid';
                gridView.classList.remove('view-hidden');
                listView.style.display = 'none';
                listView.classList.remove('view-active');
            }
            
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const activeBtn = document.querySelector(`[data-view="${this.viewMode}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }
        }
    }

    setupManagers() {
        if (this.isDestroyed) return;
        
        this.filterPopupManager = new FilterPopupManager(this.searchManager);
        this.searchManager.addCallback((data) => this.handleDataChange(data));
        this.paginationManager.addCallback((paginationInfo) => this.handlePaginationChange(paginationInfo));
        
        this.searchDebouncer = new SearchDebouncer((value) => {
            this.searchManager.updateFilter('searchTerm', value);
        });
        
        this.floatingButtons = new FloatingButtons();
    }

    setupEventListeners() {
        if (this.isDestroyed) return;
        
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

        const gridViewBtn = document.getElementById('gridViewBtn');
        const listViewBtn = document.getElementById('listViewBtn');
        
        if (gridViewBtn) {
            gridViewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToView('grid');
            });
        }
        
        if (listViewBtn) {
            listViewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToView('list');
            });
        }

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

        const resetBtn = document.getElementById('filterResetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }

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

        // 뒤로가기/앞으로가기 이벤트 처리 (상태 복원)
        window.addEventListener('popstate', (event) => {
            setTimeout(() => {
                // 페이지 상태 복원
                this.restorePageState();
                
                // 데이터 재렌더링
                if (this.currentPageData && this.currentPageData.length > 0) {
                    this.renderResults(this.currentPageData);
                } else {
                    // 데이터가 없으면 다시 로드
                    this.loadInitialData();
                }
            }, 100);
        });

        // 페이지 가시성 변경 시 상태 복원
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && !this.isDestroyed) {
                setTimeout(() => {
                    this.restorePageState();
                    if (this.currentPageData && this.currentPageData.length > 0) {
                        this.renderResults(this.currentPageData);
                    }
                }, 100);
            }
        });
    }

    switchToView(targetViewMode) {
        if (this.isViewChanging || this.isDestroyed) return;
        if (targetViewMode === this.viewMode) return;
        
        this.isViewChanging = true;
        
        try {
            const gridView = document.getElementById('missingGrid');
            const listView = document.getElementById('missingList');
            
            if (!gridView || !listView) {
                debugError('View containers not found!');
                return;
            }
            
            if (this.viewMode === 'grid') {
                gridView.style.display = 'none';
                gridView.classList.add('view-hidden');
                gridView.classList.remove('view-active');
            } else {
                listView.style.display = 'none';
                listView.classList.remove('view-active');
            }
            
            this.viewMode = targetViewMode;
            this.saveViewMode();
            
            if (targetViewMode === 'list') {
                listView.style.display = 'grid';
                listView.classList.add('view-active');
            } else {
                gridView.style.display = 'grid';
                gridView.classList.remove('view-hidden');
                gridView.classList.add('view-active');
            }
            
            this.updateViewButtons(targetViewMode);
            
            setTimeout(() => {
                if (this.currentPageData && this.currentPageData.length > 0) {
                    this.renderResults(this.currentPageData);
                }
            }, 50);
            
        } catch (error) {
            debugError('Error during view switch:', error);
        } finally {
            this.isViewChanging = false;
        }
    }

    updateViewButtons(activeViewMode) {
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
        
        this.paginationManager.setTotalItems(data.length);
        
        const totalCountElement = document.getElementById('totalCount');
        if (totalCountElement) {
            totalCountElement.textContent = data.length;
        }
        
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = data.length === 0 ? 'block' : 'none';
        }

        if (this.filterPopupManager) {
            this.filterPopupManager.updateActiveFilters();
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
        if (this.isDestroyed) return;

        const gridContainer = document.getElementById('missingGrid');
        const listContainer = document.getElementById('missingList');
        
        if (!gridContainer || !listContainer) {
            debugError('Containers not found!');
            return;
        }
        
        if (data.length === 0) {
            gridContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">표시할 데이터가 없습니다.</p>';
            listContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">표시할 데이터가 없습니다.</p>';
            return;
        }

        if (typeof React !== 'undefined') {
            this.renderWithReact(data, gridContainer, listContainer);
        } else {
            debugWarn('React not available, showing fallback');
            this.showFallbackContent();
        }
    }

    renderWithReact(data, gridContainer, listContainer) {
        const handleUpClick = (cardId) => {
            if (this.isDestroyed) return;
            
            const button = document.querySelector(`[data-id="${cardId}"] .stat`);
            if (button && this.animations && !this.animations.isDestroyed) {
                this.animations.animateUpButton(button);
            }
            
            if (window.showNotification) {
                window.showNotification('UP을 눌렀습니다! 실종자 찾기에 도움이 됩니다.', 'success');
            }
        };

        ['grid', 'list'].forEach(key => {
            if (this.reactRoots.has(key)) {
                try {
                    this.reactRoots.get(key).unmount();
                } catch (e) {
                    debugWarn(`Error unmounting ${key} root:`, e);
                }
            }
        });

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
        } catch (error) {
            debugError('Grid rendering failed:', error);
            gridContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #e74c3c;">그리드 뷰를 불러올 수 없습니다.</p>';
        }

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
        } catch (error) {
            debugError('List rendering failed:', error);
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

    resetFilters() {
        if (this.isDestroyed) return;
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        
        this.searchManager.resetFilters();
        this.paginationManager.currentPage = 1;
        this.paginationManager.saveCurrentPage();
        
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

    restorePageState() {
        if (this.isDestroyed) return;
        
        try {
            // 저장된 검색어 복원
            const searchInput = document.getElementById('searchInput');
            if (searchInput && this.searchManager.filters.searchTerm) {
                searchInput.value = this.searchManager.filters.searchTerm;
            }
            
            // 뷰 모드 복원
            this.viewMode = this.loadViewMode();
            this.initializeViews();
            
            // 필터 상태 복원
            if (this.filterPopupManager) {
                this.filterPopupManager.updateActiveFilters();
            }
            
            // 페이지네이션 상태 복원
            const savedPage = this.paginationManager.loadCurrentPage();
            if (savedPage !== this.paginationManager.currentPage) {
                this.paginationManager.currentPage = savedPage;
                this.paginationManager.renderPagination();
            }
            
            debugLog('Page state restored successfully');
        } catch (error) {
            debugError('Failed to restore page state:', error);
        }
    }

    destroy() {
        this.isDestroyed = true;
        
        this.reactRoots.forEach(root => {
            try {
                root.unmount();
            } catch (e) {
                debugWarn('Error unmounting React root:', e);
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
    }
}

// 페이지 로드 시 자동 초기화
let missingSearchPage = null;

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

// 디버그 도구 (개발 모드에서만)
if (DEBUG_MODE && typeof window !== 'undefined') {
    window.missingSearchDebug = {
        get instance() { return missingSearchPage; },
        sampleData: sampleMissingData,
        
        checkViews: () => {
            const gridView = document.getElementById('missingGrid');
            const listView = document.getElementById('missingList');
            
            debugLog('=== 뷰 상태 ===');
            debugLog('Current view mode:', missingSearchPage?.viewMode);
            debugLog('Grid view display:', gridView ? window.getComputedStyle(gridView).display : 'Not found');
            debugLog('List view display:', listView ? window.getComputedStyle(listView).display : 'Not found');
            debugLog('Grid view classes:', gridView ? Array.from(gridView.classList) : 'Not found');
            debugLog('List view classes:', listView ? Array.from(listView.classList) : 'Not found');
        },
        
        forceListView: () => {
            if (missingSearchPage) {
                missingSearchPage.switchToView('list');
            }
        },
        
        forceGridView: () => {
            if (missingSearchPage) {
                missingSearchPage.switchToView('grid');
            }
        },
        
        reloadData: () => {
            if (missingSearchPage?.searchManager) {
                missingSearchPage.searchManager.applyFilters();
            }
        },
        
        reinitialize: () => {
            if (missingSearchPage) {
                missingSearchPage.destroy();
            }
            missingSearchPage = new MissingSearchPage();
        }
    };
}