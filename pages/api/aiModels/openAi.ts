import { NextApiResponse } from "next";
import {
  MODEL,
  SHOULD_SHOW_ALL_LOGS,
  STATUS_CODE,
} from "../../../general/constants";
import {
  addMarkdownInstructionTo4oModels,
  extractErrorMessage,
  openAiApiBaseConfig,
  parseTextResponse,
} from "../../../general/helpers";
import OpenAI from "openai";
import { ProcessedBody } from "../../../general/apiHelper";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openAi = async (
  res: NextApiResponse | undefined,
  message: string,
  model: MODEL,
  processedBody: ProcessedBody
) => {
  console.log(`The backend is calling the OpenAI model ${model}.`);

  try {
    const completion = await client.chat.completions.create({
      model: model,
      ...openAiApiBaseConfig(processedBody),
      messages: [
        {
          role: "user",
          content: addMarkdownInstructionTo4oModels(model, message),
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
