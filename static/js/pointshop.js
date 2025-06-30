// static/js/pointshop.js

<<<<<<< HEAD
// React 및 상태 관리
const { useState, useEffect, createElement } = React;

// 포인트샵 상태 관리
let pointShopState = {
    currentCategory: 'all',
    currentSort: 'popular',
    userPoints: 1250,
    selectedProduct: null,
    products: [],
    cart: [],
    wishlist: [],
    purchaseHistory: [],
    pointsHistory: [],
    isLoading: false,
    errors: {},
    filters: {
        priceRange: [0, 5000],
        availability: 'all'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initializePointShop();
=======
// 포인트샵 페이지 JavaScript
let currentCategory = 'all';
let userPoints = 1250;
let selectedProduct = null;

document.addEventListener('DOMContentLoaded', function() {
    initializePointShop();
    updateLimitedTimer();
>>>>>>> origin/gb
});

// 포인트샵 초기화
function initializePointShop() {
<<<<<<< HEAD
    loadInitialData();
    setupEventListeners();
    initializeAnimations();
    setupTimers();
    updateUI();
}

// 초기 데이터 로드
async function loadInitialData() {
    try {
        pointShopState.isLoading = true;
        updateLoadingState();
        
        // 사용자 포인트 로드
        await loadUserPoints();
        
        // 상품 목록 로드
        await loadProducts();
        
        // 포인트 내역 로드
        await loadPointsHistory();
        
        // 구매 내역 로드
        await loadPurchaseHistory();
        
    } catch (error) {
        handleError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
        pointShopState.isLoading = false;
        updateLoadingState();
        updateUI();
    }
}

// 사용자 포인트 로드
async function loadUserPoints() {
    try {
        const response = await fetch('/api/user/points');
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                pointShopState.userPoints = data.points || 1250;
            }
        }
    } catch (error) {
        // 기본값 사용
    }
}

// 상품 목록 로드
async function loadProducts() {
    try {
        const response = await fetch('/api/pointshop/products');
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                pointShopState.products = data.products;
            } else {
                pointShopState.products = getDefaultProducts();
            }
        } else {
            pointShopState.products = getDefaultProducts();
        }
    } catch (error) {
        pointShopState.products = getDefaultProducts();
    }
}

