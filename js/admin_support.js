document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'mamxanh_support';
    const tableBody = document.querySelector('.data-table tbody');
    
    let tickets = loadTickets();
    renderTickets();

    function loadTickets() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) return JSON.parse(stored);
        } catch {}
        
        return [
            { id: 'SUP-001', customer: 'Nguyễn Văn A', email: 'a@example.com', subject: 'Hỏi về giao hàng', message: 'Đơn hàng của tôi đến khi nào?', status: 'pending', date: '2026-04-27' },
            { id: 'SUP-002', customer: 'Trần Thị B', email: 'b@example.com', subject: 'Cây bị héo', message: 'Cây tôi mua bị héo lá', status: 'resolved', date: '2026-04-26' }
        ];
    }

    function saveTickets() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    }

    function renderTickets() {
        if (!tableBody) return;
        tableBody.innerHTML = tickets.map((ticket, i) => `
            <tr data-id="${ticket.id}">
                <td>${ticket.id}</td>
                <td>${ticket.customer}</td>
                <td>${ticket.subject}</td>
                <td><span class="status-badge ${ticket.status === 'resolved' ? 'resolved' : 'pending'}">${ticket.status === 'resolved' ? 'Đã xử lý' : 'Chờ xử lý'}</span></td>
                <td>${ticket.date}</td>
                <td class="actions">
                    <button class="btn-view" data-index="${i}" title="Xem">👁️</button>
                    <button class="btn-reply" data-index="${i}" title="Trả lời">💬</button>
                    <button class="btn-resolve" data-index="${i}" title="Đánh dấu xử lý">✅</button>
                </td>
            </tr>
        `).join('');

        tableBody.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', () => viewTicket(parseInt(btn.dataset.index)));
        });

        tableBody.querySelectorAll('.btn-reply').forEach(btn => {
            btn.addEventListener('click', () => replyTicket(parseInt(btn.dataset.index)));
        });

        tableBody.querySelectorAll('.btn-resolve').forEach(btn => {
            btn.addEventListener('click', () => resolveTicket(parseInt(btn.dataset.index)));
        });
    }

    function viewTicket(index) {
        const ticket = tickets[index];
        alert(`${ticket.subject}\n\nTừ: ${ticket.customer} (${ticket.email})\n\n${ticket.message}`);
    }

    function replyTicket(index) {
        const ticket = tickets[index];
        const reply = prompt(`Trả lời cho ${ticket.customer}:`);
        if (reply) {
            ticket.reply = reply;
            ticket.status = 'resolved';
            saveTickets();
            renderTickets();
            showNotice('Đã gửi phản hồi', 'success');
        }
    }

    function resolveTicket(index) {
        tickets[index].status = tickets[index].status === 'resolved' ? 'pending' : 'resolved';
        saveTickets();
        renderTickets();
        showNotice('Đã cập nhật trạng thái', 'success');
    }

    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.textContent.toLowerCase();
            const rows = tableBody.querySelectorAll('tr');
            
            rows.forEach(row => {
                if (filter === 'tất cả') {
                    row.style.display = '';
                } else {
                    const status = row.querySelector('.status-badge').textContent.toLowerCase();
                    row.style.display = status.includes(filter) ? '' : 'none';
                }
            });
        });
    });

    function showNotice(message, type = 'info') {
        const notice = document.createElement('div');
        notice.textContent = message;
        notice.style.cssText = `position: fixed; top: 20px; right: 20px; background: ${type === 'success' ? '#154212' : '#1f2937'}; color: white; padding: 10px 14px; border-radius: 8px; z-index: 9999;`;
        document.body.appendChild(notice);
        setTimeout(() => notice.remove(), 2000);
    }
});
