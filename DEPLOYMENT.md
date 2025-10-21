# RJ's Beauty Salon Website

A modern, responsive website for RJ's Beauty Salon with a working contact form.

## Features

- Responsive design
- Contact form with email functionality
- Beautiful gallery
- Service listings

## Deployment on Vercel

This website is configured to work seamlessly on Vercel with serverless functions for the contact form.

### Required Environment Variables

Before deploying to Vercel, you need to set up the following environment variables in your Vercel project settings:

1. `SMTP_USER` - Your email address (e.g., yourname@gmail.com)
2. `SMTP_PASS` - Your email password or App Password (see below)
3. `RECEIVER_MAIL` - Email address where contact form submissions should be sent
4. `SMTP_HOST` (optional) - SMTP server hostname (default: smtp.gmail.com)
5. `SMTP_PORT` (optional) - SMTP server port (default: 587)

### Gmail Setup (Recommended)

If you're using Gmail, you need to create an **App Password** instead of using your regular password:

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to Security
3. Enable 2-Step Verification if not already enabled
4. Under "2-Step Verification", scroll down to "App passwords"
5. Generate a new app password for "Mail"
6. Use this 16-character app password as your `SMTP_PASS` value

**Important**: Regular Gmail passwords won't work due to Google's security policies.

### Alternative Email Services

If Gmail doesn't work reliably on Vercel, consider these alternatives:

#### 1. SendGrid (Recommended for Vercel)
- Free tier: 100 emails/day
- More reliable on serverless platforms
- Environment variables:
  ```
  SMTP_HOST=smtp.sendgrid.net
  SMTP_PORT=587
  SMTP_USER=apikey
  SMTP_PASS=your_sendgrid_api_key
  ```
- Sign up at: https://sendgrid.com/

#### 2. Resend
- Modern API designed for serverless
- Free tier: 100 emails/day
- Sign up at: https://resend.com/

#### 3. Mailgun
- Reliable SMTP service
- Free tier available
- Environment variables:
  ```
  SMTP_HOST=smtp.mailgun.org
  SMTP_PORT=587
  SMTP_USER=your_mailgun_username
  SMTP_PASS=your_mailgun_password
  ```

### Deployment Steps

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the required environment variables in Vercel project settings
4. Deploy!

### Setting Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable:
   - Name: `SMTP_USER`, Value: your email
   - Name: `SMTP_PASS`, Value: your app password
   - Name: `RECEIVER_MAIL`, Value: recipient email
4. Click "Save"
5. Redeploy your project for changes to take effect

### Local Development

To test the contact form locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Create a `.env` file in the root directory:
   ```
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   RECEIVER_MAIL=recipient@example.com
   ```

4. Run the development server:
   ```bash
   vercel dev
   ```

5. Open http://localhost:3000 in your browser

### Troubleshooting

#### "Failed to send message" Error

1. **Check environment variables**: Make sure all required variables are set correctly
2. **Gmail App Password**: If using Gmail, ensure you're using an App Password, not your regular password
3. **SMTP Timeout**: Vercel has a 10-second timeout for serverless functions. If emails take longer, consider switching to a faster email service like SendGrid
4. **Firewall/Network Issues**: Some SMTP servers may block connections from Vercel's servers. Try alternative services like SendGrid or Resend
5. **Check Logs**: In Vercel Dashboard, go to your deployment → Functions → Select the contact function → View logs

#### Gmail Specific Issues

- **"Invalid login"**: You need to use an App Password, not your regular password
- **"Less secure app access"**: This option is deprecated. Use App Passwords instead
- **Rate limiting**: Gmail may rate-limit if you send too many emails quickly

### Support

If you continue to experience issues:
1. Check the Vercel function logs for detailed error messages
2. Try using SendGrid instead of Gmail (more reliable for serverless)
3. Verify your email credentials are correct
4. Ensure 2FA and App Passwords are properly configured

## License

MIT License
