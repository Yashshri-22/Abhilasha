// ===============================
// 🔐 ADMIN AUTH CHECK (COGNITO)
// ===============================
async function checkAdminAccess() {
  const token = localStorage.getItem("idToken");

  if (!token) {
    window.location.href = "../home/home.html";
    return;
  }

  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const userId = decoded.sub;

    const res = await fetch(`http://localhost:3000/getUser/${userId}`);
    const userData = await res.json();

    console.log("Admin check:", userData);

    if (userData.role !== "admin") {
      window.location.href = "../home/home.html";
    }

  } catch (err) {
    console.error(err);
    window.location.href = "../home/home.html";
  }
}

// run on page load
document.addEventListener("DOMContentLoaded", checkAdminAccess);

// ===============================
// 🚪 LOGOUT
// ===============================
function loadPage(pageUrl) {
  if (pageUrl === "pages/Logout/Logout.html") {
    localStorage.removeItem("idToken"); // 🔥 clear token
    window.location.href = "../home/home.html";
  } else {
    document.getElementById("mainFrame").src = pageUrl;
  }
}

window.loadPage = loadPage;

console.log("Admin Dashboard loaded (Cognito version)");