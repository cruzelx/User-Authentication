import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import passwordRouter from "./routers/password.router";

dotenv.config();

const app: Application = express();

app.use(express.json());

app.use("/", passwordRouter);

export default app;
