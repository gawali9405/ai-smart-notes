import { Router } from "express";
import { register, login, logout, profile } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);
router.get("/profile", protect, profile);

export default router;
