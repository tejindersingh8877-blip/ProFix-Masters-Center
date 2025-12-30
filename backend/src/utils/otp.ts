import OTP from '../models/OTP';

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createOTP = async (phone: string, email?: string): Promise<string> => {
  const otp = generateOTP();
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10');
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

  await OTP.create({
    phone,
    email,
    otp,
    expiresAt
  });

  return otp;
};

export const verifyOTP = async (phone: string, otp: string): Promise<boolean> => {
  const otpDoc = await OTP.findOne({
    phone,
    otp,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  });

  if (!otpDoc) {
    return false;
  }

  otpDoc.isUsed = true;
  await otpDoc.save();

  return true;
};
