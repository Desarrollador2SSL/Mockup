// js/ssl-detalle-solicitud-pedido.js - Lógica específica para Solicitud de Pedido

// Variables globales
let currentEditingRow = null;
let productoSeleccionado = null;
let productRowIndex = 0;
let detallesProductos = {}; // Almacena información adicional de productos
let versionActual = 1;
let modoFormulario = 'nuevo'; // nuevo, editar, ver

// Catálogo de productos Cliente-SSL (simulación de base de datos)
const catalogoProductosCliente = [
    // Productos Eléctricos
    {
        codigoCliente: 'CLI-001',
        descripcionCliente: 'Cable eléctrico 3x10 cliente',
        codigoSSL: 'EL-1245',
        descripcionSSL: 'Cable eléctrico NYY 3x10mm2 0.6/1kV',
        umSSL: 'MT',
        familia: 'ELECTRICO',
        avisos: ['Este producto solo se vende en rollos de 100 metros'],
        consideraciones: 'Este producto solo se vende en rollos de 100 metros. No se realizan cortes menores.'
    },
    {
        codigoCliente: 'CLI-002',
        descripcionCliente: 'Tubo conduit 25mm cliente',
        codigoSSL: 'EL-0876',
        descripcionSSL: 'Tubo Conduit PVC 25mm',
        umSSL: 'UN',
        familia: 'ELECTRICO',
        consideraciones: 'Sin consideraciones especiales para este producto'
    },
    {
        codigoCliente: 'PROD-ABC',
        descripcionCliente: 'Cable THHN Rojo calibre 12',
        codigoSSL: 'EL-4567',
        descripcionSSL: 'Cable THHN 12 AWG Rojo',
        umSSL: 'MT',
        familia: 'ELECTRICO',
        consideraciones: 'Sin consideraciones especiales para este producto'
    },
    {
        codigoCliente: 'CLI-EL-003',
        descripcionCliente: 'Caja derivación 100x100',
        codigoSSL: 'EL-2534',
        descripcionSSL: 'Caja de derivación PVC 100x100mm',
        umSSL: 'UN',
        familia: 'ELECTRICO',
        avisos: ['Este producto solo se vende en cajas de 50 unidades'],
        consideraciones: 'Este producto solo se vende en cajas de 50 unidades. Mínimo de compra: 1 caja (50 unidades).'
    },
    // Productos de Construcción
    {
        codigoCliente: 'CLI-CN-001',
        descripcionCliente: 'Cemento bolsa 25kg',
        codigoSSL: 'CN-1001',
        descripcionSSL: 'Cemento Portland tipo I - Saco 25kg',
        umSSL: 'UN',
        familia: 'CONSTRUCCION',
        avisos: ['Este producto solo se vende en pallets de 60 unidades', 'Peso máximo por pallet: 1.5 toneladas'],
        consideraciones: 'Este producto solo se vende en pallet de 60 unidades. Peso máximo por pallet: 1.5 toneladas. Este producto solo puede ser trasladado hasta 1 tonelada por viaje.'
    },
    {
        codigoCliente: 'CLI-CN-002',
        descripcionCliente: 'Arena gruesa metro cúbico',
        codigoSSL: 'CN-1002',
        descripcionSSL: 'Arena gruesa m³',
        umSSL: 'M3',
        familia: 'CONSTRUCCION',
        consideraciones: 'Pedido mínimo: 5 m³. El transporte se realiza en camiones de máximo 15 m³.'
    },
    {
        codigoCliente: 'CLI-CN-003',
        descripcionCliente: 'Fierro 12mm barra',
        codigoSSL: 'CN-1003',
        descripcionSSL: 'Fierro corrugado 12mm x 12m',
        umSSL: 'UN',
        familia: 'CONSTRUCCION',
        consideraciones: 'Se vende por tonelada o por unidad. Largo estándar: 12 metros.'
    },
    {
        codigoCliente: 'CLI-CN-004',
        descripcionCliente: 'Ladrillo princesa unidad',
        codigoSSL: 'CN-1004',
        descripcionSSL: 'Ladrillo princesa 14x19x29cm',
        umSSL: 'UN',
        familia: 'CONSTRUCCION',
        avisos: ['Este producto solo se vende en pallets de 200 unidades'],
        consideraciones: 'Este producto solo se vende en pallet de 200 unidades. Cada pallet pesa aproximadamente 800 kg.'
    }
];

