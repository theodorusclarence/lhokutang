import nodemailer from 'nodemailer';

export const sendMail = ({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) => {
  const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);

  transporter.sendMail(
    {
      from: 'LhokUtang <givemefeedbackplease@gmail.com>',
      to,
      subject,
      text,
      html,
    },
    (err) => {
      if (err) {
        throw err;
      }
    }
  );

  return;
};
