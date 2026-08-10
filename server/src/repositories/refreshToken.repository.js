import RefreshToken from "../models/refreshToken.model.js";
import BaseRepository from "./base.repository.js";

class RefreshTokenRepository extends BaseRepository {
  constructor() {
    super(RefreshToken);
  }

  async findValidToken(tokenHash) {
    return this.model.findOne({
      tokenHash,
      revokedAt: null,
      expiresAt: {
        $gt: new Date(),
      },
    });
  }

  async revokeByHash(tokenHash, replacedByHash = null) {
    return this.model.findOneAndUpdate(
      {
        tokenHash,
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
          replacedByHash,
        },
      },
      {
        new: true,
      }
    );
  }

  async revokeAllForUser(userId, userType) {
    return this.model.updateMany(
      {
        userId,
        userType,
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      }
    );
  }

  async consumeValidToken(
  tokenHash,
  replacedByHash
) {
  return this.model.findOneAndUpdate(
    {
      tokenHash,
      revokedAt: null,
      expiresAt: {
        $gt: new Date(),
      },
    },
    {
      $set: {
        revokedAt: new Date(),
        replacedByHash,
      },
    },
    {
      new: true,
    }
  );
}}

export default new RefreshTokenRepository();