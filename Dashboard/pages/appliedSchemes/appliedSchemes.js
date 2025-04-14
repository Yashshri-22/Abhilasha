import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Array of schemes
const schemes = [
    { id: 1, name: "Sanjay Gandhi Niradhar Anudan Yojana", desc: "Monthly financial assistance to needy disabled persons.", pdf: "scheme1.pdf" },
    { id: 2, name: "Swavalamban Yojana (Self-employment Scheme)", desc: "Financial support for self-employment ventures.", pdf: "scheme2.pdf" },
    { id: 3, name: "Housing Scheme for Disabled (under PMAY / State Govt)", desc: "Allotment of affordable housing units.", pdf: "scheme3.pdf" },
    { id: 4, name: "Free Travel Concession Scheme (MSRTC)", desc: "Free or concessional travel for disabled persons in state transport buses.", pdf: "scheme4.pdf" },
    { id: 5, name: "Scholarship Scheme for Disabled Students", desc: "Financial assistance for school/college-going disabled students.", pdf: "scheme5.pdf" },
    { id: 6, name: "Niramaya Health Insurance Scheme", desc: "Health insurance coverage for persons with developmental disabilities.", pdf: "scheme6.pdf" },
    { id: 7, name: "Skill Development Training Scheme for PWDs", desc: "Free vocational training programs in various trades.", pdf: "scheme7.pdf" },
    { id: 8, name: "Assistance for Purchase of Assistive Devices", desc: "Financial support for purchasing prosthetic devices and other assistive aids.", pdf: "scheme8.pdf" },
    { id: 9, name: "Free Bus Pass Scheme", desc: "Free or concessional travel for disabled individuals in PMPML buses.​", pdf: "scheme9.pdf" },
    { id: 10, name: "Financial Assistance for 75% or More Permanent Disability", desc: "One-time financial assistance for workers with significant disabilities.​", pdf: "scheme10.pdf" }
];

// Example remarks data for each scheme
const remarksData = {
    1: [
        { remark: "Documents verified", sentBy: "Dept. Clerk", date: "2025-03-10" },
        { remark: "Approved by committee", sentBy: "Admin Officer", date: "2025-03-12" }
    ],
    2: [
        { remark: "Application under review", sentBy: "Dept. Clerk", date: "2025-03-11" }
    ],
    3: [
        { remark: "Application incomplete", sentBy: "Review Team", date: "2025-03-09" }
    ]
};

// Function to fetch applied schemes from Firestore and populate the table
async function loadAppliedSchemes() {
    const loader = document.getElementById("loader");
    const tableBody = document.getElementById("appliedSchemesTable");

    // Show loader
    loader.classList.remove("hidden");

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const appliedSchemes = userData.appliedSchemes || [];

                tableBody.innerHTML = ""; // Clear existing rows

                appliedSchemes.forEach((appliedScheme, index) => {
                    const scheme = schemes.find(s => s.id === appliedScheme.id);
                    if (scheme) {
                        let row = `
                            <tr>
                                <td class="view">${index + 1}</td>
                                <td>${scheme.name}</td>
                                <td>${scheme.desc}</td>
                                <td class="view">
                                    <button id="status-btn" onclick="openDialog(${scheme.id})">Check Status</button>
                                </td>
                                <td class="view">
                                    <button id="cancel-btn" onclick="cancelScheme(${scheme.id})">Cancel</button>
                                </td>
                            </tr>
                        `;
                        tableBody.innerHTML += row;
                    }
                });
            } else {
                console.error("User document not found in Firestore.");
                alert("No applied schemes found.");
            }
        } else {
            alert("User not logged in.");
        }

        // Hide loader after data is loaded
        loader.classList.add("hidden");
    });
}

// Function to open the status dialog and populate remarks
function openDialog(schemeId) {
    const statusTable = document.getElementById("statusTable");
    statusTable.innerHTML = ""; // Clear previous data

    if (remarksData[schemeId]) {
        remarksData[schemeId].forEach(entry => {
            let row = `
                <tr>
                    <td>${entry.remark}</td>
                    <td>${entry.sentBy}</td>
                    <td>${entry.date}</td>
                </tr>
            `;
            statusTable.innerHTML += row;
        });
    }

    const dialog = document.getElementById("statusDialog");
    dialog.style.display = "flex"; // Show dialog

    // Center the dialog
    const content = document.querySelector(".dialog-content");
    content.style.transform = "scale(1)"; // Ensure it's fully visible
}

// Function to close the dialog
function closeDialog() {
    const dialog = document.getElementById("statusDialog");
    dialog.style.display = "none"; // Hide dialog
}

// Function to cancel a scheme
async function cancelScheme(schemeId) {
    const user = auth.currentUser;
    if (!user) {
        alert("User not logged in.");
        return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
        console.error("Error: User document not found in Firestore.");
        alert("User data not found. Please try again.");
        return;
    }

    const userData = userDocSnap.data();
    const appliedSchemes = userData.appliedSchemes || [];
    const cancelledSchemes = userData.cancelledSchemes || [];

    // Find the scheme to cancel
    const schemeToCancel = appliedSchemes.find(scheme => scheme.id === schemeId);
    if (!schemeToCancel) {
        alert("Scheme not found in applied schemes.");
        return;
    }

    // Remove the scheme from appliedSchemes and add it to cancelledSchemes with the current date
    const updatedAppliedSchemes = appliedSchemes.filter(scheme => scheme.id !== schemeId);
    const updatedCancelledSchemes = [
        ...cancelledSchemes,
        {
            ...schemeToCancel,
            cancelledDate: new Date().toISOString() // Add the current date as the cancellation date
        }
    ];

    try {
        // Update Firestore with the new arrays
        await updateDoc(userDocRef, {
            appliedSchemes: updatedAppliedSchemes,
            cancelledSchemes: updatedCancelledSchemes
        });

        alert(`The scheme has been cancelled.`);
        location.reload(); // Reload the page to reflect changes
    } catch (error) {
        console.error("Error cancelling scheme:", error);
        alert("An error occurred while cancelling the scheme. Please try again.");
    }
}

// Call the function to load applied schemes on page load
document.addEventListener("DOMContentLoaded", loadAppliedSchemes);
window.openDialog = openDialog;
window.closeDialog = closeDialog;
window.cancelScheme = cancelScheme;