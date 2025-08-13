// utils/otp.ts
export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

export const otpExpiry = (): Date => {
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 10);
  return expires;
};
