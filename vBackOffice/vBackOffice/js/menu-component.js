/**
 * Componente de Menú Reutilizable para SSL v4.0
 * Este archivo maneja toda la lógica del menú lateral y header
 */

// Estructura del menú
const menuStructure = {
    header: {
        logo: 'logo_ssl.png',
        title: 'SSL v4.0',
        notifications: 3,
        user: {
            name: 'Usuario SSL',
            email: 'usuario@seashipping.cl'
        }
    },
    sections: [
        {
            id: 'inicio',
            title: 'Inicio',
            icon: 'fa-home',
            items: [
                { id: 'dashboard', text: 'Dashboard General', sigla: 'DSHB', href: '../inicio/ssl_menu.html' },
                { id: 'notificaciones', text: 'Notificaciones', sigla: 'NOTI', disabled: true },
                { id: 'perfil', text: 'Perfil de Usuario', sigla: 'PUSU', disabled: true }
            ]
        },
        {
            id: 'recepcion-solicitudes',
            title: 'Recepción de Solicitudes',
            icon: 'fa-clipboard-list',
            items: [
                { id: 'ingreso-manual', text: 'Ingreso Manual', sigla: 'IMAN', href: '../recepcion-solicitudes/ssl_rs_detalle_solicitud_pedido.html' },
                { id: 'listado-solicitudes', text: 'Listado de Solicitudes', sigla: 'LSOL', href: '../recepcion-solicitudes/ssl_rs_listado_solicitud_pedido.html' }
            ]
        },
        /*{
            id: 'carpeta-digital',
            title: 'Carpeta Digital',
            icon: 'fa-folder-open',
            items: [
                { id: 'carpeta-digital-item', text: 'Carpeta Digital', sigla: 'CDIG', href: 'ssl_listado_carpeta_digital.html' }
            ]
        },*/
        {
            id: 'cotizacion-proveedores',
            title: 'Cotización a Proveedores',
            icon: 'fa-file-invoice-dollar',
            items: [
                { id: 'generacion-distribucion', text: 'Generación y Distribución', sigla: 'GDIS', href: '../cotizacion-proveedores/ssl_cp_listado_solicitudes_cotizar.html' },
                { id: 'recepcion-cotizaciones', text: 'Recepción de Cotizaciones', sigla: 'RCOT', href: '../cotizacion-proveedores/ssl_cp_listado_recepcion_respuesta.html' }
            ]
        },
        {
            id: 'evaluacion-analisis',
            title: 'Evaluación y Análisis',
            icon: 'fa-chart-line',
            items: [
                { id: 'cuadros-comparativos', text: 'Cuadros Comparativos', sigla: 'CCOM', href: '../evaluacion-analisis/ssl_ea_listado_cuadro_comparativo.html' }
                /* { id: 'margenes-rentabilidad', text: 'Márgenes y Rentabilidad', sigla: 'MREN', disabled: true }*/
            ]
        },
        {
            id: 'ordenes-compra',
            title: 'Órdenes de Compra',
            icon: 'fa-shopping-cart',
            items: [
                { id: 'oc-cliente', text: 'OC Cliente', sigla: 'OCCL', href: '../ordenes-compra/ssl_oc_listado_oc_cliente.html' },
                { id: 'oc-proveedor', text: 'OC Proveedor', sigla: 'OCPR', href: '../ordenes-compra/ssl_oc_listado_oc_proveedor.html' }
                /*{ id: 'gestion-cambios', text: 'Gestión de Cambios', sigla: 'GCAM', disabled: true }*/
            ]
        },
        {
            id: 'gestion-logistica',
            title: 'Gestión Logística',
            icon: 'fa-truck',
            items: [
                { id: 'planificacion-logistica', text: 'Planificación Logística (Swisslog)', sigla: 'PLOG', disabled: true },
                { id: 'seguimiento-entregas', text: 'Seguimiento de Entregas', sigla: 'SENT', disabled: true }
            ]
        },
        {
            id: 'zona-franca',
            title: 'Zona Franca',
            icon: 'fa-warehouse',
            items: [
                { id: 'declaraciones', text: 'Declaraciones DI/DSZF', sigla: 'DZF', disabled: true },
                { id: 'documentos-aduaneros', text: 'Documentos Aduaneros', sigla: 'DADU', disabled: true },
                { id: 'alertas-condiciones', text: 'Alertas y Condiciones ZF', sigla: 'ACZF', disabled: true }
            ]
        },
        {
            id: 'entregas-conformidad',
            title: 'Entregas y Conformidad',
            icon: 'fa-box-open',
            items: [
                { id: 'confirmacion-cliente', text: 'Confirmación Cliente', sigla: 'CCLI', disabled: true },
                { id: 'gestion-incidencias', text: 'Gestión de Incidencias', sigla: 'GINC', disabled: true },
                { id: 'documentacion-firmada', text: 'Documentación Firmada', sigla: 'DFIR', disabled: true }
            ]
        },
        {
            id: 'reportes-bi',
            title: 'Reportes y BI',
            icon: 'fa-chart-pie',
            items: [
                { id: 'kpi-operacionales', text: 'KPI Operacionales', sigla: 'KPIO', disabled: true },
                { id: 'metricas-cliente-proveedor', text: 'Métricas por Cliente / Proveedor', sigla: 'MCLP', disabled: true },
                { id: 'analisis-avanzado', text: 'Análisis Avanzado', sigla: 'AAVA', disabled: true }
            ]
        },
        {
            id: 'usuarios-accesos',
            title: 'Usuarios y Accesos',
            icon: 'fa-users',
            items: [
                { id: 'gestion-usuarios', text: 'Gestión de Usuarios', sigla: 'GUSU', disabled: true },
                { id: 'perfiles-roles', text: 'Perfiles y Roles', sigla: 'PERO', disabled: true }
            ]
        },
        {
            id: 'empresas-organizaciones',
            title: 'Empresas y Organizaciones',
            icon: 'fa-building',
            items: [
                { id: 'clientes-proveedores', text: 'Clientes y Proveedores', sigla: 'CLPR', href: '../empresas-organizaciones/ssl_eo_listado_cliente_proveedor.html' },
                { id: 'obras-proyectos', text: 'Obras y Proyectos', sigla: 'OBPR', href: '../empresas-organizaciones/ssl_eo_listado_obras.html' }
                /*{ id: 'transportistas-financieras', text: 'Transportistas / Financieras', sigla: 'TRFIN', disabled: true }*/
            ]
        },
        {
            id: 'catalogos-configuracion',
            title: 'Catálogos y Configuración',
            icon: 'fa-cogs',
            items: [
                { id: 'catalogo-maestro', text: 'Catálogo Maestro', sigla: 'CMAE', href: '../catalogos-configuracion/ssl_cc_listado_productos.html' }
                /*{ id: 'divisas-parametros', text: 'Divisas y Parámetros Globales', sigla: 'CDIP', disabled: true },*/
                /*{ id: 'zona-franca-config', text: 'Zona Franca (ZF)', sigla: 'CZFR', disabled: true },
                { id: 'flujos-aprobacion', text: 'Flujos de Aprobación', sigla: 'CFLU', disabled: true }*/
            ]
        },
        {
            id: 'administracion',
            title: 'Administración',
            icon: 'fa-sliders-h',
            items: [
                { id: 'parametros-comerciales', text: 'Parámetros Comerciales', sigla: 'APAR', disabled: true },
                { id: 'limites-credito', text: 'Límites de Crédito', sigla: 'ALCR', disabled: true },
                { id: 'condiciones-pago', text: 'Condiciones de Pago', sigla: 'ACON', disabled: true }
            ]
        },
        {
            id: 'auditoria-seguridad',
            title: 'Auditoría y Seguridad',
            icon: 'fa-shield-alt',
            items: [
                { id: 'exportacion-auditorias', text: 'Exportación Auditorías', sigla: 'AEXP', disabled: true },
                { id: 'politicas-backup', text: 'Políticas de Backup', sigla: 'APOL', disabled: true }
            ]
        }
    ]
};

