window.addEventListener("DOMContentLoaded", function () {
    initializeProgressTracking();
    initializeEventListeners();
    updateProgressBar();
});

const currentUserId = localStorage.getItem("currentUserId"); // Ensure this is set during login/signup
const key = `progressData_${currentUserId}`;

// Initialize progress tracking for all sections
function initializeProgressTracking() {
    let progressData = JSON.parse(localStorage.getItem(key));

    if (!progressData) {
        progressData = {
            personal: false,
            education: false,
            document: false,
            bank: false,
            divyang: false,
            question: false
        };
        localStorage.setItem(key, JSON.stringify(progressData));
    }

    updateProgressBar();
}

// Update the progress bar based on completed sections
function updateProgressBar() {
    const progressData = JSON.parse(localStorage.getItem(key)) || {};
    const totalSections = ["personal", "education", "document", "bank", "divyang", "question"];

    totalSections.forEach(section => {
        if (!(section in progressData)) {
            progressData[section] = false;
        }
    });

    localStorage.setItem(key, JSON.stringify(progressData));

    const completedSections = totalSections.filter(section => progressData[section]);
    const progress = Math.round((completedSections.length / totalSections.length) * 100);

    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    if (progressBar && progressText) {
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Profile Completion: ${progress}%`;
    }

    console.log("Progress Data:", progressData);
    console.log("Completed Sections:", completedSections.length);
}

// Mark a section as complete and update the progress bar
function markSectionAsComplete(section) {
    const progressData = JSON.parse(localStorage.getItem(key)) || {};

    if (!progressData[section]) {
        progressData[section] = true;
        localStorage.setItem(key, JSON.stringify(progressData));
        updateProgressBar();
    }
}

// Reset the profile, clearing all progress and data
function resetProfile() {
    if (confirm("Are you sure you want to reset your profile?")) {
        localStorage.removeItem(key);
        initializeProgressTracking();

        document.getElementById("progress-bar").style.width = "0%";
        document.getElementById("progress-text").textContent = "Profile Completion: 0%";

        document.querySelectorAll("iframe").forEach(iframe => {
            iframe.contentWindow.location.reload();
        });

        alert("Profile has been reset!");
    }
}

// Same listener logic stays unchanged
function initializeEventListeners() {
    window.addEventListener("message", function (event) {
        if (event.data && event.data.section) {
            markSectionAsComplete(event.data.section);
        }
    });

    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", function () {
            const details = this.querySelector(".details");
            const toggleIcon = this.querySelector(".toggle-icon");

            if (details.style.display === "block") {
                details.style.display = "none";
                toggleIcon.textContent = "+";
            } else {
                document.querySelectorAll(".details").forEach(section => section.style.display = "none");
                document.querySelectorAll(".toggle-icon").forEach(icon => icon.textContent = "+");
                details.style.display = "block";
                toggleIcon.textContent = "-";
            }
        });
    });

    const resetBtn = document.getElementById("reset-btn");
    if (resetBtn) {
        resetBtn.addEventListener("click", resetProfile);
    }
}
