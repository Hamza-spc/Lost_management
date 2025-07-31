# New Features Implementation Guide

This document explains the new features added to the Lost & Found application and how to configure them.

## New Features Added

### 1. Client Authentication with Google OAuth

- Changed "Report Lost Item" button to "Client Login" on the landing page
- Added Google OAuth integration for client authentication
- Clients can now sign in with their Google accounts

### 2. Client Dashboard

- New dashboard with two main options:
  - Report Lost Item
  - Check Lost Item Status

### 3. Client Items Management

- Clients can view all their reported lost items
- Real-time status updates
- Pickup and delivery options for found items

### 4. Email Notifications

- Automatic email notifications when staff marks items as "Found"
- Staff notifications when clients request pickup
- Email notifications for delivery requests

### 5. Pickup and Delivery System

- **Pickup Option**: Clients can request to pick up items at the hotel
- **Delivery Option**: Clients can request delivery to their address with payment

### 6. Stripe Payment Integration

- Secure payment processing for delivery fees ($15.00)
- Payment intent creation and confirmation
- Delivery fee management

## Configuration Required

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized JavaScript origins to `http://localhost:5173`
6. Copy the Client ID

Update the following files:

- `client/src/config.js`: Replace `your_google_client_id_here` with your actual Google Client ID

### 2. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your publishable key and secret key from the dashboard
3. Update the following files:
   - `client/src/config.js`: Replace `pk_test_your_stripe_publishable_key_here` with your Stripe publishable key
   - `server/index.js`: Replace `sk_test_your_stripe_secret_key_here` with your Stripe secret key

### 3. Email Configuration

1. Create a Gmail account or use existing one
2. Enable 2-factor authentication
3. Generate an App Password
4. Update `server/index.js`:
   ```javascript
   const transporter = nodemailer.createTransporter({
     service: "gmail",
     auth: {
       user: "your_actual_email@gmail.com",
       pass: "your_actual_app_password",
     },
   });
   ```

### 4. Session Secret

Update `server/index.js`:

```javascript
app.use(
  session({
    secret: "your_actual_session_secret_here", // Use a strong random string
    resave: false,
    saveUninitialized: false,
  })
);
```

## New API Endpoints

### Client Authentication

- `POST /api/auth/google` - Google OAuth authentication

### Client Items

- `GET /api/lost-items/client/:email` - Get client's lost items
- `GET /api/lost-items/:id` - Get specific lost item
- `PUT /api/lost-items/:id/pickup` - Request pickup
- `POST /api/lost-items/:id/delivery` - Request delivery

### Payment

- `POST /api/payment/create-payment-intent` - Create Stripe payment intent

### Staff Notifications

- `PATCH /api/lost-items/:id/status` - Update item status (triggers email notifications)

## New Database Fields

The `LostItem` model has been updated with new fields:

```javascript
// New fields added:
clientEmail: String, // For client authentication
pickupRequested: Boolean,
pickupRequestedAt: Date,
deliveryRequested: Boolean,
deliveryRequestedAt: Date,
deliveryAddress: String,
deliveryPhone: String,
deliveryCity: String,
deliveryPostalCode: String,
deliveryPaid: Boolean
```

## New Status Values

Added new status values to the enum:

- `'Pickup requested'`
- `'Delivery requested'`

## Workflow

### Client Journey

1. Client clicks "Client Login" on landing page
2. Signs in with Google OAuth
3. Redirected to Client Dashboard
4. Can either:
   - Report a new lost item
   - Check status of existing items
5. When item is found by staff:
   - Receives email notification
   - Can choose pickup or delivery
   - If delivery: fills form and pays fee
   - If pickup: staff is notified

### Staff Journey

1. Staff can mark items as "Found by staff"
2. Client automatically receives email notification
3. Staff can see pickup/delivery requests
4. Staff can update item status to "Delivered"

## Security Considerations

1. **Google OAuth**: Properly verify Google tokens in production
2. **Stripe**: Use webhook verification for payment confirmations
3. **Email**: Use environment variables for sensitive credentials
4. **Session**: Use strong session secrets
5. **CORS**: Configure properly for production domains

## Testing

1. Test Google OAuth flow
2. Test email notifications
3. Test Stripe payment flow
4. Test pickup and delivery requests
5. Test staff notifications

## Production Deployment

1. Update all configuration values with production credentials
2. Set up proper environment variables
3. Configure CORS for production domains
4. Set up SSL certificates
5. Configure proper email service
6. Set up Stripe webhooks
7. Configure Google OAuth for production domain

## Troubleshooting

### Common Issues

1. **Google OAuth not working**: Check client ID and authorized origins
2. **Emails not sending**: Verify Gmail credentials and app password
3. **Stripe payments failing**: Check API keys and webhook configuration
4. **CORS errors**: Verify CORS configuration matches your domains

### Debug Steps

1. Check browser console for JavaScript errors
2. Check server logs for API errors
3. Verify all configuration values are set correctly
4. Test each component individually
