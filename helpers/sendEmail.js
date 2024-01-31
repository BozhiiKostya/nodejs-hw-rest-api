const nodemailer = require('nodemailer');
require('dotenv').config();

const { EMAIL_PASS_FROM } = process.env;

// const nodemailerConfig = {
//   host: 'smtp.meta.ua',
//   port: 465,
//   secure: true,
//   auth: {
//     user: 'kostyatest@meta.ua',
//     pass: EMAIL_PASS_FROM,
//   },
// };
const nodemailerConfig = {
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: 'kostyazap1@outlook.com',
    pass: EMAIL_PASS_FROM,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: 'kostyazap1@outlook.com' };
  await transport.sendMail(email);
};

module.exports = sendEmail;
