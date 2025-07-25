# Lost & Found Web App

A full-stack web application for reporting, searching, and managing lost items. Built with React (frontend) and Node.js/Express/MongoDB (backend).

## Features

- **User Authentication**: Secure login/registration system with email domain validation (@sofitel.com)
- **Role-based Access**: Separate interfaces for staff and clients
- **Lost Item Management**: Add, view, edit, and delete lost items
- **Status Tracking**: Track items through different statuses (Declared by client, Found by staff, Delivered)
- **Image Upload**: Support for item images with preview functionality
- **Search & Filtering**: Real-time search and date filtering capabilities
- **Bilingual Support**: Full English and French translation
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **AI Image Similarity Search**: Staff can upload photos to find visually similar items using TensorFlow.js
- **Auto-generated IDs**: Each item gets a unique identifier automatically
- **Expiration Management**: Staff can set expiration dates (1 month, 1 year, unlimited)
- **Professional Styling**: Elegant white and gold theme with custom typography
- **Admin Dashboard**: Comprehensive analytics dashboard for staff with statistics, charts, and insights

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB (local or cloud)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd projet
   ```
2. **Install dependencies:**
   - For the backend:
     ```bash
     cd server
     npm install
     ```
   - For the frontend:
     ```bash
     cd ../client
     npm install
     ```
3. **Add the default image and video:**
   - Place your fallback image as `client/src/assets/defaultImage.png`.
   - Place your hotel logo as `client/src/assets/logoHotel.png`.
   - Place your background video as `client/src/assets/video.mp4`.

### Running the App

- **Start MongoDB** (if running locally)
- **Start the backend:**
  ```bash
  cd server
  node index.js
  ```
- **Start the frontend:**
  ```bash
  cd ../client
  npm run dev
  ```
- Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

- Register or log in (staff must use @sofitel.com email)
- Add lost items with details, image, status, and expiration
- Browse and search/filter lost items by text or date
- Update or delete items (staff only)
- Switch language (English/French) from the sidebar
- Enjoy a video background on the landing page
- Use AI Image Similarity Search to quickly find visually similar items
- Access the Admin Dashboard for comprehensive analytics and insights
- Monitor item statuses and track workflow efficiency

## Project Structure

```
projet/
  client/         # React frontend
    src/
      assets/     # Static images and video (defaultImage.png, logoHotel.png, video.mp4)
      ...
  server/         # Node.js/Express backend
    models/       # Mongoose models
    ...
```

## AI Image Similarity Search

The application features a powerful AI-powered image similarity search that significantly improves the efficiency of finding lost items:

### How It Works

- **Visual Analysis:** Staff can upload a photo of a found item, and the AI analyzes its visual characteristics
- **Deep Learning:** Uses TensorFlow.js with MobileNet model to extract high-dimensional feature vectors from images
- **Similarity Matching:** Compares the uploaded image against all items in the database using cosine similarity
- **Instant Results:** Returns the most visually similar item in under 15 seconds

### Benefits

- **Time-Saving:** Instead of manually typing keywords and reading through dozens of item descriptions, staff can find matches visually
- **Accuracy:** AI-powered visual matching is more precise than text-based searches
- **Efficiency:** Reduces search time from minutes to seconds
- **User-Friendly:** Simple upload and click interface for staff

## Admin Dashboard

The application includes a comprehensive analytics dashboard designed specifically for staff to monitor and optimize the lost & found operation:

### Dashboard Features

- **Statistics Overview**: Real-time counts of total items, found items, delivered items, and pending items
- **Monthly Trends**: Visual charts showing lost item patterns over the last 6 months
- **Status Breakdown**: Percentage distribution of items by status (Declared by client, Found by staff, Delivered)
- **Top Categories**: Analysis of most common lost item types (Electronics, Bags/Wallets, Keys/Cards, etc.)
- **Recent Activity**: Timeline of the latest 10 items added to the system
- **Auto-categorization**: Items are automatically categorized based on their titles for better analytics

### Benefits

- **Data-Driven Decisions**: Management can identify patterns and optimize processes
- **Performance Tracking**: Monitor the efficiency of the lost & found operation
- **Trend Analysis**: Understand seasonal patterns and common item types
- **Workflow Optimization**: Identify bottlenecks in the item recovery process
- **Accuracy:** AI can detect subtle visual similarities that keyword searches might miss
- **Efficiency:** Particularly useful when dealing with similar items (e.g., multiple black phones, similar bags)
- **User-Friendly:** Simple upload-and-search interface with clear results

### Use Cases

- Finding matches for found items when there are many similar items in the database
- Quickly identifying if a found item matches any existing lost item reports
- Reducing manual search time during busy periods
- Improving customer service response times

## Status Management

The application uses a streamlined status system to track items through the lost & found workflow:

### Status Options

- **Declared by client**: Initial status when a client reports a lost item
- **Found by staff**: Status when staff locates an item (either reported by client or found independently)
- **Delivered**: Final status when an item is successfully returned to its owner

### Workflow

1. **Client reports item** → Status: "Declared by client"
2. **Staff finds item** → Status: "Found by staff"
3. **Item returned to owner** → Status: "Delivered"

This simplified workflow eliminates confusion and provides clear tracking of each item's journey through the system.

## Future Improvements & AI Ideas

- Enhanced image similarity with multiple model support
- Text similarity for smarter matching
- Automatic tagging or categorization
- Smart notifications for similar items
- Chatbot assistant for reporting/searching
- Email notifications for status updates
- Export functionality (CSV/PDF reports)
- Mobile app version
- Push notifications
- Advanced analytics with predictive insights

## License

MIT