// 기본 상품 데이터
function getDefaultProducts() {
    return [
        {
            id: 1,
            name: '스타벅스 아메리카노',
            description: '따뜻한 아메리카노 기프티콘',
            price: 500,
            originalPrice: 5000,
            category: 'giftcard',
            image: '/static/images/placeholder.jpg',
            badge: '베스트',
            stock: 95,
            popularity: 1,
            isFeatured: true,
            isNew: false,
            isLimited: false
        },
        {
            id: 2,
            name: '럭키박스 골드',
            description: '최대 10,000원 상당의 랜덤 상품',
            price: 1000,
            expectedValue: 7500,
            category: 'randombox',
            image: '/static/images/placeholder.jpg',
            badge: '신규',
            stock: 50,
            popularity: 2,
            isFeatured: true,
            isNew: true,
            isLimited: false,
            probabilities: [
                { grade: '대박', percent: 15, color: 'gold' },
                { grade: '중박', percent: 35, color: 'silver' },
                { grade: '꽝', percent: 50, color: 'bronze' }
            ]
        },
        {
            id: 3,
            name: '이디야 아이스아메리카노',
            description: '시원한 아이스아메리카노 1잔',
            price: 300,
            originalPrice: 3000,
            category: 'giftcard',
            image: '/static/images/placeholder.jpg',
            stock: 120,
            popularity: 3,
            isFeatured: false,
            isNew: false,
            isLimited: false
        },
        {
            id: 4,
            name: '맥도날드 빅맥세트',
            description: '빅맥 + 감자튀김 + 음료',
            price: 800,
            originalPrice: 8500,
            category: 'giftcard',
            image: '/static/images/placeholder.jpg',
            stock: 75,
            popularity: 4,
            isFeatured: false,
            isNew: false,
            isLimited: false
        },
        {
            id: 5,
            name: 'CU 편의점 상품권',
            description: 'CU에서 사용 가능한 상품권',
            price: 1200,
            originalPrice: 15000,
            category: 'giftcard',
            image: '/static/images/placeholder.jpg',
            stock: 200,
            popularity: 5,
            isFeatured: false,
            isNew: false,
            isLimited: false
        },
        {
            id: 6,
            name: '럭키박스 실버',
            description: '최대 5,000원 상당의 랜덤 상품',
            price: 500,
            expectedValue: 3500,
            category: 'randombox',
            image: '/static/images/placeholder.jpg',
            badge: 'HOT',
            stock: 100,
            popularity: 6,
            isFeatured: false,
            isNew: false,
            isLimited: false,
            probabilities: [
                { grade: '대박', percent: 5, color: 'gold' },
                { grade: '중박', percent: 25, color: 'silver' },
                { grade: '꽝', percent: 70, color: 'bronze' }
            ]
        },
        {
            id: 7,
            name: '럭키박스 플래티넘',
            description: '최대 50,000원 상당의 랜덤 상품',
            price: 2000,
            expectedValue: 25000,
            category: 'randombox',
            image: '/static/images/placeholder.jpg',
            badge: '프리미엄',
            stock: 30,
            popularity: 7,
            isFeatured: false,
            isNew: false,
            isLimited: false,
            probabilities: [
                { grade: '잭팟', percent: 3, color: 'diamond' },
                { grade: '대박', percent: 20, color: 'gold' },
                { grade: '중박', percent: 77, color: 'silver' }
            ]
        },
        {
            id: 8,
            name: '애플 에어팟 3세대',
            description: '애플 정품 에어팟 (1주일 한정)',
            price: 5000,
            originalPrice: 249000,
            category: 'special',
            image: '/static/images/placeholder.jpg',
            badge: '한정',
            stock: 2,
            totalStock: 10,
            popularity: 8,
            isFeatured: false,
            isNew: false,
            isLimited: true,
            limitedEndTime: Date.now() + (5 * 24 * 60 * 60 * 1000) + (23 * 60 * 60 * 1000) + (45 * 60 * 1000) + (12 * 1000)
        },
        {
            id: 9,
            name: '치킨 브랜드 통합상품권',
            description: 'BBQ, 교촌, 네네 등에서 사용 가능',
            price: 3000,
            originalPrice: 25000,
            category: 'special',
            image: '/static/images/placeholder.jpg',
            stock: 50,
            popularity: 9,
            isFeatured: false,
            isNew: false,
            isLimited: false
        },
        {
            id: 10,
            name: 'CGV 영화 관람권',
            description: '일반 상영관 영화 1편 관람',
            price: 1500,
            originalPrice: 14000,
            category: 'giftcard',
            image: '/static/images/placeholder.jpg',
            stock: 80,
            popularity: 10,
            isFeatured: false,
            isNew: false,
            isLimited: false
        }
    ];
}

// 포인트 내역 로드
async function loadPointsHistory() {
    try {
        const response = await fetch('/api/user/points-history');
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                pointShopState.pointsHistory = data.history;
            } else {
                pointShopState.pointsHistory = getDefaultPointsHistory();
            }
        } else {
            pointShopState.pointsHistory = getDefaultPointsHistory();
        }
    } catch (error) {
        pointShopState.pointsHistory = getDefaultPointsHistory();
    }
}

// 기본 포인트 내역
function getDefaultPointsHistory() {
    return [
        {
            id: 1,
            type: 'earn',
            title: '목격 신고 승인',
            description: '김○○님 목격 신고 승인',
            points: 150,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 2,
            type: 'use',
            title: '스타벅스 아메리카노 구매',
            description: '포인트샵에서 구매',
            points: -500,
            timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 3,
            type: 'earn',
            title: '실종자 UP 버튼',
            description: '실종자 게시물 추천',
            points: 10,
            timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000 - 7 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 4,
            type: 'earn',
            title: '목격 신고 승인',
            description: '최○○님 목격 신고 승인',
            points: 300,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 1 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 5,
            type: 'earn',
            title: '회원가입 보너스',
            description: '플랫폼 가입 환영 보너스',
            points: 100,
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 12 * 60 * 60 * 1000).toISOString()
        }
    ];
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 카테고리 탭 이벤트 (이미 HTML에서 onclick으로 처리됨)
    
    // 정렬 선택 이벤트
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortChange);
    }
    
    // 상품 카드 호버 효과
    setupProductCardEvents();
    
    // 모달 외부 클릭시 닫기
    setupModalEvents();
    
    // 키보드 단축키
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // 검색 기능 (향후 확장용)
    setupSearchEvents();
}

