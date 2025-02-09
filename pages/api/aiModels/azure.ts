import { NextApiResponse } from "next";
import { SHOULD_SHOW_ALL_LOGS, STATUS_CODE } from "../../../general/constants";
import {
  extractErrorMessage,
  parseTextResponse,
} from "../../../general/helpers";
import { ProcessedBody } from "../../../general/apiHelper";
import { AzureOpenAI } from "openai";

// It would actually be possible to re-use the OpenAI API for this (i.e. gpt.ts) as the API implementation is very similar.
// However, given the quirks that separate the two, I did find it cleaner to keep them separate.
export const azure = async (
  res: NextApiResponse | undefined,
  message: string,
  processedBody: ProcessedBody
) => {
  const model = process.env.AZURE_MODEL_ID;
  const apiKey = process.env.AZURE_API_KEY;
  const endpoint = process.env.AZURE_ENDPOINT;
  if (!model || !apiKey || !endpoint) {
    throw new Error(
      "AZURE_MODEL_ID, AZURE_API_KEY, and AZURE_ENDPOINT must be set in order to use Azure. Please configure your .env file (use .env.example as reference)."
    );
  }

  console.log(
    `The backend is calling model ${model} through Azure endpoint ${endpoint}.`
  );

  const {
    temperature,
    frequencyPenalty,
    presencePenalty,
    topP,
    maxNumberOfTokens,
  } = processedBody;

  try {
    const client = new AzureOpenAI({
      apiKey: apiKey,
      // It's an interesting choice to make apiVersion required and then not provide a "-latest" option, which is otherwise a standard practice.
      // It does make sense with Azure's philosophy of stability. In a production-quality application, you would want stability and likely not just
      // use whatever is the latest. However, it's an odd emission to not allow for it as many businesses are still in the prototyping phase of LLM's.
      // You can find the latest information on api versions at these URL's:
      // https://learn.microsoft.com/en-us/azure/ai-services/openai/reference
      // https://learn.microsoft.com/en-us/azure/ai-services/openai/api-version-deprecation
      apiVersion: process.env.AZURE_API_VERSION || "2025-01-01-preview",
      endpoint: endpoint,
    });
    // Azure actually uses a different language for their API. For instance, they would call this variable "events" instead of "completion".
    // I opted for naming consistency in this codebase.
    const completion = await client.chat.completions.create({
      stream: false,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: maxNumberOfTokens,
      temperature: temperature,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      top_p: topP,
      model: model,
    });

    SHOULD_SHOW_ALL_LOGS &&
      (console.log("Response from Azure:", completion),
      console.log("End of response from Azure"));

    const text = completion.choices[0].message.content;

    SHOULD_SHOW_ALL_LOGS &&
      (console.log("\nOutput from Azure before parsing:\n", text),
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
