// Firebase configuration
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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Handle form submission
document.getElementById('homeworkForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const subject = document.getElementById('subject').value;
    const homeworkText = document.getElementById('homework').value;

    // Save homework to Firestore
    try {
        await db.collection("homework").add({
            subject: subject,
            homework: homeworkText,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        document.getElementById('subject').value = '';
        document.getElementById('homework').value = '';

        alert('Homework submitted successfully!');
        loadHomework(); // Reload the homework list
    } catch (error) {
        console.error("Error adding homework: ", error);
    }
});

// Function to load homework from Firestore
async function loadHomework() {
    const homeworkList = document.getElementById('list');
    homeworkList.innerHTML = ''; // Clear previous list

    try {
        const snapshot = await db.collection("homework").orderBy('timestamp', 'desc').get();
        snapshot.forEach(doc => {
            const homeworkData = doc.data();
            const listItem = document.createElement('div');
            listItem.classList.add('homework-item');
            listItem.innerHTML = `<strong>${homeworkData.subject}</strong>: ${homeworkData.homework}`;
            homeworkList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error loading homework: ", error);
    }
}

// Load homework on page load
window.onload = function() {
    loadHomework();
};