// 상품 카드 이벤트 설정
function setupProductCardEvents() {
    document.addEventListener('click', function(e) {
        // 퀴ㄱ 구매 버튼
        if (e.target.closest('.quick-buy-btn')) {
            e.preventDefault();
            e.stopPropagation();
            const productId = getProductIdFromElement(e.target);
            if (productId) {
                quickBuy(productId);
            }
        }
        
        // 구매 버튼
        if (e.target.closest('.buy-btn')) {
            e.preventDefault();
            const productId = getProductIdFromElement(e.target);
            if (productId) {
                purchaseProduct(productId);
            }
        }
    });
    
    // 상품 카드 호버 효과
    document.addEventListener('mouseenter', function(e) {
        if (e.target.closest('.product-card')) {
            animateProductCardHover(e.target.closest('.product-card'), true);
        }
    }, true);
    
    document.addEventListener('mouseleave', function(e) {
        if (e.target.closest('.product-card')) {
            animateProductCardHover(e.target.closest('.product-card'), false);
        }
    }, true);
}

// 상품 ID 추출
function getProductIdFromElement(element) {
    const card = element.closest('.product-card');
    if (!card) return null;
    
    // data-product-id 속성이나 onclick 속성에서 ID 추출
    const dataId = card.dataset.productId;
    if (dataId) return parseInt(dataId);
    
    // 버튼의 onclick 속성에서 ID 추출
    const button = element.closest('[onclick]');
    if (button) {
        const onclick = button.getAttribute('onclick');
        const match = onclick.match(/purchaseProduct\((\d+)\)/);
        if (match) return parseInt(match[1]);
    }
    
    return null;
}

// 상품 카드 호버 애니메이션
function animateProductCardHover(card, isEnter) {
    if (typeof gsap === 'undefined') return;
    
    if (isEnter) {
        gsap.to(card, {
            duration: 0.3,
            y: -8,
            scale: 1.02,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            ease: 'power2.out'
        });
        
        const image = card.querySelector('.product-image img');
        if (image) {
            gsap.to(image, {
                duration: 0.5,
                scale: 1.1,
                ease: 'power2.out'
            });
        }
    } else {
        gsap.to(card, {
            duration: 0.3,
            y: 0,
            scale: 1,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            ease: 'power2.out'
        });
        
        const image = card.querySelector('.product-image img');
        if (image) {
            gsap.to(image, {
                duration: 0.5,
                scale: 1,
                ease: 'power2.out'
            });
        }
    }
}

// 모달 이벤트 설정
function setupModalEvents() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('purchase-modal') || 
            e.target.classList.contains('points-history-modal') || 
            e.target.classList.contains('success-modal')) {
            e.target.style.display = 'none';
        }
        
        if (e.target.classList.contains('close-modal')) {
            const modal = e.target.closest('.purchase-modal, .points-history-modal, .success-modal');
            if (modal) {
                modal.style.display = 'none';
            }
        }
    });
}

// 검색 이벤트 설정
function setupSearchEvents() {
    // 향후 검색 기능 구현시 사용
}

// 키보드 단축키 처리
function handleKeyboardShortcuts(event) {
    // ESC: 모든 모달 닫기
    if (event.key === 'Escape') {
        closeAllModals();
    }
    
    // Ctrl + P: 포인트 내역 보기
    if (event.ctrlKey && event.key === 'p') {
        event.preventDefault();
        showPointsHistory();
    }
    
    // 숫자키 1-4: 카테고리 전환
    if (event.key >= '1' && event.key <= '4' && !event.ctrlKey && !event.altKey) {
        const categories = ['all', 'giftcard', 'randombox', 'special'];
        const categoryIndex = parseInt(event.key) - 1;
        if (categories[categoryIndex]) {
            switchCategory(categories[categoryIndex]);
        }
    }
}

// 정렬 변경 처리
function handleSortChange(event) {
    pointShopState.currentSort = event.target.value;
    sortProducts();
}

// 애니메이션 초기화
function initializeAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // 페이지 로드 애니메이션
    const tl = gsap.timeline();
    
    tl.from('.pointshop-header', {
        duration: 0.8,
        y: -50,
        opacity: 0,
        ease: 'power2.out'
    })
    .from('.user-points-card', {
        duration: 0.6,
        scale: 0.9,
        opacity: 0,
        ease: 'back.out(1.7)'
    }, '-=0.4')
    .from('.category-tabs .tab-btn', {
        duration: 0.4,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out'
    }, '-=0.2')
    .from('.product-card', {
        duration: 0.5,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out'
    }, '-=0.1');
    
    // 스크롤 트리거 설정
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // 상품 카드 스크롤 애니메이션
        gsap.utils.toArray('.product-card').forEach(card => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.6,
                y: 50,
                opacity: 0,
                ease: 'power2.out'
            });
