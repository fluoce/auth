import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { SendEmailType } from 'src/types/email.types';

@Injectable()
export class ResendService {
  private readonly resend: Resend;
  private readonly logger = new Logger(ResendService.name);

  constructor() {
    this.resend = new Resend(process.env.RESEND!);
  }

  async sendEmail({ email, name, otp }: SendEmailType): Promise<boolean> {
    const from = `Fluoce Auth <no-reply@mail.auth.fluoce.com>`;

    const subject = 'Your Fluoce Verification Code';

    const html = `<p>hi, ${name}</p></hr><p>your code - ${otp}</p>`;

    const { data, error } = await this.resend.emails.send({
      from,
      to: [email],
      subject,
      html,
    });

    if (!data && error) {
      this.logger.error('resend email send error', error);
      return false;
    }

    return true;
  }
}
