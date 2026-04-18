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
// 📤 UPDATE SCHEMES
// ===============================
app.post("/updateSchemes", async (req, res) => {
  try {
    const { userId, appliedSchemes, cancelledSchemes } = req.body;

    const params = {
      TableName: "users",
      Key: { userId },
      UpdateExpression: "SET appliedSchemes = :a, cancelledSchemes = :c",
      ExpressionAttributeValues: {
        ":a": appliedSchemes,
        ":c": cancelledSchemes,
      },
    };

    await dynamo.update(params).promise();

    res.send({ success: true });
  } catch (err) {
    console.error("Scheme Update Error:", err);
    res.status(500).send({ error: "Failed to update schemes" });
  }
});

// ===============================
// 📤 APPLY SCHEME
// ===============================
app.post("/applyScheme", async (req, res) => {
  try {
    const { userId, scheme } = req.body;

    // Get existing user
    const getParams = {
      TableName: "users",
      Key: { userId },
    };

    const user = await dynamo.get(getParams).promise();
    const appliedSchemes = user.Item?.appliedSchemes || [];

    // Check duplicate
    if (appliedSchemes.some((s) => s.id === scheme.id)) {
      return res.send({ success: false, message: "Already applied" });
    }

    // Max 4 schemes
    if (appliedSchemes.length >= 4) {
      return res.send({ success: false, message: "Limit reached" });
    }

    const updatedSchemes = [
      ...appliedSchemes,
      {
        id: scheme.id,
        appliedDate: new Date().toISOString(),
        status: [
          {
            remark: "Application Submitted",
            sentBy: "System",
            date: new Date().toISOString(),
          },
        ],
      },
    ];

    const updateParams = {
      TableName: "users",
      Key: { userId },
      UpdateExpression: "SET appliedSchemes = :a",
      ExpressionAttributeValues: {
        ":a": updatedSchemes,
      },
    };

    await dynamo.update(updateParams).promise();

    res.send({ success: true });
  } catch (err) {
    console.error("Apply Error:", err);
    res.status(500).send({ error: "Failed to apply scheme" });
  }
});

// ===============================
// 🔐 ADMIN LOGIN (COGNITO)
// ===============================
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

app.post("/loginAdmin", (req, res) => {
  const { email, password } = req.body;

  const poolData = {
    UserPoolId: "eu-north-1_helCUhBlp",
    ClientId: "mhpn6e3ip48mpua0chl7a2or3",
  };

  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  const authDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: email,
    Password: password,
  });

  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authDetails, {
    onSuccess: (result) => {
      res.send({
        success: true,
        idToken: result.getIdToken().getJwtToken(),
      });
    },

    onFailure: (err) => {
      res.send({
        success: false,
        message: err.message,
      });
    },

    // 🔥 ADD THIS BLOCK (VERY IMPORTANT)
    newPasswordRequired: function (userAttributes, requiredAttributes) {
      // remove unnecessary attributes
      delete userAttributes.email_verified;

      cognitoUser.completeNewPasswordChallenge(
        password, // reuse same password
        {},
        {
          onSuccess: function (result) {
            res.send({
              success: true,
              idToken: result.getIdToken().getJwtToken(),
            });
          },

          onFailure: function (err) {
            res.send({
              success: false,
              message: err.message,
            });
          },
        },
      );
    },
  });
});

// ===============================
// 📥 GET ALL USERS
// ===============================
app.get("/getAllUsers", async (req, res) => {
  try {
    const params = {
      TableName: "users",
    };

    const data = await dynamo.scan(params).promise();

    res.send(data.Items || []);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

// ===============================
// 🟢 START SERVER
// ===============================
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
