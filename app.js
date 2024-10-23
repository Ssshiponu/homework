// Initialize Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "gs://homework-9e71b.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();

// Handle form submission
document.getElementById('homeworkForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const subject = document.getElementById('subject').value;
    const homeworkText = document.getElementById('homeworkText').value;
    const file = document.getElementById('homeworkFile').files[0];

    if (!subject || !homeworkText || !file) {
        alert('Please fill all the fields and upload a file.');
        return;
    }

    try {
        // Upload file to Firebase Storage
        const storageRef = storage.ref('homework_files/' + file.name);
        const snapshot = await storageRef.put(file);
        const fileUrl = await snapshot.ref.getDownloadURL();

        // Create JSON object for submission
        const homeworkData = {
            subject: subject,
            homeworkText: homeworkText,
            fileName: file.name,
            fileUrl: fileUrl,
            uploadedAt: new Date().toISOString()
        };

        // Save JSON file data to Firestore
        await db.collection('homework').add(homeworkData);

        // Update UI with the new homework
        addHomeworkToUI(homeworkData);

        // Clear form after submission
        document.getElementById('homeworkForm').reset();
        alert('Homework submitted successfully!');

    } catch (error) {
        console.error("Error uploading homework: ", error);
        alert('Error submitting homework. Please try again.');
    }
});

// Function to add the submitted homework to the UI
function addHomeworkToUI(homeworkData) {
    const homeworkList = document.getElementById('homeworkList');
    const li = document.createElement('li');
    li.innerHTML = `
        <strong>Subject:</strong> ${homeworkData.subject} <br>
        <strong>Details:</strong> ${homeworkData.homeworkText} <br>
        <strong>File:</strong> <a href="${homeworkData.fileUrl}" target="_blank">${homeworkData.fileName}</a>
    `;
    homeworkList.appendChild(li);
}

// Load previously submitted homework on page load
window.addEventListener('load', async function () {
    const homeworkList = document.getElementById('homeworkList');
    homeworkList.innerHTML = ''; // Clear the list before populating

    try {
        const querySnapshot = await db.collection('homework').orderBy('uploadedAt', 'desc').get();
        querySnapshot.forEach((doc) => {
            const homeworkData = doc.data();
            addHomeworkToUI(homeworkData);
        });
    } catch (error) {
        console.error("Error loading homework: ", error);
        alert('Error loading homework.');
    }
});
