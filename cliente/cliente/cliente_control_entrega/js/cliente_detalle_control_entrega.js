// ========================================
// Cliente - Detalle Control Entrega
// ========================================

// Variables globales
let userData = null;
let ocNumber = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    updateDate();
    loadSidebarState();
    
    // Get OC number from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    ocNumber = urlParams.get('oc') || '4500873120';
    document.getElementById('numeroOCCliente').textContent = ocNumber;
    
    // Update date every minute
    setInterval(updateDate, 60000);
    
    // Setup user menu
    const userMenu = document.getElementById('userMenu');
    userMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
    });
    
    // Close user menu when clicking outside
    document.addEventListener('click', function() {
        userMenu.classList.remove('active');
    });
});

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

// Toggle entrega
function toggleEntrega(entregaId) {
    const entrega = document.getElementById(entregaId);
    entrega.classList.toggle('expanded');
}

// Load user data
function loadUserData() {
    const userDataStr = sessionStorage.getItem('userData');
    if (userDataStr) {
        try {
            userData = JSON.parse(userDataStr);
            const userName = userData.name || 'Cliente';
            const userEmail = userData.email || 'cliente@demo.com';
            
            // Update UI
            document.getElementById('userName').textContent = userName;
            document.getElementById('dropdownUserName').textContent = userName;
            document.getElementById('dropdownUserEmail').textContent = userEmail;
            
            // Update initials
            const initial = userName.charAt(0).toUpperCase();
            document.getElementById('userInitial').textContent = initial;
            document.getElementById('dropdownUserInitial').textContent = initial;
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
}        

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

// Navigation functions
function goToProfile(event) {
    event.preventDefault();
    alert('Navegando a Mi Perfil...\nEsta funcionalidad estará disponible próximamente.');
}

function goToSettings(event) {
    event.preventDefault();
    alert('Navegando a Configuración...\nEsta funcionalidad estará disponible próximamente.');
}

function logout(event) {
    event.preventDefault();
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        sessionStorage.clear();
        window.location.href = '../../index.html';
    }
}

// Show notifications
function showNotifications() {
    alert('Panel de notificaciones\n\nEsta funcionalidad estará disponible próximamente.');
}

// Ver detalle de OC
function verDetalleOC() {
    window.location.href = `cliente_detalle_orden_compra.html?numero=${ocNumber}`;
}

// Imprimir control
function imprimirControl() {
    window.print();
}

// Ver documento - MODIFICADO para redirigir a detalle de despacho
function verDocumento(numeroLPE) {
    // Redirigir a la página de detalle de despacho con el número de LPE
    window.location.href = `../cliente_control_recepcion/cliente_detalle_despacho.html?lpe=${numeroLPE}`;
}

// Ver LPE (Listado de Productos Entregados)
function verLPE(numeroLPE) {
    // Redirigir a la página de detalle de despacho con el número de LPE
    window.location.href = `../cliente_control_recepcion/cliente_detalle_despacho.html?lpe=${numeroLPE}`;
}

// Crear incidente
function crearIncidente(numeroLPE) {
    alert(`Creando nuevo incidente para ${numeroLPE}\n\n` +
          'Se podrá registrar:\n' +
          '• Tipo de incidente\n' +
          '• Descripción detallada\n' +
          '• Evidencia fotográfica\n' +
          '• Acciones requeridas\n\n' +
          'Esta funcionalidad abrirá el formulario de registro de incidentes.');
}

// Ver archivos adjuntos
function viewAttachment(filename) {
    alert(`Mostrando archivo: ${filename}\n\n` +
          'Esta funcionalidad permitirá:\n' +
          '• Ver la imagen en tamaño completo\n' +
          '• Descargar el archivo\n' +
          '• Agregar comentarios\n' +
          '• Ver metadatos (fecha, hora, ubicación GPS si está disponible)');
}

// Exportar a Excel
function exportarExcel() {
    alert('Generando reporte Excel...\n\n' +
          'El reporte incluirá:\n' +
          '• Resumen de todas las entregas\n' +
          '• Detalle de todas las recepciones\n' +
          '• Estado de conformidad\n' +
          '• Incidentes reportados\n' +
          '• Documentación asociada\n\n' +
          'Se descargará automáticamente como: Control_Entrega_OC_' + ocNumber + '.xlsx');
}

// Ver certificados
function verCertificados() {
    alert('Mostrando certificados de calidad\n\n' +
          'Documentos disponibles:\n' +
          '• Certificado de calidad del hormigón H25\n' +
          '• Certificado de calidad del hormigón H30\n' +
          '• Certificado del acero A63-42H\n' +
          '• Certificado de tuberías PVC\n\n' +
          'Esta funcionalidad mostrará todos los certificados asociados a los productos recepcionados.');
}

// Scroll to entrega
function scrollToEntrega(entregaId) {
    const entrega = document.getElementById(entregaId);
    if (entrega) {
        // Expandir la entrega si está colapsada
        if (!entrega.classList.contains('expanded')) {
            entrega.classList.add('expanded');
        }
        
        // Hacer scroll con offset para el header fijo
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = entrega.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Resaltar brevemente la entrega
        entrega.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.5)';
        setTimeout(() => {
            entrega.style.boxShadow = '';
        }, 2000);
    }
}

// Rastrear envío
function rastrearEnvio(numeroGuia) {
    alert(`Rastreando envío - Guía N° ${numeroGuia}\n\n` +
          'Estado actual: En tránsito\n' +
          'Ubicación: Ruta 5 Sur, Km 45\n' +
          'Hora estimada de llegada: 14:30 hrs\n\n' +
          'Esta funcionalidad mostrará el tracking en tiempo real del despacho.');
}

// Contactar proveedor
function contactarProveedor() {
    alert('Contactando con SSL...\n\n' +
          'Teléfono: +56 2 2345 6789\n' +
          'Email: despachos@ssl.cl\n' +
          'Horario: Lunes a Viernes 8:00 - 18:00 hrs\n\n' +
          'Esta funcionalidad permitirá comunicación directa con el proveedor.');
}