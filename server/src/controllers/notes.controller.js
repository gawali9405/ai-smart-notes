
import fs from "fs-extra";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ApiError from "../utils/ApiError.js";
import { downloadYoutubeAudio } from "../services/youtube.service.js";
import { transcribeWithWhisper } from "../utils/whisper.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateNotes = async (req, res, next) => {
  try {
    console.log("➡️ generateNotes called");
    console.log("BODY:", req.body);

    const youtubeUrl = req.body.youtubeUrl;
    const summaryType = req.body.summaryType || "detailed";

    if (!youtubeUrl) {
      throw new ApiError(400, "YouTube URL required");
    }

    const wavPath = await downloadYoutubeAudio(youtubeUrl);
    const transcript = await transcribeWithWhisper(wavPath);

    const model = genAI.getGenerativeModel({
      model: "models/gemini-flash-lite-latest",
    });

    const prompt = `
Create ${summaryType} lecture notes.
Return structured bullet points.

Transcript:
${transcript}
`;

    const result = await model.generateContent(prompt);
    const notes = result.response.text();

    await fs.remove(wavPath);

    res.status(201).json({
      success: true,
      notes,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyNotes = async (_req, res) => {
  res.json({
    success: true,
    notes: [],
  });
};

export const updateSharing = async (req, res) => {
  res.json({
    success: true,
    noteId: req.params.id,
  });
};
