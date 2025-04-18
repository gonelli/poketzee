// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: process.env.FIREBASE_APP_API_KEY,
//     authDomain: process.env.FIREBASE_APP_AUTH_DOMAIN,
//     projectId: process.env.FIREBASE_APP_PROJECT_ID,
//     storageBucket: process.env.FIREBASE_APP_STORAGE_BUCKET,
//     messagingSenderId: process.env.FIREBASE_APP_MESSAGING_SENDER_ID,
//     appId: process.env.FIREBASE_APP_APP_ID,
//     measurementId: process.env.FIREBASE_APP_MEASUREMENT_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// alert("Script is running successfully!");

document.addEventListener('DOMContentLoaded', function() {
    const gameDiv = document.getElementById('gameDiv');
    if (gameDiv) {
        gameDiv.style.backgroundColor = '#d4e6f1'; // blue = js working
    }

    const pokeSquares = document.querySelectorAll('.pokeSquare');
    pokeSquares.forEach(square => {
        // Add egg image to each pokeSquare
        const img = document.createElement('img');
        img.src = 'assets/egg.png';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        square.appendChild(img);

        square.addEventListener('click', function() {
            this.classList.toggle('pokeSquare-active');
        });
    });
});

document.addEventListener('dblclick', function(event) {
    event.preventDefault();
}, { passive: false });
