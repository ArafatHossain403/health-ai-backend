import * as nodemailer from 'nodemailer';

interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  app: string;
}

export const mailConfig: MailConfig = {
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 465,
  secure: Number(process.env.MAIL_PORT || 465) == 465, // `true` for port 465, `false` for all other ports
  user: process.env.MAIL_USERNAME,
  pass: process.env.MAIL_PASSWORD,
  from: process.env.MAIL_FROM_ADDRESS,
  app: process.env.MAIL_FROM_ADDRESS,
};

export const mailTransporter = nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  secure: mailConfig.secure,
  auth: {
    user: mailConfig.user,
    pass: mailConfig.pass,
  },
});
