// Application State
const state = {
  projects: JSON.parse(localStorage.getItem('projects')) || [],
  courses: [
    { id: 'web-dev', name: 'Web Development', author: 'John Doe' },
    { id: 'ml', name: 'Machine Learning', author: 'Jane Smith' },
    { id: 'ml-eval', name: 'ML Project Evaluator', author: 'Ankit Patel' },
    { id: 'mobile-dev', name: 'Mobile Development', author: 'Alex Johnson' },
    { id: 'data-sci', name: 'Data Science', author: 'Sarah Williams' }
  ],
  currentFilter: 'all',
  currentCourseFilter: null,
  statusOptions: [
    { id: 'in-progress', name: 'In Progress', color: 'green' },
    { id: 'review', name: 'In Review', color: 'yellow' },
    { id: 'planning', name: 'Planning', color: 'blue' },
    { id: 'on-hold', name: 'On Hold', color: 'gray' },
    { id: 'completed', name: 'Completed', color: 'purple' },
    { id: 'registered', name: 'Registered', color: 'blue' },
    { id: 'pending', name: 'Pending', color: 'yellow' },
    { id: 'authenticated', name: 'Authenticated', color: 'green' },
    { id: 'due', name: 'Due Soon', color: 'purple' },
    { id: 'recent', name: 'Recent', color: 'blue' }
  ]
};

// DOM Elements
const elements = {
  projectsGrid: document.getElementById('projectsGrid'),
  addProjectCard: document.getElementById('addProjectCard'),
  addProjectModal: document.getElementById('addProjectModal'),
  closeProjectModal: document.getElementById('closeProjectModal'),
  projectForm: document.getElementById('projectForm'),
  addCourseBtn: document.getElementById('addCourseButton'),
  addCourseModal: document.getElementById('addCourseModal'),
  closeModal: document.getElementById('closeModal'),
  cancelBtn: document.getElementById('cancelAddCourse'),
  addCourseForm: document.getElementById('addCourseForm'),
  coursesContainer: document.querySelector('.flex-1.overflow-y-auto.space-y-3'),
  profileBtn: document.getElementById('profileBtn'),
  profileMenu: document.getElementById('profileMenu')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  // Initialize UI components
  initializeFormSelects();
  initializeEventListeners();
  
  // Render initial data
  renderStatusFilters();
  renderCourses();
  renderProjects();
  
  // Save initial state
  saveState();
}

function initializeFormSelects() {
  // Status dropdown
  const statusSelect = document.getElementById('projectStatus');
  if (statusSelect) {
    statusSelect.innerHTML = state.statusOptions.map(status => 
      `<option value="${status.id}" class="text-${status.color}-400">${status.name}</option>`
    ).join('');
  }
  
  // Course dropdown
  const courseSelect = document.getElementById('projectCourse');
  if (courseSelect) {
    courseSelect.innerHTML = state.courses.map(course => 
      `<option value="${course.id}">${course.name}</option>`
    ).join('');
  }
  
  // Set default status to 'planning' if available
  if (statusSelect && state.statusOptions.some(s => s.id === 'planning')) {
    statusSelect.value = 'planning';
  }
}

function renderStatusFilters() {
  const container = document.getElementById('statusFilters');
  if (!container) return;
  
  const statusButtons = document.createElement('div');
  statusButtons.className = 'flex flex-wrap justify-center gap-3';
  
  // Add 'All Projects' button
  const allButton = document.createElement('button');
  allButton.className = `filter-btn px-4 py-2 rounded-full text-sm font-medium transition-all ${
    state.currentFilter === 'all' ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
  }`;
  allButton.dataset.filter = 'all';
  allButton.textContent = 'All Projects';
  statusButtons.appendChild(allButton);
  
  // Add status filter buttons
  state.statusOptions.forEach(status => {
    const button = document.createElement('button');
    button.className = `filter-btn px-4 py-2 rounded-full text-sm font-medium transition-all ${
      state.currentFilter === status.id 
        ? `bg-${status.color}-500 text-white` 
        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
    }`;
    button.dataset.filter = status.id;
    button.innerHTML = `
      <span class="inline-flex items-center">
        <span class="w-2 h-2 rounded-full bg-${status.color}-500 mr-2"></span>
        ${status.name}
      </span>
    `;
    statusButtons.appendChild(button);
  });
  
  // Replace existing content
  container.innerHTML = '';
  container.appendChild(statusButtons);
}

