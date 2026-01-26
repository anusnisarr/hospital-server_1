import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true
    },
    fullName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active'
    },
    createdAt: { 
      type: Date, 
      default: Date.now
    }
  },
  { timestamps: true }
);

userSchema.index({ tenant: 1, email: 1 }, { unique: true });
const User =  mongoose.model("User", userSchema);

export default User;