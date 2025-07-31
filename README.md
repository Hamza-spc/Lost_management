# Lost & Found Management System

A comprehensive full-stack web application for managing lost and found items with advanced features including client authentication, AI-powered tools, payment processing, and automated notifications. Built with React (frontend) and Node.js/Express/MongoDB (backend).

## 🚀 Features

### 🔐 Authentication & User Management
- **Staff Authentication**: Secure login/registration system with email domain validation (@sofitel.com)
- **Client Authentication**: Google OAuth integration for seamless client login
- **Role-based Access**: Separate interfaces for staff and clients with appropriate permissions
- **Session Management**: Secure session handling with express-session

### 📱 Client Features
- **Client Dashboard**: Dedicated interface for clients to report and track lost items
- **Google OAuth Login**: One-click login using Google accounts
- **Lost Item Reporting**: Easy-to-use form for reporting lost items with details and photos
- **Status Tracking**: Real-time status updates for reported items
- **Pickup/Delivery Options**: Choose between hotel pickup or delivery service
- **Payment Integration**: Secure payment processing for delivery fees using Stripe

### 👥 Staff Features
- **Enhanced Dashboard**: Comprehensive analytics and item management
- **AI Email Generator**: Professional email templates for client communication
- **Workflow Management**: Separate sections for "Check Reports" and "View Lost Items"
- **Status Management**: Update item statuses with automatic email notifications
- **Item Management**: Add, edit, delete, and search lost items
- **AI Image Similarity Search**: Find visually similar items using TensorFlow.js

### 💳 Payment System
- **Stripe Integration**: Secure payment processing for delivery fees
- **Multiple Payment Methods**: Credit Card (Visa, Mastercard, Amex), PayPal, Apple Pay
- **Payment Tracking**: Monitor payment status and delivery requests
- **Secure Processing**: PCI-compliant payment handling

### 📧 Communication System
- **Automated Email Notifications**: Instant notifications when items are found
- **Professional Email Templates**: AI-generated emails for client communication
- **Email Configuration**: Easy setup with Gmail SMTP
- **Bilingual Support**: Emails in English and French

### 🗄️ Database & Data Management
- **Client Collection**: Dedicated MongoDB collection for client information
- **Enhanced Item Tracking**: Comprehensive item details with delivery information
- **Status Workflow**: Streamlined status progression (Declared → Found → Delivered/Pickup)
- **Data Analytics**: Comprehensive reporting and insights

### 🌍 Internationalization
- **Bilingual Support**: Full English and French translation
- **Dynamic Language Switching**: Real-time language changes
- **Localized Content**: All UI elements, emails, and notifications

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Professional Styling**: Elegant white and gold theme with custom typography
- **Intuitive Navigation**: Clear workflow and easy-to-use interfaces
- **Loading States**: Smooth user experience with proper loading indicators

## 🛠️ Getting Started

### Prerequisites

