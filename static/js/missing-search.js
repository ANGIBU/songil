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
            top: document.querySelector('.missing-list').offsetTop - 100,
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

// 필터 팝업 관리자 클래스
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
        this.init();
    }

    init() {
        this.overlay = document.getElementById('filterPopupOverlay');
        this.modal = this.overlay?.querySelector('.filter-popup-modal');
        
        if (!this.overlay || !this.modal) return;

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
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.closePopup();
            }
        });

        // 필터 적용 버튼
        const applyBtn = document.getElementById('filterApplyBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyFilters());
        }

        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.closePopup();
            }
        });
    }

    openPopup() {
        this.loadCurrentFilters();
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closePopup() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    loadCurrentFilters() {
        const filters = this.searchManager.filters;
        
        // 정렬 라디오 버튼
        const sortRadio = document.querySelector(`input[name="sort"][value="${filters.sort}"]`);
        if (sortRadio) sortRadio.checked = true;

        // 지역 선택
        const regionSelect = document.getElementById('popupRegionSelect');
        if (regionSelect) regionSelect.value = filters.region;

        // 연령대 라디오 버튼
        const ageRadio = document.querySelector(`input[name="age"][value="${filters.age}"]`);
        if (ageRadio) ageRadio.checked = true;

        // 실종기간 라디오 버튼
        const periodRadio = document.querySelector(`input[name="period"][value="${filters.period}"]`);
        if (periodRadio) periodRadio.checked = true;
    }

    applyFilters() {
        // 정렬
        const sortValue = document.querySelector('input[name="sort"]:checked')?.value || 'danger';
        
        // 지역
        const regionValue = document.getElementById('popupRegionSelect')?.value || '';
        
        // 연령대
        const ageValue = document.querySelector('input[name="age"]:checked')?.value || '';
        
        // 실종기간
        const periodValue = document.querySelector('input[name="period"]:checked')?.value || '';

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
            region: {
                seoul: '서울특별시',
                busan: '부산광역시',
                daegu: '대구광역시',
                incheon: '인천광역시',
                gwangju: '광주광역시',
                daejeon: '대전광역시',
                ulsan: '울산광역시',
                gyeonggi: '경기도',
                gangwon: '강원도',
                chungbuk: '충청북도',
                chungnam: '충청남도',
                jeonbuk: '전라북도',
                jeonnam: '전라남도',
                gyeongbuk: '경상북도',
                gyeongnam: '경상남도',
                jeju: '제주특별자치도'
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
            if (value && value !== 'danger' && key !== 'searchTerm') { // 정렬의 기본값과 검색어 제외
                const label = filterLabels[key]?.[value] || value;
                this.createFilterTag(key, value, label, container);
            }
        });

        // 활성 필터가 있을 때만 컨테이너 표시
        if (container.children.length > 0) {
            container.style.display = 'flex';
        } else {
            container.style.display = 'none';
        }
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
                    React.createElement('p', { key: 'date' }, [
                        React.createElement('i', { className: 'fas fa-calendar' }),
                        ` ${formatDate(data.date)} 실종`
                    ]),
                    React.createElement('p', { key: 'location' }, [
                        React.createElement('i', { className: 'fas fa-map-marker-alt' }),
                        ` ${data.location}`
                    ]),
                    React.createElement('p', { key: 'physical' }, [
                        React.createElement('i', { className: 'fas fa-user' }),
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
                    React.createElement('i', { className: 'fas fa-arrow-up' }),
                    React.createElement('span', {}, upCount)
                ]),
                React.createElement('a', {
                    href: `/missing/${data.id}`,
                    className: 'detail-btn',
                    key: 'detail-btn'
                }, [
                    React.createElement('i', { className: 'fas fa-eye' }),
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
                React.createElement('p', { key: 'date' }, [
                    React.createElement('i', { className: 'fas fa-calendar' }),
                    ` ${formatDate(data.date)} 실종`
                ]),
                React.createElement('p', { key: 'location' }, [
                    React.createElement('i', { className: 'fas fa-map-marker-alt' }),
                    ` ${data.location}`
                ]),
                React.createElement('p', { key: 'physical' }, [
                    React.createElement('i', { className: 'fas fa-user' }),
                    ` ${data.physicalInfo}`
                ]),
                React.createElement('p', { key: 'description' }, [
                    React.createElement('i', { className: 'fas fa-tshirt' }),
                    ` ${data.description}`
                ])
            ]),
            React.createElement('div', { className: 'card-actions', key: 'actions' }, [
                React.createElement('button', {
                    className: 'up-btn',
                    onClick: handleUpClick,
                    key: 'up-btn'
                }, [
                    React.createElement('i', { className: 'fas fa-arrow-up' }),
                    React.createElement('span', {}, upCount)
                ]),
                React.createElement('a', {
                    href: `/missing/${data.id}`,
                    className: 'detail-btn',
                    key: 'detail-btn'
                }, [
                    React.createElement('i', { className: 'fas fa-eye' }),
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
            filtered = filtered.filter(item => item.region === this.filters.region);
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

// GSAP 애니메이션 관리자
class SearchAnimations {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded, skipping animations');
            return;
        }

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        this.setupAnimations();
        this.isInitialized = true;
    }

    setupAnimations() {
        // 헤더 애니메이션
        gsap.timeline({ delay: 0.3 })
            .from('.search-title h1', {
                duration: 0.8,
                y: 30,
                opacity: 0,
                ease: 'power2.out'
            })
            .from('.search-title p', {
                duration: 0.6,
                y: 20,
                opacity: 0,
                ease: 'power2.out'
            }, '-=0.4')
            .from('.search-controls', {
                duration: 0.8,
                y: 40,
                opacity: 0,
                ease: 'back.out(1.7)'
            }, '-=0.3');

        // 검색 결과 애니메이션
        this.animateSearchResults();
    }

    animateSearchResults() {
        if (!this.isInitialized) return;

        const cards = document.querySelectorAll('.missing-card, .list-item');
        if (cards.length === 0) return;

        gsap.from(cards, {
            duration: 0.6,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            ease: 'power2.out'
        });
    }

    animateFilterChange() {
        if (!this.isInitialized) return;

        const container = document.querySelector('.missing-grid, .missing-list-view');
        if (!container) return;

        gsap.fromTo(container, 
            { opacity: 0.3, y: 10 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.4, 
                ease: 'power2.out',
                onComplete: () => this.animateSearchResults()
            }
        );
    }

    animateUpButton(button) {
        if (!this.isInitialized) return;

        gsap.timeline()
            .to(button, {
                scale: 1.3,
                rotation: 15,
                duration: 0.15,
                ease: 'power2.out'
            })
            .to(button, {
                scale: 1,
                rotation: 0,
                duration: 0.25,
                ease: 'elastic.out(2, 0.3)'
            });

        // 파티클 효과
        this.createUpParticles(button);
    }

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
                background: #f97316;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${centerX}px;
                top: ${centerY}px;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (i / 6) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            
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
        }
    }

    animateViewToggle(viewMode) {
        if (!this.isInitialized) return;

        const container = document.querySelector('.missing-list');
        gsap.fromTo(container,
            { opacity: 0, scale: 0.95 },
            { 
                opacity: 1, 
                scale: 1, 
                duration: 0.4, 
                ease: 'power2.out',
                onComplete: () => this.animateSearchResults()
            }
        );
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
                ease: 'power2.out'
            });
            
            gsap.from(subBtns.children, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
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
        this.animations = new SearchAnimations();
        this.floatingButtons = null;
        this.searchDebouncer = null;
        this.viewMode = 'grid';
        this.currentPageData = [];
        this.reactRoots = new Map(); // React 루트 관리
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // 뷰 초기화 (가장 먼저 실행)
        this.initializeViews();
        
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
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        // 플로팅 버튼 초기화
        this.floatingButtons = new FloatingButtons();
        
        // 초기 렌더링
        this.handleDataChange(this.searchManager.filteredData);
        
        // 초기 활성 필터 업데이트
        this.filterPopupManager.updateActiveFilters();
        
        console.log('Missing search page initialized successfully');
    }

    // 뷰 초기화 강화 - 리스트 뷰 버그 완전 해결
    initializeViews() {
        const gridView = document.getElementById('missingGrid');
        const listView = document.getElementById('missingList');
        
        if (gridView && listView) {
            // 강제로 뷰 상태 초기화
            gridView.style.display = 'grid';
            gridView.style.opacity = '1';
            gridView.style.visibility = 'visible';
            
            // 리스트 뷰 완전히 숨김
            listView.style.display = 'none';
            listView.style.opacity = '0';
            listView.style.visibility = 'hidden';
            listView.classList.remove('active');
            
            // 뷰 버튼 상태 초기화
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const gridBtn = document.querySelector('[data-view="grid"]');
            if (gridBtn) {
                gridBtn.classList.add('active');
            }
            
            console.log('Views initialized - Grid: visible, List: hidden');
        }
    }

    setupEventListeners() {
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

        // 뷰 토글 - 개선된 로직
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-btn')) {
                const btn = e.target.closest('.view-btn');
                const viewMode = btn.dataset.view;
                
                // 현재 뷰와 같으면 무시
                if (viewMode === this.viewMode) return;
                
                console.log(`View toggle requested: ${this.viewMode} -> ${viewMode}`);
                this.toggleView(viewMode);
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

    handleDataChange(data) {
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
    }

    handlePaginationChange(paginationInfo) {
        const { startIndex, endIndex } = paginationInfo;
        this.currentPageData = this.searchManager.filteredData.slice(startIndex, endIndex);
        this.renderResults(this.currentPageData);
    }

    showSearchStatus(term) {
        const inputGroup = document.querySelector('.search-input-group');
        if (term.length > 0) {
            inputGroup.classList.add('searching');
        } else {
            inputGroup.classList.remove('searching');
        }
    }

    renderResults(data) {
        const gridContainer = document.getElementById('missingGrid');
        const listContainer = document.getElementById('missingList');
        
        if (data.length === 0) return;

        // React 렌더링
        if (typeof React !== 'undefined' && gridContainer) {
            this.renderWithReact(data, gridContainer, listContainer);
        } else {
            console.warn('React not available, falling back to vanilla JS');
            this.renderWithVanilla(data);
        }

        // 애니메이션 트리거
        setTimeout(() => {
            this.animations.animateSearchResults();
        }, 100);
    }

    renderWithReact(data, gridContainer, listContainer) {
        const handleUpClick = (cardId) => {
            console.log(`UP clicked for card ${cardId}`);
            
            const button = document.querySelector(`[data-id="${cardId}"] .up-btn`);
            if (button) {
                this.animations.animateUpButton(button);
            }
            
            if (window.showNotification) {
                window.showNotification('UP을 눌렀습니다! 실종자 찾기에 도움이 됩니다.', 'success');
            }
        };

        // 기존 React 루트 정리
        if (this.reactRoots.has('grid')) {
            this.reactRoots.get('grid').unmount();
        }
        if (this.reactRoots.has('list')) {
            this.reactRoots.get('list').unmount();
        }

        // 그리드 뷰 렌더링
        if (gridContainer) {
            gridContainer.innerHTML = '';
            const gridRoot = ReactDOM.createRoot(gridContainer);
            this.reactRoots.set('grid', gridRoot);
            
            gridRoot.render(
                React.createElement('div', { style: { display: 'contents' } },
                    data.map(item =>
                        React.createElement(MissingCard, {
                            key: item.id,
                            data: item,
                            onUpClick: handleUpClick,
                            viewMode: 'grid'
                        })
                    )
                )
            );
        }

        // 리스트 뷰 렌더링
        if (listContainer) {
            listContainer.innerHTML = '';
            const listRoot = ReactDOM.createRoot(listContainer);
            this.reactRoots.set('list', listRoot);
            
            listRoot.render(
                React.createElement('div', { style: { display: 'contents' } },
                    data.map(item =>
                        React.createElement(MissingCard, {
                            key: item.id,
                            data: item,
                            onUpClick: handleUpClick,
                            viewMode: 'list'
                        })
                    )
                )
            );
        }
    }

    renderWithVanilla(data) {
        // 폴백 렌더링 (React 없이)
        console.log('Rendering with vanilla JS:', data.length, 'items');
    }

    // 뷰 전환 로직 개선 - 리스트 뷰 버그 완전 해결
    toggleView(viewMode) {
        console.log(`Toggling view from ${this.viewMode} to ${viewMode}`);
        
        this.viewMode = viewMode;
        
        // 버튼 상태 업데이트
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-view="${viewMode}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // 뷰 전환
        const gridView = document.getElementById('missingGrid');
        const listView = document.getElementById('missingList');
        
        if (!gridView || !listView) {
            console.error('View containers not found');
            return;
        }
        
        if (viewMode === 'grid') {
            // 그리드 뷰 활성화
            gridView.style.display = 'grid';
            gridView.style.opacity = '1';
            gridView.style.visibility = 'visible';
            
            // 리스트 뷰 완전히 비활성화
            listView.style.display = 'none';
            listView.style.opacity = '0';
            listView.style.visibility = 'hidden';
            listView.classList.remove('active');
            
            console.log('Switched to grid view');
        } else {
            // 리스트 뷰 활성화
            listView.style.display = 'block';
            listView.style.opacity = '1';
            listView.style.visibility = 'visible';
            listView.classList.add('active');
            
            // 그리드 뷰 비활성화
            gridView.style.display = 'none';
            gridView.style.opacity = '0';
            gridView.style.visibility = 'hidden';
            
            console.log('Switched to list view');
        }
        
        // 애니메이션
        this.animations.animateViewToggle(viewMode);
        
        // React 리렌더링 (약간의 지연 후)
        setTimeout(() => {
            this.renderResults(this.currentPageData);
        }, 50);
    }

    resetFilters() {
        // 폼 리셋
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        
        // 검색 관리자 리셋
        this.searchManager.resetFilters();
        
        // 페이지네이션 리셋
        this.paginationManager.currentPage = 1;
        
        // 애니메이션
        this.animations.animateFilterChange();
        
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
        // 반응형 조정
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }

    // 정리 함수
    destroy() {
        // React 루트 정리
        this.reactRoots.forEach(root => {
            try {
                root.unmount();
            } catch (e) {
                console.warn('Error unmounting React root:', e);
            }
        });
        this.reactRoots.clear();
        
        // 타이머 정리
        if (this.searchDebouncer) {
            this.searchDebouncer.cancel();
        }
    }
}

// 페이지 로드 시 자동 초기화
const missingSearchPage = new MissingSearchPage();

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    if (missingSearchPage) {
        missingSearchPage.destroy();
    }
});

