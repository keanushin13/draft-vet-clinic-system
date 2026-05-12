let twilioClient = null;

const getClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials are not configured");
  }

  if (!twilioClient) {
    // Lazy-load Twilio to avoid startup failure when SMS is not enabled.
    // eslint-disable-next-line global-require
    const twilio = require("twilio");
    twilioClient = twilio(accountSid, authToken);
  }

  return twilioClient;
};

const normalizePhoneForTwilio = (phone) => {
  const digitsOnly = String(phone || "").replace(/\D/g, "");

  if (digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
    return `+63${digitsOnly.slice(1)}`;
  }

  if (digitsOnly.length === 10) {
    return `+63${digitsOnly}`;
  }

  if (digitsOnly.length === 12 && digitsOnly.startsWith("63")) {
    return `+${digitsOnly}`;
  }

  throw new Error("Invalid PH phone number format for SMS delivery");
};

const sendSms = async (to, body) => {
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!from) {
    throw new Error("TWILIO_PHONE_NUMBER is not configured");
  }

  const client = getClient();

  await client.messages.create({
    body,
    from,
    to: normalizePhoneForTwilio(to),
  });
};

module.exports = sendSms;
