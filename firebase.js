import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: "AIzaSyCFcAzIbkyu33GuRAS_oYtc6IUlmxqFEdM",
  authDomain: "evnt-320a0.firebaseapp.com",
  projectId: "evnt-320a0",
  storageBucket: "evnt-320a0.firebasestorage.app",
  messagingSenderId: "146980889296",
  appId: "1:146980889296:web:85312e3d4a0c3f396d74d5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const fetchData = async () => {
  if (auth.currentUser) {  // Ensure the user is authenticated
    const querySnapshot = await getDocs(collection(db, "EventManagement"));
    querySnapshot.forEach(doc => {
      console.log(doc.id, "=>", doc.data());
    });
  } else {
    console.error("User is not authenticated.");
  }
};

fetchData();