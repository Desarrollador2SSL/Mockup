/**
 * ssl_crear_solicitud_cotizacion.js
 * Funcionalidad específica para la página de Crear Solicitud de Cotización
 */

// Namespace para funciones de la página
const SolicitudCotizacion = {
    // Variables globales
    selectedProviders: {},
    selectedProducts: [],
    productIndex: 0,
    modo: 'crear', // crear, editar, ver
    
    // Datos de proveedores disponibles
    proveedoresDisponibles: [
        {
            id: '1',
            codigo: 'P001',
            nombre: 'CEMENTOS BIO BIO S.A.',
            rut: '91.755.000-K',
            sucursal: 'Casa Matriz',
            encargado: 'Juan Pérez',
            email: 'jperez@cbb.cl',
            celular: '+56 9 8765 4321',
            lcDisponible: 50000000
        },
        {
            id: '2',
            codigo: 'P002',
            nombre: 'FERRETERÍA INDUSTRIAL LTDA.',
            rut: '76.123.456-7',
            sucursal: 'Sucursal Santiago',
            encargado: 'María González',
            email: 'mgonzalez@ferreteria.cl',
            celular: '+56 9 9876 5432',
            lcDisponible: 35000000
        },
        {
            id: '3',
            codigo: 'P003',
            nombre: 'MATERIALES DEL SUR S.A.',
            rut: '85.741.963-2',
            sucursal: 'Casa Matriz',
            encargado: 'Carlos Rodríguez',
            email: 'crodriguez@materialsur.cl',
            celular: '+56 9 8765 1234',
            lcDisponible: 28500000
        }
    ],
    
    // Productos disponibles
    productosDisponibles: [
        {
            codCliente: 'CLI-001',
            descCliente: 'Cable eléctrico 3x10 cliente',
            codSSL: 'EL-1245',
            descSSL: 'Cable eléctrico NYY 3x10mm2 0.6/1kV',
            um: 'MT',
            cantidad: 100,
            fechaReq: '2025-05-22'
        },
        {
            codCliente: 'CLI-002',
            descCliente: 'Tubo conduit 25mm cliente',
            codSSL: 'EL-0876',
            descSSL: 'Tubo Conduit PVC 25mm',
            um: 'UN',
            cantidad: 50,
            fechaReq: '2025-05-22'
        },
        {
            codCliente: 'CLI-CN-001',
            descCliente: 'Cemento bolsa 25kg',
            codSSL: 'CN-1001',
            descSSL: 'Cemento Portland tipo I - Saco 25kg',
            um: 'UN',
            cantidad: 150,
            fechaReq: '2025-05-25'
        }
    ],
    
    // Inicialización
    init() {
        console.log('Inicializando SolicitudCotizacion...');
        
        this.setupEventListeners();
        this.checkUrlParams();
        this.setupDefaultDates();
        
        // Cargar proveedores y productos
        this.loadProviderList(() => {
            console.log('Proveedores cargados, modo actual:', this.modo);
            
            this.loadProductsModal();
            
            // Ejecutar acciones según el modo
            if (this.modo === 'crear') {
                console.log('Modo crear - Lista de proveedores disponible para selección manual');
                // En modo crear, solo mostrar la lista vacía para que el usuario seleccione
                this.actualizarResumen(); // Inicializar resumen en 0
            } else if (this.modo === 'ver' || this.modo === 'editar') {
                // Cargar datos existentes para ver o editar
                const urlParams = new URLSearchParams(window.location.search);
                const correlativo = urlParams.get('correlativo') || '003';
                console.log('Cargando datos existentes para correlativo:', correlativo);
                this.cargarDatosExistentes(correlativo);
            }
        });
    },
    
    // Configurar event listeners
    setupEventListeners() {
        // Form submit
        const form = document.getElementById('cotizacionForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        // File upload
        const fileUpload = document.getElementById('file-upload');
        if (fileUpload) {
            fileUpload.addEventListener('change', (e) => this.handleFiles(e.target.files));
        }
        
        // Drag and drop
        const uploadArea = document.getElementById('fileUploadArea');
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => this.dragOverHandler(e));
            uploadArea.addEventListener('dragenter', (e) => this.dragEnterHandler(e));
            uploadArea.addEventListener('dragleave', (e) => this.dragLeaveHandler(e));
            uploadArea.addEventListener('drop', (e) => this.dropHandler(e));
        }
        
        // Modal close on outside click
        window.onclick = (event) => {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        };
    },
    
    // Verificar parámetros de URL
    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const solicitud = urlParams.get('solicitud') || 'SOL-2025-0001';
        const correlativo = urlParams.get('correlativo') || '003';
        const modoParam = urlParams.get('mode') || urlParams.get('modo') || 'crear';
        
        // Normalizar el modo
        if (modoParam === 'new') {
            this.modo = 'crear';
        } else if (modoParam === 'view' || modoParam === 'ver') {
            this.modo = 'ver';
        } else if (modoParam === 'edit' || modoParam === 'editar') {
            this.modo = 'editar';
        } else {
            this.modo = modoParam;
        }
        
        // Si viene desde la página de recepción de respuestas
        const proveedor = urlParams.get('proveedor');
        const cotizacion = urlParams.get('cotizacion');
        
        document.getElementById('numeroSolicitud').textContent = solicitud;
        document.getElementById('correlativo').textContent = correlativo;
        
        console.log('Modo actual:', this.modo); // Debug
        
        // Ajustar interfaz según modo
        if (this.modo === 'ver') {
            this.setupViewMode();
        } else if (this.modo === 'editar') {
            this.setupEditMode(correlativo);
        } else if (this.modo === 'crear') {
            document.getElementById('pageTitle').textContent = 'Nueva Solicitud de Cotización';
        }
    },
    
    // Configurar modo vista
    setupViewMode() {
        document.getElementById('pageTitle').textContent = 'Ver Solicitud de Cotización';
        
        // Deshabilitar todos los campos
        document.querySelectorAll('input, select, textarea').forEach(el => {
            el.disabled = true;
        });
        
        // Ocultar botones de acción excepto cancelar
        const warningBtn = document.querySelector('.btn-warning');
        const successBtn = document.querySelector('.btn-success');
        const primaryBtn = document.querySelector('.action-buttons .btn-primary');
        
        if (warningBtn) warningBtn.style.display = 'none';
        if (successBtn) successBtn.style.display = 'none';
        if (primaryBtn) primaryBtn.style.display = 'none';
        
        // Deshabilitar botón de agregar producto
        const addProductBtn = document.querySelector('button[onclick*="agregarProducto"]');
        if (addProductBtn) {
            addProductBtn.disabled = true;
            addProductBtn.style.display = 'none';
        }
        
        // Deshabilitar interacción con proveedores
        document.querySelectorAll('.provider-item').forEach(item => {
            item.style.pointerEvents = 'none';
            item.style.opacity = '0.8';
        });
    },
    
    // Configurar modo edición
    setupEditMode(correlativo) {
        document.getElementById('pageTitle').textContent = 'Editar Solicitud de Cotización';
        // Cargar datos existentes
        this.cargarDatosExistentes(correlativo);
    },
    
    // Configurar fechas por defecto
    setupDefaultDates() {
        // Fecha de entrega (próxima semana)
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        document.getElementById('fechaEntrega').value = nextWeek.toISOString().split('T')[0];
        
        // Fecha límite para cotizar (15 días)
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + 15);
        document.getElementById('fechaLimite').textContent = fechaLimite.toLocaleDateString('es-CL');
    },
    
    // Cargar lista de proveedores
    loadProviderList(callback) {
        const providerList = document.getElementById('providerList');
        
        if (!providerList) {
            console.error('No se encontró el contenedor providerList');
            return;
        }
        
        console.log('Cargando', this.proveedoresDisponibles.length, 'proveedores...');
        
        providerList.innerHTML = '';
        
        this.proveedoresDisponibles.forEach((proveedor, index) => {
            const providerItem = document.createElement('div');
            providerItem.className = 'provider-item';
            providerItem.setAttribute('data-provider-id', proveedor.id);
            
            providerItem.innerHTML = `
                <div class="provider-name">
                    <input type="checkbox" id="prov${proveedor.id}" value="${proveedor.id}" style="margin-right: 10px;" onclick="event.stopPropagation()">
                    ${proveedor.nombre}
                </div>
                <div class="provider-info">
                    <span><i class="fas fa-id-card"></i> RUT: ${proveedor.rut}</span>
                    <span><i class="fas fa-building"></i> ${proveedor.sucursal}</span>
                    <span><i class="fas fa-credit-card"></i> LC: ${this.formatearMonto(proveedor.lcDisponible)}</span>
                </div>
            `;
            
            // Agregar evento click al div completo
            providerItem.addEventListener('click', (event) => {
                // Solo procesar si no se hizo click en el checkbox
                if (event.target.type !== 'checkbox') {
                    this.toggleProvider(providerItem, proveedor.id);
                }
            });
            
            // Agregar evento al checkbox
            const checkbox = providerItem.querySelector(`#prov${proveedor.id}`);
            checkbox.addEventListener('change', (event) => {
                this.toggleProvider(providerItem, proveedor.id);
            });
            
            providerList.appendChild(providerItem);
            console.log('Proveedor agregado:', proveedor.nombre);
        });
        
        console.log('Lista de proveedores cargada');
        
        // Ejecutar callback si existe
        if (callback && typeof callback === 'function') {
            setTimeout(callback, 100);
        }
    },
    
    // Cargar modal de productos
    loadProductsModal() {
        const productosDiv = document.getElementById('productosDisponibles');
        if (!productosDiv) return;
        
        productosDiv.innerHTML = '';
        
        this.productosDisponibles.forEach(producto => {
            const productoItem = document.createElement('div');
            productoItem.className = 'provider-item';
            productoItem.onclick = () => this.seleccionarProducto(producto);
            
            productoItem.innerHTML = `
                <div class="provider-name">${producto.codCliente} - ${producto.descCliente}</div>
                <div class="provider-info">
                    <span>SSL: ${producto.codSSL}</span>
                    <span>Cantidad: ${producto.cantidad} ${producto.um}</span>
                    <span>Fecha Req: ${new Date(producto.fechaReq).toLocaleDateString('es-CL')}</span>
                </div>
            `;
            
            productosDiv.appendChild(productoItem);
        });
    },
    
    // Cargar datos existentes (simulación)
    cargarDatosExistentes(correlativo) {
        // Datos de ejemplo para diferentes correlativos
        const datosGuardados = {
            '001': {
                proveedores: ['1', '2'],
                productos: [0, 1], // índices de productos
                tipoFactura: 'AFECTA',
                condicionesEntrega: 'puesto-obra',
                formaPago: '30-dias',
                infoAdicional: 'Entrega urgente requerida. Favor considerar acceso restringido a la obra.'
            },
            '002': {
                proveedores: ['2', '3'],
                productos: [1, 2],
                tipoFactura: 'EXENTA',
                condicionesEntrega: 'retiro-tienda',
                formaPago: '60-dias',
                infoAdicional: 'Productos deben venir con certificación de calidad.'
            },
            '003': {
                proveedores: ['1', '3'],
                productos: [0, 2],
                tipoFactura: 'AFECTA',
                condicionesEntrega: 'puesto-obra',
                formaPago: '30-dias',
                infoAdicional: 'Coordinar entrega con jefe de obra Sr. Juan Pérez.'
            }
        };
        
        const datos = datosGuardados[correlativo];
        if (!datos) return;
        
        // Cargar condiciones
        if (document.getElementById('tipoFactura')) {
            document.getElementById('tipoFactura').value = datos.tipoFactura;
        }
        if (document.getElementById('condicionesEntrega')) {
            document.getElementById('condicionesEntrega').value = datos.condicionesEntrega;
        }
        if (document.getElementById('formaPago')) {
            document.getElementById('formaPago').value = datos.formaPago;
        }
        if (document.getElementById('infoAdicional')) {
            document.getElementById('infoAdicional').value = datos.infoAdicional;
        }
        
        // Cargar proveedores
        setTimeout(() => {
            datos.proveedores.forEach(proveedorId => {
                const checkbox = document.getElementById(`prov${proveedorId}`);
                if (checkbox) {
                    checkbox.checked = true;
                    const providerItem = checkbox.closest('.provider-item');
                    if (providerItem) {
                        providerItem.classList.add('selected');
                        this.agregarProveedorTabla(proveedorId);
                    }
                }
            });
            
            // Cargar productos
            datos.productos.forEach((productoIndex, i) => {
                setTimeout(() => {
                    const producto = this.productosDisponibles[productoIndex];
                    if (producto) {
                        // Agregar producto con valor referencial si es modo edición/vista
                        const tbody = document.getElementById('productTableBody');
                        const row = document.createElement('tr');
                        row.id = `product-row-${this.productIndex}`;
                        
                        // Valores referenciales de ejemplo
                        const valoresRef = [15000, 8500, 3200];
                        
                        row.innerHTML = `
                            <td style="text-align: center;">
                                <input type="checkbox" checked onchange="SolicitudCotizacion.actualizarResumen()" ${this.modo === 'ver' ? 'disabled' : ''}>
                            </td>
                            <td>${producto.codCliente}</td>
                            <td>${producto.descCliente}</td>
                            <td>${producto.codSSL}</td>
                            <td>${producto.descSSL}</td>
                            <td>${producto.um}</td>
                            <td>
                                <input type="number" value="${producto.cantidad}" min="1" class="form-control" onchange="SolicitudCotizacion.actualizarResumen()" ${this.modo === 'ver' ? 'disabled' : ''}>
                            </td>
                            <td>
                                <input type="date" value="${producto.fechaReq}" class="form-control" ${this.modo === 'ver' ? 'disabled' : ''}>
                            </td>
                            <td>
                                <input type="number" value="${valoresRef[productoIndex] || 0}" min="0" class="form-control" placeholder="Opcional" onchange="SolicitudCotizacion.actualizarResumen()" ${this.modo === 'ver' ? 'disabled' : ''}>
                            </td>
                            <td>
                                ${this.modo !== 'ver' ? `
                                    <button type="button" class="btn btn-outline btn-sm btn-icon" onclick="SolicitudCotizacion.eliminarProducto(${this.productIndex})" title="Eliminar">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                ` : ''}
                            </td>
                        `;
                        
                        tbody.appendChild(row);
                        this.productIndex++;
                    }
                }, i * 100);
            });
            
            // Actualizar resumen después de cargar todo
            setTimeout(() => {
                this.actualizarResumen();
            }, 500);
            
        }, 100);
    },
    
    // Toggle provider selection
    toggleProvider(element, providerId) {
        const checkbox = element.querySelector(`#prov${providerId}`);
        
        if (!checkbox) {
            console.error('No se encontró el checkbox para el proveedor', providerId);
            return;
        }
        
        // Si el evento viene del checkbox, ya está manejado
        if (event && event.target === checkbox) {
            // El checkbox ya cambió su estado
        } else {
            // Si viene del click en el div, cambiar el checkbox
            checkbox.checked = !checkbox.checked;
        }
        
        if (checkbox.checked) {
            element.classList.add('selected');
            this.agregarProveedorTabla(providerId);
            console.log('Proveedor seleccionado:', providerId);
        } else {
            element.classList.remove('selected');
            this.removerProveedorTabla(providerId);
            console.log('Proveedor deseleccionado:', providerId);
        }
        
        this.actualizarResumen();
    },
    
    // Agregar proveedor a tabla
    agregarProveedorTabla(providerId) {
        const proveedor = this.proveedoresDisponibles.find(p => p.id === providerId);
        if (!proveedor) return;
        
        const tbody = document.getElementById('selectedProvidersBody');
        const row = document.createElement('tr');
        row.id = `provider-row-${providerId}`;
        
        const lcClass = proveedor.lcDisponible < 10000000 ? 'credit-low' : 'credit-available';
        
        row.innerHTML = `
            <td>${proveedor.codigo}</td>
            <td>${proveedor.nombre}</td>
            <td>${proveedor.sucursal}</td>
            <td>${proveedor.encargado}</td>
            <td>${proveedor.email}</td>
            <td>${proveedor.celular}</td>
            <td class="${lcClass}">${this.formatearMonto(proveedor.lcDisponible)}</td>
            <td>
                <button type="button" class="btn btn-outline btn-sm btn-icon" onclick="SolicitudCotizacion.removerProveedor('${providerId}')" title="Quitar">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
        this.selectedProviders[providerId] = proveedor;
    },
    
    // Remover proveedor de tabla
    removerProveedorTabla(providerId) {
        const row = document.getElementById(`provider-row-${providerId}`);
        if (row) {
            row.remove();
        }
        delete this.selectedProviders[providerId];
    },
    
    // Remover proveedor
    removerProveedor(providerId) {
        const checkbox = document.getElementById(`prov${providerId}`);
        if (checkbox) {
            checkbox.checked = false;
            checkbox.closest('.provider-item').classList.remove('selected');
        }
        this.removerProveedorTabla(providerId);
        this.actualizarResumen();
    },
    
    // Agregar producto
    agregarProducto() {
        document.getElementById('modalProducto').style.display = 'block';
    },
    
    // Seleccionar producto
    seleccionarProducto(producto) {
        const tbody = document.getElementById('productTableBody');
        const row = document.createElement('tr');
        row.id = `product-row-${this.productIndex}`;
        
        row.innerHTML = `
            <td style="text-align: center;">
                <input type="checkbox" checked onchange="SolicitudCotizacion.actualizarResumen()">
            </td>
            <td>${producto.codCliente}</td>
            <td>${producto.descCliente}</td>
            <td>${producto.codSSL}</td>
            <td>${producto.descSSL}</td>
            <td>${producto.um}</td>
            <td>
                <input type="number" value="${producto.cantidad}" min="1" class="form-control" onchange="SolicitudCotizacion.actualizarResumen()">
            </td>
            <td>
                <input type="date" value="${producto.fechaReq}" class="form-control">
            </td>
            <td>
                <input type="number" value="0" min="0" class="form-control" placeholder="Opcional" onchange="SolicitudCotizacion.actualizarResumen()">
            </td>
            <td>
                <button type="button" class="btn btn-outline btn-sm btn-icon" onclick="SolicitudCotizacion.eliminarProducto(${this.productIndex})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
        this.productIndex++;
        
        this.cerrarModalProducto();
        this.actualizarResumen();
    },
    
    // Cerrar modal producto
    cerrarModalProducto() {
        document.getElementById('modalProducto').style.display = 'none';
    },
    
    // Eliminar producto
    eliminarProducto(index) {
        if (confirm('¿Está seguro de eliminar este producto?')) {
            const row = document.getElementById(`product-row-${index}`);
            if (row) {
                row.remove();
                this.actualizarResumen();
            }
        }
    },
    
    // Actualizar resumen
    actualizarResumen() {
        // Contar productos seleccionados
        const productosSeleccionados = document.querySelectorAll('#productTableBody input[type="checkbox"]:checked').length;
        document.getElementById('totalProductos').textContent = productosSeleccionados;
        
        // Contar proveedores
        const proveedoresSeleccionados = Object.keys(this.selectedProviders).length;
        document.getElementById('totalProveedores').textContent = proveedoresSeleccionados;
        document.getElementById('numSolicitudes').textContent = proveedoresSeleccionados;
        
        // Calcular monto referencial
        let montoTotal = 0;
        document.querySelectorAll('#productTableBody tr').forEach(row => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                const cantidadInput = row.querySelectorAll('input[type="number"]')[0];
                const valorRefInput = row.querySelectorAll('input[type="number"]')[1];
                
                const cantidad = parseFloat(cantidadInput?.value) || 0;
                const valorRef = parseFloat(valorRefInput?.value) || 0;
                montoTotal += cantidad * valorRef;
            }
        });
        
        document.getElementById('montoReferencial').textContent = this.formatearMonto(montoTotal);
    },
    
    // Formatear monto
    formatearMonto(monto) {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(monto);
    },
    
    // Manejo de archivos - Drag handlers
    dragOverHandler(ev) {
        ev.preventDefault();
        ev.currentTarget.classList.add('dragover');
    },
    
    dragEnterHandler(ev) {
        ev.preventDefault();
        ev.currentTarget.classList.add('dragover');
    },
    
    dragLeaveHandler(ev) {
        ev.preventDefault();
        ev.currentTarget.classList.remove('dragover');
    },
    
    dropHandler(ev) {
        ev.preventDefault();
        ev.currentTarget.classList.remove('dragover');
        
        const files = ev.dataTransfer.files;
        this.handleFiles(files);
    },
    
    // Manejar archivos
    handleFiles(files) {
        const fileList = document.getElementById('fileList');
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.id = `file-${Date.now()}-${i}`;
            
            const fileIcon = this.getFileIcon(file.name);
            const fileSize = this.formatFileSize(file.size);
            
            fileItem.innerHTML = `
                <i class="${fileIcon}"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">${fileSize}</span>
                <span class="file-remove" onclick="SolicitudCotizacion.removeFile('${fileItem.id}')">
                    <i class="fas fa-times"></i>
                </span>
            `;
            
            fileList.appendChild(fileItem);
        }
    },
    
    // Obtener ícono según extensión
    getFileIcon(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return 'fas fa-file-pdf';
            case 'doc':
            case 'docx':
                return 'fas fa-file-word';
            case 'xls':
            case 'xlsx':
                return 'fas fa-file-excel';
            case 'jpg':
            case 'jpeg':
            case 'png':
                return 'fas fa-file-image';
            default:
                return 'fas fa-file';
        }
    },
    
    // Formatear tamaño de archivo
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    // Remover archivo
    removeFile(fileId) {
        const fileItem = document.getElementById(fileId);
        if (fileItem) {
            fileItem.remove();
        }
    },
    
    // Cancelar
    cancelar() {
        if (confirm('¿Está seguro de cancelar? Se perderán todos los cambios no guardados.')) {
            window.history.back();
        }
    },
    
    // Guardar borrador
    guardarBorrador() {
        alert('Borrador guardado exitosamente. Puede continuar editando más tarde.');
    },
    
    // Vista previa
    vistaPrevia() {
        const proveedores = Object.keys(this.selectedProviders).length;
        const productos = document.querySelectorAll('#productTableBody input[type="checkbox"]:checked').length;
        
        if (proveedores === 0) {
            alert('Debe seleccionar al menos un proveedor');
            return;
        }
        
        if (productos === 0) {
            alert('Debe seleccionar al menos un producto');
            return;
        }
        
        alert('Abriendo vista previa de las solicitudes de cotización...');
        // Aquí se abriría una ventana con la vista previa
    },
    
    // Manejar submit del formulario
    handleSubmit(e) {
        e.preventDefault();
        
        // Validaciones
        const proveedores = Object.keys(this.selectedProviders).length;
        const productos = document.querySelectorAll('#productTableBody input[type="checkbox"]:checked').length;
        
        if (proveedores === 0) {
            alert('Debe seleccionar al menos un proveedor');
            return;
        }
        
        if (productos === 0) {
            alert('Debe seleccionar al menos un producto');
            return;
        }
        
        if (confirm(`¿Está seguro de enviar ${proveedores} solicitud(es) de cotización?\n\nEsta acción no se puede deshacer.`)) {
            alert('Solicitudes de cotización enviadas exitosamente');
            
            // Redireccionar al detalle
            const numeroSolicitud = document.getElementById('numeroSolicitud').textContent;
            window.location.href = `ssl_detalle_solicitud_cotizacion.html?solicitud=${numeroSolicitud}`;
        }
    }
};

// Exportar para uso global
window.SolicitudCotizacion = SolicitudCotizacion;