import { Router } from "express";
import multer from "multer";
import {
  generateNotes,
  getMyNotes,
  updateSharing,
} from "../controllers/notes.controller.js";

const router = Router();
const upload = multer();

// Handle both JSON and form-data
router.post("/generate", upload.any(), generateNotes);
router.get("/", getMyNotes);
router.patch("/:id/sharing", updateSharing);

export default router;

