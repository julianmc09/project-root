class Products {
    constructor() {
        this.products = [];
        this.categories = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProducts();
    }

    setupEventListeners() {
        // Add product button
        document.getElementById('addProductBtn').addEventListener('click', () => {
            this.showProductModal();
        });

        // Product form submission
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProductSubmit();
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Category filter
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.handleCategoryFilter(e.target.value);
        });
    }

    async loadProducts() {
        try {
            this.products = await api.getProducts();
            this.extractCategories();
            this.displayProducts(this.products);
            this.displayFeaturedProducts();
            this.populateCategoryFilter();
        } catch (error) {
            console.error('Error loading products:', error);
            // For now, use mock data
            this.products = [
                {
                    id: 1,
                    name: 'Sample Product 1',
                    description: 'This is a sample product',
                    price: 29.99,
                    category: 'Electronics',
                    stock: 10
                },
                {
                    id: 2,
                    name: 'Sample Product 2',
                    description: 'Another sample product',
                    price: 49.99,
                    category: 'Clothing',
                    stock: 5
                }
            ];
            this.extractCategories();
            this.displayProducts(this.products);
            this.displayFeaturedProducts();
            this.populateCategoryFilter();
        }
    }

    extractCategories() {
        this.categories = [...new Set(this.products.map(product => product.category))];
    }

    populateCategoryFilter() {
        const select = document.getElementById('categoryFilter');
        select.innerHTML = '<option value="">All Categories</option>';
        
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            select.appendChild(option);
        });
    }

    displayProducts(products) {
        const grid = document.getElementById('productsGrid');
        grid.innerHTML = '';

        if (products.length === 0) {
            grid.innerHTML = '<p class="no-products">No products found.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = this.createProductCard(product);
            grid.appendChild(productCard);
        });
    }

    displayFeaturedProducts() {
        const featuredGrid = document.getElementById('featuredProducts');
        if (!featuredGrid) return;

        featuredGrid.innerHTML = '';
        
        // Show first 6 products as featured
        const featuredProducts = this.products.slice(0, 6);
        
        featuredProducts.forEach(product => {
            const productCard = this.createProductCard(product);
            featuredGrid.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
                    <img src="https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}" 
             alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button class="btn btn-primary buy-now" data-product-id="${product.id}">
                        Buy Now
                    </button>
                    <button class="btn btn-secondary edit-product" data-product-id="${product.id}">
                        Edit
                    </button>
                    <button class="btn btn-danger delete-product" data-product-id="${product.id}">
                        Delete
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        card.querySelector('.buy-now').addEventListener('click', () => {
            this.buyProduct(product);
        });

        card.querySelector('.edit-product').addEventListener('click', () => {
            this.editProduct(product);
        });

        card.querySelector('.delete-product').addEventListener('click', () => {
            this.deleteProduct(product.id);
        });

        return card;
    }

    async handleSearch(searchTerm) {
        if (searchTerm.length < 2) {
            this.displayProducts(this.products);
            return;
        }

        try {
            const searchResults = await api.searchProducts(searchTerm);
            this.displayProducts(searchResults);
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    async handleCategoryFilter(category) {
        if (!category) {
            this.displayProducts(this.products);
            return;
        }

        try {
            const categoryProducts = await api.getProductsByCategory(category);
            this.displayProducts(categoryProducts);
        } catch (error) {
            console.error('Category filter error:', error);
        }
    }

    buyProduct(product) {
        if (!auth.isUserAuthenticated()) {
            alert('Please login to purchase products');
            return;
        }

        const quantity = prompt(`How many ${product.name} would you like to buy? (Available: ${product.stock})`, '1');
        
        if (quantity && !isNaN(quantity) && quantity > 0 && quantity <= product.stock) {
            const userId = auth.getCurrentUser().id;
            purchases.createPurchase(product.id, parseInt(quantity), userId);
        } else if (quantity !== null) {
            alert('Please enter a valid quantity');
        }
    }

    showProductModal(product = null) {
        const modal = document.getElementById('productModal');
        const title = document.getElementById('productModalTitle');
        const form = document.getElementById('productForm');

        if (product) {
            // Edit mode
            title.textContent = 'Edit Product';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productStock').value = product.stock;
        } else {
            // Add mode
            title.textContent = 'Add New Product';
            form.reset();
            document.getElementById('productId').value = '';
        }

        modal.style.display = 'block';
    }

    async handleProductSubmit() {
        try {
            const formData = {
                name: document.getElementById('productName').value,
                description: document.getElementById('productDescription').value,
                price: parseFloat(document.getElementById('productPrice').value),
                category: document.getElementById('productCategory').value,
                stock: parseInt(document.getElementById('productStock').value)
            };

            const productId = document.getElementById('productId').value;

            if (productId) {
                // Update existing product
                const response = await api.updateProduct(productId, formData);
                console.log('Update response:', response);
                alert('Product updated successfully!');
                
                // Update the product in the local array
                const index = this.products.findIndex(p => p.id === parseInt(productId));
                if (index !== -1) {
                    this.products[index] = { ...this.products[index], ...formData };
                }
            } else {
                // Create new product
                const response = await api.createProduct(formData);
                console.log('Create response:', response);
                alert('Product created successfully!');
                
                // Add new product to local array with a temporary ID
                const newProduct = {
                    ...formData,
                    id: Date.now() // Temporary ID for mock data
                };
                this.products.push(newProduct);
            }

            this.closeProductModal();
            this.displayProducts(this.products);
            this.displayFeaturedProducts();
            this.extractCategories();
            this.populateCategoryFilter();
        } catch (error) {
            console.error('Save error:', error);
            alert('Error saving product: ' + error.message);
        }
    }

    editProduct(product) {
        this.showProductModal(product);
    }

    async deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await api.deleteProduct(productId);
                console.log('Delete response:', response);
                
                if (response && response.message) {
                    alert('Product deleted successfully!');
                    // Remove the product from the local array
                    this.products = this.products.filter(p => p.id !== productId);
                    this.displayProducts(this.products);
                    this.displayFeaturedProducts();
                } else {
                    alert('Product deleted successfully!');
                    this.loadProducts();
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('Error deleting product: ' + error.message);
            }
        }
    }

    closeProductModal() {
        document.getElementById('productModal').style.display = 'none';
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === parseInt(id));
    }
}

// Create global products instance
window.products = new Products();
