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
              // This is not fully implemented yet. We should send all
              // messages in memory individually here.
              // optional, preamble context to prime responses
              /* context: "Respond to all questions with a rhyming poem.", */
              // Optional. Examples for further fine-tuning of responses.
              /* examples: [
              {
                input: { content: "What is the capital of California?" },
                output: {
                  content: `If the capital of California is what you seek,
  Sacramento is where you ought to peek.`,
                },
              },
            ], */
              // Required. Alternating prompt/response messages.
              messages: [{ content: message }],
            },
          });

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
      .json({ error: { message: error?.details || error } });
    return;
  }
};
