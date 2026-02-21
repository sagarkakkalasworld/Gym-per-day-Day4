import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

//get firebase credentials from Firebase App/Video
const firebaseConfig = {
  apiKey: "AIzaSyC6XXftfp0bi91bcJ7v_jWUW1J0MCkgqe0",
  authDomain: "gym-per-day.firebaseapp.com",
  projectId: "gym-per-day",
  storageBucket: "gym-per-day.firebasestorage.app",
  messagingSenderId: "673984150298",
  appId: "1:673984150298:web:fa6801c8a9e08f241acaa3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
