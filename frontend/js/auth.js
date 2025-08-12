class Auth {
    constructor() {
        console.log('Auth constructor called');
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        console.log('Auth init called');
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Auth tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            console.log('Found auth tab:', tab.dataset.tab);
            tab.addEventListener('click', (e) => {
                console.log('Tab clicked:', e.target.dataset.tab);
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Login form
        const loginForm = document.getElementById('loginForm');
        console.log('Login form found:', loginForm);
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                console.log('Login form submitted');
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        console.log('Register form found:', registerForm);
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                console.log('Register form submitted');
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        console.log('Logout button found:', logoutBtn);
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                console.log('Logout button clicked');
                this.logout();
            });
        }
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Show/hide forms
        document.getElementById('loginForm').style.display = tabName === 'login' ? 'flex' : 'none';
        document.getElementById('registerForm').style.display = tabName === 'register' ? 'flex' : 'none';
    }

    async handleLogin() {
        try {
            const form = document.getElementById('loginForm');
            const email = form.querySelector('input[type="email"]').value;
            const password = form.querySelector('input[type="password"]').value;

            const response = await api.login({ email, password });
            
            this.setToken(response.token);
            this.currentUser = response.user;
            this.isAuthenticated = true;
            
            this.showMainContent();
            this.updateUI();
            
            // Clear form
            form.reset();
            
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    }

    async handleRegister() {
        try {
            console.log('Starting registration process...');
            const form = document.getElementById('registerForm');
            const inputs = form.querySelectorAll('input, textarea');
            
            console.log('Form inputs found:', inputs.length);
            
            const username = inputs[0].value;
            const email = inputs[1].value;
            const password = inputs[2].value;
            const full_name = inputs[3].value;
            const address = inputs[4].value;

            console.log('Form data:', { username, email, full_name, address });

            const response = await api.register({
                username,
                email,
                password,
                full_name,
                address
            });
            
            console.log('Registration response:', response);
            
            this.setToken(response.token);
            this.currentUser = response.user;
            this.isAuthenticated = true;
            
            this.showMainContent();
            this.updateUI();
            
            // Clear form
            form.reset();
            
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed: ' + error.message);
        }
    }

    setToken(token) {
        api.setToken(token);
        localStorage.setItem('token', token);
    }

    async checkAuthStatus() {
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                const response = await api.getProfile();
                this.currentUser = response.user;
                this.isAuthenticated = true;
                this.showMainContent();
                this.updateUI();
            } catch (error) {
                this.logout();
            }
        } else {
            this.showAuthContainer();
        }
    }

    showMainContent() {
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    }

    showAuthContainer() {
        document.getElementById('authContainer').style.display = 'block';
        document.getElementById('mainContent').style.display = 'none';
    }

    updateUI() {
        if (this.isAuthenticated) {
            document.getElementById('logoutBtn').style.display = 'block';
            // Update profile form with current user data
            if (this.currentUser) {
                document.getElementById('profileUsername').value = this.currentUser.username;
                document.getElementById('profileFullName').value = this.currentUser.full_name;
                document.getElementById('profileAddress').value = this.currentUser.address;
            }
        } else {
            document.getElementById('logoutBtn').style.display = 'none';
        }
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('token');
        api.setToken(null);
        
        this.showAuthContainer();
        this.updateUI();
        
        // Reset to login tab
        this.switchTab('login');
        
        // Clear any displayed content
        document.getElementById('productsGrid').innerHTML = '';
        document.getElementById('cartItems').innerHTML = '';
        document.getElementById('ordersList').innerHTML = '';
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isUserAuthenticated() {
        return this.isAuthenticated;
    }
}

// Create global auth instance
window.auth = new Auth();
