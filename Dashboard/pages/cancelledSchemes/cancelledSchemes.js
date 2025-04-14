import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
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

// Function to fetch cancelled schemes from Firestore and populate the table
async function loadCancelledSchemes() {
    const loader = document.getElementById("loader");
    const tableBody = document.getElementById("cancelledSchemesTable");

    // Show loader
    loader.classList.remove("hidden");

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const cancelledSchemes = userData.cancelledSchemes || [];

                tableBody.innerHTML = ""; // Clear existing rows

                cancelledSchemes.forEach((cancelledScheme, index) => {
                    const scheme = schemes.find(s => s.id === cancelledScheme.id);
                    if (scheme) {
                        let row = `
                            <tr>
                                <td class="view">${index + 1}</td>
                                <td>${scheme.name}</td>
                                <td>${cancelledScheme.cancelledDate}</td>
                                <td class="cancel-symbol">❌</td>
                            </tr>
                        `;
                        tableBody.innerHTML += row;
                    }
                });
            } else {
                console.error("User document not found in Firestore.");
                alert("No cancelled schemes found.");
            }
        } else {
            alert("User not logged in.");
        }

        // Hide loader after data is loaded
        loader.classList.add("hidden");
    });
}

// Call the function to load cancelled schemes on page load
document.addEventListener("DOMContentLoaded", loadCancelledSchemes);
