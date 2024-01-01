import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { mailConfig, mailTransporter } from 'src/config/mail.config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  constructor() {
    this.transporter = mailTransporter;
  }

  async sendMail(
    subject: string,
    to_addresses: string[],
    html_content = '',
    text_content = '',
    attachments: Attachment[] = [],
    from_address?: string,
    from_name?: string,
  ): Promise<boolean> {
    const info = await this.transporter.sendMail({
      from: `"${from_name || mailConfig.app}" <${
        from_address || mailConfig.from
      }>`, // sender name & address
      to: to_addresses.toString(), // list of receivers
      subject: subject, // Subject line
      text: text_content, // plain text body
      html: html_content, // html body
      attachments: attachments,
    });
    // console.log('mail sent info: ', info);
    if (info?.messageId) return true;
    else return false;
  }
}
