import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { database } from '/firebase-config';
import { ref, onValue } from 'firebase/database';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';


export function Mysingleproductservice() {
    const [productDetails, setProductDetails] = useState(null); // Initialiser avec null pour vérifier facilement si les données sont chargées
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { productId } = useParams();
    const [sellerDetails, setSellerDetails] = useState(null); // Initialiser avec null
    const [btcPrice, setBtcPrice] = useState(null); // Initialiser avec null

    useEffect(() => {
        const productRef = ref(database, `products/service/${productId}`);
        onValue(productRef, (snapshot) => {
            const productData = snapshot.val();
            if (productData && productData.sellerId) {
                setProductDetails(productData);
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

    const handleBuyClick = () => {
        console.log(`contacter ${productDetails.name} `);
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
                    </div>


                    <div className="quantity-selector">
                        <div>

                            <p className='fontweight'>Price/hour:</p>
                            <p>{productDetails.price} CHF / { (productDetails.price / btcPrice).toFixed(8) } <FontAwesomeIcon icon={faBitcoin} style={{ color: "#FFD43B" }} /></p>

                            <br />
                            <hr />
                            <p><FontAwesomeIcon icon={faBitcoin} style={{ color: "#FFD43B" }} /> = {btcPrice} CHF </p>
                        </div> 
                        
                        {sellerDetails.username && (
                           <div className='sellerdetails'>
                                <img src={sellerDetails.profilpictureurl} alt="" />
                                <div>
                                    <p>{sellerDetails.username.toUpperCase()}</p>
                                    <NavLink to={`/mychat`}>
                   <button onClick={handleBuyClick} className='singlecontact'>contact</button>
                    </NavLink>
                                </div>
                                
                            </div>
                        )}
                       




                      
                    </div>

                </div>


                
                   
                
            </div>


        </>
    );
}
