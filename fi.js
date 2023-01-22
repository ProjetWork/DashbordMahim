// Import the functions you need from the SDKs you nee
import {initializeApp} from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAd2Mbqj0P8QUzuqksXgpVLCvD0np5Cm30",
  authDomain: "guicart-1581b.firebaseapp.com",
  projectId: "guicart-1581b",
  storageBucket: "guicart-1581b.appspot.com",
  messagingSenderId: "134611960314",
  appId: "1:134611960314:web:e36f40c849275222b82443"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app