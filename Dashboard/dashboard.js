// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
// import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// // Firebase config
// const firebaseConfig = {
//     apiKey: "AIzaSyAkxeSRcylugPQdhABCFmWmTUYFQ868aDE",
//     authDomain: "abhilasha-fdbc0.firebaseapp.com",
//     projectId: "abhilasha-fdbc0",
//     storageBucket: "abhilasha-fdbc0.firebasestorage.app",
//     messagingSenderId: "11075472828",
//     appId: "1:11075472828:web:ed0a46285d259760f32fb9",
//     measurementId: "G-H49EPQK1PQ"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

// // 🔄 Modular syntax for auth state check
// // onAuthStateChanged(auth, (user) => {
// //     if (!user) {
// //         window.location.href = "../home/home.html"; // Redirect if not logged in
// //     }
// // });

// const token = localStorage.getItem("token");

// if (!token) {
//     window.location.href = "../home/home.html";
// }

// // ✅ Modular logout
// // function loadPage(pageUrl) {
// //     if (pageUrl === "pages/Logout/Logout.html") {
// //         signOut(auth)
// //             .then(() => {
// //                 console.log("User signed out.");
// //                 window.location.href = "../home/home.html"; // Redirect
// //             })
// //             .catch((error) => {
// //                 console.error("Error signing out: ", error);
// //             });
// //     } else {
// //         document.getElementById("mainFrame").src = pageUrl;
// //     }
// // }

// function loadPage(pageUrl) {
//     if (pageUrl === "pages/Logout/Logout.html") {

//         // ✅ Remove token
//         localStorage.removeItem("token");

//         console.log("User logged out");

//         window.location.href = "../home/home.html";

//     } else {
//         document.getElementById("mainFrame").src = pageUrl;
//     }
// }

// // Export or attach to window if needed
// window.loadPage = loadPage;

// ===============================
// 🔐 AUTH CHECK (Cognito)
// ===============================
const token = localStorage.getItem("idToken"); // ✅ NO JSON.parse

if (!token) {
    console.log("❌ No token found");
    window.location.href = "../Login/login.html";
} else {
    console.log("✅ User authenticated");
}

// ===============================
// 📄 LOAD PAGE IN IFRAME
// ===============================
function loadPage(pageUrl) {
    document.getElementById("mainFrame").src = pageUrl;
}

// ===============================
// 🚪 LOGOUT FUNCTION
// ===============================
function logout() {
    localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");

    console.log("🚪 User logged out");

    window.location.href = "../Login/login.html";
}

// ===============================
// 🌍 MAKE GLOBAL
// ===============================
window.loadPage = loadPage;
window.logout = logout;