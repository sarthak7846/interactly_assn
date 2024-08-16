const express = require("express");
const axios = require("axios");
const path = require("path");

const envFilePath = path.join(__dirname, "../dev.env");
require("dotenv").config({ path: envFilePath });

const port = process.env.CRM_PORT;
const BASE_URL = process.env.CRM_SERVER_BASE_URL;
const API_KEY = process.env.CRM_SERVER_API_KEY;

const app = express();
app.use(express.json());

app.get("/getAllContacts", async (req, res) => {
  let { data_store } = req.query;
  if (!data_store) {
    data_store = "CRM";
  }
  try {
    if (data_store === "CRM") {
      const response = await axios.get(
        `${BASE_URL}api/contacts/view/402009674871`,
        {
          headers: {
            Authorization: `Token token=${API_KEY}`,
          },
        }
      );
      res.json(response.data);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/getContact/:contact_id", async (req, res) => {
  const { contact_id } = req.params;
  const { data_store } = req.query;

  try {
    if (data_store === "CRM") {
      const response = await axios.get(
        `${BASE_URL}api/contacts/${contact_id}`,
        {
          headers: {
            Authorization: `Token token=${API_KEY}`,
          },
        }
      );
      res.json(response.data);
    }
  } catch (err) {
    if (err.response) {
      res.status(404).json({
        error: "Contact not found",
        message: `No contact found with ID ${contact_id}`,
      });
    } else {
      res.status(500).json({
        error: "Internal Server Error",
        message: "An unexpected error occurred",
      });
    }
    console.error("Error updating contact:", err.message);
  }
});

app.post("/createContact", async (req, res) => {
  const { first_name, last_name, email, mobile_number } = req.body;
  const { data_store } = req.query;

  try {
    if (data_store === "CRM") {
      const contactData = {
        contact: {
          first_name,
          last_name,
          email,
          mobile_number,
        },
      };

      const response = await axios.post(
        BASE_URL + "api/contacts",
        contactData,
        {
          headers: {
            Authorization: `Token token=${API_KEY}`,
          },
        }
      );

      res.json(response.data);
    }
  } catch (err) {
    if (err.response) {
      res.status(err.response.status).send({
        error: err.response.statusText,
        message:
          parseErrorMessage(err.response.data.errors.message) ||
          "An error occurred while creating the contact",
      });
    } else {
      res.status(500).json({
        error: "Internal Server Error",
        message: "An unexpected error occurred",
      });
    }
    console.error("Error creating contact:", err.message);
  }
});

app.post("/updateContact/:contact_id", async (req, res) => {
  const { contact_id } = req.params;
  const { email, mobile_number } = req.body;
  const { data_store } = req.query;

  try {
    if (data_store === "CRM") {
      const updateData = {
        contact: {
          email,
          mobile_number,
        },
      };

      const response = await axios.put(
        `${BASE_URL}api/contacts/${contact_id}`,
        updateData,
        {
          headers: {
            Authorization: `Token token=${API_KEY}`,
          },
        }
      );

      res.json(response.data);
    }
  } catch (err) {
    if (err.response) {
      // Check if the status code is 404, meaning the contact_id doesn't exist
      if (err.response.status === 404) {
        res.status(404).json({
          error: "Contact not found",
          message: `No contact found with ID ${contact_id}`,
        });
      } else {
        res.status(err.response.status).json({
          error: err.response.statusText,
          message:
            err.response.data.message ||
            "An error occurred while updating the contact",
        });
      }
    } else {
      res.status(500).json({
        error: "Internal Server Error",
        message: "An unexpected error occurred",
      });
    }
    console.error("Error updating contact:", err.message);
  }
});

app.post("/deleteContact/:contact_id", async (req, res) => {
  const { contact_id } = req.params;
  const { data_store } = req.query;

  try {
    if (data_store === "CRM") {
      const response = await axios.delete(
        `${BASE_URL}api/contacts/${contact_id}`,
        {
          headers: {
            Authorization: `Token token=${API_KEY}`,
          },
        }
      );

      res.json(response.data);
    }
  } catch (err) {
    if (err.response) {
      // Check if the status code is 404, meaning the contact_id doesn't exist
      if (err.response.status === 404) {
        res.status(404).json({
          error: "Contact not found",
          message: `No contact found with ID ${contact_id}`,
        });
      } else {
        res.status(err.response.status).json({
          error: err.response.statusText,
          message:
            err.response.data.message ||
            "An error occurred while deleting the contact",
        });
      }
    } else {
      res.status(500).json({
        error: "Internal Server Error",
        message: "An unexpected error occurred",
      });
    }
    console.error("Error deleting contact:", err.message);
  }
});

const parseErrorMessage = (errorMessage) => {
  try {
    const parsedMessage = JSON.parse(errorMessage);
    return parsedMessage.message || errorMessage;
  } catch (e) {
    return errorMessage;
  }
};

app.listen(port, () => {
  console.log("CRM server is up on port", port);
});
