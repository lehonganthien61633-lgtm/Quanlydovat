// Cấu hình lõi kết nối hệ thống Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCwsarwjs4jeLZ259MviLnS_X_-3WOdkCI",
    authDomain: "quanlydovat.firebaseapp.com",
    databaseURL: "https://quanlydovat-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "quanlydovat",
    storageBucket: "quanlydovat.firebasestorage.app",
    messagingSenderId: "1058900872777",
    appId: "1:1058900872777:web:109ae611dbe62e7a457998"
};

// Khởi tạo các dịch vụ Firebase dạng Compat thành công biến toàn cục
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
