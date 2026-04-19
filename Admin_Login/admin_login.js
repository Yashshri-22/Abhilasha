// ===============================
// 🔐 LOGIN USING COGNITO TOKEN
// ===============================
const emailInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    // 🔥 Call your backend login (Cognito)
    const res = await fetch("http://abhilasha-alb-261362901.eu-north-1.elb.amazonaws.com/loginAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message || "Login failed");
      return;
    }

    const token = data.idToken;
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const userId = decoded.sub;

    // 🔥 Check role from DynamoDB
    const userRes = await fetch(`http://abhilasha-alb-261362901.eu-north-1.elb.amazonaws.com/getUser/${userId}`);
    const userData = await userRes.json();

    if (userData.role === "admin") {
      localStorage.setItem("idToken", token);
      alert("Login successful");
      window.location.href = "../Admin_Dashboard/admin_dashboard.html";
    } else {
      alert("Access denied: Not an admin");
    }

  } catch (err) {
    console.error(err);
    alert("Login error");
  }
});