import * as dotenv from "dotenv";

import app from "./app";

if (!process.env.NODE_ENV) dotenv.config();

app.listen(process.env.PORT, (): void => {
  console.log(`Server started on ${process.env.PORT}`);
});
