    /**
 * Crée un identifiant unique pour une conversation entre deux utilisateurs.
 * 
 * @param {string} userId1 - L'identifiant du premier utilisateur.
 * @param {string} userId2 - L'identifiant du second utilisateur.
 * @return {string} - Un identifiant unique pour la conversation.
 */
    export function createUniqueTransactionId(userId1, userId2) {
        const ids = [userId1, userId2].sort();
        const baseId = ids.join('_TR_');
        // Ajouter un timestamp ou un identifiant unique (comme un UUID) à baseId
        const uniqueSuffix = Date.now(); // Utiliser le timestamp actuel comme suffixe
        return `${baseId}_${uniqueSuffix}`;
    }