# Email Setup Guide

To enable email notifications when items are found, you need to configure Gmail with an App Password.

## Step 1: Enable 2-Factor Authentication

1. Go to your Google Account settings: https://myaccount.google.com/
2. Go to "Security"
3. Enable "2-Step Verification" if not already enabled

## Step 2: Generate App Password

1. Go to your Google Account settings: https://myaccount.google.com/
2. Go to "Security"
3. Under "2-Step Verification", click "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Name it "Lost & Found App"
6. Click "Generate"
7. Copy the 16-character password (it looks like: xxxx xxxx xxxx xxxx)

## Step 3: Update Server Configuration

1. Open `server/index.js`
2. Find the email transporter configuration (around line 32)
3. Update with your actual Gmail and app password:

```javascript
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your_actual_email@gmail.com", // Replace with your Gmail
    pass: "your_16_character_app_password", // Replace with the app password
  },
});
```

## Step 4: Test Email Configuration

1. Restart your server: `npm start`
2. Check the console output - you should see:
   - "Email server is ready to send messages" (if successful)
   - Or an error message if configuration is wrong

## Step 5: Test the Complete Flow

1. **As a client**: Report a lost item
2. **As staff**: Change the item status to "Found by staff"
3. **Check**: The client should receive an email notification
4. **As client**: Log in and check "Check Lost Item Status"
5. **Verify**: The item should show "Found by staff" status with pickup/delivery options

## Troubleshooting

### Email Not Sending:

- Check that 2-factor authentication is enabled
- Verify the app password is correct (16 characters, no spaces)
- Make sure your Gmail allows "less secure app access" or use app password
- Check server console for error messages

### Common Errors:

- **"Invalid login"**: Wrong email or password
- **"Authentication failed"**: App password not generated correctly
- **"Connection timeout"**: Network issues or Gmail blocking

## Security Notes

- Never commit your email credentials to version control
- Use environment variables in production
- The app password is more secure than your regular password
- You can revoke app passwords anytime from Google Account settings
