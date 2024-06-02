import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { initializeAuth } from "firebase/auth" // Menghapus import getReactNativePersistence
import { useRouter } from 'next/router'; // Tambahkan import router jika diperlukan

const firebaseConfig = {
    apiKey: "AIzaSyCK75dqXrZjXqYVu2ay39jG2Dy93SmS6Y8",
    authDomain: "bikerent-b54ac.firebaseapp.com",
    projectId: "bikerent-b54ac",
    storageBucket: "bikerent-b54ac.appspot.com",
    messagingSenderId: "430696720799",
    appId: "1:430696720799:web:d31602fa9ec9a6fa5b35aa",
    measurementId: "G-R2YF7GNTFR"
};

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// Inisialisasi Firebase Firestore
export const firestore = getFirestore(app)

// Inisialisasi Firebase Storage
export const storage = getStorage(app)

// Inisialisasi Firebase Authentication
export const firebaseAuth = initializeAuth(app)
