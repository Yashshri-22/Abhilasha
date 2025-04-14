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


let applicants = [];

// Listen for authentication state changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        await fetchUsersWithMultipleSchemes();
        loadApplicantsPage(); // Load UI only after data is fetched
    } else {
        console.error("User not authenticated.");
    }
});

// Fetch users with multiple applied schemes
async function fetchUsersWithMultipleSchemes() {
    const loader = document.getElementById("loader"); // Get the loader element
    loader.classList.remove("hidden"); // Show the loader

    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    applicants = []; // Reset the applicants array
    let userEntryNumber = 1; // Track the user entry number

    snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const appliedSchemes = data.appliedSchemes || [];

        // Include users with at least one applied scheme
        appliedSchemes.forEach(scheme => {
            // Find the scheme name using the scheme ID
            const schemeDetails = schemes.find(s => s.id === scheme.id);

            // Extract only the date part from the appliedDate
            const date = scheme.appliedDate ? scheme.appliedDate.split("T")[0] : "N/A";

            // Push a new entry for each applied scheme
            applicants.push({
                uid: docSnap.id, // Add the unique applicant ID
                userEntryNumber: userEntryNumber, // Same user entry number for all their schemes
                first_name: data.personalDetails?.first_name || "N/A",
                last_name: data.personalDetails?.last_name || "N/A",
                udid: data.personalDetails?.udid || "N/A",
                scheme: schemeDetails?.name || "N/A", // Fetch scheme name from schemes array
                schemeId: scheme.id, // Add scheme ID
                date: date, // Use only the date part
                application: scheme.applicationPdf || "#"
            });
        });

        userEntryNumber++; // Increment the user entry number after processing all their schemes
    });

    loader.classList.add("hidden"); // Hide the loader after data is fetched
    console.log("Applicants Array:", applicants); // Debugging: Log applicants array
}

// Ensure applicants table loads properly
function loadApplicantsPage() {
    document.querySelector(".container").innerHTML = `
        <div id="header">
            <h2>Applicants List</h2>
            <div class="search-container">
                <img class="search-icon" src="../../../Assets/search.png">
                <input type="text" id="searchUDID" placeholder="Search by UDID" onkeyup="filterApplicants()">
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th class="view">#</th>
                    <th>Applicant Name</th>
                    <th>UDID</th>
                    <th>Scheme Name</th>
                    <th>Date</th>
                    <th class="view">Application</th>
                </tr>
            </thead>
            <tbody id="applicantsTable">
                ${generateApplicantsTable()}
            </tbody>
        </table>
        <div id="loader" class="loader-container hidden">
            <div class="loader"></div>
        </div>
    `;
}

// Generate applicants table dynamically
function generateApplicantsTable() {
    if (applicants.length === 0) {
        return `<tr><td colspan="6" style="text-align: center;">No applicants found.</td></tr>`;
    }

    return applicants.map(applicant => `
        <tr>
            <td class="view">${applicant.userEntryNumber}</td>
            <td>${applicant.first_name} ${applicant.last_name}</td>
            <td>${applicant.udid}</td>
            <td>${applicant.scheme}</td>
            <td>${applicant.date}</td>
            <td class="view">
                <button class="viewButton" onclick="openPDF('${applicant.uid}', ${applicant.schemeId})">View</button>
            </td>
        </tr>
    `).join("");
}

// Filter applicants by UDID
function filterApplicants() {
    const query = document.getElementById("searchUDID").value.toUpperCase();
    const tableBody = document.getElementById("applicantsTable");

    // Filter applicants based on UDID
    const filteredData = applicants.filter(applicant => applicant.udid.toUpperCase().includes(query));

    // Update table content dynamically
    tableBody.innerHTML = filteredData.map((applicant, index) => `
        <tr>
            <td class="view">${applicant.userEntryNumber}</td>
            <td>${applicant.first_name} ${applicant.last_name}</td>
            <td>${applicant.udid}</td>
            <td>${applicant.scheme}</td>
            <td>${applicant.date}</td>
            <td class="view"><button class="viewButton" onclick="openPDF('${applicant.uid}', ${applicant.schemeId})">View</button></td>
        </tr>
    `).join("");
}

// Open application page with applicant's user ID and scheme ID
function openPDF(applicantUid, schemeId) {
    window.location.href = `../view_application/view_application.html?userId=${applicantUid}&schemeId=${schemeId}`;
}

// Expose functions to the global scope
window.onload = loadApplicantsPage;
window.openPDF = openPDF;
window.filterApplicants = filterApplicants;
