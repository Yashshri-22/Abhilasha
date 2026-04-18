// ===============================
// 🚀 IMPORTS
// ===============================
const express = require("express");
const AWS = require("aws-sdk");
const cors = require("cors");

// ===============================
// 🚀 APP SETUP
// ===============================
const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// 🔐 AWS CONFIG
// ===============================
AWS.config.update({
  region: "eu-north-1", // change if needed
  accessKeyId: "AKIAY4OSU4OS3Q54S4RS",
  secretAccessKey: "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",
});

const dynamo = new AWS.DynamoDB.DocumentClient();

// ===============================
// 📤 SAVE PERSONAL DETAILS
// ===============================
app.post("/savePersonal", async (req, res) => {
  try {
    const { userId, data } = req.body;

    const params = {
      TableName: "users",
      Key: { userId },
      UpdateExpression: "SET personalDetails = :p",
      ExpressionAttributeValues: {
        ":p": data,
      },
    };

    await dynamo.update(params).promise();

    res.send({ success: true });
  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).send({ error: "Failed to save data" });
  }
});

// ===============================
// 📥 GET USER DATA
// ===============================
app.get("/getUser/:userId", async (req, res) => {
  try {
    const params = {
      TableName: "users",
      Key: { userId: req.params.userId },
    };

    const result = await dynamo.get(params).promise();

    res.send(result.Item || {});
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).send({ error: "Failed to fetch data" });
  }
});

// ===============================
// 📤 SAVE EDUCATION DETAILS
// ===============================
app.post("/saveEducation", async (req, res) => {
  try {
    const { userId, data } = req.body;

    const params = {
      TableName: "users",
      Key: { userId },
      UpdateExpression: "SET education = :e",
      ExpressionAttributeValues: {
        ":e": data,
      },
    };

    await dynamo.update(params).promise();

    res.send({ success: true });
  } catch (err) {
    console.error("Education Save Error:", err);
    res.status(500).send({ error: "Failed to save education data" });
  }
});

// ===============================
// 📤 SAVE BANK DETAILS
// ===============================
app.post("/saveBank", async (req, res) => {
  try {
    const { userId, data } = req.body;

    const params = {
      TableName: "users",
      Key: { userId },
      UpdateExpression: "SET bankDetails = :b",
      ExpressionAttributeValues: {
        ":b": data,
      },
    };

    await dynamo.update(params).promise();

    res.send({ success: true });
  } catch (err) {
    console.error("Bank Save Error:", err);
    res.status(500).send({ error: "Failed to save bank data" });
  }
});

// ===============================
// 📤 SAVE DIVYANG DETAILS
// ===============================
app.post("/saveDivyang", async (req, res) => {
  try {
    const { userId, data } = req.body;

    const params = {
      TableName: "users",
      Key: { userId },
      UpdateExpression: "SET divyangDetails = :d",
      ExpressionAttributeValues: {
        ":d": data,
      },
    };

    await dynamo.update(params).promise();

    res.send({ success: true });
  } catch (err) {
    console.error("Divyang Save Error:", err);
    res.status(500).send({ error: "Failed to save divyang data" });
  }
});

// ===============================
// 📤 SAVE EMPLOYMENT DETAILS
// ===============================
app.post("/saveEmployment", async (req, res) => {
  try {
    const { userId, data } = req.body;

    const params = {
      TableName: "users",
      Key: { userId },
      UpdateExpression: "SET employmentDetails = :e",
      ExpressionAttributeValues: {
        ":e": data,
      },
    };

    await dynamo.update(params).promise();

    res.send({ success: true });
  } catch (err) {
    console.error("Employment Save Error:", err);
    res.status(500).send({ error: "Failed to save employment data" });
  }
});

// ===============================
// 🟢 START SERVER
// ===============================
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});