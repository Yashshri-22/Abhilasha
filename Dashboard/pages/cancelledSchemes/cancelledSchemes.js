// Example list of cancelled schemes
const cancelledSchemes = [
    { id: 1, name: "Housing Assistance", date: "2025-03-10" },
    { id: 2, name: "Small Business Grant", date: "2025-02-28" },
    { id: 3, name: "Health Benefits Scheme", date: "2025-01-15" }
];

// Populate the table dynamically
const tableBody = document.getElementById("cancelledSchemesTable");

cancelledSchemes.forEach((scheme, index) => {
    let row = `
        <tr>
            <td class="view">${index + 1}</td>
            <td>${scheme.name}</td>
            <td>${scheme.date}</td>
            <td class="cancel-symbol">❌</td>
        </tr>
    `;
    tableBody.innerHTML += row;
});
