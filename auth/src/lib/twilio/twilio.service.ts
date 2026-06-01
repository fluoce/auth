import { Injectable } from '@nestjs/common';
import twilio from 'twilio';

@Injectable()
export class TwilioService {
  private readonly twilio: twilio.Twilio;

  constructor() {
    this.twilio = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  async sendOtp(phone: string, otp: string): Promise<string | null> {
    const res = await this.twilio.messages.create({
      body: `Your Fluoce Auth code: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    return res ? res.sid : null;
  }
}
