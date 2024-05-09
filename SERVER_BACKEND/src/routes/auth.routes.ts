import express from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/auth.controller";

export const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/register", registerUser);
authRouter.post("/logout", logoutUser);
authRouter.post("/refresh", refreshAccessToken);

