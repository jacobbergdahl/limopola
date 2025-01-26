import { NextApiResponse } from "next";
import {
  MODEL,
  SHOULD_SHOW_ALL_LOGS,
  STATUS_CODE,
} from "../../../general/constants";
import {
  extractErrorMessage,
  parseTextResponse,
} from "../../../general/helpers";
import OpenAI from "openai";
import { ProcessedBody } from "../../../general/apiHelper";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Accepts all versions of GPT-3.5 and GPT-4
 */
export const gpt = async (
  res: NextApiResponse | undefined,
  message: string,
  model: MODEL,
  processedBody: ProcessedBody
) => {
  console.log(`The backend is calling OpenAI model ${model}.`);

  const {
    temperature,
    frequencyPenalty,
    presencePenalty,
    topP,
    maxNumberOfTokens,
  } = processedBody;

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      temperature: temperature,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      top_p: topP,
      max_tokens: maxNumberOfTokens,
      messages: [
        {
          role: "user",
          // This is the only place in the codebase where explicitly tell the AI not to use markdown.
          // GPT-4o loves to return markdown, and it is very inconsistent and really messes with the UI.
          // We have a function for parsing markdown to HTML, but it still makes a mess of the UI.
          // Since the message could be very long, this instruction is not bullet-proof.
          // It could be added at the end, but adding it at the end could affect the user's prompt.
          // If the user explicitly mentions markdown, then we don't add the instruction.
          content:
            message.toLowerCase().indexOf("markdown") > -1 ||
            message.toLowerCase().indexOf("md") > -1
              ? message
              : "Do not use markdown in your response.\n\n" + message,
        },
      ],
    });

    SHOULD_SHOW_ALL_LOGS &&
      (console.log("Response from OpenAI:", completion),
      console.log("End of response from OpenAI"));

    const text = completion.choices[0].message.content;

    SHOULD_SHOW_ALL_LOGS &&
      (console.log("\nOutput from OpenAI before parsing:\n", text),
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
