const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Log environment variables to verify they are loaded correctly
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Function to read and increment the form submission counter
const getFormSubmissionCount = () => {
    const filePath = path.join(__dirname, 'formSubmissionCount.txt');
    let count = 0;

    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        count = parseInt(data, 10) || 0;
    }

    count += 1;
    fs.writeFileSync(filePath, count.toString(), 'utf8');
    return count;
};

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { name, age, email, phone, whatsapp, address, feedback } = req.body;
    console.log('Form submission received:', req.body); // Log the request body

    const formCount = getFormSubmissionCount();

    // Validate email address
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email)) {
        return res.redirect('/error.html');
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "heartfulnessbhind@gmail.com", // Use Email here 
            pass: "xprl kuqd dkcb mteu" // Use App password
        }
    });

    // Email options
    const mailOptions = {
        from: "heartfulnessbhind@gmail.com", // Use Email here 
        to: "heartfulnessbhind@gmail.com", // Use Email here 
        subject: 'New Survey Submission',
        text: `
        Name: ${name}
        Age: ${age}
        Email: ${email}
        Phone: ${phone}
        WhatsApp: ${whatsapp}
        Address: ${address}
        Feedback: ${feedback}
        
        Total Forms Submitted: ${formCount}
        `
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred while sending email:', error);
            return res.redirect('/error.html');
        } else {
            console.log('Email sent: ' + info.response);
            return res.redirect(`/success.html?name=${encodeURIComponent(name)}`);
        }
    });
});

// Serve the success page
app.get('/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// Serve the error page
app.get('/error.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'error.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));