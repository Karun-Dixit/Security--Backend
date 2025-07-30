import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
  name: { 
    type: String,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\s]+$/.test(v) && v.length <= 100;
      },
      message: 'Name must contain only letters and spaces'
    }
  },
  email: { 
    type: String, 
    unique: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  password: String,
  otp: String,
  otpExpires: Date,
});

export default mongoose.model("tempUser", tempUserSchema);