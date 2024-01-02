import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ErrorHandlerService } from './error-handler.service';

/**
 * Service for sending emails.
 */
@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  /**
   * Sends an email.
   * @param to - The recipient's email address.
   * @param subject - The subject of the email.
   * @param ejsHtml - The HTML content of the email.
   * @returns A promise that resolves when the email is sent.
   */
  async sendEmail(to: string, subject: string, ejsHtml: string): Promise<any> {
    try {
      const transporter = nodemailer.createTransport({
        host: this.configService.get<string>('EMAIL_HOST'),
        port: this.configService.get<number>('EMAIL_PORT'),
        auth: {
          user: this.configService.get<string>('EMAIL_USER'),
          pass: this.configService.get<string>('EMAIL_PASS'),
        },
      });

      const mailOptions = {
        from: this.configService.get<string>('EMAIL_FROM'),
        to,
        subject,
        html: ejsHtml,
      };

      return await transporter.sendMail(mailOptions);
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}
