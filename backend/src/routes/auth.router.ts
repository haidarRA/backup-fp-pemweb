import { Router } from "express";

export const authRouter = Router();

import { Register, Login, getUsername} from "../controllers/auth.controller";

authRouter.post("/register", Register);
authRouter.post("/login", Login);
authRouter.post("/getUsername", getUsername);