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

    // 🔥 fetch user from DynamoDB
    const res = await fetch(`http://13.61.14.149:3000/getUser/${userId}`);
    
    if (!res.ok) throw new Error("User fetch failed");

    const userData = await res.json();

    console.log("Admin check:", userData);

    // ✅ role validation
    if (!userData || userData.role !== "admin") {
      alert("Access denied");
      window.location.href = "../home/home.html";
    }

  } catch (err) {
    console.error("Auth error:", err);
    localStorage.removeItem("idToken");
    window.location.href = "../home/home.html";
  }
}

// run on page load
document.addEventListener("DOMContentLoaded", checkAdminAccess);


// ===============================
// 🚪 LOGOUT (COGNITO STYLE)
// ===============================
async function logout() {
  try {
    const token = localStorage.getItem("idToken");

    // OPTIONAL: backend logout (if you implement later)
    // await fetch("http://localhost:3000/logout", { method: "POST" });

    // ✅ clear session
    localStorage.removeItem("idToken");

    // redirect
    window.location.href = "../home/home.html";

  } catch (err) {
    console.error("Logout error:", err);
    localStorage.removeItem("idToken");
    window.location.href = "../home/home.html";
  }
}


// ===============================
// 📄 PAGE NAVIGATION
// ===============================
function loadPage(pageUrl) {
  if (pageUrl === "pages/Logout/Logout.html") {
    logout(); // 🔥 use proper logout
  } else {
    document.getElementById("mainFrame").src = pageUrl;
  }
}

window.loadPage = loadPage;

console.log("Admin Dashboard loaded (Cognito version)");

