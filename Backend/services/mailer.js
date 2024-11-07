const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "phuctruong.310103@gmail.com",
    pass: process.env.GM_TOKEN,
  },
});

const mailOptions = {
  from: "phuctruong.310103@gmail.com",
  to: "21521300@gm.uit.edu.vn",
  subject: "Hello",
  text: "Hello from Nodemailer using Google App Password!",
};




exports.sendEmail = async (args) => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Email sent: " + info.response);
  });
};