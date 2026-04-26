
/* eslint-disable no-undef */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is missing' });
  }

  // Production için token server tarafında Cloudflare siteverify endpoint’i ile doğrulanmalı.
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(403).json({ success: false, message: 'Security verification failed' });
    }
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
