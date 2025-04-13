import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAkxeSRcylugPQdhABCFmWmTUYFQ868aDE",
    authDomain: "abhilasha-fdbc0.firebaseapp.com",
    projectId: "abhilasha-fdbc0",
    storageBucket: "abhilasha-fdbc0.firebasestorage.app",
    messagingSenderId: "11075472828",
    appId: "1:11075472828:web:ed0a46285d259760f32fb9",
    measurementId: "G-H49EPQK1PQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("donateButton").addEventListener("click", function (e) {
    e.preventDefault(); // Prevent form submission

    const qrDialog = document.getElementById("qrDialog");
    const blurOverlay = document.getElementById("blurOverlay");
    if (qrDialog && blurOverlay) {
        qrDialog.style.display = "block"; // Show the QR code dialog
        blurOverlay.style.display = "block"; // Show the blurred background
    } else {
        alert("QR code dialog or blur overlay not found!");
    }
});

function closeQRDialog() {
    const qrDialog = document.getElementById("qrDialog");
    const blurOverlay = document.getElementById("blurOverlay");
    if (qrDialog && blurOverlay) {
        qrDialog.style.display = "none"; // Hide the QR code dialog
        blurOverlay.style.display = "none"; // Hide the blurred background
    }
}

document.getElementById("closeQRButton").addEventListener("click", closeQRDialog);

// Add event listener for the "Done" button
document.getElementById("doneButton").addEventListener("click", async function () {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const amount = document.getElementById("amount").value;
    const message = document.getElementById("message").value;

    if (!name || !email || !amount) {
        alert("Please fill in all required fields.");
        return;
    }

    try {
        // Add donation data to Firebase
        await addDoc(collection(db, "donations"), {
            name: name,
            email: email,
            amount: parseFloat(amount),
            message: message || "",
            timestamp: new Date()
        });

        alert("Thank you for your support!"); // Show thank-you message
        closeQRDialog(); // Close the dialog
        document.getElementById("donation-form").reset(); // Reset the form
    } catch (error) {
        console.error("Error adding donation: ", error);
        alert("An error occurred while processing your donation. Please try again.");
    }
});
