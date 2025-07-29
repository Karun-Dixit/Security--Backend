# OTP-Based Login Implementation

## Overview

The login system has been enhanced to include OTP verification for additional security. The login process now consists of two steps:

1. **Step 1**: Verify email and password credentials
2. **Step 2**: Verify OTP sent to email

## API Endpoints

### 1. Login (Step 1) - Verify Credentials and Send OTP

**POST** `/api/user/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Credentials verified. OTP sent to your email for secure login.",
  "requiresOtp": true
}
```

**Response (Error):**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 2. Verify Login OTP (Step 2) - Complete Login

**POST** `/api/user/verify-login-otp`

**Request Body:**

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Login successful!",
  "token": "jwt_token_here"
}
```

**Response (Error):**

```json
{
  "success": false,
  "message": "Invalid OTP"
}
```

## How It Works

1. **User enters email and password** → Frontend calls `/api/user/login`
2. **Server verifies credentials** → If correct, generates and sends OTP to email
3. **User enters OTP** → Frontend calls `/api/user/verify-login-otp`
4. **Server verifies OTP** → If correct, returns JWT token for authentication

## Features

- **Security**: Two-factor authentication with email OTP
- **Rate Limiting**: Login attempts are rate-limited to prevent brute force attacks
- **Account Lockout**: After 3 failed password attempts, account is locked for 10 seconds
- **OTP Expiry**: OTP expires after 10 minutes
- **Auto Cleanup**: Temporary login records are automatically deleted after 10 minutes

## Frontend Implementation Example

```javascript
// Step 1: Login with credentials
const loginStep1 = async (email, password) => {
  try {
    const response = await axios.post("/api/user/login", { email, password });
    if (response.data.success && response.data.requiresOtp) {
      // Show OTP input form
      return { requiresOtp: true };
    }
  } catch (error) {
    console.error("Login error:", error);
  }
};

// Step 2: Verify OTP
const loginStep2 = async (email, otp) => {
  try {
    const response = await axios.post("/api/user/verify-login-otp", {
      email,
      otp,
    });
    if (response.data.success) {
      // Store token and redirect to dashboard
      localStorage.setItem("token", response.data.token);
      return { success: true, token: response.data.token };
    }
  } catch (error) {
    console.error("OTP verification error:", error);
  }
};
```

## Database Models

### TempLogin Model

A new model `tempLoginModel.js` has been created to temporarily store OTP data for login attempts:

```javascript
{
  email: String,
  userId: ObjectId,
  otp: String,
  otpExpires: Date,
  createdAt: Date (auto-expires after 10 minutes)
}
```

## Security Considerations

- OTPs are 6-digit random numbers
- OTPs expire after 10 minutes
- Each email can only have one active login OTP at a time
- Rate limiting prevents spam requests
- Account lockout prevents brute force attacks
- Credentials are verified before sending OTP (prevents OTP spam)
