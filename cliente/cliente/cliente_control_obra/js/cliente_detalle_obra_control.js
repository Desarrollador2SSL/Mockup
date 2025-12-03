// =============================================
// CLIENTE - DETALLE CONTROL DE OBRA JS
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
    
    // Cargar datos de la obra
    loadObraData();
    
    // Configurar filtros
    setupFilters();
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
        window.location.href = '../login.html';
    }
}

// Función para mostrar notificaciones
function showNotifications() {
    alert('Mostrando notificaciones...\n\n' +
          '• 5 entregas pendientes esta semana\n' +
          '• 2 productos sin programación de entrega\n' +
          '• 1 solicitud de pedido en borrador\n' +
          '• 3 productos próximos a entregarse');
}

// Cargar datos de la obra
function loadObraData() {
    // Obtener ID de la obra desde URL
    const urlParams = new URLSearchParams(window.location.search);
    const obraId = urlParams.get('id');
    
    // En una implementación real, aquí se cargarían los datos del servidor
    console.log('Cargando datos de la obra:', obraId);
}

// Configurar filtros
function setupFilters() {
    const searchInput = document.getElementById('searchProducto');
    const categoriaFilter = document.getElementById('filterCategoria');
    const estadoFilter = document.getElementById('filterEstado');
    
    if (searchInput) {
        searchInput.addEventListener('input', aplicarFiltros);
    }
    
    if (categoriaFilter) {
        categoriaFilter.addEventListener('change', aplicarFiltros);
    }
    
    if (estadoFilter) {
        estadoFilter.addEventListener('change', aplicarFiltros);
    }
}

// Función para aplicar filtros
function aplicarFiltros() {
    const searchText = document.getElementById('searchProducto').value.toLowerCase();
    const categoria = document.getElementById('filterCategoria').value;
    const estado = document.getElementById('filterEstado').value;
    
    const rows = document.querySelectorAll('.control-table tbody tr');
    
    rows.forEach(row => {
        let show = true;
        
        // Filtro por búsqueda de texto
        if (searchText) {
            const codigo = row.cells[0].textContent.toLowerCase();
            const descripcion = row.cells[1].textContent.toLowerCase();
            if (!codigo.includes(searchText) && !descripcion.includes(searchText)) {
                show = false;
            }
        }
        
        // Filtro por categoría
        if (categoria && show) {
            const catBadge = row.querySelector('.category-badge');
            if (catBadge && !catBadge.classList.contains(categoria)) {
                show = false;
            }
        }
        
        // Filtro por estado
        if (estado && show) {
            // Lógica para filtrar por estado
            const cantRequerida = parseInt(row.cells[4].textContent);
            const cantSolicitada = parseInt(row.cells[5].textContent) || 0;
            const cantComprada = parseInt(row.cells[6].textContent) || 0;
            const cantEntregada = parseInt(row.cells[7].textContent) || 0;
            const cantPendiente = parseInt(row.cells[8].textContent) || 0;
            
            switch(estado) {
                case 'requerido':
                    show = cantRequerida > 0 && cantSolicitada === 0;
                    break;
                case 'solicitado':
                    show = cantSolicitada > 0;
                    break;
                case 'comprado':
                    show = cantComprada > 0;
                    break;
                case 'entregado':
                    show = cantEntregada === cantRequerida;
                    break;
                case 'pendiente':
                    show = cantPendiente > 0;
                    break;
            }
        }
        
        // Mostrar u ocultar fila
        row.style.display = show ? '' : 'none';
    });
    
    // Actualizar contador
    updateFilteredCount();
}

// Actualizar contador de resultados filtrados
function updateFilteredCount() {
    const visibleRows = document.querySelectorAll('.control-table tbody tr:not([style*="display: none"])').length;
    const totalRows = document.querySelectorAll('.control-table tbody tr').length;
    console.log(`Mostrando ${visibleRows} de ${totalRows} productos`);
}

// Función para cambiar de tab
function showTab(tabName) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Desactivar todos los botones
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Mostrar el tab seleccionado
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Activar el botón correspondiente
    event.target.classList.add('active');
}

// Funciones de exportación
function exportarInforme() {
    if (confirm('¿Desea generar el informe PDF de la obra?\n\n' +
                'El informe incluirá:\n' +
                '• Información general de la obra\n' +
                '• Estado de control de materiales\n' +
                '• Resumen de solicitudes y OC\n' +
                '• Planificación de entregas')) {
        alert('Generando informe PDF...\n\n' +
              'El archivo "Informe_Torre_Providencia_' + new Date().toISOString().split('T')[0] + '.pdf" se descargará en breve.');
    }
}

