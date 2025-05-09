const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Order endpoint
app.post('/order', (req, res) => {
  const { customer, email, order, date } = req.body;

  // Save order to file
  const line = `Customer: ${customer}\nEmail: ${email}\nDate: ${date}\nOrder: ${JSON.stringify(order, null, 2)}\n\n`;
  fs.appendFileSync('orders.txt', line);

  // Send confirmation email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'velourbrand8@gmail.com',        // TODO: Replace with your email
      pass: 'enehrjljvmcejyle'            // TODO: Replace with your Gmail App Password
    }
  });

  const mailOptions = {
    from: 'velourbrand8@gmail.com',
    to: email,
    subject: 'Order Confirmation – Velour Clothing',
    text: `Hi ${customer},\n\nThanks for your order! We've received the following:\n\n` +
      order.map(item =>
        `• ${item.quantity} × ${item.name} – $${(item.price * item.quantity).toFixed(2)}`
      ).join('\n') +
      `\n\nOrder Date: ${date}\n\n– Velour Team`
  };
   

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Email failed:', error);
      res.status(500).send('Order saved, but email failed.');
    } else {
      console.log('✅ Email sent:', info.response);
      res.send('Order received and email sent!');
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
