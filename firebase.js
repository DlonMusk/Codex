import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDUthu9Dafdl_kO39eeXSX3joKaY0vgKW0",
    authDomain: "netflix-clone-8dfa6.firebaseapp.com",
    projectId: "netflix-clone-8dfa6",
    storageBucket: "netflix-clone-8dfa6.appspot.com",
    messagingSenderId: "113807289376",
    appId: "1:113807289376:web:02d093510a9df01da2a045"
};


const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, db };
