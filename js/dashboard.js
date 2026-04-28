document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadRecentOrders();
    loadTopProducts();
    initCharts();
    initRefresh();
});

function loadStats() {
    const orders = window.MXStore?.getOrders() || [];
    const products = window.MXStore?.getProducts() || [];

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const lowStockProducts = products.filter(p => (p.stock || 0) < 10).length;

    const statOrders = document.getElementById('stat-orders');
    const statRevenue = document.getElementById('stat-revenue');
    const statPending = document.getElementById('stat-pending');
    const statLowStock = document.getElementById('stat-low-stock');

    if (statOrders) statOrders.textContent = totalOrders;
    if (statRevenue) statRevenue.textContent = window.MXStore?.formatPrice(totalRevenue) || totalRevenue.toLocaleString('vi-VN') + 'đ';
    if (statPending) statPending.textContent = pendingOrders;
    if (statLowStock) statLowStock.textContent = lowStockProducts;
}

function loadRecentOrders() {
    const orders = window.MXStore?.getOrders() || [];
    const list = document.getElementById('recent-orders-list');
    if (!list) return;

    list.innerHTML = orders.slice(0, 5).map(order => `
        <div class="order-item" style="display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #eee; cursor: pointer;" onclick="window.location.href='admin_orders.html'">
            <span style="font-weight: 600;">#${order.id}</span>
            <span>${order.customer || order.shipping?.fullname || 'Khách hàng'}</span>
            <span style="color: #154212; font-weight: 600;">${window.MXStore?.formatPrice(order.total) || order.total}</span>
        </div>
    `).join('');
}

function loadTopProducts() {
    const products = window.MXStore?.getProducts() || [];
    const list = document.getElementById('top-products-list');
    if (!list) return;

    const sorted = products.sort((a, b) => (b.stock || 0) - (a.stock || 0)).slice(0, 5);
    list.innerHTML = sorted.map(product => `
        <div class="product-item" style="display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #eee;">
            <span>${product.name}</span>
            <span style="color: #2d5a27; font-weight: 600;">Tồn: ${product.stock || 0}</span>
        </div>
    `).join('');
}

function initCharts() {
    const revenueCanvas = document.getElementById('revenue-chart');
    const ordersCanvas = document.getElementById('orders-chart');
    
    if (revenueCanvas) drawRevenueChart(revenueCanvas);
    if (ordersCanvas) drawOrdersChart(ordersCanvas);
}

function drawRevenueChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 200;
    
    const data = [45, 52, 48, 65, 70, 68, 75];
    const max = Math.max(...data);
    const padding = 20;
    
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#154212';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((value, i) => {
        const x = padding + (i * (width - 2 * padding) / (data.length - 1));
        const y = height - padding - ((value / max) * (height - 2 * padding));
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    
    ctx.stroke();
}

function drawOrdersChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 200;
    
    const data = [12, 19, 15, 25, 22, 30, 28];
    const max = Math.max(...data);
    const barWidth = (width - 40) / data.length;
    
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#2d5a27';
    
    data.forEach((value, i) => {
        const barHeight = (value / max) * (height - 40);
        const x = 20 + i * barWidth;
        const y = height - 20 - barHeight;
        ctx.fillRect(x, y, barWidth - 10, barHeight);
    });
}

function initRefresh() {
    const refreshBtn = document.getElementById('btn-refresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadStats();
            loadRecentOrders();
            loadTopProducts();
            showNotice('Đã làm mới dữ liệu', 'success');
        });
    }
}

function showNotice(message, type = 'info') {
    const notice = document.createElement('div');
    notice.textContent = message;
    notice.style.cssText = `position: fixed; top: 20px; right: 20px; background: ${type === 'success' ? '#154212' : '#1f2937'}; color: white; padding: 10px 14px; border-radius: 8px; z-index: 9999;`;
    document.body.appendChild(notice);
    setTimeout(() => notice.remove(), 2000);
}
