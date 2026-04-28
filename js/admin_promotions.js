document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('.data-table tbody');
    let promotions = window.MXStore?.getPromotions() || [];

    renderPromotions();

    document.querySelector('.btn-add')?.addEventListener('click', () => {
        const newPromo = {
            id: 'promo-' + Date.now(),
            code: 'NEW' + Math.floor(Math.random() * 100),
            name: 'Khuyến mãi mới',
            type: 'percent',
            value: 10,
            status: 'running',
            usage: 0,
            usageMax: 100
        };
        promotions.unshift(newPromo);
        savePromotions();
        renderPromotions();
        showNotice('Đã thêm mã khuyến mãi', 'success');
    });

    function renderPromotions() {
        if (!tableBody) return;
        tableBody.innerHTML = promotions.map(promo => `
            <tr data-id="${promo.id}">
                <td><span class="promo-code" contenteditable="false">${promo.code}</span></td>
                <td><span class="promo-name" contenteditable="false">${promo.name}</span></td>
                <td><span class="promo-value" contenteditable="false">${promo.value}${promo.type === 'percent' ? '%' : 'đ'}</span></td>
                <td><span class="promo-usage">${promo.usage}/${promo.usageMax}</span></td>
                <td><span class="status-badge ${promo.status === 'running' ? 'active' : 'inactive'}">${promo.status === 'running' ? 'Đang chạy' : 'Tạm dừng'}</span></td>
                <td class="actions">
                    <button class="btn-edit" title="Sửa">✏️</button>
                    <button class="btn-delete" title="Xóa">🗑️</button>
                    <button class="btn-toggle" title="Bật/Tắt">🔄</button>
                </td>
            </tr>
        `).join('');

        tableBody.querySelectorAll('.btn-edit').forEach((btn, i) => {
            btn.addEventListener('click', () => toggleEdit(btn.closest('tr'), i));
        });

        tableBody.querySelectorAll('.btn-delete').forEach((btn, i) => {
            btn.addEventListener('click', () => deletePromo(i));
        });

        tableBody.querySelectorAll('.btn-toggle').forEach((btn, i) => {
            btn.addEventListener('click', () => toggleStatus(i));
        });
    }

    function toggleEdit(row, index) {
        const codeEl = row.querySelector('.promo-code');
        const nameEl = row.querySelector('.promo-name');
        const valueEl = row.querySelector('.promo-value');
        const isEditing = codeEl.contentEditable === 'true';

        if (isEditing) {
            promotions[index].code = codeEl.textContent.trim().toUpperCase();
            promotions[index].name = nameEl.textContent.trim();
            const valueText = valueEl.textContent.replace(/[^\d]/g, '');
            promotions[index].value = parseInt(valueText) || 0;
            savePromotions();
            showNotice('Đã lưu thay đổi', 'success');
        }

        [codeEl, nameEl, valueEl].forEach(el => {
            el.contentEditable = !isEditing;
            el.style.outline = isEditing ? 'none' : '1px dashed #154212';
        });
    }

    function deletePromo(index) {
        if (confirm('Xóa mã khuyến mãi này?')) {
            promotions.splice(index, 1);
            savePromotions();
            renderPromotions();
            showNotice('Đã xóa mã khuyến mãi', 'success');
        }
    }

    function toggleStatus(index) {
        promotions[index].status = promotions[index].status === 'running' ? 'paused' : 'running';
        savePromotions();
        renderPromotions();
        showNotice('Đã cập nhật trạng thái', 'success');
    }

    function savePromotions() {
        window.MXStore?.savePromotions(promotions);
    }

    function showNotice(message, type = 'info') {
        const notice = document.createElement('div');
        notice.textContent = message;
        notice.style.cssText = `position: fixed; top: 20px; right: 20px; background: ${type === 'success' ? '#154212' : '#1f2937'}; color: white; padding: 10px 14px; border-radius: 8px; z-index: 9999;`;
        document.body.appendChild(notice);
        setTimeout(() => notice.remove(), 2000);
    }
});
