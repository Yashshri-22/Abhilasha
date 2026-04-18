async function showContent(title, category) {
  const contentDiv = document.getElementById("content");

  contentDiv.innerHTML = "<h2>Loading...</h2>";

  try {
    // 🔥 Fetch all users (you need this API)
    const res = await fetch("http://localhost:3000/getAllUsers");
    const users = await res.json();

    console.log("USERS:", users); // 🔥 ADD THIS

    let rows = [];

    users.forEach((user) => {
      const name = user.personalDetails?.name || "N/A";
      const udid = user.divyangDetails?.udid || "N/A";

      const schemes = user.appliedSchemes || [];

      schemes.forEach((scheme) => {
        const latestStatus =
          scheme.status?.[scheme.status.length - 1]?.remark || "Applied";

        const row = {
          name,
          udid,
          scheme: `Scheme ${scheme.id}`,
          status: latestStatus,
        };

        // 🔥 FILTER BASED ON CATEGORY
        if (category === "all_applicants") {
          rows.push(row);
        } else if (
          category === "waiting" &&
          latestStatus.toLowerCase().includes("submitted")
        ) {
          rows.push(row);
        } else if (
          category === "approved" &&
          latestStatus.toLowerCase().includes("approved")
        ) {
          rows.push(row);
        } else if (
          category === "rejected" &&
          latestStatus.toLowerCase().includes("rejected")
        ) {
          rows.push(row);
        }
      });
    });

    // ===============================
    // 🧾 BUILD TABLE
    // ===============================
    let tableHTML = `
      <h2>${title}</h2>
      <table border="1">
        <tr>
          <th>#</th>
          <th>Applicant Name</th>
          <th>UDID</th>
          <th>Scheme Name</th>
          <th>Status</th>
        </tr>
    `;

    rows.forEach((row, index) => {
      tableHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${row.name}</td>
          <td>${row.udid}</td>
          <td>${row.scheme}</td>
          <td>${row.status}</td>
        </tr>
      `;
    });

    tableHTML += "</table>";

    contentDiv.innerHTML = tableHTML;
  } catch (err) {
    console.error(err);
    contentDiv.innerHTML = "<h2>Error loading data</h2>";
  }
}
