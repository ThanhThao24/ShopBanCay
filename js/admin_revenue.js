document.addEventListener('DOMContentLoaded', () => {
  const store = window.MXStore;
  const orders = store?.getOrders() || [];

  // ── KPI cards ──
  const kpiValues = document.querySelectorAll('.kpi-content .kpi-value');
  const kpiTrends = document.querySelectorAll('.kpi-trend');

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const netProfit = Math.round(totalRevenue * 0.35);
  const delivered = orders.filter(o => o.status === 'delivered').length;
  const avgOrder = delivered ? Math.round(totalRevenue / delivered) : 0;

  if (kpiValues[0]) kpiValues[0].textContent = fmt(totalRevenue);
  if (kpiValues[1]) kpiValues[1].textContent = fmt(netProfit);
  if (kpiValues[2]) kpiValues[2].textContent = delivered.toLocaleString('vi-VN');
  if (kpiValues[3]) kpiValues[3].textContent = fmt(avgOrder);

  // Growth % on card 0 trend badge
  const now = new Date();
  const thisM = now.getMonth();
  const lastM = (thisM + 11) % 12;
  const thisMonthRev = orders
    .filter(o => new Date(o.date).getMonth() === thisM)
    .reduce((s, o) => s + (o.total || 0), 0);
  const lastMonthRev = orders
    .filter(o => new Date(o.date).getMonth() === lastM)
    .reduce((s, o) => s + (o.total || 0), 0);
  if (kpiTrends[0]) {
    const pct = lastMonthRev
      ? ((thisMonthRev - lastMonthRev) / lastMonthRev * 100).toFixed(1)
      : '0';
    const span = kpiTrends[0].querySelector('span');
    if (span) span.textContent = (parseFloat(pct) >= 0 ? '+' : '') + pct + '%';
    kpiTrends[0].className = 'kpi-trend ' + (parseFloat(pct) >= 0 ? 'positive' : 'negative');
  }

  // ── Transaction table ──
  const transBody = document.querySelector('.transaction-table-area table tbody');
  if (transBody && orders.length) {
    const statusMap = {
      pending: 'Chờ xác nhận',
      processing: 'Đang xử lý',
      shipping: 'Đang giao',
      delivered: 'Hoàn tất',
      cancelled: 'Đã hủy'
    };
    transBody.innerHTML = orders.slice(0, 20).map(order => {
      const customer = order.customer || order.shipping?.fullname || 'Khách hàng';
      const dateObj = new Date(order.date);
      const dateStr = isNaN(dateObj) ? (order.date || '—') : dateObj.toLocaleDateString('vi-VN');
      const statusText = statusMap[order.status] || order.status || '—';
      return `
        <tr>
          <td>#${order.id}</td>
          <td>${dateStr}</td>
          <td>${customer}</td>
          <td><div><span>—</span></div></td>
          <td>${fmt(order.total)}</td>
          <td><div>${statusText}</div></td>
          <td><button><img src="../assets/figma/55677778-0ee0-4163-96ad-8e0ff09bb2c1.svg" alt="More"></button></td>
        </tr>`;
    }).join('');

    const paginInfo = document.querySelector('.table-pagination > span');
    if (paginInfo) {
      paginInfo.textContent = `Hiển thị 1–${Math.min(20, orders.length)} trong số ${orders.length.toLocaleString('vi-VN')} giao dịch`;
    }
  }

  // ── Search ──
  const searchInput = document.querySelector('.search-wrap input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      document.querySelectorAll('.transaction-table-area table tbody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  // ── Chart period filter ──
  const chartBtns = document.querySelectorAll('.chart-filters button');
  chartBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      chartBtns.forEach((b, j) => {
        b.style.backgroundColor = j === i ? '#154212' : '';
        b.style.color = j === i ? '#fff' : '';
      });
    });
  });
  // Activate first button by default
  if (chartBtns[0]) {
    chartBtns[0].style.backgroundColor = '#154212';
    chartBtns[0].style.color = '#fff';
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
    a.download = 'revenue-' + Date.now() + '.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast('Đã xuất báo cáo doanh thu');
  });

  function fmt(val) {
    return (val || 0).toLocaleString('vi-VN') + '₫';
  }

  function toast(msg) {
    const el = document.createElement('div');
    el.textContent = msg;
    el.className = 'revenue-toast';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }
});
