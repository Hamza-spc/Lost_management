# Lost & Found Web App

A full-stack web application for reporting, searching, and managing lost items. Built with React (frontend) and Node.js/Express/MongoDB (backend).

## Features

- User registration and login (Sofitel staff only)
- Add a lost item (with image, description, date/place last seen, status, and expiration)
- View all lost items in a searchable, filterable list
- Image upload with default fallback image
- Status tracking (Lost, Found, Delivered, etc.) with instant updates
- Responsive, modern UI with a gold/white theme
- **Bilingual support:** English and French (toggle in sidebar)
- **Responsive sidebar:** Contact info, language switcher, and quick access
- **Staff management:** Staff can edit, delete, and set expiration for lost items
- **Background video:** Beautiful video background on the landing page
- **AI Image Similarity Search:** Advanced AI-powered visual search for finding similar items

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
- **Accuracy:** AI can detect subtle visual similarities that keyword searches might miss
- **Efficiency:** Particularly useful when dealing with similar items (e.g., multiple black phones, similar bags)
- **User-Friendly:** Simple upload-and-search interface with clear results

### Use Cases

- Finding matches for found items when there are many similar items in the database
- Quickly identifying if a found item matches any existing lost item reports
- Reducing manual search time during busy periods
- Improving customer service response times

## Future Improvements & AI Ideas

- Enhanced image similarity with multiple model support
- Text similarity for smarter matching
- Automatic tagging or categorization
- Smart notifications for similar items
- Chatbot assistant for reporting/searching
- Admin dashboard and user roles
- Multi-language support

## License

MIT
