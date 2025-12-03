/**
 * ssl-listado-obras-scripts.js
 * JavaScript específico para la gestión de Obras y Proyectos
 */

// Namespace para evitar conflictos
const ObrasManager = {
    // Datos de ejemplo
    obrasData: [
        {
            id: 'OBRA-2025-001',
            nombre: 'EDIFICIO PACIFIC BLUE',
            cliente: 'CONSTRUCTORA ALMAGRO S.A.',
            rutCliente: '76.123.456-7',
            fechaInicio: '15/01/2025',
            direccion: 'Av. Las Condes 1234, Las Condes',
            cantidadOC: 12,
            montoVendido: 187500000,
            porPagar: 52500000,
            estado: 'activa',
            contactoPrincipal: {
                nombre: 'Ing. Roberto Méndez',
                celular: '+56 9 8765 4321',
                email: 'rmendez@almagro.cl'
            },
            facturacion: {
                rut: '76.123.456-7',
                razonSocial: 'CONSTRUCTORA ALMAGRO S.A.',
                email: 'facturacion@almagro.cl',
                direccion: 'Av. Las Condes 1234, Las Condes, Región Metropolitana'
            },
            resumenEconomico: {
                montoTotalVendido: 187500000,
                profitTotal: 28125000,
                montoPagado: 135000000,
                porCobrar: 52500000,
                totalOCCliente: 12,
                totalOCProveedor: 45
            },
            ordenesCompra: [
                {
                    oc: 'OC-CLI-2025-847',
                    solped: 'SOLPED-2025-0847',
                    fecha: '22/05/2025',
                    montoVendido: 28500000,
                    profit: 4275000,
                    pagado: 28500000,
                    profitPagado: 4275000,
                    ocProveedor: 5,
                    entregadas: '5/5',
                    estado: 'Pagada'
                },
                {
                    oc: 'OC-CLI-2025-852',
                    solped: 'SOLPED-2025-0852',
                    fecha: '25/05/2025',
                    montoVendido: 18750000,
                    profit: 2812500,
                    pagado: 15000000,
                    profitPagado: 2250000,
                    ocProveedor: 3,
                    entregadas: '3/3',
                    estado: 'Parcial'
                },
                {
                    oc: 'OC-CLI-2025-867',
                    solped: 'SOLPED-2025-0867, 0868',
                    fecha: '28/05/2025',
                    montoVendido: 45000000,
                    profit: 6750000,
                    pagado: 0,
                    profitPagado: 0,
                    ocProveedor: 8,
                    entregadas: '6/8',
                    estado: 'En Proceso'
                },
                {
                    oc: 'OC-CLI-2025-893',
                    solped: 'SOLPED-2025-0893',
                    fecha: '03/06/2025',
                    montoVendido: 12450000,
                    profit: 1867500,
                    pagado: 0,
                    profitPagado: 0,
                    ocProveedor: 2,
                    entregadas: '0/2',
                    estado: 'Pendiente'
                }
            ],
            contactos: [
                {
                    nombre: 'Ing. Roberto Méndez',
                    cargo: 'Jefe de Obra',
                    celular: '+56 9 8765 4321',
                    tipo: 'tecnico',
                    email: 'rmendez@almagro.cl'
                },
                {
                    nombre: 'María González',
                    cargo: 'Coordinadora Comercial',
                    celular: '+56 9 7654 3210',
                    tipo: 'comercial',
                    email: 'mgonzalez@almagro.cl'
                },
                {
                    nombre: 'Carlos Fuentes',
                    cargo: 'Supervisor de Seguridad',
                    celular: '+56 9 6543 2109',
                    tipo: 'tecnico',
                    email: 'cfuentes@almagro.cl'
                }
            ]
        },
        {
            id: 'OBRA-2025-002',
            nombre: 'CONDOMINIO VISTA MAR',
            cliente: 'INMOBILIARIA INGEVEC',
            rutCliente: '76.456.789-0',
            fechaInicio: '02/02/2025',
            direccion: 'Av. del Mar 567, Viña del Mar',
            cantidadOC: 8,
            montoVendido: 124450000,
            porPagar: 32000000,
            estado: 'activa'
        },
        {
            id: 'OBRA-2025-003',
            nombre: 'EDIFICIO CENTRAL PARK',
            cliente: 'CONSTRUCTORA MOLLER Y PÉREZ-COTAPOS',
            rutCliente: '76.789.012-3',
            fechaInicio: '10/11/2024',
            direccion: 'Av. Providencia 890, Providencia',
            cantidadOC: 15,
            montoVendido: 258000000,
            porPagar: 0,
            estado: 'finalizada'
        },
        {
            id: 'OBRA-2025-004',
            nombre: 'PARQUE INDUSTRIAL NORTE',
            cliente: 'DESARROLLOS INDUSTRIALES S.A.',
            rutCliente: '76.890.123-4',
            fechaInicio: '20/03/2025',
            direccion: 'Ruta 5 Norte Km 25, Quilicura',
            cantidadOC: 5,
            montoVendido: 94200000,
            porPagar: 28500000,
            estado: 'activa'
        },
        {
            id: 'OBRA-2025-005',
            nombre: 'TORRE ALMAGRO',
            cliente: 'CONSTRUCTORA ALMAGRO S.A.',
            rutCliente: '76.123.456-7',
            fechaInicio: '05/09/2024',
            direccion: 'Av. Apoquindo 3456, Las Condes',
            cantidadOC: 22,
            montoVendido: 458000000,
            porPagar: 15000000,
            estado: 'suspendida'
        }
    ],

    currentEditingId: null,

    // Inicialización
    init() {
        this.loadObras();
        this.attachEventListeners();
        this.initDateInput();
    },

    // Cargar obras en la tabla
    loadObras() {
        const tbody = document.getElementById('obras-tbody');
        tbody.innerHTML = '';

        this.obrasData.forEach(obra => {
            const row = document.createElement('tr');
            row.onclick = () => this.viewObra(obra.id);
            
            const statusBadge = this.getStatusBadge(obra.estado);
            
            row.innerHTML = `
                <td><strong>${obra.nombre}</strong></td>
                <td>${obra.cliente}</td>
                <td>${obra.fechaInicio}</td>
                <td>${obra.direccion}</td>
                <td style="text-align: center;">${obra.cantidadOC}</td>
                <td class="amount-positive">${this.formatCurrency(obra.montoVendido)}</td>
                <td class="amount-negative">${this.formatCurrency(obra.porPagar)}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-info btn-sm" onclick="event.stopPropagation(); ObrasManager.viewObra('${obra.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning btn-sm" onclick="event.stopPropagation(); ObrasManager.editObra('${obra.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${obra.estado === 'finalizada' ? 
                            `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); ObrasManager.printObra('${obra.id}')">
                                <i class="fas fa-print"></i>
                            </button>` : ''}
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        this.updateCounts(this.obrasData.length, this.obrasData.length);
    },

    // Obtener badge de estado
    getStatusBadge(estado) {
        const badges = {
            'activa': '<span class="status-badge status-activa">Activa</span>',
            'finalizada': '<span class="status-badge status-finalizada">Finalizada</span>',
            'suspendida': '<span class="status-badge status-suspendida">Suspendida</span>',
            'cancelada': '<span class="status-badge status-cancelada">Cancelada</span>'
        };
        return badges[estado] || '<span class="status-badge">Sin Estado</span>';
    },

    // Funciones de filtro
    searchObras() {
        const cliente = document.getElementById('filter-cliente').value;
        const nombre = document.getElementById('filter-nombre').value.toLowerCase();
        const mes = document.getElementById('filter-mes').value;
        const ano = document.getElementById('filter-ano').value;
        const estado = document.getElementById('filter-estado').value;

        const filteredData = this.obrasData.filter(obra => {
            const fechaParts = obra.fechaInicio.split('/');
            const obraMes = fechaParts[1];
            const obraAno = fechaParts[2];

            return (!cliente || obra.rutCliente === cliente) &&
                   (!nombre || obra.nombre.toLowerCase().includes(nombre)) &&
                   (!mes || obraMes === mes.padStart(2, '0')) &&
                   (!ano || obraAno === ano) &&
                   (!estado || obra.estado === estado);
        });

        this.renderFilteredObras(filteredData);
    },

    renderFilteredObras(data) {
        const tbody = document.getElementById('obras-tbody');
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: #666;">No se encontraron resultados</td></tr>';
            this.updateCounts(0, this.obrasData.length);
            return;
        }

        data.forEach(obra => {
            const row = document.createElement('tr');
            row.onclick = () => this.viewObra(obra.id);
            
            const statusBadge = this.getStatusBadge(obra.estado);
            
            row.innerHTML = `
                <td><strong>${obra.nombre}</strong></td>
                <td>${obra.cliente}</td>
                <td>${obra.fechaInicio}</td>
                <td>${obra.direccion}</td>
                <td style="text-align: center;">${obra.cantidadOC}</td>
                <td class="amount-positive">${this.formatCurrency(obra.montoVendido)}</td>
                <td class="amount-negative">${this.formatCurrency(obra.porPagar)}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-info btn-sm" onclick="event.stopPropagation(); ObrasManager.viewObra('${obra.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning btn-sm" onclick="event.stopPropagation(); ObrasManager.editObra('${obra.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${obra.estado === 'finalizada' ? 
                            `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); ObrasManager.printObra('${obra.id}')">
                                <i class="fas fa-print"></i>
                            </button>` : ''}
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        this.updateCounts(data.length, this.obrasData.length);
    },

    updateCounts(showing, total) {
        document.getElementById('showing-count').textContent = showing;
        document.getElementById('total-count').textContent = total;
    },

    clearFilters() {
        document.getElementById('filter-cliente').value = '';
        document.getElementById('filter-nombre').value = '';
        document.getElementById('filter-mes').value = '';
        document.getElementById('filter-ano').value = '2025';
        document.getElementById('filter-estado').value = '';
        this.loadObras();
    },

    // Funciones de modal
    openNewObraModal() {
        document.getElementById('modal-action').textContent = 'Nueva';
        document.getElementById('obraModal').style.display = 'block';
        this.clearObraForm();
        this.currentEditingId = null;
    },

    closeObraModal() {
        document.getElementById('obraModal').style.display = 'none';
        this.currentEditingId = null;
    },

    viewObra(obraId) {
        const obra = this.obrasData.find(o => o.id === obraId);
        if (!obra) return;

        // Actualizar título del modal
        document.querySelector('#view-modal-title span').textContent = obra.nombre;
        
        // Información general
        document.getElementById('view-cliente').textContent = obra.cliente;
        document.getElementById('view-rut-cliente').textContent = obra.rutCliente;
        document.getElementById('view-fecha-inicio').textContent = obra.fechaInicio;
        document.getElementById('view-estado').innerHTML = this.getStatusBadge(obra.estado);
        
        // Dirección de la obra
        document.getElementById('view-direccion-obra').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${obra.direccion}`;
        
        // Contacto principal
        if (obra.contactoPrincipal) {
            document.getElementById('view-contacto-nombre').textContent = obra.contactoPrincipal.nombre;
            document.getElementById('view-contacto-celular').textContent = obra.contactoPrincipal.celular;
            document.getElementById('view-contacto-email').textContent = obra.contactoPrincipal.email;
        } else {
            document.getElementById('view-contacto-nombre').textContent = 'No especificado';
            document.getElementById('view-contacto-celular').textContent = 'No especificado';
            document.getElementById('view-contacto-email').textContent = 'No especificado';
        }
        
        // Datos de facturación
        if (obra.facturacion) {
            document.getElementById('view-fact-rut').textContent = obra.facturacion.rut;
            document.getElementById('view-fact-razon').textContent = obra.facturacion.razonSocial;
            document.getElementById('view-fact-email').textContent = obra.facturacion.email;
            document.getElementById('view-fact-direccion').innerHTML = `<i class="fas fa-building"></i> ${obra.facturacion.direccion}`;
        }
        
        // Resumen económico
        if (obra.resumenEconomico) {
            document.getElementById('summary-total-vendido').textContent = this.formatCurrency(obra.resumenEconomico.montoTotalVendido);
            document.getElementById('summary-profit').textContent = this.formatCurrency(obra.resumenEconomico.profitTotal);
            document.getElementById('summary-pagado').textContent = this.formatCurrency(obra.resumenEconomico.montoPagado);
            document.getElementById('summary-por-cobrar').textContent = this.formatCurrency(obra.resumenEconomico.porCobrar);
            document.getElementById('summary-oc-cliente').textContent = obra.resumenEconomico.totalOCCliente;
            document.getElementById('summary-oc-proveedor').textContent = obra.resumenEconomico.totalOCProveedor;
        }
        
        // Órdenes de compra
        const ocTbody = document.getElementById('oc-tbody');
        const ocTfoot = document.getElementById('oc-tfoot');
        ocTbody.innerHTML = '';
        ocTfoot.innerHTML = '';
        
        if (obra.ordenesCompra && obra.ordenesCompra.length > 0) {
            let totalVendido = 0;
            let totalProfit = 0;
            let totalPagado = 0;
            let totalProfitPagado = 0;
            let totalOCProv = 0;
            
            obra.ordenesCompra.forEach(oc => {
                totalVendido += oc.montoVendido;
                totalProfit += oc.profit;
                totalPagado += oc.pagado;
                totalProfitPagado += oc.profitPagado;
                totalOCProv += oc.ocProveedor;
                
                const row = document.createElement('tr');
                const estadoBadge = this.getOCStatusBadge(oc.estado);
                
                row.innerHTML = `
                    <td><strong>${oc.oc}</strong></td>
                    <td>${oc.solped}</td>
                    <td>${oc.fecha}</td>
                    <td class="amount-positive">${this.formatCurrency(oc.montoVendido)}</td>
                    <td class="amount-warning">${this.formatCurrency(oc.profit)}</td>
                    <td class="amount-positive">${this.formatCurrency(oc.pagado)}</td>
                    <td class="amount-warning">${this.formatCurrency(oc.profitPagado)}</td>
                    <td style="text-align: center;">${oc.ocProveedor}</td>
                    <td style="text-align: center;">${oc.entregadas}</td>
                    <td>${estadoBadge}</td>
                `;
                ocTbody.appendChild(row);
            });
            
            // Fila de totales
            ocTfoot.innerHTML = `
                <tr style="font-weight: bold; background-color: #f8f9fa;">
                    <td colspan="3">TOTALES</td>
                    <td class="amount-positive">${this.formatCurrency(totalVendido)}</td>
                    <td class="amount-warning">${this.formatCurrency(totalProfit)}</td>
                    <td class="amount-positive">${this.formatCurrency(totalPagado)}</td>
                    <td class="amount-warning">${this.formatCurrency(totalProfitPagado)}</td>
                    <td style="text-align: center;">${totalOCProv}</td>
                    <td style="text-align: center;">-</td>
                    <td></td>
                </tr>
            `;
        } else {
            ocTbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: #666;">No hay órdenes de compra registradas</td></tr>';
        }
        
        // Contactos
        const contactsTbody = document.getElementById('view-contacts-tbody');
        contactsTbody.innerHTML = '';
        
        if (obra.contactos && obra.contactos.length > 0) {
            obra.contactos.forEach(contacto => {
                const row = document.createElement('tr');
                const tipoBadge = contacto.tipo === 'comercial' ? 
                    '<span class="status-badge status-finalizada">Comercial</span>' : 
                    '<span class="status-badge status-activa">Técnico</span>';
                
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
        
        // Mostrar modal
        document.getElementById('viewObraModal').style.display = 'block';
    },

    getOCStatusBadge(estado) {
        const badges = {
            'Pagada': '<span class="status-badge status-activa">Pagada</span>',
            'Parcial': '<span class="status-badge status-suspendida">Parcial</span>',
            'En Proceso': '<span class="status-badge status-activa">En Proceso</span>',
            'Pendiente': '<span class="status-badge status-activa">Pendiente</span>'
        };
        return badges[estado] || '<span class="status-badge">Sin Estado</span>';
    },

    closeViewObraModal() {
        document.getElementById('viewObraModal').style.display = 'none';
    },

    editObra(obraId) {
        const obra = this.obrasData.find(o => o.id === obraId);
        if (!obra) return;

        document.getElementById('modal-action').textContent = 'Editar';
        document.getElementById('obraModal').style.display = 'block';
        
        // Cargar datos en el formulario
        this.loadObraData(obra);
        this.currentEditingId = obraId;
    },

    editFromView() {
        const obraName = document.querySelector('#view-modal-title span').textContent;
        const obra = this.obrasData.find(o => o.nombre === obraName);
        if (obra) {
            this.closeViewObraModal();
            this.editObra(obra.id);
        }
    },

    // Toggle campos de facturación
    toggleFacturacion() {
        const sameAsClient = document.getElementById('same-as-client').checked;
        const factFields = document.getElementById('facturacion-fields');
        
        if (sameAsClient) {
            factFields.style.display = 'none';
            // Cargar datos del cliente seleccionado
            const clienteSelect = document.getElementById('obra-cliente');
            if (clienteSelect.value) {
                const rut = clienteSelect.value;
                const razonSocial = clienteSelect.options[clienteSelect.selectedIndex].text.split(' - ')[1];
                document.getElementById('fact-rut').value = rut;
                document.getElementById('fact-razon').value = razonSocial;
            }
        } else {
            factFields.style.display = 'block';
        }
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
            <td><span class="status-badge status-${tipo === 'comercial' ? 'finalizada' : 'activa'}">${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</span></td>
            <td>${email}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="ObrasManager.editContact(this)">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="ObrasManager.deleteContact(this)">
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
        // Extraer tipo del badge
        const tipoBadge = cells[3].querySelector('.status-badge').textContent.toLowerCase();
        document.getElementById('contact-tipo').value = tipoBadge === 'comercial' ? 'comercial' : 'tecnico';
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

    // Guardar obra
    saveObra() {
        const cliente = document.getElementById('obra-cliente').value;
        const nombre = document.getElementById('obra-nombre').value;
        const fechaInicio = document.getElementById('obra-fecha-inicio').value;

        if (!cliente || !nombre || !fechaInicio) {
            alert('Por favor complete los campos obligatorios');
            return;
        }

        // Formatear fecha
        const fecha = new Date(fechaInicio);
        const fechaFormateada = fecha.toLocaleDateString('es-CL', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });

        const direccion = `${document.getElementById('obra-direccion').value}, ${document.getElementById('obra-comuna').selectedOptions[0]?.text || ''}, ${document.getElementById('obra-region').selectedOptions[0]?.text || ''}`;

        const obraData = {
            nombre: nombre,
            cliente: document.getElementById('obra-cliente').selectedOptions[0].text.split(' - ')[1],
            rutCliente: cliente,
            fechaInicio: fechaFormateada,
            direccion: direccion,
            cantidadOC: 0,
            montoVendido: 0,
            porPagar: 0,
            estado: 'activa'
        };

        if (this.currentEditingId) {
            // Editar obra existente
            const index = this.obrasData.findIndex(o => o.id === this.currentEditingId);
            if (index !== -1) {
                this.obrasData[index] = {...this.obrasData[index], ...obraData};
            }
            alert('Obra actualizada exitosamente');
        } else {
            // Nueva obra
            obraData.id = 'OBRA-' + new Date().getFullYear() + '-' + (this.obrasData.length + 1).toString().padStart(3, '0');
            this.obrasData.push(obraData);
            alert('Obra creada exitosamente');
        }

        this.closeObraModal();
        this.loadObras();
    },

    // Limpiar formulario
    clearObraForm() {
        document.getElementById('obra-cliente').value = '';
        document.getElementById('obra-nombre').value = '';
        document.getElementById('obra-fecha-inicio').value = '';
        document.getElementById('obra-direccion').value = '';
        document.getElementById('obra-comuna').value = '';
        document.getElementById('obra-region').value = '';
        document.getElementById('contacto-nombre').value = '';
        document.getElementById('contacto-celular').value = '';
        document.getElementById('contacto-email').value = '';
        document.getElementById('same-as-client').checked = false;
        document.getElementById('fact-rut').value = '';
        document.getElementById('fact-razon').value = '';
        document.getElementById('fact-email').value = '';
        document.getElementById('fact-direccion').value = '';
        this.toggleFacturacion();
        
        // Limpiar tabla de contactos
        document.querySelector('#contacts-table tbody').innerHTML = '<tr><td colspan="6" style="text-align: center; color: #666;">No hay contactos agregados</td></tr>';
    },

    // Cargar datos de obra
    loadObraData(obra) {
        document.getElementById('obra-cliente').value = obra.rutCliente;
        document.getElementById('obra-nombre').value = obra.nombre;
        
        // Convertir fecha al formato requerido por input date
        const fechaParts = obra.fechaInicio.split('/');
        const fechaISO = `${fechaParts[2]}-${fechaParts[1]}-${fechaParts[0]}`;
        document.getElementById('obra-fecha-inicio').value = fechaISO;
        
        // Parsear dirección (simplificado)
        const direccionParts = obra.direccion.split(', ');
        if (direccionParts.length > 0) {
            document.getElementById('obra-direccion').value = direccionParts[0];
        }
        
        // Contacto principal
        if (obra.contactoPrincipal) {
            document.getElementById('contacto-nombre').value = obra.contactoPrincipal.nombre;
            document.getElementById('contacto-celular').value = obra.contactoPrincipal.celular;
            document.getElementById('contacto-email').value = obra.contactoPrincipal.email;
        }
        
        // Facturación
        if (obra.facturacion) {
            document.getElementById('fact-rut').value = obra.facturacion.rut;
            document.getElementById('fact-razon').value = obra.facturacion.razonSocial;
            document.getElementById('fact-email').value = obra.facturacion.email;
            document.getElementById('fact-direccion').value = obra.facturacion.direccion;
        }
        
        // Contactos
        if (obra.contactos && obra.contactos.length > 0) {
            const tbody = document.querySelector('#contacts-table tbody');
            tbody.innerHTML = '';
            
            obra.contactos.forEach(contacto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${contacto.nombre}</td>
                    <td>${contacto.cargo}</td>
                    <td>${contacto.celular}</td>
                    <td><span class="status-badge status-${contacto.tipo === 'comercial' ? 'finalizada' : 'activa'}">${contacto.tipo.charAt(0).toUpperCase() + contacto.tipo.slice(1)}</span></td>
                    <td>${contacto.email}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="ObrasManager.editContact(this)">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="ObrasManager.deleteContact(this)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    },

    printObra(obraId) {
        window.print();
    },

    exportObra() {
        alert('Exportando datos de la obra a Excel...');
    },

    // Utilidades
    formatCurrency(value) {
        return '$' + value.toLocaleString('es-CL');
    },

    // Event Listeners
    attachEventListeners() {
        // Cerrar modales al hacer clic fuera
        window.onclick = (event) => {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        };

        // Actualizar cliente al seleccionar
        const obraCliente = document.getElementById('obra-cliente');
        if (obraCliente) {
            obraCliente.addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                if (this.value && document.getElementById('same-as-client').checked) {
                    // Cargar datos del cliente en facturación
                    const rut = this.value;
                    const razonSocial = selectedOption.text.split(' - ')[1];
                    document.getElementById('fact-rut').value = rut;
                    document.getElementById('fact-razon').value = razonSocial;
                }
            });
        }

        // Formatear RUT automáticamente
        const factRut = document.getElementById('fact-rut');
        if (factRut) {
            factRut.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^\dkK]/g, '');
                if (value.length > 1) {
                    let rut = value.slice(0, -1);
                    let dv = value.slice(-1);
                    rut = rut.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                    e.target.value = rut + '-' + dv;
                }
            });
        }
    },

    // Inicializar fecha actual
    initDateInput() {
        const today = new Date().toISOString().split('T')[0];
        const fechaInicio = document.getElementById('obra-fecha-inicio');
        if (fechaInicio) {
            fechaInicio.value = today;
        }
    }
};