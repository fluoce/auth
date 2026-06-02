export function emailOtpKey(email: string) {
  return `otp:email:${email}`;
}

export function phoneOtpKey(phone: string) {
  return `otp:phone:${phone}`;
}

export function meKey(userId: string) {
  return `me:${userId}`;
}

export function exCodeKey(code: string) {
  return `code:${code}`;
}
