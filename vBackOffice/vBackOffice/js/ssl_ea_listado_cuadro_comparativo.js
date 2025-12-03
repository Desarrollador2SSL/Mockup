/**
 * JavaScript específico para la página de Listado de Cuadros Comparativos
 * SSL v4.0 - Evaluación y Análisis
 */

// ============================================
// GESTIÓN DE FILAS EXPANDIBLES
// ============================================

/**
 * Toggle para expandir/contraer filas de la tabla
 * @param {HTMLElement} row - Fila clickeada
 */
function toggleRow(row) {
    const nextRow = row.nextElementSibling;
    const expandIcon = row.querySelector('.expand-icon');
    
    if (nextRow && nextRow.classList.contains('sub-table')) {
        row.classList.toggle('expanded');
        if (nextRow.style.display === 'table-row') {
            nextRow.style.display = 'none';
        } else {
            nextRow.style.display = 'table-row';
        }
    }
}

// ============================================
// GESTIÓN DE FILTROS
// ============================================

/**
 * Aplicar filtros a la tabla
 */
function applyFilters() {
    const cliente = document.querySelector('select[class*="filter-control"]').value;
    const estado = document.querySelectorAll('select[class*="filter-control"]')[1].value;
    const fecha = document.querySelector('input[type="date"]').value;
    const busqueda = document.querySelector('input[type="text"][placeholder*="Solicitud"]').value;

    console.log('Aplicando filtros:', {
        cliente,
        estado,
        fecha,
        busqueda
    });

    // Aquí iría la lógica de filtrado real
    // Por ejemplo: llamada a API, filtrado client-side, etc.
    
    // Simulación de loading
    showLoadingState();
    
    setTimeout(() => {
        hideLoadingState();
        updateTableData(); // Actualizar datos de tabla
    }, 500);
}

/**
 * Limpiar todos los filtros
 */
function clearFilters() {
    document.querySelectorAll('.filter-control').forEach(control => {
        if (control.tagName === 'SELECT') {
            control.selectedIndex = 0;
        } else {
            control.value = '';
        }
    });
    applyFilters();
}

// ============================================
// GESTIÓN DE PAGINACIÓN
// ============================================

let currentPage = 1;
const itemsPerPage = 10;
const totalPages = 8; // Esto vendría de la respuesta del servidor

/**
 * Cambiar de página
 * @param {number} page - Número de página
 */
function goToPage(page) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    // Actualizar página actual
    currentPage = page;
    
    // Actualizar UI de paginación
    updatePaginationUI();
    
    // Cargar datos de la nueva página
    loadPageData(page);
}

/**
 * Actualizar la UI de paginación
 */
function updatePaginationUI() {
    document.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent == currentPage) {
            btn.classList.add('active');
        }
    });
    
    // Habilitar/deshabilitar botones anterior y siguiente
    const prevBtn = document.querySelector('.pagination-btn:first-child');
    const nextBtn = document.querySelector('.pagination-btn:last-child');
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

/**
 * Cargar datos de una página específica
 * @param {number} page - Número de página
 */
function loadPageData(page) {
    showLoadingState();
    
    // Simulación de carga de datos
    // En producción, esto sería una llamada a API
    setTimeout(() => {
        hideLoadingState();
        console.log(`Datos cargados para página ${page}`);
    }, 300);
}

// ============================================
// ESTADOS DE CARGA
// ============================================

/**
 * Mostrar estado de carga
 */
function showLoadingState() {
    const tableBody = document.querySelector('.comparatives-list tbody');
    if (tableBody) {
        tableBody.style.opacity = '0.5';
        tableBody.style.pointerEvents = 'none';
    }
}

/**
 * Ocultar estado de carga
 */
function hideLoadingState() {
    const tableBody = document.querySelector('.comparatives-list tbody');
    if (tableBody) {
        tableBody.style.opacity = '1';
        tableBody.style.pointerEvents = 'auto';
    }
}

// ============================================
// ACTUALIZACIÓN DINÁMICA DE DATOS
// ============================================

/**
 * Actualizar datos de la tabla
 */
function updateTableData() {
    // Esta función actualizaría los datos de la tabla
    // basándose en los filtros aplicados
    console.log('Actualizando datos de la tabla...');
}

/**
 * Actualizar estadísticas
 */
function updateStatistics() {
    // Simulación de actualización de estadísticas
    const stats = {
        pendientes: Math.floor(Math.random() * 20),
        revision: Math.floor(Math.random() * 10),
        aprobados: Math.floor(Math.random() * 5),
        incompletos: Math.floor(Math.random() * 15)
    };
    
    const statCards = document.querySelectorAll('.stat-number');
    if (statCards.length >= 4) {
        statCards[0].textContent = stats.pendientes;
        statCards[1].textContent = stats.revision;
        statCards[2].textContent = stats.aprobados;
        statCards[3].textContent = stats.incompletos;
    }
}

// ============================================
// ACCIONES DE LA TABLA
// ============================================

/**
 * Ver historial de un cuadro comparativo
 * @param {string} solicitudId - ID de la solicitud
 */
