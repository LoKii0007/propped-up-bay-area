const nodemailer = require('nodemailer')

const gmailTemplate = (message, link) => `
  <h1>${message}</h1>
  <p>Thank you for your order! Here is your invoice:</p>
  ${link ? '<a href="${link}">View Invoice</a>' : 'Error sending invoice. Please send an email on someone@gmail.com to recieve the invoice' }
`

const nodemailerTransport = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASS,
    }
})

module.exports = {nodemailerTransport, gmailTemplate}
