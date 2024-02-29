import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '/firebase-config';
import { useAuth } from '/src/components/Myauthcontext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHandshake } from '@fortawesome/free-regular-svg-icons';

export function Myinbox() {
  const [conversations, setConversations] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      const messagesRef = ref(database, 'messages');
      const conversationsInfo = {};
  
      onValue(messagesRef, (snapshot) => {
        const messagesData = snapshot.val();
  
        for (let messageId in messagesData) {
          const message = messagesData[messageId];
          if (message.fromUserId === currentUser.uid || message.toUserId === currentUser.uid) {
            const otherUsername = message.fromUserId === currentUser.uid ? message.toUsername : message.fromUsername;
            if (!conversationsInfo[message.conversationId]) {
              conversationsInfo[message.conversationId] = {
                id: message.conversationId,
                otherUsername,
                transactionId: message.transactionId || null
              };
            }
          }
        }
  
        setConversations(Object.values(conversationsInfo));
      });
    }
  }, [currentUser]);

  const handleSelectConversation = (conversationId, transactionId) => {
    const url = transactionId ? `/chat/${conversationId}?transactionId=${transactionId}` : `/chat/${conversationId}`;
    navigate(url);
  };
  

  return (
    <div className="inbox-container">
      <h1>INBOX</h1>
      <ul className="conversation-list">
      {conversations.map(({ id, transactionId, otherUsername }) => (
  <li key={id} onClick={() => handleSelectConversation(id, transactionId)} className="conversation-item">
    {transactionId
      ? <>
          <FontAwesomeIcon icon={faHandshake} fontSize="3vw" />
          {`Transaction avec ${otherUsername}`}
        </>
      : <>
          <FontAwesomeIcon icon={faComment} color="black" fontSize="3vw" />
          {` Speak with ${otherUsername}`}
        </>
    }
  </li>
))}

      </ul>
    </div>
  );
}
