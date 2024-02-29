import React, { useState, useEffect } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { database } from '/firebase-config';
import { ref, onValue, push, serverTimestamp, set } from 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from '/src/components/Myauthcontext';

import { createConversationId } from '/src/components/createConversationId'

import { createUniqueTransactionId } from '/src/components/createUniqueTransactionId'

export function Mysingleproductseeds() {

    const { currentUser } = useAuth();


    const navigate = useNavigate();
    // Logique pour définir productDetails, sellerDetails, etc.
    const [productDetails, setProductDetails] = useState(null); // Initialiser avec null pour vérifier facilement si les données sont chargées
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { productId } = useParams();
    const [sellerDetails, setSellerDetails] = useState(null); // Initialiser avec null
    const [btcPrice, setBtcPrice] = useState(null); // Initialiser avec null

    useEffect(() => {
        const productRef = ref(database, `products/seeds/${productId}`);
        onValue(productRef, (snapshot) => {
            const productData = snapshot.val();
            if (productData && productData.sellerId) {
                // Ajoutez l'ID du produit à l'objet productDetails
                setProductDetails({
                    ...productData,
                    id: productId, // Utilisez productId passé dans les props du composant
                });
                const sellerRef = ref(database, `users/${productData.sellerId}`);
                onValue(sellerRef, (sellerSnapshot) => {
                    setSellerDetails(sellerSnapshot.val());
                    setIsLoading(false); // Définir isLoading à false uniquement après avoir chargé les détails du vendeur
                });
            }
        });
    }, [productId]);


    useEffect(() => {
        const getPriceBtc = async () => {
            try {
                const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=chf");
                const data = await response.json();
                setBtcPrice(data.bitcoin.chf);
            } catch (error) {
                console.error("Failed to fetch BTC price:", error);
            }
        };
        getPriceBtc();
        const interval = setInterval(getPriceBtc, 120000); // Récupère le prix toutes les 2 minutes
        return () => clearInterval(interval);
    }, []);

    // Calcul des prix uniquement si toutes les données sont chargées
    const totalPrice = productDetails && btcPrice ? (quantity * productDetails.price + productDetails.shippingPrice) : 0;
    const totalPriceBtc = btcPrice ? totalPrice / btcPrice : 0;

    const handleBuyClick = async () => {
        // Assurez-vous que l'utilisateur est connecté
        if (!currentUser) {
            alert("You have to be logged to can make a purchase");
            return;
        }

        // Générer l'ID de la conversation pour la transaction
        const conversationId = createUniqueTransactionId(currentUser.uid, sellerDetails.id);

        // Message de confirmation
        const confirmationMessage = `Are you sure you want to buy ${quantity} of ${productDetails.name} for the price of ${totalPrice.toFixed(2)} CHF or ${totalPriceBtc.toFixed(8)} BTC?`;

        // Afficher une boîte de dialogue de confirmation
        if (window.confirm(confirmationMessage)) {
            // Récupérer les informations supplémentaires de l'utilisateur actuel
            const userRef = ref(database, `users/${currentUser.uid}`);
            onValue(userRef, async (snapshot) => {
                const userData = snapshot.val();
                if (userData) {
                    const userName = userData.username;

                    // Créer l'objet de transaction
                    const transaction = {
                        buyerId: currentUser.uid,
                        buyerUsername: userName,
                        sellerId: sellerDetails.id,
                        sellerUsername: sellerDetails.username,
                        productId: productDetails.id,
                        quantity,
                        totalChf: totalPrice,
                        totalBtc: totalPriceBtc,
                        status: 'Waiting validation from vendor', // État initial de la transaction
                        createdAt: serverTimestamp(),
                        conversationId
                    };

                    // Enregistrer la transaction dans Firebase
                    const transactionRef = push(ref(database, 'transactions'));
                    await set(transactionRef, transaction);

                    const transactionId = transactionRef.key;

                    // Créer un nouveau message dans la conversation
                    const newMessageRef = push(ref(database, 'messages'));
                    await set(newMessageRef, {
                        fromUserId: currentUser.uid,
                        toUserId: sellerDetails.id,
                        fromUsername: userName,
                        toUsername: sellerDetails.username,
                        message: `I am ${userName} and I would like to buy ${quantity} of ${productDetails.name} for the price of ${totalPrice.toFixed(2)} CHF or ${totalPriceBtc.toFixed(8)} BTC. Thank you for your time!`,
                        timestamp: serverTimestamp(),
                        status: "pending",
                        conversationId,
                        transactionId
                    });


                    // Rediriger vers la page de chat avec l'ID de la conversation et l'ID de la transaction
                    navigate(`/chat/${conversationId}?transactionId=${transactionId}`);
                }
            }, { onlyOnce: true }); // S'assurer que l'écouteur est appelé une seule fois
        } else {
            // L'utilisateur a annulé l'achat
            console.log('Achat annulé par l\'utilisateur.');
        }
    };






    const handleContactClick = async () => {

        if (!currentUser) {
            alert("You have to be logged to contact anybody");
            return;
        }

        if (currentUser.uid === sellerDetails.id) {
            alert("You are trying to contact yourself bro :), take a break from the internet =)")
            return
        }

        if (window.confirm(`Are your sure to want to contact ${sellerDetails.username}?`)) {
            const userRef = ref(database, `users/${currentUser.uid}`);

            // Utilisation de onValue avec onlyOnce
            onValue(userRef, async (snapshot) => {
                const userData = snapshot.val();
                if (userData) {
                    const userName = userData.username;

                    const conversationId = createConversationId(currentUser.uid, sellerDetails.id);

                    const newMessageRef = push(ref(database, 'messages'));
                    await set(newMessageRef, {
                        fromUserId: currentUser.uid,
                        toUserId: sellerDetails.id,
                        fromUsername: userName,
                        toUsername: sellerDetails.username,
                        message: `I am ${userName} and I would like to speak with you! Thanks for your time!`,
                        timestamp: serverTimestamp(),
                        status: "",
                        conversationId
                    });

                    navigate(`/chat/${conversationId}`);
                }
            }, { onlyOnce: true }); // Ajout de l'option onlyOnce ici
        } else {
            console.log('Action annulée par l\'utilisateur.');
            // Ici, aucune redirection n'est effectuée car l'utilisateur a annulé l'action
        }
    };

    if (isLoading || !productDetails || !sellerDetails || !btcPrice) {
        return <div className="loading-message">Chargement des détails du produit...</div>;
    }






    // Affichage des détails du produit une fois les données chargées
    return (

        <>

            <div id="pub"><a href="https://sensiseeds.com/fr/breeding-grounds"><img src="/src/assets/photo/pub.png" alt="" /></a></div>

            <div className='product-container'>

                <div className="product-details">

                    <div className='description'>
                        <h2 id='singleclone' className='manrope'>{productDetails.name} <span className='spansingle'>-</span> <span className='singleusername'>{sellerDetails.username.toUpperCase()}</span></h2>
                        {productDetails.photos && productDetails.photos[0] && (
                            <img src={productDetails.photos[0]} alt={productDetails.name} />
                        )}

                        <p className='fontweight'>Description: </p>
                        <p>{productDetails.description}</p>
                        <br />
                        <p className='fontweight'>Gender:</p>
                        <p>{productDetails.gender}</p>
                        <br />
                        <p className='fontweight'>HLVD tested: </p>
                        <p>{productDetails.hlvdTested ? 'Yes' : 'No'}</p>
                        <br />
                        <p className='fontweight'>Quantity per pack:</p>
                        <p>{productDetails.quantityPerPack}</p>
                    </div>


                    <div className="quantity-selector">
                        <div>

                            <p className='fontweight'>Price(per unit):</p>
                            <p>{productDetails.price} CHF</p>
                            <br />
                            <p className='fontweight'>Shipping price:</p>
                            <p> {productDetails.shippingPrice
                            } CHF</p>
                            <br />
                            <hr />

                            <label className='fontweight' htmlFor="quantity">Quantity</label>
                            <input
                                type="number"
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                min="1"
                                max={productDetails.quantity}
                            />

                            <p className='fontweight'>(Available {productDetails.quantity}) </p>
                            <hr />
                            <br />
                            <br />
                            <p className='fontweight'>Total CHF: </p>
                            <p>{totalPrice.toFixed(2)} CHF</p>
                            <br />
                            <p className='fontweight'>Total <FontAwesomeIcon icon={faBitcoin} style={{ color: "#FFD43B" }} /> : </p>
                            <p>{totalPriceBtc.toFixed(8)} BTC</p>
                            <br />
                            <hr />
                            <p><FontAwesomeIcon icon={faBitcoin} style={{ color: "#FFD43B" }} /> = {btcPrice} CHF </p>
                            <button className='singlebuy' onClick={handleBuyClick}>Buy</button>
                        </div>

                        {sellerDetails.username && (
                            <div className='sellerdetails'>
                                <img src={sellerDetails.profilpictureurl} alt="" />
                                <div>
                                    <p>{sellerDetails.username.toUpperCase()}</p>

                                    <button onClick={handleContactClick} className='singlecontact'>contact</button>

                                </div>

                            </div>
                        )}




                    </div>

                </div>





            </div>


        </>
    );
}
