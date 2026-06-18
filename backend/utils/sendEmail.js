const { Resend } = require("resend");

let resend;

const getResendClient = () => {
    if (!process.env.RESEND_API_KEY) {
        throw new Error("Missing RESEND_API_KEY environment variable.");
    }

    if (!resend) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }

    return resend;
};

const sendEmail = async (to, subject, html) => {
    await getResendClient().emails.send({
        from: process.env.EMAIL_FROM || "PawCruz Vet Clinic System <onboarding@resend.dev>",
        to,
        subject,
        html,
    });
};

module.exports = sendEmail;
