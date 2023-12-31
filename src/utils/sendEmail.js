const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) create tranporter: the service that we can send the emails from, like GMAIL , MailGin , SendGrid, MailTrap
  //   const transporter = nodemailer.createTransport({
  //     host: process.env.EMAIL_HOST,
  //     port: process.env.EMAIL_PORT, // if secure false will be 587, if true 465
  //     secure: false,
  //     requireTLS: true,
  //     auth: {
  //       user: process.env.EMAIL_USER,
  //       pass: process.env.EMAIL_PASSWORD,
  //     },
  //   });

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "d623273d3e1067",
      pass: "a0b3eb42fb3085",
    },
  });
  // 2) create some email options, like From, To, Subject, content
  const emailOptions = {
    from: `E-Shop@gmail.com`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3) send the email
  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
