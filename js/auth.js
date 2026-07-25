document.addEventListener("DOMContentLoaded", () => {
    const authScreen = document.getElementById('auth-screen');
    const mainApp = document.getElementById('main-app');
    const btnLogin = document.getElementById('btn-login');
    const btnLogout = document.getElementById('btn-logout');

    // Chặn kiểm tra trạng thái đăng nhập thời gian thực
    auth.onAuthStateChanged((user) => {
        if (user) {
            authScreen.style.display = 'none';
            mainApp.style.display = 'block';
            document.getElementById('user-display-name').innerText = `👤 ${user.email.split('@')[0]}`;
            // Đăng nhập thành công chuyển tiếp lệnh tải kho vật tư
            loadInventoryData();
        } else {
            authScreen.style.display = 'flex';
            mainApp.style.display = 'none';
        }
    });

    // Hàm xử lý nghiệp vụ đăng nhập đăng ký qua Email Mapping
    btnLogin.addEventListener('click', () => {
        const phoneOrEmail = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-pass').value;
        
        if (!phoneOrEmail || !pass) return alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");

        // Ánh xạ nếu nhập số điện thoại thuần thì tự động chuyển đổi sang email hệ thống
        const email = phoneOrEmail.includes('@') ? phoneOrEmail : `${phoneOrEmail}@thientruong.com`;

        auth.signInWithEmailAndPassword(email, pass)
            .catch(err => {
                alert("Sai thông tin đăng nhập hoặc tài khoản không tồn tại!");
                console.error(err);
            });
    });

    btnLogout.addEventListener('click', () => {
        if (confirm("Xác nhận đăng xuất khỏi hệ thống quản lý?")) {
            auth.signOut();
        }
    });
});
