# 🌿 HerbionYX - Blockchain-Based Ayurvedic Herb Traceability System

A comprehensive blockchain-based traceability system for Ayurvedic herbs using Polygon Mumbai, Remix IDE, and real QR code generation.

## 🚀 Features

### Core Functionality
- **Real Blockchain**: Polygon Mumbai testnet with real transactions
- **Demo Mode**: No backend required, works entirely in browser
- **Role-Based Access**: Collector, Tester, Processor, Manufacturer, Admin roles
- **QR-Based Workflow**: Each process starts with QR code scanning
- **Real QR Generation**: Actual QR codes with tracking links
- **Simulated IPFS**: Demo IPFS functionality for development
- **Glass Morphism UI**: Modern, beautiful interface design
- **140 Herb Species**: Complete Ayurvedic herb database

### Smart Contracts
- **HerbionYXAccessControl.sol**: Role management and permissions
- **HerbionYXBatchRegistry.sol**: Complete supply chain event recording

### Technology Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Blockchain**: Polygon Mumbai Testnet
- **Deployment**: Remix IDE
- **QR Codes**: Real QR code generation with tracking

## 🏗️ Architecture

```
Frontend (React + Vite)     →    Browser-based Demo
Smart Contracts             →    Polygon Mumbai Testnet  
Deployment                  →    Remix IDE
```

## 📋 Prerequisites

- Node.js 18+
- MetaMask wallet
- Test MATIC tokens (free from faucet)

## 🛠️ Quick Setup Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Deploy Contracts (Optional)
Follow the `REMIX_DEPLOYMENT_GUIDE.md` to deploy contracts on Polygon Mumbai.

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
The system supports multiple users with different roles:

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

### Demo Mode Features
- **Browser-Only**: No backend server required
- **Mock Authentication**: Demo users with different roles
- **Simulated Blockchain**: Real contract structure, demo transactions
- **Real QR Codes**: Actual QR code generation and scanning
- **Responsive UI**: Works on all device sizes

### UI/UX Features
- **Multiple User Roles**: Switch between different user types
- **Glass Morphism**: Modern, translucent design elements
- **Responsive**: Works on all device sizes
- **Real-time**: Live blockchain interaction
- **Error Handling**: Comprehensive error messages

## 🌿 Supported Herbs (140 Species)

The system includes a comprehensive database of Ayurvedic herbs:

**Popular Herbs Include:**
- Ashwagandha (Withania somnifera)
- Brahmi (Bacopa monnieri)
- Tulsi (Ocimum tenuiflorum)
- Neem (Azadirachta indica)
- Amla (Emblica officinalis)

Complete list of Ayurvedic herbs including:
Talispatra, Chirmati, Katha, Vatsnabh, Atees, Vach, Adusa, Bael, Shirish, Ghritkumari, Smaller Galangal, Greater Galangal, Saptaparna, Silarasa, Akarkara, Kalmegh, Agar, Artemisia, Shatavari, Atropa, Neem, Brahmi, Daruhaldi, Pashanbheda, Punarnava, Patang, Senna, Sadabahar, Malkangani, Mandukparni, Safed Musli, Tejpatta, Dalchini, Kapoor, Arni, Aparajita, Patharchur, Hrivera, Guggul, Shankhpushpi, Mamira, Peela Chandan, Varun, Krishnasariva, Kali Musli, Tikhur, Nannari, Salampanja, Sarivan, Foxglove, Ratalu, Bhringraj, Vai, Vidang, Amla, Somlata, Hing, Kokum, Trayamana, Ginkgo, Kalihari, Mulethi, Gambhari, Gudmar, Kapurkachari, Anantmool, Seabuckthorn, Kutaj, Khurasani Ajwain, Pushkarmool, Giant Potato, Vriddhadaruka, Trivrit, Hapusha, Dhoop, Indian Crocus, Chandrasur, Jivanti, Litsea, Ghanera, Nagakeshar, Sahjan, Konch, Jatamansi, Tulsi, Ratanjot, Syonaka, Ginseng, Bhumi Amlaki, Kutki, Kababchini, Pippali, Isabgol, Rasna, Leadwort, Chitrak, Bankakri, Mahameda, Agnimanth, Moovila, Bakuchi, Beejasar, Raktachandan, Vidarikand, Sarpagandha, Archa, Manjishtha, Saptarangi, Chandan, Ashok, Kuth, Bala, Hriddhatri, Katheli, Makoy, Patala, Madhukari, Chirata, Lodh, Rohitak, Thuner, Sharapunkha, Arjuna, Bahera, Harad, Giloy, Barhanta, Patol, Jeevani, Damabooti, Prishnaparni, Tagar, Indian Valerian, Mandadhupa, Khas, Banafsha, Nirgundi, Ashwagandha, Dhataki, Timoo

## 🚀 Production Deployment

### Contract Deployment
1. **Follow REMIX_DEPLOYMENT_GUIDE.md** for detailed instructions
2. **Deploy to Polygon Mumbai** using Remix IDE
3. **Update contract addresses** in `src/config/contracts.ts`
4. **Register demo users** via Remix interface

### Frontend Deployment
1. **Build**: `npm run build`
2. **Deploy**: Upload `dist` folder to any static hosting
3. **Configure**: Update contract addresses after deployment

## 🔐 Security Features

- **Role-based Access Control**: Smart contract enforced permissions  
- **Demo Authentication**: Secure demo user system
- **Blockchain Immutability**: Permanent record keeping
- **QR Code Verification**: Cryptographic hash verification
- **Input Validation**: Comprehensive form validation

## 🤝 Contributing

This is a demo system ready for production enhancement. To contribute:
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

For technical support:
- Review the `REMIX_DEPLOYMENT_GUIDE.md`
- Check contract deployment on Polygon Mumbai
- Test with demo credentials provided
- Verify QR code generation and scanning

## 📄 License

MIT License - Open source and free to use for educational and commercial purposes.

## 👥 Credits

**Built by SENTINELS Team**
- Revolutionary blockchain-based traceability
- Production-ready architecture
- Modern UI/UX design
- Comprehensive documentation

**🌱 Revolutionizing Ayurvedic Supply Chain with Blockchain Technology**

## 🎯 Quick Start Commands

```bash
# Install and start
npm install
npm run dev

# Deploy contracts (optional)
# Follow REMIX_DEPLOYMENT_GUIDE.md

# Access at http://localhost:5173
```

**Demo Login**: Use the provided demo credentials to test different user roles!