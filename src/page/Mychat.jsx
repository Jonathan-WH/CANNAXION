import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { ref, onValue, push, serverTimestamp, set, update } from 'firebase/database';
import { database } from '/firebase-config';
import { useAuth } from '/src/components/Myauthcontext';
import { Myqrcode } from '/src/components/Myqrcode'

export function Mychat() {
  const { conversationId } = useParams(); // Récupérez l'ID de la conversation à partir de l'URL
  const location = useLocation();
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sellerDetails, setSellerDetails] = useState(null); // Initialiser avec null
  const [transactionDetails, setTransactionDetails] = useState(null);
  const { currentUser } = useAuth();
  const queryParams = new URLSearchParams(location.search);
  const transactionIdFromURL = queryParams.get('transactionId'); const [otherUsername, setOtherUsername] = useState(null);
  const [otherUserId, setOtherUserId] = useState(null);



  useEffect(() => {
    if (!currentUser || !conversationId) return;

    const messagesRef = ref(database, `messages`);
    onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val();
      const messagesList = [];
      let foundOtherUsername = null;
      let tempOtherUserId = null; // Temporaire pour stocker l'ID trouvé

      for (let messageId in messagesData) {
        const message = messagesData[messageId];
        if (message.conversationId === conversationId) {
          messagesList.push({
            ...message,
            id: messageId,
          });

          // Trouver l'autre utilisateur une seule fois
          if (!foundOtherUsername) {
            if (message.fromUserId !== currentUser.uid) {
              foundOtherUsername = message.fromUsername;
              tempOtherUserId = message.fromUserId;
            } else {
              foundOtherUsername = message.toUsername;
              tempOtherUserId = message.toUserId;
            }
          }
        }
      }

      setMessages(messagesList);
      setOtherUsername(foundOtherUsername);
      setOtherUserId(tempOtherUserId); // Mettre à jour l'état avec l'ID de l'autre utilisateur
    });
  }, [currentUser, conversationId]);

  useEffect(() => {
    if (otherUserId) {
      const otherUserRef = ref(database, `users/${otherUserId}`);
      onValue(otherUserRef, (snapshot) => {
        const userDetails = snapshot.val();
        setSellerDetails(userDetails);
      }, { onlyOnce: true });
    }
  }, [otherUserId]);









  useEffect(() => {
    // Vérifiez si l'URL contient l'ID de transaction
    const transactionIdFromURL = queryParams.get('transactionId');
    if (transactionIdFromURL) {
      // Récupérez les détails de la transaction à partir de l'ID
      const transactionRef = ref(database, `transactions/${transactionIdFromURL}`);
      onValue(transactionRef, (snapshot) => {
        const transactionData = snapshot.val();
        if (transactionData) {
          // Mettez à jour l'état avec les détails de la transaction
          setTransactionDetails(transactionData);
        } else {
          // Gérez le cas où les détails de la transaction ne sont pas trouvés
          console.error('Transaction details not found for ID:', transactionIdFromURL);
        }
      });
    }
  }, [transactionIdFromURL]);

  // Fonction pour gérer l'acceptation de la transaction
  const handleAcceptTransaction = async () => {
    // Mettre à jour le statut de la transaction dans Firebase
    const transactionRef = ref(database, `transactions/${transactionIdFromURL}`);
    await update(transactionRef, { status: 'waiting on qr code generator' });
    // Autres actions après acceptation...
  };

  // Fonction pour gérer le refus de la transaction
  const handleRefuseTransaction = async () => {
    // Mettre à jour le statut de la transaction dans Firebase
    const transactionRef = ref(database, `transactions/${transactionIdFromURL}`);
    await update(transactionRef, { status: 'refused' });
    // Autres actions après refus...
  };

  const handleConfirmPayment = async () => {
    const transactionRef = ref(database, `transactions/${transactionIdFromURL}`);
    await update(transactionRef, { status: 'customer payment made' });
  };

  const displayQrCodeIfNeeded = () => {
    if (transactionDetails && transactionDetails.status === 'accepted, waiting for customer payment' && transactionDetails.qrCodeUrl) {
      // Afficher le QR Code pour les deux parties si le statut de la transaction est approprié
      return <div><img src={transactionDetails.qrCodeUrl} alt="QR Code for payment" /></div>;
    }
  }

  const handleConfirmFundsReceived = async () => {
    const transactionRef = ref(database, `transactions/${transactionIdFromURL}`);
    await update(transactionRef, {
      status: 'The order will leave within 4 working days'
    });
  };

  const handleConfirmOrderReceived = async () => {
    const transactionRef = ref(database, `transactions/${transactionIdFromURL}`);
    await update(transactionRef, {
      status: 'finished'
    });
  };

  const displayTransactionStatus = () => {
    if (!transactionDetails) return null;

    // Affichage pour le statut "finished"
    if (transactionDetails.status === 'finished') {
      return (
        <>
        <div className="transaction-finished-notification">
          <p>The transaction is complete. Thank you for your trust. The conversation will be deleted in 15 days.</p>
        </div>

        <div className="transaction-finished-notification">
        <h3>Let a comment on each othere to help grow the community :</h3>
      <textarea type="text" />
      <button>SEND</button>
        </div>
        </>
        

      );
}


  };

  // Affichage conditionnel des informations de transaction
  const displayTransactionDetails = () => {
    if (!transactionDetails) return null;
    return (
      <div>
        {currentUser.uid === transactionDetails.sellerId && (
          <div>
            {transactionDetails.status === 'Waiting validation from vendor' && (
              <div className='acceptRefuse'>
                <button onClick={handleAcceptTransaction}>Accepter</button>
                <button onClick={handleRefuseTransaction}>Refuser</button>
              </div>
            )}
            {transactionDetails.status === 'waiting on qr code generator' && (
              <Myqrcode
                conversationId={conversationId}
                transactionDetails={transactionDetails}
                transactionId={transactionIdFromURL}
              />

            )}
          </div>
        )}
        {currentUser.uid === transactionDetails.buyerId && transactionDetails.status === 'Waiting validation from vendor' && (
          <p className='status'>Waiting for the seller’s validation....</p>
        )}
        {currentUser.uid === transactionDetails.buyerId && transactionDetails.status === 'refused' && (
          <p className='status'>The seller have refused the transaction...</p>
        )}
        {currentUser.uid === transactionDetails.buyerId && transactionDetails.status === 'waiting on qr code generator' && (
          <p className='status'>waiting on qr code generator...</p>
        )}
        {currentUser.uid === transactionDetails.buyerId && transactionDetails.status === 'The order will leave within 4 working days' && (
          <p className='status'>The order will leave within 4 working days...</p>
        )}

        {transactionDetails && transactionDetails.status === 'customer payment made' && currentUser.uid === transactionDetails.sellerId && (
          <button className='fundreceived' onClick={handleConfirmFundsReceived}>I have received the fund</button>
        )}

        {transactionDetails && transactionDetails.status === 'customer payment made' && currentUser.uid === transactionDetails.buyerId && (
          <p className='status'>Waiting on vendor to confirm fund receiving...</p>
        )}



        {transactionDetails && transactionDetails.status === 'The order will leave within 4 working days' && currentUser.uid === transactionDetails.buyerId && (
          <button className='order_received' onClick={handleConfirmOrderReceived}>I have received the order</button>
        )}




        {transactionDetails.status === 'accepted, waiting for customer payment' && (
          <>
            {currentUser.uid === transactionDetails.sellerId && (
              <p className='status'>Waiting for the customer to confirm the payment...</p>
            )}
            {currentUser.uid === transactionDetails.buyerId && transactionDetails.qrCodeUrl && (
              <div>
                <button onClick={handleConfirmPayment}>I have made the payment</button>
              </div>
            )}
          </>
        )}



      </div>
    );
  };





  const handleSendMessage = async () => {
    if (!currentUser) {
      alert("Vous devez être connecté pour envoyer un message.");
      return;
    }

    // Assurez-vous que sellerDetails est chargé avant de continuer
    if (!sellerDetails) {
      console.error("Les détails du vendeur ne sont pas chargés.");
      return;
    }

    // Récupérer les informations supplémentaires de l'utilisateur actuel
    const userRef = ref(database, `users/${currentUser.uid}`);
    onValue(userRef, async (snapshot) => {
      const userData = snapshot.val();
      const userName = userData.username; // Assurez-vous que cette propriété existe

      const newMessageRef = push(ref(database, 'messages'));
      await set(newMessageRef, {
        fromUserId: currentUser.uid,
        toUserId: sellerDetails.id,
        fromUsername: userName,
        toUsername: sellerDetails.username,
        message: currentMessage,
        timestamp: serverTimestamp(),
        status: "envoyé",
        conversationId // Assurez-vous que cette variable est définie correctement
      });

      setCurrentMessage(''); // Effacer le champ de saisie après l'envoi
    }, { onlyOnce: true }); // Ajout de l'option onlyOnce ici pour éviter des écoutes multiples
  };

  // Fonction pour gérer l'appui sur la touche Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && currentMessage.trim() !== '') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <h2>Speaking with {otherUsername || "loading..."}</h2>


      {
        transactionDetails && (
          <div className="transaction-details">
            <p>Quantité : {transactionDetails.quantity}</p>
            <p>Total CHF (transport include) : {transactionDetails.totalChf}</p>
            <p>Total BTC (transport include) : {transactionDetails.totalBtc.toFixed(8)}</p>
            {/* Ajoutez ici la condition pour afficher l'interface du vendeur si nécessaire */}
          </div>
        )
      }

      {displayTransactionStatus()}

      {displayTransactionDetails()}

      {displayQrCodeIfNeeded()}

      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.fromUserId === currentUser.uid ? 'sent' : 'received'}`}>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your message here..."
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  )
}
