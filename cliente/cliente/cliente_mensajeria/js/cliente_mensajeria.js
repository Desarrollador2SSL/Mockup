// ================================
// Cliente - Mensajería JavaScript
// ===============================

// Chat data storage
let chats = [];
let currentChat = null;
let unreadMessages = new Map();

// Initialize messaging system
document.addEventListener('DOMContentLoaded', function() {
    initializeMessaging();
    
    // Check if we're on the list or detail page
    if (document.getElementById('searchChats')) {
        initializeChatList();
    }
    
    if (document.getElementById('messageInput')) {
        initializeChatDetail();
    }
});

// Initialize messaging system
function initializeMessaging() {
    // Load unread messages from localStorage
    loadUnreadMessages();
    
    // Update unread counts
    updateUnreadCounts();
    
    // Start periodic checks for new messages (simulation)
    setInterval(checkNewMessages, 30000); // Check every 30 seconds
}

// Load unread messages from localStorage
function loadUnreadMessages() {
    const stored = localStorage.getItem('unreadMessages');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            unreadMessages = new Map(Object.entries(data));
        } catch (e) {
            console.error('Error loading unread messages:', e);
        }
    } else {
        // Initialize with some demo data
        unreadMessages.set('SOL-2025-0234-1-pendiente', 3);
        unreadMessages.set('SOL-2025-0233-2-cotizacion', 1);
        unreadMessages.set('COT-2025-0456', 2);
        unreadMessages.set('LPE-2025-0089', 1);
        saveUnreadMessages();
    }
}

// Save unread messages to localStorage
function saveUnreadMessages() {
    const data = Object.fromEntries(unreadMessages);
    localStorage.setItem('unreadMessages', JSON.stringify(data));
}

// Update unread counts in UI
function updateUnreadCounts() {
    // Update total unread count
    const totalUnread = Array.from(unreadMessages.values()).reduce((a, b) => a + b, 0);
    const totalUnreadElement = document.getElementById('totalUnread');
    if (totalUnreadElement) {
        totalUnreadElement.textContent = totalUnread;
    }
    
    // Update section badges
    updateSectionBadges();
}

// Update section badges
function updateSectionBadges() {
    const sections = document.querySelectorAll('.chat-section');
    sections.forEach(section => {
        const chats = section.querySelectorAll('.chat-item');
        let unreadCount = 0;
        chats.forEach(chat => {
            const unreadBadge = chat.querySelector('.unread-count');
            if (unreadBadge) {
                unreadCount += parseInt(unreadBadge.textContent) || 0;
            }
        });
        
        const badge = section.querySelector('.section-badge');
        if (badge) {
            badge.textContent = unreadCount || section.querySelectorAll('.chat-item').length;
        }
    });
}

// =============================================
// CHAT LIST FUNCTIONS
// =============================================

// Initialize chat list page
function initializeChatList() {
    // Search functionality
    const searchInput = document.getElementById('searchChats');
    if (searchInput) {
        searchInput.addEventListener('input', filterChats);
    }
    
    // Filter functionality
    const filterSelect = document.getElementById('filterType');
    if (filterSelect) {
        filterSelect.addEventListener('change', filterChats);
    }
    
    // Sort functionality
    const sortSelect = document.getElementById('sortChats');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortChats);
    }
}

// Toggle chat section
function toggleChatSection(header) {
    header.classList.toggle('collapsed');
    
    // Animate content
    const content = header.nextElementSibling;
    if (header.classList.contains('collapsed')) {
        content.style.maxHeight = '0';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
    }
}

// Open chat
function openChat(type, numero, version = null, estado = null) {
    let params = [];
    
    switch(type) {
        case 'solicitud':
            params.push(`type=solicitud`);
            params.push(`numero=${numero}`);
            if (version) params.push(`version=${version}`);
            if (estado) params.push(`estado=${estado}`);
            break;
        case 'cotizacion':
            params.push(`type=cotizacion`);
            params.push(`numero=${numero}`);
            break;
        case 'recepcion':
            params.push(`type=recepcion`);
            params.push(`lpe=${numero}`);
            break;
    }
    
    // Mark messages as read for this chat
    const chatId = getChatId(type, numero, version, estado);
    markAsRead(chatId);
    
    // Navigate to detail page
    window.location.href = `cliente_detalle_mensajeria.html?${params.join('&')}`;
}

// Get chat ID
function getChatId(type, numero, version = null, estado = null) {
    if (type === 'solicitud' && version && estado) {
        return `${numero}-${version}-${estado}`;
    }
    return numero;
}

