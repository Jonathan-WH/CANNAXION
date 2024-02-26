import React, { useState, useEffect } from 'react';
import { database } from '/firebase-config';
import { ref, onValue } from 'firebase/database';
import { NavLink } from 'react-router-dom';

export function Myseeds() {
    const [seeds, setSeeds] = useState([]);

    useEffect(() => {
        const seedsRef = ref(database, 'products/seeds');
        onValue(seedsRef, (snapshot) => {
            const seedsData = snapshot.val();
            const seedsList = Object.keys(seedsData ?? {}).map(key => ({
                id: key,
                ...seedsData[key],
            }));
            setSeeds(seedsList);
        });
    }, []);

    return (
            <>
            <h2 className='manrope myclone'>Seeds</h2>
            <div id='myclone'>
           
            {seeds.map((seeds) => (
                <div key={seeds.id} className="clone-item">
                    <h3>{seeds.name}</h3>
                    <img src={seeds.photos[0]} alt={seeds.name} />
                    <p>Price: {seeds.price} CHF</p>
                    <p>Shipping price: {seeds.shippingPrice} CHF</p>
                    <p>Available Quantity: {seeds.quantity}</p>

                    <NavLink to={`/singleproductseeds/${seeds.id}`}>
                    <button>More Info</button>
                    </NavLink>
                </div>
            ))}
        </div>
    </>);
}