// Datos de obras con encargados
const datosObras = {
    '1': {
        nombre: 'EDIFICIO PACIFIC BLUE',
        direccion: 'Av. Las Condes 1234, Las Condes',
        region: 'Región Metropolitana',
        encargados: [
            { nombre: 'Juan Pérez González', email: 'jperez@constructora.cl', celular: '+56 9 8765 4321', roles: ['Compras', 'Recepción'] },
            { nombre: 'María Silva Rojas', email: 'msilva@constructora.cl', celular: '+56 9 9876 5432', roles: ['Seguimiento'] },
            { nombre: 'Carlos Mendoza López', email: 'cmendoza@constructora.cl', celular: '+56 9 8765 1234', roles: ['Envío OC', 'Pagos'] }
        ]
    },
    '2': {
        nombre: 'TORRE ALMAGRO',
        direccion: 'Av. Providencia 5678, Providencia',
        region: 'Región Metropolitana',
        encargados: [
            { nombre: 'Ana Martínez Díaz', email: 'amartinez@constructora.cl', celular: '+56 9 7654 3210', roles: ['Compras'] },
            { nombre: 'Roberto Fuentes Mora', email: 'rfuentes@constructora.cl', celular: '+56 9 6543 2109', roles: ['Recepción', 'Seguimiento'] }
        ]
    },
    '3': {
        nombre: 'CONDOMINIO VISTA MAR',
        direccion: 'Av. Del Mar 900, Viña del Mar',
        region: 'Región de Valparaíso',
        encargados: [
            { nombre: 'Patricia Vargas Soto', email: 'pvargas@inmobiliaria.cl', celular: '+56 9 5432 1098', roles: ['Compras', 'Seguimiento'] }
        ]
    },
    '4': {
        nombre: 'EDIFICIO PARK TOWER',
        direccion: 'Av. Vitacura 3456, Vitacura',
        region: 'Región Metropolitana',
        encargados: [
            { nombre: 'Diego Ramírez Pinto', email: 'dramirez@inmobiliaria.cl', celular: '+56 9 4321 0987', roles: ['Compras', 'Envío OC'] }
        ]
    },
    '5': {
        nombre: 'EDIFICIO CENTRAL PARK',
        direccion: 'Av. Central 100, Santiago Centro',
        region: 'Región Metropolitana',
        encargados: [
            { nombre: 'Lorena Castro Núñez', email: 'lcastro@constructora-mp.cl', celular: '+56 9 3210 9876', roles: ['Compras', 'Recepción', 'Pagos'] }
        ]
    },
    '6': {
        nombre: 'PROYECTO LAS CONDES',
        direccion: 'Av. Las Condes 7890, Las Condes',
        region: 'Región Metropolitana',
        encargados: [
            { nombre: 'Fernando Gutiérrez Vera', email: 'fgutierrez@socovesa.cl', celular: '+56 9 2109 8765', roles: ['Compras'] },
            { nombre: 'Claudia Morales Ruiz', email: 'cmorales@socovesa.cl', celular: '+56 9 1098 7654', roles: ['Seguimiento', 'Envío OC'] }
        ]
    }
};

// Datos de línea de crédito por cliente (simulación)
const creditosPorCliente = {
    '76123456-K': {
        creditoOcupado: 45000000,
        creditoDisponible: 55000000,
        solicitudesTramite: 8500000
    },
    '76234567-8': {
        creditoOcupado: 28000000,
        creditoDisponible: 72000000,
        solicitudesTramite: 5200000
    },
    '76345678-9': {
        creditoOcupado: 65000000,
        creditoDisponible: 35000000,
        solicitudesTramite: 12300000
    },
    '76456789-0': {
        creditoOcupado: 82000000,
        creditoDisponible: 18000000,
        solicitudesTramite: 3750000
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Verificar parámetros URL
    checkUrlParams();
    
    // Set fechas por defecto
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fechaDocumento').value = today;
    
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    document.getElementById('fechaRegistro').value = localDateTime;
    
    // Agregar una fila de producto si es modo nuevo
    if (modoFormulario === 'nuevo') {
        agregarFilaProducto();
    }
    
    // Agregar eventos
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensaje();
        }
    });
    
    document.getElementById('solicitudForm').addEventListener('submit', handleFormSubmit);
});

// Verificar parámetros de URL
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const modo = urlParams.get('modo');
    const numero = urlParams.get('numero');
    
    if (modo && numero) {
        modoFormulario = modo;
        cargarSolicitud(numero, modo);
    }
}

// Cargar solicitud existente
function cargarSolicitud(numero, modo) {
    // Simulación de carga de datos
    console.log(`Cargando solicitud ${numero} en modo ${modo}`);
    
    // Mostrar secciones adicionales si es modo edición o ver
    if (modo === 'ver' || modo === 'editar') {
        document.getElementById('seccionCotizaciones').style.display = 'block';
        document.getElementById('seccionChat').style.display = 'block';
        document.getElementById('seccionHistorial').style.display = 'block';
        document.getElementById('estadoBadge').style.display = 'inline-block';
        
        // Si hay múltiples cotizaciones, mostrar alerta de cuadro comparativo
        document.getElementById('comparisonAlert').style.display = 'flex';
        
        // Cargar cotizaciones de ejemplo
        cargarCotizacionesEjemplo();
        
        // Cargar chat de ejemplo
        cargarChatEjemplo();
        
        // Cargar historial de ejemplo
        cargarHistorialEjemplo();
    }
    
    if (modo === 'ver') {
        // Modo solo lectura
        document.querySelectorAll('input, select, textarea').forEach(el => {
            el.disabled = true;
        });
        document.querySelectorAll('button').forEach(btn => {
            if (!btn.classList.contains('btn-outline')) {
                btn.style.display = 'none';
            }
        });
        document.querySelector('.page-title').textContent = 'Ver Solicitud de Pedido';
    } else if (modo === 'editar') {
        document.querySelector('.page-title').textContent = 'Editar Solicitud de Pedido';
    } else if (modo === 'nueva-version') {
        versionActual++;
        document.querySelector('.version-badge').textContent = `Versión ${versionActual}`;
        document.querySelector('.page-title').textContent = 'Nueva Versión de Solicitud de Pedido';
        
        // Cambiar el número de solicitud
        const nuevoNumero = generarNumeroSolicitud();
        document.getElementById('idInterno').value = nuevoNumero;
        
        // Actualizar información de versión
        document.querySelector('.version-info span:first-child').textContent = `Número: ${nuevoNumero}`;
    }
    
    // Cargar datos de ejemplo
    document.getElementById('cliente').value = '76123456-K';
    cargarObras();
    setTimeout(() => {
        document.getElementById('obra').value = '1';
        cargarDatosObra();
        document.getElementById('docCliente').value = 'SOLPED-2025-001';
        document.getElementById('subclasificacion').value = 'PEP';
        toggleNumeroSubclasificacion();
        document.getElementById('numeroSubclasificacion').value = 'PEP-001-2025';
        document.getElementById('solicitante').value = 'Juan Pérez';
        document.getElementById('tipoFactura').value = 'AFECTA';
        
        // Cargar información de crédito
        const clienteId = '76123456-K';
        if (creditosPorCliente[clienteId]) {
            const credito = creditosPorCliente[clienteId];
            document.getElementById('creditoOcupado').textContent = formatearMonto(credito.creditoOcupado);
            document.getElementById('creditoDisponible').textContent = formatearMonto(credito.creditoDisponible);
            document.getElementById('solicitudesTramite').textContent = formatearMonto(credito.solicitudesTramite);
        }
        
        // Agregar algunos productos
        agregarFilaProducto();
        setTimeout(() => {
            document.getElementById('codCliente0').value = 'CLI-001';
            buscarProductoCliente(0);
            document.getElementById('cantidad0').value = '100';
        }, 100);
    }, 100);
}

