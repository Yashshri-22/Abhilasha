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
    window.open(`pdfs/${pdfFile}`, '_blank'); // Opens in a new tab
}

// Function to handle apply button click
function applyScheme(schemeName) {
    alert(`You have applied for the "${schemeName}" scheme successfully!`);
}
