// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASS0r1JJq85AqXeFlFljigvfzWdXJO5VA",
  authDomain: "mapa-pcdf-ese.firebaseapp.com",
  projectId: "mapa-pcdf-ese",
  storageBucket: "mapa-pcdf-ese.firebasestorage.app",
  messagingSenderId: "811620235156",
  appId: "1:811620235156:web:bcc8e58bcae5744b660181",
  measurementId: "G-1FE17M3RZC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);