import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkxeSRcylugPQdhABCFmWmTUYFQ868aDE",
  authDomain: "abhilasha-fdbc0.firebaseapp.com",
  projectId: "abhilasha-fdbc0",
  storageBucket: "abhilasha-fdbc0.firebasestorage.app",
  messagingSenderId: "11075472828",
  appId: "1:11075472828:web:ed0a46285d259760f32fb9",
  measurementId: "G-H49EPQK1PQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Array of schemes
const schemes = [
  {
    id: 1,
    name: "Sanjay Gandhi Niradhar Anudan Yojana",
    desc: "Monthly financial assistance to needy disabled persons.",
    pdf: "scheme1.pdf",
  },
  {
    id: 2,
    name: "Swavalamban Yojana (Self-employment Scheme)",
    desc: "Financial support for self-employment ventures.",
    pdf: "scheme2.pdf",
  },
  {
    id: 3,
    name: "Housing Scheme for Disabled (under PMAY / State Govt)",
    desc: "Allotment of affordable housing units.",
    pdf: "scheme3.pdf",
  },
  {
    id: 4,
    name: "Free Travel Concession Scheme (MSRTC)",
    desc: "Free or concessional travel for disabled persons in state transport buses.",
    pdf: "scheme4.pdf",
  },
  {
    id: 5,
    name: "Scholarship Scheme for Disabled Students",
    desc: "Financial assistance for school/college-going disabled students.",
    pdf: "scheme5.pdf",
  },
  {
    id: 6,
    name: "Niramaya Health Insurance Scheme",
    desc: "Health insurance coverage for persons with developmental disabilities.",
    pdf: "scheme6.pdf",
  },
  {
    id: 7,
    name: "Skill Development Training Scheme for PWDs",
    desc: "Free vocational training programs in various trades.",
    pdf: "scheme7.pdf",
  },
  {
    id: 8,
    name: "Assistance for Purchase of Assistive Devices",
    desc: "Financial support for purchasing prosthetic devices and other assistive aids.",
    pdf: "scheme8.pdf",
  },
  {
    id: 9,
    name: "Free Bus Pass Scheme",
    desc: "Free or concessional travel for disabled individuals in PMPML buses.​",
    pdf: "scheme9.pdf",
  },
  {
    id: 10,
    name: "Financial Assistance for 75% or More Permanent Disability",
    desc: "One-time financial assistance for workers with significant disabilities.​",
    pdf: "scheme10.pdf",
  },
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
  const baseURL = "https://abhilasha-documents.s3.eu-north-1.amazonaws.com/schemes/";
  window.open(baseURL + pdfFile, "_blank");
}
// Function to handle apply button click
async function applyScheme(schemeName) {
  // ===============================
  // 🔐 GET USER
  // ===============================
  const token = localStorage.getItem("idToken");

  if (!token) {
    alert("Please login first");
    return;
  }

  let decoded;
  try {
    decoded = JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    alert("Session expired");
    return;
  }

  const userId = decoded.sub;

  // ===============================
  // PROFILE COMPLETION CHECK
  // ===============================
  const key = `progressData_${userId}`;
  const progressData = JSON.parse(localStorage.getItem(key)) || {};

  const totalSections = [
    "personal",
    "education",
    "document",
    "bank",
    "divyang",
    "question",
  ];

  const completedSections = totalSections.filter(
    (section) => progressData[section]
  );

  const progress = Math.round(
    (completedSections.length / totalSections.length) * 100
  );

  if (progress !== 100) {
    alert("Please complete your profile 100% before applying.");
    return;
  }

  // ===============================
  // FIND SCHEME
  // ===============================
  const scheme = schemes.find((s) => s.name === schemeName);

  if (!scheme) {
    alert("Scheme not found");
    return;
  }

  // ===============================
  // CALL BACKEND
  // ===============================
  try {
    const res = await fetch("http://13.51.170.94:3000/applyScheme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        scheme: {
          id: scheme.id,
        },
      }),
    });

    const result = await res.json();

    if (result.success) {
      alert(`✅ Applied successfully for "${schemeName}"`);
    } else {
      alert(result.message);
    }

  } catch (err) {
    console.error(err);
    alert("Error applying for scheme");
  }
}
window.applyScheme = applyScheme;
window.openPDF = openPDF;
