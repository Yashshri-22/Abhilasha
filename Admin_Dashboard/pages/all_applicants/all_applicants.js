// ===============================
// 📦 SCHEMES MASTER DATA
// ===============================
const schemes = [
  { id: 1, name: "Sanjay Gandhi Niradhar Anudan Yojana" },
  { id: 2, name: "Swavalamban Yojana" },
  { id: 3, name: "Housing Scheme" },
  { id: 4, name: "Free Travel Concession Scheme" },
  { id: 5, name: "Scholarship Scheme" },
  { id: 6, name: "Niramaya Health Insurance" },
  { id: 7, name: "Skill Development Training" },
  { id: 8, name: "Assistive Devices Scheme" },
  { id: 9, name: "Free Bus Pass Scheme" },
  { id: 10, name: "Financial Assistance Scheme" },
];

let applicants = [];

// ===============================
// 🔐 AUTH CHECK (COGNITO)
// ===============================
function checkAuth() {
  const token = localStorage.getItem("idToken");

  if (!token) {
    window.location.href = "../../home/home.html";
    return null;
  }

  const decoded = JSON.parse(atob(token.split(".")[1]));
  return decoded.sub;
}

// ===============================
// 📥 FETCH USERS FROM BACKEND
// ===============================
async function fetchUsers() {
  const loader = document.getElementById("loader");
  loader.classList.remove("hidden");

  try {
    const res = await fetch("http://13.51.170.94:3000/getAllUsers");
    const users = await res.json();

    console.log("Users:", users);

    applicants = [];
    let userEntryNumber = 1;

    users.forEach((user) => {
      const schemesApplied = user.appliedSchemes || [];

      schemesApplied.forEach((scheme) => {
        if (!scheme.state) {
          const schemeDetails = schemes.find((s) => s.id == scheme.id);

          const date = scheme.appliedDate
            ? scheme.appliedDate.split("T")[0]
            : "N/A";

          applicants.push({
            uid: user.userId,
            userEntryNumber: userEntryNumber,
            first_name: user.personalDetails?.first_name || "N/A",
            last_name: user.personalDetails?.last_name || "N/A",
            udid: user.personalDetails?.udid || "N/A",
            scheme: schemeDetails?.name || "N/A",
            schemeId: scheme.id,
            date: date,
            application: scheme.applicationPdf || "#",
          });
        }
      });

      userEntryNumber++;
    });
  } catch (err) {
    console.error("Fetch error:", err);
  }

  loader.classList.add("hidden");
}

// ===============================
// 🧾 LOAD UI
// ===============================
async function loadApplicantsPage() {
  await fetchUsers();

  document.querySelector(".container").innerHTML = `
    <div id="header">
      <h2>Applicants List</h2>
      <div class="search-container">
        <input type="text" id="searchUDID" placeholder="Search by UDID" onkeyup="filterApplicants()">
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>UDID</th>
          <th>Scheme</th>
          <th>Date</th>
          <th>Application</th>
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

// ===============================
// 🧾 GENERATE TABLE
// ===============================
function generateApplicantsTable() {
  if (applicants.length === 0) {
    return `<tr><td colspan="6">No applicants found</td></tr>`;
  }

  return applicants
    .map(
      (applicant) => `
    <tr>
      <td>${applicant.userEntryNumber}</td>
      <td>${applicant.first_name} ${applicant.last_name}</td>
      <td>${applicant.udid}</td>
      <td>${applicant.scheme}</td>
      <td>${applicant.date}</td>
      <td>
        <button class="viewButton" onclick="openPDF('${applicant.uid}', ${applicant.schemeId})">
          View
        </button>
      </td>
    </tr>
  `,
    )
    .join("");
}

// ===============================
// 🔍 FILTER
// ===============================
function filterApplicants() {
  const query = document.getElementById("searchUDID").value.toUpperCase();

  if (!query) {
    // 🔥 If empty → show full table again
    document.getElementById("applicantsTable").innerHTML =
      generateApplicantsTable();
    return;
  }

  const filtered = applicants.filter((a) =>
    a.udid.toUpperCase().includes(query),
  );

  document.getElementById("applicantsTable").innerHTML =
    generateFilteredTable(filtered);
}

function generateFilteredTable(data) {
  if (data.length === 0) {
    return `<tr><td colspan="6">No results found</td></tr>`;
  }

  return data
    .map(
      (applicant) => `
    <tr>
      <td>${applicant.userEntryNumber}</td>
      <td>${applicant.first_name} ${applicant.last_name}</td>
      <td>${applicant.udid}</td>
      <td>${applicant.scheme}</td>
      <td>${applicant.date}</td>
      <td>
        <button class="viewButton"
          onclick="openPDF('${applicant.uid}', ${applicant.schemeId})">
          View
        </button>
      </td>
    </tr>
  `,
    )
    .join("");
}

// ===============================
// 📄 VIEW APPLICATION
// ===============================
function openPDF(uid, schemeId) {
  window.location.href = `../view_application/view_application.html?userId=${uid}&schemeId=${schemeId}`;
}

// ===============================
// 🚀 INIT
// ===============================
window.onload = () => {
  checkAuth();
  loadApplicantsPage();
};

window.filterApplicants = filterApplicants;
window.openPDF = openPDF;
