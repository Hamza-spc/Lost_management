# Lost & Found Management System

A comprehensive full-stack web application for managing lost and found items with advanced features including client authentication, AI-powered tools, payment processing, and automated notifications. Built with React (frontend) and Node.js/Express/MongoDB (backend).

## Screenshots

<img width="943" height="1280" alt="1782123449004" src="https://github.com/user-attachments/assets/8ba963a0-209f-4b69-8fdb-e8a1718152fe" />


<img width="1599" height="984" alt="1782123447215" src="https://github.com/user-attachments/assets/903d5e90-6b0c-4547-a0d3-772293e928cb" />


<img width="1009" height="1280" alt="1782123447441" src="https://github.com/user-attachments/assets/f8b1a9e4-37f6-42b0-868d-b44426b2a952" />


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
---

MERN STACK + Stripe OAuth
