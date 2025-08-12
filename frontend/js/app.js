class App {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupModal();
    }

    setupNavigation() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.showPage(page);
            });
        });
    }

    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageName + 'Page').classList.add('active');
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
        
        this.currentPage = pageName;
        
        // Load page-specific content
        this.loadPageContent(pageName);
    }

    async loadPageContent(pageName) {
        switch (pageName) {
            case 'users':
                // Users are already loaded by the users module
                break;
            case 'purchases':
                // Purchases are already loaded by the purchases module
                break;
            case 'products':
                // Products are already loaded by the products module
                break;
            case 'home':
                // Home page content is already loaded
                break;
        }
    }















    setupModal() {
        const modal = document.getElementById('productModal');
        const closeBtn = modal.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Utility method to check if user is authenticated
    requireAuth() {
        if (!auth.isUserAuthenticated()) {
            alert('Please login to access this page');
            return false;
        }
        return true;
    }

    // Global function to close modals
    static closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
}

// Global function to close modals
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
