import QRCode from 'qrcode';
import { useState } from 'react';

import { update, ref } from 'firebase/database';
import { database } from '/firebase-config';


export function Myqrcode({ conversationId, transactionDetails, transactionId }) {
  const [bitcoinAddress, setBitcoinAddress] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');


  const generateAndDisplayQRCode = async () => {

    const amount = transactionDetails.totalBtc

    const amount_trim = amount.toFixed(8);
    // Utilisez le montant en BTC directement depuis les détails de la transaction pour le QR code
    const qrCodeData = `bitcoin:${bitcoinAddress}?amount=${amount_trim}`;
    const qrImageUrl = await QRCode.toDataURL(qrCodeData);
    setQrCodeUrl(qrImageUrl);

    // Mise à jour du status de transaction
      const transactionRef = ref(database, `transactions/${transactionId}`);
      await update(transactionRef, { 
        status: 'accepted, waiting for customer payment',
      qrCodeUrl: qrImageUrl 
      });
      };

  return (
    <div className='qrcode'>
      <input
        type="text"
        value={bitcoinAddress}
        onChange={(e) => setBitcoinAddress(e.target.value)}
        placeholder="Adresse Bitcoin"
      />
      <button onClick={generateAndDisplayQRCode}>Générer QR Code</button>
      {qrCodeUrl && (
        <div>
          <img src={qrCodeUrl} alt="QR Code de paiement Bitcoin" />
          <div className='detailstransaction'>
            <p>Quantity : {transactionDetails.quantity}</p>
            <p>Price in CHF (transport include) : {transactionDetails.totalChf}</p>
            <p>Price in BTC (transport include) : {transactionDetails.totalBtc.toFixed(8)}</p>
          </div>
          {/* Afficher les détails de la transaction ici */}
        </div>
      )}
    </div>
  );
}
