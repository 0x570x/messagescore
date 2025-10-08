export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, messageText, messageType, result } = req.body;

    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'MessageScore <reports@emails.messagescore.com>',
        to: email,
        subject: `Your MessageScore Report: ${result.total_score}/100`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0f172a; margin-bottom: 24px;">Your MessageScore Report</h1>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
              <h2 style="color: #0f172a; margin-top: 0;">Original Message</h2>
              <p style="color: #475569; font-style: italic;">"${messageText}"</p>
              <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">Type: ${messageType}</p>
            </div>

            <div style="background: #0f172a; color: white; padding: 32px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
              <div style="font-size: 64px; font-weight: bold; margin-bottom: 8px;">${result.total_score}</div>
              <div style="font-size: 18px; opacity: 0.8;">/ 100</div>
            </div>

            <div style="margin-bottom: 24px;">
              <h3 style="color: #0f172a;">Score Breakdown</h3>
              <ul style="list-style: none; padding: 0;">
                <li style="padding: 12px; background: #f8fafc; margin-bottom: 8px; border-radius: 4px;">
                  <strong>Clarity:</strong> ${result.clarity_score}/10 - ${result.clarity_feedback}
                </li>
                <li style="padding: 12px; background: #f8fafc; margin-bottom: 8px; border-radius: 4px;">
                  <strong>Verifiability:</strong> ${result.verifiability_score}/10 - ${result.verifiability_feedback}
                </li>
                <li style="padding: 12px; background: #f8fafc; margin-bottom: 8px; border-radius: 4px;">
                  <strong>Trust:</strong> ${result.trust_score}/10 - ${result.trust_feedback}
                </li>
              </ul>
            </div>

            ${result.rewrite ? `
              <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                <h3 style="color: #1e40af; margin-top: 0;">Suggested Rewrite</h3>
                <p style="color: #1e3a8a; font-weight: 500;">"${result.rewrite}"</p>
              </div>
            ` : ''}

            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="color: #64748b; font-size: 14px;">Test more messages at <a href="https://messagescore.com" style="color: #3b82f6;">MessageScore.com</a></p>
            </div>
          </div>
        `
      })
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send email');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}