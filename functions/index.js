/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

// Exemple d'une fonction Cloud pour supprimer les conversations après 15 jours
exports.deleteOldConversations = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
    const now = Date.now();
    const cutoff = now - 15 * 24 * 60 * 60 * 1000; // 15 jours en millisecondes
    const oldConversationsRef = admin.database().ref('/conversations').orderByChild('timestamp').endAt(cutoff);

    const snapshot = await oldConversationsRef.once('value');
    const updates = {};

    snapshot.forEach(child => {
        updates[child.key] = null;
    });

    return admin.database().ref('/conversations').update(updates);
});






