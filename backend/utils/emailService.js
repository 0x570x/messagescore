const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Verify your email. Unlock 7 more free scores.',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #334155; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .button { display: inline-block; padding: 14px 28px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Verify Your Email</h1>
            <p>Get 7 more free scores with a verified email and see how you rank against your competitors.</p>
            <p style="margin: 32px 0;">
              <a href="${verificationUrl}" class="button" style="color: #ffffff !important; background: #2563eb; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Verify Your Email</a>
            </p>
            <p style="font-size: 14px; color: #64748b;">
              Or copy this link: ${verificationUrl}
            </p>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 40px;">This link expires in 24 hours.</p>
          </div>
        </body>
        </html>
      `
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

async function sendScoreReport(email, messageText, messageType, result) {
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: `Your MessageScore Report: ${result.total_score}/100`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: sans-serif; padding: 20px;">
          <h1>Your MessageScore Report</h1>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 12px; color: #64748b;">Original Message (${messageType})</p>
            <p style="margin: 12px 0 0 0;">"${messageText}"</p>
          </div>
          <div style="text-align: center; margin: 32px 0;">
            <div style="font-size: 64px; font-weight: bold;">${result.total_score}/100</div>
          </div>
          <h3>Feedback</h3>
          <p><strong>Clarity:</strong> ${result.clarity_feedback}</p>
          <p><strong>Verifiability:</strong> ${result.verifiability_feedback}</p>
          <p><strong>Trust:</strong> ${result.trust_feedback}</p>
          ${result.rewrite ? `<div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <p style="font-weight: 600;">Suggested Rewrite:</p>
            <p>"${result.rewrite}"</p>
          </div>` : ''}
        </body>
        </html>
      `
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

module.exports = { sendVerificationEmail, sendScoreReport };