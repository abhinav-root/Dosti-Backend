const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transport = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })
);

function sendForgotPasswordEmail(to, resetPasswordLink) {
  const mailOptions = {
    from: process.env.EMAIL, // Sender address
    to: to,
    subject: "Dosti-chat-app: Forgot Password Link", // Subject line
    html: `
            <div>Click on below link to reset your password.</div>
            <div><a href=${resetPasswordLink}>Reset Password</a></div>
            `, 
  };
  transport.sendMail(mailOptions);
}

module.exports = { sendForgotPasswordEmail };
