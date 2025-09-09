# 🚀 Secure Decentralized Messaging App (2025 Edition)

A cutting-edge, privacy-focused messaging application built with modern 2025 technologies including double encryption, dynamic session IDs, WebRTC P2P networking, and decentralized storage.

## ✨ Key Features (2025 Standards)

### 🔐 Advanced Security
- **Double Encryption**: AES-GCM + RSA-OAEP layered encryption
- **Dynamic Session IDs**: New random ID for each login session
- **End-to-End Encryption**: Messages encrypted before transmission
- **Network Key Protection**: Additional encryption layer for transport

### 🌐 Decentralized Architecture
- **WebRTC P2P**: Direct peer-to-peer connections with NAT traversal
- **Gun.js Integration**: Decentralized data storage and replication
- **IPFS Support**: Distributed file and message storage
- **No Central Server Dependency**: Messages stored across user devices

### 👥 User Management
- **Anonymous Registration**: No personal data required
- **UUID-based IDs**: Unique identifiers for user discovery
- **Session Management**: Dynamic session keys for each login
- **Multi-Account Support**: Multiple accounts per device

### 💬 Smart Messaging
- **Real-time Communication**: WebRTC DataChannel for instant messaging
- **Message Persistence**: Decentralized storage with Gun.js
- **Read Receipts**: Delivery and read status tracking
- **Offline Support**: Messages queued for offline users

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - User data storage
- **Gun.js** - Decentralized data storage
- **PeerJS** - P2P signaling server
- **IPFS** - Distributed storage (optional)

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **WebRTC** - P2P communication
- **Gun.js** - Client-side decentralized storage

### Security
- **RSA-2048** - Asymmetric encryption
- **AES-256-GCM** - Symmetric encryption
- **SHA-256** - Hashing
- **OAEP Padding** - RSA padding scheme

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd secure-messaging-app
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Start MongoDB**
   ```bash
   mongod
   ```

5. **Start the backend server**
   ```bash
   cd server
   npm start
   ```

6. **Start the frontend**
   ```bash
   cd client
   npm run dev
   ```

7. Open `http://localhost:3000` in your browser

## 📖 Usage Guide

### User Registration
1. Enter a username (no email/phone required)
2. Click "Register"
3. Receive your unique User ID and session credentials

### Finding Friends
1. Use the search function with a friend's User ID
2. The system will find their public key for encryption
3. Click "Connect" to establish P2P connection

### Secure Messaging
1. Once connected, messages are automatically:
   - Double encrypted (AES + RSA)
   - Sent via WebRTC DataChannel
   - Stored in decentralized Gun.js network
   - Marked with delivery/read status

### Multiple Accounts
- Open multiple browser tabs
- Register/Login with different accounts
- Each account gets unique session credentials

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with user ID
- `GET /api/auth/user/:id` - Get user by ID
- `GET /api/auth/users` - Get all users (admin)
- `POST /api/auth/update-session/:id` - Update user session

### WebRTC Signaling
- `GET /peerjs/*` - PeerJS signaling endpoints

## 🏗️ Architecture

### Security Layers
```
Message → AES-GCM Encryption → RSA-OAEP Encryption → WebRTC Transport → Gun.js Storage
```

### Data Flow
1. **User Registration**: Generate RSA keys, store public key in MongoDB
2. **Session Creation**: Generate dynamic session ID and network key
3. **Peer Discovery**: Search users by ID, exchange public keys
4. **Message Encryption**: Double encrypt with AES + RSA
5. **P2P Transmission**: Send via WebRTC DataChannel
6. **Decentralized Storage**: Store in Gun.js network
7. **Message Delivery**: Mark as delivered/read

### Database Schema

#### User Collection
```javascript
{
  id: "uuid-v4",
  username: "string",
  publicKey: "pem-string",
  sessionId: "nanoid-21",
  networkKey: "hex-string",
  lastLogin: "timestamp",
  isActive: "boolean",
  messageCount: "number",
  connections: ["array-of-user-ids"]
}
```

#### Messages (Gun.js)
```javascript
{
  messageId: "unique-id",
  from: "sender-id",
  to: "receiver-id",
  message: "encrypted-content",
  timestamp: "unix-timestamp",
  delivered: "boolean",
  read: "boolean"
}
```

## 🔒 Security Features

### Encryption Standards
- **RSA-2048-OAEP**: For key exchange and digital signatures
- **AES-256-GCM**: For message encryption with authentication
- **SHA-256**: For hashing and HMAC

### Privacy Protections
- **No Personal Data**: Registration without email/phone
- **Dynamic IDs**: New session ID per login
- **Forward Secrecy**: Session keys not stored long-term
- **Perfect Forward Secrecy**: Each message uses unique keys

### Decentralized Storage
- **Gun.js**: Distributed data storage
- **IPFS**: Distributed file storage
- **No Central Point**: Data replicated across peers

## 🚀 Advanced Features

### Supervisor/Admin Panel
- View all registered users
- Monitor active connections
- Track message statistics
- Manage user sessions

### Smart UI Components
- Dynamic message lists with real-time updates
- Connection status indicators
- Encryption status display
- Session management interface

### Performance Optimizations
- WebRTC connection pooling
- Message compression
- Lazy loading of message history
- Background sync for offline messages

## 📊 Monitoring & Analytics

### User Metrics
- Active users count
- Message throughput
- Connection success rate
- Geographic distribution

### Security Metrics
- Failed login attempts
- Encryption errors
- Connection timeouts
- Data integrity checks

## 🔧 Configuration

### Environment Variables
```bash
# Server Configuration
PORT=3001
MONGODB_URI=mongodb://localhost:27017/messaging
GUN_PEERS=https://gun-manhattan.herokuapp.com/gun

# Client Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GUN_PEERS=https://gun-manhattan.herokuapp.com/gun
```

### Security Settings
```javascript
// Crypto configuration
const CRYPTO_CONFIG = {
  rsaKeySize: 2048,
  aesKeySize: 256,
  sessionIdLength: 21,
  networkKeySize: 32
};
```

## 🧪 Testing

### Unit Tests
```bash
cd server
npm test
```

### Integration Tests
```bash
cd client
npm run test:e2e
```

### Security Testing
- Encryption/decryption validation
- Key exchange verification
- Man-in-the-middle attack simulation
- Replay attack prevention

## 📚 Documentation

### API Documentation
- RESTful API endpoints
- WebRTC signaling protocol
- Gun.js data structures
- Error handling

### User Guides
- Registration process
- Finding and connecting to friends
- Sending encrypted messages
- Managing multiple accounts

### Developer Guides
- Architecture overview
- Security implementation
- Extension points
- Deployment instructions

## 🚀 Deployment

### Production Setup
1. **Database**: Use MongoDB Atlas or self-hosted MongoDB
2. **Server**: Deploy to Heroku, DigitalOcean, or AWS
3. **Frontend**: Deploy to Vercel, Netlify, or AWS Amplify
4. **Gun.js**: Use multiple Gun peers for redundancy

### Scaling Considerations
- Horizontal scaling with load balancers
- Database sharding for user data
- CDN for static assets
- Redis for session management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Development Guidelines
- Use TypeScript for type safety
- Follow ESLint configuration
- Write comprehensive tests
- Update documentation
- Follow security best practices

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- WebRTC community for P2P technology
- Gun.js team for decentralized storage
- IPFS project for distributed storage
- OpenSSL for cryptographic functions

## 📞 Support

For support, please create an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for privacy and security in 2025**