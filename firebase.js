// ============================================
// Firebase Configuration & Initialization
// Muhammad Ayan Portfolio
// ============================================

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD3YIbaiYst5va4y1Sazv677uLS_u8G7IY",
    authDomain: "muhammad-ayan-official.firebaseapp.com",
    projectId: "muhammad-ayan-official",
    storageBucket: "muhammad-ayan-official.firebasestorage.app",
    messagingSenderId: "153710075837",
    appId: "1:153710075837:web:cea0ba71f7abf472cb7cd4",
    measurementId: "G-RVYWGRHMHJ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Services
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence (for better performance)
db.enablePersistence()
    .then(() => {
        console.log('✅ Firebase offline persistence enabled');
    })
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
            console.warn('⚠️ The current browser does not support persistence.');
        }
    });

// Firestore Settings (optional - for better performance)
db.settings({
    // Uncomment if you want to use cache
    // merge: true
});

console.log('🔥 Firebase initialized successfully');

// ============================================
// Helper Functions (Optional - can be used across pages)
// ============================================

// Get all projects
async function getProjects() {
    try {
        const snapshot = await db.collection('projects')
            .orderBy('createdAt', 'desc')
            .get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting projects:', error);
        return [];
    }
}

// Add a new project
async function addProject(projectData) {
    try {
        const docRef = await db.collection('projects').add({
            ...projectData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('✅ Project added with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error adding project:', error);
        throw error;
    }
}

// Update a project
async function updateProject(projectId, projectData) {
    try {
        await db.collection('projects').doc(projectId).update({
            ...projectData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('✅ Project updated:', projectId);
    } catch (error) {
        console.error('Error updating project:', error);
        throw error;
    }
}

// Delete a project
async function deleteProject(projectId) {
    try {
        await db.collection('projects').doc(projectId).delete();
        console.log('✅ Project deleted:', projectId);
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
}

// Get all messages
async function getMessages() {
    try {
        const snapshot = await db.collection('messages')
            .orderBy('createdAt', 'desc')
            .get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting messages:', error);
        return [];
    }
}

// Add a contact message
async function addMessage(messageData) {
    try {
        const docRef = await db.collection('messages').add({
            ...messageData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            read: false
        });
        console.log('✅ Message added with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error adding message:', error);
        throw error;
    }
}

// Mark message as read
async function markMessageAsRead(messageId) {
    try {
        await db.collection('messages').doc(messageId).update({
            read: true
        });
        console.log('✅ Message marked as read:', messageId);
    } catch (error) {
        console.error('Error marking message as read:', error);
        throw error;
    }
}

// Delete a message
async function deleteMessage(messageId) {
    try {
        await db.collection('messages').doc(messageId).delete();
        console.log('✅ Message deleted:', messageId);
    } catch (error) {
        console.error('Error deleting message:', error);
        throw error;
    }
}

// Get dashboard stats
async function getDashboardStats() {
    try {
        const [projectSnapshot, messageSnapshot] = await Promise.all([
            db.collection('projects').get(),
            db.collection('messages').get()
        ]);
        
        let unreadCount = 0;
        messageSnapshot.forEach(doc => {
            if (!doc.data().read) unreadCount++;
        });
        
        return {
            totalProjects: projectSnapshot.size,
            totalMessages: messageSnapshot.size,
            unreadMessages: unreadCount
        };
    } catch (error) {
        console.error('Error getting stats:', error);
        return {
            totalProjects: 0,
            totalMessages: 0,
            unreadMessages: 0
        };
    }
}

// Authentication helpers
async function signIn(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('✅ User signed in:', userCredential.user.email);
        return userCredential.user;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
}

async function signOut() {
    try {
        await auth.signOut();
        console.log('✅ User signed out');
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}

// Auth state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('👤 User is signed in:', user.email);
    } else {
        console.log('👤 No user signed in');
    }
});

console.log('📦 Firebase helpers loaded successfully');