// Toggle número de subclasificación
function toggleNumeroSubclasificacion() {
    const subclasificacion = document.getElementById('subclasificacion').value;
    const numeroField = document.getElementById('numeroSubclasificacion');
    
    if (subclasificacion) {
        numeroField.disabled = false;
        numeroField.placeholder = `Ingrese el número de ${subclasificacion}`;
    } else {
        numeroField.disabled = true;
        numeroField.value = '';
        numeroField.placeholder = 'Ingrese el número';
    }
}

// Formatear montos en pesos chilenos
function formatearMonto(monto) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(monto);
}

// Cargar obras según cliente seleccionado
function cargarObras() {
    const clienteId = document.getElementById('cliente').value;
    const obraSelect = document.getElementById('obra');
    
    obraSelect.innerHTML = '<option value="">Seleccione obra</option>';
    obraSelect.disabled = false;
    
    // Cargar información de línea de crédito
    if (clienteId && creditosPorCliente[clienteId]) {
        const credito = creditosPorCliente[clienteId];
        document.getElementById('creditoOcupado').textContent = formatearMonto(credito.creditoOcupado);
        document.getElementById('creditoDisponible').textContent = formatearMonto(credito.creditoDisponible);
        document.getElementById('solicitudesTramite').textContent = formatearMonto(credito.solicitudesTramite);
    } else {
        // Limpiar valores si no hay cliente seleccionado
        document.getElementById('creditoOcupado').textContent = '$0';
        document.getElementById('creditoDisponible').textContent = '$0';
        document.getElementById('solicitudesTramite').textContent = '$0';
    }
    
    // Simulación de obras por cliente
    const obrasPorCliente = {
        '76123456-K': [
            { id: '1', nombre: 'EDIFICIO PACIFIC BLUE' },
            { id: '2', nombre: 'TORRE ALMAGRO' }
        ],
        '76234567-8': [
            { id: '3', nombre: 'CONDOMINIO VISTA MAR' },
            { id: '4', nombre: 'EDIFICIO PARK TOWER' }
        ],
        '76345678-9': [
            { id: '5', nombre: 'EDIFICIO CENTRAL PARK' }
        ],
        '76456789-0': [
            { id: '6', nombre: 'PROYECTO LAS CONDES' }
        ]
    };
    
    if (obrasPorCliente[clienteId]) {
        obrasPorCliente[clienteId].forEach(obra => {
            const option = document.createElement('option');
            option.value = obra.id;
            option.textContent = obra.nombre;
            obraSelect.appendChild(option);
        });
    }
}

// Cargar datos de la obra seleccionada
function cargarDatosObra() {
    const obraId = document.getElementById('obra').value;
    const direccionInput = document.getElementById('direccionObra');
    const regionInput = document.getElementById('regionObra');
    const btnVerObra = document.getElementById('btnVerObra');
    
    if (obraId && datosObras[obraId]) {
        const obra = datosObras[obraId];
        direccionInput.value = obra.direccion;
        regionInput.value = obra.region;
        btnVerObra.disabled = false;
    } else {
        direccionInput.value = '';
        regionInput.value = '';
        btnVerObra.disabled = true;
    }
}

