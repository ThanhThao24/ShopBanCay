document.addEventListener('DOMContentLoaded', () => {
    loadRevenueStats();
    initRevenueChart();
    initPeriodFilter();
    initExport();
});

function loadRevenueStats() {
    const orders = window.MXStore?.getOrders() || [];
    
    const today = new Date();
    const thisMonth = orders.filter(o => {
        const orderDate = new Date(o.date);
        return orderDate.getMonth() === today.getMonth();
    });
    
    const lastMonth = orders.filter(o => {
        const orderDate = new Date(o.date);
        return orderDate.getMonth() === today.getMonth() - 1;
    });
    
    const thisMonthRevenue = thisMonth.reduce((sum, o) => sum + (o.total || 0), 0);
    const lastMonthRevenue = lastMonth.reduce((sum, o) => sum + (o.total || 0), 0);
    const growth = lastMonthRevenue ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1) : 0;
    
    document.getElementById('this-month-revenue').textContent = window.MXStore?.formatPrice(thisMonthRevenue) || '0đ';
    document.getElementById('last-month-revenue').textContent = window.MXStore?.formatPrice(lastMonthRevenue) || '0đ';
    document.getElementById('growth-rate').textContent = growth + '%';
    document.getElementById('growth-rate').style.color = growth >= 0 ? '#154212' : '#60233e';
}

function initRevenueChart() {
    const canvas = document.getElementById('revenue-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 300;
    
    const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const data = [45, 52, 48, 65, 70, 68, 75, 72, 80, 85, 82, 90];
    const max = Math.max(...data);
    const padding = 40;
    const barWidth = (width - 2 * padding) / data.length;
    
    ctx.clearRect(0, 0, width, height);
    
    ctx.fillStyle = '#2d5a27';
    data.forEach((value, i) => {
        const barHeight = (value / max) * (height - 2 * padding);
        const x = padding + i * barWidth;
        const y = height - padding - barHeight;
        ctx.fillRect(x, y, barWidth - 5, barHeight);
    });
    
    ctx.fillStyle = '#42493e';
    ctx.font = '10px Inter';
    months.forEach((month, i) => {
        const x = padding + i * barWidth + barWidth / 2 - 10;
        ctx.fillText(month, x, height - 10);
    });
}

function initPeriodFilter() {
    const filterBtns = document.querySelectorAll('.period-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadRevenueStats();
            initRevenueChart();
        });
    });
}

function initExport() {
    const exportBtn = document.getElementById('btn-export-revenue');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const orders = window.MXStore?.getOrders() || [];
            const csv = [
                ['Tháng', 'Doanh thu', 'Số đơn'].join(','),
                ...Array.from({ length: 12 }, (_, i) => {
                    const monthOrders = orders.filter(o => new Date(o.date).getMonth() === i);
                    const revenue = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
                    return [`Tháng ${i + 1}`, revenue, monthOrders.length].join(',');
                })
            ].join('\n');
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'revenue-' + Date.now() + '.csv';
            a.click();
            URL.revokeObjectURL(url);
            
            showNotice('Đã xuất báo cáo doanh thu', 'success');
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
