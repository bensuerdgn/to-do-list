import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAXATm41cLfS_tYZvGY8NF9Fu6fEz9KMp0",
    authDomain: "todos-48d76.firebaseapp.com",
    projectId: "todos-48d76",
    storageBucket: "todos-48d76.appspot.com",
    messagingSenderId: "723493050528",
    appId: "1:723493050528:web:3fdbb5c0e671b011b391c5"
}

const db = firebase.initializeApp(config);
export default db;