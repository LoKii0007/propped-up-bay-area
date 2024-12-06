const nodemailer = require("nodemailer");

const gmailTemplate = (message, link) => `
  <h1>${message}</h1>
  <p>Thank you for your order! Here is your invoice:</p>
  ${
    link
      ? `<a href="${link}">View Invoice</a>`
      : "Error sending invoice. Please send an email on someone@gmail.com to receive the invoice"
  }
`;

const gmailTemplateSignup = (firstName) => `
  Dear ${firstName},

  Thank you for signing up with Proppedup Bay Area! We’re excited to help you streamline your open house needs and post orders with ease.
  <br>
  Your account is now ready, and you can begin exploring our services, including:
  - Open House Support
  - Post Order Services
  <br>
  We’re here to make your experience smooth and hassle-free. If you have any questions or need assistance, don’t hesitate to reach out at info@proppedupbayarea.com – we’re always happy to help.
  <br>
  Thanks again for choosing Proppedup Bay Area. We look forward to being a part of your success!
  <br>
  Warm regards,   
  The Proppedup Bay Area Team
`;

const gmailTemplateIncompleteProfile = (firstName) => `
  Dear ${firstName},
  <br>
  We noticed that your profile is not yet complete. Completing your profile will help us serve you better and ensure a seamless experience.
  <br>
  Please take a moment to update your information by logging into your account.
  <br>
  If you have any questions or need assistance, feel free to contact us at info@proppedupbayarea.com.
  <br>
Warm regards,  
  The Proppedup Bay Area Team
`;

const nodemailerTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = { nodemailerTransport, gmailTemplate, gmailTemplateSignup, gmailTemplateIncompleteProfile };
