import cors from "cors";
import { env } from "./env.js";

const whitelist = [
  env.CLIENT_URL,

  ...(env.NODE_ENV !== "production"
    ? [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ]
    : []),

  "https://www.madangold.com",
  "https://madangold.com",
];

const corsOptions = {

  origin(origin, callback) {

    if (!origin) {
      return callback(null, true);
    }

    if (whitelist.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error("CORS Not Allowed")
    );
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  exposedHeaders: [
    "Content-Length",
  ],
};

export default cors(corsOptions);
