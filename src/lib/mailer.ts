import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendOTP = async (to: string, otp: string) => {
  const mailOptions = {
    from: 'Belvo Intern Connect <' + process.env.SMTP_EMAIL + '>',
    to,
    subject: 'Your Login Verification Code',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #000; border-radius: 12px; background-color: #fff; box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);">
        <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Belvo Auth Verification</h2>
        <p style="font-size: 16px; margin-bottom: 30px;">You recently requested to log in. Please use the verification code below to complete your sign in:</p>
        <div style="background-color: #f1f5f9; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 30px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #8A2BE2;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #64748b;">This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
