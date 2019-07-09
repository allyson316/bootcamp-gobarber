export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Equipe GoBarber <noreply@gobarber.com>',
  },
};

/* serviços de envio de email que podem ser utilizados em produção
Amazon SES,
Mailgun,
Sparkpost,
Mandril

Mailtrap - apenas para desenvolvimento (DEV)
*/
