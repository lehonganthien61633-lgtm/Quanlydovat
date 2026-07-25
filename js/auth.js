document.addEventListener("DOMContentLoaded", () => {
    const authScreen = document.getElementById('auth-screen');
    const mainApp = document.getElementById('main-app');
    
    // Các phần tử Box điều hướng
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');
    const forgotBox = document.getElementById('forgot-box');

    // Theo dõi trạng thái đăng nhập hệ thống real-time
    auth.onAuthStateChanged((user) => {
        if (user) {
            authScreen.style.display = 'none';
            mainApp.style.display = 'block';
            document.getElementById('user-display-name').innerText = `👤 ${user.email}`;
            loadInventoryData(); // Kích hoạt tải kho đồ vật từ inventory.js
        } else {
            authScreen.style.display = 'flex';
            mainApp.style.display = 'none';
            switchAuthView('login');
        }
    });

    // Hàm chuyển đổi qua lại giữa các màn hình Auth
    window.switchAuthView = function(view) {
        loginBox.style.display = view === 'login' ? 'block' : 'none';
        registerBox.style.display = view === 'register' ? 'block' : 'none';
        forgotBox.style.display = view === 'forgot' ? 'block' : 'none';
    };

    // 1. Xử lý ĐĂNG NHẬP
    document.getElementById('btn-login').addEventListener('click', () => {
        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-pass').value;

        if (!email || !pass) return alert("Vui lòng nhập đầy đủ Email và Mật khẩu!");

        auth.signInWithEmailAndPassword(email, pass)
            .catch(err => {
                console.error(err);
                alert("Đăng nhập thất bại: Sai tài khoản hoặc mật khẩu!");
            });
    });

    // 2. Xử lý ĐĂNG KÝ
    document.getElementById('btn-register').addEventListener('click', () => {
        const email = document.getElementById('reg-email').value.trim();
        const pass = document.getElementById('reg-pass').value;
        const confirmPass = document.getElementById('reg-confirm-pass').value;

        if (!email || !pass || !confirmPass) return alert("Vui lòng điền đầy đủ các trường thông tin!");
        if (pass.length < 6) return alert("Mật khẩu bảo mật phải có độ dài tối thiểu từ 6 ký tự!");
        if (pass !== confirmPass) return alert("Xác nhận mật khẩu mới không trùng khớp!");

        auth.createUserWithEmailAndPassword(email, pass)
            .then((userCredential) => {
                alert("Đăng ký tài khoản thành công! Hệ thống đang tự động đăng nhập...");
            })
            .catch(err => {
                console.error(err);
                if (err.code === 'auth/email-already-in-use') {
                    alert("Địa chỉ email này đã được đăng ký bởi một tài khoản khác!");
                } else {
                    alert("Lỗi đăng ký: " + err.message);
                }
            });
    });

    // 3. Xử lý QUÊN MẬT KHẨU
    document.getElementById('btn-forgot').addEventListener('click', () => {
        const email = document.getElementById('forgot-email').value.trim();

        if (!email) return alert("Vui lòng nhập địa chỉ Email cần khôi phục!");

        auth.sendPasswordResetEmail(email)
            .then(() => {
                alert("Hệ thống đã gửi liên kết đặt lại mật khẩu vào Email của bạn. Vui lòng kiểm tra hộp thư (hoặc thư rác)!");
                switchAuthView('login');
            })
            .catch(err => {
                console.error(err);
                alert("Lỗi yêu cầu khôi phục: " + err.message);
            });
    });

    // 4. Xử lý ĐĂNG XUẤT
    document.getElementById('btn-logout').addEventListener('click', () => {
        if (confirm("Xác nhận đăng xuất khỏi hệ thống quản lý đồ vật?")) {
            auth.signOut();
        }
    });
});
