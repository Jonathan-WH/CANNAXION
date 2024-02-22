import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "/firebase-config"; // Assurez-vous que ces imports sont corrects
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, get } from "firebase/database";


export function Myheader() {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const [username, setUsername] = useState(""); // Ajoutez cette ligne pour gérer l'état du nom d'utilisateur
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Déconnexion réussie, redirection vers la page d'accueil
            navigate("/");
        }).catch((error) => {
            // Gérer l'erreur éventuelle ici
            console.error("Error during logout:", error);
        });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsUserAuthenticated(true);
                const userRef = ref(database, 'users/' + user.uid);
                get(userRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        const fetchedUsername = snapshot.val().username; // Assurez-vous que ce champ existe dans votre base de données
                        setUsername(fetchedUsername); // Ceci met à jour l'état `username`
                        console.log(fetchedUsername)
                    }
                });
            } else {
                setIsUserAuthenticated(false);
                setUsername(""); // Ceci réinitialise `username` lorsque l'utilisateur se déconnecte
            }
        });

        return () => unsubscribe();
    }, []); // Tableau de dépendances vide pour s'exécuter uniquement lors du montage


    return <>
        <header>

            <nav className="">
                <div className='logo'>

                    <div>
                        <NavLink to="/"><img src="../../src/assets/logo/logo_cannaxion.png" alt="Logo" className=""
                            id='logoheader' /></NavLink>
                    </div>

                    <div>
                        <h1><NavLink to="/" className='manrope'>CANNAXION</NavLink></h1>
                    </div>

                </div>


                <div className="menu">
                    <ul className="main_ul">
                        <li className="menu-item submenuM">
                            <h3 className="menu-link">PRODUCTS</h3>
                            <ul className="submenu">
                                <li><NavLink to="/clone" className="submenu-link">CLONE</NavLink></li>
                                <li><NavLink to="/seeds" className="submenu-link">SEEDS</NavLink></li>
                                <li><NavLink to="/service" className="submenu-link">SERVICES</NavLink></li>
                            </ul>
                        </li>
                        <li className="menu-item"><NavLink to="/blog" className="menu-link">BLOG</NavLink></li>
                        <li className="menu-item"><NavLink to="/faq" className="menu-link">FAQ</NavLink></li>


                    </ul>
                </div>

                <div id='login-content' style={{ justifyContent: isUserAuthenticated ? 'end' : 'start' }}>
                    {!isUserAuthenticated && (
                        <div id='login-signin'>
                            <div id='login'><NavLink to="/login" className="menu-link"><i className="fa-solid fa-user"></i> LOGIN</NavLink>
                            </div>

                            <div id='signin'> <NavLink to="/signin" className="menu-link"><i className="fa-solid fa-pen"></i> SIGN UP</NavLink>
                            </div>

                        </div>
                    )}

                    {isUserAuthenticated && (
                        <div id="username-menu" className="menu-item submenuM">

                            <h3 className="menu-link"> Hi {username.toUpperCase()}! </h3>
                            <ul className="submenu submenu-user">
                                <li>
                                    <NavLink to="myaddarticle" className="submenu-link"><i className="fa-solid fa-plus"></i> POST NEW ARTICLE</NavLink>
                                </li>
                                <li>
                                    <NavLink to="myarticle" className="submenu-link"> My ARTICLE</NavLink>
                                </li>
                                <li><NavLink to="myinbox" className="submenu-link"><i className="fa-regular fa-envelope"></i> INBOX</NavLink></li>
                                <li><NavLink to="myprofilinfo" className="submenu-link"><i className="fa-solid fa-gear"></i> PROFILE INFO</NavLink ></li>
                                <li><NavLink to="myprofilpage" className="submenu-link"><i className="fa-regular fa-user"></i> PROFILE PAGE</NavLink></li>
                                <li><NavLink to="mysalehistory" className="submenu-link"><i className="fa-solid fa-clock-rotate-left"></i> SALE HISTORY</NavLink></li>
                                <li><button onClick={handleLogout} className="menu-link"><i className="fa-solid fa-right-from-bracket"></i> LOGOUT</button></li>
                            </ul>
                        </div>
                    )}


                </div>

            </nav>


        </header>
    </>
}