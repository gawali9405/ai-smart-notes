import fs from "fs-extra";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ApiError from "../utils/ApiError.js";
import { downloadYoutubeAudio } from "../services/youtube.service.js";
import { transcribeWithWhisper } from "../utils/whisper.js";
import Note from "../models/Note.js";



const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
/**
 * Extracts JSON from markdown text that contains a code block
 * @param {string} markdown - Markdown text containing a JSON code block
 * @returns {Object} Parsed JSON object
 */
const extractJsonFromMarkdown = (markdown) => {
  try {
    // Try to find JSON in markdown code blocks first
    const jsonMatch = markdown.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : markdown;
    
    // Try to parse the JSON
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON from markdown:', error);
    // If parsing fails, try to find and extract just the JSON part
    try {
      const jsonMatch = markdown.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Fallback JSON parsing failed:', e);
    }
    return null;
  }
};

export const generateNotes = async (req, res, next) => {
  try {
    const { youtubeUrl, summaryType = "detailed" } = req.body;

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
Return JSON in this format only:

{
  "notes": "",
  "keyPoints": [],
  "highlights": []
}

Transcript:
${transcript}
`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    console.log('Raw AI Response:', rawText); // Debug log

    await fs.remove(wavPath);

    const parsed = extractJsonFromMarkdown(rawText);
    console.log('Parsed JSON:', JSON.stringify(parsed, null, 2)); // Debug log

    if (!parsed) {
      console.error('Failed to parse JSON from response');
      return res.status(200).json({
        success: true,
        content: rawText,
        keyPoints: [],
        highlights: []
      });
    }

    res.status(201).json({
      success: true,
      content: parsed.notes || rawText,
      keyPoints: parsed.keyPoints || [],
      highlights: parsed.highlights || [],
    });
  } catch (err) {
    next(err);
  }
};

export const saveNote = async (req, res, next) => {
  try {
    const {
      title,
      content,
      keyPoints = [],
      highlights = [],
      sourceType,
      summaryType,
      language,
      user: userId
    } = req.body;

    if (!title || !content) {
      throw new ApiError(400, "Title and content are required");
    }

    // Use the authenticated user's ID from the request
    const user = req.user?._id || userId;
    
    if (!user) {
      throw new ApiError(401, "User authentication required");
    }

    const note = await Note.create({
      title,
      content,
      keyPoints,
      highlights,
      sourceType,
      summaryType,
      language,
      user, // Add the user ID to the note
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

export const deleteNotes = async (req, res, next) => {
  try {
    const { id } = req.params;

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      throw new ApiError(404, "Note not found");
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
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
