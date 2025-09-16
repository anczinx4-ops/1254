# 🌿 HerbionYX - Production-Ready Ayurvedic Herb Traceability System

A comprehensive blockchain-based traceability system for Ayurvedic herbs using Hardhat, Ethereum, IPFS, and real QR code generation.

## 🚀 Features

### Core Functionality
- **Real Blockchain**: Hardhat local network with Ethereum compatibility
- **Zero Gas Fees**: Free transactions for all users
- **Role-Based Access**: Collector, Tester, Processor, Manufacturer, Admin roles
- **QR-Based Workflow**: Each process starts with QR code scanning
- **Real QR Generation**: Actual QR codes with tracking links
- **IPFS Storage**: Decentralized metadata and image storage
- **Glass Morphism UI**: Modern, beautiful interface design
- **140 Herb Species**: Complete Ayurvedic herb database

### Smart Contracts
- **AccessControl.sol**: Role management and permissions
- **BatchRegistry.sol**: Complete supply chain event recording

### Integrations
- **IPFS (Pinata)**: Metadata and image storage
- **Hardhat**: Local Ethereum development network
- **Real QR Codes**: Generated with tracking URLs

## 🏗️ Architecture

```
Frontend (React + Vite)     →    Netlify
Blockchain (Hardhat)        →    Local Development
IPFS (Pinata)              →    Decentralized Storage
```

## 📋 Prerequisites

- Node.js 18+
- Git
- Pinata IPFS account (free tier)

## 🛠️ Complete Setup Guide

### 1. Clone Repository
```bash
git clone <repository-url>
cd herbionyx-traceability
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Hardhat:**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

### 3. Setup Environment Variables

Create `.env` file in root:
```bash
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key
```

### 4. Start Hardhat Network

```bash
npx hardhat node
```

This will start a local Ethereum network on `http://localhost:8545` with 10 pre-funded accounts.

### 5. Deploy Smart Contracts

In a new terminal:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

This will deploy contracts and save addresses to `src/config/contracts.json`.

### 6. Start Frontend

```bash
npm run dev
```

## 🎯 User Workflow

### 1. Landing Page
- Beautiful glass morphism design
- Credits to SENTINELS
- Enter button to access platform

### 2. Login System
Demo credentials available:
- **Collector**: collector@demo.com / demo123
- **Tester**: tester@demo.com / demo123
- **Processor**: processor@demo.com / demo123
- **Manufacturer**: manufacturer@demo.com / demo123
- **Admin**: admin@demo.com / demo123
- **Consumer**: consumer@demo.com / demo123

### 3. QR-Based Process Flow

#### Collection (Farmer/Collector)
1. Login as collector
2. Fill herb details (species, weight, location)
3. Upload herb image (optional)
4. Submit → Creates batch on blockchain
5. **Real QR code generated** with tracking URL

#### Quality Testing
1. Login as tester
2. **Scan/paste QR code** from collection
3. Auto-fills batch and parent event IDs
4. Enter test results (moisture, purity, pesticide levels)
5. Submit → Records on blockchain
6. **New QR code generated**

#### Processing
1. Login as processor
2. **Scan/paste QR code** from quality test
3. Select processing method and parameters
4. Submit → Records on blockchain
5. **New QR code generated**

#### Manufacturing
1. Login as manufacturer
2. **Scan/paste QR code** from processing
3. Enter final product details
4. Submit → Records on blockchain
5. **Final consumer QR code generated**

#### Consumer Verification
1. Login as consumer (or public access)
2. **Scan final product QR code**
3. View complete supply chain journey
4. Verify authenticity and quality

## 🔧 Technical Implementation

### Blockchain Integration
- **Hardhat Local Network**: Real Ethereum environment
- **Zero Gas Fees**: Local network with free transactions
- **Smart Contracts**: Solidity contracts for access control and batch registry
- **Automatic Confirmation**: No wallet popups, seamless UX

### QR Code System
- **Real QR Generation**: Using `qrcode` library
- **Tracking URLs**: Each QR contains tracking link
- **Process Chaining**: Each stage scans previous QR
- **Blockchain Storage**: QR hashes stored on-chain

### Data Storage
- **IPFS**: Metadata and images stored on IPFS
- **Blockchain**: Event hashes and core data
- **Real Images**: Actual file upload to IPFS
- **No Mock Data**: All data is real except login credentials

### UI/UX Features
- **Glass Morphism**: Modern, translucent design elements
- **Responsive**: Works on all device sizes
- **Real-time**: Live blockchain interaction
- **Error Handling**: Comprehensive error messages

