// static/js/pointshop.js

// 포인트샵 페이지 JavaScript
let currentCategory = 'all';
let userPoints = 1250;
let selectedProduct = null;

document.addEventListener('DOMContentLoaded', function() {
    initializePointShop();
    updateLimitedTimer();
});

// 포인트샵 초기화
function initializePointShop() {
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
        });
    }
}

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

// 상품 정렬
function sortProducts() {
    const sortValue = document.getElementById('sortSelect').value;
    const productsGrid = document.getElementById('productsGrid');
    const products = Array.from(productsGrid.children);
    
    products.sort((a, b) => {
        const priceA = parseInt(a.dataset.price);
        const priceB = parseInt(b.dataset.price);
        
        switch(sortValue) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'new':
                return b.querySelector('.product-badge.new') ? 1 : -1;
            case 'popular':
            default:
                return b.querySelector('.product-badge') ? 1 : -1;
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

// 빠른 구매
function quickBuy(productId) {
    purchaseProduct(productId);
}

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

// 구매 모달 표시
function showPurchaseModal(product) {
    const modal = document.getElementById('purchaseModal');
    const productElement = document.getElementById('purchaseProduct');
    const productCost = document.getElementById('productCost');
    const remainingPoints = document.getElementById('remainingPoints');
    
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
    remainingPoints.textContent = (userPoints - product.price) + 'P';
    
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
function showSuccessModal(product) {
    const modal = document.getElementById('successModal');
    const productElement = document.getElementById('successProduct');
    const finalRemainingPoints = document.getElementById('finalRemainingPoints');
    
    productElement.innerHTML = `
        <div class="success-product-info">
            <img src="${window.location.origin}/static/images/placeholder.jpg" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="purchase-price">${product.price}P</div>
        </div>
    `;
    
    finalRemainingPoints.textContent = userPoints.toLocaleString() + 'P';
    
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

// 포인트 내역 표시
function showPointsHistory() {
    document.getElementById('pointsHistoryModal').style.display = 'flex';
    
    if (typeof gsap !== 'undefined') {
        gsap.from('.modal-content', {
            duration: 0.3,
            y: -30,
            opacity: 0,
            ease: 'power2.out'
        });
    }
}

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
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로딩 중...';
    btn.disabled = true;
    
    setTimeout(() => {
        // 더미 상품 추가
        const productsGrid = document.getElementById('productsGrid');
        
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
function simulateAPICall(delay = 1000) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}