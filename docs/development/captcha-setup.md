# reCAPTCHA Setup for Contact Form

This guide explains how to set up Google reCAPTCHA for the contact form protection.

## 1. Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
2. Sign in with your Google account
3. Fill in the form:
   - **Label**: Your project name (e.g., "My Website Contact Form")
   - **reCAPTCHA type**: Choose "reCAPTCHA v2" and then "I'm not a robot" Checkbox
   - **Domains**: Add your website domain (e.g., "localhost" for development, "yourdomain.com" for production)
   - **Accept the reCAPTCHA Terms of Service**
4. Click **Submit**
5. Copy the **Site Key** and **Secret Key**

## 2. Add Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# For development (localhost)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here

# For production, you may want different keys
# NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_production_site_key_here
# RECAPTCHA_SECRET_KEY=your_production_secret_key_here
```

## 3. Environment Variable Details

- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`: Public key used in the frontend component
- `RECAPTCHA_SECRET_KEY`: Secret key used for server-side verification (keep this private!)

## 4. Testing

1. Restart your development server after adding the environment variables
2. Navigate to the contact page
3. You should see the reCAPTCHA widget below the message field
4. Complete the reCAPTCHA checkbox before submitting the form

## 5. How It Works

1. User completes the reCAPTCHA checkbox
2. A token is generated and sent with the form data
3. Server verifies the token with Google's API
4. Email is only sent if verification succeeds

## 6. Troubleshooting

### reCAPTCHA widget not showing

- Check that `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set correctly
- Ensure your domain is registered in the reCAPTCHA admin console

### Form submission fails with captcha error

- Check that `RECAPTCHA_SECRET_KEY` is set correctly on the server
- Verify the keys match between your reCAPTCHA site configuration and environment variables
- Check browser console for any JavaScript errors

### Invalid domain error

- Make sure your current domain (including localhost for development) is listed in the reCAPTCHA admin console
- For production, add both www and non-www versions of your domain

## 7. Security Notes

- Never expose the `RECAPTCHA_SECRET_KEY` in client-side code
- The site key is public and safe to expose
- Consider using different key pairs for development and production environments
- Monitor your reCAPTCHA analytics in the admin console
