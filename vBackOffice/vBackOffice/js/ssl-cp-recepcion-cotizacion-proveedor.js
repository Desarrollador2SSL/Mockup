/**
 * JavaScript para Recepción de Cotización de Proveedor
 * SSL v4.0
 */

const RecepcionCotizacion = {
    // Datos de la solicitud original
    solicitudOriginal: {
        numero: 'SC-2025-0042',
        cliente: 'CONSTRUCTORA ALMAGRO S.A.',
        obra: 'EDIFICIO PACIFIC BLUE',
        fechaSolicitud: '2025-05-22',
        fechaLimite: '2025-06-05',
        fechaEntregaRequerida: '2025-06-15'
    },

    // Productos solicitados (pre-cargados desde la solicitud original)
    productosSolicitados: [
        {
            item: 1,
            codigoSSL: 'SSL-ELEC-001',
            descripcionSSL: 'CABLE TIPO NYA 1.5MM2 AZUL',
            unidadSSL: 'MTS',
            cantidadSolicitada: 500,
            fechaRequerida: '2025-06-15',
            valorReferencial: 850
        },
        {
            item: 2,
            codigoSSL: 'SSL-ELEC-002',
            descripcionSSL: 'CANALETA PVC 40X25MM BLANCA',
            unidadSSL: 'MTS',
            cantidadSolicitada: 120,
            fechaRequerida: '2025-06-15',
            valorReferencial: 1200
        },
        {
            item: 3,
            codigoSSL: 'SSL-ELEC-003',
            descripcionSSL: 'INTERRUPTOR TERMOMAGNETICO 2X16A',
            unidadSSL: 'UND',
            cantidadSolicitada: 24,
            fechaRequerida: '2025-06-20',
            valorReferencial: 8500
        },
        {
            item: 4,
            codigoSSL: 'SSL-ELEC-004',
            descripcionSSL: 'CAJAS DE DERIVACION 100X100X50MM',
            unidadSSL: 'UND',
            cantidadSolicitada: 50,
            fechaRequerida: '2025-06-20',
            valorReferencial: 2800
        },
        {
            item: 5,
            codigoSSL: 'SSL-ELEC-005',
            descripcionSSL: 'ENCHUFE SCHUKO 2P+T 16A BLANCO',
            unidadSSL: 'UND',
            cantidadSolicitada: 80,
            fechaRequerida: '2025-06-15',
            valorReferencial: 3200
        }
    ],

    // Catálogo de conversiones de unidades (simulado)
    conversionesUnidades: {
        'MTS-MT': { factor: 1, descripcion: 'Metros a Metro' },
        'MTS-M': { factor: 1, descripcion: 'Metros a M' },
        'MTS-ROLLO': { factor: 0.01, descripcion: 'Metros a Rollo (100m)' },
        'UND-UN': { factor: 1, descripcion: 'Unidad a Unidad' },
        'UND-PZA': { factor: 1, descripcion: 'Unidad a Pieza' },
        'UND-CAJA': { factor: 0.1, descripcion: 'Unidad a Caja (10 und)' },
        'KG-GR': { factor: 1000, descripcion: 'Kilogramo a Gramo' },
        'M2-CM2': { factor: 10000, descripcion: 'Metro cuadrado a Centímetro cuadrado' }
    },

    // Datos de la cotización en progreso
    cotizacionActual: {
        productos: []
    },

    // Alertas activas
    alertasActivas: [],

    // Archivos adjuntos
    archivosAdjuntos: [],

    /**
     * Inicializar la página
     */
    init() {
        console.log('Inicializando RecepcionCotizacion ...');
        
        // Cargar información de la solicitud
        this.cargarInfoSolicitud();
        
        console.log('Configurar fecha de recepción por defecto ...');
        // Configurar fecha de recepción por defecto (hoy)
        const hoy = new Date().toISOString().split('T')[0];
        document.getElementById('fechaRecepcion').value = hoy;
        
        console.log('Cargar productos en la tabla ...');
        // Cargar productos en la tabla
        this.cargarProductos();
        
        console.log('Configurar eventos de archivos ...');        
        // Configurar eventos de archivos
        this.configurarEventosArchivos();
        
        console.log('Actualizar resumen ...');          
        // Actualizar resumen
        this.actualizarResumen();
        
        console.log('RecepcionCotizacion inicializado correctamente');
    },

    /**
     * Cargar información de la solicitud original
     */
    cargarInfoSolicitud() {
        document.getElementById('infoNroSolicitud').textContent = this.solicitudOriginal.numero;
        document.getElementById('infoCliente').textContent = this.solicitudOriginal.cliente;
        document.getElementById('infoObra').textContent = this.solicitudOriginal.obra;
        document.getElementById('infoFechaSolicitud').textContent = this.formatearFecha(this.solicitudOriginal.fechaSolicitud);
        document.getElementById('infoFechaLimite').textContent = this.formatearFecha(this.solicitudOriginal.fechaLimite);
        
        // Calcular días restantes
        const diasRestantes = this.calcularDiasRestantes(this.solicitudOriginal.fechaLimite);
        const diasBadge = document.getElementById('infoDiasRestantes').querySelector('.badge');
        
        console.log('Calculando días restantes ...');

        /*
        if (diasRestantes < 0) {
            diasBadge.textContent = 'VENCIDA';
            diasBadge.className = 'badge badge-danger';
        } else if (diasRestantes <= 3) {
            diasBadge.textContent = `${diasRestantes} días`;
            diasBadge.className = 'badge badge-danger';
        } else if (diasRestantes <= 7) {
            diasBadge.textContent = `${diasRestantes} días`;
            diasBadge.className = 'badge badge-warning';
        } else {
            diasBadge.textContent = `${diasRestantes} días`;
            diasBadge.className = 'badge badge-success';
        }*/
    },

    /**
     * Cargar productos solicitados en la tabla
     */
    cargarProductos() {
        const tbody = document.getElementById('productosTableBody');
        tbody.innerHTML = '';
        
        this.productosSolicitados.forEach((producto, index) => {
            const tr = document.createElement('tr');
            tr.id = `producto-${producto.item}`;
            
            tr.innerHTML = `
                <td class="cell-item-number">${producto.item}</td>
                <td>
                    <div class="cell-readonly">${producto.codigoSSL}</div>
                </td>
                <td>
                    <div class="cell-readonly">${producto.descripcionSSL}</div>
                </td>
                <td class="text-center">
                    <div class="cell-readonly">${producto.unidadSSL}</div>
                </td>
                <td class="text-right">
                    <div class="cell-readonly">${producto.cantidadSolicitada}</div>
                </td>
                <td class="text-center">
                    <div class="cell-readonly">${this.formatearFecha(producto.fechaRequerida)}</div>
                </td>
                
                <!-- DATOS COTIZADOS POR PROVEEDOR -->
                <td>
                    <input type="text" 
                           class="form-control" 
                           id="codigoProv-${producto.item}"
                           placeholder="Código proveedor"
                           data-item="${producto.item}">
                </td>
                <td>
                    <input type="text" 
                           class="form-control" 
                           id="descripcionProv-${producto.item}"
                           placeholder="Descripción proveedor"
                           data-item="${producto.item}">
                </td>
                <td>
                    <select class="form-control" 
                            id="unidadProv-${producto.item}"
                            data-item="${producto.item}"
                            onchange="RecepcionCotizacion.validarUnidad(${producto.item})">
                        <option value="">Seleccionar</option>
                        <option value="MTS">MTS</option>
                        <option value="MT">MT</option>
                        <option value="M">M</option>
                        <option value="ROLLO">ROLLO</option>
                        <option value="UND">UND</option>
                        <option value="UN">UN</option>
                        <option value="PZA">PZA</option>
                        <option value="CAJA">CAJA</option>
                        <option value="KG">KG</option>
                        <option value="GR">GR</option>
                    </select>
                </td>
                <td>
                    <input type="number" 
                           class="form-control" 
                           id="cantidadCotizada-${producto.item}"
                           placeholder="0"
                           step="0.01"
                           data-item="${producto.item}"
                           onchange="RecepcionCotizacion.validarCantidad(${producto.item})">
                </td>
                <td class="text-center">
                    <div class="cell-readonly" id="factorConversion-${producto.item}">1.00</div>
                </td>
                <td>
                    <input type="number" 
                           class="form-control" 
                           id="precioUnitario-${producto.item}"
                           placeholder="0"
                           step="0.01"
                           data-item="${producto.item}"
                           onchange="RecepcionCotizacion.calcularTotalLinea(${producto.item})">
                </td>
                <td class="text-right">
                    <div class="cell-readonly" id="totalLinea-${producto.item}">$0</div>
                </td>
                <td class="cell-alert" id="alertas-${producto.item}">
                    <div class="alert-icon alert-ok">
                        <i class="fas fa-check"></i>
                    </div>
                </td>
            `;
            
            tbody.appendChild(tr);
        });
    },

    /**
     * Validar unidad de medida y calcular factor de conversión
     */
    validarUnidad(item) {
        const producto = this.productosSolicitados.find(p => p.item === item);
        if (!producto) return;
        
        const unidadProv = document.getElementById(`unidadProv-${item}`).value;
        const unidadSSL = producto.unidadSSL;
        
        // Buscar conversión
        const claveConversion = `${unidadSSL}-${unidadProv}`;
        const conversion = this.conversionesUnidades[claveConversion];
        
        const factorElement = document.getElementById(`factorConversion-${item}`);
        
        if (conversion) {
            factorElement.textContent = conversion.factor.toFixed(2);
            factorElement.title = conversion.descripcion;
        } else if (unidadSSL === unidadProv) {
            factorElement.textContent = '1.00';
            factorElement.title = 'Misma unidad';
        } else {
            factorElement.textContent = '?';
            factorElement.title = 'No hay conversión definida';
            this.agregarAlerta(item, 'warning', 
                `No existe conversión definida entre ${unidadSSL} y ${unidadProv}`);
        }
        
        // Re-validar cantidad si ya fue ingresada
        this.validarCantidad(item);
    },

    /**
     * Validar cantidad cotizada vs solicitada
     */
    validarCantidad(item) {
        const producto = this.productosSolicitados.find(p => p.item === item);
        if (!producto) return;
        
        const cantidadCotizada = parseFloat(document.getElementById(`cantidadCotizada-${item}`).value) || 0;
        const cantidadSolicitada = producto.cantidadSolicitada;
        const factorConversion = parseFloat(document.getElementById(`factorConversion-${item}`).textContent) || 1;
        
        // Convertir cantidad cotizada a unidad SSL para comparar
        const cantidadEquivalente = cantidadCotizada * factorConversion;
        
        // Calcular diferencia porcentual
        const diferencia = ((cantidadEquivalente - cantidadSolicitada) / cantidadSolicitada) * 100;
        
        if (Math.abs(diferencia) > 10) {
            // Diferencia mayor al 10%
            const mensaje = diferencia > 0 
                ? `Cantidad cotizada es ${diferencia.toFixed(1)}% MAYOR a lo solicitado`
                : `Cantidad cotizada es ${Math.abs(diferencia).toFixed(1)}% MENOR a lo solicitado`;
            
            this.agregarAlerta(item, 'warning', mensaje);
        } else if (Math.abs(diferencia) > 0) {
            // Diferencia menor pero existente
            this.removerAlertas(item, 'cantidad');
        } else {
            // Cantidad exacta
            this.removerAlertas(item, 'cantidad');
        }
        
        // Calcular total de la línea
        this.calcularTotalLinea(item);
    },

    /**
     * Calcular total de una línea de producto
     */
    calcularTotalLinea(item) {
        const cantidadCotizada = parseFloat(document.getElementById(`cantidadCotizada-${item}`).value) || 0;
        const precioUnitario = parseFloat(document.getElementById(`precioUnitario-${item}`).value) || 0;
        
        const total = cantidadCotizada * precioUnitario;
        
        document.getElementById(`totalLinea-${item}`).textContent = 
            '$' + this.formatearMonto(total);
        
        // Actualizar totales generales
        this.calcularTotales();
    },

    /**
     * Calcular totales generales
     */
    calcularTotales() {
        let subtotal = 0;
        
        this.productosSolicitados.forEach(producto => {
            const totalLinea = document.getElementById(`totalLinea-${producto.item}`).textContent;
            const valor = parseFloat(totalLinea.replace(/[$,]/g, '')) || 0;
            subtotal += valor;
        });
        
        const montoFlete = parseFloat(document.getElementById('montoFlete').value) || 0;
        const total = subtotal + montoFlete;
        
        document.getElementById('subtotalProductos').textContent = '$' + this.formatearMonto(subtotal);
        document.getElementById('totalFlete').textContent = '$' + this.formatearMonto(montoFlete);
        document.getElementById('totalCotizacion').textContent = '$' + this.formatearMonto(total);
        
        // Actualizar resumen
        this.actualizarResumen();
    },

    /**
     * Validar fecha de vencimiento
     */
    validarFechaVencimiento() {
        const fechaRecepcion = new Date(document.getElementById('fechaRecepcion').value);
        const fechaVencimiento = new Date(document.getElementById('fechaVencimiento').value);
        
        if (fechaVencimiento < fechaRecepcion) {
            this.mostrarAlertaTemporal('danger', 
                'Fecha Inválida', 
                'La fecha de vencimiento no puede ser anterior a la fecha de recepción');
            document.getElementById('fechaVencimiento').value = '';
        }
    },

    /**
     * Validar fecha de entrega
     */
    validarFechaEntrega() {
        const fechaEntregaRequerida = new Date(this.solicitudOriginal.fechaEntregaRequerida);
        const fechaEntregaProveedor = new Date(document.getElementById('fechaEntregaProveedor').value);
        
        if (fechaEntregaProveedor > fechaEntregaRequerida) {
            const diasDiferencia = Math.ceil((fechaEntregaProveedor - fechaEntregaRequerida) / (1000 * 60 * 60 * 24));
            
            this.mostrarAlertaTemporal('warning', 
                'Fecha de Entrega Tardía', 
                `La fecha ofrecida por el proveedor es ${diasDiferencia} días posterior a la fecha requerida`);
        }
    },

    /**
     * Toggle flete
     */
    toggleFlete() {
        const incluyeFlete = document.getElementById('incluyeFlete').checked;
        const fleteRow = document.getElementById('fleteRow');
        const fleteTotal = document.getElementById('fleteTotal');
        
        if (incluyeFlete) {
            fleteRow.style.display = 'grid';
            fleteTotal.style.display = 'table-row';
        } else {
            fleteRow.style.display = 'none';
            fleteTotal.style.display = 'none';
            document.getElementById('montoFlete').value = '0';
            this.calcularTotales();
        }
    },

    /**
     * Agregar alerta a un producto
     */
    agregarAlerta(item, tipo, mensaje) {
        // Remover alertas previas del mismo tipo
        this.alertasActivas = this.alertasActivas.filter(a => 
            !(a.item === item && a.tipo === tipo));
        
        // Agregar nueva alerta
        this.alertasActivas.push({
            item: item,
            tipo: tipo,
            mensaje: mensaje
        });
        
        // Actualizar UI
        this.actualizarAlertasProducto(item);
        this.actualizarResumen();
    },

    /**
     * Remover alertas de un producto
     */
    removerAlertas(item, categoria) {
        this.alertasActivas = this.alertasActivas.filter(a => 
            !(a.item === item && (a.mensaje.toLowerCase().includes(categoria) || !categoria)));
        
        this.actualizarAlertasProducto(item);
        this.actualizarResumen();
    },

    /**
     * Actualizar visualización de alertas de un producto
     */
    actualizarAlertasProducto(item) {
        const alertasProducto = this.alertasActivas.filter(a => a.item === item);
        const alertaElement = document.getElementById(`alertas-${item}`);
        
        if (!alertaElement) return;
        
        if (alertasProducto.length === 0) {
            alertaElement.innerHTML = `
                <div class="alert-icon alert-ok">
                    <i class="fas fa-check"></i>
                </div>
            `;
            document.getElementById(`producto-${item}`).classList.remove('row-error', 'row-warning');
        } else {
            const tieneError = alertasProducto.some(a => a.tipo === 'error');
            const tieneWarning = alertasProducto.some(a => a.tipo === 'warning');
            
            const iconClass = tieneError ? 'alert-error' : 'alert-warning';
            const icon = tieneError ? 'fa-exclamation-circle' : 'fa-exclamation-triangle';
            
            const mensajes = alertasProducto.map(a => a.mensaje).join('\n');
            
            alertaElement.innerHTML = `
                <div class="alert-icon ${iconClass}" 
                     title="${mensajes}"
                     onclick="RecepcionCotizacion.mostrarDetalleAlertas(${item})">
                    <i class="fas ${icon}"></i>
                </div>
            `;
            
            const row = document.getElementById(`producto-${item}`);
            row.classList.remove('row-error', 'row-warning');
            if (tieneError) {
                row.classList.add('row-error');
            } else if (tieneWarning) {
                row.classList.add('row-warning');
            }
        }
    },

    /**
     * Mostrar detalle de alertas de un producto
     */
    mostrarDetalleAlertas(item) {
        const alertasProducto = this.alertasActivas.filter(a => a.item === item);
        
        if (alertasProducto.length === 0) return;
        
        const producto = this.productosSolicitados.find(p => p.item === item);
        
        let html = `
            <h4 style="margin-bottom: 15px;">Alertas para: ${producto.descripcionSSL}</h4>
            <div style="max-height: 300px; overflow-y: auto;">
        `;
        
        alertasProducto.forEach(alerta => {
            const iconClass = alerta.tipo === 'error' ? 'fa-times-circle' : 'fa-exclamation-triangle';
            const color = alerta.tipo === 'error' ? '#dc3545' : '#ffc107';
            
            html += `
                <div style="display: flex; align-items: start; gap: 10px; padding: 10px; 
                           background-color: ${alerta.tipo === 'error' ? '#fee' : '#fff3cd'}; 
                           border-radius: 6px; margin-bottom: 10px;">
                    <i class="fas ${iconClass}" style="color: ${color}; font-size: 1.2rem; flex-shrink: 0;"></i>
                    <p style="margin: 0; color: #333;">${alerta.mensaje}</p>
                </div>
            `;
        });
        
        html += '</div>';
        
        document.getElementById('modalAlertaTitulo').textContent = `Alertas - Item ${item}`;
        document.getElementById('modalAlertaBody').innerHTML = html;
        document.getElementById('modalAlerta').classList.add('show');
    },

    /**
     * Cerrar modal
     */
    cerrarModal() {
        document.getElementById('modalAlerta').classList.remove('show');
    },

    /**
     * Mostrar alerta temporal
     */
    mostrarAlertaTemporal(tipo, titulo, mensaje, duracion = 5000) {
        const container = document.getElementById('alertContainer');
        
        const alertId = 'alert-' + Date.now();
        const alertDiv = document.createElement('div');
        alertDiv.id = alertId;
        alertDiv.className = `alert alert-${tipo}`;
        
        const iconMap = {
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            danger: 'fa-times-circle',
            info: 'fa-info-circle'
        };
        
        alertDiv.innerHTML = `
            <i class="fas ${iconMap[tipo]}"></i>
            <div class="alert-content">
                <div class="alert-title">${titulo}</div>
                <div class="alert-message">${mensaje}</div>
            </div>
            <button class="alert-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        container.appendChild(alertDiv);
        
        // Auto-remover después de la duración
        setTimeout(() => {
            const alert = document.getElementById(alertId);
            if (alert) {
                alert.style.opacity = '0';
                setTimeout(() => alert.remove(), 300);
            }
        }, duracion);
    },

    /**
     * Actualizar resumen
     */
    actualizarResumen() {
        const totalItems = this.productosSolicitados.length;
        
        // Contar items completos (con todos los datos requeridos)
        let itemsCompletos = 0;
        this.productosSolicitados.forEach(producto => {
            const codigoProv = document.getElementById(`codigoProv-${producto.item}`).value;
            const unidadProv = document.getElementById(`unidadProv-${producto.item}`).value;
            const cantidadCotizada = document.getElementById(`cantidadCotizada-${producto.item}`).value;
            const precioUnitario = document.getElementById(`precioUnitario-${producto.item}`).value;
            
            if (codigoProv && unidadProv && cantidadCotizada && precioUnitario) {
                itemsCompletos++;
            }
        });
        
        const totalAlertas = this.alertasActivas.length;
        
        const totalCotizacion = document.getElementById('totalCotizacion').textContent;
        
        document.getElementById('summaryItems').textContent = totalItems;
        document.getElementById('summaryCompletos').textContent = `${itemsCompletos}/${totalItems}`;
        document.getElementById('summaryAlertas').textContent = totalAlertas;
        document.getElementById('summaryTotal').textContent = totalCotizacion;
    },

    /**
     * Configurar eventos de archivos
     */
    configurarEventosArchivos() {
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('fileUploadArea');
        
        // Click en área de carga
        uploadArea.addEventListener('click', (e) => {
            if (e.target !== uploadArea && !e.target.closest('button')) return;
        });
        
        // Cambio en input de archivo
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--secondary-color)';
            uploadArea.style.backgroundColor = '#f0f8ff';
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '';
            uploadArea.style.backgroundColor = '';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '';
            uploadArea.style.backgroundColor = '';
            this.handleFiles(e.dataTransfer.files);
        });
    },

    /**
     * Manejar archivos seleccionados
     */
    handleFiles(files) {
        Array.from(files).forEach(file => {
            // Validar tamaño (10MB máximo)
            if (file.size > 10 * 1024 * 1024) {
                this.mostrarAlertaTemporal('danger', 
                    'Archivo muy grande', 
                    `${file.name} excede el tamaño máximo de 10MB`);
                return;
            }
            
            // Agregar archivo
            this.archivosAdjuntos.push({
                id: Date.now() + Math.random(),
                nombre: file.name,
                tamanio: file.size,
                tipo: file.type,
                file: file
            });
        });
        
        this.renderizarArchivos();
    },

    /**
     * Renderizar lista de archivos
     */
    renderizarArchivos() {
        const fileList = document.getElementById('fileList');
        
        if (this.archivosAdjuntos.length === 0) {
            fileList.innerHTML = '<p style="text-align: center; color: #666;">No hay archivos adjuntos</p>';
            return;
        }
        
        fileList.innerHTML = this.archivosAdjuntos.map(archivo => `
            <div class="file-item">
                <div class="file-info-group">
                    <i class="fas ${this.getFileIcon(archivo.nombre)} file-icon"></i>
                    <div class="file-details">
                        <span class="file-name">${archivo.nombre}</span>
                        <span class="file-size">${this.formatearTamanio(archivo.tamanio)}</span>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="btn btn-sm btn-icon btn-outline" 
                            onclick="RecepcionCotizacion.descargarArchivo(${archivo.id})"
                            title="Descargar">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn btn-sm btn-icon btn-outline" 
                            onclick="RecepcionCotizacion.eliminarArchivo(${archivo.id})"
                            title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },

    /**
     * Obtener icono según tipo de archivo
     */
    getFileIcon(nombreArchivo) {
        const ext = nombreArchivo.split('.').pop().toLowerCase();
        
        const iconMap = {
            pdf: 'fa-file-pdf',
            doc: 'fa-file-word',
            docx: 'fa-file-word',
            xls: 'fa-file-excel',
            xlsx: 'fa-file-excel',
            jpg: 'fa-file-image',
            jpeg: 'fa-file-image',
            png: 'fa-file-image',
            gif: 'fa-file-image'
        };
        
        return iconMap[ext] || 'fa-file';
    },

    /**
     * Eliminar archivo
     */
    eliminarArchivo(id) {
        if (confirm('¿Está seguro de eliminar este archivo?')) {
            this.archivosAdjuntos = this.archivosAdjuntos.filter(a => a.id !== id);
            this.renderizarArchivos();
        }
    },

    /**
     * Descargar archivo (simulado)
     */
    descargarArchivo(id) {
        const archivo = this.archivosAdjuntos.find(a => a.id === id);
        if (archivo) {
            this.mostrarAlertaTemporal('info', 
                'Descarga', 
                `Descargando: ${archivo.nombre}...`);
        }
    },

    /**
     * Cargar datos del proveedor
     */
    cargarDatosProveedor() {
        const proveedorId = document.getElementById('proveedor').value;
        
        if (!proveedorId) return;
        
        // Simular carga de datos del proveedor
        this.mostrarAlertaTemporal('info', 
            'Datos del Proveedor', 
            'Información del proveedor cargada correctamente');
    },

    /**
     * Vista previa
     */
    vistaPrevia() {
        this.mostrarAlertaTemporal('info', 
            'Vista Previa', 
            'Función de vista previa en desarrollo...');
    },

    /**
     * Guardar borrador
     */
    guardarBorrador() {
        if (!this.validarDatosBasicos()) return;
        
        this.mostrarAlertaTemporal('success', 
            'Borrador Guardado', 
            'La cotización se ha guardado como borrador');
    },

    /**
     * Guardar cotización
     */
    guardarCotizacion() {
        if (!this.validarFormularioCompleto()) return;
        
        if (confirm('¿Está seguro de guardar esta cotización? Una vez guardada podrá ser procesada para análisis comparativo.')) {
            this.mostrarAlertaTemporal('success', 
                'Cotización Guardada', 
                'La cotización se ha guardado exitosamente');
            
            setTimeout(() => {
                window.location.href = 'ssl_cp_listado_recepcion_respuesta.html';
            }, 2000);
        }
    },

    /**
     * Nueva versión
     */
    nuevaVersion() {
        if (confirm('¿Desea crear una nueva versión de esta cotización? Los datos actuales se conservarán.')) {
            const versionActual = parseInt(document.getElementById('versionCotizacion').value);
            document.getElementById('versionCotizacion').value = versionActual + 1;
            
            this.mostrarAlertaTemporal('info', 
                'Nueva Versión', 
                `Se ha creado la versión ${versionActual + 1}`);
        }
    },

    /**
     * Cancelar
     */
    cancelar() {
        if (confirm('¿Está seguro de cancelar? Los cambios no guardados se perderán.')) {
            window.location.href = 'ssl_cp_listado_recepcion_respuesta.html';
        }
    },

    /**
     * Validar datos básicos
     */
    validarDatosBasicos() {
        const proveedor = document.getElementById('proveedor').value;
        const nroCotizacion = document.getElementById('nroCotizacionProveedor').value;
        const fechaRecepcion = document.getElementById('fechaRecepcion').value;
        
        if (!proveedor || !nroCotizacion || !fechaRecepcion) {
            this.mostrarAlertaTemporal('warning', 
                'Datos Incompletos', 
                'Por favor complete los datos básicos del proveedor y la cotización');
            return false;
        }
        
        return true;
    },

    /**
     * Validar formulario completo
     */
    validarFormularioCompleto() {
        if (!this.validarDatosBasicos()) return false;
        
        const fechaVencimiento = document.getElementById('fechaVencimiento').value;
        const fechaEntrega = document.getElementById('fechaEntregaProveedor').value;
        
        if (!fechaVencimiento || !fechaEntrega) {
            this.mostrarAlertaTemporal('warning', 
                'Datos Incompletos', 
                'Por favor complete todas las fechas requeridas');
            return false;
        }
        
        // Verificar que al menos un producto esté cotizado
        let hayProductos = false;
        this.productosSolicitados.forEach(producto => {
            const precioUnitario = document.getElementById(`precioUnitario-${producto.item}`).value;
            if (precioUnitario && parseFloat(precioUnitario) > 0) {
                hayProductos = true;
            }
        });
        
        if (!hayProductos) {
            this.mostrarAlertaTemporal('warning', 
                'Sin Productos', 
                'Debe ingresar al menos un producto cotizado');
            return false;
        }
        
        return true;
    },

    /**
     * Formatear fecha
     */
    formatearFecha(fecha) {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-CL');
    },

    /**
     * Formatear monto
     */
    formatearMonto(monto) {
        return Math.round(monto).toLocaleString('es-CL');
    },

    /**
     * Formatear tamaño de archivo
     */
    formatearTamanio(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * Calcular días restantes
     */
    calcularDiasRestantes(fechaLimite) {
        const hoy = new Date();
        const limite = new Date(fechaLimite);
        const diff = limite - hoy;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // La inicialización se hace desde el HTML
});