function viewHistory(solicitudId) {
    console.log(`Viendo historial de ${solicitudId}`);
    // Aquí iría la lógica para mostrar el historial
    // Por ejemplo, abrir un modal o navegar a otra página
}

/**
 * Exportar datos a Excel
 */
function exportToExcel() {
    console.log('Exportando a Excel...');
    // Aquí iría la lógica de exportación
    alert('Funcionalidad de exportación en desarrollo');
}

// ============================================
// NOTIFICACIONES EN TIEMPO REAL
// ============================================

/**
 * Simular actualización de notificaciones
 */
function updateNotifications() {
    const notificationCount = document.querySelector('.notification-count');
    if (notificationCount && Math.random() > 0.7) {
        const currentCount = parseInt(notificationCount.textContent);
        notificationCount.textContent = currentCount + 1;
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar event listeners para filtros
    document.querySelectorAll('.filter-control').forEach(control => {
        control.addEventListener('change', applyFilters);
    });
    
    // Buscar button
    const searchBtn = document.querySelector('.filter-section .btn-primary');
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            applyFilters();
        });
    }
    
    // Paginación
    document.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                const pageText = this.textContent.trim();
                
                if (pageText === '‹' || this.querySelector('.fa-chevron-left')) {
                    goToPage(currentPage - 1);
                } else if (pageText === '›' || this.querySelector('.fa-chevron-right')) {
                    goToPage(currentPage + 1);
                } else if (!isNaN(pageText)) {
                    goToPage(parseInt(pageText));
                }
            }
        });
    });
    
    // Actualización periódica de notificaciones
    setInterval(updateNotifications, 30000); // Cada 30 segundos
    
    // Actualización periódica de estadísticas (simulación)
    setInterval(updateStatistics, 60000); // Cada minuto
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + F para enfocar en búsqueda
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.querySelector('input[placeholder*="Solicitud"]');
            if (searchInput) searchInput.focus();
        }
        
        // Esc para cerrar filas expandidas
        if (e.key === 'Escape') {
            document.querySelectorAll('.expandable-row.expanded').forEach(row => {
                toggleRow(row);
            });
        }
    });
    
    // Tooltip para botones de acción
    document.querySelectorAll('.action-buttons .btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (this.title) {
                // Aquí podría implementarse un tooltip personalizado
                console.log('Tooltip:', this.title);
            }
        });
    });
    
    // Auto-save de filtros en localStorage
    const saveFiltersState = () => {
        const filters = {
            cliente: document.querySelector('select[class*="filter-control"]').value,
            estado: document.querySelectorAll('select[class*="filter-control"]')[1].value,
            fecha: document.querySelector('input[type="date"]').value,
            busqueda: document.querySelector('input[placeholder*="Solicitud"]').value
        };
        localStorage.setItem('cuadrosComparativosFilters', JSON.stringify(filters));
    };
    
    // Restaurar filtros guardados
    const restoreFiltersState = () => {
        const saved = localStorage.getItem('cuadrosComparativosFilters');
        if (saved) {
            try {
                const filters = JSON.parse(saved);
                if (filters.cliente) document.querySelector('select[class*="filter-control"]').value = filters.cliente;
                if (filters.estado) document.querySelectorAll('select[class*="filter-control"]')[1].value = filters.estado;
                if (filters.fecha) document.querySelector('input[type="date"]').value = filters.fecha;
                if (filters.busqueda) document.querySelector('input[placeholder*="Solicitud"]').value = filters.busqueda;
            } catch (e) {
                console.error('Error restaurando filtros:', e);
            }
        }
    };
    
    // Guardar filtros cuando cambian
    document.querySelectorAll('.filter-control').forEach(control => {
        control.addEventListener('change', saveFiltersState);
        control.addEventListener('input', saveFiltersState);
    });
    
    // Restaurar filtros al cargar
    restoreFiltersState();
    
    // Click handler para filas (navegación a detalle)
    document.querySelectorAll('.comparatives-list tbody tr:not(.sub-table)').forEach(row => {
        row.addEventListener('dblclick', function(e) {
            // No navegar si se hizo doble click en un botón
            if (!e.target.closest('.action-buttons')) {
                const solicitudId = this.querySelector('strong').textContent;
                console.log(`Navegando a detalle de ${solicitudId}`);
                // window.location.href = `ssl_ea_detalle_cuadro_comparativo.html?id=${solicitudId}`;
            }
        });
    });
    
    console.log('Página de Cuadros Comparativos inicializada');
});

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Formatear montos en moneda chilena
 * @param {number} amount - Monto a formatear
 * @returns {string} Monto formateado
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(amount);
}

/**
 * Formatear fecha
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

/**
 * Calcular porcentaje de progreso
 * @param {number} completed - Elementos completados
 * @param {number} total - Total de elementos
 * @returns {number} Porcentaje
 */
function calculateProgress(completed, total) {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
}

// Exportar funciones para uso global
window.toggleRow = toggleRow;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.goToPage = goToPage;
window.exportToExcel = exportToExcel;
window.viewHistory = viewHistory;