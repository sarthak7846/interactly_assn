const twilio = require("twilio");
const express = require("express");
const sendMessage = require("./messenger");
const path = require("path");

const envFilePath = path.join(__dirname, "../dev.env");
require("dotenv").config({ path: envFilePath });

const app = express();
const port = process.env.TWILIO_PORT;

app.use(express.urlencoded({ extended: true }));
const VoiceResponse = twilio.twiml.VoiceResponse;

app.post("/twiml", (req, res) => {
  const response = new VoiceResponse();

  const audioURL =
    "https://github.com/sarthak7846/MyAudioRepo/raw/master/voice.mp3";
  response.play(audioURL);

  response.gather({
    input: "dtmf",
    action: "/action",
    numDigits: 1,
  });

  res.type("text/xml");
  res.send(response.toString());
});

app.post("/action", (req, res) => {
  const response = new VoiceResponse();

  const enteredDigit = req.body.Digits;

  if (enteredDigit === "1") {
    response.say("The interview link will be sent to you shortly. Thank you!");
    sendMessage();
  } else if (enteredDigit === "2") {
    response.say("Okay, have a great day!");
  } else {
    response.say(
      "You have entered a wrong input. Please provide the correct input."
    );
    response.redirect("/twiml");
  }

  res.type("text/xml");
  res.send(response.toString());
});

app.listen(port, () => {
  console.log("TwiML server is up on port", port);
});
