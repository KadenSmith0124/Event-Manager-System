import { getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFcAzIbkyu33GuRAS_oYtc6IUlmxqFEdM",
  authDomain: "evnt-320a0.firebaseapp.com",
  projectId: "evnt-320a0",
  storageBucket: "evnt-320a0.firebasestorage.app",
  messagingSenderId: "146980889296",
  appId: "1:146980889296:web:85312e3d4a0c3f396d74d5"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const fetchData = async () => {
  const querySnapshot = await getDocs(collection(db, "EventManagement"));
  querySnapshot.forEach(doc => {
    console.log(doc.id, "=>", doc.data());
  });
};

fetchData();