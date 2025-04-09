// api/verify-recaptcha.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  console.log("entered subscription", req);
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { recaptchaToken } = req.body;
    
    if (!recaptchaToken) {
      return res.status(400).json({ 
        success: false, 
        error: 'reCAPTCHA token is required' 
      });
    }

    // Make a request to mailchimp and subscribe

    return res.status(200).json({message: 'Successfully subscribed to newsletter'})
    // Return the verification result
    // return res.status(200).json(data);
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to verify reCAPTCHA' 
    });
  }
}