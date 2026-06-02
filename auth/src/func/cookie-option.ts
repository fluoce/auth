export function cookieOption(age?: number): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax';
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: age || 1000 * 60 * 60 * 24 * 60,
  };
}