=======
    // 페이지 로드 애니메이션
    if (typeof gsap !== 'undefined') {
        gsap.from('.pointshop-header', {
            duration: 0.8,
            y: -30,
            opacity: 0,
            ease: 'power2.out'
        });
        
        gsap.from('.user-points-card', {
            duration: 0.6,
            scale: 0.9,
            opacity: 0,
            delay: 0.2,
            ease: 'power2.out'
        });
        
        gsap.from('.product-card', {
            duration: 0.5,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            delay: 0.4,
            ease: 'power2.out'
>>>>>>> origin/gb
        });
    }
}

<<<<<<< HEAD
// 타이머 설정
function setupTimers() {
    // 한정 상품 타이머 업데이트
    updateLimitedTimers();
    setInterval(updateLimitedTimers, 1000);
}

// 한정 상품 타이머 업데이트 (전역 함수로 유지)
function updateLimitedTimer() {
    updateLimitedTimers();
}

// 한정 상품 타이머들 업데이트
function updateLimitedTimers() {
    const timerElements = document.querySelectorAll('[id*="Timer"], .limited-time span');
    
    timerElements.forEach(element => {
        const product = pointShopState.products.find(p => p.isLimited);
        if (!product || !product.limitedEndTime) return;
        
        const timeLeft = Math.max(0, Math.floor((product.limitedEndTime - Date.now()) / 1000));
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (24 * 60 * 60));
            const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
            const seconds = timeLeft % 60;
            
            element.textContent = `${days}일 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} 남음`;
        } else {
            element.textContent = '판매 종료';
            element.style.color = '#ef4444';
        }
    });
}

// UI 업데이트
function updateUI() {
    updateUserPointsDisplay();
    updateProductGrid();
    updateCategoryTabs();
}

// 사용자 포인트 표시 업데이트
function updateUserPointsDisplay() {
    const pointElements = document.querySelectorAll('.points-amount, #userPoints');
    pointElements.forEach(el => {
        if (el) {
            const currentPoints = parseInt(el.textContent.replace(/[^\d]/g, '')) || 0;
            animateNumber(el, currentPoints, pointShopState.userPoints);
        }
    });
}

// 상품 그리드 업데이트
function updateProductGrid() {
    const filteredProducts = getFilteredProducts();
    const sortedProducts = getSortedProducts(filteredProducts);
    
    // 실제로는 동적으로 상품 카드를 생성하지만, 
    // 현재는 HTML에 이미 있는 카드들의 표시/숨김만 처리
    updateProductVisibility(sortedProducts);
}

// 필터링된 상품 목록
function getFilteredProducts() {
    return pointShopState.products.filter(product => {
        // 카테고리 필터
        if (pointShopState.currentCategory !== 'all' && product.category !== pointShopState.currentCategory) {
            return false;
        }
        
        // 가격 필터
        if (product.price < pointShopState.filters.priceRange[0] || 
            product.price > pointShopState.filters.priceRange[1]) {
            return false;
        }
        
        // 재고 필터
        if (pointShopState.filters.availability === 'in-stock' && product.stock <= 0) {
            return false;
        }
        
        return true;
    });
}

// 정렬된 상품 목록
function getSortedProducts(products) {
    const sorted = [...products];
    
    switch (pointShopState.currentSort) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'new':
            sorted.sort((a, b) => {
                if (a.isNew && !b.isNew) return -1;
                if (!a.isNew && b.isNew) return 1;
                return a.popularity - b.popularity;
            });
            break;
        case 'popular':
        default:
            sorted.sort((a, b) => a.popularity - b.popularity);
            break;
    }
    
    return sorted;
}

// 상품 표시/숨김 업데이트
function updateProductVisibility(sortedProducts) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const category = card.dataset.category;
        if (pointShopState.currentCategory === 'all' || category === pointShopState.currentCategory) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 카테고리 탭 업데이트
function updateCategoryTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-category="${pointShopState.currentCategory}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// 로딩 상태 업데이트
function updateLoadingState() {
    const loadingElements = document.querySelectorAll('.loading-overlay');
    loadingElements.forEach(el => {
        el.style.display = pointShopState.isLoading ? 'flex' : 'none';
    });
}

