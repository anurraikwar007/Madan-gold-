import {
  StandardCheckoutClient,
  Env,
} from "@phonepe-pg/pg-sdk-node";

import { env } from "./env.js";

const phonePeEnv =
  env.PHONEPE_ENV === "PRODUCTION"
    ? Env.PRODUCTION
    : Env.SANDBOX;

let client = null;

export const getPhonePeClient = () => {
  if (!client) {
    if (
      !env.PHONEPE_CLIENT_ID ||
      !env.PHONEPE_CLIENT_SECRET
    ) {
      throw new Error(
        "PhonePe credentials are not configured."
      );
    }

    client =
      StandardCheckoutClient.getInstance(
        env.PHONEPE_CLIENT_ID,
        env.PHONEPE_CLIENT_SECRET,
        env.PHONEPE_CLIENT_VERSION,
        phonePeEnv
      );
  }

  return client;
};