- Node.js & npm
- MongoDB (local or cloud)
- Google Cloud Console account (for OAuth)
- Stripe account (for payments)
- Gmail account (for email notifications)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Hamza-spc/Lost_management.git
   cd Lost_management
   ```

2. **Install dependencies:**
   ```bash
   # Backend dependencies
   cd server
   npm install
   
   # Frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Configuration:**
   ```bash
   # Copy environment template
   cd ../server
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```bash
   # Edit .env file with your credentials
   GMAIL_USER=your_email@gmail.com
   GMAIL_APP_PASSWORD=your_16_char_app_password
   SESSION_SECRET=your_session_secret_here
   MONGODB_URI=mongodb://127.0.0.1:27017/employee
   ```

5. **Add required assets:**
   - Place your fallback image as `client/src/assets/defaultImage.png`
   - Place your hotel logo as `client/src/assets/logoHotel.png`
   - Place your background video as `client/src/assets/video.mp4`

### Configuration

#### Google OAuth Setup
1. Create a project in Google Cloud Console
2. Enable Google Identity API
3. Configure OAuth consent screen
4. Create OAuth 2.0 credentials
5. Update `client/src/config.js` with your Client ID

#### Stripe Setup
1. Create a Stripe account
2. Get your publishable and secret keys
3. Update `client/src/config.js` with your Stripe publishable key
4. Update server configuration with your Stripe secret key

#### Email Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Update the `.env` file with your Gmail credentials

### Running the Application

1. **Start MongoDB** (if running locally)
2. **Start the backend:**
   ```bash
   cd server
   node index.js
   ```
3. **Start the frontend:**
   ```bash
   cd ../client
   npm run dev
   ```
4. Visit [http://localhost:5173](http://localhost:5173) in your browser

## 📋 Usage Guide

### For Clients
1. **Login**: Use Google OAuth to access the client dashboard
2. **Report Lost Item**: Fill out the form with item details and photo
3. **Track Status**: Monitor your item's status in real-time
4. **Choose Delivery**: Select pickup or delivery when item is found
5. **Pay Delivery Fee**: Complete payment if delivery is chosen

### For Staff
1. **Login**: Use your @sofitel.com email to access staff features
2. **Check Reports**: Review new client reports in the "Check Reports" section
3. **Update Status**: Change item status to "Found by staff" to trigger notifications
4. **Generate Emails**: Use AI Email Generator for professional client communication
5. **Manage Items**: Edit, delete, and track all lost items
6. **View Analytics**: Access comprehensive dashboard for insights

## 🏗️ Project Structure

```
projet/
├── client/                 # React frontend
│   ├── src/
│   │   ├── assets/        # Static files (images, video)
│   │   ├── components/    # React components
│   │   ├── config.js      # Configuration file
│   │   └── i18n.js        # Internationalization
│   └── package.json
├── server/                # Node.js/Express backend
│   ├── models/           # Mongoose models
│   │   ├── Client.js     # Client model
│   │   ├── Employee.js   # Employee model
│   │   └── LostItem.js   # Lost item model
│   ├── index.js          # Main server file
│   ├── .env.example      # Environment template
│   └── package.json
├── *.md                  # Documentation files
└── README.md
```

## 🔧 Technical Features

### AI-Powered Tools
- **Image Similarity Search**: TensorFlow.js with MobileNet for visual matching
- **Email Generation**: AI-powered professional email templates
- **Smart Categorization**: Automatic item categorization for analytics

### Security Features
- **OAuth 2.0**: Secure Google authentication
- **Session Management**: Express-session with secure configuration
- **Payment Security**: PCI-compliant Stripe integration
- **Input Validation**: Comprehensive form validation and sanitization

### Database Design
- **Client Collection**: Stores client information and OAuth data
- **LostItem Collection**: Enhanced with delivery and payment fields
- **Employee Collection**: Staff authentication and management
- **Relationships**: Proper linking between clients and their items

## 📊 Analytics & Reporting

### Admin Dashboard Features
- **Real-time Statistics**: Total items, found items, delivered items, pending items
- **Monthly Trends**: Visual charts showing patterns over time
- **Status Breakdown**: Percentage distribution by status
- **Top Categories**: Most common lost item types
- **Recent Activity**: Timeline of latest items
- **Performance Metrics**: Workflow efficiency tracking

## 🔄 Workflow

### Client Workflow
1. **Login** → Google OAuth authentication
2. **Report Item** → Fill form with details and photo
3. **Wait for Update** → Receive email when item is found
4. **Choose Option** → Pickup at hotel or delivery to address
5. **Pay Fee** → Complete payment if delivery chosen
6. **Receive Item** → Collect or receive delivery

### Staff Workflow
1. **Login** → Staff authentication
2. **Check Reports** → Review new client reports
3. **Update Status** → Mark items as found
4. **Generate Email** → Send professional notifications
5. **Process Requests** → Handle pickup/delivery requests
6. **Track Analytics** → Monitor system performance

## 🚀 Future Enhancements

### Planned Features
- **Mobile App**: Native iOS and Android applications
- **Push Notifications**: Real-time updates via mobile push
- **Advanced Analytics**: Machine learning insights and predictions
- **Multi-language Support**: Additional languages beyond English/French
- **API Integration**: Third-party integrations for enhanced functionality
- **Advanced Search**: AI-powered text and image search
- **Reporting Tools**: Export functionality (CSV, PDF, Excel)
- **Chatbot Assistant**: AI-powered customer support

### Technical Improvements
- **Performance Optimization**: Caching and database optimization
- **Scalability**: Microservices architecture
- **Testing**: Comprehensive unit and integration tests
- **CI/CD**: Automated deployment pipeline
- **Monitoring**: Application performance monitoring

## 📚 Documentation

- **NEW_FEATURES_README.md**: Detailed feature documentation
- **EMAIL_SETUP.md**: Email configuration guide
- **setup-google-oauth.md**: Google OAuth setup instructions
- **EMAIL_SETUP_INSTRUCTIONS.md**: Step-by-step email setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Check the documentation files in the repository
- Review the setup guides for configuration issues
- Contact the development team for technical support

---

MERN STACK + Stripe OAuth
