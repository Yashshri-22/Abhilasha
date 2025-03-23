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

// Function to populate table
const tableBody = document.getElementById("schemesTable");

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
    `;
}

// Function to generate schemes table
function generateSchemesTable() {
    return schemes.map((scheme, index) => `
        <tr>
            <td class="view">${index + 1}</td>
            <td>${scheme.name}</td>
            <td>${scheme.desc}</td>
            <td class="view"><button class="viewButton" onclick="viewApplicants('${scheme.name}')">View</button></td>
        </tr>
    `).join("");
}

// Function to update UI when a scheme is clicked
function viewApplicants(schemeName) {
    // Replace table with a new applicants table
    document.querySelector(".container").innerHTML = `
        <button class="backButton" onclick="loadSchemesPage()">←</button>
        <h2>${schemeName}</h2>
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
                ${generateApplicantsTable()}
            </tbody>
        </table>
    `;
}

// Function to generate dummy applicants data
function generateApplicantsTable() {
    const applicants = [
        { id: 1, name: "Amit Sharma", udid: "UD123456", application: "amit_application.pdf" },
        { id: 2, name: "Priya Singh", udid: "UD234567", application: "priya_application.pdf" },
        { id: 3, name: "Rahul Verma", udid: "UD345678", application: "rahul_application.pdf" },
        { id: 4, name: "Sneha Kapoor", udid: "UD456789", application: "sneha_application.pdf" }
    ];

    return applicants.map(applicant => `
        <tr>
            <td class="view">${applicant.id}</td>
            <td>${applicant.name}</td>
            <td>${applicant.udid}</td>
            <td class="view"><button class="viewButton" onclick="openPDF('${applicant.application}')">View</button></td>
        </tr>
    `).join("");
}

// Function to open PDF
function openPDF(pdfFile) {
    window.open(`pdfs/${pdfFile}`, '_blank'); // Opens in a new tab
}

// Load the initial schemes page
loadSchemesPage();
