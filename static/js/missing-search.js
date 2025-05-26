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
    }
];

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
                background: #3b82f6;
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

// 무한 스크롤 관리자
class InfiniteScroll {
    constructor(callback) {
        this.callback = callback;
        this.isLoading = false;
        this.hasMore = true;
        this.page = 1;
        this.init();
    }

    init() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.checkScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    checkScroll() {
        if (this.isLoading || !this.hasMore) return;

        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight - 1000) {
            this.loadMore();
        }
    }

    async loadMore() {
        if (this.isLoading) return;

        this.isLoading = true;
        this.showLoading();

        try {
            // 시뮬레이션된 API 호출
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 더 이상 로드할 데이터가 없다고 가정
            if (this.page >= 3) {
                this.hasMore = false;
            } else {
                this.page++;
                this.callback();
            }
        } catch (error) {
            console.error('Failed to load more data:', error);
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    showLoading() {
        const indicator = document.getElementById('loadingIndicator');
        if (indicator) {
            indicator.style.display = 'flex';
        }
    }

    hideLoading() {
        const indicator = document.getElementById('loadingIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
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
        this.animations = new SearchAnimations();
        this.floatingButtons = null;
        this.infiniteScroll = null;
        this.searchDebouncer = null;
        this.viewMode = 'grid';
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
        // 검색 관리자 콜백 등록
        this.searchManager.addCallback((data) => this.renderResults(data));
        
        // 검색 디바운서 설정
        this.searchDebouncer = new SearchDebouncer((value) => {
            this.searchManager.updateFilter('searchTerm', value);
        });
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        // 플로팅 버튼 초기화
        this.floatingButtons = new FloatingButtons();
        
        // 무한 스크롤 초기화
        this.infiniteScroll = new InfiniteScroll(() => {
            console.log('Loading more content...');
        });
        
        // 초기 렌더링
        this.renderResults(this.searchManager.filteredData);
        
        console.log('Missing search page initialized successfully');
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

        // 필터 변경
        const filters = ['sortSelect', 'regionSelect', 'ageSelect', 'periodSelect'];
        filters.forEach(filterId => {
            const element = document.getElementById(filterId);
            if (element) {
                element.addEventListener('change', (e) => {
                    const filterKey = filterId.replace('Select', '').replace('sort', 'sort');
                    this.searchManager.updateFilter(
                        filterKey === 'sort' ? 'sort' : filterKey,
                        e.target.value
                    );
                    this.animations.animateFilterChange();
                });
            }
        });

        // 뷰 토글
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-btn')) {
                const btn = e.target.closest('.view-btn');
                const viewMode = btn.dataset.view;
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
        const resetBtn = document.querySelector('.filter-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
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
        const totalCountElement = document.getElementById('totalCount');
        const noResults = document.getElementById('noResults');
        
        // 결과 카운트 업데이트
        if (totalCountElement) {
            totalCountElement.textContent = data.length;
        }
        
        // 결과 없음 표시
        if (noResults) {
            noResults.style.display = data.length === 0 ? 'block' : 'none';
        }

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

        // 그리드 뷰 렌더링
        const gridRoot = ReactDOM.createRoot(gridContainer);
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

        // 리스트 뷰 렌더링
        if (listContainer) {
            const listRoot = ReactDOM.createRoot(listContainer);
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
        // 필요시 구현
    }

    toggleView(viewMode) {
        this.viewMode = viewMode;
        
        // 버튼 상태 업데이트
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewMode}"]`).classList.add('active');
        
        // 뷰 전환
        const gridView = document.getElementById('missingGrid');
        const listView = document.getElementById('missingList');
        
        if (viewMode === 'grid') {
            gridView.style.display = 'grid';
            listView.style.display = 'none';
        } else {
            gridView.style.display = 'none';
            listView.style.display = 'block';
        }
        
        // 애니메이션
        this.animations.animateViewToggle(viewMode);
        
        // React 리렌더링
        setTimeout(() => {
            this.renderResults(this.searchManager.filteredData);
        }, 50);
    }

    resetFilters() {
        // 폼 리셋
        const searchInput = document.getElementById('searchInput');
        const selects = document.querySelectorAll('#sortSelect, #regionSelect, #ageSelect, #periodSelect');
        
        if (searchInput) searchInput.value = '';
        selects.forEach(select => select.value = '');
        
        // 검색 관리자 리셋
        this.searchManager.resetFilters();
        
        // 애니메이션
        this.animations.animateFilterChange();
        
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
}

// 페이지 로드 시 자동 초기화
const missingSearchPage = new MissingSearchPage();

// 전역 함수 (하위 호환성을 위해)
window.performSearch = function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput && missingSearchPage.searchManager) {
        missingSearchPage.searchManager.updateFilter('searchTerm', searchInput.value.trim());
    }
};

window.applySorting = function() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect && missingSearchPage.searchManager) {
        missingSearchPage.searchManager.updateFilter('sort', sortSelect.value);
    }
};

window.applyFilters = function() {
    if (missingSearchPage.searchManager) {
        const filters = {
            region: document.getElementById('regionSelect')?.value || '',
            age: document.getElementById('ageSelect')?.value || '',
            period: document.getElementById('periodSelect')?.value || ''
        };
        
        Object.keys(filters).forEach(key => {
            missingSearchPage.searchManager.updateFilter(key, filters[key]);
        });
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
        }
    };
}