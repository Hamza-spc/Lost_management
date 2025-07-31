# 📧 Email Setup Instructions

## To Enable Email Notifications

### Step 1: Set up Gmail App Password

1. **Go to your Google Account settings**

   - Visit: https://myaccount.google.com/
   - Click on "Security"

2. **Enable 2-Factor Authentication**

   - Find "2-Step Verification" and enable it
   - Follow the setup process

3. **Generate App Password**
   - Go to "App passwords" (under 2-Step Verification)
   - Select "Mail" as the app
   - Select "Other" as device
   - Click "Generate"
   - Copy the 16-character password

### Step 2: Update Environment Variables

Edit the `.env` file in the server directory:

```bash
# Email Configuration
GMAIL_USER=your_actual_gmail@gmail.com
GMAIL_APP_PASSWORD=your_actual_16_char_app_password

# Session Secret
SESSION_SECRET=your_session_secret_here

# Database URL
MONGODB_URI=mongodb://127.0.0.1:27017/employee
```

### Step 3: Restart Server

After updating the `.env` file:

```bash
cd server
node index.js
```

## How the Email System Works

### Complete Workflow:

1. **Client Login** → Client record created in database
2. **Client Reports Item** → Item linked to client via `clientId`
3. **Staff Updates Status** → Email sent to client's email address
4. **Client Receives Email** → Notification about found item
5. **Client Sees Options** → Pickup or delivery choices

### Email Content:

```
Subject: Your Lost Item Has Been Found!

Hello [Client Name],

Great News! Your [Item Title] was found now!

Please check your app to determine whether you want to pick it up or have it delivered.

Best regards,
Hotel Staff
```

## Testing the System

1. **Login as a client** using Google OAuth
2. **Report a lost item** (it will be linked to your client account)
3. **Login as staff** and change the item status to "Found by staff"
4. **Check your email** - you should receive the notification
5. **Login as client again** and check "Check Lost Item Status" - you should see pickup/delivery options
