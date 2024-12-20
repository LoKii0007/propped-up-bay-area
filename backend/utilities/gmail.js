const nodemailer = require("nodemailer");

const gmailTemplateOrder = (firstName, type, link) => `
  Dear ${firstName},
  <br>
  <br>
  Thank you for placing an order with Proppedup Bay Area! Your ${type} support request has been successfully received.
  <br>
  <br>
  If you have any questions or need to make changes, please contact us at info@proppedupbayarea.com.
  <br>
  <br>
  <p>Thank you for your order! Here is your invoice:</p>
  <br>
  <br>  
  ${
    link
      ? `<a href="${link}">View Invoice</a>`
      : "Error sending invoice. Please send an email on info@proppedupbayarea.com to receive the invoice."
  }
  <br>
  <br>
  Warm regards,  
  <br>
  The Proppedup Bay Area Team
`;

const gmailTemplatePostOrder  = (firstName, link) => `
  Dear ${firstName},  
  <br>
  <br>
  Your post-order request has been successfully confirmed. We’re excited to assist you!
  <br>
  <br>
  For any questions or further assistance, don’t hesitate to reach out to us at info@proppedupbayarea.com.
  <br>
  <br>
  <p>Thank you for your order! Here is your invoice:</p>
  <br>
  <br>  
  ${
    link
      ? `<a href="${link}">View Invoice</a>`
      : "Error sending invoice. Please send an email on info@proppedupbayarea.com to receive the invoice."
  }
  <br>
  <br>
  Warm regards,  
  <br>
  The Proppedup Bay Area Team
`;

const gmailTemplateRenewal = (firstName, link) => `
  Dear ${firstName},
  <br>
  <br>
  This is a friendly reminder that your subscription with Proppedup Bay Area is nearing renewal. Renewing ensures uninterrupted access to our premium services.
  <br>
  To renew, please visit your account or click here: ${link}
  <br>
  If you need assistance, contact us at info@proppedupbayarea.com.
  <br>
  <br>
  Warm regards,  
  <br>
  The Proppedup Bay Area Team
`;

const gmailTemplateResetPassword = (firstName, otp) => `
  Dear ${firstName},
  <br>
  <br>
  We received a request to reset your password. Please use the following OTP to proceed:
  <br>
  OTP: ${otp}
  <br>
  If you didn’t request this, please contact us immediately at info@proppedupbayarea.com.
  <br>
  <br>
  Warm regards,  
  <br>
  The Proppedup Bay Area Team
`;

const gmailTemplatePasswordChanged = (firstName) => `
  Your password has been successfully changed. If you did not make this change, please contact us immediately at info@proppedupbayarea.com.
  <br>
  <br>
  Warm regards,  
  <br>
  The Proppedup Bay Area Team
`;

const gmailTemplateOrderStatus = (firstName, status) => `
  Dear ${firstName},  
  <br>
  <br>
  We’re writing to update you on the status of your order. Your order is now ${status}.
  <br>
  If you have any questions, please reach out to us at info@proppedupbayarea.com.
  <br>
  <br>
  Warm regards,  
  <br>
  The Proppedup Bay Area Team
`;



const gmailTemplateSignup = (firstName) => `
  Dear ${firstName},
  <br>
  <br>
  Thank you for signing up with Proppedup Bay Area! We’re excited to help you streamline your open house needs and post orders with ease.
  <br>
  <br>
  Your account is now ready, and you can begin exploring our services, including:
  <br>
  - Open House Support
  <br>
  - Post Order Services
  <br>
  <br>
  We’re here to make your experience smooth and hassle-free. If you have any questions or need assistance, don’t hesitate to reach out at info@proppedupbayarea.com – we’re always happy to help.
  <br>
  <br>
  Thanks again for choosing Proppedup Bay Area. We look forward to being a part of your success!
  <br>
  <br>
  Warm regards,   
  <br>
  The Proppedup Bay Area Team
`;

const gmailTemplateIncompleteProfile = (firstName) => `
  Dear ${firstName},
  <br>
  <br>
  We noticed that your profile is not yet complete. Completing your profile will help us serve you better and ensure a seamless experience.
  <br>
  <br>
  Please take a moment to update your information by logging into your account.
  <br>
  <br>
  If you have any questions or need assistance, feel free to contact us at info@proppedupbayarea.com.
  <br>
  <br>
  Warm regards,  
  <br>
  The Proppedup Bay Area Team
`;


//?-----------------------------------
//? admin side emails
//?-----------------------------------

const gmailTemplateAdminLogin = () => `
  Dear Admin,
  <br>
  <br>
  A login to the admin account was detected. If this wasn’t you, please secure your account immediately.
  <br>
  <br>
  Warm regards,  
  <br>
  The Proppedup Bay Area Team
`;

const gmailTemplateNewClient = (firstName) => `
  Dear Admin,
  <br>
  <br>
  A new client has registered on Proppedup Bay Area. Please review the details in the admin dashboard.
  <br>
  <br>
  Warm regards,  
  <br>
  The Proppedup Bay Area Team
`;

const gmailTemplateOrderConfirmation = (type) => ` 
  Dear Admin,
  <br>
  <br>
  A new ${type} order has been placed. Please review and process the order.
  <br>
  View the invoice  
  <br>
  <br>
  Warm regards,  
  <br>
  The Proppedup Bay Area Team
`;

const gmailTemplateCustomerDeleted = (firstName) => `
  Dear Admin,
  <br>
  <br>
  A customer with name ${firstName} has been deleted from the system. Please verify the details.
  <br>
  <br>
  Warm regards,  
  <br>
  The Proppedup Bay Area Team
`;

const gmailTemplateAdminResetPassword = () => `
  Dear Admin,
  <br>
  <br>
  A password reset has been requested for an admin account. If this wasn’t you, secure your account immediately.
  <br>
  <br>
  Warm regards,  
  <br>
  The Proppedup Bay Area Team
`;

const gmailTemplateAdminPasswordChanged = () => `
  Dear Admin,
  <br>
  <br>
  The password for an admin account has been successfully changed. If this wasn’t you, please secure your account immediately.
  <br>
  <br>
  Warm regards,  
  <br>
  The Proppedup Bay Area Team
`;

const gmailTemplateOrderStatusUpdate = () => `
  Dear Admin,
  <br>
  <br>
  The status of an order has been updated. Please review the new status in the admin dashboard.
  <br>
  <br>
  Warm regards,  
  <br>
  The Proppedup Bay Area Team
`;

const nodemailerTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = { nodemailerTransport, gmailTemplateOrder, gmailTemplateSignup, gmailTemplateIncompleteProfile, gmailTemplateAdminLogin, gmailTemplateNewClient, gmailTemplatePostOrder, gmailTemplateRenewal, gmailTemplateResetPassword, gmailTemplatePasswordChanged, gmailTemplateOrderStatus, gmailTemplateOrderStatusUpdate, gmailTemplateCustomerDeleted, gmailTemplateAdminResetPassword, gmailTemplateAdminPasswordChanged, gmailTemplateOrderConfirmation };
