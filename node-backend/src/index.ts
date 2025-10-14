import express from "express";
import bodyParser from "body-parser";
import { CONFIG } from "./config";
import { routes } from "./server/routes";

const app = express();
app.use(bodyParser.json({ limit: "1mb" }));

// CORS & simple security headers (adjust in prod)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

app.use("/api", routes);

app.listen(CONFIG.PORT, () => {
  console.log(`SIEM-NLI listening on ${CONFIG.PORT}`);
});
