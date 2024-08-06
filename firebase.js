// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBynJCA5FycE5IM1xDeOETAEzbiMvmpjk0",
  authDomain: "inventory-management-8545e.firebaseapp.com",
  projectId: "inventory-management-8545e",
  storageBucket: "inventory-management-8545e.appspot.com",
  messagingSenderId: "564640254554",
  appId: "1:564640254554:web:42fb713b878fec3d24a663"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export {firestore}