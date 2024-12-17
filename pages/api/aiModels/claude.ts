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
import { Anthropic } from "@anthropic-ai/sdk";
import { ProcessedBody } from "../../../general/apiHelper";

const anthropic = new Anthropic();

export const claude = async (
  res: NextApiResponse | undefined,
  message: string,
  model: MODEL,
  processedBody: ProcessedBody
) => {
  console.log(`The backend is calling Anthropic model ${model}.`);

  const { temperature, topP, maxNumberOfTokens } = processedBody;

  try {
    const completion = await anthropic.messages.create({
      model: model,
      temperature: temperature,
      top_p: topP,
      // Max tokens are required in this API
      max_tokens: maxNumberOfTokens || 1024,
      messages: [{ role: "user", content: message }],
    });

    SHOULD_SHOW_ALL_LOGS &&
      (console.log("Response from Anthropic:", completion),
      console.log("End of response from Anthropic"));

    const content = completion.content[0];
    const text = content["text"];
    const output = parseTextResponse(text);

    SHOULD_SHOW_ALL_LOGS &&
      (console.log("\nOutput from Anthropic before parsing:\n", text),
      console.log());

    if (!res) {
      return output;
    }

    res.status(STATUS_CODE.Ok).json({ result: output });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    console.error(error);
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: { message: errorMessage } });
  }
};
