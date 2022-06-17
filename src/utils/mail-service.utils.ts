import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

type emailPayload = {
  token: string;
  id: string;
};

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USERNAME,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });
};

export const sendRegistrationToken = async (
  email: string,
  token: string,
  id: string
) => {
  let transporter = createTransporter();

  let emailInfo = await transporter.sendMail({
    from: "foo@gmail.com",
    to: `${email}`,
    subject: "Registration token",
    html: `Your registration Id is <h1>${id}</h1><br />Your registration token is <br /><h1>${token}</h1> . Please donot share with anyone else.`,
  });
};

export const sendChangePasswordToken = async (
  email: string,
  params: emailPayload | string
) => {
  let transporter = createTransporter();

  let emailInfo = await transporter.sendMail({
    from: "foo@gmail.com",
    to: `${email}`,
    subject:
      typeof params == "string"
        ? "Reset password link"
        : "Change password Token",
    html:
      typeof params == "string"
        ? `<h3>Your password reset link is given below.</h3><br />
    ${params}
    <br /> The link will redirect you to password reset page.`
        : `Your  ID is <h1>${params.id}</h1><br />Your token is <br /><h1>${params.token}</h1> . Please donot share with anyone else.`,
  });
};
