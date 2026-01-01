import { Router } from "express";
import {
  generateNotes,
  getMyNotes,
  updateSharing,
} from "../controllers/notes.controller.js";
import { upload } from "../middlewares/upload.js";
import { protect } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/validate.js";
import { generateNotesSchema, updateShareSchema } from "../validators/notes.validator.js";

const router = Router();

router.use(protect);

router.post(
  "/generate",
  upload.single("file"),
  validateRequest(generateNotesSchema),
  generateNotes
);

router.get("/", getMyNotes);

router.patch("/:id/share", validateRequest(updateShareSchema), updateSharing);

export default router;