// Mark messages as read
function markAsRead(chatId) {
    if (unreadMessages.has(chatId)) {
        unreadMessages.delete(chatId);
        saveUnreadMessages();
        updateUnreadCounts();
        
        // Update UI
        const chatItem = document.querySelector(`[data-chat-id="${chatId}"]`);
        if (chatItem) {
            chatItem.classList.remove('unread');
            const unreadBadge = chatItem.querySelector('.unread-count');
            if (unreadBadge) {
                unreadBadge.remove();
            }
        }
    }
}

// Filter chats
function filterChats() {
    const searchTerm = document.getElementById('searchChats').value.toLowerCase();
    const filterType = document.getElementById('filterType').value;
    
    const chatItems = document.querySelectorAll('.chat-item');
    let visibleCount = 0;
    
    chatItems.forEach(item => {
        const title = item.querySelector('.chat-title').textContent.toLowerCase();
        const preview = item.querySelector('.chat-message').textContent.toLowerCase();
        const hasUnread = item.classList.contains('unread');
        const section = item.closest('.chat-section');
        const sectionType = section.dataset.type;
        
        let matchesSearch = title.includes(searchTerm) || preview.includes(searchTerm);
        let matchesFilter = true;
        
        // Apply filter
        if (filterType === 'unread') {
            matchesFilter = hasUnread;
        } else if (filterType !== 'all') {
            matchesFilter = sectionType === filterType;
        }
        
        if (matchesSearch && matchesFilter) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show/hide empty state
    const emptyState = document.getElementById('emptyState');
    if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
    
    // Update sections visibility
    updateSectionsVisibility();
}

// Sort chats
function sortChats() {
    const sortBy = document.getElementById('sortChats').value;
    
    // Get all sections
    const sections = document.querySelectorAll('.chat-section');
    
    sections.forEach(section => {
        const content = section.querySelector('.section-content');
        const items = Array.from(content.querySelectorAll('.chat-item'));
        
        // Sort items
        items.sort((a, b) => {
            if (sortBy === 'unread') {
                const aUnread = a.classList.contains('unread');
                const bUnread = b.classList.contains('unread');
                if (aUnread && !bUnread) return -1;
                if (!aUnread && bUnread) return 1;
            }
            
            // Default to recent (by time)
            const aTime = parseTime(a.querySelector('.chat-time').textContent);
            const bTime = parseTime(b.querySelector('.chat-time').textContent);
            return bTime - aTime;
        });
        
        // Reorder DOM elements
        items.forEach(item => content.appendChild(item));
    });
}

// Parse time text to comparable value
function parseTime(timeText) {
    if (timeText.includes('min')) {
        return parseInt(timeText) || 0;
    }
    if (timeText.includes('hora')) {
        return (parseInt(timeText) || 0) * 60;
    }
    if (timeText === 'Ayer') {
        return 24 * 60;
    }
    if (timeText.includes('día')) {
        return (parseInt(timeText) || 0) * 24 * 60;
    }
    return 10000; // Very old
}

// Update sections visibility
function updateSectionsVisibility() {
    const sections = document.querySelectorAll('.chat-section');
    
    sections.forEach(section => {
        const visibleItems = section.querySelectorAll('.chat-item:not([style*="display: none"])');
        if (visibleItems.length === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
}

// =============================================
// CHAT DETAIL FUNCTIONS
// =============================================

// Initialize chat detail page
function initializeChatDetail() {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const numero = urlParams.get('numero');
    const version = urlParams.get('version');
    const estado = urlParams.get('estado');
    const lpe = urlParams.get('lpe');
    
    // Load chat data
    loadChatData(type, numero || lpe, version, estado);
    
    // Mark messages as read
    markMessagesAsRead();
    
    // Initialize message input
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            autoResize(this);
            updateSendButton();
        });
        
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Scroll to bottom
    scrollToBottom();
    
    // Simulate incoming messages
    setTimeout(simulateIncomingMessage, 5000);
}

// Load chat data
function loadChatData(type, numero, version, estado) {
    // Update UI with chat information
    const chatTitle = document.getElementById('chatTitle');
    const chatType = document.getElementById('chatType');
    const breadcrumbTitle = document.getElementById('breadcrumbTitle');
    
    if (type === 'solicitud') {
        chatTitle.textContent = `${numero}${version ? ' v' + version : ''}`;
        chatType.textContent = 'Solicitud de Pedido';
        breadcrumbTitle.textContent = `${numero}`;
        
        // Update info panel
        document.getElementById('infoDocNumber').textContent = numero;
        document.getElementById('infoDocType').textContent = 'Solicitud de Pedido';
        document.getElementById('infoDocStatus').textContent = getStatusText(estado);
    } else if (type === 'cotizacion') {
        chatTitle.textContent = numero;
        chatType.textContent = 'Cotización';
        breadcrumbTitle.textContent = numero;
        
        // Update info panel
        document.getElementById('infoDocNumber').textContent = numero;
        document.getElementById('infoDocType').textContent = 'Cotización';
    } else if (type === 'recepcion') {
        chatTitle.textContent = numero;
        chatType.textContent = 'Control de Recepción';
        breadcrumbTitle.textContent = numero;
        
        // Update info panel
        document.getElementById('infoDocNumber').textContent = numero;
        document.getElementById('infoDocType').textContent = 'Control de Recepción';
    }
    
    // Store current chat info
    currentChat = { type, numero, version, estado };
}

// Get status text
function getStatusText(estado) {
    const statusMap = {
        'pendiente': 'Pendiente',
        'cotizacion': 'En cotización',
        'aprobado': 'Aprobado',
        'rechazado': 'Rechazado'
    };
    return statusMap[estado] || estado;
}

// Mark messages as read in detail view
function markMessagesAsRead() {
    // Remove 'new' class from messages
    const newMessages = document.querySelectorAll('.message.new');
    newMessages.forEach(msg => {
        setTimeout(() => {
            msg.classList.remove('new');
        }, 1000);
    });
    
    // Hide unread indicator
    const unreadIndicator = document.getElementById('unreadIndicator');
    if (unreadIndicator) {
        setTimeout(() => {
            unreadIndicator.style.display = 'none';
        }, 2000);
    }
    
    // Update unread count in localStorage
    if (currentChat) {
        const chatId = getChatId(currentChat.type, currentChat.numero, currentChat.version, currentChat.estado);
        markAsRead(chatId);
    }
}

// Send message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();
    
    if (!messageText) return;
    
    // Create message element
    const messagesContainer = document.getElementById('messagesContainer');
    const typingIndicator = document.getElementById('typingIndicator');
    
    // Remove typing indicator if present
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
    
    // Add user message
    const messageHtml = createUserMessage(messageText);
    messagesContainer.insertAdjacentHTML('beforeend', messageHtml);
    
    // Clear input
    messageInput.value = '';
    autoResize(messageInput);
    updateSendButton();
    
    // Scroll to bottom
    scrollToBottom();
    
    // Simulate typing indicator and response
    setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            addBotResponse();
        }, 2000);
    }, 500);
}

