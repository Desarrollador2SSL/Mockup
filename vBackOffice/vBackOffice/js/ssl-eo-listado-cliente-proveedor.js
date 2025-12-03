/**
 * ssl-listado-cliente-proveedor-scripts.js
 * JavaScript específico para la gestión de Clientes y Proveedores
 */

// Namespace para evitar conflictos
const ClienteProveedor = {
    // Datos de ejemplo
    empresasData: [
        {
            rut: '76.123.456-7',
            razonSocial: 'CONSTRUCTORA ALMAGRO S.A.',
            giroComercial: 'Construcción de Edificios',
            tipo: 'cliente',
            creditoVenta: 50000000,
            creditoCompra: 0,
            direccionPrincipal: 'Av. Las Condes 1234, Las Condes, Región Metropolitana',
            direccionFacturacion: 'Av. Las Condes 1234, Las Condes, Región Metropolitana',
            emailFacturacion: 'facturacion@almagro.cl'
        },
        {
            rut: '76.234.567-8',
            razonSocial: 'CEMENTOS BIO BIO S.A.',
            giroComercial: 'Fabricación de Cemento',
            tipo: 'proveedor',
            creditoVenta: 0,
            creditoCompra: 100000000,
            direccionPrincipal: 'Av. Industrial 890, Talcahuano, Región del Biobío',
            direccionFacturacion: 'Av. Industrial 890, Talcahuano, Región del Biobío',
            emailFacturacion: 'facturacion@cbb.cl'
        },
        {
            rut: '76.345.678-9',
            razonSocial: 'FERRETERÍA INDUSTRIAL LTDA.',
            giroComercial: 'Venta de Materiales',
            tipo: 'ambos',
            creditoVenta: 20000000,
            creditoCompra: 30000000,
            direccionPrincipal: 'Av. Industrial 567, Quilicura, Región Metropolitana',
            direccionFacturacion: 'Av. Industrial 567, Quilicura, Región Metropolitana',
            emailFacturacion: 'facturacion@ferreteriaindustrial.cl',
            contactos: [
                {
                    nombre: 'Carlos Martínez Soto',
                    cargo: 'Gerente Comercial',
                    celular: '+56 9 8765 4321',
                    tipo: 'comercial',
                    email: 'cmartinez@ferreteriaindustrial.cl'
                },
                {
                    nombre: 'Patricia Rojas Díaz',
                    cargo: 'Jefe de Ventas',
                    celular: '+56 9 7654 3210',
                    tipo: 'comercial',
                    email: 'projas@ferreteriaindustrial.cl'
                },
                {
                    nombre: 'Roberto Fuentes López',
                    cargo: 'Coordinador Técnico',
                    celular: '+56 9 6543 2109',
                    tipo: 'tecnico',
                    email: 'rfuentes@ferreteriaindustrial.cl'
                }
            ],
            obrasCliente: [
                {
                    nombre: 'REMODELACIÓN TIENDA NORTE',
                    cantidadOC: 5,
                    montoVendido: 8750000,
                    montoCobrar: 2250000,
                    estado: 'Activa'
                },
                {
                    nombre: 'AMPLIACIÓN BODEGA CENTRAL',
                    cantidadOC: 3,
                    montoVendido: 4450000,
                    montoCobrar: 1200000,
                    estado: 'Activa'
                },
                {
                    nombre: 'MANTENCIÓN ANUAL SUCURSALES',
                    cantidadOC: 8,
                    montoVendido: 5800000,
                    montoCobrar: 0,
                    estado: 'Finalizada'
                }
            ],
            obrasProveedor: [
                {
                    nombre: 'EDIFICIO MARINA TOWER',
                    cliente: 'INMOBILIARIA INGEVEC',
                    cantidadOC: 8,
                    montoFacturado: 8500000,
                    montoPagar: 2500000,
                    estado: 'En Ejecución'
                },
                {
                    nombre: 'CONDOMINIO VISTA HERMOSA',
                    cliente: 'CONSTRUCTORA SOCOVESA',
                    cantidadOC: 12,
                    montoFacturado: 12750000,
                    montoPagar: 3850000,
                    estado: 'En Ejecución'
                },
                {
                    nombre: 'PARQUE INDUSTRIAL NORTE',
                    cliente: 'DESARROLLOS INDUSTRIALES S.A.',
                    cantidadOC: 5,
                    montoFacturado: 6200000,
                    montoPagar: 0,
                    estado: 'Finalizada'
                },
                {
                    nombre: 'CENTRO COMERCIAL PLAZA SUR',
                    cliente: 'MALL PLAZA S.A.',
                    cantidadOC: 3,
                    montoFacturado: 4670000,
                    montoPagar: 1200000,
                    estado: 'En Ejecución'
                }
            ]
        },
        {
            rut: '76.456.789-0',
            razonSocial: 'INMOBILIARIA INGEVEC',
            giroComercial: 'Desarrollo Inmobiliario',
            tipo: 'cliente',
            creditoVenta: 80000000,
            creditoCompra: 0,
            direccionPrincipal: 'Av. El Bosque Norte 500, Las Condes, Región Metropolitana',
            direccionFacturacion: 'Av. El Bosque Norte 500, Las Condes, Región Metropolitana',
            emailFacturacion: 'facturacion@ingevec.cl'
        },
        {
            rut: '76.567.890-1',
            razonSocial: 'MATERIALES DEL SUR S.A.',
            giroComercial: 'Distribución de Materiales',
            tipo: 'proveedor',
            creditoVenta: 0,
            creditoCompra: 75000000,
            direccionPrincipal: 'Ruta 5 Sur Km 1020, Los Ángeles, Región del Biobío',
            direccionFacturacion: 'Ruta 5 Sur Km 1020, Los Ángeles, Región del Biobío',
            emailFacturacion: 'facturacion@materialesdelsur.cl'
        }
    ],

    currentEditingRut: null,

    // Inicialización
    init() {
        this.loadEmpresas();
        this.attachEventListeners();
    },

    // Cargar empresas en la tabla
    loadEmpresas() {
        const tbody = document.getElementById('empresas-tbody');
        tbody.innerHTML = '';

        this.empresasData.forEach(empresa => {
            const row = document.createElement('tr');
            row.onclick = () => this.viewEmpresa(empresa.rut);
            
            let tipoBadge = '';
            let creditoDisplay = '';
            
            if (empresa.tipo === 'cliente') {
                tipoBadge = '<span class="type-badge badge-cliente"><i class="fas fa-user-tie"></i> Cliente</span>';
                creditoDisplay = this.formatCurrency(empresa.creditoVenta);
            } else if (empresa.tipo === 'proveedor') {
                tipoBadge = '<span class="type-badge badge-proveedor"><i class="fas fa-truck"></i> Proveedor</span>';
                creditoDisplay = this.formatCurrency(empresa.creditoCompra);
            } else {
                tipoBadge = '<span class="type-badge badge-ambos"><i class="fas fa-exchange-alt"></i> Ambos</span>';
                creditoDisplay = `C: ${this.formatCurrency(empresa.creditoVenta, true)} / P: ${this.formatCurrency(empresa.creditoCompra, true)}`;
            }

            row.innerHTML = `
                <td><strong>${empresa.rut}</strong></td>
                <td>${empresa.razonSocial}</td>
                <td>${empresa.giroComercial}</td>
                <td>${tipoBadge}</td>
                <td style="text-align: right;">${creditoDisplay}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-info btn-sm" onclick="event.stopPropagation(); ClienteProveedor.viewEmpresa('${empresa.rut}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning btn-sm" onclick="event.stopPropagation(); ClienteProveedor.editEmpresa('${empresa.rut}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    // Funciones de filtro
    searchEmpresas() {
        const rut = document.getElementById('filter-rut').value.toLowerCase();
        const nombre = document.getElementById('filter-nombre').value.toLowerCase();
        const tipo = document.getElementById('filter-tipo').value;
        const giro = document.getElementById('filter-giro').value.toLowerCase();

        const filteredData = this.empresasData.filter(empresa => {
            return (!rut || empresa.rut.toLowerCase().includes(rut)) &&
                   (!nombre || empresa.razonSocial.toLowerCase().includes(nombre)) &&
                   (!tipo || empresa.tipo === tipo) &&
                   (!giro || empresa.giroComercial.toLowerCase().includes(giro));
        });

        this.renderFilteredEmpresas(filteredData);
    },

    renderFilteredEmpresas(data) {
        const tbody = document.getElementById('empresas-tbody');
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #666;">No se encontraron resultados</td></tr>';
            return;
        }

        data.forEach(empresa => {
            const row = document.createElement('tr');
            row.onclick = () => this.viewEmpresa(empresa.rut);
            
            let tipoBadge = '';
            let creditoDisplay = '';
            
            if (empresa.tipo === 'cliente') {
                tipoBadge = '<span class="type-badge badge-cliente"><i class="fas fa-user-tie"></i> Cliente</span>';
                creditoDisplay = this.formatCurrency(empresa.creditoVenta);
            } else if (empresa.tipo === 'proveedor') {
                tipoBadge = '<span class="type-badge badge-proveedor"><i class="fas fa-truck"></i> Proveedor</span>';
                creditoDisplay = this.formatCurrency(empresa.creditoCompra);
            } else {
                tipoBadge = '<span class="type-badge badge-ambos"><i class="fas fa-exchange-alt"></i> Ambos</span>';
                creditoDisplay = `C: ${this.formatCurrency(empresa.creditoVenta, true)} / P: ${this.formatCurrency(empresa.creditoCompra, true)}`;
            }

            row.innerHTML = `
                <td><strong>${empresa.rut}</strong></td>
                <td>${empresa.razonSocial}</td>
                <td>${empresa.giroComercial}</td>
                <td>${tipoBadge}</td>
                <td style="text-align: right;">${creditoDisplay}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-info btn-sm" onclick="event.stopPropagation(); ClienteProveedor.viewEmpresa('${empresa.rut}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning btn-sm" onclick="event.stopPropagation(); ClienteProveedor.editEmpresa('${empresa.rut}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Actualizar contador
        document.querySelector('.results-count').textContent = `Mostrando ${data.length} de ${this.empresasData.length} empresas`;
    },

    clearFilters() {
        document.getElementById('filter-rut').value = '';
        document.getElementById('filter-nombre').value = '';
        document.getElementById('filter-tipo').value = '';
        document.getElementById('filter-giro').value = '';
        this.loadEmpresas();
    },

    // Funciones de modal
    openNewEmpresaModal() {
        document.getElementById('modal-action').textContent = 'Nueva';
        document.getElementById('empresaModal').style.display = 'block';
        this.clearEmpresaForm();
        this.currentEditingRut = null;
    },

    closeEmpresaModal() {
        document.getElementById('empresaModal').style.display = 'none';
        this.currentEditingRut = null;
    },

    viewEmpresa(rut) {
        const empresa = this.empresasData.find(e => e.rut === rut);
        if (!empresa) return;

        // Actualizar título del modal
        document.querySelector('#view-modal-title span').textContent = empresa.razonSocial;
        
        // Actualizar información general
        document.querySelector('#view-rut strong').textContent = empresa.rut;
        document.querySelector('#view-razon strong').textContent = empresa.razonSocial;
        document.getElementById('view-giro').textContent = empresa.giroComercial;
        
        // Tipo de empresa
        let tipoBadge = '';
        if (empresa.tipo === 'cliente') {
            tipoBadge = '<span class="type-badge badge-cliente"><i class="fas fa-user-tie"></i> Cliente</span>';
        } else if (empresa.tipo === 'proveedor') {
            tipoBadge = '<span class="type-badge badge-proveedor"><i class="fas fa-truck"></i> Proveedor</span>';
        } else {
            tipoBadge = '<span class="type-badge badge-ambos"><i class="fas fa-exchange-alt"></i> Cliente y Proveedor</span>';
        }
        document.getElementById('view-tipo').innerHTML = tipoBadge;
        
        // Direcciones
        document.getElementById('view-direccion-principal').textContent = empresa.direccionPrincipal;
        document.getElementById('view-direccion-facturacion').textContent = empresa.direccionFacturacion;
        document.getElementById('view-email-facturacion').innerHTML = `<i class="fas fa-envelope"></i> ${empresa.emailFacturacion}`;
        
        // Contactos
        const contactsTbody = document.getElementById('view-contacts-tbody');
        contactsTbody.innerHTML = '';
        
        if (empresa.contactos && empresa.contactos.length > 0) {
            empresa.contactos.forEach(contacto => {
                const row = document.createElement('tr');
                const tipoBadge = contacto.tipo === 'comercial' ? 
                    '<span class="type-badge badge-cliente">Comercial</span>' : 
                    '<span class="type-badge badge-proveedor">Técnico</span>';
                
                row.innerHTML = `
                    <td>${contacto.nombre}</td>
                    <td>${contacto.cargo}</td>
                    <td>${contacto.celular}</td>
                    <td>${tipoBadge}</td>
                    <td>${contacto.email}</td>
                `;
                contactsTbody.appendChild(row);
            });
        } else {
            contactsTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #666;">No hay contactos registrados</td></tr>';
        }
        
        // Información de Cliente
        if (empresa.tipo === 'cliente' || empresa.tipo === 'ambos') {
            document.getElementById('cliente-credito-total').textContent = this.formatCurrency(empresa.creditoVenta);
            
            let totalVendido = 0;
            let totalCobrar = 0;
            const obrasClienteTbody = document.getElementById('obras-cliente-tbody');
            obrasClienteTbody.innerHTML = '';
            
            if (empresa.obrasCliente && empresa.obrasCliente.length > 0) {
                empresa.obrasCliente.forEach(obra => {
                    totalVendido += obra.montoVendido;
                    totalCobrar += obra.montoCobrar;
                    
                    const row = document.createElement('tr');
                    const estadoBadge = obra.estado === 'Activa' ? 
                        '<span class="type-badge badge-cliente">Activa</span>' : 
                        '<span class="type-badge badge-proveedor">Finalizada</span>';
                    
                    row.innerHTML = `
                        <td><strong>${obra.nombre}</strong></td>
                        <td style="text-align: center;">${obra.cantidadOC}</td>
                        <td class="amount-positive">${this.formatCurrency(obra.montoVendido)}</td>
                        <td class="amount-negative">${this.formatCurrency(obra.montoCobrar)}</td>
                        <td>${estadoBadge}</td>
                    `;
                    obrasClienteTbody.appendChild(row);
                });
                
                // Agregar fila de totales
                const totalRow = document.createElement('tr');
                totalRow.style.fontWeight = 'bold';
                totalRow.style.backgroundColor = '#f8f9fa';
                totalRow.innerHTML = `
                    <td>TOTALES</td>
                    <td style="text-align: center;">${empresa.obrasCliente.length}</td>
                    <td class="amount-positive">${this.formatCurrency(totalVendido)}</td>
                    <td class="amount-negative">${this.formatCurrency(totalCobrar)}</td>
                    <td></td>
                `;
                obrasClienteTbody.appendChild(totalRow);
            }
            
            document.getElementById('cliente-credito-usado').textContent = this.formatCurrency(totalCobrar);
            document.getElementById('cliente-credito-disponible').textContent = this.formatCurrency(empresa.creditoVenta - totalCobrar);
            document.getElementById('cliente-porcentaje').textContent = Math.round((totalCobrar / empresa.creditoVenta) * 100) + '%';
        }
        
        // Información de Proveedor
        if (empresa.tipo === 'proveedor' || empresa.tipo === 'ambos') {
            document.getElementById('proveedor-credito-total').textContent = this.formatCurrency(empresa.creditoCompra);
            
            let totalFacturado = 0;
            let totalPagar = 0;
            const obrasProveedorTbody = document.getElementById('obras-proveedor-tbody');
            obrasProveedorTbody.innerHTML = '';
            
            if (empresa.obrasProveedor && empresa.obrasProveedor.length > 0) {
                empresa.obrasProveedor.forEach(obra => {
                    totalFacturado += obra.montoFacturado;
                    totalPagar += obra.montoPagar;
                    
                    const row = document.createElement('tr');
                    const estadoBadge = obra.estado === 'En Ejecución' ? 
                        '<span class="type-badge badge-cliente">En Ejecución</span>' : 
                        '<span class="type-badge badge-proveedor">Finalizada</span>';
                    
                    row.innerHTML = `
                        <td>
                            <strong>${obra.nombre}</strong><br>
                            <small style="color: #666;">${obra.cliente}</small>
                        </td>
                        <td style="text-align: center;">${obra.cantidadOC}</td>
                        <td class="amount-positive">${this.formatCurrency(obra.montoFacturado)}</td>
                        <td class="amount-negative">${this.formatCurrency(obra.montoPagar)}</td>
                        <td>${estadoBadge}</td>
                    `;
                    obrasProveedorTbody.appendChild(row);
                });
                
                // Agregar fila de totales
                const totalRow = document.createElement('tr');
                totalRow.style.fontWeight = 'bold';
                totalRow.style.backgroundColor = '#f8f9fa';
                totalRow.innerHTML = `
                    <td>TOTALES</td>
                    <td style="text-align: center;">${empresa.obrasProveedor.length}</td>
                    <td class="amount-positive">${this.formatCurrency(totalFacturado)}</td>
                    <td class="amount-negative">${this.formatCurrency(totalPagar)}</td>
                    <td></td>
                `;
                obrasProveedorTbody.appendChild(totalRow);
            }
            
            document.getElementById('proveedor-credito-usado').textContent = this.formatCurrency(totalPagar);
            document.getElementById('proveedor-credito-disponible').textContent = this.formatCurrency(empresa.creditoCompra - totalPagar);
            document.getElementById('proveedor-porcentaje').textContent = Math.round((totalPagar / empresa.creditoCompra) * 100) + '%';
        }
        
        // Mostrar modal
        document.getElementById('viewEmpresaModal').style.display = 'block';
    },

    closeViewEmpresaModal() {
        document.getElementById('viewEmpresaModal').style.display = 'none';
    },

    editEmpresa(rut) {
        const empresa = this.empresasData.find(e => e.rut === rut);
        if (!empresa) return;

        document.getElementById('modal-action').textContent = 'Editar';
        document.getElementById('empresaModal').style.display = 'block';
        
        // Cargar datos en el formulario
        this.loadEmpresaData(empresa);
        this.currentEditingRut = rut;
    },

    editFromView() {
        const rut = document.querySelector('#view-rut strong').textContent;
        this.closeViewEmpresaModal();
        this.editEmpresa(rut);
    },

    // Toggle campos de facturación
    toggleFacturacion() {
        const sameAddress = document.getElementById('same-address').checked;
        const factFields = document.getElementById('facturacion-fields');
        factFields.style.display = sameAddress ? 'none' : 'block';
    },

    // Toggle campos de cliente/proveedor
    toggleCliente() {
        const esCliente = document.getElementById('es-cliente').checked;
        document.getElementById('cliente-fields').style.display = esCliente ? 'block' : 'none';
    },

    toggleProveedor() {
        const esProveedor = document.getElementById('es-proveedor').checked;
        document.getElementById('proveedor-fields').style.display = esProveedor ? 'block' : 'none';
    },

    // Gestión de contactos
    addContact() {
        const nombre = document.getElementById('contact-nombre').value;
        const cargo = document.getElementById('contact-cargo').value;
        const celular = document.getElementById('contact-celular').value;
        const tipo = document.getElementById('contact-tipo').value;
        const email = document.getElementById('contact-email').value;

        if (!nombre || !cargo || !celular || !email) {
            alert('Por favor complete todos los campos del contacto');
            return;
        }

        const tbody = document.querySelector('#contacts-table tbody');
        
        // Si es el primer contacto, eliminar el mensaje de "no hay contactos"
        if (tbody.querySelector('td[colspan="6"]')) {
            tbody.innerHTML = '';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${nombre}</td>
            <td>${cargo}</td>
            <td>${celular}</td>
            <td><span class="type-badge badge-${tipo === 'comercial' ? 'cliente' : 'proveedor'}">${tipo === 'comercial' ? 'Comercial' : 'Técnico'}</span></td>
            <td>${email}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="ClienteProveedor.editContact(this)">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="ClienteProveedor.deleteContact(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);

        // Limpiar formulario
        document.getElementById('contact-nombre').value = '';
        document.getElementById('contact-cargo').value = '';
        document.getElementById('contact-celular').value = '';
        document.getElementById('contact-tipo').value = 'comercial';
        document.getElementById('contact-email').value = '';
    },

    editContact(btn) {
        const row = btn.closest('tr');
        const cells = row.cells;
        
        document.getElementById('contact-nombre').value = cells[0].textContent;
        document.getElementById('contact-cargo').value = cells[1].textContent;
        document.getElementById('contact-celular').value = cells[2].textContent;
        document.getElementById('contact-tipo').value = cells[3].textContent.toLowerCase() === 'comercial' ? 'comercial' : 'tecnico';
        document.getElementById('contact-email').value = cells[4].textContent;
        
        this.deleteContact(btn);
    },

    deleteContact(btn) {
        if (confirm('¿Está seguro de eliminar este contacto?')) {
            const row = btn.closest('tr');
            row.remove();
            
            // Si no quedan contactos, mostrar mensaje
            const tbody = document.querySelector('#contacts-table tbody');
            if (tbody.children.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #666;">No hay contactos agregados</td></tr>';
            }
        }
    },

    // Cambio de tabs
    switchTab(tabName) {
        // Ocultar todos los tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Mostrar tab seleccionado
        document.getElementById(tabName).classList.add('active');
        event.target.classList.add('active');
    },

    // Guardar empresa
    saveEmpresa() {
        const rut = document.getElementById('empresa-rut').value;
        const razon = document.getElementById('empresa-razon').value;
        const giro = document.getElementById('empresa-giro').value;

        if (!rut || !razon || !giro) {
            alert('Por favor complete los campos obligatorios');
            return;
        }

        // Determinar tipo
        const esCliente = document.getElementById('es-cliente').checked;
        const esProveedor = document.getElementById('es-proveedor').checked;
        let tipo = '';
        if (esCliente && esProveedor) {
            tipo = 'ambos';
        } else if (esCliente) {
            tipo = 'cliente';
        } else if (esProveedor) {
            tipo = 'proveedor';
        } else {
            alert('Por favor seleccione si es Cliente y/o Proveedor');
            return;
        }

        const empresaData = {
            rut: rut,
            razonSocial: razon,
            giroComercial: giro,
            tipo: tipo,
            creditoVenta: esCliente ? this.parseCurrency(document.getElementById('credito-venta').value) : 0,
            creditoCompra: esProveedor ? this.parseCurrency(document.getElementById('credito-compra').value) : 0,
            direccionPrincipal: `${document.getElementById('dir-calle').value} ${document.getElementById('dir-numero').value}, ${document.getElementById('dir-comuna').selectedOptions[0]?.text || ''}, ${document.getElementById('dir-region').selectedOptions[0]?.text || ''}`,
            direccionFacturacion: document.getElementById('same-address').checked ? 
                `${document.getElementById('dir-calle').value} ${document.getElementById('dir-numero').value}, ${document.getElementById('dir-comuna').selectedOptions[0]?.text || ''}, ${document.getElementById('dir-region').selectedOptions[0]?.text || ''}` :
                document.getElementById('fact-direccion').value,
            emailFacturacion: document.getElementById('fact-email').value || 'No especificado'
        };

        if (this.currentEditingRut) {
            // Editar empresa existente
            const index = this.empresasData.findIndex(e => e.rut === this.currentEditingRut);
            if (index !== -1) {
                this.empresasData[index] = {...this.empresasData[index], ...empresaData};
            }
            alert('Empresa actualizada exitosamente');
        } else {
            // Nueva empresa
            this.empresasData.push(empresaData);
            alert('Empresa creada exitosamente');
        }

        this.closeEmpresaModal();
        this.loadEmpresas();
    },

    // Limpiar formulario
    clearEmpresaForm() {
        document.getElementById('empresa-rut').value = '';
        document.getElementById('empresa-razon').value = '';
        document.getElementById('empresa-giro').value = '';
        document.getElementById('dir-calle').value = '';
        document.getElementById('dir-numero').value = '';
        document.getElementById('dir-region').value = '';
        document.getElementById('dir-comuna').value = '';
        document.getElementById('same-address').checked = false;
        document.getElementById('fact-rut').value = '';
        document.getElementById('fact-razon').value = '';
        document.getElementById('fact-direccion').value = '';
        document.getElementById('fact-email').value = '';
        document.getElementById('es-cliente').checked = false;
        document.getElementById('es-proveedor').checked = false;
        document.getElementById('credito-venta').value = '';
        document.getElementById('credito-compra').value = '';
        this.toggleFacturacion();
        this.toggleCliente();
        this.toggleProveedor();
        
        // Limpiar tabla de contactos
        document.querySelector('#contacts-table tbody').innerHTML = '<tr><td colspan="6" style="text-align: center; color: #666;">No hay contactos agregados</td></tr>';
    },

    // Cargar datos de empresa
    loadEmpresaData(empresa) {
        document.getElementById('empresa-rut').value = empresa.rut;
        document.getElementById('empresa-razon').value = empresa.razonSocial;
        document.getElementById('empresa-giro').value = empresa.giroComercial;
        
        // Parsear dirección principal (ejemplo simplificado)
        const direccionParts = empresa.direccionPrincipal.split(', ');
        if (direccionParts.length >= 3) {
            const calleNumero = direccionParts[0].split(' ');
            document.getElementById('dir-numero').value = calleNumero.pop() || '';
            document.getElementById('dir-calle').value = calleNumero.join(' ') || '';
        }
        
        document.getElementById('fact-email').value = empresa.emailFacturacion;
        
        // Tipo de empresa
        if (empresa.tipo === 'cliente' || empresa.tipo === 'ambos') {
            document.getElementById('es-cliente').checked = true;
            this.toggleCliente();
            document.getElementById('credito-venta').value = this.formatCurrency(empresa.creditoVenta);
        }
        
        if (empresa.tipo === 'proveedor' || empresa.tipo === 'ambos') {
            document.getElementById('es-proveedor').checked = true;
            this.toggleProveedor();
            document.getElementById('credito-compra').value = this.formatCurrency(empresa.creditoCompra);
        }
        
        // Cargar contactos si existen
        if (empresa.contactos && empresa.contactos.length > 0) {
            const tbody = document.querySelector('#contacts-table tbody');
            tbody.innerHTML = '';
            
            empresa.contactos.forEach(contacto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${contacto.nombre}</td>
                    <td>${contacto.cargo}</td>
                    <td>${contacto.celular}</td>
                    <td><span class="type-badge badge-${contacto.tipo === 'comercial' ? 'cliente' : 'proveedor'}">${contacto.tipo === 'comercial' ? 'Comercial' : 'Técnico'}</span></td>
                    <td>${contacto.email}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="ClienteProveedor.editContact(this)">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="ClienteProveedor.deleteContact(this)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    },

    printEmpresa() {
        window.print();
    },

    // Utilidades
    formatCurrency(value, short = false) {
        if (short && value >= 1000000) {
            return '$' + (value / 1000000).toFixed(0) + 'M';
        }
        return '$' + value.toLocaleString('es-CL');
    },

    parseCurrency(value) {
        return parseInt(value.replace(/[^\d]/g, '') || '0');
    },

    // Event Listeners
    attachEventListeners() {
        // Cerrar modales al hacer clic fuera
        window.onclick = (event) => {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        };

        // Formatear RUT automáticamente
        const rutInput = document.getElementById('empresa-rut');
        if (rutInput) {
            rutInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^\dkK]/g, '');
                if (value.length > 1) {
                    let rut = value.slice(0, -1);
                    let dv = value.slice(-1);
                    rut = rut.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                    e.target.value = rut + '-' + dv;
                }
            });
        }

        // Formatear montos de crédito
        const creditoVenta = document.getElementById('credito-venta');
        const creditoCompra = document.getElementById('credito-compra');
        
        if (creditoVenta) {
            creditoVenta.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^\d]/g, '');
                if (value) {
                    value = parseInt(value).toLocaleString('es-CL');
                    e.target.value = '$' + value;
                }
            });
        }
        
        if (creditoCompra) {
            creditoCompra.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^\d]/g, '');
                if (value) {
                    value = parseInt(value).toLocaleString('es-CL');
                    e.target.value = '$' + value;
                }
            });
        }
    }
};