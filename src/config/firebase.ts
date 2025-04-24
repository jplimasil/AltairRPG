
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAs7LOFwZMnULzOaJWsrNQBvb675y1mFBg",
  authDomain: "altair-43d32.firebaseapp.com",
  projectId: "altair-43d32",
  storageBucket: "altair-43d32.firebasestorage.app",
  messagingSenderId: "175219541665",
  appId: "1:175219541665:web:ed13553077579fc29512e0",
  measurementId: "G-CDXY6NHY1C"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
