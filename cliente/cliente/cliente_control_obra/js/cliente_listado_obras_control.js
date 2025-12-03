// =============================================
// CLIENTE - LISTADO CONTROL DE OBRAS JS
// =============================================

// Función para el menú lateral
function toggleSubmenu(element) {
    const menuItem = element.parentElement;
    const isActive = menuItem.classList.contains('active');
    
    // Cerrar todos los submenús
    document.querySelectorAll('.menu-item').forEach(item => {
        if (item !== menuItem) {
            item.classList.remove('active');
        }
    });
    
    // Toggle el submenú actual
    menuItem.classList.toggle('active');
}


// Función para colapsar/expandir sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const icon = document.querySelector('.sidebar-toggle i');
    
    sidebar.classList.toggle('collapsed');
    
    // Guardar preferencia
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
}

// Restaurar estado del sidebar al cargar
document.addEventListener('DOMContentLoaded', function() {
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (sidebarCollapsed) {
        document.getElementById('sidebar').classList.add('collapsed');
    }
    
    // Actualizar fecha actual
    updateCurrentDate();
    
    // Configurar filtros
    setupFilters();
    
    // Configurar paginación
    setupPagination();
});

// Función para actualizar la fecha actual
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const date = new Date();
        dateElement.textContent = date.toLocaleDateString('es-CL', options);
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Cerrar menú móvil al hacer clic fuera
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// User Menu
document.getElementById('userMenu').addEventListener('click', function(e) {
    e.stopPropagation();
    this.classList.toggle('active');
});

// Cerrar user menu al hacer clic fuera
document.addEventListener('click', function() {
    document.getElementById('userMenu').classList.remove('active');
});

// Funciones del User Menu
function goToProfile(event) {
    event.preventDefault();
    alert('Navegando al perfil del usuario...');
}

function goToSettings(event) {
    event.preventDefault();
    alert('Navegando a configuración...');
}

function logout(event) {
    event.preventDefault();
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        alert('Cerrando sesión...');
        // Aquí iría la lógica real de logout
        window.location.href = '../login.html';
    }
}

// Función para mostrar notificaciones
function showNotifications() {
    alert('Mostrando notificaciones...\n\n' +
          '• 5 nuevas solicitudes de pedido\n' +
          '• 3 cotizaciones pendientes de revisión\n' +
          '• 2 entregas programadas para hoy\n' +
          '• 1 pago próximo a vencer');
}

// Configurar filtros
function setupFilters() {
    const searchInput = document.getElementById('searchObra');
    const estadoFilter = document.getElementById('filterEstado');
    const ubicacionFilter = document.getElementById('filterUbicacion');
    const tipoFilter = document.getElementById('filterTipo');
    
    // Eventos para filtros
    if (searchInput) {
        searchInput.addEventListener('input', filterObras);
    }
    
    if (estadoFilter) {
        estadoFilter.addEventListener('change', filterObras);
    }
    
    if (ubicacionFilter) {
        ubicacionFilter.addEventListener('change', filterObras);
    }
    
    if (tipoFilter) {
        tipoFilter.addEventListener('change', filterObras);
    }
}

// Función para filtrar obras
function filterObras() {
    const searchText = document.getElementById('searchObra').value.toLowerCase();
    const estado = document.getElementById('filterEstado').value;
    const ubicacion = document.getElementById('filterUbicacion').value;
    const tipo = document.getElementById('filterTipo').value;
    
    const obras = document.querySelectorAll('.obra-card');
    
    obras.forEach(obra => {
        let show = true;
        
        // Filtro por búsqueda de texto
        if (searchText) {
            const nombre = obra.querySelector('.obra-nombre').textContent.toLowerCase();
            const codigo = obra.querySelector('.obra-codigo').textContent.toLowerCase();
            if (!nombre.includes(searchText) && !codigo.includes(searchText)) {
                show = false;
            }
        }
        
        // Filtro por estado
        if (estado && show) {
            const estadoObra = obra.querySelector('.obra-status').classList[1];
            if (estadoObra !== estado) {
                show = false;
            }
        }
        
        // Filtro por ubicación
        if (ubicacion && show) {
            const ubicacionText = obra.querySelector('.detail-item i.fa-map-marker-alt').parentElement.textContent.toLowerCase();
            if (!ubicacionText.includes(ubicacion)) {
                show = false;
            }
        }
        
        // Mostrar u ocultar obra
        obra.style.display = show ? 'block' : 'none';
    });
    
    // Actualizar contador de resultados
    updateResultsCount();
}

// Actualizar contador de resultados
function updateResultsCount() {
    const visibleObras = document.querySelectorAll('.obra-card:not([style*="display: none"])').length;
    const totalObras = document.querySelectorAll('.obra-card').length;
    
    // Aquí podrías actualizar un elemento que muestre el contador
    console.log(`Mostrando ${visibleObras} de ${totalObras} obras`);
}

// Configurar paginación
function setupPagination() {
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                // Remover clase active de todos los botones
                paginationButtons.forEach(btn => btn.classList.remove('active'));
                
                // Agregar clase active al botón clickeado
                if (!this.querySelector('i')) {
                    this.classList.add('active');
                }
                
                // Aquí iría la lógica para cargar la página correspondiente
                console.log('Cargando página:', this.textContent);
            }
        });
    });
}

// Función para exportar reporte
function exportarReporte() {
    const confirmExport = confirm('¿Desea exportar el reporte de control de obras?\n\n' +
                                  'El reporte incluirá:\n' +
                                  '• Listado completo de obras\n' +
                                  '• Estado de materiales por obra\n' +
                                  '• Indicadores de avance\n' +
                                  '• Resumen de entregas pendientes');
    
    if (confirmExport) {
        alert('Generando reporte Excel...\n\n' +
              'El archivo "Control_Obras_' + new Date().toISOString().split('T')[0] + '.xlsx" se descargará en breve.');
    }
}

// Simular carga dinámica de datos (para demostración)
function loadObrasData() {
    // Aquí se cargarían los datos reales desde el servidor
    console.log('Cargando datos de obras...');
}

// Función para actualizar indicadores
function updateIndicators() {
    // Actualizar valores de las tarjetas de resumen
    // En una implementación real, estos datos vendrían del servidor
    
    // Ejemplo de animación de números
    animateValue('obrasActivas', 0, 12, 1000);
    animateValue('valorTotal', 0, 45.2, 1000);
    animateValue('materialesEntregados', 0, 87, 1000);
    animateValue('entregasPendientes', 0, 23, 1000);
}

// Función para animar valores numéricos
function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        
        if (id === 'valorTotal') {
            element.textContent = ' + current.toFixed(1)';
        } else if (id === 'materialesEntregados') {
            element.textContent = Math.round(current) + '%';
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// Función para manejar el click en las obras
function handleObraClick(obraId) {
    // Redirigir al detalle de la obra
    window.location.href = `cliente_detalle_obra_control.html?id=${obraId}`;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos
    loadObrasData();
    
    // Actualizar indicadores
    updateIndicators();
    
    // Configurar tooltips si es necesario
    initializeTooltips();
});

// Función para inicializar tooltips
function initializeTooltips() {
    // Implementación de tooltips personalizados si es necesario
    const elements = document.querySelectorAll('[title]');
    elements.forEach(element => {
        // Aquí se podría implementar un sistema de tooltips personalizado
    });
}

// Función para manejar errores de carga
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
    // Aquí se podría implementar un sistema de notificación de errores al usuario
});


// Exportar funciones si se usa módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleSubmenu,
        toggleSidebar,
        showTab,
        aplicarFiltros,
        exportarInforme,
        exportarExcel
    };    
}