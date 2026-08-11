import mongoose from "mongoose";
import bcrypt from "bcrypt";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    avatar: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },

    dob: {
      type: Date,
      default: null,
    },

    addresses: [
      {
        fullName: String,
        phone: String,
        pincode: String,
        house: String,
        area: String,
        landmark: String,
        city: String,
        state: String,
        country: {
          type: String,
          default: "India",
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],

    isVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationOtp: {
      type: String,
      select: false,
      default: null,
    },

    emailVerificationOtpExpiresAt: {
      type: Date,
      select: false,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: { 
      type: Boolean,
     default: false,
     }, 
   
     deletedAt: {
       type: Date, 
      default: null,
     },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash Password
customerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare Password
customerSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;