function initializeEventListeners() {
  // Project Modal
  if (elements.addProjectCard) {
    elements.addProjectCard.addEventListener('click', () => {
      elements.projectForm.reset();
      elements.projectForm.dataset.editId = '';
      // Set default status to 'planning'
      const statusSelect = document.getElementById('projectStatus');
      if (statusSelect) {
        statusSelect.value = 'planning';
      }
      elements.addProjectModal.classList.remove('hidden');
      
      // Focus the first input
      const firstInput = elements.projectForm.querySelector('input, select, textarea');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    });
  }
  
  // Close Project Modal
  if (elements.closeProjectModal) {
    elements.closeProjectModal.addEventListener('click', closeProjectModal);
  }
  
  // Close modal when clicking outside
  if (elements.addProjectModal) {
    elements.addProjectModal.addEventListener('click', (e) => {
      if (e.target === elements.addProjectModal) {
        closeProjectModal();
      }
    });
  }
  
  // Project Form Submission
  if (elements.projectForm) {
    elements.projectForm.addEventListener('submit', handleProjectSubmit);
  }
  
  // Course Modal
  if (elements.addCourseBtn) {
    elements.addCourseBtn.addEventListener('click', () => {
      elements.addCourseModal.classList.remove('hidden');
    });
  }
  
  // Close Course Modal
  if (elements.closeModal) {
    elements.closeModal.addEventListener('click', closeCourseModal);
  }
  
  // Cancel Add Course
  if (elements.cancelBtn) {
    elements.cancelBtn.addEventListener('click', closeCourseModal);
  }
  
  // Close course modal when clicking outside
  if (elements.addCourseModal) {
    elements.addCourseModal.addEventListener('click', (e) => {
      if (e.target === elements.addCourseModal) {
        closeCourseModal();
      }
    });
  }
  
  // Course Form Submission
  if (elements.addCourseForm) {
    elements.addCourseForm.addEventListener('submit', handleCourseSubmit);
  }
  
  // Profile Dropdown
  if (elements.profileBtn && elements.profileMenu) {
    elements.profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      elements.profileMenu.classList.toggle('hidden');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!elements.profileBtn.contains(e.target) && !elements.profileMenu.contains(e.target)) {
        elements.profileMenu.classList.add('hidden');
      }
    });
  }
  
  // Filter buttons
  document.addEventListener('click', (e) => {
    const filterBtn = e.target.closest('.filter-btn');
    if (!filterBtn) return;
    
    e.preventDefault();
    state.currentFilter = filterBtn.dataset.filter;
    
    // Update URL with current filter
    const url = new URL(window.location);
    url.searchParams.set('filter', state.currentFilter);
    window.history.pushState({}, '', url);
    
    // Re-render filters and projects
    renderStatusFilters();
    renderProjects();
    
    // Re-attach event listeners
    attachFilterButtonListeners();
  });
}

// Project Management
function handleProjectSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  
  // Basic validation
  const title = formData.get('title')?.trim();
  const status = formData.get('status');
  const courseId = formData.get('courseId');
  
  if (!title) {
    showNotification('Project title is required', 'red');
    return;
  }
  
  if (!status || !state.statusOptions.some(s => s.id === status)) {
    showNotification('Please select a valid status', 'red');
    return;
  }
  
  if (!courseId || !state.courses.some(c => c.id === courseId)) {
    showNotification('Please select a valid course', 'red');
    return;
  }
  
  // Process GitHub link
  let githubLink = formData.get('githubLink')?.trim() || '';
  if (githubLink) {
    // If it's not already a full URL, construct it
    if (!githubLink.startsWith('http')) {
      githubLink = `https://github.com/${githubLink.replace(/^\/+|\/+$/g, '')}`;
    }
    
    // Basic GitHub URL validation
    try {
      const url = new URL(githubLink);
      if (!url.hostname.includes('github.com')) {
        throw new Error('Invalid GitHub URL');
      }
    } catch (e) {
      showNotification('Please enter a valid GitHub repository URL', 'red');
      return;
    }
  }
  
  const projectData = {
    id: form.dataset.editId || `project-${Date.now()}`,
    title: title,
    description: formData.get('description')?.trim() || '',
    status: status,
    courseId: courseId,
    dueDate: formData.get('dueDate') || '',
    githubLink: githubLink,
    createdAt: form.dataset.editId 
      ? (state.projects.find(p => p.id === form.dataset.editId)?.createdAt || new Date().toISOString())
      : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  try {
    // Update or add project
    const projectIndex = state.projects.findIndex(p => p.id === projectData.id);
    if (projectIndex > -1) {
      state.projects[projectIndex] = projectData;
      showNotification('Project updated successfully!', 'green');
    } else {
      state.projects.push(projectData);
      showNotification('Project added successfully!', 'green');
    }
    
    saveState();
    renderProjects();
    closeProjectModal();
  } catch (error) {
    console.error('Error saving project:', error);
    showNotification('Failed to save project. Please try again.', 'red');
  }
}

