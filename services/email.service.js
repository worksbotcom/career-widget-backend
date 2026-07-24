const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Career Widget" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });

        console.log("✅ Email sent successfully!");
        console.log("Message ID:", info.messageId);

    } catch (error) {
        console.error("❌ Email sending failed:");
        console.error(error);
        throw error;
    }
};

module.exports = sendEmail;