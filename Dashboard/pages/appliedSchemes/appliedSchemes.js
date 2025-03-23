// Example applied schemes data
const appliedSchemes = [
    { id: 1, name: "Scholarship Scheme", description: "Merit-based scholarship for students.", status: "Approved" },
    { id: 2, name: "Startup Assistance", description: "Financial aid for new startups.", status: "Pending" },
    { id: 3, name: "Health Insurance", description: "Medical insurance for low-income families.", status: "Rejected" }
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

// Populate the table dynamically
const tableBody = document.getElementById("appliedSchemesTable");
appliedSchemes.forEach((scheme, index) => {
    let row = `
        <tr>
            <td class="view">${index + 1}</td>
            <td>${scheme.name}</td>
            <td>${scheme.description}</td>
            <td  class="view">
                <button id="status-btn" onclick="openDialog(${scheme.id})">Check Status</button>
            </td>
        </tr>
    `;
    tableBody.innerHTML += row;
});

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