function handleCourseSubmit(e) {
  e.preventDefault();
  const formData = new FormData(elements.addCourseForm);
  const courseName = formData.get('courseName');
  const authorName = formData.get('authorName');
  
  if (courseName && authorName) {
    const newCourse = {
      id: courseName.toLowerCase().replace(/\s+/g, '-'),
      name: courseName,
      author: authorName
    };
    
    state.courses.push(newCourse);
    saveState();
    renderCourses();
    closeCourseModal();
    showNotification('Course added successfully!', 'green');
  }
}

// Rendering
function renderProjects() {
  if (!elements.projectsGrid) return;
  
  // Show loading state
  elements.projectsGrid.innerHTML = `
    <div class="col-span-full flex justify-center py-10">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  `;
  
  // Use setTimeout to allow the UI to update before heavy rendering
  setTimeout(() => {
    // Clear existing projects (except the add project card)
    elements.projectsGrid.innerHTML = '';
    
    // Filter projects
    const filteredProjects = filterProjects();
    
    // Add projects to the grid
    if (filteredProjects.length > 0) {
      filteredProjects.forEach(project => {
        elements.projectsGrid.appendChild(createProjectElement(project));
      });
    } else {
      // Show no projects message
      const noProjects = document.createElement('div');
      noProjects.className = 'col-span-full text-center py-16 text-gray-400';
      noProjects.innerHTML = `
        <svg class="mx-auto h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-lg font-medium">No projects found</h3>
        <p class="mt-1 text-sm text-gray-500">
          ${state.currentFilter === 'all' 
            ? 'Get started by creating a new project.' 
            : 'Try changing your filters or create a new project.'}
        </p>
        <div class="mt-6">
          <button onclick="document.getElementById('addProjectCard').click()" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            New Project
          </button>
        </div>
      `;
      elements.projectsGrid.appendChild(noProjects);
    }
    
    // Add the "Add New Project" card as the last item if there are projects
    if (filteredProjects.length > 0 && elements.addProjectCard) {
      elements.projectsGrid.appendChild(elements.addProjectCard);
    }
    
    // Update active states
    updateActiveStates();
  }, 50); // Small delay to allow UI to update
}

function renderCourses() {
  if (!elements.coursesContainer) return;
  
  elements.coursesContainer.innerHTML = state.courses.map(course => `
    <div class="course-item cursor-pointer bg-cyan-600/50 hover:bg-cyan-700/50 rounded-lg p-3 shadow transition" 
         data-course-id="${course.id}">
      <p class="font-semibold truncate">${course.name}</p>
      <p class="text-sm text-white/80">by ${course.author}</p>
    </div>
  `).join('');
  
  // Re-attach course item event listeners
  document.querySelectorAll('.course-item').forEach(item => {
    item.addEventListener('click', function() {
      const courseId = this.dataset.courseId;
      state.currentCourseFilter = state.currentCourseFilter === courseId ? null : courseId;
      renderProjects();
      
      // Update active state
      document.querySelectorAll('.course-item').forEach(i => 
        i.classList.toggle('bg-cyan-600', i === this && state.currentCourseFilter)
      );
    });
  });
}

// Filtering
function filterProjects() {
  return state.projects.filter(project => {
    // Apply course filter
    if (state.currentCourseFilter && project.courseId !== state.currentCourseFilter) {
      return false;
    }
    
    // Apply status filter
    if (state.currentFilter !== 'all') {
      const dueDate = project.dueDate ? new Date(project.dueDate) : null;
      const now = new Date();
      
      switch(state.currentFilter) {
        case 'recent':
          const createdDate = new Date(parseInt(project.id));
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          return createdDate > oneWeekAgo;
          
        case 'authenticated':
          return ['in-progress', 'completed'].includes(project.status);
          
        case 'registered':
          return project.status === 'registered';
          
        case 'pending':
          return project.status === 'pending';
          
        case 'due':
          const oneWeekFromNow = new Date();
          oneWeekFromNow.setDate(now.getDate() + 7);
          return dueDate && dueDate <= oneWeekFromNow && dueDate >= now;
          
        case 'review':
          return project.status === 'review';
          
        default:
          return true;
      }
    }
    
    return true;
  });
}

