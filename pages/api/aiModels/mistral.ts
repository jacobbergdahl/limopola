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
import { Mistral } from "@mistralai/mistralai";
import { ProcessedBody } from "../../../general/apiHelper";
import { ContentChunk } from "@mistralai/mistralai/models/components";

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export const mistral = async (
  res: NextApiResponse | undefined,
  message: string,
  model: MODEL,
  processedBody: ProcessedBody
) => {
  console.log(`The backend is calling the Mistral model ${model}.`);

  const {
    temperature,
    frequencyPenalty,
    presencePenalty,
    topP,
    maxNumberOfTokens,
  } = processedBody;

  try {
    const completion = await client.chat.complete({
      model,
      temperature,
      frequencyPenalty,
      presencePenalty,
      topP,
      maxTokens: maxNumberOfTokens,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    SHOULD_SHOW_ALL_LOGS &&
      (console.log("Response from Mistral:", completion),
      console.log("End of response from Mistral"));

    const text: string | ContentChunk[] = completion.choices[0].message.content;

    SHOULD_SHOW_ALL_LOGS &&
      (console.log("\nOutput from Mistral before parsing:\n", text),
      console.log());

    const textContent = typeof text === "string" ? text : JSON.stringify(text);
    const output = parseTextResponse(textContent);

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
