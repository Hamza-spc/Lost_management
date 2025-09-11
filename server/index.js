require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
// Temporarily commenting out passport to fix compatibility issues
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// Temporarily commenting out stripe to fix compatibility issues
// const stripe = require('stripe')('sk_test_your_stripe_secret_key_here');
const EmployeeModel = require('./models/Employee');
const LostItemModel = require('./models/LostItem');
const ClientModel = require('./models/Client');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret_here',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport configuration - temporarily disabled
// app.use(passport.initialize());
// app.use(passport.session());



// Connect to MongoDB first, then start server
async function startServer() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/employee', {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
    });
    console.log('Connected to MongoDB');
    
    // Start server only after MongoDB connection is successful
    app.listen(3001, () => {
      console.log('Server is running on port 3001');
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

startServer();
    

app.post('/login', (req, res) => {
    try {
        const {email, password} = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        if (!email.endsWith('@sofitel.com')) {
            return res.status(403).json({ error: 'Only @sofitel.com emails are allowed to log in.' });
        }
        
        EmployeeModel.findOne({email: email})
        .then(user => {
            if(user) {
                if(user.password === password) {
                    res.json('Success');
                } else {
                    res.json('The password is incorrect');
                }
            } else {
                res.json('No record existed');
            }
        })
        .catch(err => {
            console.error('Database error during login:', err);
            res.status(500).json({ error: 'Database error during login' });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error during login' });
    }
})

app.post('/register', (req, res) => {
    try {
        const { email } = req.body;
        if (!email.endsWith('@sofitel.com')) {
            return res.status(403).json({ error: 'Only employees from sofitel are allowed to register.' });
        }
        EmployeeModel.create(req.body)
        .then(employees => res.json(employees))
        .catch(err => {
            console.error('Registration error:', err);
            res.status(500).json({ error: 'Registration failed' });
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error during registration' });
    }
});

// Get all employees (for debugging)
app.get('/employees', (req, res) => {
    EmployeeModel.find()
    .then(employees => {
        console.log('All employees:', employees);
        res.json(employees);
    })
    .catch(err => {
        console.error('Error fetching employees:', err);
        res.status(500).json({ error: err.message });
    });
});

app.post('/lostitems', (req, res) => {
    console.log('Creating lost item with data:', req.body);
    LostItemModel.create(req.body)
    .then(item => {
        console.log('Created item:', item);
        res.json(item);
    })
    .catch(err => {
        console.error('Error creating item:', err);
        res.status(400).json({ error: err.message });
    });
});

app.get('/lostitems', (req, res) => {
    LostItemModel.find()
    .then(items => {
        console.log('All items in database:', items);
        res.json(items);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

app.patch('/lostitems/:id', (req, res) => {
    LostItemModel.findOneAndUpdate({ id: req.params.id }, req.body, { new: true })
    .then(item => res.json(item))
    .catch(err => res.status(400).json({ error: err.message }));
});

// Update lost item status (for staff)
app.patch('/lostitems/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const item = await LostItemModel.findOneAndUpdate(
            { id: req.params.id },
            { status },
            { new: true }
        );

        res.json(item);
    } catch (error) {
        console.error('Status update error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/lostitems/:id', (req, res) => {
    LostItemModel.findOneAndDelete({ id: req.params.id })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(400).json({ error: err.message }));
});

// Google OAuth endpoint
app.post('/api/auth/google', async (req, res) => {
    try {
        const { credential } = req.body;
        
        // Verify the Google token with Google's API using the correct endpoint
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);

        if (!response.ok) {
            console.error('Google token verification failed:', response.status, response.statusText);
            throw new Error('Invalid Google token');
        }

        const tokenInfo = await response.json();
        
        // Verify the client ID matches
        if (tokenInfo.aud !== '788765517215-e8lspclub0o40pt514ff8lf45nddnbhi.apps.googleusercontent.com') {
            console.error('Client ID mismatch:', tokenInfo.aud);
            throw new Error('Invalid client ID');
        }
        
        console.log('Token info received:', { 
            sub: tokenInfo.sub, 
            email: tokenInfo.email, 
            name: tokenInfo.name,
            aud: tokenInfo.aud 
        });
        
        // Check if client exists, if not create new client
        let client = await ClientModel.findOne({ googleId: tokenInfo.sub });
        
        if (!client) {
            // Create new client
            client = await ClientModel.create({
                googleId: tokenInfo.sub,
                name: tokenInfo.name,
                email: tokenInfo.email,
                picture: tokenInfo.picture
            });
            console.log('New client created:', client.email);
        } else {
            // Update last login
            client.lastLogin = new Date();
            await client.save();
            console.log('Existing client logged in:', client.email);
        }
        
        const user = {
            id: client._id,
            googleId: client.googleId,
            name: client.name,
            email: client.email,
            picture: client.picture
        };

        // Create a simple token (in production, use JWT)
        const token = 'client_token_' + Date.now();

        res.json({ user, token });
    } catch (error) {
        console.error('Google OAuth error:', error);
        res.status(500).json({ error: 'Authentication failed', details: error.message });
    }
});

// Get client's lost items
// Get all clients
app.get('/api/clients', async (req, res) => {
    try {
        const clients = await ClientModel.find({});
        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/lost-items/client/:clientId', async (req, res) => {
    try {
        const { clientId } = req.params;
        console.log('Looking for items with clientId:', clientId);
        
        // Find items by clientId
        const items = await LostItemModel.find({ clientId: clientId });
        
        console.log('Found items:', items.length);
        res.json(items);
    } catch (error) {
        console.error('Error fetching client items:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get specific lost item
app.get('/api/lost-items/:id', async (req, res) => {
    try {
        const item = await LostItemModel.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Request pickup
app.put('/api/lost-items/:id/pickup', async (req, res) => {
    try {
        const item = await LostItemModel.findOneAndUpdate(
            { id: req.params.id },
            { 
                status: 'Pickup requested',
                pickupRequested: true,
                pickupRequestedAt: new Date()
            },
            { new: true }
        );

        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Request delivery
app.post('/api/lost-items/:id/delivery', async (req, res) => {
    try {
        const { address, phoneNumber, city, postalCode } = req.body;
        
        const item = await LostItemModel.findOneAndUpdate(
            { id: req.params.id },
            { 
                status: 'Delivery requested',
                deliveryRequested: true,
                deliveryRequestedAt: new Date(),
                deliveryAddress: address,
                deliveryPhone: phoneNumber,
                deliveryCity: city,
                deliveryPostalCode: postalCode
            },
            { new: true }
        );

        res.json({ 
            success: true, 
            deliveryId: 'delivery_' + Date.now(),
            item 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create payment intent - temporarily disabled
// app.post('/api/payment/create-payment-intent', async (req, res) => {
//     try {
//         const { amount, itemId, deliveryId } = req.body;

//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: amount,
//             currency: 'usd',
//             metadata: {
//                 itemId: itemId,
//                 deliveryId: deliveryId
//             }
//         });

//         res.json({ clientSecret: paymentIntent.client_secret });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// Update lost item status (for staff)
app.patch('/api/lost-items/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const item = await LostItemModel.findOneAndUpdate(
            { id: req.params.id },
            { status },
            { new: true }
        );

        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





