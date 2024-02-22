import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '/firebase-config'; // Assurez-vous que ce chemin est correct

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true); // Ajout de l'état de chargement

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setLoading(false); // Définit loading sur false une fois l'état d'authentification résolu
        });

        return unsubscribe;
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Ou tout autre indicateur de chargement que vous préférez
    }

    return (
        <AuthContext.Provider value={{ currentUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
