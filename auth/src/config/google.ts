import 'dotenv/config';
import { google } from 'googleapis';
import type { OAuth2Client } from 'google-auth-library';

export const googleOauth2Client: OAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_AUTH_CLIENT_ID,
  process.env.GOOGLE_AUTH_SECRET_KEY,
  'postmessage',
);
