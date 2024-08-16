const twilio = require("twilio");
const path = require("path");

const envFilePath = path.join(__dirname, "../dev.env");
require("dotenv").config({ path: envFilePath });

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendMessage = async () => {
  const message = await client.messages.create({
    body: "Here is the link to personalized interview: https://v.personaliz.ai/?id=9b697c1a&uid=fe141702f66c760d85ab&mode=test",
    from: "+17278882199",
    to: "+917381428693",
  });
};

module.exports = sendMessage;
