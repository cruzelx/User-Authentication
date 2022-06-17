import express, { Router } from "express";
import { resetPassword } from "../controllers/reset-password.controller";
import { verifyResetPasswordUrl } from "../controllers/verify-reset-password-url.controller";

const passwordRouter: Router = express.Router();

passwordRouter.get("/reset-password/:id/:token", verifyResetPasswordUrl);
passwordRouter.post("/reset-password/:id/:token", resetPassword);

export default passwordRouter;