// Create user message HTML
function createUserMessage(text) {
    const now = new Date();
    const time = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    
    return `
        <div class="message sent">
            <div class="message-content">
                <div class="message-header">
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-text">
                    ${escapeHtml(text)}
                </div>
                <div class="message-status">
                    <i class="fas fa-check"></i>
                </div>
            </div>
        </div>
    `;
}

// Add bot response
function addBotResponse() {
    const responses = [
        'Gracias por su mensaje. Estamos procesando su consulta.',
        'Hemos recibido su información. Un ejecutivo lo contactará pronto.',
        'Entendido. Actualizaremos el estado de su solicitud.',
        'Perfecto. Hemos registrado su confirmación en el sistema.',
        'Su mensaje ha sido enviado al equipo correspondiente.'
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const messagesContainer = document.getElementById('messagesContainer');
    const now = new Date();
    const time = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    
    const messageHtml = `
        <div class="message received">
            <div class="message-avatar">
                <span>SSL</span>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">Soporte SSL</span>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-text">
                    ${randomResponse}
                </div>
            </div>
        </div>
    `;
    
    messagesContainer.insertAdjacentHTML('beforeend', messageHtml);
    scrollToBottom();
    
    // Update message status to read
    setTimeout(() => {
        const sentMessages = document.querySelectorAll('.message.sent .fa-check');
        sentMessages.forEach(icon => {
            icon.className = 'fas fa-check-double read';
        });
    }, 1000);
}

// Show typing indicator
function showTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'flex';
        scrollToBottom();
    }
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
}

// Auto resize textarea
function autoResize(element) {
    element.style.height = 'auto';
    element.style.height = Math.min(element.scrollHeight, 120) + 'px';
}

// Update send button state
function updateSendButton() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
    if (messageInput.value.trim()) {
        sendButton.disabled = false;
    } else {
        sendButton.disabled = true;
    }
}

// Scroll to bottom of messages
function scrollToBottom() {
    const messagesContainer = document.getElementById('messagesContainer');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Handle key press in message input
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Attach file
function attachFile() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.click();
    } else {
        // Create file input if it doesn't exist
        const input = document.createElement('input');
        input.type = 'file';
        input.id = 'fileInput';
        input.style.display = 'none';
        input.multiple = true;
        input.onchange = handleFileSelect;
        document.body.appendChild(input);
        input.click();
    }
}

