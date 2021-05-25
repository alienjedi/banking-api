import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import "./config/db/mongoose";
import indexRouter from "./routes/index.router";

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/v1", indexRouter);

export default app;
