// Firebase config and initialization for Expo Go (web SDK)
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB3i0uN32CEuQBxq2fKELvrCl5OJnhsNmE",
    authDomain: "rangbaj-0708.firebaseapp.com",
    projectId: "rangbaj-0708",
    storageBucket: "rangbaj-0708.firebasestorage.app",
    messagingSenderId: "520724746900",
    appId: "1:520724746900:web:edcec554eb2a81bc02da81"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier };
