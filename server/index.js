require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const nodemailer = require('nodemailer');
const stripe = require('stripe')('sk_test_your_stripe_secret_key_here');
const EmployeeModel = require('./models/Employee');
const LostItemModel = require('./models/LostItem');
const ClientModel = require('./models/Client');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret_here',
  resave: false,
  saveUninitialized: false
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Email transporter (configure this with your actual Gmail credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'your_email@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'your_app_password_here'
  }
});

// Test email configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/employee') //connect to the database
    

app.post('/login', (req, res) => {
    const {email, password} = req.body;
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
        }else {
            res.json('No record existed');
        }
    })
})

app.post('/register', (req, res) => {
    const { email } = req.body;
    if (!email.endsWith('@sofitel.com')) {
        return res.status(403).json({ error: 'Only employees from sofitel are allowed to register.' });
    }
    EmployeeModel.create(req.body)
    .then(employees => res.json(employees))
    .catch(err => res.json(err));   
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

// Update lost item status (for staff) - Enhanced version with email notifications
app.patch('/lostitems/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const item = await LostItemModel.findOneAndUpdate(
            { id: req.params.id },
            { status },
            { new: true }
        );

        // Send email notification to client when item is found
        if (status === 'Found by staff' && item.clientId) {
            // Get client information from Client collection
            const client = await ClientModel.findById(item.clientId);
            
            if (client && client.email) {
                const mailOptions = {
                    from: process.env.GMAIL_USER || 'your_email@gmail.com',
                    to: client.email,
                    subject: 'Your Lost Item Has Been Found!',
                    html: `
                        <h3>Great News!</h3>
                        <p>Hello ${client.name}, your <strong>${item.title}</strong> was found now!</p>
                        <p><strong>Item:</strong> ${item.title}</p>
                        <p><strong>Description:</strong> ${item.description}</p>
                        <p>Please check your app to determine whether you want to pick it up or have it delivered.</p>
                        <p>You can either:</p>
                        <ul>
                            <li>Pick it up at the hotel</li>
                            <li>Have it delivered to your address (delivery fee applies)</li>
                        </ul>
                        <p>Thank you for choosing our service!</p>
                    `
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log('Email notification sent to:', client.email);
                } catch (emailError) {
                    console.error('Failed to send email:', emailError);
                    // Don't fail the request if email fails
                }
            } else {
                console.log('Client not found or no email for clientId:', item.clientId);
            }
        }

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
        
        // Verify the Google token with Google's API
        const response = await fetch('https://oauth2.googleapis.com/tokeninfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `id_token=${credential}`
        });

        if (!response.ok) {
            throw new Error('Invalid Google token');
        }

        const tokenInfo = await response.json();
        
        // Verify the client ID matches
        if (tokenInfo.aud !== '788765517215-e8lspclub0o40pt514ff8lf45nddnbhi.apps.googleusercontent.com') {
            throw new Error('Invalid client ID');
        }
        
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
        res.status(500).json({ error: 'Authentication failed' });
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

        // Send email notification to staff
        const mailOptions = {
            from: 'your_email@gmail.com',
            to: 'staff@sofitel.com',
            subject: 'Pickup Requested - Lost Item',
            html: `
                <h3>Pickup Requested</h3>
                <p><strong>Item:</strong> ${item.title}</p>
                <p><strong>Description:</strong> ${item.description}</p>
                <p><strong>Client Email:</strong> ${item.clientEmail}</p>
                <p><strong>Requested At:</strong> ${new Date().toLocaleString()}</p>
            `
        };

        transporter.sendMail(mailOptions);

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

// Create payment intent
app.post('/api/payment/create-payment-intent', async (req, res) => {
    try {
        const { amount, itemId, deliveryId } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            metadata: {
                itemId: itemId,
                deliveryId: deliveryId
            }
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update lost item status (for staff)
app.patch('/api/lost-items/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const item = await LostItemModel.findOneAndUpdate(
            { id: req.params.id },
            { status },
            { new: true }
        );

        // Send email notification to client when item is found
        if (status === 'Found by staff' && item.clientEmail) {
            const mailOptions = {
                from: 'your_email@gmail.com',
                to: item.clientEmail,
                subject: 'Your Lost Item Has Been Found!',
                html: `
                    <h3>Great News!</h3>
                    <p>Your lost item has been found by our staff.</p>
                    <p><strong>Item:</strong> ${item.title}</p>
                    <p><strong>Description:</strong> ${item.description}</p>
                    <p>Please log in to your account to choose how you would like to receive your item.</p>
                    <p>You can either pick it up at the hotel or have it delivered to your address.</p>
                `
            };

            transporter.sendMail(mailOptions);
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});



