import React, { useState, useEffect } from 'react';
import { database } from '/firebase-config';
import { ref, onValue } from 'firebase/database';
import { NavLink } from 'react-router-dom';

export function Myclone() {
    const [clones, setClones] = useState([]);

    useEffect(() => {
        const clonesRef = ref(database, 'products/clone');
        onValue(clonesRef, (snapshot) => {
            const clonesData = snapshot.val();
            const clonesList = Object.keys(clonesData ?? {}).map(key => ({
                id: key,
                ...clonesData[key],
            }));
            setClones(clonesList);
        });
    }, []);

    return (
            <>
            <h2 className='manrope myclone'>Clones</h2>
            <div id='myclone'>
           
            {clones.map((clone) => (
                <div key={clone.id} className="clone-item">
                    <h3>{clone.name}</h3>
                    <img src={clone.photos[0]} alt={clone.name} />
                    <p>Price: {clone.price} CHF</p>
                    <p>Shipping price: {clone.shippingPrice} CHF</p>
                    <p>Available Quantity: {clone.quantity}</p>

                    <NavLink to={`/singleproductclone/${clone.id}`}>
                    <button>More Info</button>
                    </NavLink>
                </div>
            ))}
        </div>
    </>);
}
