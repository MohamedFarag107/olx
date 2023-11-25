import { BadRequestError } from '@/error';
import FormData from 'form-data';
import Mailgun, { MessagesSendResult } from 'mailgun.js';
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
});

interface SendEmail {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
}
export const sendEmail = async ({
  from,
  html,
  subject,
  text,
  to,
}: SendEmail): Promise<MessagesSendResult> => {
  try {
    return await mg.messages.create('mofarag.me', {
      from: `mofarag <${from}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    throw new BadRequestError(
      [{ message: 'error while sending email' }],
      error,
    );
  }
};
