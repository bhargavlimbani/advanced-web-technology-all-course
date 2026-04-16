// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByeF9cTJ-4xyk8A5-I3RVhkD4lWZB8tes",
  authDomain: "curd-app-e6f34.firebaseapp.com",
  projectId: "curd-app-e6f34",
  storageBucket: "curd-app-e6f34.firebasestorage.app",
  messagingSenderId: "342045186865",
  appId: "1:342045186865:web:278f03327b30b860beee10",
//   measurementId: "G-ZLRZY7WL9P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);