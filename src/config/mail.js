export default {
  host: 'smtp.mailtrap.io',
  port: 2525,
  secure: false,
  auth: {
    user: '25f13b30761ee3',
    pass: 'e15e1acb7dd070',
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
