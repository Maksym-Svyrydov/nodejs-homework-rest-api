const sgMail = require('@sendgrid/mail');

require('dotenv').config();

const { SENDGRID_API_KEY } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);
const sendEmail = async (data) => {
  const email = { ...data, from: 'msviridov@meta.ua' };
  await sgMail.send(email);
  return true;
};
module.exports = sendEmail;
// const nodemailer = require('nodemailer');
// require('dotenv').config();

// const { META_PASSWORD } = process.env;

// const nodemailerConfig = {
//   host: 'smpt.meta.ua',
//   port: 465,
//   secure: true,
//   auth: {
//     user: 'msviridov@meta.ua',
//     pass: META_PASSWORD,
//   },
// };

// const transport = nodemailer.createTransport(nodemailerConfig);

// const email = {
//   to: 'msvhts@gmail.com',
//   from: 'msviridov@meta.ua',
//   subject: 'Test email',
//   html: '<p><strong>Test email</strong></p>',
// };
// transport
//   .sendMail(email)
//   .then(() => console.log('Success'))
//   .catch((error) => console.log(error.message));
