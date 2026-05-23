import "dotenv/config";

const requiredVariables = [
  "MONGODB_URI",
  "JWT_SECRET",
  "GEMINI_API_KEY",
];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

export const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "*",

  // ✅ NEW (Gemini)
  geminiApiKey: process.env.GEMINI_API_KEY,
};