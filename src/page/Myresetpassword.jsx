import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '/firebase-config'; // Assurez-vous que le chemin d'accès est correct

export function Myresetpassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('A password reset email has been sent. Please check your inbox and your junk mail.');
        } catch (error) {
            setMessage('Erreur : ' + error.message);
        }
    };

    return (
        <div>

            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div id='signup-form'>
                    <h2>Password reset</h2>
                    <label htmlFor="email">Email :</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    /> 
                    <button type="submit">Send request</button>
                </div>
               
            </form>
        </div>
    );
}
