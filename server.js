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

const path = require("path");

// Serve frontend
app.use(express.static(path.join(__dirname, "Abhilasha")));

// Default route (optional but recommended)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Abhilasha/home/home.html"));
});

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
// 🟢 APPLY SCHEME (MAIN FIX)
// ===============================
app.post("/applyScheme", async (req, res) => {
  try {
    const { userId, scheme } = req.body;

    // ===============================
    // 📥 GET USER
    // ===============================
    const userRes = await dynamo
      .get({
        TableName: "users",
        Key: { userId },
      })
      .promise();

    if (!userRes.Item) {
      return res.send({ success: false, message: "User not found" });
    }

    const user = userRes.Item;
    let appliedSchemes = user.appliedSchemes || [];

    // ❌ already applied check
    if (appliedSchemes.some((s) => s.id === scheme.id)) {
      return res.send({ success: false, message: "Already applied" });
    }

    // ===============================
    // ✅ ADD TO USER
    // ===============================
    const newScheme = {
      id: scheme.id,
      appliedDate: new Date().toISOString(),
      status: [
        {
          remark: "Application Submitted",
          sentBy: "System",
          date: new Date().toISOString(),
        },
      ],
    };

    appliedSchemes.push(newScheme);

    await dynamo
      .update({
        TableName: "users",
        Key: { userId },
        UpdateExpression: "SET appliedSchemes = :a",
        ExpressionAttributeValues: {
          ":a": appliedSchemes,
        },
      })
      .promise();

    // ===============================
    // 🔥 ADD TO ADMIN WAITING
    // ===============================
    const ADMIN_ID = "603c697c-50f1-700a-4899-78c040e32d6c";

    const adminRes = await dynamo
      .get({
        TableName: "users",
        Key: { userId: ADMIN_ID },
      })
      .promise();

    let admin = adminRes.Item || {};
    let waiting = admin.waiting || [];

    const name = user.personalDetails?.first_name || "User";
    const udid = user.divyangDetails?.udid || "N/A";

    waiting.push({
      userId,
      schemeId: scheme.id,
      name,
      udid,
      scheme: `Scheme ${scheme.id}`,
      date: new Date().toISOString(),
    });

    await dynamo
      .update({
        TableName: "users",
        Key: { userId: ADMIN_ID },
        UpdateExpression: "SET waiting = :w",
        ExpressionAttributeValues: {
          ":w": waiting,
        },
      })
      .promise();

    // ===============================
    // ✅ DONE
    // ===============================
    res.send({ success: true });
  } catch (err) {
    console.error("Apply Error:", err);
    res.status(500).send({ success: false });
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
// 🔥 UPDATE SCHEME STATUS (FULL)
// ===============================
app.post("/updateSchemeStatus", async (req, res) => {
  try {
    const { userId, schemeId, status } = req.body;

    const ADMIN_ID = "603c697c-50f1-700a-4899-78c040e32d6c";

    // ===============================
    // 📥 GET USER
    // ===============================
    const userRes = await dynamo
      .get({
        TableName: "users",
        Key: { userId },
      })
      .promise();

    if (!userRes.Item) {
      return res.send({ success: false, message: "User not found" });
    }

    let user = userRes.Item;
    let schemes = user.appliedSchemes || [];

    const index = schemes.findIndex((s) => s.id == schemeId);

    if (index === -1) {
      return res.send({ success: false, message: "Scheme not found" });
    }

    const date = new Date().toISOString();

    // ===============================
    // ✅ UPDATE USER SIDE
    // ===============================
    schemes[index].state = status;

    schemes[index].status = schemes[index].status || [];
    schemes[index].status.push({
      remark: status.toUpperCase(),
      date,
      sentBy: "Admin",
    });

    await dynamo
      .update({
        TableName: "users",
        Key: { userId },
        UpdateExpression: "SET appliedSchemes = :a",
        ExpressionAttributeValues: {
          ":a": schemes,
        },
      })
      .promise();

    // ===============================
    // 📥 GET ADMIN
    // ===============================
    const adminRes = await dynamo
      .get({
        TableName: "users",
        Key: { userId: ADMIN_ID },
      })
      .promise();

    let admin = adminRes.Item || {};

    let waiting = admin.waiting || [];
    let approved = admin.approved || [];
    let rejected = admin.rejected || [];

    // ===============================
    // 🔍 FIND ENTRY IN WAITING
    // ===============================
    // ===============================
    // 🔄 MOVE ENTRY BETWEEN ARRAYS
    // ===============================
    const idx = waiting.findIndex(
      (u) =>
        String(u.userId) === String(userId) &&
        Number(u.schemeId) === Number(schemeId),
    );

    if (idx !== -1) {
      const entry = waiting[idx];

      // remove from waiting
      waiting.splice(idx, 1);

      // add to correct list
      if (status === "approved") {
        approved.push({
          ...entry,
          status: "approved",
          actionDate: new Date().toISOString(),
        });
      } else if (status === "rejected") {
        rejected.push({
          ...entry,
          status: "rejected",
          actionDate: new Date().toISOString(),
        });
      }
    } else {
      console.log("Entry not found in waiting:", userId, schemeId);
    }

    // ===============================
    // 💾 UPDATE ADMIN
    // ===============================
    await dynamo
      .update({
        TableName: "users",
        Key: { userId: ADMIN_ID },
        UpdateExpression: "SET waiting = :w, approved = :a, rejected = :r",
        ExpressionAttributeValues: {
          ":w": waiting,
          ":a": approved,
          ":r": rejected,
        },
      })
      .promise();

    res.send({ success: true });
  } catch (err) {
    console.error("FULL UPDATE ERROR:", err);
    res.status(500).send({ success: false });
  }
});

// ===============================
// 💬 ADD REMARK
// ===============================
app.post("/addRemark", async (req, res) => {
  try {
    const { userId, schemeId, remark } = req.body;

    const result = await dynamo
      .get({
        TableName: "users",
        Key: { userId },
      })
      .promise();

    if (!result.Item) {
      return res.send({ success: false });
    }

    let schemes = result.Item.appliedSchemes || [];

    const index = schemes.findIndex((s) => s.id == schemeId);

    if (index === -1) {
      return res.send({ success: false });
    }

    const date = new Date().toISOString();

    schemes[index].status = schemes[index].status || [];
    schemes[index].status.push({
      remark,
      date,
      sentBy: "Admin",
    });

    await dynamo
      .update({
        TableName: "users",
        Key: { userId },
        UpdateExpression: "SET appliedSchemes = :a",
        ExpressionAttributeValues: {
          ":a": schemes,
        },
      })
      .promise();

    res.send({ success: true });
  } catch (err) {
    console.error("Remark Error:", err);
    res.status(500).send({ success: false });
  }
});

// ===============================
// 🟢 START SERVER
// ===============================
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
