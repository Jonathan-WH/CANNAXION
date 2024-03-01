import React, { useState, useEffect } from 'react';
import { database, auth } from '/firebase-config';
import { ref, onValue, remove } from 'firebase/database';
import { useAuth } from '/src/components/Myauthcontext'; // ou une autre méthode pour obtenir l'utilisateur actuel





export function Myarticle() {
    const [seeds, setSeeds] = useState([]);
    const [clones, setClones] = useState([]);
    const [services, setServices] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const { currentUser } = useAuth();

    const confirmDelete = (itemId) => {
        setShowDeleteConfirm(true);
        setItemToDelete(itemId);
    };

    const deleteItem = () => {
        const productRef = ref(database, `products/${itemToDelete.category}/${itemToDelete.id}`);
        remove(productRef).then(() => {
            setShowDeleteConfirm(false);
            setItemToDelete(null);
            // Ajoutez ici une logique pour rafraîchir la liste des articles si nécessaire
        }).catch(error => {
            console.error("Error removing document: ", error);
        });
    };

    useEffect(() => {
        if (!currentUser) return;

        // Récupérer les articles appartenant à l'utilisateur courant pour chaque catégorie
        const fetchDataForCategory = (category) => {
            const categoryRef = ref(database, `products/${category}`);
            onValue(categoryRef, (snapshot) => {
                const data = snapshot.val();
                const userItems = Object.keys(data ?? {}).filter(key => data[key].sellerId === currentUser.uid).map(key => ({
                    id: key,
                    ...data[key],
                }));
                if (category === 'seeds') setSeeds(userItems);
                if (category === 'clone') setClones(userItems);
                if (category === 'service') setServices(userItems);
            });
        };

        fetchDataForCategory('seeds');
        fetchDataForCategory('clone');
        fetchDataForCategory('service');
    }, [currentUser]);

    return (
        <div id='myarticle'>

            <a className='linkpage' href="#clone">Clone</a>

            <a className='linkpage' href="#service">Service</a>

            <a className='linkpage' href="#seeds">Seeds</a>


            <h2 className='manrope' id='seeds'>Seeds</h2>
            {seeds.map((item) => (
                <div key={item.id}>
                    <h3>{item.name}</h3>
                    <img src={item.photos[0]} alt={item.name} />
                    <p className='fontweight'>Description:</p>
                    <p>{item.description}</p>
                    <p className='fontweight'>HLVD tested: </p>
                    <p>{item.hlvdTested ? 'Yes' : 'No'}</p>
                    <p className='fontweight'>Price: </p>
                    <p>{item.price} CHF</p>
                    <p className='fontweight'>Shipping price: </p>
                    <p>{item.shippingPrice} CHF</p>
                    <p className='fontweight'>Available Quantity :</p>
                    <p> {item.quantity}</p>
                    <p className='fontweight'>Quantity per pack: </p>
                    <p>{item.quantityPerPack}</p>

                    <button className='deletearticle' onClick={() => confirmDelete({ id: item.id, category: 'seeds' /* ou 'clone' ou 'service' selon le cas */ })}>Delete</button>


                </div>
            ))}

            <h2 className='manrope' id='clone'>Clone</h2>
            {clones.map((item) => (
                <div key={item.id}>
                    <h3>{item.name}</h3>
                    <img src={item.photos[0]} alt={item.name} />
                    <p>Description:</p>
                    <p>{item.description}</p>
                    <p className='fontweight'>Gender:</p>
                    <p>{item.gender}</p>
                    <p className='fontweight'>HLVD tested: </p>
                    <p>{item.hlvdTested ? 'Yes' : 'No'}</p>
                    <p className='fontweight'>Price: </p>
                    <p>{item.price} CHF</p>
                    <p className='fontweight'>Shipping price: </p>
                    <p>{item.shippingPrice} CHF</p>
                    <p className='fontweight'>Available Quantity : </p>
                    <p>{item.quantity}</p>

                    <button className='deletearticle' onClick={() => confirmDelete({ id: item.id, category: 'clone' /* ou 'clone' ou 'service' selon le cas */ })}>Delete</button>


                </div>
            ))}

            <h2 className='manrope' id='service'>Services</h2>
            {services.map((item) => (
                <div key={item.id}>
                    <h3>{item.name}</h3>
                    <img src={item.photos[0]} alt={item.name} />
                    <p>Description:</p>
                    <p>{item.description}</p>
                    <p className='fontweight'>Price per hour: </p>
                    <p>{item.price} CHF</p>

                    <button className='deletearticle' onClick={() => confirmDelete({ id: item.id, category: 'service' /* ou 'clone' ou 'service' selon le cas */ })}>Delete</button>

                </div>
            ))}

            {showDeleteConfirm && (
                <div className="delete-confirm-overlay">
                    <div className="delete-confirm-container">
                        <p>Are you sure you want to delete this product ?</p>
                        <button onClick={deleteItem}>Confirm</button>
                        <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>


    );
}