import fs from "fs-extra";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ApiError from "../utils/ApiError.js";
import { downloadYoutubeAudio } from "../services/youtube.service.js";
import { transcribeWithWhisper } from "../utils/whisper.js";
import Note from "../models/Note.js";

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

export const saveNote = async (req, res, next) => {
  try {
    const { title, content, sourceType, summaryType, language } = req.body;

    if (!title || !content) {
      throw new ApiError(400, "Title and content are required");
    }

    if (!req.user || !req.user._id) {
      throw new ApiError(401, "Authentication required");
    }

    const note = await Note.create({
      title,
      content,
      sourceType,
      summaryType,
      language,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyNotes = async (_req, res, next) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSharing = async (req, res) => {
  res.json({
    success: true,
    noteId: req.params.id,
  });
};
