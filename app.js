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
const storage = firebase.storage();

// Handle form submission
document.getElementById('homeworkForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const subject = document.getElementById('subject').value;
    const homeworkText = document.getElementById('homeworkText').value;
    const fileInput = document.getElementById('homeworkFile');
    const file = fileInput.files[0];
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Show loading message
    loadingMessage.style.display = 'block';
    errorMessage.style.display = 'none';

    // Upload file to Firebase Storage
    try {
        const fileRef = storage.ref(`homework/${file.name}`);
        await fileRef.put(file);
        const fileURL = await fileRef.getDownloadURL();

        // Save homework to Firestore
        await db.collection("homework").add({
            subject: subject,
            homework: homeworkText,
            fileURL: fileURL,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Clear form fields
        document.getElementById('homeworkForm').reset();
        loadingMessage.style.display = 'none';
        alert('Homework submitted successfully!');
        loadHomework(); // Reload the homework list
    } catch (error) {
        loadingMessage.style.display = 'none';
        errorMessage.innerText = `Error adding homework: ${error.message}`;
        errorMessage.style.display = 'block';
    }
});

// Function to load homework from Firestore
async function loadHomework() {
    const homeworkList = document.getElementById('homeworkList');
    homeworkList.innerHTML = ''; // Clear previous list

    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.style.display = 'block'; // Show loading message

    try {
        const snapshot = await db.collection("homework").orderBy('timestamp', 'desc').get();
        snapshot.forEach(doc => {
            const homeworkData = doc.data();
            const listItem = document.createElement('li'); // Changed to <li> for list consistency
            listItem.innerHTML = `<strong>${homeworkData.subject}</strong>: ${homeworkData.homework} <br/> <a href="${homeworkData.fileURL}" target="_blank">Download File</a>`;
            homeworkList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error loading homework: ", error);
    } finally {
        loadingMessage.style.display = 'none'; // Hide loading message
    }
}

// Load homework on page load
window.onload = function() {
    loadHomework();
};
