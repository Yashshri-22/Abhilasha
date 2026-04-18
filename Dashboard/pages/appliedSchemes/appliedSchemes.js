// ===============================
// 🔐 AUTH
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
// 📥 LOAD APPLIED SCHEMES
// ===============================
async function loadAppliedSchemes() {
  const loader = document.getElementById("loader");
  const tableBody = document.getElementById("appliedSchemesTable");

  loader.classList.remove("hidden");

  const userId = getUserId();
  if (!userId) return;

  try {
    const res = await fetch(`http://localhost:3000/getUser/${userId}`);
    const data = await res.json();

    const appliedSchemes = data.appliedSchemes || [];

    tableBody.innerHTML = "";

    appliedSchemes.forEach((appliedScheme, index) => {
      const scheme = schemes.find(s => s.id === appliedScheme.id);

      if (scheme) {
        let row = `
          <tr>
            <td>${index + 1}</td>
            <td>${scheme.name}</td>
            <td>${scheme.desc}</td>
            <td>
              <button onclick="openDialog(${scheme.id})">Check Status</button>
            </td>
            <td>
              <button onclick="cancelScheme(${scheme.id})">Cancel</button>
            </td>
          </tr>
        `;
        tableBody.innerHTML += row;
      }
    });

  } catch (err) {
    console.error("Load Error:", err);
  }

  loader.classList.add("hidden");
}

// ===============================
// 📊 OPEN STATUS DIALOG
// ===============================
async function openDialog(schemeId) {
  const statusTable = document.getElementById("statusTable");
  statusTable.innerHTML = "";

  const userId = getUserId();
  if (!userId) return;

  try {
    const res = await fetch(`http://localhost:3000/getUser/${userId}`);
    const data = await res.json();

    const appliedSchemes = data.appliedSchemes || [];
    const scheme = appliedSchemes.find(s => s.id === schemeId);

    if (!scheme) {
      alert("Scheme not found");
      return;
    }

    if (scheme.status && scheme.status.length > 0) {
      scheme.status.forEach(entry => {
        statusTable.innerHTML += `
          <tr>
            <td>${entry.remark}</td>
            <td>${entry.sentBy || "Admin"}</td>
            <td>${entry.date || "N/A"}</td>
          </tr>
        `;
      });
    } else {
      statusTable.innerHTML = `
        <tr>
          <td colspan="3">No remarks</td>
        </tr>
      `;
    }

  } catch (err) {
    console.error(err);
  }

  document.getElementById("statusDialog").style.display = "flex";
}

// ===============================
// ❌ CANCEL SCHEME
// ===============================
async function cancelScheme(schemeId) {
  const userId = getUserId();
  if (!userId) return;

  try {
    const res = await fetch(`http://localhost:3000/getUser/${userId}`);
    const data = await res.json();

    let appliedSchemes = data.appliedSchemes || [];
    let cancelledSchemes = data.cancelledSchemes || [];

    const schemeToCancel = appliedSchemes.find(s => s.id === schemeId);

    if (!schemeToCancel) {
      alert("Scheme not found");
      return;
    }

    appliedSchemes = appliedSchemes.filter(s => s.id !== schemeId);

    cancelledSchemes.push({
      ...schemeToCancel,
      cancelledDate: new Date().toISOString(),
    });

    await fetch("http://localhost:3000/updateSchemes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        appliedSchemes,
        cancelledSchemes,
      }),
    });

    alert("Scheme cancelled");
    location.reload();

  } catch (err) {
    console.error(err);
    alert("Error cancelling scheme");
  }
}

// ===============================
// UI HELPERS
// ===============================
function closeDialog() {
  document.getElementById("statusDialog").style.display = "none";
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", loadAppliedSchemes);

window.openDialog = openDialog;
window.closeDialog = closeDialog;
window.cancelScheme = cancelScheme;