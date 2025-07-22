# Lost & Found Web App

A full-stack web application for reporting, searching, and managing lost items. Built with React (frontend) and Node.js/Express/MongoDB (backend).

## Features

- User registration and login
- Add a lost item (with image, description, date/place last seen, and status)
- View all lost items in a searchable, filterable list
- Image upload with default fallback image
- Status tracking (Lost, Found, Returned) with instant updates
- Responsive, modern UI with a gold/white theme

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
3. **Add the default image:**
   - Place your fallback image as `client/src/assets/defaultImage.png`.

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

- Register or log in.
- Add lost items with details and an image (or use the default image).
- Browse and search/filter lost items by text or date.
- Update the status of any item (Lost, Found, Returned).

## Project Structure

```
projet/
  client/         # React frontend
    src/
      assets/     # Static images (defaultImage.png)
      ...
  server/         # Node.js/Express backend
    models/       # Mongoose models
    ...
```

## Future Improvements & AI Ideas

- Image similarity search for matching lost/found items
- Text similarity for smarter matching
- Automatic tagging or categorization
- Smart notifications for similar items
- Chatbot assistant for reporting/searching
- Admin dashboard and user roles
- Multi-language support

## License

MIT
