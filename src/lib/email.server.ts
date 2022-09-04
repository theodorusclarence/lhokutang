/* eslint-disable no-console */
import mailjet from 'node-mailjet';
export const sendMail = ({
  to,
  toName,
  subject,
  text,
  html,
}: {
  to: string;
  toName: string;
  subject: string;
  text: string;
  html?: string;
}) => {
  const mailjetClient = mailjet.apiConnect(
    process.env.MAILJET_API_KEY ?? '',
    process.env.MAILJET_SECRET_KEY ?? ''
  );

  const req = mailjetClient.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'givemefeedbackplease@gmail.com',
          Name: 'Lhokutang',
        },
        To: [{ Email: to, Name: toName }],
        Subject: subject,
        TextPart: text,
        HTMLPart: html,
      },
    ],
  });

  req
    .then((res) => {
      console.log(res.body);
    })
    .catch((err) => console.error(err));

  return;
};
