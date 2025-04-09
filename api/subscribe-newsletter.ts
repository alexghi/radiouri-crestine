export default async function handler(req: any, res: any) {
  try {
    console.log("Function started with method:", req.method);
    
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      console.log("Request body:", JSON.stringify(req.body));
      const { recaptchaToken } = req.body;
      
      if (!recaptchaToken) {
        return res.status(400).json({ 
          success: false, 
          error: 'reCAPTCHA token is required' 
        });
      }

      // For testing, just return success without actually calling external services
      return res.status(200).json({
        success: true,
        message: 'Successfully processed request',
        receivedToken: `${recaptchaToken.substring(0, 10)}...`
      });
      
    } catch (innerError) {
      console.error('Internal processing error:', innerError);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal processing error',
        details: innerError instanceof Error ? innerError.message : String(innerError)
      });
    }
  } catch (outerError) {
    console.error('Outer function error:', outerError);
    return res.status(500).json({ 
      success: false, 
      error: 'Function execution error',
      details: outerError instanceof Error ? outerError.message : String(outerError)
    });
  }
}