// Array of schemes
const schemes = [
    { id: 1, name: "Sanjay Gandhi Niradhar Anudan Yojana", desc: "Monthly financial assistance to needy disabled persons.", pdf: "education.pdf" },
    { id: 2, name: "Swavalamban Yojana (Self-employment Scheme)", desc: "Financial support for self-employment ventures.", pdf: "startup.pdf" },
    { id: 3, name: "Housing Scheme for Disabled (under PMAY / State Govt)", desc: "Allotment of affordable housing units.", pdf: "health.pdf" },
    { id: 4, name: "Free Travel Concession Scheme (MSRTC)", desc: "Free or concessional travel for disabled persons in state transport buses.", pdf: "women.pdf" },
    { id: 5, name: "Scholarship Scheme for Disabled Students", desc: "Financial assistance for school/college-going disabled students.", pdf: "housing.pdf" },
    { id: 6, name: "Niramaya Health Insurance Scheme", desc: "Health insurance coverage for persons with developmental disabilities.", pdf: "agriculture.pdf" },
    { id: 7, name: "Skill Development Training Scheme for PWDs", desc: "Free vocational training programs in various trades.", pdf: "skills.pdf" },
    { id: 8, name: "Assistance for Purchase of Assistive Devices", desc: "Financial support for purchasing prosthetic devices and other assistive aids.", pdf: "disability.pdf" },
    { id: 9, name: "Free Bus Pass Scheme", desc: "Free or concessional travel for disabled individuals in PMPML buses.​", pdf: "scholarship.pdf" },
    { id: 10, name: "Financial Assistance for 75% or More Permanent Disability", desc: "One-time financial assistance for workers with significant disabilities.​", pdf: "employment.pdf" }
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
