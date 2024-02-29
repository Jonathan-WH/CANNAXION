    /**
 * Crée un identifiant unique pour une conversation entre deux utilisateurs.
 * 
 * @param {string} userId1 - L'identifiant du premier utilisateur.
 * @param {string} userId2 - L'identifiant du second utilisateur.
 * @return {string} - Un identifiant unique pour la conversation.
 */
   export function createConversationId(userId1, userId2) {
        // Assurez-vous que l'ordre des ID est toujours le même pour une paire donnée
        const ids = [userId1, userId2].sort();
        return ids.join('_');
    }