// Import the Firebase SDK and Firestore services
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjboL8pJMcTgLClc8KCit7NMpVae-yCZI",
  authDomain: "homework-9e71b.firebaseapp.com",
  projectId: "homework-9e71b",
  storageBucket: "homework-9e71b.appspot.com",
  messagingSenderId: "157267925561",
  appId: "1:157267925561:web:64e8e78bd6b6917cff4be8",
  measurementId: "G-R2SL8K9RD9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get the form element
const form = document.getElementById("homework-form");

// Add event listener to form submission
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  // Get form data
  const subject = document.getElementById("subject").value;
  const homework = document.getElementById("homework").value;
  const studentName = document.getElementById("studentName").value;

  // Create JSON object with the form data
  const homeworkData = {
    subject: subject,
    homework: homework,
    studentName: studentName,
    timestamp: new Date().toISOString() // Store current time as timestamp
  };

  try {
    // Save the data to Firestore
    await addDoc(collection(db, "homework"), homeworkData);

    // Reset the form after successful submission
    form.reset();
    alert("Homework submitted successfully!");

  } catch (error) {
    console.error("Error submitting homework:", error);
    alert("Error submitting homework. Please try again.");
  }
});

