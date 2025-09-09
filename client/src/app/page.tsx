'use client';

import { useEffect, useState } from 'react';
import Peer from 'peerjs';
import { generateUserKeys, encryptMessage, decryptMessage } from '../../utils/crypto';

export default function Home() {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState('');
  const [connectId, setConnectId] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [friendPublicKey, setFriendPublicKey] = useState('');
  const [connection, setConnection] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [loginId, setLoginId] = useState('');
  const [searchId, setSearchId] = useState('');
  const [foundUser, setFoundUser] = useState<any>(null);

  useEffect(() => {
    // Peer will be created after login
  }, []);

  const connectToPeer = () => {
    if (peer && connectId) {
      const conn = peer.connect(connectId);
      setConnection(conn);
      conn.on('open', () => {
        setMessages(prev => [...prev, 'Connected to peer']);
      });
      conn.on('data', (data) => {
        const decrypted = decryptMessage(data, privateKey);
        setMessages(prev => [...prev, `Friend: ${decrypted}`]);
      });
    }
  };

  const sendMessage = () => {
    if (connection && message && friendPublicKey) {
      const encrypted = encryptMessage(message, friendPublicKey);
      connection.send(encrypted);
      setMessages(prev => [...prev, `You: ${message}`]);
      setMessage('');
    }
  };

  const register = async () => {
    const { publicKey: pub, privateKey: priv } = generateUserKeys();
    const res = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const user = await res.json();
    setCurrentUser(user);
    setPublicKey(pub);
    setPrivateKey(priv);
    localStorage.setItem(`privateKey_${user.id}`, priv);
    createPeer(user.id);
  };

  const login = async () => {
    const res = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: loginId })
    });
    const user = await res.json();
    setCurrentUser(user);
    setPublicKey(user.publicKey);
    const priv = localStorage.getItem(`privateKey_${user.id}`);
    if (priv) setPrivateKey(priv);
    createPeer(user.id);
  };

  const searchUser = async () => {
    const res = await fetch(`http://localhost:3001/api/auth/user/${searchId}`);
    const user = await res.json();
    setFoundUser(user);
  };

  const createPeer = (id: string) => {
    const newPeer = new Peer(id, {
      host: 'localhost',
      port: 3001,
      path: '/peerjs'
    });
    newPeer.on('open', (peerId) => {
      setPeerId(peerId);
    });
    newPeer.on('connection', (conn) => {
      setConnection(conn);
      conn.on('data', (data) => {
        const decrypted = decryptMessage(data, privateKey);
        setMessages(prev => [...prev, `Friend: ${decrypted}`]);
      });
    });
    setPeer(newPeer);
  };


  if (!loaded) {
    return <div className="p-8">Loading...</div>;
  }

  if (!currentUser) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Secure Messaging App</h1>
        <div className="mb-4">
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 mr-2"
          />
          <button onClick={register} className="bg-blue-500 text-white p-2">Register</button>
        </div>
        <div className="mb-4">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="User ID"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="border p-2 mr-2"
          />
          <button onClick={login} className="bg-green-500 text-white p-2">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Secure Messaging App</h1>
      <div className="mb-4">
        <p>Your ID: {currentUser.id}</p>
        <p>Your Peer ID: {peerId}</p>
        <p>Your Public Key:</p>
        <textarea value={currentUser.publicKey} readOnly className="w-full h-20 border" />
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Friend's Peer ID"
          value={connectId}
          onChange={(e) => setConnectId(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={connectToPeer} className="bg-blue-500 text-white p-2">Connect</button>
      </div>
      <div className="mb-4">
        <h3>Search User</h3>
        <input
          type="text"
          placeholder="User ID to search"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={searchUser} className="bg-purple-500 text-white p-2">Search</button>
        {foundUser && (
          <div>
            Found: {foundUser.username} (ID: {foundUser.id})
            <button onClick={() => { setConnectId(foundUser.id); setFriendPublicKey(foundUser.publicKey); }} className="ml-2 bg-green-500 text-white p-1">Connect to this user</button>
          </div>
        )}
      </div>
      <div className="mb-4">
        <textarea
          placeholder="Friend's Public Key"
          value={friendPublicKey}
          onChange={(e) => setFriendPublicKey(e.target.value)}
          className="w-full h-20 border"
        />
      </div>
      <div className="mb-4">
        <div className="border h-64 overflow-y-auto p-2">
          {messages.map((msg, idx) => <div key={idx}>{msg}</div>)}
        </div>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Type message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 mr-2 w-80"
        />
        <button onClick={sendMessage} className="bg-green-500 text-white p-2">Send</button>
      </div>
    </div>
  );
}
