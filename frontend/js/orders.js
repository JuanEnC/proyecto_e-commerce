// frontend/js/orders.js

document.addEventListener('DOMContentLoaded', () => {
    const ordersList = document.getElementById('ordersList');

    // Validar sesión local (api.js también lo validará en la petición)
    if (!localStorage.getItem('token')) {
        alert("Debes iniciar sesión para ver tus pedidos.");
        window.location.href = "login.html";
        return;
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'PENDING': return 'status-pending';
            case 'COMPLETED': return 'status-completed';
            case 'CANCELLED': return 'status-cancelled';
            default: return 'status-pending';
        }
    };

    const translateStatus = (status) => {
        switch (status) {
            case 'PENDING': return 'Pendiente';
            case 'COMPLETED': return 'Completado';
            case 'CANCELLED': return 'Cancelado';
            default: return status;
        }
    };

    // --- CORRECCIÓN: Uso de api.js ---
    const fetchOrders = async () => {
        try {
            // Se elimina el fetch crudo. api.js adjunta el token automáticamente.
            const ordersData = await API.get('/orders');
            renderOrders(ordersData);

        } catch (error) {
            console.error("Error:", error);
            ordersList.innerHTML = `<p class="empty-msg" style="color: #ff4d4d;">Ocurrió un error: ${error.message}</p>`;
        }
    };

    const renderOrders = (orders) => {
        ordersList.innerHTML = ''; 

        if (orders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-msg">
                    <i class="fa fa-box-open" style="font-size: 3rem; margin-bottom: 1rem; color: var(--text-muted);"></i>
                    <p>Aún no tienes pedidos registrados.</p>
                    <a href="catalog.html" class="btn btn-outline" style="margin-top: 1rem; display: inline-block;">Ir de compras</a>
                </div>`;
            return;
        }

        orders.forEach(order => {
            const card = document.createElement('div');
            card.className = 'order-card';
            
            const itemsText = order.items && order.items.length > 0 
                ? `<p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">
                    Artículos: ${order.items.map(item => item.name).join(', ')}
                   </p>` 
                : '';

            card.innerHTML = `
                <div class="order-header">
                    <div class="order-id">Pedido #${order.orderId}</div>
                    <div class="order-date"><i class="far fa-calendar-alt"></i> ${formatDate(order.date)}</div>
                </div>
                ${itemsText}
                <div class="order-body">
                    <div class="order-total">
                        Total: $${parseFloat(order.total).toFixed(2)}
                    </div>
                    <div class="status-badge ${getStatusClass(order.status)}">
                        ${translateStatus(order.status)}
                    </div>
                </div>
            `;
            
            ordersList.appendChild(card);
        });
    };

    // Inicializar
    fetchOrders();
});