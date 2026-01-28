import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB66l7kiSULtnQAvjHv2zM1nCpHQNStGTg",
  authDomain: "clubsync-f5b44.firebaseapp.com",
  projectId: "clubsync-f5b44",
  storageBucket: "clubsync-f5b44.firebasestorage.app",
  messagingSenderId: "757994749709",
  appId: "1:757994749709:web:f7c5509723d3917fe6ba44"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