// DOM Manipulation
function createProjectElement(project) {
  const status = state.statusOptions.find(s => s.id === project.status) || state.statusOptions[0];
  const course = state.courses.find(c => c.id === project.courseId) || { name: 'Uncategorized' };
  
  // Format dates
  let createdDate = 'N/A';
  let updatedDate = 'N/A';
  
  try {
    if (project.createdAt) {
      createdDate = new Date(project.createdAt).toLocaleDateString();
    } else if (project.id) {
      // Fallback for old projects
      createdDate = new Date(parseInt(project.id.replace(/\D/g, ''))).toLocaleDateString();
    }
    
    if (project.updatedAt) {
      updatedDate = new Date(project.updatedAt).toLocaleDateString();
    }
  } catch (e) {
    console.error('Error formatting dates:', e);
  }
  
  const projectElement = document.createElement('div');
  projectElement.id = `project-${project.id}`;
  projectElement.className = `project-card bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-800 hover:border-${status.color}-500/50 transition-all hover:shadow-${status.color}-500/10`;
  
  projectElement.innerHTML = `
    <div class="p-5">
      <!-- Course Name -->
      <div class="mb-3">
        <span class="inline-block px-3 py-1 bg-cyan-900/30 text-cyan-400 text-xs font-medium rounded-full">
          ${course.name || 'No Course'}
        </span>
      </div>
      
      <!-- Project Title -->
      <h3 class="text-white font-semibold text-xl mb-3">${project.title || 'Untitled Project'}</h3>
      
      <!-- Status Badge -->
      <div class="mb-4">
        <span class="px-2.5 py-1 bg-${status.color}-500/20 text-${status.color}-400 text-xs font-medium rounded-full inline-flex items-center">
          <span class="w-2 h-2 rounded-full bg-${status.color}-500 mr-1.5"></span>
          ${status.name}
        </span>
      </div>
      
      <!-- Project Description -->
      <div class="mb-4">
        <p class="text-gray-300 text-sm">
          ${project.description || 'No description provided.'}
        </p>
      </div>
      
      <!-- GitHub Link -->
      ${project.githubLink ? `
        <div class="mb-4">
          <a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" 
             class="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
            <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"></path>
            </svg>
            View on GitHub
          </a>
        </div>
      ` : ''}
      
      <!-- Project Details -->
      <div class="grid grid-cols-2 gap-4 text-xs text-gray-400 mt-4 pt-4 border-t border-gray-800">
        <div>
          <p class="text-gray-500 text-xs uppercase tracking-wider mb-1">Project ID</p>
          <p class="font-mono text-cyan-400 text-xs">${project.id || 'N/A'}</p>
        </div>
        <div class="text-right">
          <p class="text-gray-500 text-xs uppercase tracking-wider mb-1">Created On</p>
          <p class="text-xs">${createdDate}</p>
        </div>
      </div>
      
      <!-- Due Date -->
      ${project.dueDate ? `
        <div class="text-xs text-gray-400 mt-2">
          <p class="text-gray-500 text-xs uppercase tracking-wider mb-1">Due Date</p>
          <p>${project.dueDate}</p>
        </div>
      ` : ''}
    </div>
    
    <!-- Action Buttons -->
    <div class="p-3 border-t border-gray-800 flex justify-end space-x-2">
      <button class="action-btn text-gray-400 hover:text-blue-400 transition-colors" 
              onclick="event.stopPropagation(); editProject('${project.id}')" 
              title="Edit Project">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
      </button>
      <button class="action-btn text-gray-400 hover:text-red-400 transition-colors" 
              onclick="event.stopPropagation(); if(confirm('Are you sure you want to delete this project?')) deleteProject('${project.id}')" 
              title="Delete Project">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    </div>
  `;
  
  return projectElement;
}

function attachFilterButtonListeners() {
  // This will be called after rendering filters to attach event listeners
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      state.currentFilter = this.dataset.filter;
      renderStatusFilters();
      renderProjects();
    });
  });
}

