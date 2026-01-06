import { Router } from "express";
import multer from "multer";
import {
  generateNotes,
  getMyNotes,
  saveNote,
  updateSharing,
} from "../controllers/notes.controller.js";
import { protect } from "../middlewares/auth.js";

const router = Router();
const upload = multer();

// Protect all routes with authentication
router.use(protect);

// Handle both JSON and form-data
router.post("/generate", upload.any(), generateNotes);
router.get("/", getMyNotes);
router.post("/", saveNote);
router.patch("/:id/sharing", updateSharing);

export default router;

