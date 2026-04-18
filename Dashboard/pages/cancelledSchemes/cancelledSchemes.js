// ===============================
// 🔐 AUTH (COGNITO)
// ===============================
function getUserId() {
  const token = localStorage.getItem("idToken");

  if (!token) {
    window.top.location.href = "../../Login/login.html";
    return null;
  }

  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.sub; // ✅ FIXED
  } catch (e) {
    window.top.location.href = "../../Login/login.html";
    return null;
  }
}

// ===============================
// SCHEMES DATA
// ===============================
const schemes = [
  { id: 1, name: "Sanjay Gandhi Niradhar Anudan Yojana" },
  { id: 2, name: "Swavalamban Yojana (Self-employment Scheme)" },
  { id: 3, name: "Housing Scheme for Disabled" },
  { id: 4, name: "Free Travel Concession Scheme (MSRTC)" },
  { id: 5, name: "Scholarship Scheme for Disabled Students" },
  { id: 6, name: "Niramaya Health Insurance Scheme" },
  { id: 7, name: "Skill Development Training Scheme for PWDs" },
  { id: 8, name: "Assistive Devices Scheme" },
  { id: 9, name: "Free Bus Pass Scheme" },
  { id: 10, name: "Financial Assistance (75% Disability)" }
];

// ===============================
// 📥 LOAD CANCELLED SCHEMES
// ===============================
async function loadCancelledSchemes() {
  const loader = document.getElementById("loader");
  const tableBody = document.getElementById("cancelledSchemesTable");

  loader.classList.remove("hidden");

  const userId = getUserId();
  if (!userId) return;

  try {
    const res = await fetch(`http://localhost:3000/getUser/${userId}`);
    const data = await res.json();

    const cancelledSchemes = data.cancelledSchemes || [];

    tableBody.innerHTML = "";

    cancelledSchemes.forEach((schemeItem, index) => {
      const scheme = schemes.find(s => s.id === schemeItem.id);

      if (scheme) {
        let row = `
          <tr>
            <td>${index + 1}</td>
            <td>${scheme.name}</td>
            <td>${new Date(schemeItem.cancelledDate).toLocaleDateString()}</td>
            <td>❌</td>
          </tr>
        `;
        tableBody.innerHTML += row;
      }
    });

  } catch (err) {
    console.error("Load Error:", err);
    alert("Failed to load cancelled schemes");
  }

  loader.classList.add("hidden");
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", loadCancelledSchemes);