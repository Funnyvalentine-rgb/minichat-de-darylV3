// Importez les fonctions nécessaires des SDK Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';

// Votre configuration Firebase pour l'application web
const firebaseConfig = {
    apiKey: "AIzaSyDsOcQqhENpqAx7hc02P8Cw3gN_ZAggT7c",
    authDomain: "minichat-12e2b.firebaseapp.com",
    projectId: "minichat-12e2b",
    storageBucket: "minichat-12e2b.firebasestorage.app",
    messagingSenderId: "172702880829",
    appId: "1:172702880829:web:0cec5236fbac7611a58654",
    measurementId: "G-B1DYJHDZGK"
};

// Initialisez Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Envoyer un message
async function sendMessage() {
    const message = document.getElementById('message-input').value;
    if (!message) return;

    // Utilisation de addDoc avec la syntaxe modulaire
    await addDoc(collection(db, "messages"), {
        username: localStorage.getItem('username'),
        avatar: localStorage.getItem('avatar'),
        text: message,
        timestamp: serverTimestamp() // Utilisation de serverTimestamp modulaire
    });
    document.getElementById('message-input').value = '';
}

// Charger les messages
function loadMessages() {
    // Créez une requête pour votre collection de messages, triée par horodatage
    const messagesQuery = query(collection(db, "messages"), orderBy("timestamp", "asc"));

    // Écoutez les changements en temps réel
    onSnapshot(messagesQuery, (snapshot) => {
            const chatBox = document.getElementById('chat-box');
            chatBox.innerHTML = '';
            snapshot.forEach(doc => {
                const msg = doc.data();
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message';
                messageDiv.innerHTML = `
                    ${msg.avatar ? `<img src="${msg.avatar}" class="user-avatar">` : ''}
                    <strong>${msg.username}</strong>: ${msg.text}
                `;
                chatBox.appendChild(messageDiv);
            });
            chatBox.scrollTop = chatBox.scrollHeight;
        });
}
