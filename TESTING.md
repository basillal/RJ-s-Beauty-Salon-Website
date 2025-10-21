# Testing Guide for Contact Form

## Quick Test Checklist

### Before Deploying to Vercel

1. **Verify Files Exist:**
   - [ ] `package.json` exists
   - [ ] `vercel.json` exists
   - [ ] `api/contact.js` is updated
   - [ ] `.env.example` exists
   - [ ] `.gitignore` exists

2. **Local Testing (Optional but Recommended):**
   ```bash
   # Install dependencies
   npm install
   
   # Install Vercel CLI
   npm install -g vercel
   
   # Create .env file from template
   cp .env.example .env
   
   # Edit .env with your actual credentials
   # Then run:
   vercel dev
   
   # Open http://localhost:3000 and test the contact form
   ```

### Setting Up Vercel

1. **Get Gmail App Password (if using Gmail):**
   - Go to https://myaccount.google.com/
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Save the 16-character code

2. **Set Environment Variables in Vercel:**
   - Go to https://vercel.com/dashboard
   - Select your project
   - Settings → Environment Variables
   - Add these variables:
     - `SMTP_USER` = your_email@gmail.com
     - `SMTP_PASS` = your_app_password (16 chars from Gmail)
     - `RECEIVER_MAIL` = where_to_receive@example.com
   - Click "Save"

3. **Deploy:**
   - Push code to GitHub (already done via this PR)
   - Vercel should auto-deploy
   - Or click "Deploy" in Vercel Dashboard

### Testing on Production

1. **Open Your Website**
   - Navigate to the contact section
   - Fill out the form with test data:
     - Name: "Test User"
     - Email: "test@example.com"
     - Subject: "Test Message"
     - Message: "This is a test of the contact form"
   - Click Submit

2. **Expected Behavior:**
   - ✅ Loading indicator shows
   - ✅ Success message appears
   - ✅ Form resets after success
   - ✅ Email received at RECEIVER_MAIL

3. **If Error Occurs:**
   - Check Vercel function logs:
     - Go to Vercel Dashboard
     - Deployments → Latest → Functions
     - Click on `/api/contact` function
     - View logs for error details
   
   - Common issues:
     - "Invalid login" → Use App Password, not regular password
     - "Connection timeout" → Try SendGrid instead
     - "Missing environment variables" → Check Vercel settings

### Testing Different SMTP Providers

#### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

#### SendGrid (Recommended)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your_mailgun_username
SMTP_PASS=your_mailgun_password
```

### Troubleshooting Steps

1. **Check Environment Variables:**
   ```bash
   # In Vercel Dashboard, verify all variables are set correctly
   # No typos, no extra spaces
   ```

2. **Check Function Logs:**
   - Vercel Dashboard → Deployments → Functions
   - Look for error messages
   - Common errors and solutions in DEPLOYMENT.md

3. **Test with Curl:**
   ```bash
   curl -X POST https://your-site.vercel.app/api/contact \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test",
       "email": "test@example.com",
       "subject": "Test",
       "message": "Test message"
     }'
   ```

4. **Switch to SendGrid if Gmail Fails:**
   - Sign up at https://sendgrid.com/
   - Get API key
   - Update environment variables
   - Redeploy

### Success Indicators

✅ **Everything Working:**
- Form submits without errors
- Success message appears
- Email received at RECEIVER_MAIL
- Email has proper formatting
- Reply-to address is the form submitter

✅ **Email Content Should Include:**
- Sender name
- Sender email
- Subject (or "New Contact Form Submission")
- Message text
- HTML formatting (if email client supports it)

### Need Help?

1. Review DEPLOYMENT.md for detailed troubleshooting
2. Check SOLUTION_SUMMARY.md for technical details
3. Review Vercel function logs for specific errors
4. Consider switching to SendGrid for better reliability

### Testing Matrix

| Test Case | Expected Result |
|-----------|----------------|
| Fill all fields | ✅ Success |
| Missing name | ❌ "Please fill all required fields" |
| Missing email | ❌ "Please fill all required fields" |
| Missing message | ❌ "Please fill all required fields" |
| Invalid SMTP credentials | ❌ "Email authentication failed" |
| SMTP timeout | ❌ "Connection timeout" |
| Missing env variables | ❌ "Server configuration error" |

## Monitoring

After deployment, monitor:
- Vercel function logs for errors
- Email deliverability 
- Form submission success rate
- User feedback about email receipt

## Production Recommendations

1. **Use SendGrid** instead of Gmail for production
2. **Monitor function logs** regularly
3. **Set up error alerts** in Vercel
4. **Test form** after each deployment
5. **Keep App Passwords secure** (never commit to git)
