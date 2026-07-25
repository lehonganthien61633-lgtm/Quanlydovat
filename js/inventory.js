// Hàm đồng bộ hóa dữ liệu thời gian thực từ Realtime Database
function loadInventoryData() {
    const inventoryRef = database.ref('inventory');
    
    inventoryRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const tbody = document.getElementById('inventory-list');
        tbody.innerHTML = '';

        let totalItems = 0;
        let totalQty = 0;

        if (!data) {
            tbody.innerHTML = '<tr><td colspan="8" style="color:#666; font-style:italic;">Hiện tại không có đồ vật nào trong kho lưu trữ...</td></tr>';
            document.getElementById('stat-total-types').innerText = '0';
            document.getElementById('stat-total-qty').innerText = '0';
            return;
        }

        let stt = 1;
        for (let key in data) {
            let item = data[key];
            totalItems++;
            totalQty += (parseInt(item.quantity) || 0);

            // Phân loại badge trạng thái thiết bị đồ vật
            let statusClass = 'status-good';
            if (item.status === 'Bảo trì') statusClass = 'status-warn';
            if (item.status === 'Mất' || item.status === 'Hỏng') statusClass = 'status-danger';

            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${stt++}</td>
                <td style="font-family: monospace; font-weight: bold;">${item.code || '---'}</td>
                <td style="text-align: left; font-weight: bold;">${item.name}</td>
                <td>${item.category}</td>
                <td>${item.location}</td>
                <td><b>${item.quantity}</b></td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
                <td>
                    <button class="btn btn-edit" onclick="openEditModal('${key}', '${item.name}', '${item.category}', '${item.location}', ${item.quantity}, '${item.status}')">Sửa</button>
                    <button class="btn btn-delete" onclick="deleteInventoryItem('${key}')">Xóa</button>
                </td>
            `;
            tbody.appendChild(tr);
        }

        // Cập nhật bảng tổng quan Widget dữ liệu
        document.getElementById('stat-total-types').innerText = totalItems;
        document.getElementById('stat-total-qty').innerText = totalQty;
    });
}

// Logic thực thi các chức năng CRUD cơ bản của đồ vật
function openAddModal() {
    document.getElementById('modal-title').innerText = "Thêm Đồ Vật Mới";
    document.getElementById('item-key').value = "";
    document.getElementById('item-name').value = "";
    document.getElementById('item-category').value = "Điện tử";
    document.getElementById('item-location').value = "Kho chính";
    document.getElementById('item-quantity').value = "1";
    document.getElementById('item-status').value = "Tốt";
    document.getElementById('item-modal').style.display = 'flex';
}

function openEditModal(key, name, category, location, quantity, status) {
    document.getElementById('modal-title').innerText = "Chỉnh Sửa Thông Tin Đồ Vật";
    document.getElementById('item-key').value = key;
    document.getElementById('item-name').value = name;
    document.getElementById('item-category').value = category;
    document.getElementById('item-location').value = location;
    document.getElementById('item-quantity').value = quantity;
    document.getElementById('item-status').value = status;
    document.getElementById('item-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('item-modal').style.display = 'none';
}

function saveInventoryItem() {
    const key = document.getElementById('item-key').value;
    const name = document.getElementById('item-name').value.trim();
    const category = document.getElementById('item-category').value;
    const location = document.getElementById('item-location').value.trim();
    const quantity = parseInt(document.getElementById('item-quantity').value) || 1;
    const status = document.getElementById('item-status').value;

    if (!name || !location) return alert("Vui lòng nhập tên đồ vật và vị trí lưu trữ!");

    const itemData = { name, category, location, quantity, status };

    if (key === "") {
        // Thêm mới sinh mã Auto định danh ngẫu nhiên ngắn gọn
        itemData.code = 'TT-' + Math.floor(1000 + Math.random() * 9000);
        database.ref('inventory').push(itemData)
            .then(() => { closeModal(); })
            .catch(err => alert("Lỗi ghi dữ liệu: " + err.message));
    } else {
        // Cập nhật ghi đè giữ nguyên mã thiết bị đồ vật cũ
        database.ref('inventory/' + key).once('value').then(snapshot => {
            const currentItem = snapshot.val();
            itemData.code = currentItem.code || ('TT-' + Math.floor(1000 + Math.random() * 9000));
            database.ref('inventory/' + key).set(itemData)
                .then(() => { closeModal(); })
                .catch(err => alert("Lỗi cập nhật: " + err.message));
        });
    }
}

function deleteInventoryItem(key) {
    if (confirm("Bạn có chắc chắn muốn xóa vĩnh viễn dữ liệu đồ vật này khỏi phần mềm kho?")) {
        database.ref('inventory/' + key).remove();
    }
}

// Logic bộ lọc tìm kiếm đồ vật thời gian thực (Real-time Search Filter)
function filterInventory() {
    const keyword = document.getElementById('search-item').value.toUpperCase();
    const rows = document.querySelectorAll('#inventory-list tr');

    rows.forEach(row => {
        if(row.cells.length < 3) return; 
        const nameText = row.cells[2].textContent.toUpperCase();
        const codeText = row.cells[1].textContent.toUpperCase();
        const locText = row.cells[4].textContent.toUpperCase();

        if (nameText.includes(keyword) || codeText.includes(keyword) || locText.includes(keyword)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}