// Función para cargar el menú
function loadMenu(activeSectionId = null, activeItemId = null) {
    const container = document.getElementById('menu-container');
    if (!container) return;
    
    container.innerHTML = `
        ${createHeader()}
        <div class="container">
            ${createSidebar(activeSectionId, activeItemId)}
            ${createToggleButton()}
        </div>
    `;
    
    // Inicializar funciones del menú después de cargar el HTML
    setTimeout(() => {
        loadSidebarState();
        initUserMenu();
        updateDate();
        setInterval(updateDate, 60000);
    }, 0);
}

// Crear el header
function createHeader() {
    return `
    <header class="header">
        <div class="menu-toggle" onclick="toggleMobileMenu()">
            <i class="fas fa-bars"></i>
        </div>
        <div class="logo">
            <img src="${menuStructure.header.logo}" alt="SSL Logo">
            <h1>${menuStructure.header.title}</h1>
        </div>
        <div class="header-right">
            <div class="header-date" data-time="Hora actual: 00:00">
                <i class="fas fa-calendar-alt"></i>
                <span id="currentDate">Lunes, 26 de Mayo de 2025</span>
            </div>
            <div class="notifications">
                <i class="fas fa-bell"></i>
                <span class="notification-count">${menuStructure.header.notifications}</span>
            </div>
            <div class="user-menu" id="userMenu">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <span class="user-name">${menuStructure.header.user.name}</span>
                <i class="fas fa-chevron-down user-menu-arrow"></i>
                
                <div class="user-dropdown">
                    <div class="dropdown-header">
                        <div class="dropdown-user-info">
                            <div class="dropdown-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="dropdown-user-details">
                                <div class="dropdown-user-name">${menuStructure.header.user.name}</div>
                                <div class="dropdown-user-email">${menuStructure.header.user.email}</div>
                            </div>
                        </div>
                    </div>
                    <div class="dropdown-menu">
                        <a href="#" class="dropdown-item" onclick="goToProfile(event)">
                            <i class="fas fa-user-circle"></i>
                            <span>Mi Perfil</span>
                        </a>
                        <a href="#" class="dropdown-item" onclick="goToSettings(event)">
                            <i class="fas fa-cog"></i>
                            <span>Configuración</span>
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item logout" onclick="logout(event)">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Cerrar Sesión</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </header>`;
}

