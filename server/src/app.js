

import express from "express";

import path from "path";

import { fileURLToPath } from "url";

import helmet from "helmet";

import compression from "compression";

import cors from "./config/cors.js";

import routes from "./routes/index.js";

import requestContext from "./middleware/requestContext.middleware.js";

import loggerMiddleware from "./middleware/logger.middleware.js";

import notFound from "./middleware/notFound.js";

import errorHandler from "./middleware/errorHandler.js";

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const app = express();

/*
===========================================
Security
===========================================
*/

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(compression());

/*
===========================================
Core Middleware
===========================================
*/

app.use(cors);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/*
===========================================
Request Context
===========================================
*/

app.use(requestContext);

app.use(loggerMiddleware);

/*
===========================================
Uploads
===========================================
*/

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

/*
===========================================
Routes
===========================================
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,

    message:
      "Madan Gold Backend Running",

    version: "1.0.0",
  });
});

app.use("/api/v1", routes);

/*
===========================================
404
===========================================
*/

app.use(notFound);

/*
===========================================
Global Error
===========================================
*/

app.use(errorHandler);

export default app;