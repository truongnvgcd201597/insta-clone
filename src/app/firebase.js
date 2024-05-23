// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBNv2_EpQLx_RIxfmLI7zJfvGlDvkXYagQ",
  authDomain: "cloneapp-20c2b.firebaseapp.com",
  projectId: "cloneapp-20c2b",
  storageBucket: "cloneapp-20c2b.appspot.com",
  messagingSenderId: "937168635407",
  appId: "1:937168635407:web:59622b310121db6647457a",
  measurementId: "G-1BDYP763RL",
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db };
