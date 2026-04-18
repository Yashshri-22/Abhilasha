import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// 🔥 Firebase (ONLY for DB)
const firebaseConfig = {
  apiKey: "AIzaSyAkxeSRcylugPQdhABCFmWmTUYFQ868aDE",
  authDomain: "abhilasha-fdbc0.firebaseapp.com",
  projectId: "abhilasha-fdbc0",
  storageBucket: "abhilasha-fdbc0.firebasestorage.app",
  messagingSenderId: "11075472828",
  appId: "1:11075472828:web:ed0a46285d259760f32fb9",
  measurementId: "G-H49EPQK1PQ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===============================
// 🔐 COGNITO AUTH CHECK
// ===============================
function parseJwt(token) {
  return JSON.parse(atob(token.split(".")[1]));
}

const token = localStorage.getItem("idToken");

// ❌ Not logged in
if (!token) {
  window.location.href = "../../Login/login.html";
}

// ❌ Expired / invalid token check
let decoded;

try {
  decoded = parseJwt(token);

  const currentTime = Math.floor(Date.now() / 1000);

  if (decoded.exp < currentTime) {
    localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");
    window.location.href = "../../Login/login.html";
  }
} catch (e) {
  localStorage.removeItem("idToken");
  window.location.href = "../../Login/login.html";
}

// ✅ USER IDENTIFICATION (Cognito)
const currentUserId = decoded.sub;

// ✅ UNIQUE STORAGE KEY PER USER
const key = `progressData_${currentUserId}`;

// ===============================
// 🚀 INIT
// ===============================
window.addEventListener("DOMContentLoaded", function () {
  initializeProgressTracking();
  initializeEventListeners();
  updateProgressBar();
});

// ===============================
// 📊 PROGRESS TRACKING
// ===============================
function initializeProgressTracking() {
  let progressData = JSON.parse(localStorage.getItem(key));

  if (!progressData) {
    progressData = {
      personal: false,
      education: false,
      document: false,
      bank: false,
      divyang: false,
      question: false,
    };
    localStorage.setItem(key, JSON.stringify(progressData));
  }
}

function updateProgressBar() {
  const progressData = JSON.parse(localStorage.getItem(key)) || {};

  const totalSections = [
    "personal",
    "education",
    "document",
    "bank",
    "divyang",
    "question",
  ];

  totalSections.forEach((section) => {
    if (!(section in progressData)) {
      progressData[section] = false;
    }
  });

  localStorage.setItem(key, JSON.stringify(progressData));

  const completedSections = totalSections.filter(
    (section) => progressData[section]
  );

  const progress = Math.round(
    (completedSections.length / totalSections.length) * 100
  );

  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  if (progressBar && progressText) {
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Profile Completion: ${progress}%`;
  }
}

function markSectionAsComplete(section) {
  const progressData = JSON.parse(localStorage.getItem(key)) || {};

  if (!progressData[section]) {
    progressData[section] = true;
    localStorage.setItem(key, JSON.stringify(progressData));
    updateProgressBar();
  }
}

// ===============================
// 🔄 RESET PROFILE
// ===============================
function resetProfile() {
  if (!confirm("Are you sure you want to reset your profile?")) return;

  const userDocRef = doc(db, "users", currentUserId);

  getDoc(userDocRef)
    .then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();

        const updatedData = {
          email: data.email || "",
          appliedSchemes: data.appliedSchemes || [],
          cancelledSchemes: data.cancelledSchemes || [],
          personalDetails: null,
          bankDetails: null,
          divyangDetails: null,
          education: {
            primary: null,
            secondary: null,
            graduate: null,
            postgraduate: null,
          },
          questions: null,
        };

        return setDoc(userDocRef, updatedData);
      }
    })
    .then(() => {
      localStorage.removeItem(key);
      location.reload();
    })
    .catch((error) => {
      console.error("Error resetting Firestore:", error);
    });
}

// ===============================
// 🎯 EVENTS
// ===============================
function initializeEventListeners() {
  // section completion (from iframes)
  window.addEventListener("message", function (event) {
    if (event.data && event.data.section) {
      markSectionAsComplete(event.data.section);
    }
  });

  // accordion toggle
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", function () {
      const details = this.querySelector(".details");
      const toggleIcon = this.querySelector(".toggle-icon");

      if (details.style.display === "block") {
        details.style.display = "none";
        toggleIcon.textContent = "+";
      } else {
        document
          .querySelectorAll(".details")
          .forEach((section) => (section.style.display = "none"));

        document
          .querySelectorAll(".toggle-icon")
          .forEach((icon) => (icon.textContent = "+"));

        details.style.display = "block";
        toggleIcon.textContent = "-";
      }
    });
  });

  // reset button
  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetProfile);
  }
}