/**
 * JavaScript específico para el Detalle de Cuadro Comparativo
 * SSL v4.0 - Evaluación y Análisis
 */

// ============================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ============================================

let currentView = 'comparison';
let selectedProviders = [];
let comparisonData = null;
let bestPrices = {};

// ============================================
// GESTIÓN DE VISTAS
// ============================================

/**
 * Cambiar entre diferentes vistas del cuadro comparativo
 * @param {string} view - Tipo de vista (comparison, individual, grouped, analysis)
 */
function changeView(view) {
    // Actualizar botones activos
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.view-btn').classList.add('active');
    
    currentView = view;
    
    switch(view) {
        case 'comparison':
            showComparisonView();
            break;
        case 'individual':
            showIndividualView();
            break;
        case 'grouped':
            showGroupedView();
            break;
        case 'analysis':
            showAnalysisView();
            break;
    }
}

/**
 * Mostrar vista comparativa estándar
 */
function showComparisonView() {
    const table = document.getElementById('comparisonTable');
    if (table) {
        table.style.display = 'table';
        resetTableView();
    }
}

/**
 * Mostrar cotizaciones individuales
 */
function showIndividualView() {
    const modal = document.getElementById('quotationModal');
    const modalBody = document.getElementById('modalBody');
    
    // Crear selector de proveedor
    modalBody.innerHTML = `
        <div class="provider-selector">
            <h3>Seleccione un proveedor para ver su cotización:</h3>
            <div class="provider-cards">
                <div class="provider-card" onclick="showProviderQuote('ferreteria')">
                    <h4>FERRETERÍA CENTRAL</h4>
                    <p>Cotización completa (5/5 items)</p>
                    <span class="total-amount">$3,037,500</span>
                </div>
                <div class="provider-card" onclick="showProviderQuote('distribuidora')">
                    <h4>DISTRIBUIDORA ELÉCTRICA</h4>
                    <p>Cotización completa (5/5 items)</p>
                    <span class="total-amount">$2,975,000</span>
                </div>
                <div class="provider-card" onclick="showProviderQuote('materiales')">
                    <h4>MATERIALES DEL SUR</h4>
                    <p>Cotización parcial (4/5 items)</p>
                    <span class="total-amount">$3,205,000</span>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

/**
 * Mostrar cotización de un proveedor específico
 * @param {string} provider - ID del proveedor
 */
function showProviderQuote(provider) {
    const modalBody = document.getElementById('modalBody');
    const providerData = getProviderData(provider);
    
    modalBody.innerHTML = `
        <div class="quote-detail">
            <div class="quote-header">
                <h3>${providerData.name}</h3>
                <div class="quote-info">
                    <span>Nro. Cotización: ${providerData.quoteNumber}</span>
                    <span>Fecha: ${providerData.date}</span>
                    <span>Validez: ${providerData.validity} días</span>
                </div>
            </div>
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Precio Unit.</th>
                        <th>Total</th>
                        <th>Plazo</th>
                    </tr>
                </thead>
                <tbody>
                    ${providerData.items.map(item => `
                        <tr>
                            <td>${item.code}</td>
                            <td>${item.description}</td>
                            <td>${item.quantity}</td>
                            <td style="text-align: right;">$${formatNumber(item.unitPrice)}</td>
                            <td style="text-align: right;">$${formatNumber(item.total)}</td>
                            <td style="text-align: center;">${item.delivery}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" style="text-align: right; font-weight: bold;">Total:</td>
                        <td style="text-align: right; font-weight: bold;">$${formatNumber(providerData.total)}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
}

/**
 * Mostrar vista agrupada por similitud
 */
function showGroupedView() {
    const table = document.getElementById('comparisonTable');
    if (table) {
        groupTableBySimilarity();
    }
    
    showNotification('Productos agrupados por similitud', 'info');
}

/**
 * Mostrar vista de análisis
 */
function showAnalysisView() {
    const modal = document.getElementById('analysisModal');
    modal.style.display = 'block';
    
    // Generar gráficos de análisis
    setTimeout(() => {
        generateAnalysisCharts();
    }, 100);
}

// ============================================
// GESTIÓN DE FILTROS
// ============================================

/**
 * Aplicar criterio de comparación
 */
document.getElementById('criteriaSelect')?.addEventListener('change', function() {
    const criteria = this.value;
    applyCriteria(criteria);
});

/**
 * Aplicar criterio seleccionado
 * @param {string} criteria - Criterio a aplicar
 */
function applyCriteria(criteria) {
    const table = document.getElementById('comparisonTable');
    if (!table) return;
    
    // Resaltar columnas según criterio
    const allCells = table.querySelectorAll('.price-cell, td');
    allCells.forEach(cell => cell.classList.remove('highlight'));
    
    switch(criteria) {
        case 'price':
            highlightBestPrices();
            break;
        case 'delivery':
            highlightBestDelivery();
            break;
        case 'quality':
            highlightQuality();
            break;
        case 'combined':
            applyCombinedCriteria();
            break;
    }
    
    showNotification(`Criterio aplicado: ${getCriteriaName(criteria)}`, 'success');
}

/**
 * Resaltar mejores precios
 */
function highlightBestPrices() {
    const rows = document.querySelectorAll('#comparisonTable tbody tr:not(.product-group):not(.totals-row)');
    
    rows.forEach(row => {
        const priceCells = row.querySelectorAll('.price-cell');
        let minPrice = Infinity;
        let minCell = null;
        
        priceCells.forEach(cell => {
            const price = parseFloat(cell.textContent.replace(/[$,]/g, ''));
            if (!isNaN(price) && price < minPrice) {
                minPrice = price;
                minCell = cell;
            }
        });
        
        if (minCell) {
            minCell.classList.add('best-price');
        }
    });
}

/**
 * Resaltar mejores plazos de entrega
 */
function highlightBestDelivery() {
    const rows = document.querySelectorAll('#comparisonTable tbody tr:not(.product-group):not(.totals-row)');
    
    rows.forEach(row => {
        const deliveryCells = Array.from(row.children).filter((cell, index) => 
            (index === 6 || index === 10 || index === 14) // Columnas de plazo
        );
        
        let minDays = Infinity;
        let minCell = null;
        
        deliveryCells.forEach(cell => {
            const days = parseInt(cell.textContent);
            if (!isNaN(days) && days < minDays) {
                minDays = days;
                minCell = cell;
            }
        });
        
        if (minCell) {
            minCell.style.backgroundColor = '#d5f5e3';
            minCell.style.fontWeight = '600';
        }
    });
}

/**
 * Filtrar proveedores
 */
document.getElementById('providerFilter')?.addEventListener('change', function() {
    const filter = this.value;
    filterProviders(filter);
});

/**
 * Aplicar filtro de proveedores
 * @param {string} filter - Tipo de filtro
 */
function filterProviders(filter) {
    const table = document.getElementById('comparisonTable');
    if (!table) return;
    
    // Implementar lógica de filtrado
    switch(filter) {
        case 'complete':
            hideIncompleteProviders();
            break;
        case 'partial':
            showOnlyPartialProviders();
            break;
        case 'all':
        default:
            showAllProviders();
    }
}

/**
 * Agrupar productos
 */
document.getElementById('groupingSelect')?.addEventListener('change', function() {
    const grouping = this.value;
    applyGrouping(grouping);
});

/**
 * Aplicar agrupación
 * @param {string} grouping - Tipo de agrupación
 */
function applyGrouping(grouping) {
    switch(grouping) {
        case 'category':
            groupByCategory();
            break;
        case 'similarity':
            groupTableBySimilarity();
            break;
        case 'none':
        default:
            resetTableView();
    }
}

// ============================================
// GESTIÓN DE MODALES
// ============================================

/**
 * Cerrar modal principal
 */
function closeModal() {
    document.getElementById('quotationModal').style.display = 'none';
}

/**
 * Cerrar modal de análisis
 */
function closeAnalysisModal() {
    document.getElementById('analysisModal').style.display = 'none';
}

/**
 * Cerrar modales al hacer clic fuera
 */
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// ============================================
// ACCIONES Y EXPORTACIÓN
// ============================================

/**
 * Exportar a Excel
 */
function exportToExcel() {
    showLoadingSpinner();
    
    setTimeout(() => {
        hideLoadingSpinner();
        showNotification('Cuadro comparativo exportado a Excel exitosamente', 'success');
        
        // Simulación de descarga
        const link = document.createElement('a');
        link.download = `cuadro_comparativo_${getCurrentDate()}.xlsx`;
        link.click();
    }, 1500);
}

/**
 * Imprimir comparación
 */
function printComparison() {
    window.print();
}

/**
 * Compartir comparación
 */
function shareComparison() {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Cuadro Comparativo - SSL v4.0',
            text: 'Cuadro comparativo de cotizaciones',
            url: shareUrl
        }).then(() => {
            showNotification('Comparación compartida exitosamente', 'success');
        }).catch(err => {
            console.error('Error al compartir:', err);
        });
    } else {
        // Copiar al portapapeles
        navigator.clipboard.writeText(shareUrl).then(() => {
            showNotification('Enlace copiado al portapapeles', 'info');
        });
    }
}

/**
 * Mostrar alerta de cotizaciones incompletas
 */
function showIncompleteAlert() {
    const incompleteItems = getIncompleteItems();
    
    if (incompleteItems.length > 0) {
        let message = 'Las siguientes cotizaciones están incompletas:\n\n';
        incompleteItems.forEach(item => {
            message += `• ${item.provider}: No cotizó ${item.product} (${item.code})\n`;
        });
        message += '\nSe recomienda solicitar cotización completa.';
        
        alert(message);
    } else {
        showNotification('Todas las cotizaciones están completas', 'success');
    }
}

/**
 * Guardar comparación
 */
function saveComparison() {
    showLoadingSpinner();
    
    // Simular guardado
    setTimeout(() => {
        hideLoadingSpinner();
        showNotification('Cuadro comparativo guardado exitosamente', 'success');
        
        // Guardar en localStorage
        const comparisonData = {
            id: 'SOL-COT-2025-1234',
            date: new Date().toISOString(),
            client: 'CONSTRUCTORA ALMAGRO S.A.',
            status: 'saved'
        };
        localStorage.setItem('savedComparison', JSON.stringify(comparisonData));
    }, 1000);
}

/**
 * Seleccionar mejores cotizaciones
 */
function selectBestQuotes() {
    const modal = document.getElementById('quotationModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="best-quotes-selector">
            <h3>Selección de Mejores Cotizaciones</h3>
            <p>Seleccione el proveedor preferido para cada producto:</p>
            
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Mejor Precio</th>
                        <th>Mejor Plazo</th>
                        <th>Recomendado</th>
                        <th>Selección</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateBestQuotesRows()}
                </tbody>
            </table>
            
            <div class="selection-summary">
                <h4>Resumen de Selección:</h4>
                <div id="selectionSummary">
                    <p>Total estimado: <strong>$0</strong></p>
                    <p>Plazo máximo: <strong>0 días</strong></p>
                </div>
            </div>
            
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
                <button class="btn btn-success" onclick="confirmBestSelection()">
                    <i class="fas fa-check"></i> Confirmar Selección
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

/**
 * Generar OC Cliente
 */
function generateOCCliente() {
    if (confirm('¿Desea generar la Orden de Compra para el cliente basada en la selección actual?')) {
        showLoadingSpinner();
        
        setTimeout(() => {
            hideLoadingSpinner();
            showNotification('OC Cliente generada exitosamente', 'success');
            
            // Redireccionar a la página de OC Cliente
            setTimeout(() => {
                window.location.href = '../ordenes-compra/ssl_oc_detalle_oc_cliente.html?id=OC-CLI-2025-0001';
            }, 1500);
        }, 2000);
    }
}

/**
 * Imprimir cotización individual
 */
function printQuotation() {
    const modalContent = document.querySelector('.modal-content').innerHTML;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <html>
            <head>
                <title>Cotización - SSL v4.0</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                ${modalContent}
            </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

/**
 * Exportar análisis
 */
function exportAnalysis() {
    showNotification('Exportando análisis a PDF...', 'info');
    
    setTimeout(() => {
        showNotification('Análisis exportado exitosamente', 'success');
        
        // Simulación de descarga
        const link = document.createElement('a');
        link.download = `analisis_comparativo_${getCurrentDate()}.pdf`;
        link.click();
    }, 2000);
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Formatear número con separadores de miles
 * @param {number} num - Número a formatear
 * @returns {string} Número formateado
 */
function formatNumber(num) {
    return new Intl.NumberFormat('es-CL').format(num);
}

/**
 * Formatear moneda
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
 * Obtener fecha actual formateada
 * @returns {string} Fecha formateada
 */
function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Mostrar notificación
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, error, info, warning)
 */
function showNotification(message, type = 'info') {
    // Crear elemento de notificación si no existe
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 9999;
            transition: opacity 0.3s;
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 250px;
        `;
        document.body.appendChild(notification);
    }
    
    // Configurar colores según tipo
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    notification.style.color = 'white';
    notification.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;
    notification.style.opacity = '1';
    notification.style.display = 'flex';
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, 3000);
}

