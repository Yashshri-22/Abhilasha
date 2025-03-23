// Array of schemes
const schemes = [
    { id: 1, name: "Education Support", desc: "Financial aid for underprivileged students.", pdf: "education.pdf" },
    { id: 2, name: "Startup Funding", desc: "Funding assistance for young entrepreneurs.", pdf: "startup.pdf" },
    { id: 3, name: "Health Insurance", desc: "Free healthcare coverage for low-income families.", pdf: "health.pdf" },
    { id: 4, name: "Women Empowerment", desc: "Skill development programs for women.", pdf: "women.pdf" },
    { id: 5, name: "Housing Scheme", desc: "Subsidized housing for economically weaker sections.", pdf: "housing.pdf" },
    { id: 6, name: "Agricultural Subsidy", desc: "Financial support for farmers.", pdf: "agriculture.pdf" },
    { id: 7, name: "Skill Development", desc: "Free training programs for job seekers.", pdf: "skills.pdf" },
    { id: 8, name: "Disability Aid", desc: "Special support for differently-abled individuals.", pdf: "disability.pdf" },
    { id: 9, name: "Scholarship Scheme", desc: "Merit-based scholarships for students.", pdf: "scholarship.pdf" },
    { id: 10, name: "Employment Assistance", desc: "Job placement support for unemployed youth.", pdf: "employment.pdf" }
];

// Dummy applicants data (Now includes scheme name & date)
const applicants = [
    { id: 1, name: "Amit Sharma", udid: "UD123456", scheme: "Education Support", date: "2025-03-10", application: "amit_application.pdf" },
    { id: 2, name: "Priya Singh", udid: "UD234567", scheme: "Startup Funding", date: "2025-03-12", application: "priya_application.pdf" },
    { id: 3, name: "Rahul Verma", udid: "UD345678", scheme: "Health Insurance", date: "2025-03-08", application: "rahul_application.pdf" },
    { id: 4, name: "Sneha Kapoor", udid: "UD456789", scheme: "Women Empowerment", date: "2025-03-09", application: "sneha_application.pdf" }
];

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
    `;
}

// Function to generate applicants table dynamically
function generateApplicantsTable() {
    return applicants.map(applicant => `
        <tr>
            <td class="view">${applicant.id}</td>
            <td>${applicant.name}</td>
            <td>${applicant.udid}</td>
            <td>${applicant.scheme}</td>
            <td>${applicant.date}</td>
            <td class="view"><button class="viewButton" onclick="openPDF('${applicant.application}')">View</button></td>
        </tr>
    `).join("");
}

// Filter applicants by UDID
function filterApplicants() {
    const query = document.getElementById("searchUDID").value.toUpperCase();
    const tableBody = document.getElementById("applicantsTable"); // Use correct ID

    // Filter applicants based on UDID
    const filteredData = applicants.filter(applicant => applicant.udid.toUpperCase().includes(query));

    // Update table content dynamically
    tableBody.innerHTML = filteredData.map((applicant, index) => `
        <tr>
            <td class="view">${index + 1}</td>
            <td>${applicant.name}</td>
            <td>${applicant.udid}</td>
            <td>${applicant.scheme}</td>
            <td>${applicant.date}</td>
            <td class="view"><button class="viewButton" onclick="openPDF('${applicant.application}')">View</button></td>
        </tr>
    `).join(""); 
}


// Function to open application PDF
function openPDF(pdfFile) {
    window.open(`pdfs/${pdfFile}`, '_blank');
}

// Load the applicants page on start
window.onload = loadApplicantsPage;
