import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '/src/components/Myauthcontext'; // Assurez-vous que le chemin d'importation est correct

const ProtectedRoute = () => {
    const { currentUser, loading } = useAuth(); // Ajoutez loading à la déstructuration

    if (loading) {
        return <div>Loading...</div>; // Affichez un indicateur de chargement ou null selon votre UX
    }

    return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
