# Mailchimp & Email Notification Setup

## Required Environment Variables

Add these environment variables to your deployment platform (Vercel, Netlify, etc.) and local `.env.local` file:

### Mailchimp Configuration
```
MAILCHIMP_API_KEY=your_mailchimp_api_key_here
MAILCHIMP_AUDIENCE_ID=your_mailchimp_audience_id_here
MAILCHIMP_SERVER_PREFIX=us1
```

### Email Notification Configuration
```
NOTIFICATION_EMAIL=easteregg@overdriveoriginals.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_smtp_username@gmail.com
SMTP_PASS=your_smtp_app_password
```

## How to Get Mailchimp Credentials

### 1. API Key
1. Log into your Mailchimp account
2. Go to Account → Extras → API Keys
3. Create a new API key or use an existing one

### 2. Audience ID
1. Go to Audience → All contacts
2. Click on "Settings" → "Audience name and defaults"
3. Find the "Audience ID" in the right sidebar

### 3. Server Prefix
- Found in your API key (e.g., if your API key ends with `-us1`, your server prefix is `us1`)
- Common prefixes: us1, us2, us3, us4, us5, us6, us7, us8, us9, us10, us11, us12, us13, us14, us15, us16, us17, us18, us19, us20

## Email Setup (Gmail Example)

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Enable 2-factor authentication

### 2. Generate App Password
1. Go to Google Account → Security
2. Under "Signing in to Google," select "App passwords"
3. Generate a new app password for "Mail"
4. Use this password as `SMTP_PASS`

## Features

### ✅ What the integration does:
- Adds subscribers to your Mailchimp audience
- Tags subscribers with "Race Support" and "Website Signup"
- Stores Instagram handle in custom merge field
- Sends email notification to OO team
- Handles duplicate email addresses gracefully
- Provides user feedback on success/error

### 📧 Email Notification includes:
- Subscriber email address
- Instagram handle (if provided)
- Timestamp
- Source page
- Professional HTML formatting

## Testing

1. Set up environment variables
2. Deploy the application
3. Test the form submission
4. Check Mailchimp audience for new subscriber
5. Check notification email inbox

## Troubleshooting

### Common Issues:
1. **"Server configuration error"** - Missing environment variables
2. **"Member Exists"** - Email already subscribed (handled gracefully)
3. **SMTP errors** - Check email credentials and app password
4. **Mailchimp API errors** - Verify API key and audience ID

### Debug Mode:
Check server logs for detailed error messages during form submission.
