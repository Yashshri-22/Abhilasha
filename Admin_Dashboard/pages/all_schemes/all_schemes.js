import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
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

// Function to load the schemes page
function loadSchemesPage() {
    document.querySelector(".container").innerHTML = `
        <h2>Available Schemes</h2>
        <p>Click on the <strong>View</strong> button to get the applicants list</p>
        <table>
            <thead>
                <tr>
                    <th class="view">#</th>
                    <th>Scheme Name</th>
                    <th>Description</th>
                    <th class="view">Applications</th>
                </tr>
            </thead>
            <tbody id="schemesTable">
                ${generateSchemesTable()}
            </tbody>
        </table>
        <div id="loader" class="loader-container hidden">
            <div class="loader"></div>
        </div>
    `;
}

// Function to generate schemes table
function generateSchemesTable() {
    return schemes.map((scheme, index) => `
        <tr>
            <td class="view">${index + 1}</td>
            <td>${scheme.name}</td>
            <td>${scheme.desc}</td>
            <td class="view"><button class="viewButton" onclick="viewApplicants(${scheme.id})">View</button></td>
        </tr>
    `).join("");
}

// Function to fetch and display applicants for a specific scheme
async function viewApplicants(schemeId) {
    const loader = document.getElementById("loader");
    loader.classList.remove("hidden"); // Show loader

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Check if the user is an admin
            if (user.uid === "US1EFPivGhSyoL4q4Cw1oU997t92") { // Replace with your admin UID
                try {
                    const usersRef = collection(db, "users");
                    const snapshot = await getDocs(usersRef);

                    const applicants = []; // Reset applicants array

                    snapshot.forEach(docSnap => {
                        const data = docSnap.data();
                        const appliedSchemes = data.appliedSchemes || [];

                        // Filter users who applied for the selected scheme
                        appliedSchemes.forEach(scheme => {
                            if (scheme.id === schemeId) {
                                applicants.push({
                                    name: `${data.personalDetails?.first_name || "N/A"} ${data.personalDetails?.last_name || ""}`,
                                    udid: data.personalDetails?.udid || "N/A",
                                    application: scheme.applicationPdf || "#"
                                });
                            }
                        });
                    });

                    loader.classList.add("hidden"); // Hide loader after data is fetched

                    // Replace table with applicants table
                    document.querySelector(".container").innerHTML = `
                        <button class="backButton" id="backButton">← Back</button>
                        <h2>Applicants for Scheme ID: ${schemeId}</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th class="view">#</th>
                                    <th>Applicant Name</th>
                                    <th>UDID</th>
                                    <th class="view">View Application</th>
                                </tr>
                            </thead>
                            <tbody id="applicantsTable">
                                ${generateApplicantsTable(applicants)}
                            </tbody>
                        </table>
                    `;

                    // Add event listener for the back button
                    document.getElementById("backButton").addEventListener("click", loadSchemesPage);
                } catch (error) {
                    console.error("Error fetching applicants:", error);
                    alert("Failed to load applicants. Please check your permissions or try again later.");
                    loader.classList.add("hidden"); // Hide loader in case of error
                }
            } else {
                alert("You do not have permission to view this data.");
                loader.classList.add("hidden"); // Hide loader
            }
        } else {
            alert("User not authenticated.");
            loader.classList.add("hidden"); // Hide loader
        }
    });
}

// Function to generate applicants table dynamically
function generateApplicantsTable(applicants) {
    if (applicants.length === 0) {
        return `<tr><td colspan="4" style="text-align: center;">No applicants found for this scheme.</td></tr>`;
    }

    return applicants.map((applicant, index) => `
        <tr>
            <td class="view">${index + 1}</td>
            <td>${applicant.name}</td>
            <td>${applicant.udid}</td>
            <td class="view"><button class="viewButton" onclick="openPDF('${applicant.application}')">View</button></td>
        </tr>
    `).join("");
}

// Function to open application PDF
function openPDF(pdfFile) {
    window.open(`pdfs/${pdfFile}`, '_blank'); // Opens in a new tab
}

// Expose functions to the global scope
window.viewApplicants = viewApplicants;
window.openPDF = openPDF;

// Load the initial schemes page
loadSchemesPage();