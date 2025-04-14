document.addEventListener("DOMContentLoaded", function () {
    const bannerButton = document.getElementById("new_registration");

    const newRegistrationCard = document.getElementById("option1");
    const disabledLoginCard = document.getElementById("option2");
    const infoCard = document.getElementById("option3");
    const donateCard = document.getElementById("option4");

    const registerDown = document.querySelector(".register-btn");
    const donateDown = document.querySelector(".donate-btn");

    if (bannerButton) {
        console.log("Button found:", bannerButton);

        bannerButton.addEventListener("click", function () {
            window.location.href = "../Login/register.html";
        });
    } else {
        console.error("Button not found!");
    }

    if (newRegistrationCard) {
        console.log("Button found:", newRegistrationCard);

        newRegistrationCard.addEventListener("click", function () {
            window.location.href = "../Login/register.html";
        });
    } else {
        console.error("Button not found!");
    }

    if (disabledLoginCard) {
        console.log("Button found:", disabledLoginCard);

        disabledLoginCard.addEventListener("click", function () {
            window.location.href = "../Login/login.html";
        });
    } else {
        console.error("Button not found!");
    }

    if (infoCard) {
        console.log("Button found:", infoCard);

        infoCard.addEventListener("click", function () {
            window.location.href = "../information_home/information.html";
        });
    } else {
        console.error("Button not found!");
    }

    if (donateCard) {
        console.log("Button found:", donateCard);

        donateCard.addEventListener("click", function () {
            window.location.href = "../donation/donate.html";
        });
    } else {
        console.error("Button not found!");
    }

    if (registerDown) {
        console.log("Button found:", registerDown);

        registerDown.addEventListener("click", function () {
            window.location.href = "../Login/register.html";
        });
    } else {
        console.error("Button not found!");
    }

    if (donateDown) {
        console.log("Button found:", donateDown);

        donateDown.addEventListener("click", function () {
            window.location.href = "../donation/donate.html";
        });
    } else {
        console.error("Button not found!");
    }

});
