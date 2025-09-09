const Gun = require('gun');

// Initialize Gun.js for decentralized storage
const gun = Gun({
  peers: ['https://gun-manhattan.herokuapp.com/gun'], // Public peer for demo
  localStorage: false, // Disable localStorage for server
  radisk: false // Disable radisk for server
});

// Message storage and retrieval functions
function storeMessage(fromUserId, toUserId, encryptedMessage, timestamp = Date.now()) {
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  gun.get('messages').get(messageId).put({
    from: fromUserId,
    to: toUserId,
    message: encryptedMessage,
    timestamp: timestamp,
    delivered: false,
    read: false
  });

  // Update user's message count
  gun.get('users').get(fromUserId).get('messages').get(messageId).put({
    to: toUserId,
    timestamp: timestamp
  });

  return messageId;
}

function getMessagesForUser(userId) {
  return new Promise((resolve) => {
    const messages = [];

    gun.get('users').get(userId).get('messages').map().on((msg, id) => {
      if (msg) {
        gun.get('messages').get(id).once((fullMsg) => {
          if (fullMsg) {
            messages.push({ id, ...fullMsg });
          }
        });
      }
    });

    // Resolve after a short delay to collect messages
    setTimeout(() => resolve(messages), 1000);
  });
}

function markMessageAsRead(messageId) {
  gun.get('messages').get(messageId).get('read').put(true);
}

function markMessageAsDelivered(messageId) {
  gun.get('messages').get(messageId).get('delivered').put(true);
}

// User presence and online status
function setUserOnline(userId, sessionId) {
  gun.get('presence').get(userId).put({
    online: true,
    sessionId: sessionId,
    lastSeen: Date.now()
  });
}

function setUserOffline(userId) {
  gun.get('presence').get(userId).put({
    online: false,
    lastSeen: Date.now()
  });
}

function getOnlineUsers() {
  return new Promise((resolve) => {
    const onlineUsers = [];

    gun.get('presence').map().on((presence, userId) => {
      if (presence && presence.online) {
        onlineUsers.push({ userId, ...presence });
      }
    });

    setTimeout(() => resolve(onlineUsers), 500);
  });
}

module.exports = {
  gun,
  storeMessage,
  getMessagesForUser,
  markMessageAsRead,
  markMessageAsDelivered,
  setUserOnline,
  setUserOffline,
  getOnlineUsers
};