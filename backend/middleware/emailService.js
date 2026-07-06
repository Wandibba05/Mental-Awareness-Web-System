const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendTwoFactorCode = async (email, code) => {
  const mailOptions = {
    from: `"MindCare Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'MindCare — Your Admin Login Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #101828; margin: 0;">💚 MindCare</h2>
          <p style="color: #667085; margin: 4px 0 0;">Mental Health Counselling System</p>
        </div>
        <div style="background: #ffffff; border-radius: 10px; padding: 24px; border: 1.5px solid #e4e7ec;">
          <h3 style="color: #101828; margin: 0 0 8px;">Admin login verification</h3>
          <p style="color: #667085; font-size: 14px; line-height: 1.6;">
            You are attempting to log in to the MindCare admin portal. Use the verification code below to complete your login.
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <div style="font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #92400e; background: #fef3c7; padding: 16px 24px; border-radius: 8px; display: inline-block;">
              ${code}
            </div>
          </div>
          <p style="color: #667085; font-size: 13px; text-align: center;">
            This code expires in <strong>10 minutes</strong>. Do not share it with anyone.
          </p>
        </div>
        <p style="color: #98a2b3; font-size: 12px; text-align: center; margin-top: 20px;">
          If you did not request this code, please ignore this email or contact your system administrator immediately.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendTwoFactorCode };