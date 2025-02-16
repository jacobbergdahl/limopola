import { NextApiResponse } from "next";
import {
  MODEL,
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
  apiKey: process.env.OPENAI_COMPATIBLE_API_KEY,
  baseURL: process.env.OPENAI_COMPATIBLE_ENDPOINT,
});

export const openAiCompatibleApi = async (
  res: NextApiResponse | undefined,
  message: string,
  processedBody: ProcessedBody
) => {
  try {
    const model = process.env.OPENAI_COMPATIBLE_MODEL_NAME;
    const apiKey = process.env.OPENAI_COMPATIBLE_API_KEY;
    const endpoint = process.env.OPENAI_COMPATIBLE_ENDPOINT;

    if (!model || !apiKey || !endpoint) {
      throw new Error(
        "OPENAI_COMPATIBLE_MODEL_NAME, OPENAI_COMPATIBLE_API_KEY, and OPENAI_COMPATIBLE_ENDPOINT must be set in order to use OpenAI-compatible endpoints. Please configure your .env file (use .env.example as reference). Did you mean to use the OpenAI API? If so, select a model name such as gpt-4 or gpt-4o-mini instead of openai-compatible-api."
      );
    }

    console.log(
      `The backend is calling the OpenAI-compatible model ${model} through the endpoint ${endpoint}.`
    );

    const completion = await client.chat.completions.create({
      model: model,
      ...openAiApiBaseConfig(processedBody),
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    SHOULD_SHOW_ALL_LOGS &&
      (console.log(`Response from ${endpoint}`, completion),
      console.log(`End of response from ${endpoint}`));

    const text = completion.choices[0].message.content;

    SHOULD_SHOW_ALL_LOGS &&
      (console.log(`\nOutput from ${endpoint} before parsing:\n`, text),
      console.log(`End of output from ${endpoint}`));

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
