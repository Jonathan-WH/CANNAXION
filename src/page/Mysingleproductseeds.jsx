import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { database } from '/firebase-config';
import { ref, onValue } from 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';

export function Mysingleproductseeds() {
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
        console.log(`Acheter ${quantity} de ${productDetails.name} au prix de ${totalPrice.toFixed(2)} CHF ou ${totalPriceBtc.toFixed(8)} BTC`);
    };

    if (isLoading || !productDetails || !sellerDetails || !btcPrice) {
        return <div className="loading-message">Chargement des détails du produit...</div>;
    }

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
            <p className='fontweight'>Quantity of seeds per pack: {productDetails.quantityPerPack}</p>
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
                     <button className='singlecontact'>contact</button> 
                    </div>
                    
                </div>
            )}
           




          
        </div>

    </div>


    
       
    
</div>
        </>
    );
}

           


 


