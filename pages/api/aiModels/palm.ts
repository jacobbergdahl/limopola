import { TextServiceClient } from "@google-ai/generativelanguage";
import { DiscussServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";
import {
  MODEL,
  SHOULD_SHOW_ALL_LOGS,
  STATUS_CODE,
} from "../../../general/constants";
import { parseTextResponse } from "../../../general/helpers";

const API_KEY = process.env.GOOGLE_API_KEY;

const textServiceClient = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

const chatServiceClient = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

export const palm = async (
  res,
  message,
  model: MODEL.PalmChatBison001 | MODEL.PalmTextBison001,
  temperature
) => {
  console.log(`The backend is calling Google PaLM model ${model}.`);

  try {
    const response =
      model === MODEL.PalmTextBison001
        ? await textServiceClient.generateText({
            model: "models/text-bison-001",
            temperature: temperature,
            prompt: {
              text: message,
            },
          })
        : await chatServiceClient.generateMessage({
            model: "models/chat-bison-001",
            temperature: temperature,
            candidateCount: 1,
            prompt: {
              // This API call is not fully implemented yet. We should send all
              // messages in memory individually, rather than as one.
              messages: [{ content: message }],
            },
          });

    if (!response?.[0]?.candidates?.[0]) {
      console.log(response);
      if (response?.[0]?.candidates?.length === 0) {
        throw new Error("The AI did not return a response for the question.");
      }
      throw new Error("An unexpected error occurred.");
    }

    if (
      model === MODEL.PalmTextBison001 &&
      "output" in response[0].candidates[0]
    ) {
      const output = response[0].candidates[0].output;
      SHOULD_SHOW_ALL_LOGS && console.log("Response from Google:", output);

      res.status(STATUS_CODE.Ok).json({ result: parseTextResponse(output) });
      return;
    } else if (
      model === MODEL.PalmChatBison001 &&
      "content" in response[0].candidates[0]
    ) {
      const output = response[0].candidates[0].content;
      SHOULD_SHOW_ALL_LOGS && console.log("Response from Google:", output);

      res.status(STATUS_CODE.Ok).json({ result: parseTextResponse(output) });
      return;
    }

    res.status(STATUS_CODE.InternalServerError).json({ result: response });
    return;
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: { message: error?.details || error?.message || error } });
    return;
  }
};