// Crear el sidebar
function createSidebar(activeSectionId, activeItemId) {
    const menuItems = menuStructure.sections.map(section => {
        const isActive = section.id === activeSectionId;
        const sectionClass = isActive ? ' active' : '';
        
        const items = section.items.map(item => {
            const isItemActive = item.id === activeItemId;
            const itemClass = isItemActive ? ' active' : '';
            const disabledClass = item.disabled ? ' disabled' : '';
            const disabledAttr = item.disabled ? ' title="Próximamente"' : '';
            
            if (item.disabled) {
                return `
                <div class="submenu-item${disabledClass}"${disabledAttr}>
                    <span class="full-text">${item.text}</span>
                    <span class="siglas">${item.sigla}</span>
                    <div class="sigla-tooltip">${item.text}</div>
                </div>`;
            } else {
                return `
                <a href="${item.href || '#'}" class="submenu-item${itemClass}">
                    <span class="full-text">${item.text}</span>
                    <span class="siglas">${item.sigla}</span>
                    <div class="sigla-tooltip">${item.text}</div>
                </a>`;
            }
        }).join('');
        
        return `
        <li class="menu-item${sectionClass}">
            <div class="menu-header${isActive ? ' active' : ''}" onclick="toggleSubmenu(this)">
                <i class="fas ${section.icon}"></i>
                <span>${section.title}</span>
                <i class="fas fa-chevron-right arrow"></i>
                <div class="menu-tooltip">${section.title}</div>
            </div>
            <div class="submenu">
                ${items}
            </div>
        </li>`;
    }).join('');
    
    return `
    <nav class="sidebar" id="sidebar">
        <ul class="menu">
            ${menuItems}
        </ul>
    </nav>`;
}

// Crear botón de toggle
function createToggleButton() {
    return `
    <div class="sidebar-toggle" onclick="toggleSidebar()">
        <i class="fas fa-chevron-left"></i>
    </div>`;
}

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
    
    if (sidebar && toggleButton) {
        const icon = toggleButton.querySelector('i');
        
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
            icon.style.transform = 'rotate(180deg)';
        }
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
    const wasActive = menuItem.classList.contains('active');
    
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

// User menu dropdown functionality
function initUserMenu() {
    const userMenu = document.getElementById('userMenu');
    let isUserMenuOpen = false;

    if (userMenu) {
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

        // Prevent dropdown from closing when clicking inside
        const dropdown = document.querySelector('.user-dropdown');
        if (dropdown) {
            dropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }
}

// Profile function
function goToProfile(e) {
    e.preventDefault();
    alert('Navegando al perfil de usuario...\nEsta funcionalidad estará disponible próximamente.');
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenu.classList.remove('active');
    }
}

// Settings function
function goToSettings(e) {
    e.preventDefault();
    alert('Navegando a configuración...\nEsta funcionalidad estará disponible próximamente.');
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenu.classList.remove('active');
    }
}

// Logout function
function logout(e) {
    e.preventDefault();
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        sessionStorage.clear();
        window.location.href = '../index.html';
    }
}

// Function to update date
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
    
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const formattedTime = now.toLocaleTimeString('es-CL', timeOptions);
    
    const dateElement = document.getElementById('currentDate');
    const dateContainer = document.querySelector('.header-date');
    
    if (dateContainer) {
        dateContainer.setAttribute('data-time', `Hora actual: ${formattedTime}`);
    }
    
    if (dateElement) {
        dateElement.style.opacity = '0.5';
        setTimeout(() => {
            dateElement.textContent = capitalizedDate;
            dateElement.style.opacity = '0.9';
        }, 150);
    }
}

// Export for external use
window.SSLMenu = {
    load: loadMenu,
    toggleSidebar: toggleSidebar,
    toggleMobileMenu: toggleMobileMenu,
    toggleSubmenu: toggleSubmenu,
    updateDate: updateDate
};