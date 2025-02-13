import { NextApiResponse } from "next";
import { STATUS_CODE, SHOULD_SHOW_ALL_LOGS } from "../../../general/constants";
import { extractErrorMessage, parseTextResponse } from "../../../general/helpers";
import OpenAI from "openai";
import { ProcessedBody } from "../../../general/apiHelper";

const customOpenai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_ENDPOINT,
});


export const localOpenai = async (
  res: NextApiResponse | undefined,
  message: string,
  processedBody: ProcessedBody
) => {
  console.log(
    `The backend is calling the local OpenAI-compatible model ${process.env.OPENAI_MODEL_NAME} at ${process.env.OPENAI_ENDPOINT}.`
  );

  try {
    const completion = await customOpenai.chat.completions.create({
      model: process.env.OPENAI_MODEL_NAME!,
      temperature: processedBody.temperature,
      frequency_penalty: processedBody.frequencyPenalty,
      presence_penalty: processedBody.presencePenalty,
      top_p: processedBody.topP,
      max_tokens: processedBody.maxNumberOfTokens,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    SHOULD_SHOW_ALL_LOGS &&
      console.log("Response from local OpenAI-compatible endpoint:", completion);

    const text = completion.choices[0].message.content;
    const output = parseTextResponse(text);

    if (!res) return output;

    res.status(STATUS_CODE.Ok).json({ result: output });
  } catch (error: any) {
    const errorMessage = extractErrorMessage(error);
    console.error("Error from localOpenai:", errorMessage);
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: { message: errorMessage } });
  }
};
