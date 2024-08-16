const twilio = require("twilio");
const path = require("path");

const envFilePath = path.join(__dirname, "../dev.env");
require("dotenv").config({ path: envFilePath });

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const createCall = async () => {
  const call = await client.calls.create({
    from: "+17278882199",
    to: "+917846929023",
    url: "https://bf25-106-212-84-64.ngrok-free.app/twiml",
  });

  console.log(`Calling to ${call.to}...`);
};

createCall();
