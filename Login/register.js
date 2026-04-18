// import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
// import {
//     getFirestore,
//     doc,
//     setDoc
// } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// // Firebase configuration
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
// const auth = getAuth(app);
// const emailField = document.getElementById("email");
// const passwordField = document.getElementById("password");
// const confirmPasswordField = document.getElementById("confirm-password");
// const formError = document.getElementById("form-error");
// const registerButton = document.getElementById("registerButton");
// const db = getFirestore(app);

// document.addEventListener("DOMContentLoaded", function () {
//     const registerForm = document.getElementById("register-section");

//     if (registerForm) {

//         // Show password constraints on focus of password field
//         passwordField.addEventListener("focus", function () {
//             formError.textContent = "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
//             formError.style.color = "red";
//         });

//         // Validate password constraints on input
//         passwordField.addEventListener("input", function () {
//             const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//             if (passwordRegex.test(passwordField.value)) {
//                 formError.textContent = "Password meets all constraints.";
//                 formError.style.color = "green";
//             } else {
//                 formError.textContent = "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
//                 formError.style.color = "red";
//             }
//         });

//         // Show password match message on focus of confirm password field
//         confirmPasswordField.addEventListener("focus", function () {
//             if (passwordField.value !== confirmPasswordField.value) {
//                 formError.textContent = "Passwords do not match!";
//                 formError.style.color = "red";
//             } else if (passwordField.value) {
//                 formError.textContent = "Passwords match.";
//                 formError.style.color = "green";
//             }
//         });

//         // Live check for password match
//         confirmPasswordField.addEventListener("input", function () {
//             if (passwordField.value !== confirmPasswordField.value) {
//                 formError.textContent = "Passwords do not match!";
//                 formError.style.color = "red";
//             } else {
//                 formError.textContent = "Passwords match.";
//                 formError.style.color = "green";
//             }
//         });

//         registerForm.addEventListener("submit", async function (event) {
//             event.preventDefault();

//             const email = emailField.value.trim();
//             const password = passwordField.value;
//             const confirmPassword = confirmPasswordField.value;

//             formError.textContent = ""; // Clear old errors

//             // Validate Email
//             if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//                 formError.textContent = "Invalid email format.";
//                 formError.style.color = "red";
//                 return;
//             }

//             // Validate Password Strength
//             const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//             if (!passwordRegex.test(password)) {
//                 formError.textContent = "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
//                 formError.style.color = "red";
//                 return;
//             }

//             // Check if Passwords Match
//             if (password !== confirmPassword) {
//                 formError.textContent = "Passwords do not match!";
//                 formError.style.color = "red";
//                 return;
//             }

//             // If all validations pass
//             try {
//                 const result = await registerUser(email, password);
//                 if (result) {
//                     alert("Registration Successful!");
//                     // window.location.href = "../Login/login.html";
//                 } else {
//                     formError.textContent = "Registration failed. Please try again.";
//                     formError.style.color = "red";
//                 }
//             } catch (error) {
//                 formError.textContent = "An error occurred. Please try again later.";
//                 formError.style.color = "red";
//             }
//         });
//     }
// });

// registerButton.addEventListener("click", async (e) => {
//     e.preventDefault();
//     const emailValue = emailField.value.trim();
//     const passwordValue = passwordField.value.trim();

//     if (!emailValue || !passwordValue) {
//         alert("Please fill in both email and password fields.");
//         return;
//     }

//     try {
//         const result = await registerUser(emailValue, passwordValue);
//         if (result) {
//             alert("Registration successful");
//             localStorage.setItem("currentUser", JSON.stringify(result)); // Store user details in local storage
//             // Redirect to the dashboard or another page
//             window.location.href = "../Dashboard/dashboard.html"; // Change this to your dashboard URL
//         }
//     } catch (error) {
//         alert(`Registration failed: ${error.message}`);
//     }
// });

// // Function to register user using Firebase
// const registerUser = async (email, password) => {
//     try {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         // Create user doc in Firestore
//         const userDocRef = doc(db, "users", user.uid);
//         await setDoc(userDocRef, {
//             email: user.email,
//             personalDetails: null,
//             bankDetails: null,
//             divyangDetails: null,
//             education: {
//                 primary: null,
//                 secondary: null,
//                 graduate: null,
//                 postgraduate: null
//             },
//             questions: null,
//             appliedSchemes: [],
//             cancelledSchemes: []
//         });

//         console.log("✅ Firestore user profile created");
//         return user;
//     } catch (error) {
//         console.error("Error registering user:", error.code, error.message);
//         return null;
//     }
// };

AWS.config.region = "eu-north-1";

const poolData = {
  UserPoolId: "eu-north-1_helCUhBlp",
  ClientId: "mhpn6e3ip48mpua0chl7a2or3",
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

document.addEventListener("DOMContentLoaded", function () {
  const emailField = document.getElementById("email");
  const passwordField = document.getElementById("password");
  const confirmPasswordField = document.getElementById("confirm-password");
  const formError = document.getElementById("form-error");
  const registerButton = document.getElementById("registerButton");
  const registerForm = document.getElementById("register-section");

  if (registerForm) {
    // Password UI
    passwordField.addEventListener("input", function () {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

      if (passwordRegex.test(passwordField.value)) {
        formError.textContent = "✅ Strong password";
        formError.style.color = "green";
      } else {
        formError.textContent = "❌ Weak password";
        formError.style.color = "red";
      }
    });

    confirmPasswordField.addEventListener("input", function () {
      if (passwordField.value !== confirmPasswordField.value) {
        formError.textContent = "❌ Passwords do not match!";
        formError.style.color = "red";
      } else {
        formError.textContent = "✅ Passwords match";
        formError.style.color = "green";
      }
    });

    // 🚀 FORM SUBMIT
    registerForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = emailField.value.trim();
      const password = passwordField.value;
      const confirmPassword = confirmPasswordField.value;

      formError.textContent = "";

      // Validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formError.textContent = "Invalid email format.";
        return;
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

      if (!passwordRegex.test(password)) {
        formError.textContent = "Weak password.";
        return;
      }

      if (password !== confirmPassword) {
        formError.textContent = "Passwords do not match!";
        return;
      }

      try {
        const result = await registerUser(email, password);

        if (result.success) {
          alert("🎉 Registration Successful!");
          window.location.href = "../Login/login.html";
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error(error);
        alert("Something went wrong");
      }
    });
  }

  // 🌐 API CALL FUNCTION (REPLACES FIREBASE)
  // async function registerUser(email, password) {
  //     try {
  //         const response = await fetch("http://localhost:3000/register", {
  //             method: "POST",
  //             headers: {
  //                 "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({ email, password }),
  //         });

  //         const data = await response.json();
  //         return data;

  //     } catch (error) {
  //         console.error("API Error:", error);
  //         return {
  //             success: false,
  //             message: "Server error",
  //         };
  //     }
  // }

  function registerUser(email, password) {
    return new Promise((resolve, reject) => {
      const attributeList = [];

      const dataEmail = {
        Name: "email",
        Value: email,
      };

      const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(
        dataEmail,
      );
      attributeList.push(attributeEmail);

      userPool.signUp(
        email,
        password,
        attributeList,
        null,
        function (err, result) {
          if (err) {
            reject({
              success: false,
              message: err.message,
            });
          } else {
            resolve({
              success: true,
            });
          }
        },
      );
    });
  }

  function confirmUser(email, code) {
    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(code, true, function (err, result) {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
});
