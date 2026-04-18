const schemesList = [
  {
    id: 1,
    name: "Sanjay Gandhi Niradhar Anudan Yojana",
    desc: "Monthly financial assistance to needy disabled persons.",
    pdf: "scheme1.pdf",
  },
  {
    id: 2,
    name: "Swavalamban Yojana (Self-employment Scheme)",
    desc: "Financial support for self-employment ventures.",
    pdf: "scheme2.pdf",
  },
  {
    id: 3,
    name: "Housing Scheme for Disabled (under PMAY / State Govt)",
    desc: "Allotment of affordable housing units.",
    pdf: "scheme3.pdf",
  },
  {
    id: 4,
    name: "Free Travel Concession Scheme (MSRTC)",
    desc: "Free or concessional travel for disabled persons in state transport buses.",
    pdf: "scheme4.pdf",
  },
  {
    id: 5,
    name: "Scholarship Scheme for Disabled Students",
    desc: "Financial assistance for school/college-going disabled students.",
    pdf: "scheme5.pdf",
  },
  {
    id: 6,
    name: "Niramaya Health Insurance Scheme",
    desc: "Health insurance coverage for persons with developmental disabilities.",
    pdf: "scheme6.pdf",
  },
  {
    id: 7,
    name: "Skill Development Training Scheme for PWDs",
    desc: "Free vocational training programs in various trades.",
    pdf: "scheme7.pdf",
  },
  {
    id: 8,
    name: "Assistance for Purchase of Assistive Devices",
    desc: "Financial support for purchasing prosthetic devices and other assistive aids.",
    pdf: "scheme8.pdf",
  },
  {
    id: 9,
    name: "Free Bus Pass Scheme",
    desc: "Free or concessional travel for disabled individuals in PMPML buses.​",
    pdf: "scheme9.pdf",
  },
  {
    id: 10,
    name: "Financial Assistance for 75% or More Permanent Disability",
    desc: "One-time financial assistance for workers with significant disabilities.​",
    pdf: "scheme10.pdf",
  },
];
async function showContent(title, category) {
  const contentDiv = document.getElementById("content");

  contentDiv.innerHTML = "<h2>Loading...</h2>";

  try {
    // 🔥 Fetch all users (you need this API)
    const res = await fetch("http://13.61.14.149:3000/getAllUsers");
    const users = await res.json();

    console.log("USERS:", users); // 🔥 ADD THIS

    let rows = [];

    users.forEach((user) => {
      const name =
        `${user.personalDetails?.first_name || ""} ${user.personalDetails?.last_name || ""}`.trim() ||
        "N/A";

      const udid =
        user.divyangDetails?.udid || user.personalDetails?.udid || "N/A";

      const schemes = user.appliedSchemes || [];

      schemes.forEach((scheme) => {
        const latestStatus =
          scheme.status?.[scheme.status.length - 1]?.remark ||
          "Application Submitted";

        // 🔥 FIND SCHEME NAME
        const schemeDetails = schemesList.find((s) => s.id === scheme.id);

        const row = {
          name,
          udid,
          scheme: schemeDetails?.name || `Scheme ${scheme.id}`, // ✅ FIXED
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

async function loadDashboardCounts() {
  try {
    const res = await fetch("http://13.61.14.149:3000/getAllUsers");
    const users = await res.json();

    let total = 0;
    let waiting = 0;
    let approved = 0;
    let rejected = 0;

    users.forEach((user) => {
      const schemes = user.appliedSchemes || [];

      schemes.forEach((scheme) => {
        total++;

        const latestStatus =
          scheme.status?.[scheme.status.length - 1]?.remark || "Applied";

        if (latestStatus.toLowerCase().includes("submitted")) {
          waiting++;
        } else if (latestStatus.toLowerCase().includes("approved")) {
          approved++;
        } else if (latestStatus.toLowerCase().includes("rejected")) {
          rejected++;
        }
      });
    });

    // 🔥 UPDATE UI
    document.getElementById("totalCount").innerText = total;
    document.getElementById("waitingCount").innerText = waiting;
    document.getElementById("approvedCount").innerText = approved;
    document.getElementById("rejectedCount").innerText = rejected;
  } catch (err) {
    console.error("Count error:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadDashboardCounts();
});
