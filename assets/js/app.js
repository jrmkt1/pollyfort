// Pollyfort Website JavaScript
class PollyfortApp {
    constructor() {
        this.products = [];
        this.categories = [];
        this.cart = JSON.parse(localStorage.getItem('pollyfort_cart') || '[]');
        this.favorites = JSON.parse(localStorage.getItem('pollyfort_favorites') || '[]');
        this.recentlyViewed = JSON.parse(localStorage.getItem('pollyfort_recently_viewed') || '[]');
        this.currentSection = 'home';
        this.currentViewMode = 'grid';
        this.isAdminLoggedIn = localStorage.getItem('pollyfort_admin_logged_in') === 'true';
        
        this.init();
    }

    async init() {
        this.initializeIcons();
        this.setupEventListeners();
        this.showSection('home');
        await this.loadProducts();
        await this.loadCategories();
        this.updateCartDisplay();
        this.updateFavoritesDisplay();
        this.updateRecentlyViewedDisplay();
        
        // Check admin login status
        if (this.isAdminLoggedIn) {
            this.showAdminPanel();
        }
    }

    initializeIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('nav a, .sidebar a, footer a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('href').replace('#', '');
                this.showSection(section);
            });
        });

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Cart
        const cartBtn = document.getElementById('cart-btn');
        const cartSidebar = document.getElementById('cart-sidebar');
        const closeCart = document.getElementById('close-cart');
        
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                cartSidebar.classList.remove('translate-x-full');
            });
        }
        
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                cartSidebar.classList.add('translate-x-full');
            });
        }

        // Quote buttons
        document.getElementById('quote-btn')?.addEventListener('click', () => {
            this.showQuoteModal();
        });

        document.getElementById('cart-request-quote')?.addEventListener('click', () => {
            this.showQuoteModal(this.cart);
        });

        // Modals
        this.setupModalListeners();

        // Product filters
        this.setupProductFilters();

        // Admin
        this.setupAdminListeners();

        // Contact form
        this.setupContactForm();
    }

    setupModalListeners() {
        // Product modal
        const productModal = document.getElementById('product-modal');
        const closeProductModal = document.getElementById('close-product-modal');
        
        if (closeProductModal) {
            closeProductModal.addEventListener('click', () => {
                productModal.classList.add('hidden');
            });
        }

        // Quote modal
        const quoteModal = document.getElementById('quote-modal');
        const closeQuoteModal = document.getElementById('close-quote-modal');
        
        if (closeQuoteModal) {
            closeQuoteModal.addEventListener('click', () => {
                quoteModal.classList.add('hidden');
            });
        }

        // Quote form
        const quoteForm = document.getElementById('quote-form');
        if (quoteForm) {
            quoteForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleQuoteSubmission(new FormData(quoteForm));
            });
        }

        // WhatsApp modal
        const whatsappModal = document.getElementById('whatsapp-modal');
        const closeWhatsappModal = document.getElementById('close-whatsapp-modal');
        
        if (closeWhatsappModal) {
            closeWhatsappModal.addEventListener('click', () => {
                whatsappModal.classList.add('hidden');
            });
        }

        // Close modals on backdrop click
        [productModal, quoteModal, whatsappModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.add('hidden');
                    }
                });
            }
        });
    }

    setupProductFilters() {
        const categoryFilter = document.getElementById('category-filter');
        const sortFilter = document.getElementById('sort-filter');
        const gridView = document.getElementById('grid-view');
        const listView = document.getElementById('list-view');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.filterProducts();
            });
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', () => {
                this.filterProducts();
            });
        }

        if (gridView) {
            gridView.addEventListener('click', () => {
                this.setViewMode('grid');
            });
        }

        if (listView) {
            listView.addEventListener('click', () => {
                this.setViewMode('list');
            });
        }
    }

    setupAdminListeners() {
        // Admin login
        const adminLoginForm = document.getElementById('admin-login-form');
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAdminLogin(new FormData(adminLoginForm));
            });
        }

        // Admin tabs
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.showAdminTab(tabName);
            });
        });

        // Settings form
        const settingsForm = document.getElementById('settings-form');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSettingsUpdate(new FormData(settingsForm));
            });
        }
    }

    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmission(new FormData(contactForm));
            });
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }

        // Update navigation
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('text-polly-blue');
            if (link.getAttribute('href') === `#${sectionName}`) {
                link.classList.add('text-polly-blue');
            }
        });

        // Load section-specific content
        if (sectionName === 'products') {
            this.renderProducts();
        } else if (sectionName === 'admin' && this.isAdminLoggedIn) {
            this.loadAdminData();
        }
    }

    async loadProducts() {
        // Use sample data for preview demonstration
        this.products = this.getSampleProducts();
    }

    async loadCategories() {
        // Use sample data for preview demonstration
        this.categories = this.getSampleCategories();
        this.populateCategoryFilter();
    }

    getSampleProducts() {
        return [
            {
                id: 1,
                name: "Roda de Tração 230x70mm - Linha Pesada",
                description: "Roda de poliuretano de alta resistência para empilhadeiras de grande porte. Ideal para operações pesadas.",
                category: "Rodas de Tração",
                image: "assets/images/roda-tracao-230.jpg",
                specifications: "Diâmetro: 230mm, Largura: 70mm, Capacidade: 3000kg"
            },
            {
                id: 2,
                name: "Roda de Carga 180x50mm - Linha Standard",
                description: "Roda de poliuretano padrão para aplicações gerais em empilhadeiras de médio porte.",
                category: "Rodas de Carga",
                image: "assets/images/roda-carga-180.jpg",
                specifications: "Diâmetro: 180mm, Largura: 50mm, Capacidade: 2000kg"
            },
            {
                id: 3,
                name: "Roda Direcional 125x40mm - Linha Compacta",
                description: "Roda de poliuretano compacta para direção de empilhadeiras pequenas e médias.",
                category: "Rodas Direcionais",
                image: "assets/images/roda-direcional-125.jpg",
                specifications: "Diâmetro: 125mm, Largura: 40mm, Capacidade: 1500kg"
            }
        ];
    }

    getSampleCategories() {
        return [
            { name: "Rodas de Tração", count: 5 },
            { name: "Rodas de Carga", count: 8 },
            { name: "Rodas Direcionais", count: 4 }
        ];
    }

    populateCategoryFilter() {
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            // Clear existing options except the first one
            while (categoryFilter.children.length > 1) {
                categoryFilter.removeChild(categoryFilter.lastChild);
            }

            this.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.textContent = `${category.name} (${category.count})`;
                categoryFilter.appendChild(option);
            });
        }
    }

    renderProducts() {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) return;

        let filteredProducts = this.getFilteredProducts();

        if (this.currentViewMode === 'grid') {
            productsGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
            productsGrid.innerHTML = filteredProducts.map(product => this.createProductCard(product)).join('');
        } else {
            productsGrid.className = 'space-y-4';
            productsGrid.innerHTML = filteredProducts.map(product => this.createProductListItem(product)).join('');
        }

        this.initializeIcons();
    }

    getFilteredProducts() {
        let filtered = [...this.products];

        // Filter by category
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter && categoryFilter.value) {
            filtered = filtered.filter(product => product.category === categoryFilter.value);
        }

        // Filter by search
        const searchInput = document.getElementById('search-input');
        if (searchInput && searchInput.value.trim()) {
            const searchTerm = searchInput.value.toLowerCase().trim();
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }

        // Sort
        const sortFilter = document.getElementById('sort-filter');
        if (sortFilter && sortFilter.value) {
            switch (sortFilter.value) {
                case 'name-asc':
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-desc':
                    filtered.sort((a, b) => b.name.localeCompare(a.name));
                    break;
            }
        }

        return filtered;
    }

    createProductCard(product) {
        const isInCart = this.cart.some(item => item.id === product.id);
        const isFavorite = this.favorites.some(fav => fav.id === product.id);

        return `
            <div class="product-card bg-white rounded-lg shadow-sm border overflow-hidden">
                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='assets/images/placeholder.jpg'">
                <div class="p-4">
                    <span class="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-full mb-2">${product.category}</span>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">${product.name}</h3>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-2">${product.description}</p>
                    <div class="flex gap-2">
                        <button onclick="app.showProductModal(${product.id})" class="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                            Ver Detalhes
                        </button>
                        <button onclick="app.toggleFavorite(${product.id})" class="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-400'}">
                            <i data-lucide="heart" class="h-4 w-4"></i>
                        </button>
                        <button onclick="app.addToCart(${product.id})" class="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors ${isInCart ? 'text-green-500' : 'text-gray-400'}">
                            <i data-lucide="shopping-cart" class="h-4 w-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    createProductListItem(product) {
        const isInCart = this.cart.some(item => item.id === product.id);
        const isFavorite = this.favorites.some(fav => fav.id === product.id);

        return `
            <div class="product-list-view bg-white rounded-lg shadow-sm border p-4">
                <div class="flex items-center gap-4">
                    <img src="${product.image}" alt="${product.name}" class="w-20 h-20 object-cover rounded-lg flex-shrink-0" onerror="this.src='assets/images/placeholder.jpg'">
                    <div class="flex-1">
                        <span class="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-full mb-1">${product.category}</span>
                        <h3 class="text-lg font-semibold text-gray-900 mb-1">${product.name}</h3>
                        <p class="text-gray-600 text-sm">${product.description}</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="app.showProductModal(${product.id})" class="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                            Ver Detalhes
                        </button>
                        <button onclick="app.toggleFavorite(${product.id})" class="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-400'}">
                            <i data-lucide="heart" class="h-4 w-4"></i>
                        </button>
                        <button onclick="app.addToCart(${product.id})" class="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors ${isInCart ? 'text-green-500' : 'text-gray-400'}">
                            <i data-lucide="shopping-cart" class="h-4 w-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Add to recently viewed
        this.addToRecentlyViewed(product);

        const modal = document.getElementById('product-modal');
        document.getElementById('modal-product-title').textContent = product.name;
        document.getElementById('modal-product-description').textContent = product.description;
        document.getElementById('modal-product-category').textContent = product.category;
        document.getElementById('modal-product-image').src = product.image;
        document.getElementById('modal-product-image').alt = product.name;

        // Setup modal buttons
        document.getElementById('modal-add-to-cart').onclick = () => {
            this.addToCart(productId);
            modal.classList.add('hidden');
        };

        document.getElementById('modal-request-quote').onclick = () => {
            modal.classList.add('hidden');
            this.showQuoteModal([product]);
        };

        modal.classList.remove('hidden');
        this.initializeIcons();
    }

    setViewMode(mode) {
        this.currentViewMode = mode;
        
        document.getElementById('grid-view').classList.toggle('bg-blue-600', mode === 'grid');
        document.getElementById('grid-view').classList.toggle('text-white', mode === 'grid');
        document.getElementById('list-view').classList.toggle('bg-blue-600', mode === 'list');
        document.getElementById('list-view').classList.toggle('text-white', mode === 'list');

        this.renderProducts();
    }

    filterProducts() {
        this.renderProducts();
    }

    handleSearch(query) {
        if (this.currentSection === 'products') {
            this.renderProducts();
        }
    }

    addToCart(productId, quantity = 1) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({ ...product, quantity });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showToast('Produto adicionado ao carrinho', 'success');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
        this.showToast('Produto removido do carrinho', 'info');
    }

    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    saveCart() {
        localStorage.setItem('pollyfort_cart', JSON.stringify(this.cart));
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');

        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }

        if (cartItems) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = '<p class="text-gray-500 text-center py-8">Seu carrinho está vazio</p>';
            } else {
                cartItems.innerHTML = this.cart.map(item => this.createCartItem(item)).join('');
            }
        }

        this.initializeIcons();
    }

    createCartItem(item) {
        return `
            <div class="cart-item border-b border-gray-200 pb-4 mb-4">
                <div class="flex gap-3">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded" onerror="this.src='assets/images/placeholder.jpg'">
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-900">${item.name}</h4>
                        <p class="text-sm text-gray-500">${item.category}</p>
                        <div class="flex items-center gap-2 mt-2">
                            <button onclick="app.updateCartQuantity(${item.id}, ${item.quantity - 1})" class="p-1 border border-gray-300 rounded hover:bg-gray-50">
                                <i data-lucide="minus" class="h-3 w-3"></i>
                            </button>
                            <span class="px-2 py-1 border border-gray-300 rounded text-sm">${item.quantity}</span>
                            <button onclick="app.updateCartQuantity(${item.id}, ${item.quantity + 1})" class="p-1 border border-gray-300 rounded hover:bg-gray-50">
                                <i data-lucide="plus" class="h-3 w-3"></i>
                            </button>
                            <button onclick="app.removeFromCart(${item.id})" class="p-1 text-red-500 hover:bg-red-50 rounded ml-2">
                                <i data-lucide="trash-2" class="h-3 w-3"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    toggleFavorite(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingIndex = this.favorites.findIndex(fav => fav.id === productId);
        if (existingIndex > -1) {
            this.favorites.splice(existingIndex, 1);
            this.showToast('Produto removido dos favoritos', 'info');
        } else {
            this.favorites.push(product);
            this.showToast('Produto adicionado aos favoritos', 'success');
        }

        this.saveFavorites();
        this.updateFavoritesDisplay();
        this.renderProducts(); // Refresh to update heart icons
    }

    saveFavorites() {
        localStorage.setItem('pollyfort_favorites', JSON.stringify(this.favorites));
    }

    updateFavoritesDisplay() {
        const favoritesSection = document.getElementById('favorites-section');
        const favoritesGrid = document.getElementById('favorites-grid');

        if (this.favorites.length > 0) {
            favoritesSection.classList.remove('hidden');
            favoritesGrid.innerHTML = this.favorites.map(product => this.createProductCard(product)).join('');
        } else {
            favoritesSection.classList.add('hidden');
        }

        this.initializeIcons();
    }

    addToRecentlyViewed(product) {
        // Remove if already exists
        this.recentlyViewed = this.recentlyViewed.filter(item => item.id !== product.id);
        
        // Add to beginning
        this.recentlyViewed.unshift(product);
        
        // Keep only last 8 items
        this.recentlyViewed = this.recentlyViewed.slice(0, 8);
        
        localStorage.setItem('pollyfort_recently_viewed', JSON.stringify(this.recentlyViewed));
        this.updateRecentlyViewedDisplay();
    }

    updateRecentlyViewedDisplay() {
        const recentlyViewedSection = document.getElementById('recently-viewed-section');
        const recentlyViewedGrid = document.getElementById('recently-viewed-grid');

        if (this.recentlyViewed.length > 0) {
            recentlyViewedSection.classList.remove('hidden');
            recentlyViewedGrid.innerHTML = this.recentlyViewed.map(product => this.createProductCard(product)).join('');
        } else {
            recentlyViewedSection.classList.add('hidden');
        }

        this.initializeIcons();
    }

    showQuoteModal(items = null) {
        const modal = document.getElementById('quote-modal');
        const quoteItems = document.getElementById('quote-items');
        const quoteItemsList = document.getElementById('quote-items-list');

        if (items && items.length > 0) {
            quoteItems.classList.remove('hidden');
            quoteItemsList.innerHTML = items.map(item => `
                <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span class="font-medium">${item.name}</span>
                    ${item.quantity ? `<span class="text-gray-500">Qtd: ${item.quantity}</span>` : ''}
                </div>
            `).join('');
        } else {
            quoteItems.classList.add('hidden');
        }

        modal.classList.remove('hidden');
    }

    async handleQuoteSubmission(formData) {
        try {
            const response = await fetch('api/quotes.php', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                this.showToast('Orçamento enviado com sucesso!', 'success');
                document.getElementById('quote-modal').classList.add('hidden');
                document.getElementById('quote-form').reset();
            } else {
                throw new Error('Erro ao enviar orçamento');
            }
        } catch (error) {
            console.error('Quote submission error:', error);
            this.showToast('Erro ao enviar orçamento. Tente novamente.', 'error');
        }
    }

    async handleContactSubmission(formData) {
        try {
            const response = await fetch('api/contact.php', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                this.showToast('Mensagem enviada com sucesso!', 'success');
                document.getElementById('contact-form').reset();
            } else {
                throw new Error('Erro ao enviar mensagem');
            }
        } catch (error) {
            console.error('Contact submission error:', error);
            this.showToast('Erro ao enviar mensagem. Tente novamente.', 'error');
        }
    }

    handleAdminLogin(formData) {
        const username = formData.get('username');
        const password = formData.get('password');

        // Simple admin authentication (in production, use proper authentication)
        if (username === 'admin' && password === 'pollyfort2025') {
            this.isAdminLoggedIn = true;
            localStorage.setItem('pollyfort_admin_logged_in', 'true');
            this.showAdminPanel();
            this.showToast('Login realizado com sucesso!', 'success');
        } else {
            this.showToast('Credenciais inválidas', 'error');
        }
    }

    showAdminPanel() {
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
        this.loadAdminData();
    }

    loadAdminData() {
        // Update statistics
        document.getElementById('total-products').textContent = this.products.length;
        document.getElementById('total-categories').textContent = this.categories.length;
        document.getElementById('pending-quotes').textContent = '0'; // Would come from backend
        document.getElementById('visitors-today').textContent = '127'; // Would come from analytics

        // Load products for admin
        this.renderAdminProducts();
    }

    renderAdminProducts() {
        const adminProductsList = document.getElementById('admin-products-list');
        if (!adminProductsList) return;

        adminProductsList.innerHTML = `
            <div class="overflow-x-auto">
                <table class="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr class="bg-gray-50">
                            <th class="border border-gray-300 px-4 py-2 text-left">ID</th>
                            <th class="border border-gray-300 px-4 py-2 text-left">Nome</th>
                            <th class="border border-gray-300 px-4 py-2 text-left">Categoria</th>
                            <th class="border border-gray-300 px-4 py-2 text-left">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.products.map(product => `
                            <tr class="hover:bg-gray-50">
                                <td class="border border-gray-300 px-4 py-2">${product.id}</td>
                                <td class="border border-gray-300 px-4 py-2">${product.name}</td>
                                <td class="border border-gray-300 px-4 py-2">${product.category}</td>
                                <td class="border border-gray-300 px-4 py-2">
                                    <button onclick="app.editProduct(${product.id})" class="text-blue-600 hover:underline mr-2">Editar</button>
                                    <button onclick="app.deleteProduct(${product.id})" class="text-red-600 hover:underline">Excluir</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    showAdminTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.classList.remove('active', 'text-blue-600', 'border-blue-600');
            tab.classList.add('text-gray-500', 'border-transparent');
        });

        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active', 'text-blue-600', 'border-blue-600');

        // Update tab content
        document.querySelectorAll('.admin-tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        document.getElementById(`admin-${tabName}`).classList.remove('hidden');
    }

    handleSettingsUpdate(formData) {
        // In a real application, this would save to backend
        this.showToast('Configurações salvas com sucesso!', 'success');
    }

    editProduct(productId) {
        // Open product edit modal (would implement this)
        this.showToast('Funcionalidade de edição em desenvolvimento', 'info');
    }

    deleteProduct(productId) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            this.products = this.products.filter(p => p.id !== productId);
            this.renderAdminProducts();
            this.showToast('Produto excluído com sucesso!', 'success');
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} show`;
        
        toast.innerHTML = `
            <div class="toast-header">
                <span class="toast-title">${type === 'success' ? 'Sucesso' : type === 'error' ? 'Erro' : 'Info'}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i data-lucide="x" class="h-4 w-4"></i>
                </button>
            </div>
            <div class="toast-description">${message}</div>
        `;

        toastContainer.appendChild(toast);
        this.initializeIcons();

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }
}

// Utility functions
function scrollToSection(sectionName) {
    if (window.app) {
        window.app.showSection(sectionName);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PollyfortApp();
});