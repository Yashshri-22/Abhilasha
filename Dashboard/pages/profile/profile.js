window.addEventListener("DOMContentLoaded", function () {
    loadProfileData(); // Load data from local storage if available
});

// Toggle visibility of section details when clicking on a card
function toggleSection(id, event) {
    let section = document.getElementById(id);
    
    // Prevent closing when clicking inside form elements
    if (event.target.tagName === "INPUT" || event.target.tagName === "SELECT" || event.target.tagName === "BUTTON") {
        return; 
    }

    section.style.display = section.style.display === "block" ? "none" : "block";
}

// Function to toggle section visibility
function toggleSectionVisibility(sectionId) {
    let section = document.getElementById(sectionId);
    section.style.display = section.style.display === "none" ? "block" : "none";
}

// Individual toggle functions for each section
function toggleEducationSection() { toggleSectionVisibility("education-details"); }
function togglePersonalSection() { toggleSectionVisibility("personal-details"); }
function toggleDocumentSection() { toggleSectionVisibility("document-details"); }
function toggleBankSection() { toggleSectionVisibility("bank-details"); }
function toggleDivyangSection() { toggleSectionVisibility("divyang-details"); }

// Save user input dynamically and update the progress bar
document.querySelectorAll(".details input, .details select").forEach(input => {
    input.addEventListener("input", function () {
        saveProfileData();
        updateProgressBar();
    });
});

window.addEventListener("message", function (event) {
    if (event.data === "sectionSaved") {
        updateProgressBar();
    }
});

function updateProgressBar() {
    let totalSections = 5;
    let completedSections = 0;

    document.querySelectorAll(".details iframe").forEach(iframe => {
        if (iframe.contentWindow.document.querySelector("input, select")) {
            let inputs = iframe.contentWindow.document.querySelectorAll("input, select");
            let isFilled = Array.from(inputs).some(input => input.value.trim() !== "");
            if (isFilled) {
                completedSections++;
            }
        }
    });

    let progress = Math.round((completedSections / totalSections) * 100);
    document.getElementById("progress-bar").style.width = progress + "%";
    document.getElementById("progress-text").textContent = `Profile Completion: ${progress}%`;
}


document.querySelectorAll(".details iframe").forEach(iframe => {
    iframe.addEventListener("load", function () {
        updateProgressBar(); // Recalculate progress when an iframe loads
    });
});


// Add event listeners to all Save buttons
document.querySelectorAll(".save-btn").forEach(button => {
    button.addEventListener("click", () => {
        saveProfileData();
        updateProgressBarOnSave();
    });
});

// Save data to local storage
function saveProfileData() {
    let profileData = {};
    document.querySelectorAll(".details input, .details select").forEach(input => {
        profileData[input.id] = input.value.trim();
    });
    localStorage.setItem("profileData", JSON.stringify(profileData));
}

// Load data from local storage (if available)
function loadProfileData() {
    let savedData = localStorage.getItem("profileData");
    if (savedData) {
        savedData = JSON.parse(savedData);
        document.querySelectorAll(".details input, .details select").forEach(input => {
            input.value = savedData[input.id] || "";
        });
        updateProgressBar();
    }
}

// Reset Profile: Clears all input fields and resets progress
let resetBtn = document.getElementById("reset-btn");
if (resetBtn) {
    resetBtn.addEventListener("click", function () {
        if (confirm("Are you sure you want to reset your profile?")) {
            document.querySelectorAll(".details input, .details select").forEach(input => {
                input.value = "";
            });

            // Reset progress bar
            document.getElementById("progress-bar").style.width = "0%";
            document.getElementById("progress-text").textContent = "Profile Completion: 0%";

            // Hide all details sections
            document.querySelectorAll(".details").forEach(section => {
                section.style.display = "none";
            });

            // Clear local storage
            localStorage.clear();
            alert("Profile has been reset!");
        }
    });
}