## 🌿 Supported Herbs (140 Species)

Complete list of Ayurvedic herbs including:
Talispatra, Chirmati, Katha, Vatsnabh, Atees, Vach, Adusa, Bael, Shirish, Ghritkumari, Smaller Galangal, Greater Galangal, Saptaparna, Silarasa, Akarkara, Kalmegh, Agar, Artemisia, Shatavari, Atropa, Neem, Brahmi, Daruhaldi, Pashanbheda, Punarnava, Patang, Senna, Sadabahar, Malkangani, Mandukparni, Safed Musli, Tejpatta, Dalchini, Kapoor, Arni, Aparajita, Patharchur, Hrivera, Guggul, Shankhpushpi, Mamira, Peela Chandan, Varun, Krishnasariva, Kali Musli, Tikhur, Nannari, Salampanja, Sarivan, Foxglove, Ratalu, Bhringraj, Vai, Vidang, Amla, Somlata, Hing, Kokum, Trayamana, Ginkgo, Kalihari, Mulethi, Gambhari, Gudmar, Kapurkachari, Anantmool, Seabuckthorn, Kutaj, Khurasani Ajwain, Pushkarmool, Giant Potato, Vriddhadaruka, Trivrit, Hapusha, Dhoop, Indian Crocus, Chandrasur, Jivanti, Litsea, Ghanera, Nagakeshar, Sahjan, Konch, Jatamansi, Tulsi, Ratanjot, Syonaka, Ginseng, Bhumi Amlaki, Kutki, Kababchini, Pippali, Isabgol, Rasna, Leadwort, Chitrak, Bankakri, Mahameda, Agnimanth, Moovila, Bakuchi, Beejasar, Raktachandan, Vidarikand, Sarpagandha, Archa, Manjishtha, Saptarangi, Chandan, Ashok, Kuth, Bala, Hriddhatri, Katheli, Makoy, Patala, Madhukari, Chirata, Lodh, Rohitak, Thuner, Sharapunkha, Arjuna, Bahera, Harad, Giloy, Barhanta, Patol, Jeevani, Damabooti, Prishnaparni, Tagar, Indian Valerian, Mandadhupa, Khas, Banafsha, Nirgundi, Ashwagandha, Dhataki, Timoo

## 🚀 Deployment Guide

### Netlify Deployment (Frontend Only)
1. Build the project: `npm run build`
2. Deploy `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Full Production Deployment
For production, you would need:
1. **Ethereum Mainnet/Testnet**: Deploy contracts to public network
2. **IPFS Pinning Service**: Pinata or similar
3. **Backend API**: For user management and additional features
4. **Database**: For user profiles and additional data

## 🔐 Security Features

- **Role-based Access Control**: Smart contract enforced permissions
- **IPFS Content Addressing**: Tamper-proof data storage
- **Blockchain Immutability**: Permanent record keeping
- **QR Code Verification**: Cryptographic hash verification
- **Zero Trust Architecture**: Every action verified on-chain

## 📱 API Endpoints (Future Enhancement)

The system is designed to be extended with additional API endpoints:
- User management
- Advanced analytics
- Reporting features
- Integration with external systems

## 🤝 Contributing

This is a production-ready prototype. To contribute:
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

For technical support or questions:
- Check the comprehensive documentation above
- Review the code comments
- Test with the provided demo credentials

## 🔗 External Services Required

### Pinata IPFS (Free Tier)
1. Sign up at https://pinata.cloud
2. Get API key and secret
3. Add to `.env` file

### Optional Enhancements
- **SMS Integration**: Fast2SMS or similar
- **Email Notifications**: SendGrid or similar
- **Advanced Analytics**: Custom dashboard
- **Mobile App**: React Native version

## 📄 License

MIT License - Open source and free to use.

## 👥 Credits

**Built by SENTINELS Team**
- Revolutionary blockchain-based traceability
- Production-ready architecture
- Modern UI/UX design
- Comprehensive documentation

---

**🌱 Building the Future of Ayurvedic Traceability with Real Blockchain Technology**

## 🎯 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Start Hardhat network (keep running)
npx hardhat node

# 3. Deploy contracts (new terminal)
npx hardhat run scripts/deploy.js --network localhost

# 4. Start frontend (new terminal)
npm run dev

# 5. Access at http://localhost:5173
```

**Demo Login**: Use any of the provided demo credentials to test the system!