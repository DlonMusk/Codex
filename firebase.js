import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBooUSRM9jWPuujZtfRybxChW-_LyvwPFg",
    authDomain: "codex-52931.firebaseapp.com",
    projectId: "codex-52931",
    storageBucket: "codex-52931.appspot.com",
    messagingSenderId: "322005917022",
    appId: "1:322005917022:web:d1e747da38f7f4f8a183cf"
  };


const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, db };
