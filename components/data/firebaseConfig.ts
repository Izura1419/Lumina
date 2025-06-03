import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAHN803_xaNOYKYZrDjRfmkhcelGFg08rk",
    authDomain: "lumina-a948b.firebaseapp.com",
    projectId: "lumina-a948b",
    storageBucket: "lumina-a948b.firebasestorage.app",
    messagingSenderId: "711439690799",
    appId: "1:711439690799:web:d5ae7b4fbaa0a26752aada"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
