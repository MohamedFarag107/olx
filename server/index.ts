import dotenv from "dotenv";
import express from "express";

const PORT = process.env.PORT || 8080;

dotenv.config();

import { globalErrorMiddleware, globalNotFoundMiddleware } from "@/middlewares";

const app = express();

app.all("*", globalNotFoundMiddleware);
app.use(globalErrorMiddleware);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
