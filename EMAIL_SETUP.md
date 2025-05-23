# Email Notification Setup Guide

This guide will help you configure email notifications for contact enquiries and product purchases to be sent to `tommyrosato@gmail.com` from `elitefabworxconsole@gmail.com`.

## Environment Variables Required

Add these variables to your `.env.local` file (create it if it doesn't exist):

```env
# Gmail Configuration for Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=elitefabworxconsole@gmail.com
SMTP_PASS=your-16-character-app-password
```

## Gmail App Password Setup

Since you already have the app password working, here's your configuration:

1. **Use the app password** you just generated for `elitefabworxconsole@gmail.com`
2. **Configure your `.env.local`** with the settings above
3. **Replace `your-16-character-app-password`** with your actual app password

## SMTP Configuration Options

### Option 1: Using Outlook.com/Hotmail Account
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-outlook-email@outlook.com
SMTP_PASS=your-outlook-password
```

### Option 2: Using Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password  # Use App Password, not regular password
```

### Option 3: Using a Professional Email Service (Recommended)
For production, consider using services like:
- **SendGrid**: Professional email delivery service
- **AWS SES**: Amazon's email service
- **Mailgun**: Developer-friendly email service

## Email Security Notes

1. **For Gmail**: You'll need to generate an "App Password" instead of using your regular password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"

2. **For Outlook**: You may need to enable "Less secure app access" or use an app password.

3. **For Production**: Use environment-specific credentials and consider using a dedicated email service.

## What Gets Sent

### Contact Form Notifications
When someone submits a contact form, `tommyrosato@gmail.com` will receive:
- **Subject**: `🔧 New Enquiry: [Subject] - from [Customer Name]`
- **From**: `elitefabworxconsole@gmail.com`
- **Content**: Formatted HTML email with all customer details
- **Reply-To**: Set to customer's email for easy response

### Order Notifications  
When someone completes a purchase, `tommyrosato@gmail.com` will receive:
- **Subject**: `🛒 New Order #[Order Number] - $[Total] - [Customer Name]`
- **From**: `elitefabworxconsole@gmail.com`
- **Content**: Complete order details including items, customer info, and delivery method
- **Reply-To**: Set to customer's email

## Testing the Email Setup

1. Set up your environment variables
2. Submit a test contact form on your website
3. Check your `elitefabworx@outlook.com` inbox
4. If emails don't arrive, check the server logs for error messages

## Troubleshooting

### Common Issues:

1. **Authentication Failed**
   - Check your email and password are correct
   - Use app passwords for Gmail/Outlook
   - Ensure 2FA is properly configured

2. **Connection Timeout**
   - Verify SMTP host and port settings
   - Check if your hosting provider blocks outbound SMTP

3. **Emails in Spam**
   - Set up SPF/DKIM records for your domain
   - Consider using a professional email service

### Log Checking
Check your application logs for messages like:
- `Contact notification email sent successfully`
- `Order notification email sent successfully` 
- `Error sending contact notification email:`

## Email Templates

The system sends professionally formatted HTML emails with:
- Elite Fabworx branding (orange theme)
- Clear customer information tables
- Order details and next steps
- Mobile-friendly responsive design

## Production Recommendations

1. Use a dedicated email service (SendGrid, AWS SES, etc.)
2. Set up proper DNS records (SPF, DKIM, DMARC)
3. Monitor email delivery rates
4. Set up email alerts for system issues

---

**Need Help?** If you encounter issues setting up email notifications, check the server logs or contact your web developer. 