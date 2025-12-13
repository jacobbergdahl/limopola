import { NextApiResponse } from "next";
import {
  MODEL,
  REASONING_EFFORT_GEMINI_3_PRO,
  SHOULD_SHOW_ALL_LOGS,
  STATUS_CODE,
} from "../../../general/constants";
import {
  extractErrorMessage,
  parseTextResponse,
} from "../../../general/helpers";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { ProcessedBody } from "../../../general/apiHelper";

const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const geminiText = async (
  res: NextApiResponse | undefined,
  message: string,
  model: MODEL,
  processedBody: ProcessedBody
) => {
  console.log(`The backend is calling the Gemini model ${model}.`);

  try {
    const { temperature, maxNumberOfTokens, topP, reasoningEffortGemini3Pro } =
      processedBody;

    const thinkingLevel =
      (reasoningEffortGemini3Pro?.toUpperCase() as ThinkingLevel) ||
      (REASONING_EFFORT_GEMINI_3_PRO.High.toUpperCase() as ThinkingLevel);

    const response = await client.models.generateContent({
      model: model,
      contents: message,
      config: {
        thinkingConfig: {
          thinkingLevel: thinkingLevel,
        },
        temperature,
        topP,
        maxOutputTokens: maxNumberOfTokens,
      },
    });

    SHOULD_SHOW_ALL_LOGS &&
      (console.log("Response from Gemini:", response),
      console.log("End of response from Gemini"));

    const text = response.text || "";

    if (!text) {
      throw new Error("No text content found in Gemini response");
    }

    SHOULD_SHOW_ALL_LOGS &&
      (console.log("\nOutput from Gemini before parsing:\n", text),
      console.log());

    const output = parseTextResponse(text);

    if (!res) {
      return output;
    }

    res.status(STATUS_CODE.Ok).json({ result: output });
  } catch (error: any) {
    const errorMessage = extractErrorMessage(error);
    console.error(error);
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: { message: errorMessage } });
  }
};
