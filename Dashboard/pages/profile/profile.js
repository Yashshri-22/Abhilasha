import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

window.addEventListener("DOMContentLoaded", function () {
    initializeProgressTracking();
    initializeEventListeners();
    updateProgressBar();
});

const currentUserId = localStorage.getItem("currentUserId"); // Ensure this is set during login/signup
const key = `progressData_${currentUserId}`;

// Initialize progress tracking for all sections
function initializeProgressTracking() {
    let progressData = JSON.parse(localStorage.getItem(key));

    if (!progressData) {
        progressData = {
            personal: false,
            education: false,
            document: false,
            bank: false,
            divyang: false,
            question: false
        };
        localStorage.setItem(key, JSON.stringify(progressData));
        console.log("Initialized progressData in localStorage:", progressData);
    } else {
        console.log("Loaded existing progressData from localStorage:", progressData);
    }

    updateProgressBar();
}

// Update the progress bar based on completed sections
function updateProgressBar() {
    const progressData = JSON.parse(localStorage.getItem(key)) || {};
    console.log("Updating progress bar with progressData:", progressData);

    const totalSections = ["personal", "education", "document", "bank", "divyang", "question"];
    totalSections.forEach(section => {
        if (!(section in progressData)) {
            progressData[section] = false;
        }
    });

    localStorage.setItem(key, JSON.stringify(progressData));
    console.log("Updated progressData in localStorage:", progressData);

    const completedSections = totalSections.filter(section => progressData[section]);
    const progress = Math.round((completedSections.length / totalSections.length) * 100);

    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    if (progressBar && progressText) {
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Profile Completion: ${progress}%`;
    }

    console.log("Progress bar updated. Completed sections:", completedSections.length, "Progress:", progress);
}

// Mark a section as complete and update the progress bar
function markSectionAsComplete(section) {
    const progressData = JSON.parse(localStorage.getItem(key)) || {};
    console.log(`Marking section '${section}' as complete. Current progressData:`, progressData);

    if (!progressData[section]) {
        progressData[section] = true;
        localStorage.setItem(key, JSON.stringify(progressData));
        console.log(`Updated progressData after marking '${section}' as complete:`, progressData);
        updateProgressBar();
    }
}

// Reset the profile, clearing all progress and Firestore data
function resetProfile() {
    if (confirm("Are you sure you want to reset your profile?")) {
        const user = auth.currentUser;

        if (user) {
            const userId = user.uid;
            const userDocRef = doc(db, "users", userId);

            getDoc(userDocRef).then((docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();

                    // Keep only email, appliedSchemes, and cancelledSchemes
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
                            postgraduate: null
                        },
                        questions: null
                    };

                    setDoc(userDocRef, updatedData).then(() => {
                        console.log("Firestore data reset successfully.");
                        location.reload();
                    }).catch((error) => {
                        console.error("Error resetting Firestore data:", error);
                    });
                }
            }).catch((error) => {
                console.error("Error fetching Firestore user data:", error);
            });
        }

        // Reset local progress data
        localStorage.removeItem(key);
        console.log("Removed progressData from localStorage.");
        initializeProgressTracking();

        document.getElementById("progress-bar").style.width = "0%";
        document.getElementById("progress-text").textContent = "Profile Completion: 0%";

        document.querySelectorAll("iframe").forEach(iframe => {
            iframe.contentWindow.location.reload();
        });

        alert("Profile has been reset!");
    }
}

// Same listener logic stays unchanged
function initializeEventListeners() {
    window.addEventListener("message", function (event) {
        if (event.data && event.data.section) {
            markSectionAsComplete(event.data.section);
        }
    });

    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", function () {
            const details = this.querySelector(".details");
            const toggleIcon = this.querySelector(".toggle-icon");

            if (details.style.display === "block") {
                details.style.display = "none";
                toggleIcon.textContent = "+";
            } else {
                document.querySelectorAll(".details").forEach(section => section.style.display = "none");
                document.querySelectorAll(".toggle-icon").forEach(icon => icon.textContent = "+");
                details.style.display = "block";
                toggleIcon.textContent = "-";
            }
        });
    });

    const resetBtn = document.getElementById("reset-btn");
    if (resetBtn) {
        resetBtn.addEventListener("click", resetProfile);
    }
}
