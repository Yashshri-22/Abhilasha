import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

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

// Handle form submission
document.getElementById("contact-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Get form values
    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    // Validate form inputs
    if (!name || !email || !message) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        // Add data to the 'contact' collection in Firestore
        await addDoc(collection(db, "contact"), {
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toISOString() // Add a timestamp for reference
        });

        alert("Your message has been sent successfully!");
        // Clear the form fields
        document.getElementById("contact-form").reset();
    } catch (error) {
        console.error("Error submitting contact form:", error);
        alert("An error occurred while sending your message. Please try again later.");
    }
});
