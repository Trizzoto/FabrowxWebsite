# Elite Fabworx Website

Modern e-commerce website for Elite Fabworx, a turbo & exhaust specialist shop. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Modern, responsive design
- Product catalog with filtering and search
- Secure checkout with Stripe
- Admin dashboard
- Xero integration for accounting
- Email enquiry forms
- Image gallery

## Development

### Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in the required values
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Stripe Integration

This project supports two methods for Stripe integration:

#### Option 1: Direct API Keys (Recommended)

The simplest approach is to use direct API keys from your Stripe account:

1. Go to [Stripe Dashboard > Developers > API Keys](https://dashboard.stripe.com/apikeys)
2. Copy your Publishable Key and Secret Key
3. Add them to your environment variables:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```
4. For development, you can also enter these keys in the admin panel at `/admin/stripe-keys`

#### Option 2: OAuth Connect (Legacy)

Alternatively, you can use the Stripe Connect OAuth flow:

1. Create a Stripe Connect application at [Stripe Dashboard > Connect > Settings](https://dashboard.stripe.com/settings/connect)
2. Configure the redirect URI to be `https://your-domain.com/api/stripe/callback`
3. Add the Client ID to your environment variables:
   ```
   STRIPE_CLIENT_ID=ca_...
   ```
4. Visit the admin panel at `/admin/stripe` to connect your account

### Environment Variables

See `.env.example` for all required environment variables.

## Deployment

This site is deployed on Vercel.

1. Push your changes to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in the Vercel dashboard
4. Deploy

## Architecture

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **API**: Next.js API Routes
- **Payments**: Stripe
- **Accounting**: Xero API
- **Email**: Resend

## License

All rights reserved. 