import { Router } from "express";
import { register, login, logout, getMe } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

// Public routes
router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);

// Protected routes
router.use(protect);
router.get("/me", getMe);
router.post("/logout", logout);

export default router;
