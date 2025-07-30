import mongoose from "mongoose";

const tempLoginSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  otp: { type: String, required: true },
  otpExpires: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // Auto delete after 10 minutes
});

export default mongoose.model("tempLogin", tempLoginSchema);
