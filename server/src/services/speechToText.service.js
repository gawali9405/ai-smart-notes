import fs from "fs";
import speech from "@google-cloud/speech";
import { env } from "../config/env.js";
import { removeFileSafe } from "../utils/file.js";

const speechClientOptions = {};

if (env.google.projectId) {
  speechClientOptions.projectId = env.google.projectId;
}

if (env.google.credentialsJson) {
  try {
    speechClientOptions.credentials = JSON.parse(env.google.credentialsJson);
  } catch (error) {
    console.warn("[speech] Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON");
  }
} else if (env.google.credentialsPath) {
  speechClientOptions.keyFilename = env.google.credentialsPath;
}

const client = new speech.SpeechClient(speechClientOptions);

export const transcribeMedia = async ({
  filePath,
  language = "en-US",
}) => {
  if (!filePath) throw new Error("Missing file path for transcription");

  try {
    const file = fs.readFileSync(filePath);
    const audioBytes = file.toString("base64");

    const request = {
      audio: { content: audioBytes },
      config: {
        encoding: "LINEAR16", // change if needed
        languageCode: language,
        enableAutomaticPunctuation: true,
      },
    };

    const [response] = await client.recognize(request);

    const transcription = response.results
      .map((r) => r.alternatives[0].transcript)
      .join(" ");

    return transcription;
  } finally {
    await removeFileSafe(filePath);
  }
};
