const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter (service that will send email like: gmail, Mailgun, mailtrap, sendGrid)
  // gmail => free 500 email in a day
  // service that will send email
  // i will send from it my own email
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure false post = 587 else true port = 465
    secure: process.env.EMAIL_PORT == 465, // ✅ smart condition
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define email options (from, to , subject, email content)
  const mailOptions = {
    from: "E-Shop App <basuoney.chrom@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