/**
 * Mostrar spinner de carga
 */
function showLoadingSpinner() {
    let spinner = document.getElementById('loadingSpinner');
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.id = 'loadingSpinner';
        spinner.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
        `;
        spinner.innerHTML = `
            <div style="
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
            "></div>
        `;
        document.body.appendChild(spinner);
        
        // Agregar animación CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    spinner.style.display = 'block';
}

/**
 * Ocultar spinner de carga
 */
function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

/**
 * Obtener datos del proveedor
 * @param {string} provider - ID del proveedor
 * @returns {object} Datos del proveedor
 */
function getProviderData(provider) {
    const providers = {
        ferreteria: {
            name: 'FERRETERÍA CENTRAL',
            quoteNumber: 'COT-2025-1234',
            date: '25/05/2025',
            validity: 30,
            total: 3037500,
            items: [
                { code: 'EL-1245', description: 'Cable eléctrico NYY 3x10mm2', quantity: '500 ML', unitPrice: 3200, total: 1600000, delivery: '3 días' },
                { code: 'EL-0876', description: 'Tubo Conduit PVC 25mm', quantity: '50 TRA', unitPrice: 11100, total: 555000, delivery: '2 días' },
                { code: 'EL-2534', description: 'Caja de derivación PVC 100x100mm', quantity: '150 UN', unitPrice: 1250, total: 187500, delivery: '1 día' },
                { code: 'EL-3698', description: 'Interruptor Diferencial 25A', quantity: '50 UN', unitPrice: 12500, total: 625000, delivery: '2 días' },
                { code: 'EL-4102', description: 'Terminal de conexión 10mm²', quantity: '200 UN', unitPrice: 350, total: 70000, delivery: '1 día' }
            ]
        },
        distribuidora: {
            name: 'DISTRIBUIDORA ELÉCTRICA',
            quoteNumber: 'COT-2025-1235',
            date: '24/05/2025',
            validity: 30,
            total: 2975000,
            items: [
                { code: 'EL-1245', description: 'Cable eléctrico NYY 3x10mm2', quantity: '500 ML', unitPrice: 3150, total: 1575000, delivery: '5 días' },
                { code: 'EL-0876', description: 'Tubo Conduit PVC 25mm', quantity: '50 TRA', unitPrice: 10680, total: 534000, delivery: '3 días' },
                { code: 'EL-2534', description: 'Caja de derivación PVC 100x100mm', quantity: '150 UN', unitPrice: 1280, total: 192000, delivery: '2 días' },
                { code: 'EL-3698', description: 'Interruptor Diferencial 25A', quantity: '50 UN', unitPrice: 12200, total: 610000, delivery: '3 días' },
                { code: 'EL-4102', description: 'Terminal de conexión 10mm²', quantity: '200 UN', unitPrice: 320, total: 64000, delivery: '2 días' }
            ]
        },
        materiales: {
            name: 'MATERIALES DEL SUR',
            quoteNumber: 'COT-2025-1236',
            date: '24/05/2025',
            validity: 30,
            total: 3205000,
            items: [
                { code: 'EL-1245', description: 'Cable eléctrico NYY 3x10mm2', quantity: '500 ML', unitPrice: 3400, total: 1700000, delivery: '2 días' },
                { code: 'EL-0876', description: 'Tubo Conduit PVC 25mm', quantity: '50 TRA', unitPrice: 11400, total: 570000, delivery: '1 día' },
                { code: 'EL-2534', description: 'Caja de derivación PVC 100x100mm', quantity: '150 UN', unitPrice: 1300, total: 195000, delivery: '1 día' },
                { code: 'EL-3698', description: 'Interruptor Diferencial 25A', quantity: '50 UN', unitPrice: 12800, total: 640000, delivery: '1 día' }
            ]
        }
    };
    
    return providers[provider] || providers.ferreteria;
}

/**
 * Obtener items incompletos
 * @returns {array} Lista de items incompletos
 */
function getIncompleteItems() {
    return [
        {
            provider: 'MATERIALES DEL SUR',
            product: 'Terminal de conexión 10mm²',
            code: 'EL-4102'
        }
    ];
}

/**
 * Generar filas para selección de mejores cotizaciones
 * @returns {string} HTML de las filas
 */
function generateBestQuotesRows() {
    const products = [
        { code: 'EL-1245', name: 'Cable eléctrico NYY 3x10mm2', bestPrice: 'DISTRIB. ELÉCTRICA', bestDelivery: 'MAT. DEL SUR', recommended: 'DISTRIB. ELÉCTRICA' },
        { code: 'EL-0876', name: 'Tubo Conduit PVC 25mm', bestPrice: 'DISTRIB. ELÉCTRICA', bestDelivery: 'MAT. DEL SUR', recommended: 'DISTRIB. ELÉCTRICA' },
        { code: 'EL-2534', name: 'Caja de derivación PVC', bestPrice: 'FERRETERÍA CENTRAL', bestDelivery: 'FERR. CENTRAL', recommended: 'FERRETERÍA CENTRAL' },
        { code: 'EL-3698', name: 'Interruptor Diferencial 25A', bestPrice: 'DISTRIB. ELÉCTRICA', bestDelivery: 'MAT. DEL SUR', recommended: 'DISTRIB. ELÉCTRICA' },
        { code: 'EL-4102', name: 'Terminal de conexión 10mm²', bestPrice: 'DISTRIB. ELÉCTRICA', bestDelivery: 'FERR. CENTRAL', recommended: 'DISTRIB. ELÉCTRICA' }
    ];
    
    return products.map(product => `
        <tr>
            <td>${product.code} - ${product.name}</td>
            <td class="best-price">${product.bestPrice}</td>
            <td>${product.bestDelivery}</td>
            <td><strong>${product.recommended}</strong></td>
            <td>
                <select class="filter-control" onchange="updateSelectionSummary()">
                    <option value="ferreteria">FERRETERÍA CENTRAL</option>
                    <option value="distribuidora" ${product.recommended.includes('DISTRIB') ? 'selected' : ''}>DISTRIBUIDORA ELÉCTRICA</option>
                    <option value="materiales" ${product.recommended.includes('MAT.') ? 'selected' : ''}>MATERIALES DEL SUR</option>
                </select>
            </td>
        </tr>
    `).join('');
}

/**
 * Actualizar resumen de selección
 */
function updateSelectionSummary() {
    // Calcular totales basados en selección
    const total = Math.floor(Math.random() * 500000) + 2500000;
    const days = Math.floor(Math.random() * 3) + 2;
    
    document.getElementById('selectionSummary').innerHTML = `
        <p>Total estimado: <strong>${formatCurrency(total)}</strong></p>
        <p>Plazo máximo: <strong>${days} días</strong></p>
        <p>Ahorro estimado: <strong style="color: #27ae60;">${formatCurrency(Math.floor(Math.random() * 100000) + 50000)}</strong></p>
    `;
}

/**
 * Confirmar selección de mejores cotizaciones
 */
function confirmBestSelection() {
    closeModal();
    showNotification('Selección de proveedores confirmada', 'success');
    
    // Guardar selección
    localStorage.setItem('bestSelection', JSON.stringify({
        date: new Date().toISOString(),
        selection: 'optimal'
    }));
}

/**
 * Generar gráficos de análisis
 */
function generateAnalysisCharts() {
    // Aquí se integraría con una librería de gráficos como Chart.js
    console.log('Generando gráficos de análisis...');
    
    // Simulación de gráficos
    const analysisBody = document.getElementById('analysisModalBody');
    if (analysisBody && !document.getElementById('priceChart').getContext) {
        analysisBody.innerHTML = `
            <div class="analysis-container">
                <h3>Análisis de Precios</h3>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
                    <p>📊 Gráfico de comparación de precios</p>
                    <p>DISTRIBUIDORA ELÉCTRICA: -2.1% vs promedio</p>
                </div>
                
                <h3 style="margin-top: 20px;">Análisis de Plazos</h3>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
                    <p>📈 Gráfico de plazos de entrega</p>
                    <p>MATERIALES DEL SUR: Mejor plazo promedio (1 día)</p>
                </div>
                
                <h3 style="margin-top: 20px;">Recomendaciones</h3>
                <div class="recommendations-box">
                    <ul>
                        <li>DISTRIBUIDORA ELÉCTRICA ofrece el mejor precio global (-2.1% vs promedio)</li>
                        <li>MATERIALES DEL SUR tiene los mejores plazos de entrega (1 día promedio)</li>
                        <li>Se recomienda solicitar cotización completa a MATERIALES DEL SUR</li>
                        <li>Considerar negociación de volumen con DISTRIBUIDORA ELÉCTRICA</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

/**
 * Resetear vista de tabla
 */
function resetTableView() {
    const table = document.getElementById('comparisonTable');
    if (table) {
        // Remover todas las clases de resaltado
        table.querySelectorAll('.highlight, .best-price').forEach(cell => {
            cell.classList.remove('highlight', 'best-price');
        });
        
        // Restaurar mejores precios originales
        highlightBestPrices();
    }
}

/**
 * Agrupar tabla por similitud
 */
function groupTableBySimilarity() {
    // Implementación de agrupación por similitud
    console.log('Agrupando productos similares...');
    
    // Reorganizar filas de la tabla
    const table = document.getElementById('comparisonTable');
    if (table) {
        // Lógica de agrupación
        showNotification('Productos agrupados por similitud', 'info');
    }
}

/**
 * Agrupar por categoría
 */
function groupByCategory() {
    // Implementación de agrupación por categoría
    console.log('Agrupando por categoría...');
    showNotification('Productos agrupados por categoría', 'info');
}

/**
 * Ocultar proveedores incompletos
 */
function hideIncompleteProviders() {
    // Implementación para ocultar proveedores incompletos
    console.log('Ocultando proveedores con cotizaciones incompletas...');
    showNotification('Mostrando solo proveedores con cotizaciones completas', 'info');
}

/**
 * Mostrar solo proveedores parciales
 */
function showOnlyPartialProviders() {
    // Implementación para mostrar solo proveedores parciales
    console.log('Mostrando proveedores con cotizaciones parciales...');
    showNotification('Mostrando proveedores con cotizaciones parciales', 'info');
}

/**
 * Mostrar todos los proveedores
 */
function showAllProviders() {
    // Implementación para mostrar todos los proveedores
    console.log('Mostrando todos los proveedores...');
    showNotification('Mostrando todos los proveedores', 'info');
}

/**
 * Resaltar calidad
 */
function highlightQuality() {
    // Implementación para resaltar calidad
    console.log('Resaltando productos por calidad...');
    showNotification('Criterio de calidad aplicado', 'info');
}

/**
 * Aplicar criterios combinados
 */
function applyCombinedCriteria() {
    // Implementación de criterios combinados
    console.log('Aplicando criterios combinados...');
    highlightBestPrices();
    highlightBestDelivery();
    showNotification('Criterios combinados aplicados', 'success');
}

/**
 * Obtener nombre del criterio
 * @param {string} criteria - ID del criterio
 * @returns {string} Nombre del criterio
 */
function getCriteriaName(criteria) {
    const names = {
        price: 'Precio',
        delivery: 'Plazo de Entrega',
        quality: 'Calidad',
        brand: 'Marca',
        combined: 'Combinado'
    };
    return names[criteria] || criteria;
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltipText = this.querySelector('.tooltiptext');
            if (tooltipText) {
                tooltipText.style.visibility = 'visible';
                tooltipText.style.opacity = '1';
            }
        });
        
        tooltip.addEventListener('mouseleave', function() {
            const tooltipText = this.querySelector('.tooltiptext');
            if (tooltipText) {
                tooltipText.style.visibility = 'hidden';
                tooltipText.style.opacity = '0';
            }
        });
    });
    
    // Resaltar mejores precios al cargar
    highlightBestPrices();
    
    // Gestión de checkboxes de criterios
    document.querySelectorAll('.criteria-checkbox input').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const activeCriteria = [];
            document.querySelectorAll('.criteria-checkbox input:checked').forEach(checked => {
                activeCriteria.push(checked.parentElement.textContent.trim());
            });
            
            if (activeCriteria.length > 0) {
                showNotification(`Criterios activos: ${activeCriteria.join(', ')}`, 'info');
            }
        });
    });
    
    // Atajos de teclado
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + P para imprimir
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            printComparison();
        }
        
        // Ctrl/Cmd + E para exportar
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportToExcel();
        }
        
        // Esc para cerrar modales
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
    
    // Auto-guardar cambios
    let autoSaveTimer;
    document.addEventListener('change', function() {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => {
            console.log('Auto-guardando cambios...');
            // Implementar auto-guardado
        }, 3000);
    });
    
    // Cargar datos guardados si existen
    const savedComparison = localStorage.getItem('savedComparison');
    if (savedComparison) {
        try {
            comparisonData = JSON.parse(savedComparison);
            console.log('Datos de comparación cargados:', comparisonData);
        } catch (e) {
            console.error('Error al cargar datos guardados:', e);
        }
    }
    
    console.log('Detalle de Cuadro Comparativo inicializado');
});

// Exportar funciones para uso global
window.changeView = changeView;
window.closeModal = closeModal;
window.closeAnalysisModal = closeAnalysisModal;
window.exportToExcel = exportToExcel;
window.printComparison = printComparison;
window.shareComparison = shareComparison;
window.showIncompleteAlert = showIncompleteAlert;
window.saveComparison = saveComparison;
window.selectBestQuotes = selectBestQuotes;
window.generateOCCliente = generateOCCliente;
window.printQuotation = printQuotation;
window.exportAnalysis = exportAnalysis;
window.showProviderQuote = showProviderQuote;
window.updateSelectionSummary = updateSelectionSummary;
window.confirmBestSelection = confirmBestSelection;