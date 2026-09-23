import nodemailer from "nodemailer";

export async function sendOTP(to: string, otp: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to,
      subject: "Your Login Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-w-md mx-auto p-8 border border-gray-300 rounded-lg">
          <h2 style="color: #8A2BE2; text-transform: uppercase;">Login Verification</h2>
          <p>Your secure 6-digit verification code is:</p>
          <h1 style="letter-spacing: 5px; font-size: 32px; color: #333;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
