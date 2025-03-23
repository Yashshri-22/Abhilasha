function showContent(title, category) {
    const contentDiv = document.getElementById('content');

    // Updated table data with more records and new columns
    const tableData = {
        all_applicants: [
            { id: 1, name: "John Doe", udid: "UDID12345", scheme: "Education Grant", status: "Applied" },
            { id: 2, name: "Jane Smith", udid: "UDID67890", scheme: "Medical Aid", status: "Applied" },
            { id: 3, name: "Michael Johnson", udid: "UDID11223", scheme: "Housing Assistance", status: "Applied" },
            { id: 4, name: "Emily Davis", udid: "UDID33445", scheme: "Employment Support", status: "Applied" },
            { id: 5, name: "Daniel Wilson", udid: "UDID55667", scheme: "Financial Aid", status: "Applied" }
        ],
        waiting: [
            { id: 6, name: "Alice Brown", udid: "UDID78901", scheme: "Education Grant", status: "Waiting" },
            { id: 7, name: "Bob Johnson", udid: "UDID23456", scheme: "Medical Aid", status: "Waiting" },
            { id: 8, name: "David Clark", udid: "UDID34567", scheme: "Housing Assistance", status: "Waiting" },
            { id: 9, name: "Olivia Lewis", udid: "UDID45678", scheme: "Employment Support", status: "Waiting" },
            { id: 10, name: "James Allen", udid: "UDID56789", scheme: "Financial Aid", status: "Waiting" }
        ],
        approved: [
            { id: 11, name: "Chris Evans", udid: "UDID67891", scheme: "Education Grant", status: "Approved" },
            { id: 12, name: "Natalie Portman", udid: "UDID78912", scheme: "Medical Aid", status: "Approved" },
            { id: 13, name: "Henry Taylor", udid: "UDID89123", scheme: "Housing Assistance", status: "Approved" },
            { id: 14, name: "Emma Thomas", udid: "UDID91234", scheme: "Employment Support", status: "Approved" },
            { id: 15, name: "William Martinez", udid: "UDID10234", scheme: "Financial Aid", status: "Approved" }
        ],
        rejected: [
            { id: 16, name: "Robert Downey", udid: "UDID23457", scheme: "Education Grant", status: "Rejected" },
            { id: 17, name: "Scarlett Johansson", udid: "UDID34568", scheme: "Medical Aid", status: "Rejected" },
            { id: 18, name: "Ethan Moore", udid: "UDID45679", scheme: "Housing Assistance", status: "Rejected" },
            { id: 19, name: "Mia Anderson", udid: "UDID56780", scheme: "Employment Support", status: "Rejected" },
            { id: 20, name: "Benjamin Garcia", udid: "UDID67890", scheme: "Financial Aid", status: "Rejected" }
        ]
    };

    // Create table dynamically
    let tableHTML = `<table border="1">
                        <tr>
                            <th>#</th>
                            <th>Applicant Name</th>
                            <th>UDID</th>
                            <th>Scheme Name</th>
                            <th>Status</th>
                        </tr>`;
    
    tableData[category].forEach((row, index) => {
        tableHTML += `<tr>
                        <td>${index + 1}</td>
                        <td>${row.name}</td>
                        <td>${row.udid}</td>
                        <td>${row.scheme}</td>
                        <td>${row.status}</td>
                      </tr>`;
    });

    tableHTML += `</table>`;

    // Update content
    contentDiv.innerHTML = `<h2>${title}</h2>` + tableHTML;
}
