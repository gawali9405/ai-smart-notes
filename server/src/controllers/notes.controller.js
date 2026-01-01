import fetch from "node-fetch";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";
import { transcribeMedia } from "../services/speechToText.service.js";
import { generateSummary } from "../services/aiSummarizer.service.js";
import Note from "../models/Note.js";

const extractYouTubeId = (url = "") => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([\w-]{11})/
  );
  return match ? match[1] : null;
};

const fetchYoutubeTranscript = async (url) => {
  const videoId = extractYouTubeId(url);
  if (!videoId) throw new ApiError(400, "Invalid YouTube URL");

  const response = await fetch(`https://youtubetranscript.com/?server_vid2=${videoId}`);
  if (!response.ok) throw new ApiError(400, "Failed to fetch YouTube transcript");
  const transcript = await response.json();

  if (!Array.isArray(transcript) || transcript.length === 0) {
    throw new ApiError(404, "Transcript unavailable for this video");
  }

  return transcript.map((line) => line.text).join(" ");
};

export const generateNotes = asyncHandler(async (req, res) => {
  const { sourceType = "text", summaryType = "short", language = "English", text, youtubeUrl } =
    req.body;

  let rawText = text;

  if (["audio", "video"].includes(sourceType)) {
    if (!req.file) throw new ApiError(400, "Upload audio/video file");
    rawText = await transcribeMedia({ filePath: req.file.path, language });
  } else if (sourceType === "youtube") {
    rawText = await fetchYoutubeTranscript(youtubeUrl);
  }

  if (!rawText) throw new ApiError(400, "No content supplied for summarization");

  const summary = await generateSummary({
    text: rawText,
    summaryType,
    language,
  });

  const note = await Note.create({
    title: req.body.title || "Untitled Note",
    content: summary.notes,
    keyPoints: summary.keyPoints,
    highlights: summary.highlights,
    sourceType,
    summaryType,
    language,
    user: req.user._id,
    isShared: req.body.isShared ?? false,
  });

  successResponse(res, {
    status: 201,
    message: "Notes generated",
    data: { note },
  });
});

export const getMyNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
  successResponse(res, { data: { notes } });
});

export const updateSharing = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) throw new ApiError(404, "Note not found");

  note.isShared = !!req.body.isShared;
  await note.save();

  successResponse(res, { message: "Sharing status updated", data: { note } });
});
