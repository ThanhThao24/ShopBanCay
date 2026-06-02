import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDoCBGUssESzk1w4w-XYtmTLmf7WIbC9kM",
  authDomain: "mamxanh-92c22.firebaseapp.com",
  projectId: "mamxanh-92c22",
  storageBucket: "mamxanh-92c22.firebasestorage.app",
  messagingSenderId: "977846873483",
  appId: "1:977846873483:web:d81945a46a3f2e2c1ed38e",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export { collection, getDocs, addDoc, updateDoc, deleteDoc, doc };

console.log("Firebase connected");