// 카테고리 전환 (전역 함수로 유지)
function switchCategory(category) {
    pointShopState.currentCategory = category;
    updateCategoryTabs();
    updateProductGrid();
=======
// 카테고리 전환
function switchCategory(category) {
    currentCategory = category;
    
    // 탭 버튼 업데이트
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // 상품 필터링
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
>>>>>>> origin/gb
    
    // 애니메이션 효과
    if (typeof gsap !== 'undefined') {
        const visibleProducts = document.querySelectorAll('.product-card[style*="block"], .product-card:not([style*="none"])');
        gsap.from(visibleProducts, {
            duration: 0.4,
            y: 20,
            opacity: 0,
            stagger: 0.05,
            ease: 'power2.out'
        });
    }
}

<<<<<<< HEAD
// 상품 정렬 (전역 함수로 유지)
function sortProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const products = Array.from(productsGrid.children);
    
    products.sort((a, b) => {
        const priceA = parseInt(a.dataset.price) || 0;
        const priceB = parseInt(b.dataset.price) || 0;
        
        switch(pointShopState.currentSort) {
=======
// 상품 정렬
function sortProducts() {
    const sortValue = document.getElementById('sortSelect').value;
    const productsGrid = document.getElementById('productsGrid');
    const products = Array.from(productsGrid.children);
    
    products.sort((a, b) => {
        const priceA = parseInt(a.dataset.price);
        const priceB = parseInt(b.dataset.price);
        
        switch(sortValue) {
>>>>>>> origin/gb
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'new':
<<<<<<< HEAD
                const newA = a.querySelector('.product-badge.new') ? 1 : 0;
                const newB = b.querySelector('.product-badge.new') ? 1 : 0;
                return newB - newA;
            case 'popular':
            default:
                const popularA = a.querySelector('.product-badge') ? 1 : 0;
                const popularB = b.querySelector('.product-badge') ? 1 : 0;
                return popularB - popularA;
=======
                return b.querySelector('.product-badge.new') ? 1 : -1;
            case 'popular':
            default:
                return b.querySelector('.product-badge') ? 1 : -1;
>>>>>>> origin/gb
        }
    });
    
    products.forEach(product => productsGrid.appendChild(product));
    
    // 정렬 애니메이션
    if (typeof gsap !== 'undefined') {
        gsap.from('.product-card', {
            duration: 0.4,
            y: 20,
            opacity: 0,
            stagger: 0.03,
            ease: 'power2.out'
        });
    }
}

<<<<<<< HEAD
// 빠른 구매 (전역 함수로 유지)
=======
// 빠른 구매
>>>>>>> origin/gb
function quickBuy(productId) {
    purchaseProduct(productId);
}

<<<<<<< HEAD
// 상품 구매 (전역 함수로 유지)
function purchaseProduct(productId) {
    const product = getProductData(productId);
    if (!product) {
        handleError('상품 정보를 찾을 수 없습니다.');
        return;
    }
    
    if (pointShopState.userPoints < product.price) {
        handleError('포인트가 부족합니다.');
        return;
    }
    
    if (product.stock <= 0) {
        handleError('재고가 부족합니다.');
        return;
    }
    
    pointShopState.selectedProduct = product;
    showPurchaseModal(product);
}

// 상품 데이터 가져오기 (전역 함수로 유지)
function getProductData(productId) {
    const product = pointShopState.products.find(p => p.id === productId);
    if (product) return product;
    
    // 폴백: 기본 상품 데이터에서 찾기
=======
// 상품 구매
function purchaseProduct(productId) {
    // 상품 정보 가져오기 (실제로는 서버에서)
    const productData = getProductData(productId);
    
    if (userPoints < productData.price) {
        if (window.showNotification) {
            window.showNotification('포인트가 부족합니다.', 'error');
        }
        return;
    }
    
    selectedProduct = productData;
    showPurchaseModal(productData);
}

// 상품 데이터 가져오기 (더미 데이터)
function getProductData(productId) {
>>>>>>> origin/gb
    const products = {
        1: { id: 1, name: '스타벅스 아메리카노', price: 500, image: 'starbucks.jpg', description: '따뜻한 아메리카노 기프티콘' },
        2: { id: 2, name: '럭키박스 골드', price: 1000, image: 'lucky-gold.jpg', description: '최대 10,000원 상당의 랜덤 상품' },
        3: { id: 3, name: '이디야 아이스아메리카노', price: 300, image: 'ediya.jpg', description: '시원한 아이스아메리카노 1잔' },
        4: { id: 4, name: '맥도날드 빅맥세트', price: 800, image: 'mcdonalds.jpg', description: '빅맥 + 감자튀김 + 음료' },
        5: { id: 5, name: 'CU 편의점 상품권', price: 1200, image: 'cu.jpg', description: 'CU에서 사용 가능한 상품권' },
        6: { id: 6, name: '럭키박스 실버', price: 500, image: 'lucky-silver.jpg', description: '최대 5,000원 상당의 랜덤 상품' },
        7: { id: 7, name: '럭키박스 플래티넘', price: 2000, image: 'lucky-platinum.jpg', description: '최대 50,000원 상당의 랜덤 상품' },
        8: { id: 8, name: '애플 에어팟 3세대', price: 5000, image: 'airpods.jpg', description: '애플 정품 에어팟 (1주일 한정)' },
        9: { id: 9, name: '치킨 브랜드 통합상품권', price: 3000, image: 'chicken.jpg', description: 'BBQ, 교촌, 네네 등에서 사용 가능' },
        10: { id: 10, name: 'CGV 영화 관람권', price: 1500, image: 'cgv.jpg', description: '일반 상영관 영화 1편 관람' }
    };
    
    return products[productId];
}

<<<<<<< HEAD
// 구매 모달 표시 (전역 함수로 유지)
=======
// 구매 모달 표시
>>>>>>> origin/gb
function showPurchaseModal(product) {
    const modal = document.getElementById('purchaseModal');
    const productElement = document.getElementById('purchaseProduct');
    const productCost = document.getElementById('productCost');
    const remainingPoints = document.getElementById('remainingPoints');
    
<<<<<<< HEAD
    if (!modal || !productElement || !productCost || !remainingPoints) return;
    
=======
>>>>>>> origin/gb
    productElement.innerHTML = `
        <div class="modal-product">
            <img src="${window.location.origin}/static/images/placeholder.jpg" alt="${product.name}">
            <div class="modal-product-info">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
            </div>
        </div>
    `;
    
    productCost.textContent = product.price + 'P';
<<<<<<< HEAD
    remainingPoints.textContent = (pointShopState.userPoints - product.price) + 'P';
=======
    remainingPoints.textContent = (userPoints - product.price) + 'P';
>>>>>>> origin/gb
    
    modal.style.display = 'flex';
    
    // 모달 애니메이션
    if (typeof gsap !== 'undefined') {
        gsap.from('.modal-content', {
            duration: 0.3,
            scale: 0.8,
            opacity: 0,
            ease: 'power2.out'
        });
    }
}

<<<<<<< HEAD
// 구매 확인 (전역 함수로 유지)
async function confirmPurchase() {
    if (!pointShopState.selectedProduct) return;
    
    const confirmBtn = document.getElementById('confirmPurchaseBtn');
    if (!confirmBtn) return;
    
    const originalText = confirmBtn.innerHTML;
    
    // 로딩 상태
    setButtonLoading(confirmBtn, '구매 중...');
    
    try {
        // API 호출
        const response = await fetch('/api/pointshop/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: pointShopState.selectedProduct.id,
                price: pointShopState.selectedProduct.price
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                // 포인트 차감
                pointShopState.userPoints -= pointShopState.selectedProduct.price;
                updateUserPointsDisplay();
                
                // 구매 내역 추가
                pointShopState.purchaseHistory.unshift({
                    id: Date.now(),
                    product: pointShopState.selectedProduct,
                    points: pointShopState.selectedProduct.price,
                    timestamp: new Date().toISOString()
                });
                
                // 포인트 내역 추가
                pointShopState.pointsHistory.unshift({
                    id: Date.now(),
                    type: 'use',
                    title: `${pointShopState.selectedProduct.name} 구매`,
                    description: '포인트샵에서 구매',
                    points: -pointShopState.selectedProduct.price,
                    timestamp: new Date().toISOString()
                });
                
                // 재고 감소 (로컬 상태만)
                const product = pointShopState.products.find(p => p.id === pointShopState.selectedProduct.id);
                if (product) {
                    product.stock = Math.max(0, product.stock - 1);
                }
                
                closePurchaseModal();
                showSuccessModal(pointShopState.selectedProduct);
                
            } else {
                handleError(data.message || '구매 처리 중 오류가 발생했습니다.');
            }
        } else {
            handleError('서버 오류가 발생했습니다.');
        }
        
    } catch (error) {
        // 오프라인 시뮬레이션
        await simulateAPICall(1500);
        
        // 포인트 차감
        pointShopState.userPoints -= pointShopState.selectedProduct.price;
        updateUserPointsDisplay();
        
        // 구매 완료
        closePurchaseModal();
        showSuccessModal(pointShopState.selectedProduct);
        
    } finally {
        resetButtonLoading(confirmBtn, originalText);
    }
}

// 구매 성공 모달 표시 (전역 함수로 유지)
=======
// 구매 확인
async function confirmPurchase() {
    if (!selectedProduct) return;
    
    const confirmBtn = document.getElementById('confirmPurchaseBtn');
    const originalText = confirmBtn.innerHTML;
    
    // 로딩 상태
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 구매 중...';
    confirmBtn.disabled = true;
    
    try {
        // API 호출 시뮬레이션
        await simulateAPICall(1500);
        
        // 포인트 차감
        userPoints -= selectedProduct.price;
        document.getElementById('userPoints').textContent = userPoints.toLocaleString();
        
        // 구매 완료
        closePurchaseModal();
        showSuccessModal(selectedProduct);
        
    } catch (error) {
        if (window.showNotification) {
            window.showNotification('구매 중 오류가 발생했습니다.', 'error');
        }
    } finally {
        confirmBtn.innerHTML = originalText;
        confirmBtn.disabled = false;
    }
}

// 구매 성공 모달 표시
>>>>>>> origin/gb
function showSuccessModal(product) {
    const modal = document.getElementById('successModal');
    const productElement = document.getElementById('successProduct');
    const finalRemainingPoints = document.getElementById('finalRemainingPoints');
    
<<<<<<< HEAD
    if (!modal || !productElement || !finalRemainingPoints) return;
    
=======
>>>>>>> origin/gb
    productElement.innerHTML = `
        <div class="success-product-info">
            <img src="${window.location.origin}/static/images/placeholder.jpg" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="purchase-price">${product.price}P</div>
        </div>
    `;
    
<<<<<<< HEAD
    finalRemainingPoints.textContent = pointShopState.userPoints.toLocaleString() + 'P';
=======
    finalRemainingPoints.textContent = userPoints.toLocaleString() + 'P';
>>>>>>> origin/gb
    
    modal.style.display = 'flex';
    
    // 성공 애니메이션
    if (typeof gsap !== 'undefined') {
        gsap.from('.modal-content', {
            duration: 0.5,
            scale: 0.8,
            opacity: 0,
            ease: 'back.out(1.7)'
        });
        
        gsap.from('.success-icon', {
            duration: 0.8,
            scale: 0,
            rotation: 180,
            delay: 0.3,
            ease: 'back.out(1.7)'
        });
    }
}

<<<<<<< HEAD
// 포인트 내역 표시 (전역 함수로 유지)
function showPointsHistory() {
    const modal = document.getElementById('pointsHistoryModal');
    if (!modal) return;
    
    updatePointsHistoryList();
    modal.style.display = 'flex';
=======
// 포인트 내역 표시
function showPointsHistory() {
    document.getElementById('pointsHistoryModal').style.display = 'flex';
>>>>>>> origin/gb
    
    if (typeof gsap !== 'undefined') {
        gsap.from('.modal-content', {
            duration: 0.3,
            y: -30,
            opacity: 0,
            ease: 'power2.out'
        });
    }
}

// 포인트 내역 리스트 업데이트
function updatePointsHistoryList() {
    const listContainer = document.querySelector('.points-history-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = pointShopState.pointsHistory.map(item => `
        <div class="history-item ${item.type}">
            <div class="history-info">
                <div class="history-title">${item.title}</div>
                <div class="history-date">${formatDateTime(item.timestamp)}</div>
            </div>
            <div class="history-points ${item.points > 0 ? 'positive' : 'negative'}">
                ${item.points > 0 ? '+' : ''}${item.points}P
            </div>
        </div>
    `).join('');
}

// 더 많은 상품 로드 (전역 함수로 유지)
// 한정 상품 타이머 업데이트
function updateLimitedTimer() {
    const timerElement = document.getElementById('limitedTimer');
    if (!timerElement) return;
    
    let timeLeft = 5 * 24 * 60 * 60 + 23 * 60 * 60 + 45 * 60 + 12; // 5일 23시간 45분 12초
    
    const timer = setInterval(() => {
        const days = Math.floor(timeLeft / (24 * 60 * 60));
        const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
        const seconds = timeLeft % 60;
        
        timerElement.textContent = `${days}일 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} 남음`;
        
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(timer);
            timerElement.textContent = '판매 종료';
        }
    }, 1000);
}

// 더 많은 상품 로드
function loadMoreProducts() {
    const btn = event.target;
    const originalText = btn.innerHTML;
    
<<<<<<< HEAD
    setButtonLoading(btn, '로딩 중...');
=======
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로딩 중...';
    btn.disabled = true;
>>>>>>> origin/gb
    
    setTimeout(() => {
        // 더미 상품 추가
        const productsGrid = document.getElementById('productsGrid');
<<<<<<< HEAD
        if (!productsGrid) return;
=======
>>>>>>> origin/gb
        
        for (let i = 0; i < 6; i++) {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute('data-category', 'giftcard');
            productCard.setAttribute('data-price', '600');
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${window.location.origin}/static/images/placeholder.jpg" alt="추가 상품">
                </div>
                <div class="product-info">
                    <h3>추가 상품 ${i + 1}</h3>
                    <p class="product-description">새로 추가된 상품입니다</p>
                    <div class="product-price">
                        <span class="points">600P</span>
                        <span class="original-price">₩6,000</span>
                    </div>
                    <button class="buy-btn" onclick="purchaseProduct(${i + 11})">구매하기</button>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        }
        
        // 애니메이션 효과
        if (typeof gsap !== 'undefined') {
            const newProducts = productsGrid.querySelectorAll('.product-card:nth-last-child(-n+6)');
            gsap.from(newProducts, {
                duration: 0.5,
                y: 30,
                opacity: 0,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }
        
<<<<<<< HEAD
        resetButtonLoading(btn, originalText);
        showSuccess('새로운 상품이 추가되었습니다!');
        
    }, 1000);
}

// 모달 닫기 함수들 (전역 함수로 유지)
function closePurchaseModal() {
    const modal = document.getElementById('purchaseModal');
    if (modal) {
        modal.style.display = 'none';
    }
    pointShopState.selectedProduct = null;
}

function closePointsHistoryModal() {
    const modal = document.getElementById('pointsHistoryModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 모든 모달 닫기
function closeAllModals() {
    closePurchaseModal();
    closePointsHistoryModal();
    closeSuccessModal();
}

// 유틸리티 함수들

// 숫자 애니메이션
function animateNumber(element, from, to, duration = 1000) {
    if (typeof gsap !== 'undefined') {
        const obj = { value: from };
        gsap.to(obj, {
            duration: duration / 1000,
            value: to,
            ease: 'power2.out',
            onUpdate: function() {
                element.textContent = Math.floor(obj.value).toLocaleString();
            }
        });
    } else {
        element.textContent = to.toLocaleString();
    }
}

// 버튼 로딩 상태 설정
function setButtonLoading(button, text) {
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
}

// 버튼 로딩 상태 해제
function resetButtonLoading(button, originalText) {
    button.disabled = false;
    button.innerHTML = originalText;
}

// API 호출 시뮬레이션
=======
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        if (window.showNotification) {
            window.showNotification('새로운 상품이 추가되었습니다!', 'success');
        }
    }, 1000);
}

// 모달 닫기 함수들
function closePurchaseModal() {
    document.getElementById('purchaseModal').style.display = 'none';
    selectedProduct = null;
}

function closePointsHistoryModal() {
    document.getElementById('pointsHistoryModal').style.display = 'none';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

// 모달 외부 클릭시 닫기
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.purchase-modal, .points-history-modal, .success-modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
});

// 유틸리티 함수
>>>>>>> origin/gb
function simulateAPICall(delay = 1000) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
<<<<<<< HEAD
}

// 날짜 시간 포맷팅
function formatDateTime(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}.${month}.${day} ${hours}:${minutes}`;
}

// 성공 메시지 표시
function showSuccess(message) {
    if (window.showNotification) {
        window.showNotification(message, 'success');
    }
}

// 정보 메시지 표시
function showInfo(message) {
    if (window.showNotification) {
        window.showNotification(message, 'info');
    }
}

// 에러 처리
function handleError(message) {
    if (window.showNotification) {
        window.showNotification(message, 'error');
    }
}

// React 컴포넌트 예시 (향후 확장용)
function createPointShopComponent() {
    if (typeof React === 'undefined') return null;
    
    const PointShopComponent = React.createElement('div', {
        className: 'react-pointshop-component',
        style: { padding: '20px', background: '#f9fafb', borderRadius: '8px' }
    }, [
        React.createElement('h3', { key: 'title' }, '포인트샵 정보'),
        React.createElement('p', { key: 'points' }, `보유 포인트: ${pointShopState.userPoints.toLocaleString()}P`),
        React.createElement('p', { key: 'products' }, `상품 수: ${pointShopState.products.length}개`)
    ]);
    
    return PointShopComponent;
}

// 전역 함수로 내보내기
window.switchCategory = switchCategory;
window.sortProducts = sortProducts;
window.quickBuy = quickBuy;
window.purchaseProduct = purchaseProduct;
window.getProductData = getProductData;
window.showPurchaseModal = showPurchaseModal;
window.confirmPurchase = confirmPurchase;
window.showSuccessModal = showSuccessModal;
window.showPointsHistory = showPointsHistory;
window.updateLimitedTimer = updateLimitedTimer;
window.loadMoreProducts = loadMoreProducts;
window.closePurchaseModal = closePurchaseModal;
window.closePointsHistoryModal = closePointsHistoryModal;
window.closeSuccessModal = closeSuccessModal;
=======
}
>>>>>>> origin/gb
