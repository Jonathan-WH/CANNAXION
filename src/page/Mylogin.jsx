import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '/firebase-config'; // Assurez-vous que le chemin d'accès est correct

export function Mylogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirection vers la page d'accueil après la connexion réussie
            navigate('/');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div id="signup-form">
            <h2 className='manrope'>Login</h2>
            <form  onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>
                Forget password ? <NavLink to="/resetPassword">Click here</NavLink> for reset your password.
            </p>
        </div>
    );
}
