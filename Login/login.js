import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js'

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const auth = getAuth(app)
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginButton = document.getElementById("loginButton");

// // check if user is already logged in
// const currentUser = localStorage.getItem("currentUser");
// if (currentUser) {
//     const user = JSON.parse(currentUser);
//     console.log("User is already logged in:", user);
//     // Redirect to the dashboard or another page
//     window.location.href = "../Dashboard/dashboard.html"; // Change this to your dashboard URL
// }

loginButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (!emailValue || !passwordValue) {
        alert("Please fill in both email and password fields.");
        return;
    }

    try {
        const result = await signIn(emailValue, passwordValue);
        if (result) {
            alert("Login successful");
            localStorage.setItem("currentUser", JSON.stringify(result)); // Store user details in local storage
            // Redirect to the dashboard or another page
            window.location.href = "../Dashboard/dashboard.html"; // Change this to your dashboard URL
        }
    } catch (error) {
        alert(`Login failed: ${error.message}`);
    }
});

const signIn = async (email, password) => {
    try {
        // Sign in the user with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === "auth/user-not-found") {
            alert("No user found with this email.");
        } else if (errorCode === "auth/wrong-password") {
            alert("Incorrect password. Please try again.");
        } else if (errorCode === "auth/invalid-email") {
            alert("Invalid email format.");
        } else {
            alert("An unexpected error occurred. Please try again later.");
        }

        console.error("Error signing in:", errorCode, errorMessage);
        throw new Error(errorMessage);
    }
};