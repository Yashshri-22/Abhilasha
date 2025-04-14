import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, doc, updateDoc, arrayUnion, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

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

// Function to populate table
const tableBody = document.getElementById("schemesTable");

schemes.forEach((scheme, index) => {
    let row = `
        <tr>
            <td class="view">${index + 1}</td>
            <td>${scheme.name}</td>
            <td>${scheme.desc}</td>
            <td class="view"><button class="viewButton" onclick="openPDF('${scheme.pdf}')">View PDF</button></td>
            <td class="view"><button class="applyButton" onclick="applyScheme('${scheme.name}')">Apply</button></td>
        </tr>
    `;
    tableBody.innerHTML += row;
});

// Function to open PDF
function openPDF(pdfFile) {
    window.open(`scheme_pdfs/${pdfFile}`, '_blank'); // Opens in a new tab
}

// Function to handle apply button click
async function applyScheme(schemeName) {
    const currentUserId = localStorage.getItem("currentUserId"); // Ensure this is set during login/signup
    if (!currentUserId) {
        console.error("Error: currentUserId is not set in localStorage.");
        alert("Please log in to apply for schemes.");
        return;
    }

    console.log(`Applying for scheme: ${schemeName}, User ID: ${currentUserId}`);

    const key = `progressData_${currentUserId}`;
    const progressData = JSON.parse(localStorage.getItem(key)) || {};

    console.log(`Using progressData key: ${key}`);
    console.log("Progress Data:", progressData);

    const totalSections = ["personal", "education", "document", "bank", "divyang", "question"];
    const completedSections = totalSections.filter(section => progressData[section]);
    const progress = Math.round((completedSections.length / totalSections.length) * 100);

    console.log(`Profile completion: ${progress}%`);

    if (progress === 100) {
        const scheme = schemes.find(s => s.name === schemeName);
        if (!scheme) {
            console.error("Error: Scheme not found.");
            alert("Scheme not found.");
            return;
        }

        try {
            const userDocRef = doc(db, "users", currentUserId);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                console.error("Error: User document not found in Firestore.");
                alert("User data not found. Please try again.");
                return;
            }

            const userData = userDocSnap.data();
            const appliedSchemes = userData.appliedSchemes || [];

            // Check if the user has already applied for this scheme
            if (appliedSchemes.some(s => s.id === scheme.id)) {
                alert(`You have already applied for the "${schemeName}" scheme.`);
                return;
            }

            // Check if the user has already applied for the maximum number of schemes
            if (appliedSchemes.length >= 4) {
                alert("You can apply for a maximum of 4 schemes.");
                return;
            }

            const newScheme = {
                id: scheme.id,
                appliedDate: new Date().toISOString()
            };

            console.log("Updating Firestore with new scheme:", newScheme);

            // Update Firestore with the new scheme
            await updateDoc(userDocRef, {
                appliedSchemes: arrayUnion(newScheme)
            });

            alert(`You have successfully applied for the "${schemeName}" scheme.`);
        } catch (error) {
            console.error("Error applying for scheme:", error);
            alert("An error occurred while applying for the scheme. Please try again.");
        }
    } else {
        alert("Please complete your profile 100% before applying for a scheme.");
    }
}
window.applyScheme = applyScheme;
window.openPDF = openPDF;