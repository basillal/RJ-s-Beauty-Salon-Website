# RJ's Beauty Salon Website

A modern, responsive website for RJ's Beauty Salon with a fully functional contact form.

## Quick Start

1. Clone the repository
2. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed setup instructions
3. Set up environment variables (see `.env.example`)
4. Deploy to Vercel or run locally with `vercel dev`

## Contact Form Setup

The contact form uses SMTP to send emails. You need to configure environment variables:

- `SMTP_USER` - Your email address
- `SMTP_PASS` - Your email password/App Password  
- `RECEIVER_MAIL` - Where to receive contact form submissions

**Important**: If using Gmail, you must use an [App Password](https://support.google.com/accounts/answer/185833), not your regular password.

For detailed setup instructions and troubleshooting, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Features

- Responsive design
- Working contact form with email notifications
- Gallery section
- Services showcase
- About section

## Support

See [DEPLOYMENT.md](DEPLOYMENT.md) for troubleshooting and alternative email service options.
