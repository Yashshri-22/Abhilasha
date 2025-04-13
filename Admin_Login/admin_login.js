import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAkxeSRcylugPQdhABCFmWmTUYFQ868aDE",
    authDomain: "abhilasha-fdbc0.firebaseapp.com",
    projectId: "abhilasha-fdbc0",
    storageBucket: "abhilasha-fdbc0.firebasestorage.app",
    messagingSenderId: "11075472828",
    appId: "1:11075472828:web:ed0a46285d259760f32fb9",
    measurementId: "G-H49EPQK1PQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM elements
const email = document.getElementById("username");
const password = document.getElementById("password");
const loginButton = document.getElementById("loginButton");

// Check if admin is already logged in
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data().role === "admin") {
            // alert("Admin already logged in.");
            window.location.href = "../admin_dashboard/admin_dashboard.html";
        } else {
            await signOut(auth); // Logout non-admin users
        }
    }
});

// Login logic
loginButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (!emailValue || !passwordValue) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, emailValue, passwordValue);
        const user = userCredential.user;

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data().role === "admin") {
            localStorage.setItem("currentAdmin", JSON.stringify(user));
            alert("Login successful.");
            window.location.href = "../admin_dashboard/admin_dashboard.html";
        } else {
            alert("Access denied: Not an admin.");
            await signOut(auth); // Logout non-admin users
        }
    } catch (error) {
        const errorCode = error.code;

        if (errorCode === "auth/user-not-found") {
            alert("No user found with this email.");
        } else if (errorCode === "auth/wrong-password") {
            alert("Incorrect password.");
        } else if (errorCode === "auth/invalid-email") {
            alert("Invalid email format.");
        } else if (errorCode === "auth/invalid-login-credentials") {
            alert("Invalid login credentials. Please try again.");
        } else {
            alert("Login failed: " + error.message);
        }

        console.error("Login error:", error);
    }
});
