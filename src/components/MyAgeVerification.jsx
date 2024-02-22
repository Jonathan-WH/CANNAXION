import React, { useState, useEffect } from 'react';

export const MyAgeVerification = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Vérifiez si la vérification d'âge a déjà été effectuée
    const isAgeVerified = localStorage.getItem('isAgeVerified');
    if (isAgeVerified !== 'true') {
      // Si l'utilisateur n'a pas encore confirmé son âge, affichez la pop-up
      setIsVisible(true);
    }
  }, []);

  const handleVerification = (isOver18) => {
    if (isOver18) {
      // Stockez l'information dans le localStorage
      localStorage.setItem('isAgeVerified', 'true');
      setIsVisible(false);
    } else {
      // Redirection vers Google
      window.location.href = 'https://www.google.com';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="age-verification-overlay">
      <div className="age-verification-content">
        <p>Vous devez avoir au moins 18 ans pour accéder à ce site.</p>
        <button onClick={() => handleVerification(true)}>Oui, j'ai plus de 18 ans</button>
        <button onClick={() => handleVerification(false)}>Non, je n'ai pas 18 ans</button>
      </div>
    </div>
  );
};