// Ver detalles de la obra
function verDetallesObra() {
    const obraId = document.getElementById('obra').value;
    const clienteNombre = document.getElementById('cliente').options[document.getElementById('cliente').selectedIndex].text;
    
    if (obraId && datosObras[obraId]) {
        const obra = datosObras[obraId];
        
        // Llenar información de la obra
        document.getElementById('modalObraNombre').textContent = obra.nombre;
        document.getElementById('modalObraCliente').textContent = clienteNombre;
        document.getElementById('modalObraDireccion').textContent = obra.direccion;
        document.getElementById('modalObraRegion').textContent = obra.region;
        
        // Llenar tabla de encargados
        const tbody = document.getElementById('tablaEncargados');
        tbody.innerHTML = '';
        
        obra.encargados.forEach(encargado => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${encargado.nombre}</td>
                <td><a href="mailto:${encargado.email}">${encargado.email}</a></td>
                <td>${encargado.celular}</td>
                <td>
                    ${encargado.roles.map(rol => `<span class="chip">${rol}</span>`).join(' ')}
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Mostrar modal
        document.getElementById('modalDetallesObra').style.display = 'block';
    }
}

// Cerrar modal de obra
function cerrarModalObra() {
    document.getElementById('modalDetallesObra').style.display = 'none';
}

// Agregar fila de producto
function agregarFilaProducto() {
    const tbody = document.getElementById('productTableBody');
    const row = document.createElement('tr');
    row.id = `productRow${productRowIndex}`;
    
    row.innerHTML = `
        <td>
            <input type="text" class="form-control" id="codCliente${productRowIndex}" 
                   onblur="buscarProductoCliente(${productRowIndex})" 
                   placeholder="Código" required>
        </td>
        <td>
            <input type="text" class="form-control" id="descCliente${productRowIndex}" 
                   placeholder="Descripción cliente" readonly>
        </td>
        <td>
            <input type="text" class="form-control" id="modeloMarca${productRowIndex}" 
                   placeholder="Modelo/Marca" readonly>
        </td>
        <td>
            <input type="text" class="form-control" id="codSSL${productRowIndex}" 
                   placeholder="Código SSL" readonly>
        </td>
        <td>
            <input type="text" class="form-control" id="descSSL${productRowIndex}" 
                   placeholder="Descripción SSL" readonly>
        </td>
        <td>
            <input type="text" class="form-control" id="umSSL${productRowIndex}" 
                   placeholder="U.M." readonly>
        </td>
        <td>
            <input type="number" class="form-control" id="cantidad${productRowIndex}" 
                   min="1" placeholder="0" required>
        </td>
        <td>
            <input type="date" class="form-control" id="fechaReq${productRowIndex}" required>
        </td>
        <td>
            <div class="product-actions">
                <button type="button" class="btn btn-primary btn-sm btn-icon" onclick="abrirModalBusqueda(${productRowIndex})" title="Buscar producto">
                    <i class="fas fa-search"></i>
                </button>
                <button type="button" class="btn btn-info btn-sm btn-icon" onclick="abrirModalInfoAdicional(${productRowIndex})" title="Información adicional">
                    <i class="fas fa-info-circle"></i>
                </button>
                <button type="button" class="btn btn-danger btn-sm btn-icon" onclick="eliminarFilaProducto(${productRowIndex})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    tbody.appendChild(row);
    
    // Set fecha requerida from the main form field
    const fechaReqInput = document.getElementById(`fechaReq${productRowIndex}`);
    const fechaRequeridaObra = document.getElementById('fechaRequerida').value;
    
    if (fechaRequeridaObra) {
        fechaReqInput.value = fechaRequeridaObra;
    } else {
        // If no date is set in the main field, use next week as default
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        fechaReqInput.value = nextWeek.toISOString().split('T')[0];
    }
    
    productRowIndex++;
}

// Buscar producto del cliente
function buscarProductoCliente(rowIndex) {
    const codCliente = document.getElementById(`codCliente${rowIndex}`).value.trim();
    
    if (!codCliente) return;
    
    const producto = catalogoProductosCliente.find(p => p.codigoCliente === codCliente);
    
    if (producto) {
        document.getElementById(`descCliente${rowIndex}`).value = producto.descripcionCliente;
        document.getElementById(`codSSL${rowIndex}`).value = producto.codigoSSL;
        document.getElementById(`descSSL${rowIndex}`).value = producto.descripcionSSL;
        document.getElementById(`umSSL${rowIndex}`).value = producto.umSSL;
        
        // Verificar si hay avisos para este producto
        if (producto.avisos && producto.avisos.length > 0) {
            // Marcar la fila como que tiene información adicional
            const row = document.getElementById(`productRow${rowIndex}`);
            row.classList.add('has-details');
        }
    } else {
        // Producto no encontrado, abrir modal de búsqueda
        abrirModalBusqueda(rowIndex);
    }
}

// Abrir modal de búsqueda
function abrirModalBusqueda(rowIndex) {
    currentEditingRow = rowIndex;
    productoSeleccionado = null;
    document.getElementById('modalBuscarProducto').style.display = 'block';
    
    // Limpiar búsqueda
    document.getElementById('busquedaTexto').value = '';
    document.getElementById('busquedaFamilia').value = '';
    document.getElementById('resultadosBusqueda').innerHTML = '';
    document.getElementById('btnSeleccionarProducto').disabled = true;
    
    // Si ya hay un código ingresado, buscarlo
    const codCliente = document.getElementById(`codCliente${rowIndex}`).value;
    if (codCliente) {
        document.getElementById('busquedaTexto').value = codCliente;
        buscarProductosCliente();
    }
}

// Buscar productos del cliente
function buscarProductosCliente() {
    const texto = document.getElementById('busquedaTexto').value.toLowerCase();
    const familia = document.getElementById('busquedaFamilia').value;
    
    let productosFiltrados = catalogoProductosCliente;
    
    // Filtrar por texto
    if (texto) {
        productosFiltrados = productosFiltrados.filter(p => 
            p.codigoCliente.toLowerCase().includes(texto) ||
            p.descripcionCliente.toLowerCase().includes(texto) ||
            p.familia.toLowerCase().includes(texto)
        );
    }
    
    // Filtrar por familia
    if (familia) {
        productosFiltrados = productosFiltrados.filter(p => p.familia === familia);
    }
    
    // Mostrar resultados
    const contenedor = document.getElementById('resultadosBusqueda');
    contenedor.innerHTML = '';
    
    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">No se encontraron productos</div>';
    } else {
        productosFiltrados.forEach(producto => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML = `
                <div class="search-result-code">${producto.codigoCliente}</div>
                <div class="search-result-desc">${producto.descripcionCliente}</div>
                <div class="search-result-ssl">SSL: ${producto.codigoSSL} - ${producto.descripcionSSL}</div>
                <div class="search-result-family">Familia: ${producto.familia}</div>
            `;
            div.onclick = () => seleccionarProductoBusqueda(producto);
            contenedor.appendChild(div);
        });
    }
}

// Seleccionar producto de búsqueda
function seleccionarProductoBusqueda(producto) {
    productoSeleccionado = producto;
    
    // Marcar como seleccionado
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Habilitar botón
    document.getElementById('btnSeleccionarProducto').disabled = false;
}

// Seleccionar producto
function seleccionarProducto() {
    if (productoSeleccionado && currentEditingRow !== null) {
        document.getElementById(`codCliente${currentEditingRow}`).value = productoSeleccionado.codigoCliente;
        document.getElementById(`descCliente${currentEditingRow}`).value = productoSeleccionado.descripcionCliente;
        document.getElementById(`codSSL${currentEditingRow}`).value = productoSeleccionado.codigoSSL;
        document.getElementById(`descSSL${currentEditingRow}`).value = productoSeleccionado.descripcionSSL;
        document.getElementById(`umSSL${currentEditingRow}`).value = productoSeleccionado.umSSL;
        
        // Verificar si hay avisos
        if (productoSeleccionado.avisos && productoSeleccionado.avisos.length > 0) {
            const row = document.getElementById(`productRow${currentEditingRow}`);
            row.classList.add('has-details');
        }
        
        cerrarModalBusqueda();
    }
}

// Cerrar modal de búsqueda
function cerrarModalBusqueda() {
    document.getElementById('modalBuscarProducto').style.display = 'none';
    currentEditingRow = null;
    productoSeleccionado = null;
}

// Abrir modal de información adicional
function abrirModalInfoAdicional(rowIndex) {
    currentEditingRow = rowIndex;
    
    const codCliente = document.getElementById(`codCliente${rowIndex}`).value;
    const descCliente = document.getElementById(`descCliente${rowIndex}`).value;
    const cantidad = document.getElementById(`cantidad${rowIndex}`).value;
    
    if (!codCliente) {
        alert('Primero debe seleccionar un producto');
        return;
    }
    
    // Mostrar información del producto
    document.getElementById('infoProductoCodigo').textContent = codCliente;
    document.getElementById('infoProductoDescripcion').textContent = descCliente;
    document.getElementById('infoCantidad').value = cantidad || 0;
    
    // Cargar información adicional si existe
    if (detallesProductos[rowIndex]) {
        const detalles = detallesProductos[rowIndex];
        document.getElementById('infoDimensiones').value = detalles.dimensiones || '';
        document.getElementById('infoPesoUnitario').value = detalles.pesoUnitario || '';
        document.getElementById('infoVolumenUnitario').value = detalles.volumenUnitario || '';
        document.getElementById('infoMarca').value = detalles.marca || '';
        document.getElementById('infoOtraMarca').value = detalles.otraMarca || '';
        document.getElementById('infoModelo').value = detalles.modelo || '';
        document.getElementById('infoComentario').value = detalles.comentario || '';
        
        if (detalles.marca === 'OTRO') {
            document.getElementById('grupoOtraMarca').style.display = 'block';
        }
    } else {
        // Limpiar campos
        document.getElementById('infoDimensiones').value = '';
        document.getElementById('infoPesoUnitario').value = '';
        document.getElementById('infoVolumenUnitario').value = '';
        document.getElementById('infoMarca').value = '';
        document.getElementById('infoOtraMarca').value = '';
        document.getElementById('infoModelo').value = '';
        document.getElementById('infoComentario').value = '';
        document.getElementById('grupoOtraMarca').style.display = 'none';
        document.getElementById('infoConsideraciones').value = 'Sin consideraciones especiales para este producto';
    }
    
    // Buscar avisos del producto
    const producto = catalogoProductosCliente.find(p => p.codigoCliente === codCliente);
    if (producto && producto.avisos && producto.avisos.length > 0) {
        const listaAvisos = document.getElementById('listaAvisos');
        listaAvisos.innerHTML = '';
        producto.avisos.forEach(aviso => {
            const li = document.createElement('li');
            li.textContent = aviso;
            listaAvisos.appendChild(li);
        });
        document.getElementById('avisoProducto').style.display = 'block';
    } else {
        document.getElementById('avisoProducto').style.display = 'none';
    }
    
    // Cargar consideraciones del producto
    if (producto && producto.consideraciones) {
        document.getElementById('infoConsideraciones').value = producto.consideraciones;
    } else {
        document.getElementById('infoConsideraciones').value = 'Sin consideraciones especiales para este producto';
    }
    
    calcularTotales();
    
    // Mostrar modal
    document.getElementById('modalInfoAdicional').style.display = 'block';
}

// Calcular totales
function calcularTotales() {
    const cantidad = parseFloat(document.getElementById('infoCantidad').value) || 0;
    const pesoUnitario = parseFloat(document.getElementById('infoPesoUnitario').value) || 0;
    const volumenUnitario = parseFloat(document.getElementById('infoVolumenUnitario').value) || 0;
    
    const pesoTotal = cantidad * pesoUnitario;
    const volumenTotal = cantidad * volumenUnitario;
    
    document.getElementById('pesoTotal').textContent = `${pesoTotal.toFixed(2)} kg`;
    document.getElementById('volumenTotal').textContent = `${volumenTotal.toFixed(3)} m³`;
}

// Verificar si seleccionó "Otro" en marca
function checkOtraMarca() {
    const marca = document.getElementById('infoMarca').value;
    document.getElementById('grupoOtraMarca').style.display = marca === 'OTRO' ? 'block' : 'none';
}

// Guardar información adicional
function guardarInfoAdicional() {
    if (currentEditingRow !== null) {
        const detalles = {
            dimensiones: document.getElementById('infoDimensiones').value,
            pesoUnitario: document.getElementById('infoPesoUnitario').value,
            volumenUnitario: document.getElementById('infoVolumenUnitario').value,
            marca: document.getElementById('infoMarca').value,
            otraMarca: document.getElementById('infoOtraMarca').value,
            modelo: document.getElementById('infoModelo').value,
            comentario: document.getElementById('infoComentario').value
        };
        
        detallesProductos[currentEditingRow] = detalles;
        
        // Marcar la fila como que tiene detalles
        const row = document.getElementById(`productRow${currentEditingRow}`);
        row.classList.add('has-details');
        
        // Agregar indicador visual
        const accionesCell = row.querySelector('.product-actions');
        if (!accionesCell.querySelector('.details-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'details-indicator';
            indicator.innerHTML = '<i class="fas fa-info"></i>';
            indicator.title = 'Este producto tiene información adicional';
            accionesCell.appendChild(indicator);
        }
        
        cerrarModalInfoAdicional();
        alert('Información adicional guardada correctamente');
    }
}

// Cerrar modal de información adicional
function cerrarModalInfoAdicional() {
    document.getElementById('modalInfoAdicional').style.display = 'none';
    currentEditingRow = null;
}

// Eliminar fila de producto
function eliminarFilaProducto(rowIndex) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
        document.getElementById(`productRow${rowIndex}`).remove();
        // Eliminar detalles adicionales si existen
        delete detallesProductos[rowIndex];
    }
}

// Manejo de archivos
function dragOverHandler(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.add('dragover');
}

function dragEnterHandler(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.add('dragover');
}

function dragLeaveHandler(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.remove('dragover');
}

function dropHandler(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.remove('dragover');
    
    const files = ev.dataTransfer.files;
    handleFiles(files);
}

function handleFiles(files) {
    const fileList = document.getElementById('fileList');
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.id = `file-${Date.now()}-${i}`;
        
        const fileIcon = getFileIcon(file.name);
        const fileSize = formatFileSize(file.size);
        
        fileItem.innerHTML = `
            <i class="${fileIcon}"></i>
            <span class="file-name">${file.name}</span>
            <span class="file-size">${fileSize}</span>
            <span class="file-remove" onclick="removeFile('${fileItem.id}')">
                <i class="fas fa-times"></i>
            </span>
        `;
        
        fileList.appendChild(fileItem);
    }
}

function getFileIcon(fileName) {
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
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeFile(fileId) {
    document.getElementById(fileId).remove();
}

// Guardar borrador
function guardarBorrador() {
    alert('Borrador guardado exitosamente. Puede continuar editando más tarde.');
}

// Generar nueva versión
function generarNuevaVersion() {
    if (confirm('¿Está seguro de generar una nueva versión de esta solicitud? Se copiarán todos los datos actuales.')) {
        versionActual++;
        document.querySelector('.version-badge').textContent = `Versión ${versionActual}`;
        
        // Generar nuevo número
        const nuevoNumero = generarNumeroSolicitud();
        document.getElementById('idInterno').value = nuevoNumero;
        
        alert(`Nueva versión ${versionActual} creada exitosamente.\nNúmero: ${nuevoNumero}`);
        
        // Actualizar la información de versión
        document.querySelector('.version-info span:first-child').textContent = `Número: ${nuevoNumero}`;
    }
}

// Generar número de solicitud
function generarNumeroSolicitud() {
    const now = new Date();
    const year = now.getFullYear();
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `SOL-${year}-${random}`;
}

// Limpiar formulario
function limpiarFormulario() {
    if (confirm('¿Está seguro de cancelar? Se perderán todos los datos ingresados.')) {
        document.getElementById('solicitudForm').reset();
        document.getElementById('productTableBody').innerHTML = '';
        document.getElementById('fileList').innerHTML = '';
        productRowIndex = 0;
        detallesProductos = {};
        
        // Si está en modo edición, volver al listado
        if (modoFormulario !== 'nuevo') {
            window.location.href = 'ssl_rs_listado_solicitud_pedido.html';
        }
    }
}

// Ver cuadro comparativo
function verCuadroComparativo() {
    const numero = document.getElementById('idInterno').value;
    window.location.href = `../evaluacion-analisis/ssl_ea_detalle_cuadro_comparativo.html?solicitud=${numero}`;
}

// Ver versión histórica
function verVersionHistorica(numeroSolicitud, version) {
    // Abrir en modo solo lectura
    window.open(`ssl_rs_detalle_solicitud_pedido.html?numero=${numeroSolicitud}&version=${version}&modo=ver`, '_blank');
}

// Cargar cotizaciones de ejemplo
function cargarCotizacionesEjemplo() {
    const container = document.getElementById('cotizacionesAsociadas');
    container.innerHTML = `
        <div class="quotation-card" onclick="window.location.href='../cotizacion-proveedores/ssl_detalle_cotizacion_cliente.html?numero=COT-2025-0145'">
            <div class="quotation-header">
                <div>
                    <div class="quotation-number">COT-2025-0145</div>
                    <div class="quotation-date">22/05/2025</div>
                </div>
                <span class="status-badge" style="background-color: #d4edda; color: #155724;">
                    <i class="fas fa-circle" style="font-size: 0.6rem;"></i> Vigente
                </span>
            </div>
            <div class="quotation-info">
                <div class="quotation-field">
                    <span class="quotation-label">Ejecutivo SSL:</span>
                    <span class="quotation-value">María González</span>
                </div>
                <div class="quotation-field">
                    <span class="quotation-label">Cobertura:</span>
                    <span class="quotation-value">Total (77%)</span>
                </div>
                <div class="quotation-field">
                    <span class="quotation-label">Productos cotizados:</span>
                    <span class="quotation-value">2 de 3</span>
                </div>
                <div class="quotation-field">
                    <span class="quotation-label">Vigencia:</span>
                    <span class="quotation-value">30 días</span>
                </div>
            </div>
            <div class="quotation-total">
                <span class="quotation-label">Monto Total:</span>
                <span class="quotation-value">$690,950</span>
            </div>
        </div>

        <div class="quotation-card" onclick="window.location.href='../cotizacion-proveedores/ssl_cp_detalle_cotizacion_cliente.html?numero=COT-2025-0144'">
            <div class="quotation-header">
                <div>
                    <div class="quotation-number">COT-2025-0144</div>
                    <div class="quotation-date">21/05/2025</div>
                </div>
                <span class="status-badge" style="background-color: #fff3cd; color: #856404;">
                    <i class="fas fa-clock" style="font-size: 0.6rem;"></i> Pendiente
                </span>
            </div>
            <div class="quotation-info">
                <div class="quotation-field">
                    <span class="quotation-label">Ejecutivo SSL:</span>
                    <span class="quotation-value">Carlos Ruiz</span>
                </div>
                <div class="quotation-field">
                    <span class="quotation-label">Cobertura:</span>
                    <span class="quotation-value">Parcial (33%)</span>
                </div>
                <div class="quotation-field">
                    <span class="quotation-label">Productos cotizados:</span>
                    <span class="quotation-value">1 de 3</span>
                </div>
                <div class="quotation-field">
                    <span class="quotation-label">Vigencia:</span>
                    <span class="quotation-value">30 días</span>
                </div>
            </div>
            <div class="quotation-total">
                <span class="quotation-label">Monto Total:</span>
                <span class="quotation-value">$571,200</span>
            </div>
        </div>
    `;
}

// Cargar chat de ejemplo
function cargarChatEjemplo() {
    const container = document.querySelector('.chat-messages');
    container.innerHTML = `
        <!-- Mensaje del cliente -->
        <div class="chat-message">
            <div class="chat-avatar">JP</div>
            <div class="chat-content">
                <div class="chat-author">Juan Pérez - Cliente</div>
                <div class="chat-bubble">
                    Buenos días, hemos enviado la solicitud de pedido. ¿Hay alguna especificación adicional que debamos considerar?
                </div>
                <div class="chat-time">22/05/2025 09:30</div>
            </div>
        </div>

        <!-- Mensaje del ejecutivo SSL -->
        <div class="chat-message sent">
            <div class="chat-content">
                <div class="chat-author">Usted - Ejecutivo SSL</div>
                <div class="chat-bubble">
                    Buenos días Juan. Recibimos su solicitud. Necesitamos confirmar si el cable eléctrico debe ser certificado SEC. Es importante para la cotización.
                </div>
                <div class="chat-time">22/05/2025 10:15</div>
            </div>
            <div class="chat-avatar">MG</div>
        </div>

        <!-- Respuesta del cliente -->
        <div class="chat-message">
            <div class="chat-avatar">JP</div>
            <div class="chat-content">
                <div class="chat-author">Juan Pérez - Cliente</div>
                <div class="chat-bubble">
                    Sí, efectivamente. Todo el cable eléctrico debe ser certificado SEC. Es un requisito obligatorio para esta obra.
                </div>
                <div class="chat-time">22/05/2025 10:45</div>
            </div>
        </div>
    `;
}

// Cargar historial de ejemplo
function cargarHistorialEjemplo() {
    const container = document.querySelector('.timeline');
    container.innerHTML = `
        <div class="timeline-item">
            <div class="timeline-marker">
                <i class="fas fa-check"></i>
            </div>
            <div class="timeline-content">
                <div class="timeline-date">22/05/2025 16:45</div>
                <div class="timeline-title">Cotizada</div>
                <div class="timeline-description">Se ha generado la cotización COT-2025-0145</div>
            </div>
        </div>
        <div class="timeline-item">
            <div class="timeline-marker">
                <i class="fas fa-search"></i>
            </div>
            <div class="timeline-content">
                <div class="timeline-date">21/05/2025 10:30</div>
                <div class="timeline-title">Cotizando</div>
                <div class="timeline-description">Solicitud enviada a proveedores para cotización</div>
            </div>
        </div>
        <div class="timeline-item">
            <div class="timeline-marker">
                <i class="fas fa-code-branch"></i>
            </div>
            <div class="timeline-content" style="background: linear-gradient(to right, #e0e7ff, #f8f9fa);">
                <div class="timeline-date">20/05/2025 15:00</div>
                <div class="timeline-title" style="color: var(--secondary-color);">Nueva Versión Creada - Versión 2</div>
                <div class="timeline-description">
                    Se creó una nueva versión basada en la solicitud SOL-2025-0000 (Versión 1)
                    <br>
                    <button class="btn btn-sm btn-outline" style="margin-top: 10px;" onclick="verVersionHistorica('SOL-2025-0000', '1')">
                        <i class="fas fa-eye"></i> Ver versión anterior
                    </button>
                </div>
            </div>
        </div>
        <div class="timeline-item">
            <div class="timeline-marker">
                <i class="fas fa-file-alt"></i>
            </div>
            <div class="timeline-content">
                <div class="timeline-date">20/05/2025 14:30</div>
                <div class="timeline-title">Nueva Solicitud (Versión 1)</div>
                <div class="timeline-description">Solicitud creada y registrada en el sistema</div>
            </div>
        </div>
    `;
}

// Enviar mensaje en el chat
function enviarMensaje() {
    const input = document.getElementById('chatInput');
    const mensaje = input.value.trim();
    
    if (!mensaje) return;
    
    const chatMessages = document.querySelector('.chat-messages');
    
    // Crear nuevo mensaje
    const now = new Date();
    const timeString = now.toLocaleString('es-CL', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const newMessage = document.createElement('div');
    newMessage.className = 'chat-message sent';
    newMessage.innerHTML = `
        <div class="chat-content">
            <div class="chat-author">Usted - Ejecutivo SSL</div>
            <div class="chat-bubble">${mensaje}</div>
            <div class="chat-time">${timeString}</div>
        </div>
        <div class="chat-avatar">MG</div>
    `;
    
    chatMessages.appendChild(newMessage);
    
    // Limpiar input y hacer scroll
    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simular respuesta del cliente después de 2 segundos
    setTimeout(() => {
        const respuesta = document.createElement('div');
        respuesta.className = 'chat-message';
        respuesta.innerHTML = `
            <div class="chat-avatar">JP</div>
            <div class="chat-content">
                <div class="chat-author">Juan Pérez - Cliente</div>
                <div class="chat-bubble">Gracias por la información. Estaré atento a las actualizaciones.</div>
                <div class="chat-time">${new Date().toLocaleString('es-CL', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                })}</div>
            </div>
        `;
        
        chatMessages.appendChild(respuesta);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 2000);
}

// Submit form
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validar que haya al menos un producto
    const productRows = document.querySelectorAll('#productTableBody tr');
    if (productRows.length === 0) {
        alert('Debe agregar al menos un producto a la solicitud');
        return;
    }
    
    // Validar productos
    let productosValidos = true;
    let montoTotal = 0;
    productRows.forEach((row, index) => {
        const cantidad = row.querySelector(`input[id^="cantidad"]`).value;
        const fechaReq = row.querySelector(`input[id^="fechaReq"]`).value;
        const codSSL = row.querySelector(`input[id^="codSSL"]`).value;
        
        if (!cantidad || !fechaReq || !codSSL) {
            productosValidos = false;
        }
        
        // Calcular monto total (simulación - en producción vendría del servidor)
        if (cantidad) {
            montoTotal += parseFloat(cantidad) * 1000; // Precio simulado
        }
    });
    
    if (!productosValidos) {
        alert('Por favor complete todos los campos de los productos');
        return;
    }
    
    // Validar línea de crédito
    const clienteId = document.getElementById('cliente').value;
    if (clienteId && creditosPorCliente[clienteId]) {
        const creditoDisponible = creditosPorCliente[clienteId].creditoDisponible;
        if (montoTotal > creditoDisponible) {
            alert(`El monto total de la solicitud (${formatearMonto(montoTotal)}) excede el crédito disponible (${formatearMonto(creditoDisponible)}). Por favor ajuste las cantidades o consulte con el área comercial.`);
            return;
        }
    }
    
    // Si todo está bien, enviar
    if (confirm('¿Está seguro de enviar la solicitud a cotizar?')) {
        alert('Solicitud enviada exitosamente. Número de solicitud: ' + document.getElementById('idInterno').value);
        
        // Redireccionar al listado
        setTimeout(() => {
            window.location.href = 'ssl_listado_solicitud_pedido.html';
        }, 1000);
    }
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Hacer funciones globales
window.toggleNumeroSubclasificacion = toggleNumeroSubclasificacion;
window.cargarObras = cargarObras;
window.cargarDatosObra = cargarDatosObra;
window.verDetallesObra = verDetallesObra;
window.cerrarModalObra = cerrarModalObra;
window.agregarFilaProducto = agregarFilaProducto;
window.buscarProductoCliente = buscarProductoCliente;
window.abrirModalBusqueda = abrirModalBusqueda;
window.buscarProductosCliente = buscarProductosCliente;
window.seleccionarProducto = seleccionarProducto;
window.cerrarModalBusqueda = cerrarModalBusqueda;
window.abrirModalInfoAdicional = abrirModalInfoAdicional;
window.checkOtraMarca = checkOtraMarca;
window.guardarInfoAdicional = guardarInfoAdicional;
window.cerrarModalInfoAdicional = cerrarModalInfoAdicional;
window.eliminarFilaProducto = eliminarFilaProducto;
window.dragOverHandler = dragOverHandler;
window.dragEnterHandler = dragEnterHandler;
window.dragLeaveHandler = dragLeaveHandler;
window.dropHandler = dropHandler;
window.handleFiles = handleFiles;
window.removeFile = removeFile;
window.guardarBorrador = guardarBorrador;
window.generarNuevaVersion = generarNuevaVersion;
window.limpiarFormulario = limpiarFormulario;
window.verCuadroComparativo = verCuadroComparativo;
window.verVersionHistorica = verVersionHistorica;
window.enviarMensaje = enviarMensaje;