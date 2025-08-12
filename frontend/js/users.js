class Users {
    constructor() {
        this.users = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUsers();
    }

    setupEventListeners() {
        // Add user button
        document.getElementById('addUserBtn').addEventListener('click', () => {
            this.showUserModal();
        });

        // User form submission
        document.getElementById('userForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleUserSubmit();
        });
    }

    async loadUsers() {
        try {
            this.users = await api.getAllUsers();
            this.displayUsers();
        } catch (error) {
            console.error('Error loading users:', error);
            // For now, use mock data
            this.users = [
                {
                    id: 1,
                    username: 'admin',
                    email: 'admin@example.com',
                    full_name: 'Administrator',
                    address: 'Admin Address',
                    is_admin: true
                },
                {
                    id: 2,
                    username: 'user1',
                    email: 'user1@example.com',
                    full_name: 'Regular User',
                    address: 'User Address',
                    is_admin: false
                }
            ];
            this.displayUsers();
        }
    }

    displayUsers() {
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = '';

        this.users.forEach(user => {
            const userElement = this.createUserElement(user);
            usersList.appendChild(userElement);
        });
    }

    createUserElement(user) {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-item';
        userDiv.innerHTML = `
            <div class="user-info">
                <h3>${user.full_name}</h3>
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Role:</strong> ${user.is_admin ? 'Admin' : 'User'}</p>
            </div>
            <div class="user-actions">
                <button class="btn btn-secondary edit-user" data-user-id="${user.id}">Edit</button>
                <button class="btn btn-danger delete-user" data-user-id="${user.id}">Delete</button>
            </div>
        `;

        // Add event listeners
        userDiv.querySelector('.edit-user').addEventListener('click', () => {
            this.editUser(user);
        });

        userDiv.querySelector('.delete-user').addEventListener('click', () => {
            this.deleteUser(user.id);
        });

        return userDiv;
    }

    showUserModal(user = null) {
        const modal = document.getElementById('userModal');
        const title = document.getElementById('userModalTitle');
        const form = document.getElementById('userForm');

        if (user) {
            // Edit mode
            title.textContent = 'Edit User';
            document.getElementById('userId').value = user.id;
            document.getElementById('userUsername').value = user.username;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userPassword').value = ''; // Don't show password
            document.getElementById('userFullName').value = user.full_name;
        } else {
            // Add mode
            title.textContent = 'Add New User';
            form.reset();
            document.getElementById('userId').value = '';
        }

        modal.style.display = 'block';
    }

    async handleUserSubmit() {
        try {
            const formData = {
                username: document.getElementById('userUsername').value,
                email: document.getElementById('userEmail').value,
                password: document.getElementById('userPassword').value,
                full_name: document.getElementById('userFullName').value
            };

            const userId = document.getElementById('userId').value;

            if (userId) {
                // Update existing user
                const response = await api.updateUser(userId, formData);
                console.log('Update user response:', response);
                alert('User updated successfully!');
                
                // Update the user in the local array
                const index = this.users.findIndex(u => u.id === parseInt(userId));
                if (index !== -1) {
                    this.users[index] = { ...this.users[index], ...formData };
                }
            } else {
                // Create new user
                const response = await api.createUser(formData);
                console.log('Create user response:', response);
                alert('User created successfully!');
                
                // Add new user to local array with a temporary ID
                const newUser = {
                    ...formData,
                    id: Date.now(), // Temporary ID for mock data
                    is_admin: false
                };
                this.users.push(newUser);
            }

            this.closeUserModal();
            this.displayUsers();
        } catch (error) {
            console.error('Save user error:', error);
            alert('Error saving user: ' + error.message);
        }
    }

    editUser(user) {
        this.showUserModal(user);
    }

    async deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await api.deleteUser(userId);
                console.log('Delete user response:', response);
                
                if (response && response.message) {
                    alert('User deleted successfully!');
                    // Remove the user from the local array
                    this.users = this.users.filter(u => u.id !== userId);
                    this.displayUsers();
                } else {
                    alert('User deleted successfully!');
                    this.loadUsers();
                }
            } catch (error) {
                console.error('Delete user error:', error);
                alert('Error deleting user: ' + error.message);
            }
        }
    }

    closeUserModal() {
        document.getElementById('userModal').style.display = 'none';
    }
}

// Create global users instance
window.users = new Users();
