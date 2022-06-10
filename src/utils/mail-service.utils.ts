import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendRegistrationToken = async (email: string, token: string) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USERNAME,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  let emailInfo = await transporter.sendMail({
    from: "foo@gmail.com",
    to: `${email}`,
    subject: "Registration token",
    html: `Your registration token is <br /><h1>${token}</h1> . Please donot share with anyone else.`,
  });

  console.log("emai message id: ", emailInfo.messageId);
  console.log("content: ", emailInfo.response);

  console.log("email url: ", nodemailer.getTestMessageUrl(emailInfo));
};