// 전역 함수 (하위 호환성을 위해)
window.performSearch = function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput && missingSearchPage.searchManager) {
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
        missingSearchPage.toggleView(viewMode);
    }
};

window.handleUpClick = function(button, missingId) {
    const countSpan = button.querySelector('span');
    if (countSpan) {
        const currentCount = parseInt(countSpan.textContent);
        countSpan.textContent = currentCount + 1;
    }
    
    if (missingSearchPage.animations) {
        missingSearchPage.animations.animateUpButton(button);
    }
    
    if (window.showNotification) {
        window.showNotification('UP을 눌렀습니다! 실종자 찾기에 도움이 됩니다.', 'success');
    }
};

// 개발자 도구
if (typeof window !== 'undefined') {
    window.missingSearchDebug = {
        instance: missingSearchPage,
        sampleData: sampleMissingData,
        testSearch: (term) => {
            missingSearchPage.searchManager.updateFilter('searchTerm', term);
        },
        testPagination: () => {
            console.log('Current page:', missingSearchPage.paginationManager.currentPage);
            console.log('Total pages:', missingSearchPage.paginationManager.getTotalPages());
            console.log('Page data:', missingSearchPage.currentPageData);
        },
        testAnimations: () => {
            if (typeof gsap !== 'undefined') {
                gsap.to('.missing-card', {
                    duration: 0.5,
                    scale: 1.05,
                    stagger: 0.1,
                    yoyo: true,
                    repeat: 1
                });
            }
        },
        testViewToggle: (viewMode) => {
            missingSearchPage.toggleView(viewMode);
        }
    };
}