function updateActiveStates() {
  // Update active states for filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const isActive = btn.dataset.filter === state.currentFilter;
    btn.classList.remove(
      'bg-white', 'text-gray-900',
      'bg-green-500', 'bg-yellow-500', 'bg-blue-500', 
      'bg-gray-500', 'bg-purple-500', 'bg-red-500',
      'bg-cyan-500', 'bg-orange-500', 'text-white'
    );
    
    if (isActive) {
      if (state.currentFilter === 'all') {
        btn.classList.add('bg-white', 'text-gray-900');
      } else {
        const status = state.statusOptions.find(s => s.id === state.currentFilter);
        if (status) {
          btn.classList.add(`bg-${status.color}-500`, 'text-white');
        }
      }
    } else {
      btn.classList.add('bg-gray-800', 'text-gray-300');
    }
  });
  
  // Update course items
  document.querySelectorAll('.course-item').forEach(item => {
    const courseId = item.dataset.courseId;
    item.classList.toggle('bg-cyan-600', state.currentCourseFilter === courseId);
    item.classList.toggle('bg-cyan-600/50', state.currentCourseFilter !== courseId);
  });
}

// Modal Management
function closeProjectModal() {
  if (elements.addProjectModal) {
    elements.addProjectModal.classList.add('hidden');
  }
  if (elements.projectForm) {
    elements.projectForm.reset();
    delete elements.projectForm.dataset.editId;
    
    // Reset modal title
    const modalTitle = document.querySelector('#addProjectModal h3');
    if (modalTitle) {
      modalTitle.textContent = 'Add New Project';
    }
  }
}

function closeCourseModal() {
  if (elements.addCourseModal) {
    elements.addCourseForm.reset();
    elements.addCourseModal.classList.add('hidden');
  }
}

// State Management
function saveState() {
  localStorage.setItem('projects', JSON.stringify(state.projects));
  localStorage.setItem('courses', JSON.stringify(state.courses));
}

// Utility Functions
function showNotification(message, type = 'green') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 bg-${type}-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center z-50`;
  notification.innerHTML = `
    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    ${message}
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('opacity-0', 'translate-y-2', 'transition-all', 'duration-300');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Global functions for project actions
window.editProject = function(projectId) {
  try {
    const project = state.projects.find(p => p.id === projectId);
    if (!project) {
      console.error('Project not found:', projectId);
      showNotification('Project not found', 'red');
      return;
    }
    
    const form = elements.projectForm;
    if (!form) {
      console.error('Project form not found');
      return;
    }
    
    // Set form values
    form.dataset.editId = project.id;
    form.querySelector('[name="title"]').value = project.title || '';
    form.querySelector('[name="description"]').value = project.description || '';
    
    // Set status, defaulting to 'planning' if not found
    const statusSelect = form.querySelector('[name="status"]');
    if (statusSelect) {
      statusSelect.value = state.statusOptions.some(s => s.id === project.status) 
        ? project.status 
        : 'planning';
    }
    
    // Set course, defaulting to first course if not found
    const courseSelect = form.querySelector('[name="courseId"]');
    if (courseSelect) {
      courseSelect.value = state.courses.some(c => c.id === project.courseId)
        ? project.courseId
        : (state.courses[0]?.id || '');
    }
    
    form.querySelector('[name="dueDate"]').value = project.dueDate || '';
    
    // Handle GitHub link
    const githubLink = project.githubLink || '';
    if (githubLink) {
      // Extract username/repo from full GitHub URL if needed
      const match = githubLink.match(/github\.com\/([^\/]+\/[^\/]+)/);
      if (match && match[1]) {
        form.querySelector('[name="githubLink"]').value = match[1];
      } else {
        form.querySelector('[name="githubLink"]').value = githubLink;
      }
    } else {
      form.querySelector('[name="githubLink"]').value = '';
    }
    
    // Update modal title
    const modalTitle = document.querySelector('#addProjectModal h3');
    if (modalTitle) {
      modalTitle.textContent = 'Edit Project';
    }
    
    if (elements.addProjectModal) {
      elements.addProjectModal.classList.remove('hidden');
      
      // Focus the first input field
      const firstInput = form.querySelector('input, select, textarea');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  } catch (error) {
    console.error('Error in editProject:', error);
    showNotification('Failed to load project for editing', 'red');
  }
};

window.deleteProject = function(projectId) {
  try {
    const project = state.projects.find(p => p.id === projectId);
    if (!project) {
      console.error('Project not found for deletion:', projectId);
      showNotification('Project not found', 'red');
      return;
    }
    
    state.projects = state.projects.filter(p => p.id !== projectId);
    saveState();
    renderProjects();
    showNotification(`Project "${project.title}" deleted successfully!`, 'green');
  } catch (error) {
    console.error('Error deleting project:', error);
    showNotification('Failed to delete project', 'red');
  }
};
