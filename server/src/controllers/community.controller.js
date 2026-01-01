import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";
import Note from "../models/Note.js";

export const getCommunityNotes = asyncHandler(async (_req, res) => {
  const notes = await Note.find({ isShared: true })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  successResponse(res, { data: { notes } });
});

export const likeNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note || !note.isShared) throw new ApiError(404, "Note not found or not shared");

  const alreadyLiked = note.likes.some((id) => id.equals(req.user._id));
  if (alreadyLiked) {
    note.likes = note.likes.filter((id) => !id.equals(req.user._id));
  } else {
    note.likes.push(req.user._id);
  }

  await note.save();
  successResponse(res, { message: "Like status updated", data: { likes: note.likes.length } });
});

export const commentOnNote = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) throw new ApiError(400, "Comment text required");

  const note = await Note.findById(req.params.id);
  if (!note || !note.isShared) throw new ApiError(404, "Note not found or not shared");

  note.comments.push({ user: req.user._id, text });
  await note.save();

  successResponse(res, {
    message: "Comment added",
    data: { comments: note.comments },
  });
});
