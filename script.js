// Get DOM elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');
const themeToggle = document.getElementById('themeToggle');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Load theme preference
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Apply initial theme
applyTheme();

// Render tasks on page load
renderTasks();

// Add event listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
themeToggle.addEventListener('click', toggleTheme);

// Add task function
function addTask() {
    const taskText = taskInput.value.trim();

    // Validate input
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    // Create task object
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    // Add to tasks array
    tasks.push(task);
    saveTasks();
    renderTasks();

    // Clear input
    taskInput.value = '';
    taskInput.focus();
}

// Delete task function
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Render all tasks
function renderTasks() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="empty-message">No tasks yet. Add one to get started! ✨</p>';
    } else {
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="toggleTask(${task.id})"
                >
                <span class="task-text">${escapeHtml(task.text)}</span>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            `;
            taskList.appendChild(li);
        });
    }

    updateStats();
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    totalTasksSpan.textContent = total;
    completedTasksSpan.textContent = completed;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Theme toggle function
function toggleTheme() {
    isDarkMode = !isDarkMode;
    applyTheme();
    saveThemePreference();
}

// Apply theme to document
function applyTheme() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.textContent = '🌙';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
}

// Save theme preference to localStorage
function saveThemePreference() {
    localStorage.setItem('darkMode', isDarkMode);
}
