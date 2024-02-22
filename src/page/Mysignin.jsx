import { useState } from "react";
import { auth, database, storage } from "/firebase-config";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { ref, set, get, child } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
//import photo de profil par défault
import photoprofildefault from '/src/assets/photo/photoprofildefault.png';




export const Mysignin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [country, setCountry] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [personaldescription, setPersonaldescription] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [errors, setErrors] = useState([]); // Un tableau pour stocker les erreurs

    // Regex pour la validation du mot de passe
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{10,}$/;


    const navigate = useNavigate();

    const handleImageUpload = async (userId, file) => {
        return new Promise(async (resolve, reject) => {
            let fileToUpload = file;
            if (!file) {
                // Si aucune photo n'est fournie, utilisez la photo par défaut
                // Pas besoin de fetch ici, utilisez directement l'import
                const response = await fetch(photoprofildefault);
                const blob = await response.blob();
                fileToUpload = new File([blob], 'photoprofildefault.png', { type: 'image/png' });
            }

            const uploadPath = storageRef(storage, `profilePictures/${userId}`);
            uploadBytes(uploadPath, fileToUpload).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL); // Renvoie l'URL de téléchargement de la photo de profil (par défaut ou sélectionnée)
                }).catch(reject);
            }).catch(reject);
        });
    };

    const checkUsernameUnique = async (username) => {
        const usernameLowercase = username.toLowerCase(); // Convertit le username en minuscules
        const usernameRef = ref(database, 'usernames/' + usernameLowercase);
        const snapshot = await get(usernameRef);
        return !snapshot.exists(); // Retourne true si le username n'existe pas déjà
    };



    const handleSignup = async () => {
        let errorsTemp = []; // Un tableau temporaire pour stocker les erreurs

         // Validation de l'e-mail
        if (!email.trim()) {
            errorsTemp.push("Email address is required.");
        } else if (email.includes(" ")) {
            errorsTemp.push("Email address cannot contain spaces.");
        }

        const trimmedUsername = username.trim();
        if (!trimmedUsername) {
            errorsTemp.push("Username is required.");
        } else if (/\s/.test(trimmedUsername)) {
            errorsTemp.push("Username cannot contain spaces.");
        }

        if (!passwordRegex.test(password)) {
            errorsTemp.push("Password must contain at least 10 characters, including one uppercase letter, one lowercase letter, one digit, and one special character.");

        }


        if (!country) {
            errorsTemp.push("Country selection is required.");

        }


        // Si il y a des erreurs, mettez à jour l'état des erreurs et arrêtez l'exécution
        if (errorsTemp.length > 0) {
            setErrors(errorsTemp);
            return;
        }

        if (trimmedUsername) {
            const isUsernameUnique = await checkUsernameUnique(trimmedUsername);
            if (!isUsernameUnique) {
                errorsTemp.push("This username is already taken. Please choose another one.");
            }
        }

        // Vérifiez si l'e-mail est déjà utilisé
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        if (signInMethods.length > 0) {
            errorsTemp.push("This email address is already in use by another account.");
        }

        if (errorsTemp.length > 0) {
            setErrors(errorsTemp);
            return;
        }


    
        // Proceed to create the user if there are no errors.
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;
            const downloadURL = await handleImageUpload(userId, profilePic);

            const userData = {
                id: userId,
                username: trimmedUsername.toLowerCase(),
                email,
                country,
                postalCode,
                personaldescription,
                profilpictureurl: downloadURL || photoprofildefault,
                createdate: new Date().toISOString(),
            };

            await set(ref(database, 'users/' + userId), userData);

             // Enregistrement du nom d'utilisateur dans la collection 'usernames'
             await set(ref(database, 'usernames/' + trimmedUsername.toLowerCase()), userId);
          
            navigate('/'); // Redirection vers la page d'accueil après une inscription réussie.
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                errorsTemp.push("Cette adresse e-mail est déjà utilisée par un autre compte.");
            } else {
                errorsTemp.push(error.message); // Pour tout autre type d'erreur
            }
            setErrors(errorsTemp);
        }

    }
    return (
        <div id="signup-form">
            <h2 className='manrope'>Sign Up</h2>

            <form onSubmit={(e) => e.preventDefault()}>
                {/* Les champs du formulaire ici */}
                <div>
                    <label>*Email :</label>
                    <br />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>*Username :</label>
                    <br />
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>*Password :</label>
                    <br />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <label>*Country :</label>
                    <br />
                    <select value={country} onChange={(e) => setCountry(e.target.value)}>
                        <option value="">Select Country</option>
                        <option value="France">France</option>
                        <option value="Germany">Germany</option>
                        <option value="Italy">Italy</option>
                        <option value="Spain">Spain</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Greece">Greece</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Sweden">Sweden</option>
                        <option value="Poland">Poland</option>
                        <option value="Austria">Austria</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Norway">Norway</option>
                        <option value="Denmark">Denmark</option>
                        <option value="Finland">Finland</option>
                    </select>
                </div>
                <div>
                    <label>Postal Code :</label>
                    <br />
                    <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </div>
                <div>
                    <label>Personnal information :</label>
                    <br />
                    <textarea type="text" value={personaldescription} onChange={(e) => setPersonaldescription(e.target.value)} />
                </div>
                <div>
                    <label>Profile Picture : (Only square format)</label>
                    <br />
                    <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} />
                </div>
                <button type="button" onClick={handleSignup}>Sign Up</button>
            </form>
            <br />
            {errors.map((error, index) => (
                <p key={index} className="error-message">{error}</p>
            ))}
        </div>
    )
}