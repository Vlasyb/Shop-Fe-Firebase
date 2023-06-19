import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBd9cxjYK9P2WdxdR6gPMbG-Zxfqij64dw",
	authDomain: "react-final-project-e4305.firebaseapp.com",
	projectId: "react-final-project-e4305",
	storageBucket: "react-final-project-e4305.appspot.com",
	messagingSenderId: "105526308414",
	appId: "1:105526308414:web:96e180a923ad7dc0412b6f",
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
