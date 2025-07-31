# Google OAuth Setup Guide

Follow these steps to set up Google OAuth for your Lost & Found application:

## Step 1: Google Cloud Console Setup

### 1.1 Create/Select Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Make sure the project is selected

### 1.2 Enable APIs

**Option 1: Enable Google Identity API**

1. Go to "APIs & Services" → "Library"
2. Search for **"Google Identity"** (in Social/Security category)
3. Click on "Google Identity" and click "Enable"

**Option 2: If Google Identity is not available, enable these APIs:**

1. Search for **"Google+ API"** and enable it
2. Search for **"People API"** and enable it
3. Search for **"Google Identity and Access Management API"** and enable it

**Option 3: Direct Link**
If you can't find the APIs, try this direct link:
`https://console.cloud.google.com/apis/library/identity.googleapis.com`

**Note:** Any of these options will work for OAuth authentication.

### 1.3 Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "Lost & Found App"
   - User support email: Your email
   - Developer contact information: Your email
4. Click "Save and Continue"
5. Skip scopes section, click "Save and Continue"
6. Add test users if needed, click "Save and Continue"
7. Review and click "Back to Dashboard"

### 1.4 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Fill in:
   - Name: "Lost & Found Web Client"
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5173`
5. Click "Create"

### 1.5 Copy Your Client ID

You'll see a popup with your Client ID. It looks like:
`123456789-abcdefghijklmnop.apps.googleusercontent.com`

## Step 2: Update Your Application

### 2.1 Update Client Configuration

1. Open `client/src/config.js`
2. Replace `YOUR_ACTUAL_GOOGLE_CLIENT_ID_HERE` with your actual Client ID
3. Save the file

### 2.2 Test the Application

1. Start your server: `cd server && npm start`
2. Start your client: `cd client && npm run dev`
3. Go to `http://localhost:5173`
4. Click "Client Login"
5. Try the Google OAuth login

## Step 3: Production Setup (When Ready)

### 3.1 Update Authorized Origins

1. Go back to Google Cloud Console
2. Go to "APIs & Services" → "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Add your production domain to authorized origins
5. Update redirect URIs if needed

### 3.2 Remove Test Login

1. Open `client/src/ClientLogin.jsx`
2. Remove the test login button and function
3. Remove the temporary test login section

### 3.3 Environment Variables

1. Create `.env` files for production
2. Move sensitive data to environment variables
3. Update configuration to use environment variables

## Troubleshooting

### Common Issues:

1. **"invalid_client" error**:

   - Check that your Client ID is correct
   - Verify authorized origins include `http://localhost:5173`
   - Make sure the OAuth consent screen is configured

2. **"redirect_uri_mismatch" error**:

   - Add `http://localhost:5173` to authorized redirect URIs
   - Check for typos in the URI

3. **"access_denied" error**:
   - Make sure you're using a test user email (if in testing mode)
   - Check OAuth consent screen configuration

### Debug Steps:

1. Check browser console for errors
2. Check server logs for authentication errors
3. Verify Google Cloud Console settings
4. Test with different browsers

## Security Notes

1. **Never commit your Client ID to public repositories**
2. **Use environment variables in production**
3. **Regularly rotate your credentials**
4. **Monitor your OAuth usage in Google Cloud Console**

## Next Steps

After setting up Google OAuth:

1. Test the complete flow
2. Set up Stripe for payments
3. Configure email notifications
4. Deploy to production
