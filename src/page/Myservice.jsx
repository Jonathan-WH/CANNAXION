import React, { useState, useEffect } from 'react';
import { database } from '/firebase-config';
import { ref, onValue } from 'firebase/database';
import { NavLink } from 'react-router-dom';

export function Myservice() {
    const [service, setService] = useState([]);

    useEffect(() => {
        const serviceRef = ref(database, 'products/service');
        onValue(serviceRef, (snapshot) => {
            const serviceData = snapshot.val();
            const serviceList = Object.keys(serviceData ?? {}).map(key => ({
                id: key,
                ...serviceData[key],
            }));
            setService(serviceList);
        });
    }, []);

    return (
            <>
            <h2 className='manrope myclone'>Service</h2>
            <div id='myclone'>
           
            {service.map((service) => (
                <div key={service.id} className="clone-item">
                    <h3>{service.name}</h3>
                    <img src={service.photos[0]} alt={service.name} />
                    <p>Price: {service.price} CHF/hour</p>

                    <NavLink to={`/singleproductservice/${service.id}`}>
                    <button>More Info</button>
                    </NavLink>
                </div>
            ))}
        </div>
    </>);
}
