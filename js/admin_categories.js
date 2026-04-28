document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('.data-table tbody');
    let categories = window.MXStore?.getCategories() || [];

    renderCategories();

    document.querySelector('.btn-add')?.addEventListener('click', () => {
        const newCat = {
            id: 'cat-' + Date.now(),
            name: 'Danh mục mới',
            desc: 'Mô tả',
            qty: 0,
            active: true
        };
        categories.unshift(newCat);
        saveCategories();
        renderCategories();
        showNotice('Đã thêm danh mục mới', 'success');
    });

    function renderCategories() {
        if (!tableBody) return;
        tableBody.innerHTML = categories.map(cat => `
            <tr data-id="${cat.id}">
                <td><span class="cat-name" contenteditable="false">${cat.name}</span></td>
                <td><span class="cat-desc" contenteditable="false">${cat.desc}</span></td>
                <td><span class="cat-qty">${cat.qty}</span></td>
                <td><span class="status-badge ${cat.active ? 'active' : 'inactive'}">${cat.active ? 'Hoạt động' : 'Tạm dừng'}</span></td>
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
            btn.addEventListener('click', () => deleteCategory(i));
        });

        tableBody.querySelectorAll('.btn-toggle').forEach((btn, i) => {
            btn.addEventListener('click', () => toggleActive(i));
        });
    }

    function toggleEdit(row, index) {
        const nameEl = row.querySelector('.cat-name');
        const descEl = row.querySelector('.cat-desc');
        const isEditing = nameEl.contentEditable === 'true';

        if (isEditing) {
            categories[index].name = nameEl.textContent.trim();
            categories[index].desc = descEl.textContent.trim();
            saveCategories();
            showNotice('Đã lưu thay đổi', 'success');
        }

        nameEl.contentEditable = !isEditing;
        descEl.contentEditable = !isEditing;
        nameEl.style.outline = isEditing ? 'none' : '1px dashed #154212';
        descEl.style.outline = isEditing ? 'none' : '1px dashed #154212';
    }

    function deleteCategory(index) {
        if (confirm('Xóa danh mục này?')) {
            categories.splice(index, 1);
            saveCategories();
            renderCategories();
            showNotice('Đã xóa danh mục', 'success');
        }
    }

    function toggleActive(index) {
        categories[index].active = !categories[index].active;
        saveCategories();
        renderCategories();
        showNotice('Đã cập nhật trạng thái', 'success');
    }

    function saveCategories() {
        window.MXStore?.saveCategories(categories);
    }

    function showNotice(message, type = 'info') {
        const notice = document.createElement('div');
        notice.textContent = message;
        notice.style.cssText = `position: fixed; top: 20px; right: 20px; background: ${type === 'success' ? '#154212' : '#1f2937'}; color: white; padding: 10px 14px; border-radius: 8px; z-index: 9999;`;
        document.body.appendChild(notice);
        setTimeout(() => notice.remove(), 2000);
    }
});
