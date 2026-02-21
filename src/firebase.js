import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

//get firebase credentials from Firebase App/Video
const firebaseConfig = {
  apiKey: "${{ secrets.API_KEY }}",
  authDomain: "${{ secrets.AUTH_DOMAIN }}",
  projectId: "${{ secrets.PROJECT_ID }}",
  storageBucket: "${{ secrets.STORAGE_BUCKET }}",
  messagingSenderId: "${{ secrets.MSG_ID }}",
  appId: "${{ secrets.APP_ID }}""
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
