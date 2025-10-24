import { NextApiResponse } from "next";
import {
  MODEL,
  REASONING_EFFORT,
  SHOULD_SHOW_ALL_LOGS,
  STATUS_CODE,
} from "../../../general/constants";
import {
  extractErrorMessage,
  openAiApiBaseConfig,
  parseTextResponse,
} from "../../../general/helpers";
import OpenAI from "openai";
import { ProcessedBody } from "../../../general/apiHelper";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openAiReasoning = async (
  res: NextApiResponse | undefined,
  message: string,
  model: MODEL,
  processedBody: ProcessedBody
) => {
  console.log(`The backend is calling the OpenAI model ${model}.`);

  try {
    const completion = await client.responses.create({
      model: model,
      reasoning: {
        effort: processedBody.reasoningEffort,
      },
      text: {
        verbosity: processedBody.reasoningVerbosity,
      },
      ...(processedBody.maxNumberOfTokens && {
        max_tokens: processedBody.maxNumberOfTokens,
      }),
      input: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    SHOULD_SHOW_ALL_LOGS &&
      (console.log("Response from OpenAI:", completion),
      console.log("End of response from OpenAI"));

    const text = completion.output_text;

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
