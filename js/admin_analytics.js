document.addEventListener('DOMContentLoaded', () => {
    loadAnalytics();
    initCharts();
    initDateFilter();
    initExport();
});

function loadAnalytics() {
    const orders = window.MXStore?.getOrders() || [];
    const products = window.MXStore?.getProducts() || [];

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;
    const topProduct = products.sort((a, b) => (b.stock || 0) - (a.stock || 0))[0];

    document.getElementById('total-revenue').textContent = window.MXStore?.formatPrice(totalRevenue) || '0đ';
    document.getElementById('avg-order').textContent = window.MXStore?.formatPrice(avgOrderValue) || '0đ';
    document.getElementById('top-product').textContent = topProduct?.name || 'N/A';
}

function initCharts() {
    const salesCanvas = document.getElementById('sales-chart');
    const categoryCanvas = document.getElementById('category-chart');
    
    if (salesCanvas) drawSalesChart(salesCanvas);
    if (categoryCanvas) drawCategoryChart(categoryCanvas);
}

function drawSalesChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 250;
    
    const data = [30, 45, 38, 55, 62, 58, 70, 65, 75, 80, 72, 85];
    const max = Math.max(...data);
    const padding = 30;
    
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#154212';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((value, i) => {
        const x = padding + (i * (width - 2 * padding) / (data.length - 1));
        const y = height - padding - ((value / max) * (height - 2 * padding));
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(21, 66, 18, 0.1)';
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fill();
}

function drawCategoryChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 250;
    
    const categories = [
        { name: 'Trong nhà', value: 45, color: '#154212' },
        { name: 'Ngoài trời', value: 30, color: '#2d5a27' },
        { name: 'Phong thủy', value: 25, color: '#f2ddc0' }
    ];
    
    const total = categories.reduce((sum, c) => sum + c.value, 0);
    let startAngle = -Math.PI / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    
    ctx.clearRect(0, 0, width, height);
    
    categories.forEach(cat => {
        const sliceAngle = (cat.value / total) * 2 * Math.PI;
        ctx.fillStyle = cat.color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        startAngle += sliceAngle;
    });
}

function initDateFilter() {
    const filterBtns = document.querySelectorAll('.date-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadAnalytics();
            initCharts();
        });
    });
}

function initExport() {
    const exportBtn = document.getElementById('btn-export');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const orders = window.MXStore?.getOrders() || [];
            const csv = [
                ['Mã đơn', 'Khách hàng', 'Tổng tiền', 'Ngày'].join(','),
                ...orders.map(o => [
                    o.id,
                    o.customer || o.shipping?.fullname || '',
                    o.total,
                    o.date
                ].join(','))
            ].join('\n');
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'analytics-' + Date.now() + '.csv';
            a.click();
            URL.revokeObjectURL(url);
            
            showNotice('Đã xuất báo cáo', 'success');
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
