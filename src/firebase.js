import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const app = initializeApp({
    apiKey: "AIzaSyDkyRekmPrjvcURm6lLpMxsRgSAMthz6No",
    authDomain: "viajemos-9b1f2.firebaseapp.com",
    projectId: "viajemos-9b1f2",
    storageBucket: "viajemos-9b1f2.appspot.com",
    messagingSenderId: "802080946703",
    appId: "1:802080946703:web:6569d8ee2a7da7cee6817a",
    measurementId: "G-LXE3GDMP65"
});

export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);