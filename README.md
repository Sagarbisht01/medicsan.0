# MediCompare - Smart Medicine Price Comparison

A web application that helps people find affordable medicine alternatives by analyzing photos of medicine packages using AI. Perfect for those who need to save money on prescriptions while ensuring they get the same active ingredients.

![MediCompare Screenshot](https://via.placeholder.com/800x400?text=MediCompare+Screenshot)

## 🎯 Features

### 📸 AI-Powered Medicine Analysis
- **Photo Scanning**: Take pictures of medicine packages or upload images
- **Smart Recognition**: Uses OpenAI's vision AI to extract medicine details
- **Ingredient Detection**: Automatically identifies active ingredients, dosage, and form

### 💰 Price Comparison
- **Alternative Discovery**: Finds cheaper medicines with same active ingredients
- **Savings Calculator**: Shows exact savings amount and percentage
- **Price Per Unit**: Compares cost effectiveness across different quantities

### 🔍 Search & Browse
- **Manual Search**: Search by medicine name or active ingredient
- **Category Filters**: Browse by Pain Relief, Antibiotics, Vitamins, Heart Health
- **Recent Scans**: Keep track of previously analyzed medicines

### 📱 User Experience
- **Mobile Responsive**: Works perfectly on phones, tablets, and desktop
- **Drag & Drop**: Easy file upload with drag and drop support
- **Real-time Feedback**: Toast notifications for all user actions
- **Safety Disclaimers**: Important medical advice and warnings

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup for accessibility
- **CSS3**: Modern styling with Flexbox and Grid
- **Vanilla JavaScript**: No frameworks, pure JavaScript
- **Responsive Design**: Mobile-first approach

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **TypeScript**: Type-safe development
- **OpenAI API**: Vision AI for medicine analysis

### Database
- **In-Memory Storage**: Fast development and prototyping
- **Drizzle ORM**: Type-safe database operations
- **PostgreSQL Ready**: Easy migration to persistent storage

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/medicompare.git
   cd medicompare
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

### Getting an OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-proj-...`)

## 📋 How to Use

### Scanning Medicine
1. **Take a Photo**: Use the camera button or click the preview area
2. **Upload Image**: Drag and drop or select an image file
3. **Wait for Analysis**: AI will extract medicine information
4. **View Results**: See alternatives with potential savings

### Manual Search
1. **Search Bar**: Type medicine name or active ingredient
2. **Category Filters**: Click buttons to browse by category
3. **View Results**: Browse search results and alternatives

### Understanding Results
- **Green Badges**: Highest savings (8+ dollars)
- **Orange Badges**: Medium savings (3-8 dollars)
- **Blue Badges**: Lower savings (under 3 dollars)
- **Availability**: Shows pickup/delivery options

## 🔧 API Endpoints

### Medicine Analysis
```
POST /api/analyze-medicine
Content-Type: multipart/form-data
Body: image file
```

### Search Medicines
```
GET /api/medicines/search?q={query}
```

### Get Alternatives
```
GET /api/medicines/{id}/alternatives
```

### Recent Scans
```
GET /api/scans/recent?limit={number}
```

## 🏗️ Project Structure

```
medicompare/
├── server/                 # Backend code
│   ├── index.ts           # Main server file
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   └── vite.ts           # Development server
├── shared/                # Shared types and schemas
│   └── schema.ts         # Database schemas and types
├── index.html            # Main HTML file
├── styles.css            # CSS styles
├── script.js             # Frontend JavaScript
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🔒 Security & Privacy

### Data Handling
- **No Personal Data**: Only medicine information is processed
- **Temporary Storage**: Images are processed but not permanently stored
- **HTTPS Ready**: Secure transmission in production

### Medical Disclaimer
⚠️ **Important**: This tool provides price comparison only. Always consult healthcare providers before switching medications. Verify active ingredients and dosages match your prescription.

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
```env
NODE_ENV=production
OPENAI_API_KEY=your_production_key
PORT=5000
```

### Deploy to Replit
1. Import this repository to Replit
2. Add your OpenAI API key to Secrets
3. Click "Run" to deploy

### Deploy to Other Platforms
- **Heroku**: Use the included `package.json` scripts
- **Vercel**: Add build configuration
- **Railway**: Works out of the box
- **DigitalOcean**: Use App Platform

## 🧪 Sample Data

The application includes sample medicine data for testing:
- **Advil Liqui-Gels**: $12.99 for 20 capsules
- **Generic Ibuprofen**: $4.49 for 20 tablets (65% savings)
- **Tylenol Extra Strength**: $8.99 for 24 caplets
- **Generic Acetaminophen**: $3.99 for 30 tablets (56% savings)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Use TypeScript for backend code
- Follow existing code style
- Add tests for new features
- Update documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Issues

### Common Issues

**Q: "API key not working"**
A: Ensure your OpenAI API key is valid and has sufficient credits

**Q: "Images not uploading"**
A: Check file size (max 10MB) and format (must be image)

**Q: "No alternatives found"**
A: Try different medicine or check if active ingredients are recognized

### Getting Help
- 📧 **Email**: support@medicompare.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/medicompare/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/medicompare/discussions)

## 🎖️ Acknowledgments

- **OpenAI** for providing vision AI capabilities
- **Healthcare Community** for inspiration and feedback
- **Open Source Contributors** for making this possible

## 📊 Roadmap

### Version 2.0
- [ ] User accounts and saved searches
- [ ] Prescription upload and tracking
- [ ] Pharmacy integration
- [ ] Price alerts and notifications

### Version 3.0
- [ ] Mobile app (React Native)
- [ ] Barcode scanning
- [ ] Insurance integration
- [ ] Multilingual support

---

**Made with ❤️ to help people access affordable healthcare**

*Disclaimer: This tool is for informational purposes only. Always consult healthcare professionals for medical advice.*