function exportarExcel() {
    if (confirm('¿Desea exportar el control de materiales a Excel?\n\n' +
                'El archivo incluirá:\n' +
                '• Listado completo de materiales\n' +
                '• Estado de cada producto\n' +
                '• Cantidades y entregas\n' +
                '• Resumen por categorías')) {
        alert('Generando archivo Excel...\n\n' +
              'El archivo "Control_Materiales_Torre_Providencia_' + new Date().toISOString().split('T')[0] + '.xlsx" se descargará en breve.');
    }
}

// Funciones para acciones de productos
function verDetalle(codigo) {
    alert(`Mostrando detalle del producto ${codigo}\n\n` +
          'Esta vista mostrará:\n' +
          '• Historial completo del producto\n' +
          '• Solicitudes asociadas\n' +
          '• Órdenes de compra\n' +
          '• Entregas realizadas y pendientes\n' +
          '• Documentación relacionada');
}

function crearSolicitud(codigo) {
    if (confirm(`¿Desea crear una solicitud de pedido para ${codigo}?\n\n` +
                'Se abrirá el formulario de nueva solicitud con este producto agregado.')) {
        window.location.href = `../cliente_solicitud_pedido/cliente_nueva_solicitud.html?producto=${codigo}&obra=OBR-2025-001`;
    }
}

// Funciones para solicitudes
function nuevaSolicitud() {
    window.location.href = '../cliente_solicitud_pedido/cliente_nueva_solicitud.html?obra=OBR-2025-001';
}

function verSolicitud(numero) {
    window.location.href = `../cliente_solicitud_pedido/cliente_detalle_solicitud.html?numero=${numero}`;
}

function editarSolicitud(numero) {
    window.location.href = `../cliente_solicitud_pedido/cliente_editar_solicitud.html?numero=${numero}`;
}

// Funciones para órdenes de compra
function verOC(numero) {
    window.location.href = `../cliente_orden_compra/cliente_detalle_orden_compra.html?numero=${numero}`;
}

function verControlEntrega(numero) {
    window.location.href = `../cliente_control_entrega/cliente_detalle_control_entrega.html?oc=${numero}`;
}

// Funciones para vista de entregas
function changeView(viewType) {
    // Ocultar todas las vistas
    document.querySelectorAll('.delivery-view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Desactivar todos los botones de vista
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar la vista seleccionada
    if (viewType === 'calendario') {
        document.getElementById('vista-calendario').classList.add('active');
    } else {
        document.getElementById('vista-lista').classList.add('active');
    }
    
    // Activar el botón correspondiente
    event.target.classList.add('active');
}

// Funciones del calendario
function previousMonth() {
    alert('Mostrando mes anterior...');
}

function nextMonth() {
    alert('Mostrando mes siguiente...');
}

// Funciones de entregas
function verDetalleEntrega(entregaId) {
    alert(`Mostrando detalle de la entrega ${entregaId}\n\n` +
          'Esta vista mostrará:\n' +
          '• Información completa de la entrega\n' +
          '• Productos incluidos\n' +
          '• Documentos de respaldo\n' +
          '• Estado y observaciones');
}

function confirmarEntrega(entregaId) {
    if (confirm(`¿Confirmar la entrega ${entregaId}?\n\n` +
                'Se notificará al proveedor y se actualizará el estado.')) {
        alert('Entrega confirmada exitosamente.\n\n' +
              'Se ha enviado notificación al proveedor.');
    }
}

function programarEntrega(entregaId) {
    const fecha = prompt('Ingrese la fecha de entrega (DD/MM/AAAA):');
    const hora = prompt('Ingrese la hora de entrega (HH:MM):');
    
    if (fecha && hora) {
        alert(`Entrega programada para:\n` +
              `Fecha: ${fecha}\n` +
              `Hora: ${hora}\n\n` +
              'Se ha notificado al proveedor y al responsable de obra.');
    }
}

// Inicializar tooltips o elementos interactivos adicionales
function initializeInteractiveElements() {
    // Aquí se pueden inicializar tooltips, modales, etc.
    console.log('Elementos interactivos inicializados');
}

// Llamar a la inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeInteractiveElements();
});

// Manejar errores
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
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