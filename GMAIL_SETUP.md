# Gmail Setup Guide for Email Notifications

This guide will help you set up Gmail to send email notifications to `elitefabworx@outlook.com`.

## Prerequisites for Gmail App Passwords

Gmail App Passwords require **2-Factor Authentication (2FA)** to be enabled. You cannot create app passwords without 2FA.

## Step 1: Enable 2-Factor Authentication

If you don't have 2FA enabled yet:

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** in the left menu
3. Under "Signing in to Google", click **2-Step Verification**
4. Click **Get Started** and follow the setup process
5. Add your phone number and verify it
6. **Important**: Complete the entire 2FA setup process

## Step 2: Create an App Password

Once 2FA is enabled:

1. Go back to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** in the left menu
3. Under "Signing in to Google", you should now see **App passwords**
4. Click **App passwords**
5. You may need to sign in again
6. In the "Select app" dropdown, choose **Mail**
7. In the "Select device" dropdown, choose **Other (Custom name)**
8. Type: `Elite Fabworx Website`
9. Click **Generate**
10. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

## Step 3: Configure Your Environment Variables

Add these to your `.env.local` file:

```env
# Gmail Configuration for Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
```

**Important**: 
- Use your **full Gmail address** for `SMTP_USER`
- Use the **16-character app password** (not your regular password) for `SMTP_PASS`
- Include the spaces in the app password or remove them (both work)

## Troubleshooting: Can't Find App Passwords?

### Issue 1: "App passwords" option not showing
**Solution**: Make sure 2FA is **fully enabled and working**
- Try signing out and signing back in with 2FA
- Wait a few minutes after enabling 2FA
- The option can take up to 1 hour to appear

### Issue 2: Google Workspace Account
If you're using a work/business Google account (@yourbusiness.com):
- Your administrator may have disabled app passwords
- Contact your IT admin or use a personal Gmail account instead

### Issue 3: Still can't see the option
Try this direct link: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

## Alternative: OAuth2 (More Complex)

If app passwords absolutely won't work, you can use OAuth2 instead:

```env
# OAuth2 Configuration (Advanced)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
GMAIL_CLIENT_ID=your-client-id
GMAIL_CLIENT_SECRET=your-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
SMTP_USER=your-gmail@gmail.com
```

This requires setting up Google Cloud Console and is more complex.

## Alternative: Use a Different Email Service

If Gmail continues to be problematic, consider these alternatives:

### Option 1: Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Option 2: Professional Email Service (Recommended)

**SendGrid** (Free tier: 100 emails/day):
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

**Mailgun** (Free tier: 5,000 emails/month):
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

## Testing Your Setup

1. Add your environment variables to `.env.local`
2. Restart your development server (`npm run dev`)
3. Submit a test contact form on your website
4. Check the server console for success/error messages
5. Check your `elitefabworx@outlook.com` inbox

## Common Error Messages

### "Invalid login" or "Authentication failed"
- Double-check your Gmail address and app password
- Make sure you're using the app password, not your regular password
- Verify 2FA is enabled

### "Less secure app access"
- This error shouldn't occur with app passwords
- If you see this, you're probably using your regular password instead of the app password

### "Connection timeout"
- Check your internet connection
- Verify the SMTP settings are correct
- Some hosting providers block outbound SMTP

## Quick Setup Summary

1. ✅ Enable 2FA on your Gmail account
2. ✅ Create an app password (16 characters)
3. ✅ Add to `.env.local`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=youremail@gmail.com
   SMTP_PASS=your-16-char-app-password
   ```
4. ✅ Test with a contact form submission

---

**Still having trouble?** Try using an Outlook account or consider a professional email service like SendGrid for more reliable delivery. 