// Handle file selection
function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        const fileNames = Array.from(files).map(f => f.name).join(', ');
        
        // Add a message with attachment
        const messagesContainer = document.getElementById('messagesContainer');
        const now = new Date();
        const time = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        
        const messageHtml = `
            <div class="message sent">
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-time">${time}</span>
                    </div>
                    <div class="message-text">
                        Adjunto archivo(s): ${escapeHtml(fileNames)}
                    </div>
                    <div class="message-attachment">
                        <i class="fas fa-file"></i>
                        <div class="attachment-info">
                            <span class="attachment-name">${escapeHtml(fileNames)}</span>
                            <span class="attachment-size">${formatFileSize(files[0].size)}</span>
                        </div>
                    </div>
                    <div class="message-status">
                        <i class="fas fa-check"></i>
                    </div>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHtml);
        scrollToBottom();
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / (1024 * 1024)) + ' MB';
}

// Show chat info panel
function showChatInfo() {
    const infoPanel = document.getElementById('chatInfoPanel');
    if (infoPanel) {
        infoPanel.classList.add('active');
    }
}

// Close chat info panel
function closeChatInfo() {
    const infoPanel = document.getElementById('chatInfoPanel');
    if (infoPanel) {
        infoPanel.classList.remove('active');
    }
}

// Go to document
function goToDocument() {
    if (!currentChat) return;
    
    let url = '';
    const { type, numero, version, estado } = currentChat;
    
    switch(type) {
        case 'solicitud':
            url = `../cliente_solicitud_pedido/cliente_detalle_solicitud.html?numero=${numero}`;
            if (version) url += `&version=${version}`;
            if (estado) url += `&estado=${estado}`;
            break;
        case 'cotizacion':
            url = `../cliente_cotizaciones/cliente_detalle_cotizacion.html?numero=${numero}`;
            break;
        case 'recepcion':
            url = `../cliente_control_recepcion/cliente_detalle_despacho.html?lpe=${numero}`;
            break;
    }
    
    if (url) {
        window.open(url, '_blank');
    }
}

// Simulate incoming message
function simulateIncomingMessage() {
    if (Math.random() > 0.5) return; // 50% chance of new message
    
    const messages = [
        'Hemos actualizado la información de su solicitud.',
        'Se ha registrado un nuevo movimiento en su documento.',
        'Su consulta está siendo atendida por nuestro equipo.',
        'Le informamos que hay novedades en su pedido.'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();
        
        const messagesContainer = document.getElementById('messagesContainer');
        const now = new Date();
        const time = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        
        const messageHtml = `
            <div class="message received new">
                <div class="message-avatar">
                    <span>SSL</span>
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-sender">Soporte SSL</span>
                        <span class="message-time">${time}</span>
                    </div>
                    <div class="message-text">
                        ${randomMessage}
                    </div>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHtml);
        scrollToBottom();
        
        // Play notification sound (if implemented)
        playNotificationSound();
    }, 2000);
    
    // Schedule next check
    setTimeout(simulateIncomingMessage, 30000 + Math.random() * 60000);
}

// Check for new messages (simulation)
function checkNewMessages() {
    // This would normally check with the server
    // For demo, randomly add unread messages
    if (Math.random() > 0.7) {
        const chatIds = ['SOL-2025-0235-1-pendiente', 'COT-2025-0457', 'LPE-2025-0090'];
        const randomId = chatIds[Math.floor(Math.random() * chatIds.length)];
        
        const currentCount = unreadMessages.get(randomId) || 0;
        unreadMessages.set(randomId, currentCount + 1);
        
        saveUnreadMessages();
        updateUnreadCounts();
        
        // Show notification
        showNewMessageNotification(randomId);
    }
}

// Show new message notification
function showNewMessageNotification(chatId) {
    // This would show a browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Nuevo mensaje en SSL v4.0', {
            body: `Tiene un nuevo mensaje en ${chatId}`,
            icon: '/favicon.ico'
        });
    }
}

// Play notification sound
function playNotificationSound() {
    // Create audio element if needed
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQYGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBStp0Oy9diMJHnDA7tGBOgkVaLvv5JE+CRht0ezajTkIA1yn49+8Zg0HVqfn47dpFgRQpt/zzLNuKwVgn9z1sc94PQg2eMvzzH86CAhYse7g0IdZFQBapu3YtIJdHwBVkOnqx5tXKQxTmuT1r4FiOwRAseratGcmCzSK3PTRpVgdCUuE4/a7dTMPM3nU6KKAWzwTNlyo69KmUTALRHPC7thxIwYwfNvqu3ogByl+3Oy1dwwAUIHH+vexIBUAQrDZ2VYDALrd/+q');
    audio.play().catch(e => console.log('Could not play sound'));
}

// Escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Request notification permission
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Initialize on load
requestNotificationPermission();