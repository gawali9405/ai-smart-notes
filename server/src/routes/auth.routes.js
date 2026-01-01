import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.get("/me", protect, me);

export default router;
