window.addEventListener("DOMContentLoaded", function () {
    initializeProgressTracking();
    initializeEventListeners();
    updateProgressBar();
});

// Initialize progress tracking for all sections
function initializeProgressTracking() {
    const sections = ["personal", "education", "document", "bank", "divyang", "question"];
    const progressData = JSON.parse(localStorage.getItem("progressData")) || {};

    sections.forEach(section => {
        if (!progressData[section]) {
            progressData[section] = false; // Mark section as incomplete by default
        }
    });

    localStorage.setItem("progressData", JSON.stringify(progressData));
    updateProgressBar();
}

// Update the progress bar based on completed sections
function updateProgressBar() {
    const progressData = JSON.parse(localStorage.getItem("progressData")) || {};
    const totalSections = Object.keys(progressData).length;
    const completedSections = Object.values(progressData).filter(isComplete => isComplete).length;

    const progress = Math.round((completedSections / totalSections) * 100);
    document.getElementById("progress-bar").style.width = `${progress}%`;
    document.getElementById("progress-text").textContent = `Profile Completion: ${progress}%`;
}

// Initialize event listeners for iframe communication and card toggling
function initializeEventListeners() {
    window.addEventListener("message", function (event) {
        if (event.data && event.data.section) {
            markSectionAsComplete(event.data.section);

            // Log data received from iframes
            if (event.data.section === "education") {
                console.log("Education Data:", event.data.data); // Store or process as needed
            } else if (event.data.section === "document") {
                console.log("Document Data:", event.data.data); // Store or process as needed
            }
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

// Mark a section as complete and update the progress bar
function markSectionAsComplete(section) {
    const progressData = JSON.parse(localStorage.getItem("progressData")) || {};
    progressData[section] = true; // Mark the section as complete
    localStorage.setItem("progressData", JSON.stringify(progressData));
    updateProgressBar();
}

// Reset the profile, clearing all progress and data
function resetProfile() {
    if (confirm("Are you sure you want to reset your profile?")) {
        localStorage.removeItem("progressData");
        initializeProgressTracking();

        // Reset progress bar
        document.getElementById("progress-bar").style.width = "0%";
        document.getElementById("progress-text").textContent = "Profile Completion: 0%";

        // Reload all iframes to reset their content
        document.querySelectorAll("iframe").forEach(iframe => {
            iframe.contentWindow.location.reload();
        });

        alert("Profile has been reset!");
    }
}

