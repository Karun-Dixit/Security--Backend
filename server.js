import cookieParser from "cookie-parser";
import cors from "cors";
import csrf from "csurf";
import "dotenv/config";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import https from "https";
import "./config/cloudinary.js"; // Just import it for side effects (configuration)
import connectDB from "./config/mongodb.js";
import { csrfProtection, handleCsrfError, provideCsrfToken } from "./middleware/csrfProtection.js";
import adminRouter from "./routes/adminRoute.js";
import csrfRouter from "./routes/csrfRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import stripeRouter from "./routes/stripeRoute.js"; // ✅ new import
import userRouter from "./routes/userRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

// connect database and cloud
connectDB();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// CORS configuration to allow HTTPS requests
const corsOptions = {
  origin: [
    "https://localhost:5173", //user fontend
    "https://localhost:5174", //admin fontend
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token", "atoken", "X-CSRF-Token"],
};

app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options("*", cors(corsOptions));

// CSRF token endpoint - this should be accessible without CSRF protection
app.get("/api/csrf-token", (req, res) => {
  try {
    // Create a temporary CSRF instance for token generation
    const tempCsrf = csrf({
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000
      }
    });
    
    tempCsrf(req, res, () => {
      res.json({
        success: true,
        csrfToken: req.csrfToken()
      });
    });
  } catch (error) {
    console.error("CSRF token generation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate CSRF token"
    });
  }
});

// CSRF Protection (apply after cookie parser and CORS)
app.use(csrfProtection);
app.use(provideCsrfToken);

// api endpoints
app.use("/api/csrf", csrfRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/stripe", stripeRouter); // ✅ added stripe route

// CSRF error handling middleware (should be after routes)
app.use(handleCsrfError);

// test route
app.get("/", (req, res) => {
  res.send("API Working");
});

// start server
try {
  const key = fs.readFileSync("./.cert/key.pem");
  const cert = fs.readFileSync("./.cert/cert.pem");
  https.createServer({ key, cert }, app).listen(port, () => {
    console.log(`HTTPS Server started on PORT:${port}`);
  });
} catch (err) {
  console.warn(
    "Could not start HTTPS server, falling back to HTTP:",
    err.message
  );
  app.listen(port, () => console.log(`HTTP Server started on PORT:${port}`));
}
