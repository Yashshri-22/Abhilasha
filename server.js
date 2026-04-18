import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

// ✅ CREATE APP FIRST
const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());

// ✅ AWS CLIENT
const client = new CognitoIdentityProviderClient({
  region: "eu-north-1",
});

const CLIENT_ID = "1hrccmf1ra61043sc0rl8jslv5";

// ===============================
// 🚀 REGISTER API
// ===============================

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  console.log("🔥 BACKEND RECEIVED:", req.body);

  try {
    const command = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email }],
    });

    await client.send(command);

    return res.status(200).json({
      success: true,
      message: "Registration successful",
    });

  } catch (err) {
    console.error("Register error:", err.name);

    if (err.name === "UsernameExistsException") {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message || "Registration failed",
    });
  }
});

// ===============================
// 🔐 LOGIN API
// ===============================

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("🔥 LOGIN REQUEST:", req.body);

  try {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const response = await client.send(command);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: response.AuthenticationResult.AccessToken,
      idToken: response.AuthenticationResult.IdToken,
      refreshToken: response.AuthenticationResult.RefreshToken,
    });

  } catch (err) {
    console.error("Login error:", err.name);

    if (err.name === "NotAuthorizedException") {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    if (err.name === "UserNotFoundException") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message || "Login failed",
    });
  }
});

// ===============================
// ▶ START SERVER
// ===============================

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});