class Purchases {
    constructor() {
        this.purchases = [];
        this.init();
    }

    init() {
        this.loadPurchases();
    }

    async loadPurchases() {
        try {
            this.purchases = await api.getAllPurchases();
            this.displayPurchases();
        } catch (error) {
            console.error('Error loading purchases:', error);
            // For now, use mock data
            this.purchases = [
                {
                    id: 1,
                    user_id: 2,
                    user_name: 'Regular User',
                    total_amount: 79.98,
                    status: 'completed',
                    created_at: '2024-01-15T10:30:00Z',
                    items: [
                        {
                            product_name: 'Sample Product 1',
                            quantity: 2,
                            price: 29.99
                        },
                        {
                            product_name: 'Sample Product 2',
                            quantity: 1,
                            price: 49.99
                        }
                    ]
                },
                {
                    id: 2,
                    user_id: 1,
                    user_name: 'Administrator',
                    total_amount: 29.99,
                    status: 'pending',
                    created_at: '2024-01-14T15:45:00Z',
                    items: [
                        {
                            product_name: 'Sample Product 1',
                            quantity: 1,
                            price: 29.99
                        }
                    ]
                }
            ];
            this.displayPurchases();
        }
    }

    displayPurchases() {
        const purchasesList = document.getElementById('purchasesList');
        purchasesList.innerHTML = '';

        this.purchases.forEach(purchase => {
            const purchaseElement = this.createPurchaseElement(purchase);
            purchasesList.appendChild(purchaseElement);
        });
    }

    createPurchaseElement(purchase) {
        const purchaseDiv = document.createElement('div');
        purchaseDiv.className = 'purchase-item';
        purchaseDiv.innerHTML = `
            <div class="purchase-header">
                <h3>Purchase #${purchase.id}</h3>
                <span class="purchase-date">${new Date(purchase.created_at).toLocaleDateString()}</span>
                <span class="purchase-status ${purchase.status}">${purchase.status}</span>
            </div>
            <div class="purchase-details">
                <p><strong>Customer:</strong> ${purchase.user_name}</p>
                <p><strong>Total:</strong> $${purchase.total_amount.toFixed(2)}</p>
                <p><strong>Items:</strong> ${purchase.items.length} product(s)</p>
            </div>
            <div class="purchase-actions">
                <button class="btn btn-secondary view-purchase-details" data-purchase-id="${purchase.id}">
                    View Details
                </button>
            </div>
        `;

        // Add event listener for viewing purchase details
        purchaseDiv.querySelector('.view-purchase-details').addEventListener('click', () => {
            this.showPurchaseDetails(purchase);
        });

        return purchaseDiv;
    }

    showPurchaseDetails(purchase) {
        const modal = document.getElementById('purchaseModal');
        const content = document.getElementById('purchaseModalContent');
        
        content.innerHTML = `
            <div class="purchase-details-modal">
                <div class="purchase-info">
                    <h3>Purchase #${purchase.id}</h3>
                    <p><strong>Date:</strong> ${new Date(purchase.created_at).toLocaleDateString()}</p>
                    <p><strong>Customer:</strong> ${purchase.user_name}</p>
                    <p><strong>Total:</strong> $${purchase.total_amount.toFixed(2)}</p>
                    <p><strong>Status:</strong> <span class="status ${purchase.status}">${purchase.status}</span></p>
                </div>
                <div class="purchase-items">
                    <h4>Items Purchased:</h4>
                    ${purchase.items.map(item => `
                        <div class="purchase-item-detail">
                            <p><strong>${item.product_name}</strong></p>
                            <p>Quantity: ${item.quantity}</p>
                            <p>Price: $${item.price.toFixed(2)}</p>
                            <p>Subtotal: $${(item.quantity * item.price).toFixed(2)}</p>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-secondary close-modal">Close</button>
            </div>
        `;

        // Add event listener for closing modal
        content.querySelector('.close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.style.display = 'block';
    }

    // Method to create a new purchase (called from products when buying)
    async createPurchase(productId, quantity, userId) {
        try {
            const purchaseData = {
                user_id: userId,
                product_id: productId,
                quantity: quantity
            };

            const response = await api.createPurchase(purchaseData);
            alert('Purchase completed successfully!');
            
            // Reload purchases list
            this.loadPurchases();
            
            return response;
        } catch (error) {
            alert('Error creating purchase: ' + error.message);
            throw error;
        }
    }
}

// Create global purchases instance
window.purchases = new Purchases();
