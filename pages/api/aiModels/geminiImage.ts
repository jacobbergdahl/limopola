import { NextApiResponse } from "next";
import {
  MODEL,
  SHOULD_SHOW_ALL_LOGS,
  STATUS_CODE,
  IMAGE_ASPECT_RATIO_GEMINI_3_PRO,
  IMAGE_SIZE_GEMINI_3_PRO,
} from "../../../general/constants";
import { extractErrorMessage } from "../../../general/helpers";
import { GoogleGenAI } from "@google/genai";
import { ProcessedBody } from "../../../general/apiHelper";
import { saveMedia } from "../saveMedia";

const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const geminiImage = async (
  res: NextApiResponse,
  message: string,
  model: MODEL,
  processedBody: ProcessedBody
) => {
  const numberOfImages = processedBody.numberOfImages || 1;
  console.log(
    `The backend is calling the Gemini image model ${model} to generate ${numberOfImages} image(s).`
  );

  try {
    const { aspectRatio, isGivingAiSearchAccess } = processedBody;

    const response = await client.models.generateContent({
      model: model,
      contents: message,
      config: {
        candidateCount: numberOfImages,
        imageConfig: {
          aspectRatio: aspectRatio || IMAGE_ASPECT_RATIO_GEMINI_3_PRO.Landscape,
          imageSize: processedBody.imageSize || IMAGE_SIZE_GEMINI_3_PRO.One,
        },
        ...(isGivingAiSearchAccess && { tools: [{ googleSearch: {} }] }),
      },
    });

    SHOULD_SHOW_ALL_LOGS &&
      (console.log("Response from Gemini Image:", response),
      console.log("End of response from Gemini Image"));

    const imageParts: Buffer[] = [];

    if (response.candidates && response.candidates.length > 0) {
      for (const candidate of response.candidates) {
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData) {
              const imageData = part.inlineData.data;
              const buffer = Buffer.from(imageData, "base64");
              imageParts.push(buffer);
            }
          }
        }
      }
    }

    if (imageParts.length === 0) {
      throw new Error("No image data found in Gemini response");
    }

    const imageSavedAtFilePaths = await saveMedia(message, imageParts);

    if (SHOULD_SHOW_ALL_LOGS && imageSavedAtFilePaths.length > 0) {
      console.log("Gemini created the image(s) at the following path(s)\n");
      imageSavedAtFilePaths.forEach((imagePath) => console.log(imagePath));
      console.log("");
    }

    res.status(STATUS_CODE.Ok).json({
      result:
        imageSavedAtFilePaths.length > 1
          ? imageSavedAtFilePaths
          : imageSavedAtFilePaths[0],
    });
  } catch (error: any) {
    const errorMessage = extractErrorMessage(error);
    console.error(error);
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: { message: errorMessage } });
  }
};
