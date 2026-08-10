import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    userType: {
      type: String,
      enum: ["Customer", "Admin"],
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    replacedByHash: {
      type: String,
      default: null,
    },

    device: {
      type: String,
      default: "Unknown",
      maxlength: 500,
    },

    ipAddress: {
      type: String,
      default: null,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * MongoDB automatically deletes expired refresh tokens.
 */
refreshTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

refreshTokenSchema.index({
  userId: 1,
  userType: 1,
  revokedAt: 1,
});

const RefreshToken = mongoose.model(
  "RefreshToken",
  refreshTokenSchema
);

export default RefreshToken;