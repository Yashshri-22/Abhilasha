// import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js'
// // Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyAkxeSRcylugPQdhABCFmWmTUYFQ868aDE",
//     authDomain: "abhilasha-fdbc0.firebaseapp.com",
//     projectId: "abhilasha-fdbc0",
//     storageBucket: "abhilasha-fdbc0.firebasestorage.app",
//     messagingSenderId: "11075472828",
//     appId: "1:11075472828:web:ed0a46285d259760f32fb9",
//     measurementId: "G-H49EPQK1PQ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth(app)
// const email = document.getElementById("email");
// const password = document.getElementById("password");
// const loginButton = document.getElementById("loginButton");

// // check if user is already logged in
// const currentUser = localStorage.getItem("currentUser");
// if (currentUser) {
//     const user = JSON.parse(currentUser);
//     console.log("User is already logged in:", user);
//     // Redirect to the dashboard or another page
//     window.location.href = "../Dashboard/dashboard.html"; // Change this to your dashboard URL
// }

// AWS.config.region = "eu-north-1";

// const poolData = {
//   UserPoolId: "eu-north-1_2YoaxqS9G",
//   ClientId: "1s0pgiv0d2scjc3tgrpr7jasqh",
// };

// const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// loginButton.addEventListener("click", async (e) => {
//   e.preventDefault();
//   const emailValue = email.value.trim();
//   const passwordValue = password.value.trim();

//   if (!emailValue || !passwordValue) {
//     alert("Please fill in both email and password fields.");
//     return;
//   }

//   try {
//     const result = await loginUser(emailValue, passwordValue);
//     if (result.success) {
//       alert("Login successful");
//       localStorage.setItem("token", result.token); // Store user details in local storage
//       // Redirect to the dashboard or another page
//       // window.location.href = "../Dashboard/dashboard.html"; // Change this to your dashboard URL
//       if (emailValue === "admin@gmail.com") {
//         window.location.href = "../Admin_Dashboard/admin_dashboard.html";
//       } else {
//         window.location.href = "../Dashboard/dashboard.html";
//       }
//     }
//   } catch (error) {
//     alert(`Login failed: ${error.message}`);
//   }
// });

// const signIn = async (email, password) => {
//     try {
//         // Sign in the user with email and password
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         console.log("User signed in:", userCredential.user);
//         return userCredential.user;
//     } catch (error) {
//         const errorCode = error.code;
//         const errorMessage = error.message;

//         if (errorCode === "auth/user-not-found") {
//             alert("No user found with this email.");
//         } else if (errorCode === "auth/wrong-password") {
//             alert("Incorrect password. Please try again.");
//         } else if (errorCode === "auth/invalid-email") {
//             alert("Invalid email format.");
//         } else {
//             alert("An unexpected error occurred. Please try again later.");
//         }

//         console.error("Error signing in:", errorCode, errorMessage);
//         throw new Error(errorMessage);
//     }
// };

// const loginUser = async (email, password) => {
//   try {
//     const response = await fetch("http://localhost:3000/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await response.json();
//     return data;

//   } catch (error) {
//     console.error("Login API error:", error);
//     return {
//       success: false,
//       message: "Server error",
//     };
//   }
// };

// ===============================
// 🔥 CONFIGURE COGNITO
// ===============================
AWS.config.region = "eu-north-1";

const poolData = {
  UserPoolId: "eu-north-1_helCUhBlp", // ✅ your pool id
  ClientId: "mhpn6e3ip48mpua0chl7a2or3", // ✅ your client id
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// ===============================
// 🔥 DOM ELEMENTS
// ===============================
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");

// ===============================
// 🔥 LOGIN EVENT
// ===============================
loginButton.addEventListener("click", function (e) {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  loginUser(email, password);
});

// ===============================
// 🔐 LOGIN FUNCTION (COGNITO)
// ===============================
function loginUser(email, password) {
  const authenticationData = {
    Username: email,
    Password: password,
  };

  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData,
  );

  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    // ===============================
    // ✅ SUCCESS
    // ===============================
    onSuccess: function (result) {
      const idToken = result.getIdToken().getJwtToken();
      const accessToken = result.getAccessToken().getJwtToken();

      console.log("✅ Login success");
      console.log("Token:", idToken);

      // 🔥 STORE TOKENS
      localStorage.setItem("idToken", JSON.stringify(idToken));
      localStorage.setItem("accessToken", accessToken);

      alert("Login successful 🚀");

      // 🔥 DELAYED REDIRECT (prevents race condition)
      setTimeout(() => {
        window.location.href = "../Dashboard/dashboard.html"; 
      }, 500);
    },

    // ===============================
    // ❌ FAILURE
    // ===============================
    onFailure: function (err) {
      console.error("Login error:", err);

      if (err.code === "UserNotFoundException") {
        alert("User not found");
      } else if (err.code === "NotAuthorizedException") {
        alert("Incorrect email or password");
      } else if (err.code === "UserNotConfirmedException") {
        alert("User not confirmed");
      } else {
        alert("Login failed: " + err.message);
      }
    },
  });
}
