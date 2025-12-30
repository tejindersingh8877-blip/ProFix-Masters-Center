import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `ProFix Masters <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

export const sendOTPEmail = async (to: string, otp: string): Promise<void> => {
  const subject = 'Your OTP for ProFix Masters';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify Your Account</h2>
      <p>Your OTP for verification is:</p>
      <h1 style="color: #4F46E5; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
      <p>This OTP will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;
  await sendEmail(to, subject, html);
};

export const sendBookingConfirmation = async (
  to: string, 
  customerName: string, 
  bookingDetails: any
): Promise<void> => {
  const subject = 'Booking Confirmation - ProFix Masters';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Booking Confirmed!</h2>
      <p>Dear ${customerName},</p>
      <p>Your booking has been confirmed. Here are the details:</p>
      <ul>
        <li><strong>Service:</strong> ${bookingDetails.service}</li>
        <li><strong>Date:</strong> ${bookingDetails.date}</li>
        <li><strong>Time:</strong> ${bookingDetails.time}</li>
        <li><strong>Amount:</strong> ₹${bookingDetails.amount}</li>
      </ul>
      <p>Thank you for choosing ProFix Masters!</p>
    </div>
  `;
  await sendEmail(to, subject, html);
};
