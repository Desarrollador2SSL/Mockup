// ================================
// Cliente - Dashboard JavaScript
// ===============================

// Toggle sidebar collapse
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.querySelector('.sidebar-toggle');
    const isCollapsed = sidebar.classList.contains('collapsed');
    
    if (isCollapsed) {
        sidebar.classList.remove('collapsed');
        localStorage.setItem('sidebarCollapsed', 'false');
    } else {
        sidebar.classList.add('collapsed');
        localStorage.setItem('sidebarCollapsed', 'true');
    }
    
    // Update button icon rotation
    const icon = toggleButton.querySelector('i');
    if (sidebar.classList.contains('collapsed')) {
        icon.style.transform = 'rotate(180deg)';
    } else {
        icon.style.transform = 'rotate(0deg)';
    }
}

// Load sidebar state from localStorage
function loadSidebarState() {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.querySelector('.sidebar-toggle');
    const icon = toggleButton.querySelector('i');
    
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
        icon.style.transform = 'rotate(180deg)';
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Toggle submenu
function toggleSubmenu(header) {
    const menuItem = header.parentElement;
    const sidebar = document.getElementById('sidebar');
    const wasActive = menuItem.classList.contains('active');
    
    // If sidebar is collapsed and clicking on item with submenu, don't expand sidebar
    // Just toggle the submenu
    
    // Close all submenus
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Remove active from all headers
    document.querySelectorAll('.menu-header').forEach(h => {
        h.classList.remove('active');
    });
    
    // If it wasn't active, open it
    if (!wasActive && header.nextElementSibling) {
        menuItem.classList.add('active');
    }
    
    // Always keep the clicked header active if it's a main item
    if (!header.querySelector('.arrow')) {
        header.classList.add('active');
    }
}

// User menu dropdown
const userMenu = document.getElementById('userMenu');
let isUserMenuOpen = false;

userMenu.addEventListener('click', function(e) {
    e.stopPropagation();
    isUserMenuOpen = !isUserMenuOpen;
    this.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!userMenu.contains(e.target) && isUserMenuOpen) {
        userMenu.classList.remove('active');
        isUserMenuOpen = false;
    }
});

// Update date
function updateDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const formattedDate = now.toLocaleDateString('es-CL', options);
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    document.getElementById('currentDate').textContent = capitalizedDate;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateDate();
    loadUserData();
    loadSidebarState();
    
    // Update date every minute
    setInterval(updateDate, 60000);
    
    // Simulate real-time updates
    setInterval(updateMetrics, 30000); // Update every 30 seconds
});

// Load user data
function loadUserData() {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            const userName = user.name || 'Cliente';
            const userEmail = user.email || 'cliente@demo.com';
            
            // Update UI
            document.getElementById('userName').textContent = userName;
            document.getElementById('dropdownUserName').textContent = userName;
            document.getElementById('dropdownUserEmail').textContent = userEmail;
            
            // Update welcome message
            const welcomeText = document.querySelector('.welcome-text h2');
            if (welcomeText) {
                welcomeText.textContent = `¡Bienvenido, ${userName}!`;
            }
            
            // Update initials
            const initial = userName.charAt(0).toUpperCase();
            document.getElementById('userInitial').textContent = initial;
            document.getElementById('dropdownUserInitial').textContent = initial;
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
}

// Update metrics (simulated)
function updateMetrics() {
    // This would normally fetch real data from the server
    const notificationCount = document.querySelector('.notification-count');
    const currentCount = parseInt(notificationCount.textContent);
    const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    const newCount = Math.max(0, currentCount + variation);
    
    if (newCount !== currentCount) {
        notificationCount.textContent = newCount;
        // Add animation
        notificationCount.style.transform = 'scale(1.2)';
        setTimeout(() => {
            notificationCount.style.transform = 'scale(1)';
        }, 300);
    }
}

// Profile function
function goToProfile(e) {
    e.preventDefault();
    alert('Navegando al perfil de usuario...\nEsta funcionalidad estará disponible próximamente.');
    userMenu.classList.remove('active');
    isUserMenuOpen = false;
}

// Settings function
function goToSettings(e) {
    e.preventDefault();
    window.location.href = 'cliente_listado_usuarios.html';
    userMenu.classList.remove('active');
    isUserMenuOpen = false;
}

// Logout function
function logout(e) {
    e.preventDefault();
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        sessionStorage.clear();
        window.location.href = '../index.html';
    }
}

// Show notifications
function showNotifications() {
    alert('Panel de notificaciones\n\nNotificaciones recientes:\n• 3 facturas próximas a vencer\n• 5 cuadros comparativos pendientes\n• Nueva entrega programada\n• OC aprobada por SSL\n\nEsta funcionalidad completa estará disponible próximamente.');
}