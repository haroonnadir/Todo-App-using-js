document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    // Task Manager Elements
    const taskForm = document.getElementById('taskForm');
    const taskFormContainer = document.getElementById('taskFormContainer');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const cancelTaskBtn = document.getElementById('cancelTask');
    const taskTitle = document.getElementById('taskTitle');
    const taskDescription = document.getElementById('taskDescription');
    const taskDueDate = document.getElementById('taskDueDate');
    const taskPriority = document.getElementById('taskPriority');
    const taskCategory = document.getElementById('taskCategory');
    const taskId = document.getElementById('taskId');
    const saveTaskBtn = document.getElementById('saveTask');
    const tasksContainer = document.getElementById('tasksContainer');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const taskSearch = document.getElementById('taskSearch');
    
    // Contact Form Elements
    const contactForm = document.getElementById('contactForm');
    
    // Register Form Elements
    const registerForm = document.getElementById('registerForm');
    
    // Initialize tasks array and filter state
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    let currentSearch = '';
    
    // Initialize the application
    init();
    
    function init() {
        // Set up event listeners
        setupNavigation();
        setupTaskManager();
        setupContactForm();
        setupRegisterForm();
        
        // Show home page by default
        showPage('home');
    }
    
    // Navigation Handling
    function setupNavigation() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.getAttribute('data-page');
                showPage(pageId);
                
                // Update active nav link
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
    }
    
    function showPage(pageId) {
        // Hide all pages
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show the selected page
        document.getElementById(`${pageId}-page`).classList.add('active');
        
        // Special handling for specific pages
        if (pageId === 'todo') {
            renderTasks();
        }
    }
    
    // Task Manager Functionality
    function setupTaskManager() {
        // Add Task Button
        addTaskBtn.addEventListener('click', function() {
            taskFormContainer.style.display = 'block';
            addTaskBtn.style.display = 'none';
            resetTaskForm();
            taskTitle.focus();
        });
        
        // Cancel Task Button
        cancelTaskBtn.addEventListener('click', function() {
            taskFormContainer.style.display = 'none';
            addTaskBtn.style.display = 'block';
            resetTaskForm();
        });
        
        // Task Form Submission
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateTaskForm()) {
                if (taskId.value) {
                    updateTask(
                        taskId.value,
                        taskTitle.value,
                        taskDescription.value,
                        taskDueDate.value,
                        taskPriority.value,
                        taskCategory.value
                    );
                } else {
                    addTask(
                        taskTitle.value,
                        taskDescription.value,
                        taskDueDate.value,
                        taskPriority.value,
                        taskCategory.value
                    );
                }
                
                resetTaskForm();
                renderTasks();
                taskFormContainer.style.display = 'none';
                addTaskBtn.style.display = 'block';
            }
        });
        
        // Filter Buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                currentFilter = this.getAttribute('data-filter');
                updateFilterButtons();
                renderTasks();
            });
        });
        
        // Clear Completed Tasks
        clearCompletedBtn.addEventListener('click', function() {
            tasks = tasks.filter(task => !task.completed);
            saveTasks();
            renderTasks();
        });
        
        // Task Search
        taskSearch.addEventListener('input', function() {
            currentSearch = this.value.toLowerCase();
            renderTasks();
        });
    }
    
    function validateTaskForm() {
        let isValid = true;
        
        // Validate title (3-50 characters)
        if (taskTitle.value.length < 3 || taskTitle.value.length > 50) {
            taskTitle.classList.add('is-invalid');
            isValid = false;
        } else {
            taskTitle.classList.remove('is-invalid');
        }
        
        // Validate description (10-200 characters)
        if (taskDescription.value.length < 10 || taskDescription.value.length > 200) {
            taskDescription.classList.add('is-invalid');
            isValid = false;
        } else {
            taskDescription.classList.remove('is-invalid');
        }
        
        return isValid;
    }
    
    function resetTaskForm() {
        taskForm.reset();
        taskId.value = '';
        taskTitle.classList.remove('is-invalid');
        taskDescription.classList.remove('is-invalid');
        saveTaskBtn.innerHTML = '<i class="fas fa-save me-1"></i>Save';
    }
    
    function addTask(title, description, dueDate, priority, category) {
        const newTask = {
            id: Date.now().toString(),
            title,
            description,
            dueDate,
            priority,
            category,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        tasks.push(newTask);
        saveTasks();
    }
    
    function updateTask(id, title, description, dueDate, priority, category) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { 
                    ...task, 
                    title, 
                    description,
                    dueDate,
                    priority,
                    category
                };
            }
            return task;
        });
        
        saveTasks();
    }
    
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }
    
    function toggleTaskCompletion(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        
        saveTasks();
        renderTasks();
    }
    
    function editTask(id) {
        const taskToEdit = tasks.find(task => task.id === id);
        if (taskToEdit) {
            taskTitle.value = taskToEdit.title;
            taskDescription.value = taskToEdit.description;
            taskDueDate.value = taskToEdit.dueDate;
            taskPriority.value = taskToEdit.priority;
            taskCategory.value = taskToEdit.category;
            taskId.value = taskToEdit.id;
            
            saveTaskBtn.innerHTML = '<i class="fas fa-save me-1"></i>Update';
            taskFormContainer.style.display = 'block';
            addTaskBtn.style.display = 'none';
            taskTitle.focus();
        }
    }
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    function updateFilterButtons() {
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === currentFilter) {
                btn.classList.add('active');
            }
        });
    }
    
    function isOverdue(dueDate) {
        if (!dueDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        return due < today;
    }
    
    function renderTasks() {
        // Filter tasks based on current filter and search
        let filteredTasks = tasks.filter(task => {
            // Apply filter
            if (currentFilter === 'active' && task.completed) return false;
            if (currentFilter === 'completed' && !task.completed) return false;
            
            // Apply search
            if (currentSearch) {
                const searchText = currentSearch.toLowerCase();
                return (
                    task.title.toLowerCase().includes(searchText) ||
                    task.description.toLowerCase().includes(searchText) ||
                    task.category.toLowerCase().includes(searchText)
                );
            }
            
            return true;
        });
        
        // Sort tasks
        filteredTasks.sort((a, b) => {
            // Completed status (incomplete first)
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            
            // Priority (high to low)
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            
            // Due date (earlier first)
            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate) - new Date(b.dueDate);
            } else if (a.dueDate) {
                return -1;
            } else if (b.dueDate) {
                return 1;
            }
            
            // Creation date (older first)
            return new Date(a.createdAt) - new Date(b.createdAt);
        });
        
        // Render tasks or empty state
        if (filteredTasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tasks fa-3x text-muted mb-3"></i>
                    <h5>No tasks found</h5>
                    <p class="text-muted">
                        ${currentSearch ? 'No tasks match your search' : 
                         currentFilter === 'all' ? 'Add your first task to get started' : 
                         currentFilter === 'active' ? 'No active tasks' : 'No completed tasks'}
                    </p>
                </div>
            `;
            return;
        }
        
        tasksContainer.innerHTML = filteredTasks.map(task => `
            <div class="card mb-3 task-item ${task.completed ? 'completed' : ''} ${task.priority}-priority">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div style="flex-grow: 1;">
                            <div class="d-flex justify-content-between align-items-start">
                                <h5 class="card-title task-title mb-1">${task.title}</h5>
                                <span class="badge bg-${task.priority === 'high' ? 'danger' : 
                                                  task.priority === 'medium' ? 'warning text-dark' : 'secondary'}">
                                    ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </span>
                            </div>
                            <p class="card-text mb-2">${task.description}</p>
                            <div class="d-flex flex-wrap gap-3 align-items-center">
                                <small class="text-muted">
                                    <i class="fas fa-tag me-1"></i>
                                    ${task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                                </small>
                                <small class="text-muted ${!task.completed && isOverdue(task.dueDate) ? 'text-danger' : ''}">
                                    <i class="fas fa-calendar-alt me-1"></i>
                                    ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                                    ${!task.completed && isOverdue(task.dueDate) ? '(Overdue)' : ''}
                                </small>
                            </div>
                        </div>
                        <div class="task-actions ms-3">
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-${task.completed ? 'secondary' : 'success'} toggle-btn" 
                                    data-id="${task.id}" title="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                                    <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
                                </button>
                                <button class="btn btn-outline-primary edit-btn" data-id="${task.id}" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-outline-danger delete-btn" data-id="${task.id}" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to task action buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                deleteTask(btn.dataset.id);
            });
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                editTask(btn.dataset.id);
            });
        });
        
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                toggleTaskCompletion(btn.dataset.id);
            });
        });
    }
    
    // Contact Form Handling
    function setupContactForm() {
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm()) {
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';
                
                setTimeout(() => {
                    // Show success message
                    showAlert('success', 'Your message has been sent successfully! We will get back to you soon.');
                    
                    // Reset form
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    
                    // Store contact in localStorage (for demo purposes)
                    const contactData = {
                        name: document.getElementById('contactName').value,
                        email: document.getElementById('contactEmail').value,
                        subject: document.getElementById('contactSubject').value,
                        message: document.getElementById('contactMessage').value,
                        date: new Date().toISOString()
                    };
                    
                    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
                    contacts.push(contactData);
                    localStorage.setItem('contacts', JSON.stringify(contacts));
                    
                }, 1500);
            }
        });
        
        // Add real-time validation
        const contactFields = contactForm.querySelectorAll('input, select, textarea');
        contactFields.forEach(field => {
            field.addEventListener('input', function() {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                }
            });
        });
    }
    
    function validateContactForm() {
        let isValid = true;
        const contactName = document.getElementById('contactName');
        const contactEmail = document.getElementById('contactEmail');
        const contactSubject = document.getElementById('contactSubject');
        const contactMessage = document.getElementById('contactMessage');
        
        // Validate name
        if (contactName.value.trim() === '') {
            contactName.classList.add('is-invalid');
            isValid = false;
        } else {
            contactName.classList.remove('is-invalid');
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactEmail.value)) {
            contactEmail.classList.add('is-invalid');
            isValid = false;
        } else {
            contactEmail.classList.remove('is-invalid');
        }
        
        // Validate subject
        if (!contactSubject.value) {
            contactSubject.classList.add('is-invalid');
            isValid = false;
        } else {
            contactSubject.classList.remove('is-invalid');
        }
        
        // Validate message
        if (contactMessage.value.trim() === '') {
            contactMessage.classList.add('is-invalid');
            isValid = false;
        } else {
            contactMessage.classList.remove('is-invalid');
        }
        
        return isValid;
    }
    
    // Register Form Handling
    function setupRegisterForm() {
        if (!registerForm) return;
        
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateRegisterForm()) {
                // Simulate form submission
                const submitBtn = registerForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Registering...';
                
                setTimeout(() => {
                    // Show success message
                    showAlert('success', 'Registration successful! Welcome to Task Manager Pro.');
                    
                    // Reset form
                    registerForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    
                    // Store user in localStorage (for demo purposes)
                    const userData = {
                        firstName: document.getElementById('firstName').value,
                        lastName: document.getElementById('lastName').value,
                        email: document.getElementById('registerEmail').value,
                        registeredAt: new Date().toISOString()
                    };
                    
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    
                }, 1500);
            }
        });
        
        // Password matching validation
        const password = document.getElementById('registerPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        
        confirmPassword.addEventListener('input', function() {
            if (this.value !== password.value) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
        });
    }
    
    function validateRegisterForm() {
        let isValid = true;
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const registerEmail = document.getElementById('registerEmail');
        const registerPassword = document.getElementById('registerPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        const agreeTerms = document.getElementById('agreeTerms');
        
        // Validate first name
        if (firstName.value.trim() === '') {
            firstName.classList.add('is-invalid');
            isValid = false;
        } else {
            firstName.classList.remove('is-invalid');
        }
        
        // Validate last name
        if (lastName.value.trim() === '') {
            lastName.classList.add('is-invalid');
            isValid = false;
        } else {
            lastName.classList.remove('is-invalid');
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(registerEmail.value)) {
            registerEmail.classList.add('is-invalid');
            isValid = false;
        } else {
            registerEmail.classList.remove('is-invalid');
        }
        
        // Validate password
        if (registerPassword.value.length < 8) {
            registerPassword.classList.add('is-invalid');
            isValid = false;
        } else {
            registerPassword.classList.remove('is-invalid');
        }
        
        // Validate password confirmation
        if (confirmPassword.value !== registerPassword.value) {
            confirmPassword.classList.add('is-invalid');
            isValid = false;
        } else {
            confirmPassword.classList.remove('is-invalid');
        }
        
        // Validate terms agreement
        if (!agreeTerms.checked) {
            agreeTerms.classList.add('is-invalid');
            isValid = false;
        } else {
            agreeTerms.classList.remove('is-invalid');
        }
        
        return isValid;
    }
    
    // Show alert message
    function showAlert(type, message) {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} custom-alert alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
        alertDiv.style.zIndex = '1060';
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alertDiv);
            bsAlert.close();
        }, 5000);
    }
});