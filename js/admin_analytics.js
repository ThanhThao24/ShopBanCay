document.addEventListener('DOMContentLoaded', () => {
  const store = window.MXStore;
  const orders = store?.getOrders() || [];
  const products = store?.getProducts() || [];

  // ── KPI cards ──
  // Structure: .kpi-header > div:first-child > div (the value div, sibling of h3)
  const kpiValueDivs = document.querySelectorAll('.kpi-card .kpi-header > div:first-child > div');

  const customerSet = new Set(
    orders.map(o => o.customer || o.shipping?.fullname).filter(Boolean)
  );
  const newCustomers = customerSet.size;

  // Retention: customers who placed more than 1 order
  const ordersByCustomer = {};
  orders.forEach(o => {
    const key = o.customer || o.shipping?.fullname;
    if (key) ordersByCustomer[key] = (ordersByCustomer[key] || 0) + 1;
  });
  const repeatCount = Object.values(ordersByCustomer).filter(c => c > 1).length;
  const retentionRate = newCustomers ? Math.round((repeatCount / newCustomers) * 100) : 0;

  // LTV: total revenue / unique customers
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const ltv = newCustomers ? Math.round(totalRevenue / newCustomers) : 0;

  if (kpiValueDivs[0]) kpiValueDivs[0].textContent = newCustomers.toLocaleString('vi-VN');
  if (kpiValueDivs[1]) kpiValueDivs[1].textContent = retentionRate + '%';
  if (kpiValueDivs[2]) kpiValueDivs[2].textContent = (ltv / 1_000_000).toFixed(1) + 'M ₫';

  // Update donut chart % text
  const donutPct = document.querySelector('.donut-chart > div > div:nth-child(2)');
  if (donutPct) donutPct.textContent = retentionRate + '%';

  // ── Top products from order items ──
  const productSales = {};
  const productRevenue = {};
  orders.forEach(o => {
    (o.items || []).forEach(item => {
      const key = item.id || item.name;
      if (!key) return;
      productSales[key] = (productSales[key] || 0) + (item.qty || item.quantity || 1);
      productRevenue[key] = (productRevenue[key] || 0) +
        (item.price || 0) * (item.qty || item.quantity || 1);
    });
  });

  const productList = document.querySelector('.product-list');
  if (productList && Object.keys(productSales).length) {
    const topIds = Object.keys(productSales)
      .sort((a, b) => productSales[b] - productSales[a])
      .slice(0, 3);

    productList.innerHTML = topIds.map(pid => {
      const prod = products.find(p => p.id === pid || p.name === pid);
      const name = prod?.name || pid;
      const imgTag = prod?.image
        ? `<img src="../${prod.image}" alt="${name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'">`
        : '';
      const category = prod?.category || 'Sản phẩm';
      const sold = productSales[pid];
      const rev = productRevenue[pid];
      const revStr = rev >= 1_000_000
        ? (rev / 1_000_000).toFixed(1) + 'M ₫'
        : (rev / 1000).toFixed(0) + 'k ₫';
      return `
        <div class="product-item">
          <div class="product-img">${imgTag}</div>
          <div class="product-info">
            <h4>${name}</h4>
            <p>${category}</p>
          </div>
          <div class="product-stats">
            <span>${sold}</span>
            <span>Đã bán</span>
          </div>
          <div class="product-revenue">
            <span>${revStr}</span>
            <span>Doanh thu</span>
          </div>
        </div>`;
    }).join('');
  }

  // ── Export ──
  document.querySelector('.export-btn')?.addEventListener('click', () => {
    const rows = [['Mã đơn', 'Ngày', 'Khách hàng', 'Tổng tiền', 'Trạng thái'].join(',')];
    orders.forEach(o => {
      rows.push([
        '#' + o.id,
        o.date || '',
        (o.customer || o.shipping?.fullname || '').replace(/,/g, ' '),
        o.total || 0,
        o.status || ''
      ].join(','));
    });
    const blob = new Blob(['﻿' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-' + Date.now() + '.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast('Đã xuất báo cáo');
  });

  function toast(msg) {
    const el = document.createElement('div');
    el.textContent = msg;
    el.className = 'analytics-toast';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }
});
